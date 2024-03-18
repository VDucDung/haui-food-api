const express = require('express');

const apiRoute = express.Router();

const listRoutesApi = [
  {
    path: '/users',
    route: require('./user.route'),
  },
];

listRoutesApi.forEach((route) => {
  apiRoute.use(route.path, route.route);
});

module.exports = apiRoute;
