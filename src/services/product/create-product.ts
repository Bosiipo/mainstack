import Product from '../../models/Product.model';
import {ValidationError} from '../../responses/errors';

export enum ProductQuantityType {
  UNIT,
  BULK,
}

type createProductInput = {
  productName: string;
  productImage: string;
  sellingPrice: number;
  purchasePrice: number;
  type: ProductQuantityType;
  availableStock: number;
};

export const createProduct = async (input: createProductInput) => {
  const {
    productName,
    productImage,
    sellingPrice,
    purchasePrice,
    type,
    availableStock,
  } = input;

  const existingProduct = await Product.findOne({
    productName,
  });

  if (existingProduct)
    throw new ValidationError('A product with this name already exists.');

  let unitPrice: number = purchasePrice;

  if (type !== ProductQuantityType.UNIT) {
    unitPrice = purchasePrice / availableStock;
  }

  const product = await Product.create({
    productName,
    productImage,
    sellingPrice,
    purchasePrice,
    unitPrice,
    availableStock,
  });

  return product;
};
