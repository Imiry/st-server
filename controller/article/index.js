/*
 * @Author: sitao
 * @Date: 2021-01-26 13:42:00
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-27 11:39:00
 */
const Article = require('../../db').Article;  //引入对应的model操作
const Map = require('../../db').Map;

//查询此用户的所以发布的文章
const getAllarticle = async (ctx) => {
  const article = await Article.find()
  ctx.body = {
    status:200,
    data:article
  }
}

//创建文章
const createArticle = async (ctx) => {
  const article = await Article.find({ user: ctx.state.user.id })
  const articleArr = []
  if(article.length > 0){
    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let c_article = {
      title:ctx.request.body.title,
      content:ctx.request.body.content,
      likes:10,
      class:ctx.request.body.class,
      time: year+'年'+month+'月'+day+'日 ',
      coverImg:ctx.request.body.coverImg,
    }
    articleArr.unshift(c_article)
    const articleUpdate = await Article.updateOne(
      { user: ctx.state.user.id },
      { $push: {article:articleArr} },
      { $sort: 1 }
    )
    if(articleUpdate.ok = 1) {
      const article = await Article.find({ user: ctx.state.user.id }).populate('User',['user_name','user_avtor'])
      if(article) {
        ctx.body = {
          status:200,
          data:article
        }
      }
    }
  }else {
    ctx.body = '没有该文章的信息'
    ctx.status = 404
  }
}




//外加引入世界地图数据
const getMaps = async (ctx) => {
  const maps = await Map.find() 
  ctx.body = maps
}
module.exports = {
  getAllarticle,
  createArticle,
  getMaps
}