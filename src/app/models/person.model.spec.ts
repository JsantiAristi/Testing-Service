import { Person } from './person.model';


describe('Test for Person', () => {
  let person: Person;
  beforeEach(() => {
    person = new Person('Cesar', 'Armendariz', 29, 120, 1.75);
  });

  it('attrs', () => {
    expect(person.name).toEqual('Cesar');
    expect(person.lastName).toEqual('Armendariz');
    expect(person.age).toEqual(29);
    expect(person.weigth).toEqual(120);
    expect(person.heigth).toEqual(1.75);
  });

  describe('test for calcIMC', () => {
    it('should return a string: overweigth level 2', () => {
      // Arrange
      person.weigth = 120;
      person.heigth = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('overweigth level 2');
    });

    it('should return a string: not found', () => {
      // Arrange
      person.weigth = -10;
      person.heigth = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('not found');
    });

    it('should return a string: down', () => {
      // Arrange
      person.weigth = 40;
      person.heigth = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('down');
    });

    it('should return a string: normal', () => {
      // Arrange
      person.weigth = 70;
      person.heigth = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('normal');
    });

    it('should return a string: overweigth', () => {
      // Arrange
      person.weigth = 80;
      person.heigth = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('overweigth');
    });

    it('should return a string: overweigth level 1', () => {
      // Arrange
      person.weigth = 90;
      person.heigth = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('overweigth level 1');
    });

    it('should return a string: overweigth level 3', () => {
      // Arrange
      person.weigth = 150;
      person.heigth = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('overweigth level 3');
    });

    it('should return a string: Not found', () => {
      person.weigth = 0;
      person.heigth = 0
      expect(person.calcIMC()).toEqual('not found');
      person.weigth = -48;
      person.heigth = -1.70;
      expect(person.calcIMC()).toEqual('not found');
    })
  });
});
