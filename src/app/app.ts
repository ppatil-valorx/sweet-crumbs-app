
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamCard } from './team-card/team-card';
import { TeamMember } from './team-member';
import { TeamService } from './services/team';
import { ActivityLogService } from './services/activity-log';
import { OrderService } from './services/order';
import { Order } from './models/order';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TeamCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private teamService = inject(TeamService);
  private orderService = inject(OrderService);
  activityLog = inject(ActivityLogService);

  team: TeamMember[] = this.teamService.getAll();

  selectedId: number | null = null;
  favoriteId: number | null = null;
  message = '';
  searchTerm = '';

  get selectedMember(): TeamMember | undefined {
    return this.team.find(member => member.id === this.selectedId);
  }

  get favoriteMember(): TeamMember | undefined {
    return this.team.find(member => member.id === this.favoriteId);
  }

  get orders(): Order[] {
    return this.orderService.getAll();
  }

  setFavorite(member: TeamMember): void {
    this.favoriteId = member.id;
  }

  selectMember(member: TeamMember): void {
    this.selectedId = member.id;
    this.message = '';
    this.activityLog.add(`Card selected: ${member.name}`);
  }

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

  trackByMemberId(index: number, member: TeamMember): number {
    return member.id;
  }

  get filteredTeam(): TeamMember[] {
    const query = this.searchTerm.trim().toLowerCase();

    return this.team.filter(member =>
      member.name.toLowerCase().includes(query)
    );
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }
}
