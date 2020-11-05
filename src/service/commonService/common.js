import HOST_CONFIG from 'hostconfig';
import { postJSON, } from '../../utils/ajax';
import { Loading } from 'element-ui';

let host = HOST_CONFIG.nethost;
export default {

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

};
