import HOST_CONFIG from 'hostconfig'
import * as ajax from 'ajax'
import { getJSON, postJSON, putJSON, delData } from '../../utils/ajax'
import { Loading } from 'element-ui';

let host = HOST_CONFIG.nethost
export default {
  //获取充值列表表格数据
  getLogData(data) {
    const loading = Loading.service({
      lock: true,
      text: '正在查询中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const url = `${host}/sys/log/list`
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


}
