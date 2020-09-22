const { compareSync } = require('bcryptjs')
const jwt = require('jsonwebtoken')
module.exports = {
    verifyAccess: (req, res, next)=>{
        console.log(req.headers.authorization)
        if(!req.headers.authorization){
          return helpers.renponse(res, {message: 'server, need token'}, 401)
        }
       let token = req.headers.authorization
        token = token.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
          if(err){
            if(err.name ==="JsonWebTokenError"){
              return helpers.renponse(res, {message: 'invalid token'}, 401)
            }else if(err.name === "TokenExpiredError"){
              return helpers.renponse(res, {message: 'token expired'}, 401)
            }
          }
          next()
        });
      },
  cekToken: (id, token) => {
      let result = null
      if(!token){
          result = {
            error: true,
            msg: 'Token not found'
          }
          return result
      }
      jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if(err){
          if(err.name ==="JsonWebTokenError"){
              result = {
                error: true,
                msg: 'invalid token'
              }
            //   console.log(result)
          }else if(err.name === "TokenExpiredError"){
            result =  {
                error: true,
                msg: 'token expired'
            } 
          }
          return result
        }
        // console.log('nilai adalaah', decoded)
       if(Number(id) !==decoded.id){
        result = {
            error: true,
            msg: 'user token invalid'
        }
       }else{
        result = {
            error: false,
            decoded
        }
       }
      });
      return result
  }
}
