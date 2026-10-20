
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  messages: string[] = [];

  constructor() {
    const id = Math.random().toString(36).slice(2, 9);
    console.log(`ActivityLogService created: ${id}`);
  }

  add(message: string): void {
    this.messages.unshift(message);

    // Keep only the five most recent messages.
    this.messages = this.messages.slice(0, 5);
  }
}
