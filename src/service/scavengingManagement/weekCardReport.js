import HOST_CONFIG from 'hostconfig'
import { Loading } from 'element-ui';
import * as ajax from 'ajax'
import {
    getJSON,
    postJSON,
    putJSON,
    delData
} from '../../utils/ajax'

let host = HOST_CONFIG.nethost
export default {    
    //获取下拉框选项列表
    getSelectData(data) {
        const url = `${host}/common/filterlist`
        return postJSON(url,data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    //导出报表
    reportExport(data,urll) {
        const loading = Loading.service({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        const url = `${host}${urll}`
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

    // v1.4.2
    //权益票卡/运营统计
    weekCardList(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        const url = `${host}/benefit/salestatis/summary`
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
    //权益票卡/结算汇总
    weekCardTotal(data) {
        const url = `${host}/benefit/settlement/summary`
        return postJSON(url,data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },
    //权益票卡/运营统计日报表
    dayDetail(data) {
        const url = `${host}/benefit/salestatis/detail`
        return postJSON(url,data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },
    //权益票卡/结算汇总商品报表
    goodsDetail(data) {
        const url = `${host}/benefit/settlement/detail`
        return postJSON(url,data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    // v3.0    
    //分佣结算/结算商品报表
    commissionSettleList(data) {
        const url = `${host}/benefit/commission/settlement`
        return postJSON(url,data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },
    //分佣结算/汇总商品报表
    commissionTotalList(data) {
        const url = `${host}/benefit/commission/summary`
        return postJSON(url,data).then(
            response => {
                return Promise.resolve(response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },
    getCommissionDetail(data) {
        const url = `${host}/benefit/commission/settlement/detail`
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
