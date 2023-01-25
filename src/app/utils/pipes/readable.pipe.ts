import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readable'
})
export class ReadablePipe implements PipeTransform {

  transform(value: string): string {
    return value.split('_').map(part => part[0].toUpperCase() + part.slice(1).toLowerCase()).join(' ');
  }

}
