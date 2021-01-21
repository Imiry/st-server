/*
 * @Author: sitao
 * @Date: 2021-01-12 15:46:09
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-21 16:54:04
 */
var router = require('koa-router')();
const controllerUser = require('../controller/user')
const passport = require('koa-passport')
router.get('/news',async (ctx)=>{
   ctx.body='lll'
})
.get('/api/userId',controllerUser.queryId) // 根据用户_id查询用户
.get('/api/userName',controllerUser.queryName) // 根据用户name查询用户
.get('/api/userAll',controllerUser.queryAll) //查询用户列表
.get('/api/userDel',controllerUser.delUser) //删除用户列表
.post('/api/register',controllerUser.register) //注册用户列表
.post('/api/login',controllerUser.login) //用户登录
.get('/api/current', passport.authenticate('jwt', { session: false }) , async (ctx) => {
   // console.log(ctx)
   ctx.body ={
      status:200,
      user:ctx.state.user
   } 
 }) //用户信息接口地址，返回用户信息，接口私密的
.post('/api/eadit', passport.authenticate('jwt', { session: false }),controllerUser.eadit) 
module.exports = router;
