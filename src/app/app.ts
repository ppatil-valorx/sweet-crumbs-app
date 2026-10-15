
import { Component } from '@angular/core';
import { TeamCard } from './team-card/team-card';
import { TeamMember } from './team-member';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TeamCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  team: TeamMember[] = [
    {
      id: 1,
      name: 'Meera Joshi',
      job: 'Founder and Sales Head',
      covers: 'Everything'
    },
    {
      id: 2,
      name: 'Anil Verma',
      job: 'Sales Rep',
      covers: 'Northfield'
    },
    {
      id: 3,
      name: 'Sara Khan',
      job: 'Sales Rep',
      covers: 'Southbay'
    },
    {
      id: 4,
      name: 'Ravi Nair',
      job: 'Customer Support',
      covers: 'Complaints from both towns'
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

searchTerm = '';

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
