import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

describe('MapsService', () => {
  let mapsService: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[MapsService]
    });
    mapsService = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(mapsService).toBeTruthy();
  });

  describe('test for getCurrentPosition', () => {
    it('should save the center position', () => {
      //Arrange
      //Espaimos y emulamos una posición.
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((successFn) => {
        //Se debe saber muy bien el tipado.
        const mockGeolocation = {
          coords: {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            latitude: 1000,
            longitude: 2000,
            speed: 0
          },
          timestamp: 0,
        };
        successFn(mockGeolocation);
      });
      // Act
      mapsService.getCurrentPosition();
      // Assert
      expect(mapsService.center.lat).toEqual(1000);
      expect(mapsService.center.lng).toEqual(2000);
    });
  });
});
