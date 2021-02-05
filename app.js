/*
 * @Author: sitao
 * @Date: 2021-01-12 15:46:09
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-26 13:49:19
 */
const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const passport = require('koa-passport') //集成权限认证中间件之Passport
const cors = require('koa-cors')
const axios = require('axios')
// error handler
onerror(app);

// global middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(cors())

//回调到util文件中，passport.js

app.use(passport.initialize())
app.use(passport.session())
require('./utils/passport')(passport)

// logger
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});


// routes
const user = require('./routes/user.js')
const profile = require('./routes/profile.js')
const menu = require('./routes/menu.js')
const article = require('./routes/article.js')
app.use(user.routes(), user.allowedMethods())
app.use(profile.routes(), profile.allowedMethods())
app.use(menu.routes(), menu.allowedMethods())
app.use(article.routes(), article.allowedMethods())

//测试用的
// let form = {
//   name:'stk',
//   pass:'123456.',
//   email:'stmt@163.com'
// }
// axios.post('http://localhost:7777/api/register',form).then((res) => {
//   console.log(res.config)
//   console.log(res.config.data)
// })

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
