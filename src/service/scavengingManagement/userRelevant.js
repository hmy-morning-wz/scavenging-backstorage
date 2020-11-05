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
    //获取发卡列表表格数据
    getTableData(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        const url = `${host}/user/list`
        return postJSON(url,data).then(
            response => {
                loading.close()
                return Promise.resolve(response.data || response)
            },
            response => {
                loading.close()
                return Promise.reject(response || response.data)
            }
        )
    },

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
    // 获取卡详情
    getCardDetail(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        const url = `${host}/user/detail`
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
    // 获取卡事件明细
    getEventList(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        const url = `${host}/user/event`
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

    // 获取余额异常用户数据列表
    getAbnormalList(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        const url = `${host}/user/abnormal/list`
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

    // 获取余额异常用户汇总
    getAbnormalInfo() {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        const url = `${host}/user/abnormal/sum`
        return postJSON(url).then(
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

    // 获取退卡用户数据
    getEcRefundList(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        const url = `${host}/user/refund/list`
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

    // 获取退卡用户数据退卡审核
    auditRefund(data) {
        const loading = Loading.service({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        const url = `${host}/user/refund/check`
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
