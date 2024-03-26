import {NextFunction, Request, Response} from 'express';
import * as ProductSchema from '../validations/product.schema';
import * as ProductService from '../services/product';
import {validate} from '../middlewares/validate';
import {
  sendFailureResponse,
  sendSuccessResponse,
  StatusCode,
} from '../responses';

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validate(ProductSchema.CreateProductSchema, {
        productName: req.body.productName,
        productImage: req.body.productImage,
        sellingPrice: req.body.sellingPrice,
        purchasePrice: req.body.purchasePrice,
        type: req.body.type,
        availableStock: req.body.availableStock,
      });
      const response = await ProductService.createProduct(params);
      return sendSuccessResponse(
        res,
        StatusCode.CREATED,
        'Product created successfully',
        response
      );
    } catch (error) {
      return next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validate(ProductSchema.EditProductSchema, {
        productId: req.params.productId,
        productImage: req.body.productImage,
        sellingPrice: req.body.sellingPrice,
        productName: req.body.productName,
        status: req.body.status,
        operation: req.body.operation,
        purchasePrice: req.body.purchasePrice,
        availableStock: req.body.availableStock,
      });
      const response = await ProductService.updateProduct(params);
      return sendSuccessResponse(
        res,
        StatusCode.OK,
        'Product updated successfully',
        response
      );
    } catch (error) {
      next(error);
      return sendFailureResponse(res, StatusCode.BAD_REQUEST, error.message);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validate(ProductSchema.EditProductSchema, {
        productId: req.params.productId,
      });
      const response = await ProductService.deleteProduct(params);
      return sendSuccessResponse(
        res,
        StatusCode.OK,
        'Product deleted successfully',
        response
      );
    } catch (error) {
      return next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validate(ProductSchema.GetProductSchema, {
        productId: req.params.productId,
      });
      const response = await ProductService.getProduct(params);
      return sendSuccessResponse(
        res,
        StatusCode.OK,
        'Product gotten successfully',
        response
      );
    } catch (error) {
      next(error);
      return sendFailureResponse(res, StatusCode.NOT_FOUND, error.message);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validate(ProductSchema.GetProductsSchema, {
        metadata: req.body.metadata,
        filters: req.body.filters,
        searchQuery: req.body.searchQuery,
      });
      const response = await ProductService.getProducts(params);
      return sendSuccessResponse(
        res,
        StatusCode.OK,
        'Products fetched successfully',
        response
      );
    } catch (error) {
      return next(error);
    }
  }
}
