var express = require('express');
var router = express.Router();
const { signUp, signIn, signOut, refreshToken } = require('./controller');
const multer = require('multer');
const os = require('os');

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

router.post('/signup', multer({ dest: os.tmpdir(), fileFilter }).single('foto'), signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.get('/token', refreshToken);

module.exports = router;
