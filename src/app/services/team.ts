
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
