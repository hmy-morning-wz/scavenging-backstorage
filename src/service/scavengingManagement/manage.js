import HOST_CONFIG from 'hostconfig'
import * as ajax from 'ajax'
import { Loading } from 'element-ui'
import axios from 'axios'
import { getJSON, postJSON, putJSON, delData } from '../../utils/ajax'

let host = HOST_CONFIG.noGatewayNethost
let appId = HOST_CONFIG.appId
export default {
  getCookie() {
    var strCookie = document.cookie
    var arrCookie = strCookie.split('; ')
    var cookieName = 't-access-token'
    // console.log(arrCookie)
    for (var i = 0; i < arrCookie.length; i++) {
      var arr = arrCookie[i].split('=')
      if (cookieName == arr[0]) {
        return arr[1]
      }
    }
  },

  //获取菜单数据
  getMenuData() {    
    const url = `${host}/admin/menu/userAppMenu?appId=${appId}`
    const res = {
      method: 'GET',
      url: url,
      responseType: 'json',
      withCredentials: true
    }
    res.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      't-access-token': this.getCookie() || '2660000000007146_752823a739e14f1883a0dc7dcb805fcc_1001'
    }

    return axios(res).then(
      response => {
        return Promise.resolve(response.data || response)
      },
      response => {
        return Promise.reject(response.data || response)
      }
    )
  },

  //退出登录
  userLogout() {
    const loading = Loading.service({
      lock: true,
      text: '加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    const accesstoken = this.getCookie()
    const url = `${host}/admin/auth/logout?accesstoken=${accesstoken}`
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

  //修改密码
  modifyPwd(data) {
    const loading = Loading.service({
      lock: true,
      text: '加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    // const accesstoken = this.getCookie()
    const url = `${host}/admin/user/editInfo`
    return putJSON(url,data).then(
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
  
}
