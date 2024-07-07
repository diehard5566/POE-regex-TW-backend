const express = require('express');

const router = new express.Router();

router.use('/maps', require('./maps'));
router.use('/items', require('./items'));
router.use('/exchange', require('./exchange'));

module.exports = router;
