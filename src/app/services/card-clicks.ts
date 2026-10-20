
import { Injectable } from '@angular/core';

// Normal setup: TeamCardComponent's own injector creates
// a separate CardClicksService instance for each card.
@Injectable()
export class CardClicksService {
  count = 0;

  increment(): void {
    this.count++;
  }
}
