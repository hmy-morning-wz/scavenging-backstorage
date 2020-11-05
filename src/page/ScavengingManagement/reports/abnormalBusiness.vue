<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div class="compoundQuery">
          
            <div class="optionLine">              
              <div class="each">
                <el-tag type="info" plain>发卡主体</el-tag>
                  <el-select v-model="searchParams.issuerCode"  @change="updateSelectData"  placeholder="请选择">
                    <el-option
                      v-for="item in issuerList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>   
              </div> 

              <div class="each">
                <el-tag type="info" plain>交易商户</el-tag>
                <el-select v-model="disableTradeCode" v-if="!searchParams.issuerCode" disabled  placeholder="请先选择发卡主体"></el-select>
                <el-select v-model="searchParams.tradeCode" v-if="searchParams.issuerCode"  placeholder="请选择">
                  <el-option
                  v-for="item in tradeCodeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
                </el-select>
              </div>   

            </div>
          <div>              
            <el-tag type="info" plain>上送日期</el-tag>
            <el-date-picker
              v-model="daterange"
              type="daterange"
              :clearable="false"
              @change="judgeDate"
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
        <div class="tableList">
            <el-table :data="tableData" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="tradeCodeName" label="交易商户" min-width="38" align="center"></el-table-column>
                <el-table-column prop="orderNum" label="商户订单号" min-width="38" align="center"></el-table-column>
                <el-table-column prop="channelName" label="渠道" min-width="38" align="center"></el-table-column>
                <el-table-column prop="issuerName" label="发卡主体" min-width="38" align="center"></el-table-column>
                <el-table-column prop="cardNo" label="卡号" min-width="38" align="center"></el-table-column>
                <el-table-column prop="createTime" label="上送日期" min-width="38" align="center"></el-table-column>
                <el-table-column prop="bizTime" label="交易时间" min-width="38" align="center"></el-table-column>
                <el-table-column prop="amt" label="交易金额" min-width="38" align="center"></el-table-column>
                <el-table-column prop="abnormalReason" label="异常交易原因" min-width="50" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.abnormalReason}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="billData" label="机具编号" min-width="38" align="center"></el-table-column> -->
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
import cardServer from '../../../service/scavengingManagement/reports.js'
import commonServer from '../../../service/commonService/common.js'
import headTop from '../../../components/headTop'
import { weeks, ostreamRequset, yesterday } from '../../../utils/common.js'

export default {
  data() {
    return {
      daterange: '',
      loadingShow: false,
      disableTradeCode: '',
      tableData: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        startTime: '',
        endTime: '',
        issuerCode: '',
        tradeCode: ''
      },
      totalSize: 0,
      tradeCodeList: [],
      issuerList: []
    }
  },
  methods: {
    //复合检索
    compoundSearch(page) {
      this.searchParams.startTime = this.daterange[0]
      this.searchParams.endTime = this.daterange[1]

      if (page) {
        this.searchParams.currentPage = 1
      }
      this.getTableList(this.searchParams)
    },

    //获取表格数据
    getTableList(data) {
      this.tableData = []
      cardServer.abnormalList(data).then(
        response => {
          if (response.ecAbnormalConsumeList) {
            this.tableData = response.ecAbnormalConsumeList
            this.totalSize = response.totalCount
          }
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
          if(type === 4){
            this.tradeCodeList = response
            this.searchParams.tradeCode = ''
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！')
        }
      )
    },

    updateSelectData(){
      if(this.searchParams.issuerCode){
        this.getSelectData(4,this.searchParams.issuerCode)
      }else{
        this.searchParams.tradeCode = ''
      }
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
      const formData = {
        startTime: this.daterange ? this.daterange[0] : '',
        endTime: this.daterange ? this.daterange[1] : ''
      }
      const url = '/export/v2/consume/abnormal'
      cardServer.reportExport(formData, url).then(
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

    // 时间跨度小于三个月
    judgeDate(daterange) {
      var date1 = daterange[0]
      var date2 = daterange[1]
      var year1 = parseInt(date1.substring(0, 4))
      var year2 = parseInt(date2.substring(0, 4))
      var month1 = parseInt(date1.substring(5, 7))
      var month2 = parseInt(date2.substring(5, 7))
      var day1 = parseInt(date1.substring(8))
      var day2 = parseInt(date2.substring(8))
      var flag = true
      if (year1 == year2) {
        //同年
        if (month2 - month1 > 3) {
          //月间隔超过3个月
          flag = false
        } else if (month2 - month1 == 3) {
          //月相隔3个月，比较日
          if (day2 > day1) {
            //结束日期的日大于开始日期的日
            flag = false
          }
        }
      } else {
        //不同年
        if (year2 - year1 > 1) {
          flag = false
        } else if (year2 - year1 == 1) {
          if (month1 < 10) {
            //开始年的月份小于10时，不需要跨年
            flag = false
          } else if (month1 + 3 - month2 < 12) {
            //月相隔大于3个月
            flag = false
          } else if (month1 + 3 - month2 == 12) {
            //月相隔3个月，比较日
            if (day2 > day1) {
              //结束日期的日大于开始日期的日
              flag = false
            }
          }
        }
      }
      if (!flag) {
        this.$message.error('时间跨度不可大于3个月哦')
        this.daterange = yesterday()
      }
    }
  },
  components: {
    headTop
  },
  created() {},
  mounted() {
    this.getSelectData(1)
    this.daterange = yesterday()
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
