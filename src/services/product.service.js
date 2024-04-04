const httpStatus = require('http-status');
const moment = require('moment');
const excel4node = require('excel4node');

const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeature = require('../utils/ApiFeature');
const { productMessage, authMessage } = require('../messages');

const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, productMessage().NOT_FOUND);
  }
  return product;
};

const getProductsByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Product);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'description', 'slug']);
  return { products: results, ...detailResult };
};

const getMyProducts = async (query) => {
  const apiFeature = new ApiFeature(Product);
  query.shopId = query.user.id;
  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'description']);
  return { products: results, ...detailResult };
};

const updateProductById = async (productId, updateBody, shopId) => {
  const product = await getProductById(productId);
  if (updateBody.shopId !== shopId) {
    throw new ApiError(httpStatus.FORBIDDEN, authMessage().FORBIDDEN);
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteProductById = async (productId, shopId) => {
  const product = await getProductById(productId);
  if (product.shopId !== shopId) {
    throw new ApiError(httpStatus.FORBIDDEN, authMessage().FORBIDDEN);
  }
  await product.deleteOne();
  return product;
};

const exportExcel = async (query) => {
  const apiFeature = new ApiFeature(Product);
  query.page = 1;
  query.limit = 1000;
  const { results } = await apiFeature.getResults(query, ['name', 'description', 'slug', 'price']);
  const wb = new excel4node.Workbook();

  const ws = wb.addWorksheet('Products');

  const headerStyle = wb.createStyle({
    font: {
      color: '#FFFFFF',
      bold: true,
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: '#1ABD76',
    },
  });

  ws.column(1).setWidth(28);
  ws.column(2).setWidth(23);
  ws.column(3).setWidth(33);
  ws.column(4).setWidth(20);
  ws.column(5).setWidth(40);
  ws.column(6).setWidth(25);
  ws.column(7).setWidth(25);
  ws.column(8).setWidth(25);
  ws.column(9).setWidth(25);
  ws.column(10).setWidth(25);

  ws.cell(1, 1).string('ID').style(headerStyle);
  ws.cell(1, 2).string('Name').style(headerStyle);
  ws.cell(1, 3).string('slug').style(headerStyle);
  ws.cell(1, 4).string('Description').style(headerStyle);
  ws.cell(1, 5).string('price').style(headerStyle);
  ws.cell(1, 6).string('image').style(headerStyle);
  ws.cell(1, 7).string('shopId').style(headerStyle);
  ws.cell(1, 8).string('categoryId').style(headerStyle);
  ws.cell(1, 9).string('Last acctive').style(headerStyle);
  ws.cell(1, 10).string('Created At').style(headerStyle);

  results.forEach((product, index) => {
    ws.cell(index + 2, 1).string(product._id.toString());
    ws.cell(index + 2, 2).string(product.name);
    ws.cell(index + 2, 3).string(product.slug);
    ws.cell(index + 2, 4).string(product.description);
    ws.cell(index + 2, 5).number(product.price);
    ws.cell(index + 2, 6).string(product.image);
    ws.cell(index + 2, 7).string(product.shopId.toString());
    ws.cell(index + 2, 8).string(product.categoryId.toString());
    ws.cell(index + 2, 9).string(moment(product.lastAcctive).format('DD/MM/YYYY - HH:mm:ss'));
    ws.cell(index + 2, 10).string(moment(product.createdAt).format('DD/MM/YYYY - HH:mm:ss'));
  });

  return wb;
};

module.exports = {
  getProductById,
  createProduct,
  getMyProducts,
  getProductsByKeyword,
  updateProductById,
  deleteProductById,
  exportExcel,
};
