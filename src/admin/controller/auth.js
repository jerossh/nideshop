'use strict';

import Base from './base.js';

export default class extends Base {

    async loginAction() {

        let username = this.post('username');
        let password = this.post('password');

        let admin = await this.model('admin').where({ username: username }).find();
        if (think.isEmpty(admin)) {
            return this.fail(401, '用户名或密码不正确1');
        }
        console.log(think.md5(password + admin.password_salt))
        console.log(admin.password)
        if (think.md5(password + admin.password_salt) != admin.password) {
            return this.fail(400, '用户名或密码不正确2');
        }

        //更新登录信息
        await this.model('admin').where({ id: admin.id }).update({
            last_login_time: getTime(),
            last_login_ip: this.ip(),
        });

        let TokenSerivce = this.service('token');
        let tokenObj = new TokenSerivce();
        let sessionKey = await tokenObj.create({
            user_id: admin.id
        });

        if (think.isEmpty(sessionKey)) {
            return this.fail('登录失败');
        }

        let userInfo = {
            id: admin.id,
            username: admin.username,
            avatar: admin.avatar,
            admin_role_id: admin.admin_role_id
        };

        return this.success({ token: sessionKey, userInfo: userInfo });
    }

    async logoutAction() {

        return this.success();
    }
}