import { Pipe, PipeTransform } from '@angular/core';
import { TeamMember } from './team-member';

@Pipe({
  name: 'filterByName',
  standalone: true
})
export class FilterByNamePipe implements PipeTransform {

  transform(
    team: TeamMember[] | null | undefined,
    searchTerm: string = ''
  ): TeamMember[] {

    console.log('filter ran');

    if (!team) {
      return [];
    }

    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return team;
    }

    return team.filter(member =>
      member.name.toLowerCase().includes(search)
    );
  }
}