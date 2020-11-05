<template>
    <div class="manage_page fillcontain">
      <div style="height: 100%;" class="header">
          <el-col :span="4" style="min-width:180px;background-color: #00142a;height:fit-content;" >
            <div style="min-height: 100vh;">
              <div style="height:100%">

                <el-menu  :default-active="defaultActive" style="min-height: 120vh;" theme="dark"
                 router background-color="#00142a" text-color="#fff" unique-opened @select="handleSelect">

                 <NavMenu v-if="subMenu.length >0 " :navlist="subMenu"></NavMenu>
                  <!-- <div class="leftTit">
                    <div class="line1">后管系统</div>
                    <div class="line2">通卡联城</div>
                  </div> -->
                  <!-- <div v-if="subMenu">
                      <div v-for="(item , index1) in subMenu" :key="index1">
                        <el-submenu :index="String(index1+1)" v-if="item.children.length>0">
                            <template slot="title">{{item.name}}</template>
                            <div v-for="(item2 , idx2) in item.children" :key="idx2">
                              <el-submenu :index="String(idx2+1+subMenu.length)" v-if="item2.children.length>0">
                                <template slot="title">{{item2.name}}</template>
                                <el-menu-item class="comm-pdl50"  v-for="(sitem,index2) in item2.children"
                                :key="index2" :index="sitem.path">{{sitem.name}}</el-menu-item>
                              </el-submenu> 
                              <el-menu-item v-if="item2.children.length==0"
                                  :index="item2.path">{{item.name}}</el-menu-item>
                            </div>
                        </el-submenu> 
                        <el-menu-item v-if="item.children.length==0"
                            :index="item.path">{{item.name}}</el-menu-item>
                      </div>
                    
                  </div> -->
                </el-menu>
              </div>
            </div>
          </el-col>
          
          <el-col :span="20">
            <div style="min-height:100vh;position:relative;" class="menuView">
              <div class="pathList" v-if="GLOBAL && GLOBAL.pathList">
                <div class="eachPath" :class="{activePath : item.active === true} " v-for="(item,index) in GLOBAL.pathList" :key="index">
                  <div class="circle" :class="{activeCirCle : item.active === true} " @click="clickPath(item)"></div>
                  <div class="pathname" @click="clickPath(item)">
                    {{item.title}}
                  </div>
                  <div v-if="GLOBAL.pathList.length>1" @click="closePath(item)"><i class="el-icon-close"></i></div>
                </div>
              </div>
              <!-- <div v-if="$route.path=='/index' || $route.path=='/'" class="welcome">
                <div>欢迎来到</div>
                <br>
                <div>扫码后管</div>
              </div> -->
              <div style="margin-top:43px;"></div>
              <keep-alive>
                  <router-view v-if="$route.meta.keepAlive">
                      <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
                  </router-view>
              </keep-alive>

              <router-view :key="$route.fullPath" v-if="!$route.meta.keepAlive">
                  <!-- 这里是不被缓存的视图组件，比如 page3 -->
              </router-view>
            </div>
          </el-col>      
      </div>

      <div class="logoutBan">
        <!-- <el-tooltip content="用户" placement="bottom-start"> -->
          <div class="userIcon">
            <img src="../assets/images/xingming@3x.png" alt="">
          </div>
        <!-- </el-tooltip> -->
        <el-popover
          placement="bottom"
          trigger="hover"
          width="100">
          <div style="text-align: center; margin: 0">
            <el-button style="border:none;width:100%" size="mini" @click="logout">退出登录</el-button>
          </div>
          <div style="text-align: center; margin: 0">
            <el-button style="border:none;width:100%" size="mini" @click="modifyPwd">修改密码</el-button>
          </div>
          <i class="el-icon-setting logoutIcon" slot="reference"></i>
        </el-popover>
      </div>
    </div>
</template>

<script>
import { Loading } from 'element-ui'
import HOST_CONFIG from 'hostconfig'
import manageServer from '../service/scavengingManagement/manage.js'
import NavMenu from '../components/NavMenu'
export default {
  computed: {
    defaultActive: function() {
      return this.$route.fullPath
    }
  },
  data() {
    return {
      is_index: false,
      path: location.hash,
      menu: '',
      subMenu: [],
      iconMuen: [
        'el-icon-menu',
        'el-icon-document',
        'el-icon-plus',
        'el-icon-tickets',
        'el-icon-star-on',
        'el-icon-mobile-phone'
      ]
    }
  },
  components: {
    NavMenu
  },
  methods: {
    //获取菜单数据
    getMenuData() {
      manageServer.getMenuData().then(
        response => {
          if (response.code == '401') {
            location.replace(HOST_CONFIG.bmserver)
          }
          if (response && response instanceof Array) {
            this.subMenu = response[0].children
            console.log(location)
          }
        },
        response => {
          this.$message.error(response.msg || '获取菜单失败')
        }
      )
    },
    getCookie(name) {
      var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      if ((arr = document.cookie.match(reg))) return unescape(arr[2])
      else return null
    },
    handleSelect(index, indexPath) {
      console.log(index)
      console.log(indexPath)
    },
    delCookie(name) {
      var exp = new Date()
      exp.setTime(exp.getTime() - 1)
      var cval = this.getCookie(name)
      console.log(cval)
      if (cval != null)
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    },
    //用户退出登录
    userLogout() {
      manageServer.userLogout().then(
        response => {
          this.delCookie('t-access-token')
          location.replace(HOST_CONFIG.bmserver)
        },
        response => {
          this.$message.error(response.msg || '退出失败')
        }
      )
    },
    logout() {
      this.$confirm('确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.userLogout()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    clickPath(item) {
      this.$router.push(item.fullPath)
    },
    closePath(item) {
      let pos = -1
      this.GLOBAL.pathList.forEach((element, index) => {
        if (element.path === item.path) {
          pos = index
        }
      })
      if (pos > -1) {
        this.GLOBAL.pathList.splice(pos, 1)
      }
      if (item.path === this.$route.path) {
        let path = ''
        if (pos === 0) {
          path = this.GLOBAL.pathList[0].fullPath
        } else {
          path = this.GLOBAL.pathList[pos - 1].fullPath
        }
        this.$router.push(path)
      } else {
        if (this.$route.fullPath && this.$route.fullPath.indexOf('?') > -1) {
          this.$router.push(this.$route.fullPath + '&refresh=' + Math.random())
        } else {
          this.$router.push(this.$route.fullPath + '?refresh=' + Math.random())
        }
      }
    },
    modifyPwd() {
      this.$router.push('/modifyPwd')
    }
  },
  async created() {
    if (this.$route.query.sessionId) {
      // if(location.hostname == 'localhost') {
      document.cookie = 't-access-token=' + this.$route.query.sessionId
      // } else {
      //   document.cookie = 't-access-token='+this.$route.query.sessionId+';domain=.allcitygo.com'
      // }
    }

    const loading = Loading.service({
      lock: true,
      text: '正在加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.9)'
    })
    await this.getMenuData()
    loading.close()
    if (this.$route.path === '/' || this.$route.path === '/index') {
      this.$router.push('overview')
    }
  }
}
</script>


<style lang="scss" scoped>
.header {
  display: flex;
}
.test:after {
  content: ' ';
  display: block;
  height: 0;
  clear: both;
}
.comm-pdl50 {
  padding-left: 50px !important;
  min-width: 100px;
}

.el-menu {
  border-right: solid 0px #e6e6e6;
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
  background-color: #fff;
}
.menuView {
  height: 100vh;
  overflow-y: auto;
}
.logoutBan {
  position: fixed;
  z-index: 100;
  top: 8px;
  right: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.userIcon {
  // background: white;
  border-radius: 50%;
  height: 2rem;
  width: 2rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.logoutIcon {
  font-size: 18px;
  margin-left: 0.5rem;
}
.welcome {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -58%);
  color: #409eff;
  font-size: 28px;
  font-weight: 600;
}
.leftTit {
  height: 60px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #002140;
  color: #409eff;
  font-size: 22px;
  font-weight: 600;
  .line2 {
    font-size: 14px;
    color: #fdfdfd;
  }
}
.pathList {
  // position: fixed;
  z-index: 100;
  width: 100%;
  display: flex;
  padding: 5px 10px;
  background: #fff;
  .eachPath {
    display: flex;
    align-items: center;
    border: 1px solid #eee;
    border-radius: 3px;
    color: #495060;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    margin: 2px 4px 2px 0;
    padding: 0 10px;
    .circle {
      width: 12px;
      height: 12px;
      background-color: #eee;
      border-radius: 50%;
    }
    .pathname {
      margin: 0 6px;
    }
  }
  .activePath {
    border: 1px solid #409eff;
    .activeCirCle {
      background-color: #409eff;
    }
  }
}
</style>
