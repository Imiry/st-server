/*
 * @Author: sitao
 * @Date: 2021-01-20 16:49:14
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-21 10:45:09
 */
const Menu = require('../../db').Menu;  //引入对应的model操作
const User = require('../../db').User; 


/**
 * @route GET api/menu/first
 * @desc 增加一级菜单接口地址
 * @access 接口是私有的
 */
const addFirstMenu = async (ctx) => {
  // console.log(ctx.state)
  const menuFieds = {}
  menuFieds.menu = []
  const profile = await Menu.find({user:ctx.state.user._id}).populate('User', ['user_name', 'user_avtor'])
  if(profile.length > 0) {
    const menuChidren = {
      icon: ctx.request.body.icon,
      title: ctx.request.body.title,
      path: ctx.request.body.path
    }
    menuFieds.menu.unshift(menuChidren)
    // console.log(menuFieds.menu)
    const menuFiedsUpDate = await Menu.updateOne(
      { user: ctx.state.user._id },
      { $push: {menu:menuFieds.menu} },
      { $sort: 1 }
    )
    console.log(menuFiedsUpDate)
    if(menuFiedsUpDate.ok == 1) {
      const profile = await Menu.find( { user: ctx.state.user._id } ).populate('User', ['user_name', 'user_avtor'])
      if(profile) {
        ctx.status = 200;
        ctx.body = profile;
      }
    }
  } else {
    ctx.body = '获取失败'
    ctx.status = 404
  }
  
}

/**
 * @route GET api/menu/second
 * @desc 增加二级菜单接口地址
 * @access 接口是私有的
 */

const addSecondMenu = async (ctx) => {
  const menuFieds = {}
  menuFieds.menu = []
  const s_id = ctx.query.s_id
  const profile = await Menu.find({user:ctx.state.user._id}).populate('User', ['user_name', 'user_avtor'])
  if(profile.length > 0) {
    const menuChidrenSon = {
      icon: ctx.request.body.icon,
      title: ctx.request.body.title,
      path: ctx.request.body.path
    }
    menuFieds.menu.unshift(menuChidrenSon)
    // console.log(menuFieds.menu)
    const menuFiedsUpDate = await Menu.updateOne(
      { user: ctx.state.user._id },
      { $push: {menu:menuFieds.menu} },
      { $sort: 1 }
    )
    console.log(menuFiedsUpDate)
    if(menuFiedsUpDate.ok == 1) {
      const profile = await Menu.find( { user: ctx.state.user._id } ).populate('User', ['user_name', 'user_avtor'])
      if(profile) {
        ctx.status = 200;
        ctx.body = profile;
      }
    }
  } else {
    ctx.body = '没有该菜单的信息'
    ctx.status = 404
  }
}







module.exports = {
  addFirstMenu,
  addSecondMenu
}