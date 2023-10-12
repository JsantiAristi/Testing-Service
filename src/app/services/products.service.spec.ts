import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { ProductsService } from './products.service';
import { Product } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';

describe('ProductsService', () => {
  let productservice: ProductsService;
  //Dependecia
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      //Con esta dependencia, no nos tenemos que preocuar de importar los módulos necesarios
      //para el servicio como el HttpClientModule
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ProductsService
      ]
    });
    productservice = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(productservice).toBeTruthy();
  });

  describe('tests for getAllSImple', () => {
    it('should return a product list', (doneFn) => {
      //Arrange, hacemos un mock, una simulación de lo que el back respondería, ya que si lo
      //hicieramos con peticiones reales, haría muchas peticiones, y la api se podría bloquear.
      const mockData: Product[] = generateManyProducts(2);
      //Act
      productservice.getAllSimple().subscribe( (data) => {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // htpp config, reemplazamos la respuesta por el mockData
      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    })
  })

  describe('tests for getAll', () => {
    it('should return a product list', (doneFn) => {
      //Arrange, hacemos un mock, una simulación de lo que el back respondería, ya que si lo
      //hicieramos con peticiones reales, haría muchas peticiones, y la api se podría bloquear.
      const mockData: Product[] = generateManyProducts();
      //Act
      productservice.getAll().subscribe( (data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // htpp config, reemplazamos la respuesta por el mockData
      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    })

    it('should return product list with taxes', (doneFn) => {
      const mockData: Product[] = [{
        ...generateOneProduct(),
        price: 100, //100* .19 = 19
      },
      {
        ...generateOneProduct(),
        price: 200, //100* .19 = 38
      }];

      productservice.getAll().subscribe( (data) => {
        //Assert
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        doneFn();
      });

      // htpp config, reemplazamos la respuesta por el mockData
      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    })
  })
});
