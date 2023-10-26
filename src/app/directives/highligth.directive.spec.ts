import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HighligthDirective } from './highligth.directive';
import { FormsModule } from '@angular/forms';

//Creamos el Host, ya que las directivas se prueban mejor así
@Component({
  template: `
  <h5 class="title" highligth>Hay un valor default</h5>
  <h5 highligth="yellow">Hay un valor</h5>
  <p  highligth="blue">parrafo</p>
  <p>otro parrafo</p>
  <input [(ngModel)]="color" [highligth]="color">`,
})

class HostComponent {
  color = 'pink';
}

describe('HighligthDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  //Declaramos la directiva
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostComponent, HighligthDirective ],
      imports: [FormsModule]
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

  it('should have 3 <p> with "highlight" class', () => {
    // Arrange
    const elements = fixture.debugElement.queryAll(By.directive(HighligthDirective));
    //Podemos hacer un código donde obtenga los que no tengan el atributo
    const elementsWithout = fixture.debugElement.queryAll(By.css('*:not([highligth])'));
    expect(elements.length).toBe(4);
    expect(elementsWithout.length).toBe(2);
  });

  it('should the elements be match with bgColor', () => {
    // Arrange
    //Obtenemos todos los elementos que tengan la directiva HighlighDirective
    const elements = fixture.debugElement.queryAll(By.directive(HighligthDirective));
    expect(elements[0].nativeElement.style.backgroundColor).toEqual('gray');
    expect(elements[1].nativeElement.style.backgroundColor).toEqual('yellow');
    expect(elements[2].nativeElement.style.backgroundColor).toEqual('blue');
  });

  it('should the h5.title be defaultColor', () => {
    const titleDe = fixture.debugElement.query(By.css('.title'));
    const dir = titleDe.injector.get(HighligthDirective);
    expect(titleDe.nativeElement.style.backgroundColor).toEqual(dir.defaultColor);
  });

  //Ng-model
  it('should bind <input> and change the bgColor', () => {
    const inputDe = fixture.debugElement.query(By.css('input'));
    //Obtenemos el elemento nativo
    const inputEl: HTMLInputElement = inputDe.nativeElement;
    //Estilo por default del ng-model es pink
    expect(inputEl.style.backgroundColor).toEqual('pink');
    //Cambiamos el valor
    inputEl.value = 'red';
    //Desplegamos el valor del elemento con un evento de cambio
    inputEl.dispatchEvent(new Event('input'));
    //Detección de cambios
    fixture.detectChanges();
    expect(inputEl.style.backgroundColor).toEqual('red');
    expect(component.color).toEqual('red');
  });
});
