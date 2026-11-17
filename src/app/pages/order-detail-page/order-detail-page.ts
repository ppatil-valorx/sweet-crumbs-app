import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './order-detail-page.html',
  styleUrl: './order-detail-page.scss'
})
export class OrderDetailPage {
  @Input() order!: Order;

  get nextOrderNumber(): string | null {
    const match = this.order.orderNumber.match(/^(.*?)(\d+)$/);
    if (!match) {
      return null;
    }

    return `${match[1]}${String(Number(match[2]) + 1).padStart(match[2].length, '0')}`;
  }
}
