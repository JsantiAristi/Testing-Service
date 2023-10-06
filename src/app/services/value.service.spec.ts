import { TestBed } from '@angular/core/testing'

import { firstValueFrom } from 'rxjs';
import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach( () => {
    TestBed.configureTestingModule({
      // Creamos un modulo de testing
      providers: [ ValueService ]
    });
    //Hacemos una inyección de dependencias
    service = TestBed.inject(ValueService)
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for GetValue', () => {
    it('Should return "My value"', () => {
      expect(service.getValue()).toBe('My value')
    })
  });

  describe('Test for SetValue', () => {
    it('Should change the value', () => {
      service.setValue('change');
      expect(service.getValue()).toBe('change')
    })
  })

  describe('Test for getPromiseValue', () => {
    //se coloca una variable doneFn (Done Funcrtion)
    it('Should return "promise value" from promise', (doneFn) => {
      service.getPromiseValue()
      .then( (value) => {
        expect(value).toBe('promise value');
        doneFn();
      })
    })
  })

  describe('Test for getPromiseValue', () => {
    it('Should return "promise value" from promise', async () => {
      const rta = await service.getPromiseValue();
      expect(rta).toBe('promise value');
    })
  })

  describe('Test for getObservableValue', () => {
    it('should return "Observable Value"', (doneFn) => {
      service.getObservableValue().subscribe((value) => {
        expect(value).toBe('Observable Value');
        doneFn();
      });
    })
  })

  describe('Test for getObservableValue Sync', () => {
    it('should return "Observable Value"', async () => {
      const value = await firstValueFrom(service.getObservableValue());
      expect(value).toBe('Observable Value');
    })
  })
});
