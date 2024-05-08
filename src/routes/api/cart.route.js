const express = require('express');

const { cartController } = require('../../controllers');
const { cartValidation } = require('../../validations');
const { auth, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');

const cartRouter = express.Router();

cartRouter.use(auth);

cartRouter.get('/', validate(cartValidation.getCarts), cartController.getCarts);

cartRouter.get('/me', authorize(['user']), cartController.getMyCart);

cartRouter.post(
  '/add-product',
  authorize(['user']),
  validate(cartValidation.createCart),
  cartController.addProductToCart,
);

cartRouter
  .route('/:cartId')
  .get(validate(cartValidation.getCart), cartController.getCartById)
  .put(validate(cartValidation.updateCart), cartController.updateCart)
  .delete(validate(cartValidation.deleteCart), cartController.deleteCart);

module.exports = cartRouter;
