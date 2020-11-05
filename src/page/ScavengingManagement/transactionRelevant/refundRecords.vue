<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div>
          <div>
            <el-button class="chooseBtn" :class="{activeBtn : searchParams.status === 0} " @click="handleClick(0)" style="float: left;border-right:none">待审核</el-button>
            <el-button class="chooseBtn" :class="{activeBtn : searchParams.status === 1} " @click="handleClick(1)" style="float: left;border-left:none">退款成功</el-button> 
          </div>
          <div class="optionLine2">              
            <div class="each">
                <el-tag type="info" plain>申请撤销时间</el-tag>
                <el-date-picker
                  v-model="searchParams.startTime"
                  type="date"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="开始日期">
                </el-date-picker> 至 
                <el-date-picker
                  v-model="searchParams.endTime"
                  type="date"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="结束日期">
                </el-date-picker>
            </div> 

            <el-button type="primary" plain  icon="el-icon-search" round @click="getTableList"></el-button>
            <!-- <el-button type="primary" plain style="margin-left:1.5rem;" @click="chartsExport">导出报表</el-button> -->
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
          <el-table :data="tableData" size="small" border>
            <el-table-column prop="tradeCodeName" label="交易商户" min-width="38" align="center"></el-table-column>
            <el-table-column prop="orderNum" label="商户订单号" min-width="38" align="center"></el-table-column>
            <el-table-column prop="channel" label="渠道" min-width="38" align="center"></el-table-column>
            <el-table-column prop="issuerName" label="发卡主体" min-width="38" align="center"></el-table-column>
            <el-table-column prop="cardNo" label="卡号" min-width="38" align="center"></el-table-column>
            <el-table-column prop="bizTime" label="交易时间" min-width="38" align="center"></el-table-column>
            <el-table-column prop="transAmount" label="交易金额" min-width="38" align="center"></el-table-column>
            <el-table-column prop="gmtCreate" label="提交撤销时间" min-width="38" align="center"></el-table-column>
            <el-table-column prop="refundAmount" label="撤销金额" min-width="38" align="center"></el-table-column>
            <el-table-column v-if="searchParams.status == 0" label="操作" min-width="50" align="center" >
                <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">
                      <el-button size="small" type="text" plain  @click="handleAudit(scope.row)">审核</el-button>
                    </div>
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
import tradeServer from '../../../service/scavengingManagement/transactionRelevant.js'
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
      searchParams: {
        currentPage: 1,
        showCount: 10,
        startTime: '',
        endTime: '',
        status: 0
      },
      totalSize: 0
    }
  },
  methods: {
    //获取表格数据
    getTableList(page) {
      if (page != 1) {
        this.searchParams.currentPage = 1
      }
      tradeServer.refundAuditList(this.searchParams).then(
        response => {
          this.tableData = response.list
          this.totalSize = response.totalCount
        },
        response => {
          this.tableData = []
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val
      this.getTableList(1)
    },

    // 时间单位选择
    handleClick(status) {
      this.searchParams.status = status
      this.getTableList()
    },
    handleAudit(item) {
      this.$confirm('确认撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let param = {
            orderNum: item.orderNum,
            cardNo: item.cardNo,
            refundAmount: item.refundAmount
          }
          tradeServer.refundAudit(param).then(
            res => {
              this.searchParams.status = 1
              this.getTableList()
            },
            err => {
              this.$message.error(err.msg || '服务器连接失败！')
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    chartsExport() {
      const formData = this.searchParams
      delete formData.currentPage
      delete formData.showCount
      const url = '/export/channel/trade/statics'
      tradeServer.reportExport(formData, url).then(
        response => {
          if (response.emptyData) {
            this.$message.error(response.showMessage)
          } else {
            location.href = response.downloadUrl
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
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
    this.searchParams.startTime = this.daterange[0]
    this.searchParams.endTime = this.daterange[1]
    await this.getTableList()
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
  overflow: scroll;
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
  margin-left: 12rem;
  display: flex;
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
.el-date-editor.el-input {
  width: 160px;
}
</style>