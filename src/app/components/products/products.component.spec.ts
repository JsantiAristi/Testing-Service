import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ProductComponent } from '../product/product.component';
import { ProductsService } from 'src/app/services/products.service';
import { generateManyProducts } from 'src/app/models/product.mock';
import { defer, of } from 'rxjs';
import { ValueService } from 'src/app/services/value.service';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductsService>;
  let valueService: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll']);
    const valueServiceSpy = jasmine.createSpyObj('ValueService', ['callPromise']);

    TestBed.configureTestingModule({
      declarations: [
        ProductsComponent,
        ProductComponent
      ],
      providers: [
        {provide: ProductsService, useValue: productServiceSpy},
        {provide: ValueService, useValue: valueServiceSpy},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;

    const productsMock = generateManyProducts(3);
    productService.getAll.and.returnValue(of(productsMock));
    fixture.detectChanges(); //ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(productService.getAll).toHaveBeenCalled();
  });

  describe('test for getAllProducts', () => {
    it('should return product list from service', () => {
      // Arrange
      const productsMock = generateManyProducts(3);
      productService.getAll.and.returnValue(of(productsMock));
      const countPrev = component.products.length;
      // Act
      component.getAllProducts();
      fixture.detectChanges();
      // Assert
      expect(component.products.length).toEqual(productsMock.length + countPrev)
    });

    it('should change the status "loading" => "success"', fakeAsync(() => {
        // Arrange
        const productsMock = generateManyProducts(3);
        //Emula un observable, lo cual tiene cierta demora
        productService.getAll.and.returnValue(defer( () => Promise.resolve(productsMock)));
        //Act
        component.getAllProducts();
        fixture.detectChanges();

        expect(component.status).toEqual('loading');

        //Ejecuta todo lo pendiente que es asíncrono
        tick();
        fixture.detectChanges();
        //Assert
        expect(component.status).toEqual('success');
    }));

    it('should change the status "loading" => "error"', fakeAsync(() => {
      // Arrange
      //Emula un observable, lo cual tiene cierta demora
      productService.getAll.and.returnValue(defer( () => Promise.reject('error')));
      //Act
      component.getAllProducts();
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      //Ejecuta todo lo pendiente que es asíncrono, con una espera de 4 segundos.
      tick(4000); // exec, obs, setTimeout, promise
      fixture.detectChanges();
      //Assert
      expect(component.status).toEqual('error');
  }));
  });

  describe('test for callPromise', () => {
    it('should call to promise', async () => {
      //Arrange
      const mocksg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mocksg));
      //Act
      await component.callPromise();
      fixture.detectChanges();
      //Assert
      expect(component.rta).toEqual(mocksg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
    })
  })
});
