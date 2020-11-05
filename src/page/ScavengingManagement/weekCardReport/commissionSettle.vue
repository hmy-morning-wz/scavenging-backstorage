<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div class="compoundQuery">
          
            <div class="optionLine">              
              <div class="each">
                <el-tag type="info" plain>发卡主体</el-tag>
                  <el-select v-model="searchParams.issuerCode" placeholder="（必选）请选择">
                    <el-option
                      v-for="item in issuerList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>   
              </div> 

            </div>
          <div>              
            <el-tag type="info" plain>查询日期</el-tag>
            <el-date-picker
              v-model="daterange"
              type="daterange"
              :clearable="false"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch(1)"></el-button>
            <el-button type="primary" plain icon="el-icon-printer" @click="chartsExport" style="float:right;">导出报表</el-button>
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="totalTable">
            <el-table :data="totalTable" size="small" border>
                <el-table-column type="index" label="分佣汇总" align="center"></el-table-column>
                <!-- <el-table-column prop="issuerCode" label="城市" min-width="38" align="center"></el-table-column> -->
                <el-table-column prop="productName" label="卡类型" min-width="38" align="center"></el-table-column>
                <el-table-column prop="startDate" label="开始日期" min-width="38" align="center"></el-table-column>
                <el-table-column prop="endDate" label="结束日期" min-width="38" align="center"></el-table-column>
                <el-table-column prop="saleNum" label="售卖笔数" min-width="38" align="center"></el-table-column>
                <el-table-column prop="saleAmt" label="售卖总额" min-width="38" align="center"></el-table-column>
                <el-table-column prop="refundNum" label="退款笔数" min-width="38" align="center"></el-table-column>
                <el-table-column prop="refundAmt" label="退款总额" min-width="38" align="center"></el-table-column>
                <el-table-column prop="commissionBase" label="分佣基数" min-width="38" align="center"></el-table-column>
                <el-table-column prop="commissionAmt" label="分佣金额" min-width="38" align="center"></el-table-column>
            </el-table>
        </div>
        <div class="tableList">
            <el-table :data="tableData" size="small" border>
                <el-table-column type="index" label="分佣结算报表" align="center"></el-table-column>
                <!-- <el-table-column prop="issuerCode" label="城市" min-width="38" align="center"></el-table-column> -->
                <el-table-column prop="productName" label="卡类型" min-width="38" align="center"></el-table-column>
                <el-table-column prop="summaryDate" label="交易日期" min-width="38" align="center"></el-table-column>
                <el-table-column prop="saleNum" label="售卖笔数" min-width="38" align="center"></el-table-column>
                <el-table-column prop="saleAmt" label="售卖总额" min-width="38" align="center"></el-table-column>
                <el-table-column prop="refundNum" label="退款笔数" min-width="38" align="center"></el-table-column>
                <el-table-column prop="refundAmt" label="退款总额" min-width="38" align="center"></el-table-column>
                <el-table-column prop="commissionBase" label="分佣基数" min-width="38" align="center"></el-table-column>
                <el-table-column prop="commissionAmt" label="分佣金额" min-width="38" align="center"></el-table-column>
                <el-table-column label="操作" min-width="50" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content" style="display: flex">
                          <el-button size="small" type="text" plain  @click="handleDetail(scope.row)">明细</el-button>
                          <el-button size="small" type="text" plain  @click="handleExport(scope.row)">导出</el-button>
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
import cardServer from '../../../service/scavengingManagement/weekCardReport.js'
import commonServer from '../../../service/commonService/common.js'
import headTop from '../../../components/headTop'
import { weeks, ostreamRequset, yesterday } from '../../../utils/common.js'

export default {
  data() {
    return {
      daterange: '',
      loadingShow: false,
      tableData: [],
      totalTable: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        startDate: '',
        endDate: '',
        issuerCode: ''
      },
      totalSize: 0,
      issuerList: []
    }
  },
  methods: {
    //复合检索
    compoundSearch(page) {
      if(!this.searchParams.issuerCode) {
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        });
        return
      }
      this.searchParams.startDate = this.daterange[0]
      this.searchParams.endDate = this.daterange[1]
      
      if (page) {
        this.searchParams.currentPage = 1
      }
      this.getTableList(this.searchParams)
      this.getTotalTableList(this.searchParams)
    },

    //获取表格数据
    getTableList(data) {
      this.tableData = []
      cardServer.commissionSettleList(data).then(
        response => {
          if (response.list) {
            this.tableData = response.list
            this.totalSize = response.totalCount
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },
    //获取汇总表格数据
    getTotalTableList(data) {
      this.totalTable = []
      cardServer.commissionTotalList(data).then(
        response => {
          this.totalTable = response.data || []
        },
        response => {
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
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val
      this.compoundSearch()
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val
      this.compoundSearch()
    },

    chartsExport() {
      if(!this.searchParams.issuerCode) {
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        });
        return
      }
      this.searchParams.startDate = this.daterange ? this.daterange[0] : ''
      this.searchParams.endDate = this.daterange ? this.daterange[1] : ''

      const url = '/export/benefit/commission/settlement'
      cardServer.reportExport(this.searchParams, url).then(
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
    },
    handleExport(row) {
      const formdata = {
        date: row.summaryDate,
        issuerCode: row.issuerCode,
        productCode: row.productCode,
        productName: row.productName
      }
      const url = '/export/benefit/commission/settlement/detail'
      cardServer.reportExport(formdata, url).then(
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
    },
    handleDetail(row) {
      let obj = {
        productCode: row.productCode,
        issuerCode: row.issuerCode,
        productName: row.productName,
        date: row.summaryDate
      }
      sessionStorage.setItem('commissionDetail',JSON.stringify(obj))
      this.$router.push(`./commissionDetail`)
    },
  },
  components: {
    headTop
  },
  created() {},
  mounted() {
    this.getSelectData(1)
    this.daterange = weeks()
    // this.compoundSearch()
  },
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

.optionLine {
  display: flex;
  margin-bottom: 1.5rem;
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
.el-tag {
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>
