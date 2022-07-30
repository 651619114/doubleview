import axios from "axios";
import qs from "qs";

axios.defaults.baseURL = 'http://recruit.dev.eol.cn/';
axios.defaults.timeout = 5000;

// 请求拦截
axios.interceptors.request.use((config)=>{
    if(config.method.toLocaleLowerCase() == 'post'){
        config.data = qs.stringify(config.data);
    }
    return config;    
},(error)=>{
    return Promise.reject(error);
})

// 响应拦截
axios.interceptors.response.use((res)=>{
    // 请求成功处理
    return res.data ? res.data : res;
},(error)=>{
    // 请求失败处理
    return Promise.reject(error);
})

export default axios
