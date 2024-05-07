const Joi = require('joi');

const { objectId } = require('./custom.validation');

const getShops = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
  }),
};

const getDetailShop = {
  params: Joi.object().keys({
    shopId: Joi.string().custom(objectId),
  }),
};

const getShopsByCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
  }),
};

module.exports = {
  getShops,
  getDetailShop,
  getShopsByCategory,
};
