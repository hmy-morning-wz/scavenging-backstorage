import HOST_CONFIG from 'hostconfig'
import * as ajax from 'ajax'
import { Loading } from 'element-ui';
import {
    getJSON,
    postJSON,
    putJSON,
    delData
} from '../../utils/ajax'

let host = HOST_CONFIG.nethost
export default {
    //获取概览顶部part数据
    getTotalData() {
        
        const url = `${host}/homepage/total`
        return postJSON(url).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    //获取概览异常数据
    getAbnormalData() {
        const url = `${host}/homepage/abnormal`
        return postJSON(url).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },
    // 获取折线图所需数据
    getFoldlineList(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        const url = `${host}/homepage/foldline`
        return postJSON(url,data).then(
            response => {
                loading.close()
                return Promise.resolve(response.data || response)
            },
            response => {
                loading.close()
                return Promise.reject(response.data || response)
            }
        )
    },
}
