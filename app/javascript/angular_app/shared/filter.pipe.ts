import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterPipe',
})

export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( x => x.network.name.toLowerCase().includes(searchText) || 
      x.network.abbrev.toLowerCase().includes(searchText) ||
      x.program.name.toLowerCase().includes(searchText) ||
      x.program.abbrev.toLowerCase().includes(searchText)
    )
  }
}