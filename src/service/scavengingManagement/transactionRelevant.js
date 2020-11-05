import HOST_CONFIG from 'hostconfig'
import * as ajax from 'ajax'
import { getJSON, postJSON, putJSON, delData } from '../../utils/ajax'
import { Loading } from 'element-ui';

let host = HOST_CONFIG.nethost
export default {
  //获取充值列表表格数据
  getRechargeData(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/trade/recharge/list`
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
  // 获取充值详情
  getRechargeDetail(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/trade/recharge/detail`
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

  //获取消费列表表格数据
  getConsumeData(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/trade/consume/list`
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
  
  // 获取消费详情
  getConsumeDetail(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/trade/consume/detail`
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

  // 消费撤销
  consumeRefund(data) {
    const loading = Loading.service({
      lock: true,
      text: '撤销中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/trade/consume/refund`
    return postJSON(url,data).then(
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
  
  //获取套餐购买列表表格数据
  getPackageData(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/trade/cardticket/list`
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

  // 获取套餐购买详情
  getPackageDetail(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/trade/cardticket/detail`
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
  // v1.4超期交易
  getExtendedTrading(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/trade/overdu/list`
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

  // v3.0
  // 退款审核列表
  refundAuditList(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/trade/consume/refund/auditList`
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
  // 退款审核
  refundAudit(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/trade/consume/refund/audit`
    return postJSON(url,data).then(
      response => {
        loading.close()
        return Promise.resolve(response)
      },
      response => {
        loading.close()
        return Promise.reject(response)
      }
    )
  },
}
