const connection = require('../configs/db')
module.exports = {
    register: (data) => {
        return new Promise((resolve, reject) => {
          connection.query('INSERT INTO users SET ?', data, (err, result) => {
            if (!err) {
              resolve(result)
            } else {
              reject(new Error(err))
            }
          })
        })
      },
    getUserbyEmail: (email) => {
        return new Promise((resolve, reject) => {
          connection.query('SELECT * FROM users WHERE email =  ?', email, (err, result) => {
            if (!err) {
              resolve(result)
            } else {
              reject(new Error(err))
            }
          })
        })
      },
}