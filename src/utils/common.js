export const weeks = () => {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
  const startDate = getFormatDate(start)
  const endDate = getFormatDate(end)
  return [startDate, endDate]
};
export const yesterday = () => {
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
  const beforeDate = getFormatDate(start)
  return [beforeDate,beforeDate]
};
export const today = () => {
  const start = new Date()
  const today = getFormatDate(start)
  return today
};

const getFormatDate = (date) => {
  // var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate //+ ' 00:00:00'
  return currentdate
};

const getToken = () => {
  var strCookie =
    document.cookie || 't-access-token=01B496B57FCF62B9F27490153F5051E8'
  var arrCookie = strCookie.split('; ')
  var cookieName = 't-access-token'
  // console.log(arrCookie)
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split('=')
    if (cookieName == arr[0]) {
      return arr[1]
    }
  }
};

export const ostreamRequset = (url, formData) => {
  const token = getToken()
  let xmlhttp = ''
  let that = this
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest()
    xmlhttp.withCredentials = true
  } else {
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    xmlhttp.withCredentials = true
  }
  xmlhttp.open('post', `${HOST_CONFIG.nethost}${url}`, true)
  xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
  xmlhttp.setRequestHeader('t-access-token', `${token}`)

  xmlhttp.responseType = 'blob'
  // xmlhttp.setRequestHeader('Authorization', ak);
  xmlhttp.send(JSON.stringify(formData))
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    //   debugger
      const datas = new Blob([this.response], {
        type: 'application/octet-stream'
      })
      const myfile = decodeURIComponent(
        xmlhttp.getResponseHeader('filename')
      )
      const textFile = window.URL.createObjectURL(datas)
      if (textFile !== null) {
        let a = document.createElement('a')
        a.style = 'display:none'
        document.body.appendChild(a)
        a.href = textFile
        a.download = `${myfile}`
        a.click()
        window.URL.revokeObjectURL(textFile)
      }
    }
    if (xmlhttp.status !== 200) {
      that.$message.error('请求出错！')
    }
  }
}