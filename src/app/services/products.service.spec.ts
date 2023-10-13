import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { ProductsService } from './products.service';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';
import { HTTP_INTERCEPTORS, HttpStatusCode } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductsService', () => {
  let productservice: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService

  beforeEach(() => {
    TestBed.configureTestingModule({
      //Con esta dependencia, no nos tenemos que preocuar de importar los módulos necesarios
      //para el servicio como el HttpClientModule
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ProductsService,
        TokenService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
      ]
    });
    productservice = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService)
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(productservice).toBeTruthy();
  });

  describe('tests for getAllSImple', () => {
    it('should return a product list', (doneFn) => {
      //Arrange, hacemos un mock, una simulación de lo que el back respondería, ya que si lo
      //hicieramos con peticiones reales, haría muchas peticiones, y la api se podría bloquear.
      const mockData: Product[] = generateManyProducts(2);
      //Hacemos un espía atokenService
      spyOn(tokenService, 'getToken').and.returnValue('123');
      //Act
      productservice.getAllSimple().subscribe( (data) => {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // htpp config, reemplazamos la respuesta por el mockData
      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`);
      req.flush(mockData);
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
    })

    it('should return product list with taxes', (doneFn) => {
      const mockData: Product[] = [{
        ...generateOneProduct(),
        price: 100, //100* .19 = 19
      },
      {
        ...generateOneProduct(),
        price: 200, //100* .19 = 38
      },
      {
        ...generateOneProduct(),
        price: 0, // = 0
      },
      {
        ...generateOneProduct(),
        price: -100, // = 0
      }];

      productservice.getAll().subscribe( (data) => {
        //Assert
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        doneFn();
      });

      // htpp config, reemplazamos la respuesta por el mockData
      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should send quey params with limit 10 and offset 3', (doneFn) => {
      //Arrange, hacemos un mock, una simulación de lo que el back respondería, ya que si lo
      //hicieramos con peticiones reales, haría muchas peticiones, y la api se podría bloquear.
      const mockData: Product[] = generateManyProducts();
      const limit = 10;
      const offset = 3;
      //Act
      productservice.getAll(limit, offset).subscribe( (data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // htpp config, reemplazamos la respuesta por el mockData
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });

    it('should send query params with limit 0 and offset 0', (doneFn) => {
      // Arange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 0;
      const offset = 0;
      //Act
      productservice.getAll(limit, offset).subscribe((data) => {
        // Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const param = req.request.params;
      expect(param.get('limit')).toBeNull();
      expect(param.get('offset')).toBeNull();
    });

    describe('tests for create', () => {
      it('should create an item', (doneFn) => {
        //Arrange
        const mockData = generateOneProduct();
        const dto: CreateProductDTO = {
          title: 'new Product',
          price: 100,
          images: ['img'],
          description: 'bla bla bla',
          categoryId: 12
        }
        //Act
        productservice.create(dto).subscribe( (data) => {
          //Assert
          expect(data).toEqual(mockData)
          doneFn();
        })

        // http config
        const url = `${environment.API_URL}/api/v1/products`;
        const req = httpController.expectOne(url);
        req.flush(mockData);
        //Verificamos que lo que entra al servicio, es lo mismo que lo que se mandó.
        expect(req.request.body).toEqual({...dto});
        //Verificamos que la prueba sea POST
        expect(req.request.method).toEqual('POST');
      });
    });

    describe('Test for update product', () => {
      it('#update, should update a product', (doneFn) => {
        // Arrange
        const mockData = generateOneProduct();
        const productId = '1';
        const dto: UpdateProductDTO = {
          title: 'Product edited',
        };
        // Act
        productservice.update(productId, {...dto}).subscribe((data) => {
          // Assert
          expect(data).toEqual(mockData);
          doneFn();
        });
        // Http Config
        const url = `${environment.API_URL}/api/v1/products/${productId}`;
        const req = httpController.expectOne(`${url}`);
        req.flush(mockData);
        expect(req.request.body).toEqual(dto);
        expect(req.request.method).toEqual('PUT');
      });
    });

    describe('Test for delete product', () => {
      it('#Delete, should delete a product', (doneFn) => {
        // Arrange
        const productId = '1';
        // Act
        productservice.delete(productId).subscribe((data) => {
          // Assert
          expect(data).toBe(true);
          doneFn();
        });
        // Http Config
        const url = `${environment.API_URL}/api/v1/products/${productId}`;
        const req = httpController.expectOne(`${url}`);
        req.flush(true);
        expect(req.request.method).toEqual('DELETE');
      });
    });

    describe('Test for getOne', () => {
      it('Should return a product', (doneFn) => {
        // Arrange
        const mockData = generateOneProduct();
        const productId = '1';
        //Act
        productservice.getOne(productId).subscribe( data => {
          //Assert
          expect(data).toEqual(mockData);
          doneFn();
        })

        // htpp config, reemplazamos la respuesta por el mockData
        const url = `${environment.API_URL}/api/v1/products/${productId}`
        const req = httpController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(mockData);
      });

      it('Should return an error 404 with a message "El producto no existe" ', (doneFn) => {
        // Arrange
        const productId = '1';
        const msgError = '404 message';
        const mockError = {
          status: HttpStatusCode.NotFound,
          statusText: msgError
        }
        //Act
        productservice.getOne(productId).subscribe({
          error: (error) => {
            //assert
            expect(error).toEqual('El producto no existe');
            doneFn();
          }
        })

        // htpp config, reemplazamos la respuesta por el mockData
        const url = `${environment.API_URL}/api/v1/products/${productId}`
        const req = httpController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(msgError, mockError);
      });
    })
  });
});

