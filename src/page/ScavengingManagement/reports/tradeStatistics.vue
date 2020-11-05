<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div>
          <div>
            <el-button class="chooseBtn" :class="{activeBtn : searchParams.dateType === 'day'} " @click="handleClick('day')" style="float: left;border-right:none">日</el-button>
            <el-button class="chooseBtn" :class="{activeBtn : searchParams.dateType === 'month'} " @click="handleClick('month')" style="float: left;border-left:none;border-right:none">月</el-button>
            <el-button class="chooseBtn" :class="{activeBtn : searchParams.dateType === 'year'} " @click="handleClick('year')" style="float: left;border-left:none">年</el-button> 
          </div>
          <div style="margin-left:11rem;">
            <el-button class="chooseBtn" :class="{activeBtn : searchParams.type === 'amt'} " @click="handleClick('amt',2)" style="float: left;border-right:none">金额</el-button>
            <el-button class="chooseBtn" :class="{activeBtn : searchParams.type === 'num'} " @click="handleClick('num',2)" style="float: left;border-left:none">份数</el-button> 
          </div>
          <div class="optionLine2">              
            <div class="each">
               <div v-if="searchParams.dateType === 'day'">
                <el-date-picker
                  v-model="searchParams.startDate"
                  type="date"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="开始日期">
                </el-date-picker> 至 
                <el-date-picker
                  v-model="searchParams.endDate"
                  type="date"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="结束日期">
                </el-date-picker>
              </div>

              <div v-if="searchParams.dateType === 'month'">
                <el-date-picker
                  v-model="searchParams.startDate"
                  type="month"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="开始月份">
                </el-date-picker> 至 
                <el-date-picker
                  v-model="searchParams.endDate"
                  type="month"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="结束月份">
                </el-date-picker>
              </div>

              <div v-if="searchParams.dateType === 'year'">
                <el-date-picker
                  v-model="searchParams.startDate"
                  type="year"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="开始年份">
                </el-date-picker> 至 
                <el-date-picker
                  v-model="searchParams.endDate"
                  type="year"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="结束年份">
                </el-date-picker>
              </div>
            </div> 

            <el-button type="primary" plain  icon="el-icon-search" round @click="getTableList"></el-button>
            <!-- <el-button type="primary" plain  icon="el-icon-printer" @click="chartsExport" style="position:absolute;right:4rem;">导出报表</el-button> -->
            <el-button type="primary" plain style="margin-left:1.5rem;" @click="chartsExport">导出报表</el-button>
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
            <el-table :data="tableData" size="small" border>
              <el-table-column prop="time" label="交易"  min-width="95"  align="center"></el-table-column>
              <template v-for="(col,index) in cols" >
                <el-table-column :key="index" :label="col.firstLabel" align="center">
                  <template v-for="(col2,index2) in col.secondLabels" >
                    <el-table-column :key="index2" :label="col2.label"  min-width="95" :prop="col2.prpo" align="center">
                    </el-table-column>
                  </template>
                </el-table-column>
              </template>
            </el-table>
        </div>
        <el-card shadow='never'>
          <div class="foot-page" style="text-align:center">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.currentPage" :page-sizes="[10]" :page-size="searchParams.showCount" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
            </el-pagination>
          </div>
        </el-card>
      </div>
    </div>
    </div>
</template>
<script>
import cardServer from "../../../service/scavengingManagement/reports.js";
import headTop from '../../../components/headTop'
import { weeks, ostreamRequset } from '../../../utils/common.js'

export default {
  data() {
    return {
      daterange:'',    
      monthrange: '', 
      loadingShow: false,
      cols: [],
      tableData: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        startDate: '',
        endDate: '',
        dateType: 'day',
        type: 'amt'
      },
      totalSize: 0
      }
  },
  methods: {
    //获取表格数据
    getTableList(page){
      if(!this.searchParams.startDate || !this.searchParams.endDate){
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        });
        return
      }
      if(page!=1) {
        this.searchParams.currentPage = 1 }
      cardServer.tradeStatistics(this.searchParams).then(
        response => {
          this.tableData = response.tableInfos
          this.cols = response.labelInfos
          this.totalSize = response.totalNum
        },
        response => {
          this.tableData = []
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val;
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val;
      this.getTableList(1)
    },

    // 时间单位选择
    handleClick(str,type) {
      if(type) {
        this.searchParams.type = str
      } else {
        this.searchParams.dateType = str  
        // this.daterange = [] 
      }
      this.getTableList()
    },
    
    chartsExport() {
      if(!this.searchParams.startDate || !this.searchParams.endDate){
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        });
        return
      }
      const formData = this.searchParams
      delete formData.currentPage
      delete formData.showCount
      const url = '/export/channel/trade/statics'
      cardServer.reportExport(formData,url).then(
        response => {
          if(response.emptyData){
            this.$message.error(response.showMessage);
          }else{
            location.href = response.downloadUrl
          }          
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
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
    if(from.name==='everydayChange'){
        to.meta.isBack=true;
        //判断是从哪个路由过来的，
        //如果是everydayChange过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    }

    next();
  },
  activated() {
    if(!this.$route.meta.isBack){
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      // this.getData();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack=false

  },
  async created(){
    this.daterange = weeks()
    this.searchParams.startDate = this.daterange[0]
    this.searchParams.endDate = this.daterange[1]
    await this.getTableList()
  },
  mounted(){
  },
  updated() {
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

.each{
  margin-right: 1.5rem;
}
.tableList, .totalTable{
  overflow: scroll;
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
  width: 80%;
  margin: 0 auto;
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}
.optionLine2{
  margin-left: 20.5rem;
  display: flex;
}
.el-tag{
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
.chooseBtn {
  margin: 0;
}
.activeBtn{
  background: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}
.el-date-editor.el-input {
  width: 160px;
}
</style>