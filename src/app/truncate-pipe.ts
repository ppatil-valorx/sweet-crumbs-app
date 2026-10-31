import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(
    text: string | null | undefined,
    limit: number = 60,
    trail: string = '...'
  ): string {

    // Handle null and undefined
    if (text == null) {
      return '';
    }

    // Return short text unchanged
    if (text.length <= limit) {
      return text;
    }

    // Truncate long text and append the trail
    return text.slice(0, limit) + trail;
  }
}