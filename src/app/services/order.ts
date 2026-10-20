import { Injectable, inject } from '@angular/core';
import { Order } from '../models/order';
import { ActivityLogService } from './activity-log';
import { APP_CONFIG, AppConfig } from '../config/app-config';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private activityLog = inject(ActivityLogService);
    private config = inject(APP_CONFIG);
    private orders: Order[] = [
        {
            orderNumber: 'SCO-0001',
            accountName: 'Hotel Bluebell',
            flavour: 'Chocolate',
            sizeKg: 2,
            deliveryDate: '2026-10-20',
            deliveryTown: 'Northfield',
            status: 'New',
            price: 1800,
            bigOrder: false
        },
        {
            orderNumber: 'SCO-0002',
            accountName: 'Sunrise School',
            flavour: 'Red Velvet',
            sizeKg: 3.5,
            deliveryDate: '2026-10-22',
            deliveryTown: 'Southbay',
            status: 'Baking',
            price: 2900,
            bigOrder: false
        },
        {
            orderNumber: 'SCO-0003',
            accountName: 'TechPark Cafe',
            flavour: 'Vanilla',
            sizeKg: 1,
            deliveryDate: '2026-10-19',
            deliveryTown: 'Northfield',
            status: 'New',
            price: 950,
            bigOrder: false
        },
        {
            orderNumber: 'SCO-0004',
            accountName: 'Harbour Gym',
            flavour: 'Butterscotch',
            sizeKg: 6,
            deliveryDate: '2026-10-25',
            deliveryTown: 'Southbay',
            status: 'New',
            price: 4200,
            bigOrder: true
        },
        {
            orderNumber: 'SCO-0005',
            accountName: 'Hotel Bluebell',
            flavour: 'Chocolate',
            sizeKg: 5,
            deliveryDate: '2026-10-18',
            deliveryTown: 'Northfield',
            status: 'Out for Delivery',
            price: 3600,
            bigOrder: true
        }
    ];

    constructor() {
        this.orders = this.orders.map(order => ({
            ...order,
            bigOrder: order.sizeKg >= this.config.bigOrderKg
        }));
    }

    getAll(): Order[] {
        return this.orders;
    }

    add(
        order: Omit<Order, 'orderNumber' | 'bigOrder'>
    ): Order {
        const nextNumber = this.orders.length + 1;

        const newOrder: Order = {
            ...order,
            orderNumber: `SCO-${String(nextNumber).padStart(4, '0')}`,
            bigOrder: order.sizeKg >= this.config.bigOrderKg
        };

        this.orders = [...this.orders, newOrder];

        this.activityLog.add(
            `Order ${newOrder.orderNumber} added`
        );

        return newOrder;
    }
}