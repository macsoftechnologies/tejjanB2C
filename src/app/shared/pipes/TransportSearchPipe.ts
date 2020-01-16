import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "TransportNameFilter"
})
export class TransportSearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;
    console.log("transport filter");
    args = args.toLowerCase();

    return value.filter(function(item) {
      return JSON.stringify(item.companyName)
        .toLowerCase()
        .includes(args);
    });
  }
}
