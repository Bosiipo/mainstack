import Product from '../../models/Product.model';

type getProductInput = {
  productId: string;
};

export const getProduct = async (input: getProductInput) => {
  const {productId} = input;

  const product = await Product.findById(productId);

  if (!product) throw new Error('Product not found!');

  return product;
};
