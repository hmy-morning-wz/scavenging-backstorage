import HOST_CONFIG from 'hostconfig'
import * as ajax from 'ajax'
import { getJSON, postJSON, putJSON, delData } from '../../utils/ajax'
import { Loading } from 'element-ui';

let host = HOST_CONFIG.nethost
export default {
  //获取订单列表表格数据
  getOrderList(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/benefit/order/list`
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

  getProductData(data) {
    const url = `${host}/benefit/product/list`
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
  getOrderDetail(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/benefit/order/detail`
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
