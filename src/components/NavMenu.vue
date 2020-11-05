<template>
  <div>
    <!-- 根据实际情况做修改 -->
    <div v-for="(item,index) in navlist" :key="item.id" >
        <el-submenu
      
      
      v-if="item.children.length>0"
      :index="String(index)+item.id"
    >
      <template slot="title">
        <i :class="iconMuen[index]"></i>
        {{item.name}}
      </template>
      <!-- <el-menu-item
      class="comm-pdl50"
      v-for="(sitem,index2) in item.children"
      :key="index2"
      :index="sitem.path"
    >{{sitem.name}}</el-menu-item> -->
      <NavMenu :navlist="item.children"></NavMenu>
    </el-submenu>

    

    <el-menu-item v-if="item.children.length==0"
                            :index="item.path"><i :class="iconMuen[index]"></i>{{item.name}}</el-menu-item>

    <!-- <el-menu-item
      v-for="(item,index) in navlist"
      :key="index"
      v-if="item.adminMenu.menuType=='page'"
      :index="item.adminMenu.url"
    >
      <i class="el-icon-location"></i>
      <span>{{item.adminMenu.code}}</span>
    </el-menu-item> -->
    </div>
    
  </div>
</template>
 
<script>
export default {
  name: "NavMenu",
  props: ["navlist"],
  data() {
    return {
        iconMuen: []
    };
  },
  created(){
      // console.log("navlist===",this.navlist);
  },
  methods: {}
};
</script>
<style lang='scss' >
//如果没有此样式的话  折叠有子级菜单的父菜单文字是不会隐藏的
.el-menu--collapse .el-menu-item span,
.el-menu--collapse .el-submenu .el-submenu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}

// .el-menu--collapse{
//   width: 60px!important;
//   .el-submenu__icon-arrow{
//     opacity: 0;
//   }
// }
</style>