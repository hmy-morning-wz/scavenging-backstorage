import HOST_CONFIG from 'hostconfig'
import * as ajax from 'ajax'
import { getJSON, postJSON, putJSON, delData } from '../../utils/ajax'
import { Loading } from 'element-ui';

let host = HOST_CONFIG.nethost
export default {
  // v2.2.1券统计

  //获取发券方下拉框
  getSourceList(data) {
    const url = `${host}/voucher/source`
    return postJSON(url, data).then(
        response => {
            return Promise.resolve(response.data || response)
        },
        response => {
            return Promise.reject(response.data || response)
        }
    )
  },
  
  // v2.2.2优化
  //获取采购方下拉框
  getPurchaserList(issuerCode) {
    const url = `${host}/voucher/purchaser`
    return postJSON(url, {issuerCode}).then(
        response => {
            return Promise.resolve(response.data || response)
        },
        response => {
            return Promise.reject(response.data || response)
        }
    )
  },
  //获取活动下拉框
  getActivityList(issuerCode) {
    const url = `${host}/voucher/activity`
    return postJSON(url, {issuerCode}).then(
        response => {
            return Promise.resolve(response.data || response)
        },
        response => {
            return Promise.reject(response.data || response)
        }
    )
  },

  // 券统计表
  getCouponStatistics(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/voucher/summary`
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

  // 券统计汇总表
  getCouponStatisticsAll(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/voucher/summary/all`
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

  // 券日汇总
  getCouponDayList(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/voucher/daysummary`
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
