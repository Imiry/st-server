
/*
 * @Author: sitao
 * @Date: 2021-01-18 15:48:19
 * @LastEditors: sitao
 * @LastEditTime: 2021-01-19 17:55:22
 */


const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
const config = require('../utils/config')
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretOrKey;
const User = require('../db').User;
var ObjectID = require('mongodb').ObjectID;
// console.log(User)

module.exports = passport => {
  // console.log(passport)
  passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    // console.log(111)
    // console.log(jwt_payload)
    // console.log(jwt_payload.str._id)
    const user = await User.findById(jwt_payload.str._id)
    // console.log(user)
    if(user) {
      return done(null, user)
    } else {
      return done(null, false)
    }

}));
}