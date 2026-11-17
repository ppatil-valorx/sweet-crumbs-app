
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { ActivityLogService } from '../../services/activity-log';

@Component({
  selector: 'app-enquiry-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './enquiry-page.html',
  styleUrl: './enquiry-page.scss'
})
export class EnquiryPage {

  activityLog = inject(ActivityLogService);

  enquiry = {
    name: '',
    email: '',
    message: ''
  };

  enquiryThankYou = false;

  submitEnquiry(form: NgForm): void {

    if (form.invalid) {
      return;
    }

    this.activityLog.add(
      `Enquiry received from ${this.enquiry.name}`
    );

    this.enquiryThankYou = true;

    console.log('Name:', form.value.name);
    console.log('Email:', form.value.email);
    console.log('Message:', form.value.message);

    form.resetForm({
      name: '',
      email: '',
      message: ''
    });

  }

}
