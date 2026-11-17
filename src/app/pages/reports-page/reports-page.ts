import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Order, OrderStatus } from '../../models/order';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.scss'
})
export class ReportsPage implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  readonly statuses: OrderStatus[] = [
    'New',
    'Baking',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  orders: Order[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.orderService.getAll().subscribe({
      next: orders => {
        this.orders = orders;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error loading order reports:', error);
        this.error = 'Unable to load reports. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  countByStatus(status: OrderStatus): number {
    return this.orders.filter(order => order.status === status).length;
  }

  get bigOrderCount(): number {
    return this.orders.filter(order => order.bigOrder).length;
  }

  get totalPricedValue(): number {
    return this.orders.reduce(
      (total, order) => total + (order.price ?? 0),
      0
    );
  }
}
