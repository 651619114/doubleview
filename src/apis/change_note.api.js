/*
 * @Description: 
 * @Author: xingmf
 * @Date: 2022-08-03 19:23:28
 * @LastEditors: xingmf
 * @LastEditTime: 2022-08-03 19:23:29
 * @FilePath: /doubleview/src/apis/change_node.api.js
 */
import http from '../services/request.js'
/**
 * @description 获取用户列表
 * @param {*} params 请求接口的参数
 */
export const changeNote = params => http.get('recruit/chat/changenote', params)