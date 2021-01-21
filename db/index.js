/*
 * @Author: sitao
 * @Date: 2021-01-12 17:58:52
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-20 17:18:05
 */
const mongoose = require('mongoose');
const db = mongoose.connect("mongodb://localhost:27017/admin", { useNewUrlParser: true }, function (err) {
  if (err) console.log(err)
  console.log("Connection success!")
})

//声明schema
const Schema = mongoose.Schema;

// 用户
let userSchema = new Schema({
  user_id: Number,
  user_email: String,
  user_pwd: String,
  user_name: String,
  user_avtor: String,
  // token: {
  //   type: String,
  //   default: ""
  // },
  create_time: Date
})
//验证码
let checkcodeSchema = new Schema({
  token: String,
  code: String
})
//用户的个人资料
let profileSchema = new Schema({
  user: {     //关联数据表
    type: String,
    ref: 'User',
    required: true
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  company: String,
  website: String,
  location: String,
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: String,
  githubusername: String,
  experience: [
    {
      current: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: String,
        required: true
      },
      to: {
        type: String
      },
      description: {
        type: String
      },
    }
  ],
  education: [
    {
      current: {
        type: Boolean,
        default: true
      },
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String
      },
      from: {
        type: String,
        required: true
      },
      to: {
        type: String
      },
      description: {
        type: String
      },
    }
  ],
  social: {
    wechat: {
      type: String
    },
    QQ: String,
    tengxunkt: String,
    wangyikt: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
})


//管理系统的菜单schema
let menuSchema = new Schema({
  user: {     //关联数据表
    type: String,
    ref: 'User',
    required: true
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  menu:[
    {
      icon:{
        type: String,
        require:true
      },
      title:{
        type:String,
        require:true
      },
      time:{
        type: String,
        default: Date.now
      },
      path:{
        type: String,
        require: true
      },
      children:[
        {
          icon:{
            type: String,
            require:true
          },
          title:{
            type:String,
            require:true
          },
          time:{
            type: String,
            default: Date.now
          },
          path:{
            type: String,
            require: true
          },
        }
      ]
    }
  ]
  
})

//根据schema生成model
exports.User = mongoose.model('User', userSchema, 'user');

exports.Checkcode = mongoose.model('Checkcode', checkcodeSchema, 'Checkcode');

exports.Profile = mongoose.model('Profile', profileSchema, 'profile'); 

exports.Menu = mongoose.model('Menu', menuSchema); 