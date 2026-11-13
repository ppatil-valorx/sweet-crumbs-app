
import { Injectable } from '@angular/core';
import { TeamMember } from '../team-member';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private team: TeamMember[] = [
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

  getAll(): TeamMember[] {
    return this.team;
  }

  update(updatedMember: TeamMember): void {
    this.team = this.team.map(member =>
      member.id === updatedMember.id
        ? { ...updatedMember }
        : member
    );
  }
}
