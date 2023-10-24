import { Component } from '@angular/core';
import { Person } from 'src/app/models/person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {

  person: Person = new Person('Name', 'LastName', 30, 80, 1.69);
  selectedPerson: Person | null = null;

  people: Person[] = [
    new Person('nicolas', 'molina', 23, 55, 1.59),
    new Person('valentina', 'molina', 30, 80, 1.69)
  ]

  choose(person:Person){
    this.selectedPerson = person;
  }

}
