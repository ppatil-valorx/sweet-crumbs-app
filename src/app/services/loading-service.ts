import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private requestCount = signal(0);

  isLoading = signal(false);

  startLoading(): void {
    this.requestCount.update(count => count + 1);
    this.isLoading.set(this.requestCount() > 0);
  }

  stopLoading(): void {
    this.requestCount.update(count => Math.max(0, count - 1));
    this.isLoading.set(this.requestCount() > 0);
  }
}