import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Auth } from '../models/auth.model';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let authservice: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        TokenService,
      ]
    });
    authservice = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authservice).toBeTruthy();
  });

  describe('Test for login', () => {
    it('should return a token', (doneFn) => {
      //Arrange
      const mockData: Auth = {
        access_token: '122121212'
      };
      const email =  'ejemplo@gmail.com';
      const password = '122'
      //Act
      authservice.login(email, password).subscribe( (data) => {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // htpp config, reemplazamos la respuesta por el mockData
      const url = `${environment.API_URL}/api/auth/login`
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should call to saveToken', (doneFn) => {
      //Arrange
      const mockData: Auth = {
        access_token: '122121212'
      };
      const email =  'ejemplo@gmail.com';
      const password = '122';
      //Espias para métodos que no retornan nada.
      spyOn(tokenService, 'saveToken').and.callThrough();
      //Act
      authservice.login(email, password).subscribe( (data) => {
        //Assert
        expect(data).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        //Se debe haber llamado con lo que tenía el token
        expect(tokenService.saveToken).toHaveBeenCalledWith('122121212');
        doneFn();
      });

      // htpp config, reemplazamos la respuesta por el mockData
      const url = `${environment.API_URL}/api/auth/login`
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

  })
});
