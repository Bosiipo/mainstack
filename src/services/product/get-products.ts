/* eslint-disable prefer-const */
import {PipelineStage} from 'mongoose';
import Product from '../../models/Product.model';
import {escapeRegExp} from 'lodash';

enum SORT_ORDER {
  asc,
  desc,
}

enum SORT_OPTIONS_PRODUCT {
  productName,
  updatedAt,
  sellingPrice,
}

type SORT_PRODUCT = {
  sortBy: SORT_OPTIONS_PRODUCT;
  sortOrder: SORT_ORDER;
};

export type FilterConnectionCustomerProduct = {
  productName?: string;
  sellingPrice?: number;
  _id?: string;
};

export type MetadataCustomerProducts = {
  size?: number;
  page?: number;
  sortFields?: [SORT_PRODUCT];
};

type getProductsInput = {
  metadata?: MetadataCustomerProducts;
  filters?: FilterConnectionCustomerProduct;
  searchQuery?: string;
};

type sortFieldsInput = {
  productName?: string;
  updatedAt?: number;
  sellingPrice?: number;
};

// interface sortFieldsInput {
//   [key: string]: 1 | -1 | undefined;
// }

export const getProducts = async (input: getProductsInput) => {
  const {metadata = {}, filters = {}, searchQuery = ''} = input;

  let {
    sortFields = [{sortBy: 'updatedAt', sortOrder: 'desc'}],
    size = 20,
    page = 1,
  } = metadata;

  let match = {};

  let sortOptions = {};

  sortFields = JSON.parse(JSON.stringify(sortFields));

  if (sortFields && sortFields.length > 0) {
    const sortFieldsInp: sortFieldsInput = {};
    sortFields.map(field => {
      const sortby = field.sortBy !== undefined ? field.sortBy : 'updatedAt';
      sortFieldsInp[sortby] = field.sortOrder === 'asc' ? 1 : -1;
    });
    sortOptions = [{$sort: sortFieldsInp}];
  }

  if (searchQuery) {
    const regexMatch = {$regex: escapeRegExp(searchQuery), $options: 'i'};
    const searchFieldFilter = {
      $or: [{productName: regexMatch}, {referenceId: regexMatch}],
    };
    match = {...match, ...searchFieldFilter};
  }

  if (filters) {
    match = {...match, ...filters};
  }

  const productData = await Product.aggregate([
    {
      $match: match,
    },
    sortOptions,
    {
      $facet: {
        pageInfo: [
          {$count: 'totalCount'},
          {
            $addFields: {currentPage: page, size: size},
          },
        ],
        nodes: [
          {$skip: (page - 1) * size > 0 ? (page - 1) * size : 0},
          {$limit: size},
        ],
      },
    },
  ]);

  const products = productData[0];
  products.pageInfo = products.pageInfo[0];
  products.totalCount = products.pageInfo ? products.pageInfo.totalCount : 0;
  products.pageInfo = {
    ...products.pageInfo,
    hasNextPage: products.totalCount > size * page,
  };

  return products;
};
