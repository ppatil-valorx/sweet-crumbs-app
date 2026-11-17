
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TeamCard } from '../../team-card/team-card';
import { TeamMember } from '../../team-member';

import { TeamService } from '../../services/team';
import { ActivityLogService } from '../../services/activity-log';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TeamCard
  ],
  templateUrl: './team-page.html',
  styleUrl: './team-page.scss'
})
export class TeamPage {

  private teamService = inject(TeamService);
  private orderService = inject(OrderService);

  activityLog = inject(ActivityLogService);

  // Team data
  team: TeamMember[] = this.teamService.getAll();

  selectedId: number | null = null;
  favoriteId: number | null = null;

  message = '';
  teamSearchTerm = '';

  // Selected team member
  get selectedMember(): TeamMember | undefined {
    return this.team.find(member => member.id === this.selectedId);
  }

  // Favorite team member
  get favoriteMember(): TeamMember | undefined {
    return this.team.find(member => member.id === this.favoriteId);
  }

  // Filter team members
  get filteredTeam(): TeamMember[] {
    const query = this.teamSearchTerm.trim().toLowerCase();

    return this.team.filter(member =>
      member.name.toLowerCase().includes(query)
    );
  }

  // Select a team member
  selectMember(member: TeamMember): void {
    this.selectedId = member.id;
    this.message = '';

    this.activityLog.add(`Card selected: ${member.name}`);
  }

  // Set favorite team member
  setFavorite(member: TeamMember): void {
    this.favoriteId = member.id;
  }

  // Change selected member's name
  changeName(): void {

    if (this.selectedId === null) {
      this.message = 'Select a card first.';
      return;
    }

    const newName = prompt('Enter the new name:');

    if (newName === null || newName.trim() === '') {
      return;
    }

    const updatedMember: TeamMember = {
      ...this.selectedMember!,
      name: newName.trim()
    };

    this.teamService.update(updatedMember);
    this.team = this.teamService.getAll();

    this.activityLog.add(`Name updated: ${updatedMember.name}`);

    this.message = '';
  }

  // Change selected member's job
  changeJob(): void {

    if (this.selectedId === null) {
      this.message = 'Select a card first.';
      return;
    }

    const newJob = prompt('Enter the new job:');

    if (newJob === null || newJob.trim() === '') {
      return;
    }

    const updatedMember: TeamMember = {
      ...this.selectedMember!,
      job: newJob.trim()
    };

    this.teamService.update(updatedMember);
    this.team = this.teamService.getAll();

    this.activityLog.add(
      `Job updated: ${updatedMember.name} — ${updatedMember.job}`
    );

    this.message = '';
  }

  // Track cards using their unique IDs
  trackByMemberId(index: number, member: TeamMember): number {
    return member.id;
  }

  // Search team members
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.teamSearchTerm = input.value;
  }

  // Test the HTTP error interceptor
  testErrorInterceptor(): void {

    const invalidOrder = {
      accountName: 'Interceptor Test',
      flavour: 'Vanilla' as const,
      sizeKg: 1,
      deliveryDate: '2026-11-20',
      deliveryTown: 'Southbay' as const,
      status: 'Delivered' as const
    };

    this.orderService.add(invalidOrder).subscribe({
      next: (response) => {
        console.log('Unexpected success:', response);
      },

      error: (error) => {
        console.log('Original HTTP error:', error);
        console.log('Friendly message:', error.friendlyMessage);
        console.log('Backend message:', error.error?.message);
        console.log(
          'Field validation:',
          error.error?.errors?.[0]?.message
        );
      }
    });
  }
}
