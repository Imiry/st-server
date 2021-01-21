/*
 * @Author: sitao
 * @Date: 2021-01-20 16:50:30
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-20 18:19:58
 */
var router = require('koa-router')();
const controllerMenu = require('../controller/menu')
const passport = require('koa-passport')

/**
 * @route GET api/menu
 * @desc 测试接口地址
 * @access 接口是公有的
 */
router.get('/api/menu',async (ctx)=>{
   ctx.body='lll'
})

.post('/api/menu/first',passport.authenticate('jwt', { session: false }),controllerMenu.addFirstMenu)
.post('/api/menu/second',passport.authenticate('jwt', { session: false }),controllerMenu.addSecondMenu)
module.exports = router;