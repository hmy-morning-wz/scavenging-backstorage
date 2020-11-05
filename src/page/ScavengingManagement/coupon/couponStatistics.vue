<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div class="compoundQuery">
          <div class="optionLine2" style="margin-bottom: 1.5rem;">              
            <div class="each">
               <el-tag type="info" plain>发卡主体</el-tag>
                <el-select class="w160" v-model="searchParams.issuerCode" @change="updateSelectData" placeholder="(必选)请选择">
                  <el-option
                    ref="selectOp"
                    v-for="item in issuerList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>  
            </div> 
            <div class="each">
              <el-tag type="info" plain>发券方</el-tag>
              <el-select v-model="searchParams.voucherSource" clearable  placeholder="请选择发券方">
                <el-option
                  v-for="item in sourceList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </div>

            <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch"></el-button>
            <el-button type="primary" plain  icon="el-icon-printer" @click="chartsExport" style="position:absolute;right:4rem;">导出报表</el-button>
          </div>
          <div class="optionLine2" style="margin-bottom: 1.5rem;">              
            <div class="each">
              <el-tag type="info" plain>采购方</el-tag>
              <div>
                <el-select v-model="disableCode" v-if="!searchParams.issuerCode" disabled clearable placeholder="请先选择发卡主体"></el-select>
                <el-select v-if="searchParams.issuerCode" v-model="searchParams.purchaserId" clearable  placeholder="请选择采购方">
                  <el-option
                    v-for="item in purchaserList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </div>
            </div> 
            <div class="each">
              <el-tag type="info" plain>活动</el-tag>
              <div>
                <el-select v-model="disableCode" v-if="!searchParams.issuerCode" disabled clearable placeholder="请先选择发卡主体"></el-select>
                <el-select v-if="searchParams.issuerCode" v-model="searchParams.activityId" clearable placeholder="请选择活动">
                  <el-option
                    v-for="item in activityList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </div>
            </div> 
            <div class="each">
              <el-tag type="info" plain>券名称</el-tag>
              <el-input
                placeholder="请输入券名称"
                v-model="searchParams.voucherName"
                clearable>
              </el-input>
            </div> 
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
            <el-table :data="totalTable" size="small" border>
                <el-table-column prop="purchaser" label="采购方" align="center"></el-table-column>          
                <el-table-column prop="totalCount" label="券总数" align="center"></el-table-column>
                <el-table-column prop="pubCount" label="累计总发放次数" align="center"></el-table-column>
                <el-table-column prop="usedCount" label="累计总核销次数" align="center"></el-table-column>
                <el-table-column prop="sendUserCount" label="累计总发放用户" align="center"></el-table-column>
                <el-table-column prop="pubAmount" label="累计总发放金额" align="center"></el-table-column>
                <el-table-column prop="usedAmount" label="累计总核销金额" align="center"></el-table-column>
            </el-table>
        </div>
        <div class="tableList">
            <el-table :data="tableData" size="small" border>
                <el-table-column prop="purchaser" label="采购方" align="center"></el-table-column>
                <el-table-column prop="voucherSource" label="发券方" align="center"></el-table-column>
                <el-table-column prop="activityName" label="活动名称" align="center"></el-table-column>
                <el-table-column prop="voucherType" label="券类型" align="center" ></el-table-column>
                <el-table-column prop="voucherName" label="券名称" align="center"></el-table-column>
                <el-table-column prop="pubTime" label="发券周期" align="center"></el-table-column>                
                <el-table-column prop="totalCount" label="券总数" align="center"></el-table-column>
                <el-table-column prop="pubCount" label="累计发放次数" align="center"></el-table-column>
                <el-table-column prop="usedCount" label="累计核销次数" align="center"></el-table-column>
                <el-table-column prop="sendUserCount" label="累计发放用户" align="center"></el-table-column>
                <el-table-column prop="pubAmount" label="累计发放金额" align="center"></el-table-column>
                <el-table-column prop="usedAmount" label="累计核销金额" align="center"></el-table-column>
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
import commonServer from '../../../service/commonService/common.js'
import couponServer from "../../../service/scavengingManagement/coupon.js";
import headTop from '../../../components/headTop'
export default {
  data() {
    return {
      issuerList: [],
      sourceList: [],
      disableCode: '',
      purchaserList: [],
      activityList: [],
      loadingShow: false,
      tableData: [],
      totalTable: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        issuerCode: '',
        voucherSource: '',
        purchaserId: '',
        activityId: '',
        voucherName: ''
      },
      totalSize: 0
    }
  },
  methods: {
    //复合检索
    compoundSearch() {
      if (this.searchParams.issuerCode) {
        this.searchParams.currentPage = 1
        this.getTableList()
        this.getTotalTable()
      } else {
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        })
      }
    },

    //获取表格数据
    getTableList() {
      couponServer.getCouponStatistics(this.searchParams).then(
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

    //获取汇总表格数据
    getTotalTable() {
      couponServer.getCouponStatisticsAll(this.searchParams).then(
        response => {
          if(response instanceof Array) {
            this.totalTable = response
          } else {
            this.totalTable = []
          }
        },
        response => {
          this.totalTable = []
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },

    //获取下拉选项列表
    getSelectData(type, issuerCode) {
      const data = {
        type: type,
        issuerCode: issuerCode
      }
      commonServer.getSelectData(data).then(
        response => {
          if (type === 1) {
            this.issuerList = response
          }
          if(type === 8){
            this.tradeCodeList = response
            this.searchParams.tradeCode = ''
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },

    //获取发券方选项列表
    getSourceList() {
      couponServer.getSourceList().then(
        response => {
          this.sourceList = response
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },
    //获取采购方选项列表
    getPurchaserList() {
      couponServer.getPurchaserList(this.searchParams.issuerCode).then(
        response => {
          this.purchaserList = response
          this.searchParams.purchaserId = ''
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },
    //获取活动选项列表
    getActivityList() {
      couponServer.getActivityList(this.searchParams.issuerCode).then(
        response => {
          this.activityList = response
          this.searchParams.activityId = ''
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },  
    
    updateSelectData(){
      if(this.searchParams.issuerCode){
        this.getPurchaserList()
        this.getActivityList()
      }else{
        this.searchParams.purchaserId = ''
        this.searchParams.activityId = ''
      }
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val
      this.getTableList()
    },

    chartsExport() {
      if (!this.searchParams.issuerCode) {
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        })
        return
      }
      const url = '/export/voucher/summary'
      commonServer.reportExport(this.searchParams, url).then(
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
  created() {
    this.getSelectData(1)
    this.getSourceList()
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.outermost {
  padding: 2rem;
  min-height: 100%;
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

.optionLine2 {
  display: flex;
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
.chooseBtn {
  margin: 0;
}
.activeBtn{
  background: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}
.el-tag {
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>