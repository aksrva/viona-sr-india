const express = require('express');
const {createUser, loginUser, restrictedArea, userVerify, userRole} = require('../controller/Users')
const router = express.Router();


router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/restricted', userVerify, restrictedArea);
router.put("/role", userVerify, userRole)

exports.router = router;
