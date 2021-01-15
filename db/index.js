/*
 * @Author: sitao
 * @Date: 2021-01-12 17:58:52
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-15 17:09:13
 */
const mongoose = require('mongoose');
const db = mongoose.connect("mongodb://localhost:27017/admin", {useNewUrlParser:true}, function(err){
  if(err)console.log(err)
  console.log("Connection success!")
})

//声明schema
const Schema = mongoose.Schema; 

// 用户
let userSchema = new Schema({
  user_id: Number,
  user_phone: String,
  user_pwd: String,
  user_name:String,
  token: {
    type: String,
    default: ""
  },
  create_time:Date
})
//验证码
let checkcodeSchema = new Schema({
  token: String,
  code: String
})

//根据schema生成model
exports.User = mongoose.model('User', userSchema,'user'); 
exports.Checkcode = mongoose.model('Checkcode', checkcodeSchema,'Checkcode');