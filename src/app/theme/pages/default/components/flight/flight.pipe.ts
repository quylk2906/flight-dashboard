import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'formatDatePipe' })
export class formatDatePipe implements PipeTransform {
   transform(value: string): string {
      const now = new Date(value)
      return now.toString()
   }
}