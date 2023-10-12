import { faker } from '@faker-js/faker';
import { Product } from './product.model';

export const generateOneProduct = (): Product => {
  const {commerce, datatype, image, string, number} = faker;
  return {
    id: string.uuid(),
    title: commerce.productName(),
    price: parseInt(commerce.price()),
    description: commerce.productDescription(),
    category: {
      id: number.int(),
      name: commerce.department()
    },
    images: [image.url(), image.url()]
  }
}

export const generateManyProducts = (size = 10): Product[] => {
  const products: Product[] = [];
  for(let i = 0; i < size; i++ ){
    products.push(generateOneProduct())
  }
  return [...products];
}


