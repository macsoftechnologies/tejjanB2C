import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';

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

@Component({
  selector: "app-hotel-details",
  templateUrl: "./hotel-details.component.html",
  styleUrls: ["./hotel-details.component.scss"]
})
export class HotelDetailsComponent implements OnInit {
  zoom = 14
  public issessionexpired: boolean = true;
  public isFirstLoad: boolean = true;
  public isroomGroups: boolean
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
  public numberOfNights = 0;
  public taxAmount = 0;
  public feeAmount = 0;
  public items: GalleryItem[];
  public imageData = data;
  public saudiPhoneCode: any;
  public hotelPhone: any;
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
   console.log(JSON.stringify(this.selectedHotel));
    // this.saudiPhoneCode = this.selectedHotel.phone.substring(0, 3);
    // this.hotelPhone = this.selectedHotel.phone.substring(3);
    /* calculating adult and child count in rooms to display in UI */
    this.selectedHotel.roomGroups.forEach(roomGroup => {
      roomGroup.rooms.forEach(room => {
        let adultCount = 0;
        let childCount = 0;

        /* counting adult and child count in rooms */
        room.paxInfo.forEach(paxInfo => {
          if (paxInfo.type === "ADT")
            adultCount = adultCount + paxInfo.quantity;
          else if (paxInfo.type === "CHD")
            childCount = childCount + paxInfo.quantity;
        });
        room["adultsCount"] = new Array(adultCount);
        room["childCount"] = new Array(childCount);

        /* adding GDS and OTA TAXES  */
      /*   room.displayRateInfo.forEach(displayRate => {
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
        });
 */
      });
    });
    // console.log(JSON.stringify(this.selectedHotel));

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

    this.getHotelPolicies();
  }


  /* preparing hotel availability Request Object */
  public getHotelPolicies() {
    var roomGroupsObject = {
      "policies": this.selectedHotel.roomGroups[0].policies,
      "groupId": this.selectedHotel.roomGroups[0].groupId,
      "groupAmount": this.selectedHotel.roomGroups[0].groupAmount,
      "type": this.selectedHotel.roomGroups[0].type,
      "hasSpecialDeal": this.selectedHotel.roomGroups[0].hasSpecialDeal,
      "tpExtensions": this.selectedHotel.roomGroups[0].tpExtensions,
      "paxInfo": this.selectedHotel.roomGroups[0].paxInfo,
      "rooms": [this.selectedHotel.roomGroups[0].rooms[0]],
      "config": this.selectedHotel.roomGroups[0].config,
      "flags": this.selectedHotel.roomGroups[0].flags,
    }
    var CountryCode = this.searchDate.request.providerLocations[0].countryCode
    var locationCode = this.searchDate.request.providerLocations[0].locationCode

    this.hotelAvailabilityReq = {
      "context": {
        "cultureCode": this.searchDate.context.cultureCode,
        "providerInfo": [
          {
            "provider": this.selectedHotel.provider,
            "pcc": "1004",
            "subpcc": ""
          }
        ]
      },
      "request": {
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
        "tpExtensions": this.selectedHotel.tpExtensions,
        "roomGroups": [roomGroupsObject]
      }
    }
    this.hotelPolicies();
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


        if (hotelsavailabilityresp.body.roomGroups != undefined) {

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
          this.saudiPhoneCode = this.currentHotelAvailability.phone.substring(0, 3);
          this.hotelPhone = this.currentHotelAvailability.phone.substring(3);
        } else {
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


  /* check room availability */
  public onRoomAvailability(selectedHotel, currentRoom): void {
    console.log("currentRoomm", JSON.stringify(currentRoom));
    console.log("selectedHotel", JSON.stringify(selectedHotel));
    console.log("no of rooms", this.searchFilter.rooms);
    let roomGroupArry = [];
    let tempSelectedRoomGroups = selectedHotel.roomGroups;
    if (this.selectedHotel.roomGroups.length == 1) {
      let rooms = [];
      for (let i = 0; i < this.searchFilter.rooms; i++) {
        let roomObj = currentRoom;
        roomObj["quantity"] = 1;
        roomObj["sequenceNumber"] = i;
        delete roomObj["adultsCount"];
        delete roomObj["childCount"];
        rooms.push(roomObj);
      }
      var roomGroupsObject = {
        "policies": this.selectedHotel.roomGroups[0].policies,
        "groupId": this.selectedHotel.roomGroups[0].groupId,
        "groupAmount": this.selectedHotel.roomGroups[0].groupAmount,
        "type": this.selectedHotel.roomGroups[0].type,
        "hasSpecialDeal": this.selectedHotel.roomGroups[0].hasSpecialDeal,
        "tpExtensions": this.selectedHotel.roomGroups[0].tpExtensions,
        "paxInfo": this.selectedHotel.roomGroups[0].paxInfo,
        "rooms": rooms,
        "config": this.selectedHotel.roomGroups[0].config,
        "flags": this.selectedHotel.roomGroups[0].flags,
      }
      roomGroupArry.push(roomGroupsObject);
    } else if (this.selectedHotel.roomGroups.length > 1) {
      this.selectedHotel.roomGroups.forEach(roomGroup => {
        let rooms = [];
        roomGroup.rooms.forEach(room => {
          if (room.name === currentRoom.name) {
            delete room["adultsCount"];
            delete room["childCount"];
            rooms.push(room);
          }
        });
        // roomGroup["rooms"] = rooms;
        var roomGroupsObject = {
          "policies": this.selectedHotel.roomGroups[0].policies,
          "groupId": this.selectedHotel.roomGroups[0].groupId,
          "groupAmount": this.selectedHotel.roomGroups[0].groupAmount,
          "type": this.selectedHotel.roomGroups[0].type,
          "hasSpecialDeal": this.selectedHotel.roomGroups[0].hasSpecialDeal,
          "tpExtensions": this.selectedHotel.roomGroups[0].tpExtensions,
          "paxInfo": this.selectedHotel.roomGroups[0].paxInfo,
          "rooms": rooms,
          "config": this.selectedHotel.roomGroups[0].config,
          "flags": this.selectedHotel.roomGroups[0].flags,
        }
        roomGroupArry.push(roomGroupsObject);
      });
    }

    let roomAvailabilityObj = {
      "context": {
        "cultureCode": this.searchDate.context.cultureCode,
        "providerInfo": [
          {
            "provider": this.selectedHotel.provider,
            "pcc": "1004",
            "subpcc": ""
          }
        ]
      },
      "request": {
        // "nationality":  this.searchFilter.nationality.countryCode,
        "code": this.selectedHotel.code,
        "name": this.selectedHotel.name,
        "countryCode": this.searchDate.request.providerLocations[0].countryCode,
        "locationCode": this.searchDate.request.providerLocations[0].locationCode,
        "locationName": this.searchDate.request.locationName,
        "status": this.selectedHotel.status,
        "vendor": this.selectedHotel.vendor,
        "provider": this.selectedHotel.provider,
        "checkInDate": this.searchDate.request.checkInDate,
        "checkOutDate": this.searchDate.request.checkOutDate,
        "config": this.selectedHotel.config,
        // "policies": this.selectedHotel.policies,
        "tpExtensions": this.selectedHotel.tpExtensions,
        "roomGroups": roomGroupArry
      }
    }

    console.log("room availability request---->", JSON.stringify(roomAvailabilityObj));
    this.spinner.show();
    this.teejanServices.getHotelAvailability(roomAvailabilityObj).subscribe(
      hotelsavailabilityresp => {
        console.log("hotelAvailabilty resp---->", JSON.stringify(hotelsavailabilityresp));
        localStorage.setItem("hotelcart", JSON.stringify(hotelsavailabilityresp));

        if (hotelsavailabilityresp.body.roomGroups != undefined) {
          hotelsavailabilityresp.body["name"]= this.selectedHotel.name;
          this.spinner.hide();
          localStorage.setItem('hotelAvailabilityTracktoken', hotelsavailabilityresp.headers.get('tracktoken'))
          localStorage.setItem("hotelAvailability", JSON.stringify(hotelsavailabilityresp.body))
          localStorage.setItem("hotelcart", JSON.stringify(hotelsavailabilityresp.body));
          this.router.navigateByUrl("b2c/transport");
        }
      });

  }
  /* /check room availability */

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
  backToHotelList() {
    this.router.navigateByUrl("b2b/hotellist")
  }

}


