import Product from '../../models/Product.model';
import {Types} from 'mongoose';

export enum OperationType {
  OUTBOUND = 'OUTBOUND',
  INBOUND = 'INBOUND',
}

export enum StatusType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

type updateProductInput = {
  productId: string;
  productName?: string;
  productImage?: string;
  sellingPrice?: number;
  status?: string;
  purchasePrice?: number;
  operation: OperationType;
  availableStock?: number;
};

type updateProductUpsert = {
  productName?: string;
  productImage?: string;
  sellingPrice?: number;
  status?: string;
  purchasePrice?: number;
  // operation?: OperationType;
  availableStock?: number;
};

export const updateProduct = async (input: updateProductInput) => {
  const {
    productId,
    productName,
    productImage,
    sellingPrice,
    purchasePrice,
    operation,
    availableStock,
    status,
  } = input;

  const existingProduct = await Product.findById(productId);

  if (!existingProduct)
    throw new Error('Product with provided productId does not exist!');

  let updates: updateProductUpsert = {};
  let newStock = 0;

  if (availableStock) {
    if (operation === OperationType.INBOUND) {
      newStock = availableStock + existingProduct.availableStock;
    } else {
      newStock = existingProduct.availableStock - availableStock;
    }
    updates = {
      ...updates,
      availableStock: newStock,
    };
  }

  if (productName) {
    updates = {
      ...updates,
      productName,
    };

    const existingProductName = await Product.findOne({
      productName,
      _id: {$ne: new Types.ObjectId(productId)},
    });

    if (existingProductName && operation !== OperationType.OUTBOUND) {
      throw new Error(`Product with this ${productName} name already exists! `);
    }
  }

  if (productImage) {
    updates = {
      ...updates,
      productImage,
    };
  }

  if (sellingPrice || sellingPrice === 0) {
    updates = {
      ...updates,
      sellingPrice,
    };
  }

  if (purchasePrice || purchasePrice === 0) {
    updates = {
      ...updates,
      purchasePrice,
    };
  }

  if (status) {
    updates = {
      ...updates,
      status,
    };
  }

  const product = await Product.findOneAndUpdate(
    {
      _id: new Types.ObjectId(productId),
    },
    updates,
    {upsert: true, returnOriginal: false}
  );

  return product;
};
