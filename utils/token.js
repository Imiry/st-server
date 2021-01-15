/*
 * @Author: sitao
 * @Date: 2021-01-15 10:18:39
 * @LastEditors: sitao
 * 
 * @LastEditTime: 2021-01-15 17:21:26
 */
const jwt = require('jsonwebtoken');
const { TOKEN_ENCODE_STR, URL_YES_PASS } = require('./config');
const Checkcode = require('../db').Checkcode;
const User = require('../db').User



module.exports = {
    // 生成登录 token
    create_token(str) {
        //过期时间设置为60妙。那么decode这个token的时候得到的过期时间为 : 创建token的时间 +　设置的值
        return token = jwt.sign({ str }, TOKEN_ENCODE_STR, { expiresIn: '60s' });
    },
    // 验证 验证码 token 与 code 是否正确
    async check_token_code({ token, code }) {
        try {
            // 验证码转大写
            code = code.toUpperCase();
            await jwt.verify(token, TOKEN_ENCODE_STR);
            // 读数据库，删除验证码
            let res = await Checkcode.findOneAndDelete({ token, code });
            if (res == null) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return true;
    }
}