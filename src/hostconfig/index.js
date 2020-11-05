
const apiHost = {};


if (process.env.ENV === 'dev') {
    apiHost.nethost = 'http://sit-basic-gw.allcitygo.com/ebusbms';
    apiHost.noGatewayNethost = 'http://sit-basic-gw.allcitygo.com';
    apiHost.bmserver = 'http://sit-sso.allcitygo.com/login?appId=1001';
    apiHost.appId = 1001
    // apiHost.nethost = 'http://10.0.0.151:8097/ebusbms';
    // apiHost.bmserver = 'http://10.0.0.120:9080/sso-server/login?appId=1001';
}
if (process.env.ENV === 'test') {
    apiHost.nethost = 'https://bmapi.allcitygo.com:13002';
}
if (process.env.ENV === 'beta') {
    apiHost.nethost = 'https://bmapi.allcitygo.com:13002';
}
if (process.env.ENV === 'v5') {
    apiHost.nethost = 'https://bmapi.allcitygo.com:13002';
}
if (process.env.ENV === 'release') {
    apiHost.nethost = 'https://bmapi.allcitygo.com:13002/ebusbms';
    apiHost.noGatewayNethost = 'https://bmapi.allcitygo.com:13002';
    apiHost.bmserver = 'https://sso.allcitygo.com/login?appId=1003';
    apiHost.appId = 1003
}


export default apiHost;
