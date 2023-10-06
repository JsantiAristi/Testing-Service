import { TestBed } from '@angular/core/testing'

import { MasterService } from './master.service';
import { FakeValueService } from './value-fake.service';
import { ValueService } from './value.service';

describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach( () => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      // Creamos un modulo de testing
      providers: [ MasterService,
        { provide: ValueService, useValue: spy }
      ]
    });
    //Hacemos una inyección de dependencias
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('Should be created', () => {
    expect(masterService).toBeTruthy();
  });

  // it('should return "my value" from the real service', () => {
  //   const valueService = new ValueService();
  //   const masterService = new MasterService(valueService);
  //   expect(masterService.getValue()).toBe('My value');
  // });

  // it('should return "othe value" from the fake service', () => {
  //   const fakevalueService = new FakeValueService();
  //   const masterService = new MasterService(fakevalueService as unknown as ValueService);
  //   expect(masterService.getValue()).toBe('fake value');
  // });

  // it('should return "othe value" from the fake object', () => {
  //   const fake = { getValue: () => 'fake from obj'}
  //   const masterService = new MasterService(fake as ValueService);
  //   expect(masterService.getValue()).toBe('fake from obj');
  // });

  it('should call to getValue from ValueService', () => {
    valueServiceSpy.getValue.and.returnValue('fake value');

    expect(masterService.getValue()).toBe('fake value');
    //Espiamos si realmente se llamo a ese método
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    //Espiamos si se llamó solo una vez
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
