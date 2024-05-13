const express = require('express');

const { chatController } = require('../../controllers');
const { chatValidation } = require('../../validations');
const { auth } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');

const chatRouter = express.Router();
chatRouter.route('/').post(auth, validate(chatValidation.getMessages), chatController.getMessage);

chatRouter.route('/send').post(auth, validate(chatValidation.createMessage), chatController.sendMessage);

chatRouter.route('/users').post(auth, validate(chatValidation.getListUsersChat), chatController.getListUsersChat);

module.exports = chatRouter;
