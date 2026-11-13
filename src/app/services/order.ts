
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Order } from '../models/order';
import { APP_CONFIG } from '../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  private apiUrl = `${this.config.apiBaseUrl}/orders`;

  getAll(q: string = '', town: string = ''): Observable<Order[]> {
    let params = new HttpParams();

    if (q.trim()) {
      params = params.set('q', q.trim());
    }

    if (town) {
      params = params.set('town', town);
    }

    return this.http.get<Order[]>(this.apiUrl, { params });
  }

  add(
    order: Omit<Order, 'id' | 'orderNumber' | 'bigOrder' | 'webReference'>
  ): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateStatus(
    id: string,
    status: Order['status']
  ): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiUrl}/${id}`,
      { status }
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
