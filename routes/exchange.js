const express = require('express');

const router = new express.Router();
// Const {
// 	beforeGetUsersRequest,
// } = require('../../route-hooks/management/user');
const {
	handleDivToChaosExchangeRequest,
} = require('../route-handlers/exchange');

router.get(
	'/',
	// BeforeDivToChaosExchangeRequest,
	handleDivToChaosExchangeRequest,
);

module.exports = router;
