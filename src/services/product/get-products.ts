import {PipelineStage} from 'mongoose';
import Product from '../../models/Product.model';
import {escapeRegExp} from 'lodash';

enum SORT_ORDER {
  asc = 'asc',
  desc = 'desc',
}

enum SORT_OPTIONS_PRODUCT {
  productName = 'productName',
  updatedAt = 'updatedAt',
  sellingPrice = 'sellingPrice',
}

type SORT_FIELDS_INPUT = {
  productName?: 1 | -1;
  updatedAt?: 1 | -1;
  sellingPrice?: 1 | -1;
};

type SORT_PRODUCT = {
  sortBy?: SORT_OPTIONS_PRODUCT;
  sortOrder?: SORT_ORDER;
};

export type FILTER_CONNECTION_CUSTOMER_PRODUCT = {
  productName?: string;
  sellingPrice?: number;
  _id?: string;
};

export type METADATA_CUSTOMER_PRODUCTS = {
  size?: number;
  page?: number;
  sortFields?: [SORT_PRODUCT];
};

type GET_PRODUCTS_INPUT = {
  metadata?: METADATA_CUSTOMER_PRODUCTS;
  filters?: FILTER_CONNECTION_CUSTOMER_PRODUCT;
  searchQuery?: string;
};

export const getProducts = async (input: GET_PRODUCTS_INPUT) => {
  const {metadata = {}, filters = {}, searchQuery = ''} = input;

  const {size = 20, page = 1} = metadata;

  let {sortFields = [{sortBy: 'updatedAt', sortOrder: 'desc'}]} = metadata;

  let match = {};

  const aggregationStage: [PipelineStage] = [
    {
      $match: match,
    },
  ];

  sortFields = JSON.parse(JSON.stringify(sortFields));

  if (sortFields && sortFields.length > 0) {
    const sortFieldsInp: SORT_FIELDS_INPUT = {};
    sortFields.map(field => {
      const sortby = field.sortBy !== undefined ? field.sortBy : 'updatedAt';
      sortFieldsInp[sortby] = field.sortOrder === 'asc' ? 1 : -1;
    });
    aggregationStage.push({$sort: sortFieldsInp});
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
    ...aggregationStage,
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
