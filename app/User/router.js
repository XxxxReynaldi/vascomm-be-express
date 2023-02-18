var express = require('express');
var router = express.Router();
const { getUsers, approve, destroy } = require('./controller');
const { verifyToken } = require('../../middleware/verifiyToken');
const multer = require('multer');
const os = require('os');

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

router.get('/', verifyToken, getUsers);
router.patch('/approve/:id', approve);
router.delete('/:id', destroy);

module.exports = router;
