import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleComponent } from './people.component';
import { PersonComponent } from '../person/person.component';
import { Person } from 'src/app/models/person.model';
import { By } from '@angular/platform-browser';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeopleComponent, PersonComponent]
    });
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of app-person', () => {
    component.people = [
      new Person('nicolas', 'molina', 23, 55, 1.59),
      new Person('valentina', 'molina', 30, 80, 1.69)
    ];
    //Act
    fixture.detectChanges();
    const debugElement = fixture.debugElement.queryAll(By.css('app-person'));
    //Assert
    expect(debugElement.length).toEqual(2)
  })

  it('should raise selected event when clicked', () => {
    // Arrange
    const buttonDe = fixture.debugElement.query(By.css('app-person .btn-choose'));

    // Act
    buttonDe.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Assert
    expect(component.selectedPerson).toEqual(component.people[0])
  });

  it('should render selectedPerson', () => {
    // Arrange
    const buttonDe = fixture.debugElement.query(By.css('app-person .btn-choose'));

    // Act
    buttonDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    const liDebug = fixture.debugElement.query(By.css('.selectedPerson ul > li'));

    // Assert
    expect(component.selectedPerson).toEqual(component.people[0]);
    expect(liDebug.nativeElement.textContent).toContain(component.selectedPerson?.name);
  });

  it('should show a selected person when clicked', () => {
    // Arrange
    const personList = [
      new Person('Peter', 'Parker', 24, 70, 1.7),
      new Person('Armando', 'Rivera', 24, 80, 1.8),
      new Person('Bruce', 'Wayne', 24, 80, 1.8),
    ];
    component.people = personList;

    // Act
    fixture.detectChanges();
    const debugButtonList = fixture.debugElement.queryAll(
      By.css('app-person .btn-choose')
    );

    debugButtonList[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    const debugPersonSelectedInfo = fixture.debugElement.queryAll(
      By.css('.selectedPerson ul li')
    );

    // Assert

    expect(debugPersonSelectedInfo[0].nativeElement.textContent).toContain(
      personList[0].name
    );
    expect(debugPersonSelectedInfo[1].nativeElement.textContent).toContain(
      personList[0].age
    );
  });

});
