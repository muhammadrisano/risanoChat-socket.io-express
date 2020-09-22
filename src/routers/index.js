const express = require('express')
const router = express.Router()
const userRouter = require('../routers/user')

router.use('/users', userRouter)

module.exports = router