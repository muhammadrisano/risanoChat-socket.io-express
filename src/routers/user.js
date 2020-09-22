const express = require('express')
const userController = require('../controllers/user');
const router = express.Router()

router
    .post('/register', userController.register)
    .post('/login', userController.login)
    .get('/tes', (req, res)=>{
        res.send('hello')
    })

module.exports = router