import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "NameFilter"
})
export class HotelSearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    console.log(args)

    return value.filter(function(item) {
      return JSON.stringify(item.name)
        .toLowerCase()
        .includes(args);
    });
  }
}
