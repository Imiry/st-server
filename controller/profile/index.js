/*
 * @Author: sitao
 * @Date: 2021-01-19 17:18:14
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-20 15:27:17
 */

const Profile = require('../../db').Profile;  //引入对应的model操作
const User = require('../../db').User; 
const getProfile = async (ctx) => {
  // console.log(ctx.state)
  const profile = await Profile.find({ user: ctx.state.user._id }).populate('User', ['user_name', 'user_avtor'])
  if (profile.length > 0) {
    ctx.status = 200;
    ctx.body = profile
  } else {
    ctx.status = 400;
    ctx.body = {
      noprofile: '该用户没有任何相关的个人信息'
    }
    return
  }
}

//个人信息增加和编辑
const addOreaditProfile = async (ctx) => {
  const profileFieds = {};

  profileFieds.user = ctx.state.user.id;
  if (ctx.request.body.handle) profileFieds.handle = ctx.request.body.handle
  if (ctx.request.body.company) profileFieds.company = ctx.request.body.company
  if (ctx.request.body.website) profileFieds.website = ctx.request.body.website
  if (ctx.request.body.location) profileFieds.location = ctx.request.body.location
  if (ctx.request.body.status) profileFieds.status = ctx.request.body.status
  if (ctx.request.body.skills !== 'undefined') profileFieds.skills = ctx.request.body.skills.split(',')
  if (ctx.request.body.bio) profileFieds.bio = ctx.request.body.bio
  if (ctx.request.body.githubusername) profileFieds.githubusername = ctx.request.body.githubusername

  profileFieds.social = {};
  if (ctx.request.body.wechat) profileFieds.social.wechat = ctx.request.body.wechat
  if (ctx.request.body.QQ) profileFieds.social.QQ = ctx.request.body.QQ
  if (ctx.request.body.tengxunkt) profileFieds.social.tengxunkt = ctx.request.body.tengxunkt
  if (ctx.request.body.wangyikt) profileFieds.social.wangyikt = ctx.request.body.wangyikt

  //查询数据库
  const profile = await Profile.find({ user: ctx.state.user.id });
  if (profile.length > 0) {
    //编辑更新
    const profileUpdate = await Profile.findOneAndUpdate(
      { user: ctx.state.user.id },
      { $set: profileFieds },
      { new: true }
    )
    ctx.body = profileUpdate
  } else {
    await new Profile(profileFieds).save().then(profile => {
      ctx.status = 200;
      ctx.body = profile
    })
  }
}


//通过个人的信息表示handel进行查询
const getProfileByTest = async (ctx) => {
  const profile = await Profile.find({ handle: ctx.query.handle }).populate('User', ['user_name', 'user_avtor'])
  if (profile.length < 1) {
    ctx.status = 401;
    ctx.body = '未找到该用户信息'
  } else {
    ctx.body = profile
  }
}

//通过个人的user_id获取信息
const getProfileById = async (ctx) => {
  const profile = await Profile.find({ user: ctx.query.user_id }).populate('User', ['user_name', 'user_avtor'])
  if (profile.length < 1) {
    ctx.status = 401;
    ctx.body = '未找到该用户信息'
  } else {
    ctx.body = profile[0]
  }
}


//查询所有用户的信息
const getAllProfile = async (ctx) => {
  const profile = await Profile.find({}).populate('User', ['user_name', 'user_avtor'])
  if (profile.length < 1) {
    ctx.status = 401;
    ctx.body = '未找到用户信息'
  } else {
    ctx.body = profile
  }
}


//个人的工作经验添加
const addExperience = async (ctx) => {
  const profileFieds = {};
  profileFieds.experience = []
  const profile = await Profile.find({ user: ctx.state.user.id })
  if (profile.length > 0) {
    const newExp = {
      title: ctx.request.body.title,
      company: ctx.request.body.company,
      location: ctx.request.body.location,
      from: ctx.request.body.from,
      to: ctx.request.body.to,
      description: ctx.request.body.description,
    }
    profileFieds.experience.unshift(newExp);
    // console.log(profileFieds.experience)
    const profileFiedsUpdate = await Profile.updateOne(
      { user: ctx.state.user.id },
      { $push: {experience:profileFieds.experience} },
      { $sort: 1 }
    )
    if(profileFiedsUpdate.ok = 1) {
      const profile = await Profile.find({ user: ctx.state.user.id }).populate('User',['user_name','user_avtor'])
      if(profile) {
        ctx.status = 200;
        ctx.body = profile;
      }
    }
  } else {
    ctx.body = '没有该用户的信息'
    ctx.status = 404
  }
}

//个人的教育经历添加
const addEducation = async (ctx) => {
  const profileFieds = {};
  profileFieds.education = []
  const profile = await Profile.find({ user: ctx.state.user.id })
  if (profile.length > 0) {
    const newExp = {
      school: ctx.request.body.school,
      degree: ctx.request.body.degree,
      fieldofstudy: ctx.request.body.fieldofstudy,
      from: ctx.request.body.from,
      to: ctx.request.body.to,
      description: ctx.request.body.description,
    }
    profileFieds.education.unshift(newExp);
    // console.log(profileFieds.experience)
    const profileFiedsUpdate = await await Profile.updateOne(
      { user: ctx.state.user.id },
      { $push: {education:profileFieds.education} },
      { $sort: 1 }
    )
    console.log(profileFiedsUpdate)
    if(profileFiedsUpdate.ok = 1) {
      const profile = await Profile.find({ user: ctx.state.user.id }).populate('User',['user_name','user_avtor'])
      if(profile) {
        ctx.status = 200;
        ctx.body = profile;
      }
    }
  } else {
    ctx.body = '没有该用户的信息'
    ctx.status = 404
  }
}


//根据经验中的id 伤处对应的经验
const deleteExperience = async (ctx) => {
  const exp_id = ctx.query.exp_id
  const profile = await Profile.find({user: ctx.state.user.id})
  if(profile[0].experience.length >0) {
    //找到下标
    const removeIndex = profile[0].experience.map(item => item.id).indexof(exp_id)

    //删除
    profile[0].experience.splice(removeIndex,1)

    //更新数据
    const profileUpdate = await Profile.findOneAndUpdate(
      { user: ctx.state.user.id },
      { $set: profile[0] },
      { new:true }
    )
    ctx.body = profileUpdate; 
  }else{
    ctx.status = 404;
    ctx.body = '没查到用户信息'
  }
}

//根据教育经历中的id 删除对应的教育
const deleteEducation = async (ctx) => {
  const Edu_id = ctx.query.Edu_id
  const profile = await Profile.find({user: ctx.state.user.id})
  if(profile[0].education.length >0) {
    //找到下标
    const removeIndex = profile[0].education.map(item => item.id).indexOf(Edu_id)

    //删除
    profile[0].education.splice(removeIndex,1)

    //更新数据
    const profileUpdate = await Profile.findOneAndUpdate(
      { user: ctx.state.user.id },
      { $set: profile[0] },
      { new:true }
    )
    ctx.body = profileUpdate; 
  }else{
    ctx.status = 404;
    ctx.body = '没查到用户信息'
  }
}


//删除整个用户信息，删除之后就需要重新注册
const deleteAll = async (ctx) => {

  const profile = await Profile.deleteOne({ user: ctx.state.user.id });
  if(profile.ok == 1) {
    const user = await User.deleteOne({_id: ctx.state.user.id});
    if(user.ok == 1){
      ctx.status = 200;
      ctx.body = { success: true }
    }
  }else {
    ctx.status = 404;
    ctx.body = 'profile不存在'
  }
}

module.exports = {
  getProfile,
  addOreaditProfile,
  getProfileByTest,
  getProfileById,
  getAllProfile,
  addExperience,
  addEducation,
  deleteExperience,
  deleteEducation,
  deleteAll
}