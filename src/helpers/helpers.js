const connection = require('../configs/db')

module.exports = {
  renponse: (res, result, status, err, pagination) => {
    const resultPrint = {}
    if(pagination){
      resultPrint.paginations = pagination
    }
    resultPrint.status = 'success'
    resultPrint.status_code = status
    resultPrint.result = result
    resultPrint.err = err || null
    return res.status(resultPrint.status_code).json(resultPrint)
  },
  actionQuery: (...arg) =>{
    console.log(arg)
    return new Promise((resolve, reject) => {
      connection.query(...arg, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  actionQuery: (...arg) =>{
    console.log(arg)
    return new Promise((resolve, reject) => {
      connection.query(...arg, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  fillterMessageByUser: (message)=>{
    const container = []
    console.log(message.TextRow)
    message.map(function(item){
      const idFilter = [item.senderId, item.receiverId].sort(function(a, b){return a - b}).join('')
      const message = {
        ...item, idFilter
      }
      if(!container.find((item)=> item.idFilter === idFilter )){
        container.push(message)
      }
    })
    return container

  },
  generateId(){
    return Math.random().toString(16).slice(-4);
  }
}
