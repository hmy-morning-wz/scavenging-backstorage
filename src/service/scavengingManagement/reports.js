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
    //获取商户交易汇总表格数据
    getTableData(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/merchant/tradeGather`
        return postJSON(url, data).then(
            response => {
                loading.close()
                return Promise.resolve(response)
            },
            response => {
                loading.close()
                return Promise.reject(response.data || response)
            }
        )
    },
    //获取商户交易列表表格数据
    getTableData2(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/merchant/trade`
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

    //获取下拉框选项列表
    getSelectData(data) {
        const url = `${host}/common/filterlist`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    //获取账户变动月表格数据
    getChangeMonth(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/account/changemonth`
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
    //获取账户变动日表格数据
    getChangeDay(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/account/changeday`
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

    //获取财务结算入金汇总
    depositGather(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/settle/depositGather`
        return postJSON(url, data).then(
            response => {
                loading.close()
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    //获取财务结算入金汇总v2
    depositGatherV2(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/v2/settle/depositGather`
        return postJSON(url, data).then(
            response => {
                loading.close()
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    //获取财务结算入金列表
    deposit(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/settle/deposit`
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
    //获取财务结算入金列表
    depositV2(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/v2/settle/deposit`
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

    //获取财务结算出金列表
    withdraw(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/settle/withdraw`
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

    //获取财务结算出金汇总
    withdrawGather(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/settle/withdrawGather`
        return postJSON(url, data).then(
            response => {
                loading.close()
                return Promise.resolve(response)
            },
            response => {
                loading.close()
                return Promise.reject(response.data || response)
            }
        )
    },

    //导出报表
    reportExport(data, urll) {
        const loading = Loading.service({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}${urll}`
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

    //发卡统计报表
    cardStatistics(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/channel/card/statics`
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
    //发卡统计汇总报表
    cardTotalStatistics(data) {
        const url = `${host}/report/channel/card/statics/merge`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    //交易统计报表
    tradeStatistics(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/channel/trade/statics`
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

    //套餐购买统计报表
    packageStatistics(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/cardticket/statics`
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
    //套餐购买统计汇总报表
    packageTotalStatistics(data) {
        const url = `${host}/report/cardticket/statics/merge`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    //渠道抵扣统计报表
    discountStatistics(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/channel/tax/statics`
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
    //渠道抵扣统计汇总报表
    discountTotalStatistics(data) {
        const url = `${host}/report/channel/tax/statics/merge`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    // v1.3
    //获取商户交易汇总表格数据v2
    merchantGatherV2(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/v2/merchant/tradeGather`
        return postJSON(url, data).then(
            response => {
                loading.close()
                return Promise.resolve(response)
            },
            response => {
                loading.close()
                return Promise.reject(response.data || response)
            }
        )
    },
    //获取商户交易列表表格数据v2
    merchantDataV2(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/v2/merchant/trade`
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
    // v2.2
    //获取商户交易汇总的汇总表格数据
    merchantGatherAll(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/v2/merchant/tradeGatherAll`
        return postJSON(url, data).then(
            response => {
                loading.close()
                return Promise.resolve(response)
            },
            response => {
                loading.close()
                return Promise.reject(response.data || response)
            }
        )
    },
    //获取异常交易报表表格数据
    abnormalList(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/trade/consume/abnormal`
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
    // v1.4
    //入金分类查看
    depositView(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/settle/deposit/detail`
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
    //出金分类查看
    withdrawView(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/settle/withdraw/detail`
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
    // v1.4.1
    //周期卡结算/售卖报表
    weekCardList(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/benefit/statics`
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
    //周期卡结算/售卖汇总报表
    weekCardTotal(data) {
        const url = `${host}/report/benefit/statics/merge`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },

    // v2.2
    //退卡统计报表
    refundStatistics(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/channel/card/refund/statics`
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
    //退卡统计汇总报表
    refundTotalStatistics(data) {
        const url = `${host}/report/channel/card/refund/statics/merge`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },
    //获取财务结算出金汇总
    withdrawGatherAll(data) {
        const loading = Loading.service({
            lock: true,
            text: '正在查询中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const url = `${host}/report/settle/withdrawGatherAll`
        return postJSON(url, data).then(
            response => {
                loading.close()
                return Promise.resolve(response)
            },
            response => {
                loading.close()
                return Promise.reject(response.data || response)
            }
        )
    },

    // v3.0
    //机具结算失败报表
    settleFailureList(data) {
        const url = `${host}/trade/consume/abnormal`
        return postJSON(url, data).then(
            response => {
                return Promise.resolve(response.data || response)
            },
            response => {
                return Promise.reject(response.data || response)
            }
        )
    },
}
