import {Router} from 'express';
import {ProductController} from '../controllers/product.controller';

export const router = Router();
const productController = new ProductController();

router.get('/', productController.getProducts); // Route for getting all products
router.get('/:productId', productController.getProduct); // Route for getting a specific product by ID
router.post('/create-product', productController.createProduct); // Route for creating a new product
router.put('/:productId', productController.updateProduct); // Route for updating a product by ID
router.delete('/:productId', productController.deleteProduct); // Route for deleting a product by ID

export default router;
