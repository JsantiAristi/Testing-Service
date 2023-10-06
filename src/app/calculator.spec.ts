import { Calculator } from "./calculator";

describe('Test for Calculator', () => {

  describe('Test for multiply', () => {
    it('#multiply should return a nine', () => {
      //Arrange
      const calculator = new Calculator();
      //Act
      const rta = calculator.multiply(3,3);
      //Assert
      expect(rta).toEqual(9);
    })
  })

  describe('Test for divide', () => {
    it('tests matchers', () => {
      const calculator = new Calculator();
      expect(calculator.divide(6,3)).toEqual(2);
    })
  })

})
