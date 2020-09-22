const  bcrypt = require('bcryptjs');
const helper = require('../helpers/helpers')
const modelUser = require('../models/users');
const jwt = require('jsonwebtoken')

module.exports = {
    register:async(req, res) =>{
        const {email, password, fullname} = req.body
   
        const data = {
            email, 
            password,
            fullname,
            roleId: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(data.password, salt, function(err, hash) {
                data.password = hash
                modelUser.register(data)
                .then((result) => {
                    // res.json(resultBooks);
                    helper.renponse(res, result, 201, null)
                  })
                  .catch((err) => {
                    console.log(err)
                  })
            });
        });

    },
    login: (req, res) =>{
        console.log(req.body)
        const {email, password} = req.body
        modelUser.getUserbyEmail(email)
        .then((result) => {
            // console.log(res)
            if(result.length <1) return helper.renponse(res, {message: 'email not found!!'}, 201, null)
            
            const user = result[0]
            const hash = user.password
            bcrypt.compare(password, hash).then((resCompare) => {
                if(!resCompare) return helper.renponse(res, {message: 'password wrong !!'}, 201, null)
                const payload = {
                    id: user.id,
                    email: user.email,
                    roleId: user.roleId
                }
                jwt.sign( payload, process.env.SECRET_KEY, { expiresIn: '1h' }, (err, token)=>{
                    user.token = token
                    delete user.password
                    delete user.createdAt
                    delete user.updatedAt
                    helper.renponse(res, user, 200)
                });
              
            });
          })
          .catch((err) => {
            console.log(err)
          })
    }
}