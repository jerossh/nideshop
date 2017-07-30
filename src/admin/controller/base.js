'use strict';

export default class extends think.controller.base {
  /**
   * 前置操作
   */
  async __before() {

    //根据token值获取用户id
    think.token = this.header('X-Nideshop-Token') || '';
    let TokenSerivce = this.service('token');
    let tokenObj = new TokenSerivce();
    think.userId = await tokenObj.getUserId();

    //除了登录页面，其它都需要检测登录
    if (this.http.controller !== 'auth') {
      if (think.userId <= 0) {
        return this.fail(401, '请先登录');
      }
    }

  }
}