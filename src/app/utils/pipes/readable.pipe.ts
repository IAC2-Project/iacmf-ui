import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readable'
})
export class ReadablePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
