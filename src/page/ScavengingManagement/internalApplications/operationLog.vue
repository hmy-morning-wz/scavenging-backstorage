<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card  shadow="never">
        <div class="queryOption">
           
              
              <div class="fastQuery">
                <el-tabs v-model="activeName2" type="card">
                  <el-tab-pane label="操作账号" name="first">
                    <span slot="label"><i class="el-icon-phone-outline"></i>操作账号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入操作账号"
                        suffix-icon="el-icon-phone-outline"
                        v-model="user"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch('user')"></el-button>
                  </el-tab-pane>
                  <el-tab-pane label="操作ip" name="second">                
                    <span slot="label"><i class="el-icon-goods"></i>操作ip</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入操作ip"
                        suffix-icon="el-icon-goods"
                        v-model="ip"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch('ip')"></el-button>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div class="compoundQuery">
                <div class="optionLine1">
                  <div class="chooseDate">
                    <el-tag type="info" plain>操作时间</el-tag>
                    <el-date-picker
                      v-model="tradeDaterange"
                      type="daterange"
                      unlink-panels
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </div>
                  <!-- <div class="chooseDate">
                    <el-tag type="info" plain>入账时间</el-tag>
                    <el-date-picker
                      v-model="entryDaterange"
                      type="daterange"
                      unlink-panels
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker></div> -->
                </div>
            
              </div>
           
        </div>
      </el-card>

      
      <div class="queryResult" >
        <div class="tableList">
            <el-table :data="rechargeList2" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="gmtCreate" label="操作时间" align="center"></el-table-column>
                <el-table-column prop="createBy" label="操作账号" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.createBy}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="remoteAddr" label="操作ip" show-overflow-tooltip align="center"></el-table-column>              
                <el-table-column prop="menuPath" label="操作路径" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.menuPath}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="操作行为" show-overflow-tooltip align="center">
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.title}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="statusName" label="日志明细" align="center" ></el-table-column>
                <el-table-column  label="操作" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button size="small" type="text" plain class="ml10" @click="handleJump2(scope.row)">套餐详情<i class="el-icon-zoom-in"></i></el-button>
                        </div>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <el-card shadow="never">
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="compoundSearchParams.currentPage" :page-sizes="[10,20,30,50,100]" :page-size="compoundSearchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize2">
            </el-pagination>
          </div>
        </el-card>
      </div>
    </div>
    </div>
</template>
<script>
import tradeServer from "../../../service/scavengingManagement/operationLog.js";
import headTop from '../../../components/headTop'
export default {
  data() {
    return {
      activeName: 'first',
      activeName2: 'first',
      activeName3: 'first',
      selectValue: '',
      selectValue2: '',
      selectVal: '',
      selectVal2: '',
      searchKey: 'orderNo',
      compoundKey:'user',
      nowDate1:'',
      nowDate2: '',
      rechargeList: [],
      rechargeList2: [],
      tradeDaterange:'',
      entryDaterange:'',
      issuerList: [],
      channelList: [],
      issuer:'',
      channel: '',
      disableChannel: '',
      user:"",
      ip:"",
      
    loadingShow: false,
    currentOption: {},
    quickSearchParams:{
      isQuickScreen: true,
      currentPage: 1,
      showCount: 10,
      orderNum: '',
      channelNum: ''
    },
    compoundSearchParams:{
      currentPage: 1,
      showCount: 10,
      startDate: '',
      endDate: '',
      ip: '',
      user: ''
    },
    totalSize: 0,
    totalSize2: 0
    };
  },
  methods: {
    
    //复合检索
    compoundSearch(compoundKey){
      this.compoundKey = compoundKey
      this.selectVal2 = this.selectValue2
      if(compoundKey === 'user'){
        this.compoundSearchParams.user = this.user;
        this.compoundSearchParams.ip = '';
      }else
      if(compoundKey === 'ip'){
           this.compoundSearchParams.ip = this.ip;
        this.compoundSearchParams.user = '';
      }
      
      this.compoundSearchParams.startDate = this.tradeDaterange ? this.tradeDaterange[0] : ''
      this.compoundSearchParams.endDate = this.tradeDaterange ? this.tradeDaterange[1] : ''

      this.getTableList();
      
      // if ((this.compoundSearchParams.ip || this.compoundSearchParams.user) ) {
      //     if (this.compoundSearchParams.startDate) {
      //         this.getTableList();
      //     } else {
      //       this.$message.error('请选择操作时间！');
      //     }
      // }else {
      //       this.$message.error('请填写操作账号或者操作ip！');
      // }
      
      
    },

    //获取表格数据
    getTableList(){
    //   var oobj = Object.assign(this.currentOption,this.compoundSearchParams)
      const data = this.handparams(this.compoundSearchParams);
      tradeServer.getLogData(data).then(
        response => {
          if(response.list instanceof Array) {
            
              this.rechargeList2 = response.list
              this.totalSize2 = response.totalCount
            
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },


    handleSizeChange2(val) {
      // debugger
      this.compoundSearchParams.showCount = val;
    //   this.selectValue2 = this.selectVal2
    //   this.tradeDaterange = [this.currentOption.startTime,this.currentOption.endTime]
    //   var oobj = Object.assign(this.compoundSearchParams,this.currentOption)
      if(this.compoundKey === 'user'){
        this.activeName3 = 'first'
      }else{
        this.activeName3 = 'second'
      }
      this.compoundSearch(this.compoundKey)
    },
   
    handleCurrentChange2(val) {
      // debugger
      this.compoundSearchParams.currentPage = val;
    //   this.selectValue2 = this.selectVal2
    //   this.tradeDaterange = [this.currentOption.startDate,this.currentOption.endDate]   
    //   var oobj = Object.assign(this.compoundSearchParams,this.currentOption)
      if(this.compoundKey === 'user'){
        this.activeName2 = 'first'
      }else{
        this.activeName2 = 'second'
      }
      this.compoundSearch(this.compoundKey)
    },

    
    hidden(str,link,frontLen,endLen) { 
        var len = str.length-frontLen-endLen;
        var xing = '';
        if(len > 4){
          xing += (link+link+link+link)
        }else{
          for (var i=0;i<len;i++) {
            xing+=link;
          }
        }
        return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
    },

    //参数处理
    handparams(param) {
      for (const i in param) {
        if (param[i] === "") {
          delete param[i];
        }
      }
      // console.log("data===" + JSON.stringify(params))
      return param;
    },

  },

  components: {
    headTop
  },
  beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    // if(from.name==='cardDetail' || 'rechargeDetail'){
    //     to.meta.isBack=true;
    //     //判断是从哪个路由过来的，
    //     //如果是everydayChange过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    // }

    next();
  },
  activated() {
    // if(!this.$route.meta.isBack){
    //   // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
    //   // this.getData();
    // }
    // // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    // this.$route.meta.isBack=false

  },

  

  created(){
    this.getTableList();
  },

  mounted(){
  },
  updated() {
    // console.log(this.tradeDaterange)
  }
};
</script>
<style lang="scss" scoped>
.outermost {
  padding: 2rem;
  height: 100%;
  // background-color: #f5f7fa//rgba(0, 0, 0, 0.04);
}
.queryOption{
  background-color: white;
  padding: 1rem;
  // width: 92%;
}
.queryResult{
  // padding: 2rem;
  padding-top: 1rem;
}

.inputOption{
  width: 36rem;
}
.chooseDate{
  margin-top: 0.8rem;
}
.optionLine2{
  display: flex;
  margin-top: 1rem;
}
.each{
  margin-right: 1.5rem;
}
.tableList, .totalTable{
  margin-bottom: 1.5rem;
  // box-shadow: 0 -2px 8px 0 rgba(0,0,0,0.08);
}
.foot-page{
  background-color: white;
  // width: 60%;
}
.inputOption{
  display:inline-block;
}
.nowWrap{
  width: 70%;
  margin: 0 auto;
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}
.radioDiv{
  padding: 0 1rem 1rem 1rem;
  float: right;
}
.el-tag{
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>
