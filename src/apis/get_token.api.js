import http from '../services/request.js'
/**
 * @description 获取用户列表
 * @param {*} params 请求接口的参数
 */
export const getToken = params => http.post('api/interview/gettoken', params)