import Product from '../../models/Product.model';

type deleteProductInput = {
  productId: string;
};

export const deleteProduct = async (input: deleteProductInput) => {
  const {productId} = input;

  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    throw new Error('Product not found'!);
  }

  return deletedProduct;
};
