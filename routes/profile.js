/*
 * @Author: sitao
 * @Date: 2021-01-19 17:33:04
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-20 15:18:07
 */
var router = require('koa-router')();
const controllerProfile = require('../controller/profile')
const passport = require('koa-passport')
// console.log(controllerProfile)
router.get('/news',async (ctx)=>{
   ctx.body='lll'
})
.get('/api/profile', passport.authenticate('jwt', { session: false }) , controllerProfile.getProfile) //个人信息接口地址  接口是私有的
.post('/api/profile', passport.authenticate('jwt', { session: false }) , controllerProfile.addOreaditProfile) //添加和编辑个人信息接口地址,接口是私有的
.delete('/api/profile/profile', passport.authenticate('jwt', { session: false }) , controllerProfile.deleteAll) //删除整个用户信息，需重新注册
.get('/api/profile/handle',  controllerProfile.getProfileByTest) //通过个人的handle进行查询
.get('/api/profile/user',  controllerProfile.getProfileById) //通过user中的id来查询对应的用户信息
.get('/api/profile/all',   controllerProfile.getAllProfile) //查询所有的用户信息
.post('/api/profile/experience', passport.authenticate('jwt', { session: false }) , controllerProfile.addExperience) //添加经验，私有的接口
.delete('/api/profile/experience', passport.authenticate('jwt', { session: false }) , controllerProfile.deleteExperience) //根据经验id伤处对应用户的经验
.post('/api/profile/education', passport.authenticate('jwt', { session: false }) , controllerProfile.addEducation) //添加教育经历，私有的接口
.delete('/api/profile/education', passport.authenticate('jwt', { session: false }) , controllerProfile.deleteEducation) //根据教育经历id伤处对应用户的经历

module.exports = router;