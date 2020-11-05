<template>
    <div id="app">
        <!-- <router-view></router-view> -->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive">
                <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
            </router-view>
        </keep-alive>

        <router-view v-if="!$route.meta.keepAlive">
            <!-- 这里是不被缓存的视图组件，比如 page3 -->
        </router-view>
    </div>
</template>
<script>
import HOST_CONFIG from 'hostconfig'
let that = ''
export default {
  data() {
    return {}
  },
  methods: {},
  created() {
    that = this
  },
  watch: {
    $route: (to, from) => {
      // console.log(that.GLOBAL.pathList)
      let pathArr = []
      const item = {
        title: that.$route.meta.pageTitle,
        path: that.$route.path,
        active: true,
        fullPath: that.$route.fullPath
      }
      that.GLOBAL.pathList.forEach(element => {
        pathArr.push(element.path)
        if (element.path === that.$route.path) {
          element.active = true
        } else {
          element.active = false
        }
      })
      if (pathArr.indexOf(item.path) == -1 && item.title) {
        if (that.GLOBAL.pathList.length >= 8) {
          that.GLOBAL.pathList.shift()
        }
        that.GLOBAL.pathList.push(item)
      }
    }
  }
}
</script>
<style>
#app {
  font-family: 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #fff;
  height: 100%;
  width: 100%;
}
body,
div,
span,
header,
footer,
nav,
section,
aside,
article,
ul,
dl,
dt,
dd,
li,
a,
p,
h1,
h2,
h3,
h4,
h5,
h6,
i,
b,
textarea,
button,
input,
select,
figure,
figcaption {
  padding: 0;
  margin: 0;
  list-style: none;
  font-style: normal;
  text-decoration: none;
  border: none;
  font-family: 'Microsoft Yahei', sans-serif;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 0px;
  height: 10px;
  /* background-color: #f5f5f5; */
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
  border-radius: 10px;
  /* background-color: #f5f5f5; */
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
  background-color: #ebeef5;
}

input[type='button'],
input[type='submit'],
input[type='search'],
input[type='reset'] {
  -webkit-appearance: none;
}

textarea {
  -webkit-appearance: none;
}

html,
body {
  height: 100%;
  width: 100%;
}

.fillcontain {
  height: 100%;
  width: 100%;
}
.clear:after {
  content: '';
  display: block;
  clear: both;
}

.clear {
  zoom: 1;
}

.back_img {
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.margin {
  margin: 0 auto;
}

.left {
  float: left;
}

.right {
  float: right;
}

.hide {
  display: none;
}

.show {
  display: block;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

