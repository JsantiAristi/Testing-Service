import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonComponent } from './person.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Person } from 'src/app/models/person.model';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonComponent]
    });
    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shouls the name be "nicolas"', () => {
    //Hacemos la alución del Input()
    component.person = new Person('Nicolas','Molina',28,89,1.4);
    expect(component.person.name).toEqual('Nicolas')
  })

  it('should have <p> with "Mi altura es <altura>"', () => {
    component.person = new Person('Nicolas','Molina',28,89,1.4);
    const expectedMsg = `Mi altura es ${component.person.heigth}`
    const personDebug: DebugElement = fixture.debugElement;
    const pDebug: DebugElement = personDebug.query(By.css('p'));
    const pElement: HTMLElement = pDebug.nativeElement;

    //Hacemos la detección de cambios
    fixture.detectChanges();

    expect(pElement?.textContent).toEqual(expectedMsg)
  })

  it('should have <p> with "Mi altura es <altura>"', () => {
    component.person = new Person('Nicolas','Molina',28,89,1.4);
    const expectedMsg = `Mi altura es ${component.person.heigth}`
    const personDebug: DebugElement = fixture.debugElement;
    const pDebug: DebugElement = personDebug.query(By.css('p'));
    const pElement: HTMLElement = pDebug.nativeElement;

    //Hacemos la detección de cambios
    fixture.detectChanges();

    expect(pElement?.textContent).toContain(component.person.heigth)
  })

  it('should display a text with IMC when call calcIMC', () => {
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65);
    const expectedMsg = 'overweigth level 3';
    const button: HTMLElement = fixture.debugElement.query(By.css('button.btn-imc')).nativeElement;

    component.calcIMC();
    fixture.detectChanges();

    expect(button.textContent).toContain(expectedMsg);
  });

  it('should display a text with IMC when do click', () => {
    // Arrange
    const expectedMsg = 'overweigth level 3';
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65); // overweight level 3
    const buttonDe = fixture.debugElement.query(By.css('button.btn-imc'));
    const buttonEl = buttonDe.nativeElement;
    // Act
    buttonDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(buttonEl.textContent).toContain(expectedMsg);
  });

  it('should raise selected event when do click' ,() => {
    //Arrange
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65);
    const buttonDe = fixture.debugElement.query(By.css('button.btn-choose'));
    let selectedPerson: Person | undefined;
    component.onSelected.subscribe(person => {
      selectedPerson = person
    })
    //Act
    buttonDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    //Assert
    expect(selectedPerson).toEqual(component.person)
  })
});

// Creamos un Host, su unica utilidad es solo llamar a person Component
@Component({
  template:`<app-person [person]="person" (onSelected)="onSelected($event)"></app-person>`
})
class HostComponent {
  person = new Person('Santi','Molina',12,40,1.5);
  selectedPerson: Person | undefined;

  onSelected(person: Person){
    this.selectedPerson = person
  }
}

describe('PersonComponent from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostComponent, PersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display person name', () => {
    // Arrange
    const expectName = component.person.name;
    const h3De = fixture.debugElement.query(By.css('app-person h3'));
    const h3El = h3De.nativeElement;
    // Act
    fixture.detectChanges();
    // Assert
    expect(h3El.textContent).toContain(expectName);
  });

  it('should raise selected event when do click', () => {
    // Arrange
    const btnDe = fixture.debugElement.query(By.css('app-person .btn-choose'));
    // Act
    btnDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(component.selectedPerson).toEqual(component.person);
  })
})
