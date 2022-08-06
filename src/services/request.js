import axios from 'axios'
import Qs from 'qs'

const isProduction = process.env.NODE_ENV === 'production'
// const baseURL = isProduction ? '/' : '/api'

class Request {
    constructor() {
        // 创建axios实例
        this._axios = axios.create({
            baseURL: '/api',
            timeout: 1000 * 60, // 请求超时时间
            headers: {},
            withCredentials:true
        })
        // 请求拦截
        this._axios.interceptors.request.use(
            config => {
                const requestHeader = {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Access-Control-Allow-Origin': '*',
                }
                config.headers = Object.assign(config.headers, requestHeader)
                return config
            },
            error => {
                Promise.reject(error)
            }
        )
    }


    /**
      * 发送get请求
      * @param {String} url地址
      * @param {Object} query 查询参数
      * @return json数据
      */
    get(url, query = {}) {
        return this._request('get')(url, {
            ...query
        })
    }


    /**
      * 发送post请求
      * @param {String} url地址
      * @param {Object} body 查询参数
      * @return json数据
      */
    post(url, body = {}, headers) {
        let data;
        if (this.isFormData(body)) {
            data = body
        } else if (Array.isArray(body)) {
            data = body
        } else {
            data = { ...body }
        }

        return this._request('post',headers)(url, data);
    }

    /**
     * 
     * @param {*} url 
     * @param {*} body 
     * @returns 
     */
    put(url, body = {}) {
        return this._request('put')(url, {
            ...body
        });
    }

    /**
     * 
     * @param {*} url 
     * @param {*} body 
     * @returns 
     */
    delete(url, body = {}) {
        return this._request('delete')(url, {
            ...body
        });
    }

    isFormData = v => {
        return Object.prototype.toString.call(v) === '[object FormData]'
    }


    /**
      * 设置请求头
      * @param {Object} header 请求头
      */
    setHeaders(header) {
        Object.keys(header).forEach(key => {
            this._axios.defaults.headers[key] = header[key]
        })
    }

    // 处理请求头 headers
    handleHeaders() {
        const headers = {}
        headers['XMIME-TYPE'] = '3'
        Headers['Content-Type'] = 'application/json; charset=UTF-8'
        return headers
    }

    /**
      * 发送请求
      * @param {String} method 请求方法类型
      * @param headers
      * @returns {function(*=, *=):Promise<unknown>}
      * @private
      */
    _request(method, headers) {
        this.setHeaders(this.handleHeaders()) // 设置统一的请求头
        if (headers) {
            this.setHeaders(headers) // 自定义请求头
        }

        return (url, data, timeout) => {
            const config = {
                url,
                method,
                timeout: timeout || this._axios.defaults.timeout
            } // 构造请求 config

            // 判断请求类型 get post
            const paramType = ['get', 'delete'].indexOf(method) !== -1 ? 'params' : 'data'
            config[paramType] = data

            //参数序列化
            config.paramsSerializer = params => {
                return Qs.stringify(params, { arrayFormat: 'repeat' });
            }

            return new Promise((resolve, reject) => {
                // 发送真正的请求，验证权限，检查404等status
                this._axios
                    .request(config)
                    .then(response => {
                        if (this.handleSuccessStatus(response.data.code, response.data)) {
                            
                            if (response.headers['content-type'] !== 'text/plain; charset=urf-8') {
                                
                                resolve(
                                    // 对响应结果二次包装
                                    Object.assign(
                                        {
                                            success: Number(response.data.code) === 1,
                                            data: response.data.data,
                                            msg: response.data.message
                                        },
                                        response.data
                                    )
                                ) // 处理返回结果
                            } else {
                               
                                resolve(response.data)
                            }
                        }
                    }, response => {
                        // 处理错误码
                        if (response.response) {
                            const statusCode = response.response.code
                            this.handleErrorStatus(statusCode)
                        } else {
                        }
                        reject(response)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
    }
    /**
     * 
     */
    handleSuccessStatus(code, data) {
        let result = ''
        let flag = false
        // console.log(code)
        switch (code) {
            case 1:
                result = 'success'
                flag = true
                break
            case '1000':
                result = 'success'
                flag = true
                break
            case '1001':
                result = '数据为空'
                flag = true
                break
            case '1004':
                result = '无操作权限！'
                flag = true
                break
            default:
                break
        }

        // 进行通知
        // $message方法是我按需引入的element-ui中的提示组件，你可以替换成自己的提示组件
        if (result) {
            console.log(result)
        }
        return flag
    }


    // 根据错误码获取错误提示
    handleErrorStatus(statusCode) {
        let errorMsg = ''
        if (statusCode === 500) {
            errorMsg = '数据请求失败，请联系管理员！'
        } else if (statusCode === 404) {
            errorMsg = '请求地址错误！'
        } else if (statusCode === 402) {
            errorMsg = '当前您没有权限操作该数据！'
        } else {
            errorMsg = '请求出错！'
        }
        // 进行通知
        console.log(errorMsg)
    }
}

export default new Request()