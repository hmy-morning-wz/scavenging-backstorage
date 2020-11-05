import HOST_CONFIG from 'hostconfig'
import * as ajax from 'ajax'
import {getJSON, postJSON, putJSON, delData} from '../../utils/ajax'
import {Loading} from 'element-ui'

let host = HOST_CONFIG.nethost
export default {
    // 商户交易账单列表+下载
    billList(data) {
        const url = `${host}/bill/merchant/list`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    billCreate(data) {
        const url = `${host}/bill/careat`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    billDonload(data) {
        const loading = Loading.service({
            lock: true,
            text: 'loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        const url = `${host}/bill/down`
        return postJSON(url, data).then(
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

    // 套餐购买账单列表+下载
    packageList(data) {
        const url = `${host}/bill/cardticket/list`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    // 判断登录用户是公交公司/卡公司
    getUserType() {
        const url = `${host}/common/login/info`
        return postJSON(url).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    getStatusDesc(s) {
        if (s === 0) return '账单无法生成'
        else if (s === 1) return '账单未⽣成'
        else if (s === 2) return '账单⽣成中'
        else if (s === 3) return '可下载账单'
        else if (s === 4) return '无'
    },

    // v3.0
    // 每日/月账单统计
    billSummary(data) {
        const url = `${host}/bill/merchant/summary`
        return postJSON(url,data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },


}
