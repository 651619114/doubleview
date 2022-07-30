import http from '../services/request.js'
/**
 * @description 获取用户列表
 * @param {*} params 请求接口的参数
 */
export const reqGroupHistory = params => http.get('recruit/chat/getgrouphistory', params)