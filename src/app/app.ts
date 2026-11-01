
import { Component } from '@angular/core';
import { TeamMember } from './team-member';
import { FormsModule } from '@angular/forms';
import { TeamCardComponent } from './team-card/team-card.component';
import { interval, map } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FilterByNamePipe } from './filter-by-name-pipe';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TeamCardComponent, FormsModule, DatePipe,AsyncPipe, FilterByNamePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  dateFormat: string = 'dd MMM yyyy';
  searchTerm = '';
  team: TeamMember[] = [
    {
       id: 1,
      name: 'Meera Joshi',
      job: 'Founder and Sales Head',
      covers: 'Everything',
      joinedOn: new Date('2019-04-15T00:00:00'),
monthlyBonus: 25000.5,
targetAchieved: 0.92,
bio: 'Started Sweet Crumbs in 2019 and still tastes every new recipe before it reaches the shelves.',
    },
    {
      id: 2,
      name: 'Anil Verma',
      job: 'Sales Rep',
      covers: 'Northfield',
      joinedOn: new Date('2022-08-01T00:00:00'),
monthlyBonus: 12500,
targetAchieved: 0.78,
bio: 'Looks after every bakery and cafe in Northfield and never forgets a standing order.',
    },
    {
      id: 3,
      name: 'Sara Khan',
      job: 'Sales Rep',
      covers: 'Southbay',
      joinedOn: new Date('2023-02-20T00:00:00'),
monthlyBonus: 15750.75,
targetAchieved: 1.05,
bio: 'Opened the Southbay market and loves a tough negotiation over a bulk cake order.',
    },
    {
      id: 4,
      name: 'Ravi Nair',
      job: 'Customer Support',
      covers: 'Complaints from both towns',
      joinedOn: new Date('2024-06-10T00:00:00'),
monthlyBonus: 8200.25,
targetAchieved: 0.86,
bio: 'Turns upset customers into regulars, one resolved complaint at a time.',
    }
  ];

  selectedId: number | null = null;
  favoriteId: number | null = null;
 message = '';
  get selectedMember(): TeamMember | undefined {
    return this.team.find(member => member.id === this.selectedId);
  }

  get favoriteMember(): TeamMember | undefined {
    return this.team.find(member => member.id === this.favoriteId);
  }

 selectMember(member: TeamMember): void {
  this.selectedId = member.id;
  this.message = '';
}

  setFavorite(member: TeamMember): void {
    this.favoriteId = member.id;
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

  this.team = this.team.map(member => {
    if (member.id === this.selectedId) {
      return {
        ...member,
        name: newName.trim()
      };
    }

    return member;
  });

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

  this.team = this.team.map(member => {
    if (member.id === this.selectedId) {
      return {
        ...member,
        job: newJob.trim()
      };
    }

    return member;
  });

  this.message = '';
}

lastUpdated$ = interval(1000).pipe(
  map(() => new Date())
);


addTeamMember(): void {
  const newPerson: TeamMember = {
    id: Math.max(0, ...this.team.map(member => member.id)) + 1,
    name: 'New Team Member',
    job: 'Sales Rep',
    covers: 'Westfield',
    joinedOn: new Date(),
    monthlyBonus: 10000,
    targetAchieved: 0.75,
    bio: 'A new team member joining Sweet Crumbs.'
  };

  // Create a new array reference so the pure pipe detects the change.
this.team = [...this.team, newPerson];
}

}
