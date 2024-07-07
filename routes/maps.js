const express = require('express');

const router = new express.Router();
// Const {
// 	beforeGetUsersRequest,
// } = require('../../route-hooks/management/user');
const {
	handleGetMapsModListsRequest,
	handleGeneratedMapRegexRequest,
	handleGetT17MapsModListsRequest,
} = require('../route-handlers/maps');

router.get(
	'/',
	// BeforeMapsRegexGeneratorRequest,
	handleGetMapsModListsRequest,
);

router.get(
	'/t17',
	// BeforeMapsRegexGeneratorRequest,
	handleGetT17MapsModListsRequest,
);

router.post(
	'/generateMapRegex',
	handleGeneratedMapRegexRequest,
);

module.exports = router;
