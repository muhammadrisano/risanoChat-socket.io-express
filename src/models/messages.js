const connection = require('../configs/db')
module.exports = {
    getUserbymessage: (id) => {
        return new Promise((resolve, reject) => {
        //   connection.query('SELECT messages.*, users.fullName AS reciverUser FROM messages INNER JOIN users ON messages.receiverId = users.id WHERE messages.senderId = ? OR messages.receiverId = ? GROUP BY messages.receiverId, messages.senderId ORDER BY messages.createdAt DESC', [id, id], (err, result) => {
            connection.query('SELECT userMessage.*, users.fullName AS senderUser FROM (SELECT messages.*, users.fullName AS reciverUser FROM messages INNER JOIN users ON messages.receiverId = users.id WHERE messages.senderId = ? OR messages.receiverId = ?) AS userMessage INNER JOIN users ON userMessage.senderId = users.id ORDER BY createdAt DESC', [id, id], (err, result) => {
            if (!err) {
              resolve(result)
            } else {
              reject(new Error(err))
            }
          })
        })
    },
    getMessagePrivate: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM messages WHERE messages.senderId = ? OR messages.receiverId = ? ORDER BY createdAt ASC', [id, id], (err, result) => {
            if (!err) {
              resolve(result)
            } else {
              reject(new Error(err))
            }
          })
        })
      },
      SendMessagePrivate: (data) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO messages SET ?', data, (err, result) => {
            if (!err) {
              resolve(result)
            } else {
              reject(new Error(err))
            }
          })
        })
      },
}