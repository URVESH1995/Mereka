import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any[], searchString: string, columns: any[]) {
    if (!searchString) {
      return value
    }

    var data: any;
    return value.filter((it) => {
      for (let i = 0; i < columns.length; i++) {
        if (i == 0) {
          data = it[columns[i]].toLowerCase().includes(searchString.toLowerCase());
        } else {
          data = data + it[columns[i]].toLowerCase().includes(searchString.toLowerCase());
        }
      }
      return data;
    });
  }

}
