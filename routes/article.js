/*
 * @Author: sitao
 * @Date: 2021-01-26 13:41:05
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-27 11:40:25
 */
var router = require('koa-router')();
const controllerArticle = require('../controller/article')
const passport = require('koa-passport')

/**
 * @route GET api/article
 * @desc 测试接口地址
 * @access 接口是公有的
 */
router.get('/api/article',async (ctx)=>{
   ctx.body='lll'
})

router.get('/api/article/word' , controllerArticle.getMaps)
router.get('/api/article/allArticle',passport.authenticate('jwt', { session: false }) , controllerArticle.getAllarticle) //获取所有的文章列表
router.post('/api/article/createArticle',passport.authenticate('jwt', { session: false }) , controllerArticle.createArticle) //创建的文章列表
module.exports = router;