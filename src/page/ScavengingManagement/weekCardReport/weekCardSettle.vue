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
        </div>
        <div class="optionLine2">        
          <el-tag type="info" plain>结算日期</el-tag>      
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

        </div>
        <div style="display:flex;margin-top:1.5rem;">
          <div class="optionLine22">              
            <div class="each">
              <el-tag type="info" plain>发卡商户</el-tag>
                <el-select v-model="searchParams.issuerCode"  @change="updateSelectData"  placeholder="(必选)请选择">
                  <el-option
                    v-for="item in issuerList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>   
            </div> 

            <div class="each">
              <el-tag type="info" plain>渠道</el-tag>
              <el-select v-model="disableChannel" v-if="!searchParams.issuerCode" disabled  placeholder="请先选择发卡主体"></el-select>
              <el-select v-model="searchParams.channelCode" v-if="searchParams.issuerCode"  placeholder="(必选)请选择">
                <el-option
                  v-for="item in channelList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </div>   

          </div>
          <el-button type="primary" plain  icon="el-icon-search" round @click="handleSearch"></el-button>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
          <el-table :data="tableData" size="small" border>
            <el-table-column prop="settDate" label="结算日期" align="center"></el-table-column>
            <el-table-column prop="saleNum" label="售卖笔数" align="center"></el-table-column>
            <el-table-column prop="saleAmt" label="售卖金额" align="center"></el-table-column>
            <el-table-column prop="refundNum" label="退款笔数" align="center"></el-table-column>
            <el-table-column prop="refundAmt" label="退款金额" align="center"></el-table-column>
            <el-table-column prop="settAmt" label="结算金额" align="center"></el-table-column>
            <el-table-column prop="channelServiceFee" label="渠道服务费" align="center"></el-table-column>
            <el-table-column prop="realIncome" label="实收金额" align="center"></el-table-column>
            <el-table-column prop="effectNum" label="生效笔数" align="center"></el-table-column>
            <el-table-column prop="effectAmt" label="生效金额" align="center"></el-table-column>
            <el-table-column prop="commission" label="分佣金额" align="center"></el-table-column>
            <el-table-column  label="操作" min-width="60" align="center" style="text-align:center">
              <template slot-scope="scope">
                <el-button size="small" type="text" plain @click="handleJump(scope.row)">商品报表</el-button>
              </template>
            </el-table-column>
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
import cardServer from '../../../service/scavengingManagement/weekCardReport.js'
import headTop from '../../../components/headTop'
import { weeks, ostreamRequset } from '../../../utils/common.js'

export default {
  data() {
    return {
      daterange: '',
      monthrange: '',
      loadingShow: false,
      cols: [],
      tableData: [],
      totalTable: [],
      cols2: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        startDate: '',
        endDate: '',
        dateType: 'day',
        issuerCode: '',
        channelCode: ''
      },
      totalSize: 0,
      issuerList: [],
      channelList: [],
      disableChannel: ''
    }
  },
  methods: {
    handleSearch() {
      if (this.searchParams.issuerCode && this.searchParams.channelCode) {
        this.getTableList(1)
      } else {
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        })
      }
    },

    handleJump(row) {
      this.$router.push(
        `./goodsDetail?date=${row.settDate}&dateType=${
          this.searchParams.dateType
        }&issuerCode=${row.issuerCode}&channelCode=${row.channelCode}`
      )
    },

    //获取表格数据
    getTableList(page) {
      if (!this.searchParams.startDate || !this.searchParams.endDate) {
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        })
        return
      }
      if (page != 1) {
        this.searchParams.currentPage = 1
      }
      cardServer.weekCardTotal(this.searchParams).then(
        response => {
          this.tableData = response.list || []
          this.totalSize = response.totalCount
        },
        response => {
          this.tableData = []
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },

    updateSelectData() {
      if (this.searchParams.issuerCode) {
        this.getSelectData(14, this.searchParams.issuerCode)
      } else {
        this.searchParams.channelCode = ''
      }
    },

    //获取下拉选项列表
    getSelectData(type, issuerCode, tradeTypeCode) {
      // debugger
      if ((type === 7 || type === 8) && !this.searchParams.issuerCode) {
        return
      } else {
        const data = {
          type: type,
          issuerCode: this.searchParams.issuerCode,
          tradeTypeCode: tradeTypeCode
        }
        cardServer.getSelectData(data).then(
          response => {
            if (type === 1) {
              this.issuerList = response
              this.searchParams.issuerCode = ''
            }
            if (type === 14) {
              this.channelList = response
              this.searchParams.channelCode = ''
            }
          },
          response => {
            this.$message.error(response.msg || '服务器连接失败！')
          }
        )
      }
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val
      this.getTableList(1)
    },

    // 时间单位选择
    handleClick(str) {
      this.searchParams.dateType = str
      this.daterange = []
      if (this.searchParams.issuerCode && this.searchParams.channelCode) {
        this.getTableList()
      }
    }
  },
  components: {
    headTop
  },
  beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    if (from.name === 'everydayChange') {
      to.meta.isBack = true
      //判断是从哪个路由过来的，
      //如果是everydayChange过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    }

    next()
  },
  activated() {
    if (!this.$route.meta.isBack) {
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      // this.getData();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false
  },
  async created() {
    this.daterange = weeks()
    this.searchParams.startDate = this.daterange[0]
    this.searchParams.endDate = this.daterange[1]
    this.getSelectData(1)
  },
  mounted() {},
  updated() {}
}
</script>
<style lang="scss" scoped>
.outermost {
  padding: 2rem;
  height: 100%;
  // background-color: #f5f7fa//rgba(0, 0, 0, 0.04);
}
.queryOption {
  background-color: white;
  padding: 1rem;
  // width: 92%;
}
.queryResult {
  // padding: 2rem;
  padding-top: 1rem;
}

.inputOption {
  width: 36rem;
}

.each {
  margin-right: 1.5rem;
}
.tableList,
.totalTable {
  margin-bottom: 1.5rem;
  // box-shadow: 0 -2px 8px 0 rgba(0,0,0,0.08);
}
.foot-page {
  background-color: white;
  // width: 60%;
}
.inputOption {
  display: inline-block;
}
.nowWrap {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.optionLine2 {
  clear: both;
  display: flex;
  margin-top: 4.2rem;
}
.el-tag {
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
.chooseBtn {
  margin: 0;
}
.activeBtn {
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}
.optionLine22 {
  display: flex;
}
</style>