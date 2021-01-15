/*
 * @Author: sitao
 * @Date: 2021-01-12 18:08:46
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-15 18:04:14
 */

 //下面这两哥包是用来生成时间的
 const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

//用于密码加密的
const sha1 = require('sha1');
const { PWD_ENCODE_STR} = require('../../utils/config');

//用于生成token的
const { create_token,check_token_code } = require('../../utils/token.js');

const User = require('../../db').User;  //引入对应的model操作
var ObjectID = require('mongodb').ObjectID;


//通过用户名来查找用户
const queryName =  async (ctx,next) =>{
  let userName = ctx.query.user_name
  
  let res = await User.findOne({"user_name":userName })
  console.log(res)
  if(!res){
    ctx.body = {
      code: 401,
      msg: '此用户不存在！',
    }
  }else{
    ctx.body = {
      code: 200,
      msg: '查询成功！',
      data: res
    }
  }
}
// 通过_id 获取用户信息
const queryId = async (ctx, next) =>{
  let _id = ctx.query._id;
  if(_id.length != 24){
    ctx.body = {
      code: 401,
      msg: '查询失败，_id错误！'
    }
    return;
  }
  try {
    let res = await User.find({"_id":new ObjectID(_id)});
    ctx.body = {
      code: 200,
      msg: '查询成功！',
      data: res
    }
  }catch(e){
    console.log(e);
    ctx.body = {
      code: 500,
      msg: '查询失败，服务器异常，请稍后再试!'
    }
  }
}
//查询用户列表
const queryAll = async (ctx, next) =>{
  // console.log(ctx)
  let res = await User.find();
  if(res) {
    ctx.body = {
      code: 200,
      msg: '查询成功！',
      data: res
    }
  }else if(!res) {
    ctx.body = {
      code: 200,
      msg: '数据为空！',
      data: []
    }
  }else {
    ctx.body = {
      code: 500,
      msg: '查询失败，服务器异常，请稍后再试!'
    }
  }
}
//删除某个用户
const delUser = async (ctx,next) =>{
  // let _id = ctx.query.id;
  let user_id = ctx.query.user_id
  // console.log(User.remove({_id:new ObjectID(_id)}))
  await User.remove({"user_id":user_id},(err) => {
    if(err) {
      ctx.body = {
        code:401,
        msg: err
      }
    }else {
      ctx.body = {
        code:200,
        msg: '删除成功'
      }
    }
  })
  
}
//注册用户
const register = async (ctx,next) =>{
  let { name,phone, pass} = ctx.request.body
  let res = await User.find({"user_phone":ctx.request.body.phone })
  try{
    if(name == '' || phone == '' || pass == ''){
      ctx.body = {
        code: 401,
        msg: "注册失败，请填写完整表单!"
      }
      return;
    }
    if(phone.length !== 11){
      ctx.body = {
        code: 401,
        msg: '注册失败，手机号11位！'
      }
      return;
    }
    if(res.length !== 0){
      ctx.body = {
        code: 409,
        msg: '注册失败，登录账号重复了，换一个吧！'
      }
      return;
    }else{
      //通过向后端传参，拿到数据最后进行保存
      let user = new User({
        user_name:ctx.request.body.name,
        user_phone: ctx.request.body.phone,
        user_id: parseInt(1000*Math.random()),
        user_pwd: sha1(ctx.request.body.pass), //加密
        token: create_token(ctx.request.body.phone), //创建token并存入数据库
        create_time: new Date(),//将objectid转换为用户创建时间
      })  
      //调用保存方法
      res = await user.save();
      if(res._id !== null) {
        ctx.body = {
          code: 200,
          msg: "注册成功!",
          data: {
            _id: res._id,
            user_name:res.user_name,
            user_id:res.user_id,
            user_phone:res.user_phone,
            user_pwd:res.user_pwd,
            token:res.token,
          }
        }
      }else{
        ctx.body = {
          code: 500,
          msg: "注册失败，服务器异常!"
        }
      }
    }
  }catch (e){
    console.log(e);
    ctx.body = {
      code: 500,
      msg: "注册失败，服务器异常！"
    }
  }
  
  
  
}
//用户登录
const login = async (ctx) => {
  let { name,phone,pass} = ctx.request.body;
  try{
    if(phone == '' || pass == '' || name == ''){
      ctx.body = {
        code: 401,
        msg: "登录失败，请输入登录账号、名称或密码!"
      }
      return;
    }else{
      let res = await User.findOne({"user_phone":phone});
      let token = create_token(phone)
      res.token = token;
      // res.save();
      console.log(res.token)
      if(res) {
        ctx.body = {
          data: {
            user_name: res.user_name,
            user_pwd:res.user_phone,
            token:res.token
          }
        }
      }
    }
  }catch (e) {

  }
}
// const login = async (ctx) => {
//   let { name,phone,pass,code,code_token} = ctx.request.body;
//   try{
//     if(phone == '' || pass == '' || name == ''){
//       ctx.body = {
//         code: 401,
//         msg: "登录失败，请输入登录账号、名称或密码!"
//       }
//       return;
//     }
//     //验证码判断
//     let mark = await check_token_code({token:code_token,code});
//     console.log(mark)
//     if(mark){
//       ctx.body = {
//         code: 401,
//         msg: '登录失败，验证码错误!'
//       }
//       return;
//     }
    
//     pass = sha1(sha1(pass + PWD_ENCODE_STR))
//     let res = await User.find({"user_phone":phone,"user_pwd":pass});
//     if(res.length == 0){
//       ctx.body = {
//         code: 401,
//         msg: '登录失败，用户名或者密码错误!'
//       }
//       return;
//     }
//     let token = create_token(phone);
//     res[0].token = token;
//       res[0].save();
//       ctx.body = {
//         code: 200,
//         msg: "登录成功!",
//         data: {
//           _id: res[0]._id,
//           user_name: res[0].user_name,
//           avatar: res[0].avatar,
//           token
//         }
//       }
//   }catch (e) {
//     console.log(e);
//     ctx.body = {
//       code: 500,
//       msg: '登录失败，服务器异常!'
//     }

//   }
// }
module.exports = {
    queryName,
    queryId,
    queryAll,
    delUser,
    register,
    login

}