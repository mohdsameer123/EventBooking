// custom-date-time.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDateTime'
})
export class CustomDateTimePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: Date | string | number): string | null {
    if (!value) {
      return null;
    }
    const formattedDate = this.datePipe.transform(value, 'MMMM d, y');
    const formattedTime = this.datePipe.transform(value, 'h:mm:ss a');
    return `Date & Time : ${formattedDate} | ${formattedTime}`;
  }
}
