const express = require('express');

const router = new express.Router();
// 表單驗證先跳過
// const {
// 	beforeGetUsersRequest,
// } = require('../../route-hooks/management/user');
const {
	handleItemsRegexGeneratorRequest,
} = require('../route-handlers/items');

router.get(
	'/',
	// BeforeItemsRegexGeneratorRequest,
	handleItemsRegexGeneratorRequest,
);

module.exports = router;
