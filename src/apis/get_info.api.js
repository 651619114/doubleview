/*
 * @Description: 
 * @Author: xingmf
 * @Date: 2022-08-03 19:23:28
 * @LastEditors: xingmf
 * @LastEditTime: 2022-08-06 13:53:35
 * @FilePath: /doubleview/src/apis/get_info.api.js
 */
import http from '../services/request.js'
/**
 * @description 获取用户列表
 * @param {*} params 请求接口的参数
 */
export const getInfo = params => http.get('recruit/chat/getinfo', params)