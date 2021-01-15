/*
 * @Author: sitao
 * @Date: 2021-01-12 15:46:09
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-15 17:29:00
 */
var router = require('koa-router')();
const controllerUser = require('../controller/user')

router.get('/news',async (ctx)=>{
   ctx.body='lll'
})
.get('/api/userId',controllerUser.queryId) // 根据用户_id查询用户
.get('/api/userName',controllerUser.queryName) // 根据用户name查询用户
.get('/api/userAll',controllerUser.queryAll) //查询用户列表
.get('/api/userDel',controllerUser.delUser) //删除用户列表
.post('/api/register',controllerUser.register) //注册用户列表
.post('/api/login',controllerUser.login) //用户登录
module.exports = router;
