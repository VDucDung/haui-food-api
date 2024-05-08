const httpStatus = require('http-status');

const response = require('../utils/response');
const { cartService } = require('../services');
const { cartMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');
const { REQUEST_USER_KEY } = require('../constants');

const addProductToCart = catchAsync(async (req, res) => {
  const user = req[REQUEST_USER_KEY].id;

  const cart = await cartService.addProductToCart(req.body, user);

  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, cartMessage().ADD_PRODUCT_SUCCESS, cart));
});

const getCarts = catchAsync(async (req, res) => {
  const carts = await cartService.getCartsByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, cartMessage().FIND_LIST_SUCCESS, carts));
});

const getCartById = catchAsync(async (req, res) => {
  const { cartId } = req.params;

  const cart = await cartService.getCartById(cartId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, cartMessage().FIND_SUCCESS, cart));
});

const updateCart = catchAsync(async (req, res) => {
  const { cartId } = req.params;

  const cart = await cartService.updateCartById(cartId, req.body);

  res.status(httpStatus.OK).json(response(httpStatus.OK, cartMessage().UPDATE_SUCCESS, cart));
});

const deleteCart = catchAsync(async (req, res) => {
  const { cartId } = req.params;

  const cart = await cartService.deleteCartById(cartId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, cartMessage().DELETE_SUCCESS, cart));
});

const getMyCart = catchAsync(async (req, res) => {
  const user = req[REQUEST_USER_KEY];

  const result = await cartService.getMyCart(user);

  res.status(httpStatus.OK).json(response(httpStatus.OK, cartMessage().GET_MY_CART_SUCCESS, result));
});

module.exports = {
  getCarts,
  getMyCart,
  updateCart,
  deleteCart,
  getCartById,
  addProductToCart,
};
