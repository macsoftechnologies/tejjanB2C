import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';

@Component({
  selector: "app-hotel-details",
  templateUrl: "./hotel-details.component.html",
  styleUrls: ["./hotel-details.component.scss"]
})




export class HotelDetailsComponent implements OnInit {
  zoom = 14
  public issessionexpired: boolean = true;
  public isFirstLoad: boolean = true;
  public isroomGroups:boolean 
  public selectedHotel: any = {};
  public searchDate: any = {};
  public searchFilter: any = {}
  public adults: boolean = false
  public child: boolean = false
  public searchLookUp: any;
  public hotelslistrespTrackToken: any;
  public hotelAvailabilityReq: any = {};
  public currentHotelAvailability: any = {};
  public currentHotelPolicies;
  public selectedRoomsList = []
  public roomgroupsrooms = [];
  public numberOfNights = 0
  public taxAmount = 0
  public feeAmount = 0
  
  items: GalleryItem[];
  imageData = data;
  saudiPhoneCode : any;
  hotelPhone : any;

  public travellerCount;
  constructor(private router: Router,
    private teejanServices: AlrajhiumrahService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.searchDate = JSON.parse(localStorage.getItem("searchObj"));
    this.searchFilter = JSON.parse(localStorage.getItem("searchFilterObj"))
    this.selectedHotel = JSON.parse(localStorage.getItem("currentHotel"));
    this.searchLookUp = JSON.parse(localStorage.getItem("searchLookUp"));
    this.hotelslistrespTrackToken = localStorage.getItem("hotelslistrespTrackToken");
    this.travellerCount = parseInt(this.searchFilter.adults_count) + parseInt(this.searchFilter.child_count);
    // this.adults_count = parseInt(this.searchFilter.adults_count)
    // this.child_count = parseInt(this.searchFilter.child_count)


    this.selectedHotel.amenities.forEach(element => {
      if (element.name.includes("Wifi")) {
        element["icon"] = "fa fa-wifi";
      } else if (element.name.includes("Towels")) {
        element["icon"] = "fa fa-bath";
      }
    });

    this.selectedHotelDeatils();
    // Creat gallery items
    this.items = this.imageData.map(item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));
    /** Lightbox Example */

    // Get a lightbox gallery ref
    const lightboxRef = this.gallery.ref('lightbox');

    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      // thumbPosition: ThumbnailsPosition.Top
    });

    // Load items into the lightbox gallery ref
    lightboxRef.load(this.items);
  }

  /* preparing hotel availability Request Object */
  public selectedHotelDeatils() {

    // for (let i = 0; i < this.selectedHotel.roomGroups.length; i++) {
    //   // delete this.selectedHotel.roomGroups[i].hasSpecialDeal
    //   // delete this.selectedHotel.roomGroups[i].tpExtensions

    //   let rooms = this.selectedHotel.roomGroups[i].rooms
    //   for (let j = 0; j < rooms.length; j++) {
    //     delete rooms[j].images
    //     delete rooms[j].description
    //     delete rooms[j].breakDownRateInfo
    //     delete rooms[j].features

    //     rooms[j]["roomCategory"] = "";
    //   }
    //   // delete this.selectedHotel.roomGroups[i].paxInfo

    // }

    var CountryCode = this.searchDate.request.providerLocations[0].countryCode
    var locationCode = this.searchDate.request.providerLocations[0].locationCode

    this.hotelAvailabilityReq = {
      "context": {
        "cultureCode": this.searchDate.context.cultureCode,
        "trackToken": this.hotelslistrespTrackToken,
        "providerInfo": [
          {
            "provider": this.selectedHotel.provider,
            "pcc" : "1004",
            "subpcc" : ""
          }
        ]
      },
      "request": {
        // "nationality":  this.searchFilter.nationality.countryCode,
        "code": this.selectedHotel.code,
        "name": this.selectedHotel.name,
        "countryCode": CountryCode,
        "locationCode": locationCode,
        "locationName": this.searchDate.request.locationName,
        "status": this.selectedHotel.status,
        "vendor": this.selectedHotel.vendor,
        "provider": this.selectedHotel.provider,
        "checkInDate": this.searchDate.request.checkInDate,
        "checkOutDate": this.searchDate.request.checkOutDate,
        "config": this.selectedHotel.config,
        // "policies": this.selectedHotel.policies,
        "tpExtensions": this.selectedHotel.tpExtensions,
        "roomGroups": [this.selectedHotel.roomGroups[0]]
      }
    }
    this.hotelPolicies();
    this.hotelAvailability();
  }
  /* /preparing hotel availability Request Object */


  /* Get hotel policies api call */
  public hotelPolicies(): void {
    this.teejanServices.getHotelPolicy(this.hotelAvailabilityReq).subscribe(
      hotelspoliciesresp => {
        // console.log(JSON.stringify(hotelspoliciesresp))
        this.isFirstLoad = false;
        this.currentHotelPolicies = hotelspoliciesresp;
      },
      err => { }
    );
  }
  /* /get hotel policies api call */

  /* Get hotel availability api call */
  public hotelAvailability(): void {

       this.spinner.show();

    this.teejanServices.getHotelAvailability(this.hotelAvailabilityReq).subscribe(
      hotelsavailabilityresp => {

         
        if(hotelsavailabilityresp.body.roomGroups != undefined ) {
           
          this.spinner.hide();

         this.isroomGroups = true
        localStorage.setItem('hotelAvailabilityTracktoken', hotelsavailabilityresp.headers.get('tracktoken'))
        localStorage.setItem("hotelAvailability", JSON.stringify(hotelsavailabilityresp.body))


        /* calculating numberOfNights */
        const checkInDate = new Date(this.searchDate.request.checkInDate);
        const checkOutDate = new Date(this.searchDate.request.checkOutDate);
        const timeDiff = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        this.numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        hotelsavailabilityresp.body["nights"] = this.numberOfNights
        hotelsavailabilityresp.body["latitude"] = this.selectedHotel.latitude
        hotelsavailabilityresp.body["longitude"] = this.selectedHotel.longitude


        if (parseInt(this.searchFilter.adults_count) > 0) {
          hotelsavailabilityresp.body["adults"] = Array(this.searchFilter.adults_count).fill(+0).map((i) => i + 1)
          this.adults = true
        } else {
          this.adults = false
        }

        if (parseInt(this.searchFilter.child_count) > 0) {
          hotelsavailabilityresp.body["childrens"] = Array(this.searchFilter.child_count).fill(+0).map((i) => i + 1)
          this.child = true
        } else {
          this.child = false
        }


        hotelsavailabilityresp.body.roomGroups[0].rooms.forEach(room => {

          /* adding GDS and OTA TAXES  */
          room.displayRateInfo.forEach(displayRate => {

            if (displayRate.purpose == "1") {

              let GDSobject = {
                amount: displayRate.amount / 100 * 7.5,
                purpose: "20",
                description: "GDSTAX",
                currencyCode: "SAR"

              }
              room.displayRateInfo.push(GDSobject);
              let OTAobject = {
                amount: displayRate.amount / 100 * 30,
                purpose: "30",
                description: "OTATAX",
                currencyCode: "SAR"

              }
              room.displayRateInfo.push(OTAobject);

              // calculating all taxes (OTA + GDS + VAT(TAX) + FEES) 
              if (displayRate.purpose == "7") {
                this.taxAmount = 0
                this.taxAmount = displayRate.amount
              }
              if (displayRate.purpose == "2") {
                this.feeAmount = 0
                this.feeAmount = displayRate.amount
              }

              let taxesObject = {
                amount: displayRate.amount / 100 * 30 + displayRate.amount / 100 * 7.5 + this.taxAmount + this.feeAmount,
                purpose: "40",
                description: "TAXES",
                currencyCode: "SAR"

              }
              room.displayRateInfo.push(taxesObject);

            }

          })

          console.log("availabilityCount", room.availabilityCount)
          // availabilityCount convert to Array
          room.availabilityCount = Array(room.availabilityCount).fill(+0).map((x, i) => i + 1)
        })

        this.currentHotelAvailability = hotelsavailabilityresp.body;
        this.saudiPhoneCode = this.currentHotelAvailability.phone.substring(0,3);
        this.hotelPhone = this.currentHotelAvailability.phone.substring(3,);
      }else{
        this.spinner.hide();
        this.isroomGroups = false
        setTimeout(() => {
          this.router.navigateByUrl("b2b/hotellist");
      }, 5000); 
      }
     
      }

    );

  }
  /* /get hotel availabilityapi call */

  /* preparing hotel cart with selected rooms */
  selectRoomQuantity(quantity, selecteRoomIdex, roomObj) {

    let room = {
      quantity: quantity,
      roomIndex: selecteRoomIdex,
      roomObject: roomObj
    }
    var index = this.selectedRoomsList.findIndex(room => room.roomIndex === selecteRoomIdex)
    if (index == -1) {
      // add new room in selectedRoomsList.
      this.selectedRoomsList.push(room);
    } else {
      // replace the room by index in selectedRoomsList.
      this.selectedRoomsList.splice(index, 1, room)
    }

    this.roomgroupsrooms = [];

    this.selectedRoomsList.forEach(element => {
      for (let i = 0; i < element.quantity; i++) {
        this.roomgroupsrooms.push(element.roomObject);
      }

    })
  }
  /* preparing hotel cart with selected rooms */


  /* naviagte to transport search */
  public onTransport(selectHotel): void {
    swal.fire({
      position: 'top-end',
      icon: 'success',
      width: '22em',
      title: 'Added to the cart',
      showConfirmButton: false,
      timer: 3000
    })
    let searchRoomQTY = this.searchDate.request.rooms.length
    if (this.roomgroupsrooms.length != searchRoomQTY) {
      // alert(`Please select ${searchRoomQTY} room(s). Room(s) should be selected as per number of Adults and Children staying in each room.`)


      swal.fire({
        title: `Please select ${searchRoomQTY} room(s). Room(s) should be selected as per number of Adults and Children staying in each room.`,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      })
    } else {
      selectHotel.roomGroups[0]["rooms"] = this.roomgroupsrooms
      localStorage.setItem("hotelcart", JSON.stringify(selectHotel));
      // this.router.navigateByUrl('b2b/transport')
      if ((document.location.href).toString().includes("b2b")) {
        this.router.navigateByUrl("b2b/transport");
      } else {
        this.router.navigateByUrl("b2c/transport");
      }

    }
  }
  /* naviagte to transport search */


  /* Displying skeleton layout for available rooms start */
  public generateFake(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
  /* skeleton layout end */

  /* navigate to hotelList */
  backToHotelList(){
    this.router.navigateByUrl("b2b/hotellist")
  }

}


const data = [
  {
    srcUrl: 'assets/search-bg.jpg',
    previewUrl: 'assets/search-bg.jpg'
  },
  {
    srcUrl: 'assets/search-bg.jpg',
    previewUrl: 'assets/search-bg.jpg'
  },
  {
    srcUrl: 'assets/search-bg.jpg',
    previewUrl: 'assets/search-bg.jpg'
  },
  {
    srcUrl: 'assets/search-bg.jpg',
    previewUrl: 'assets/search-bg.jpg'
  }
];

// var module = document.querySelector(".hoteldetails span");
// $clamp(module, {
//   clamp: 2
// });