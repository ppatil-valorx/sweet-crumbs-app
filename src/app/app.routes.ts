
import { Routes } from '@angular/router';

import { TeamPage } from './pages/team-page/team-page';
import { OrdersPage } from './pages/orders-page/orders-page';
import { NewOrderPage } from './pages/new-order-page/new-order-page';
import { EnquiryPage } from './pages/enquiry-page/enquiry-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { OrderDetailPage } from './pages/order-detail-page/order-detail-page';
import { OrderBakeTab } from './pages/order-bake-tab/order-bake-tab';
import { OrderDeliveryTab } from './pages/order-delivery-tab/order-delivery-tab';
import { LoginPage } from './pages/login-page/login-page';
import { staffGuard } from './guards/staff.guard';
import { unsavedOrderGuard } from './guards/unsaved-order.guard';
import { orderResolver } from './resolvers/order.resolver';
import { ownerGuard } from './guards/owner.guard';

export const routes: Routes = [

  // Default route: redirect to Team
  {
    path: '',
    redirectTo: 'team',
    pathMatch: 'full'
  },

  // Team page
  {
    path: 'team',
    component: TeamPage,
    title: 'Team | Sweet Crumbs'
  },

  // Orders page
  {
    path: 'orders',
    component: OrdersPage,
    title: 'Orders | Sweet Crumbs'
  },

  // New order page
  {
    path: 'orders/new',
    component: NewOrderPage,
    canActivate: [staffGuard],
    canDeactivate: [unsavedOrderGuard],
    title: 'New Order | Sweet Crumbs'
  },

  // One order
  {
    path: 'orders/:orderNumber',
    component: OrderDetailPage,
    resolve: { order: orderResolver },
    title: 'Order Details | Sweet Crumbs',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'bake'
      },
      {
        path: 'bake',
        component: OrderBakeTab,
        title: 'What to Bake | Sweet Crumbs'
      },
      {
        path: 'delivery',
        component: OrderDeliveryTab,
        title: 'Delivery | Sweet Crumbs'
      }
    ]
  },

  // Customer enquiry page
  {
    path: 'enquiry',
    component: EnquiryPage,
    title: 'Enquiry | Sweet Crumbs'
  },

  {
    path: 'login',
    component: LoginPage,
    title: 'Login | Sweet Crumbs'
  },

  {
    path: 'reports',
    canMatch: [ownerGuard],
    loadComponent: () =>
      import('./pages/reports-page/reports-page').then(module => module.ReportsPage),
    title: 'Reports | Sweet Crumbs'
  },

  {
    path: 'not-found',
    component: NotFoundPage,
    title: 'Page Not Found | Sweet Crumbs'
  },

  // Page not found
  {
    path: '**',
    component: NotFoundPage,
    title: 'Page Not Found | Sweet Crumbs'
  }

];
