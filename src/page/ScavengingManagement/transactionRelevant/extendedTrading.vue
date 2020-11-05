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
              <el-tag type="info" plain>交易商户</el-tag>
              <el-select v-model="disableTradeCode" v-if="!searchParams.issuerCode" disabled clearable placeholder="请先选择发卡主体"></el-select>
              <el-select v-model="searchParams.tradeCode" v-if="searchParams.issuerCode"  placeholder="(必选)请选择">
                <el-option
                  v-for="item in tradeCodeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="optionLine2">
            <div class="each" style="display:flex;">
              <!-- <el-tag  type="info" plain>交易日期</el-tag> -->
              <div style="margin-right:1.5rem;">
                <el-button class="chooseBtn" :class="{activeBtn : searchParams.dateType === '1'} " @click="handleClick('1')" style="float: left;border-right:none">交易日期</el-button>
                <el-button class="chooseBtn" :class="{activeBtn : searchParams.dateType === '2'} " @click="handleClick('2')" style="float: left;border-left:none">上送日期</el-button> 
              </div>
              <el-date-picker
                v-model="daterange"
                type="daterange"
                :clearable = false
                unlink-panels
                @change="judgeDate"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>

            <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch"></el-button>
            <el-button type="primary" plain  icon="el-icon-printer" @click="chartsExport" style="margin-left:2rem;">导出报表</el-button>
            <!-- <el-button type="primary" plain style="margin-left:6rem;">导出报表</el-button> -->
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
            <el-table :data="tableData" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="partnerId" label="机构PID" align="center"></el-table-column>
                <el-table-column prop="userId" label="用户UID" align="center"></el-table-column>
                <el-table-column prop="cardType" label="卡类型" align="center"></el-table-column>
                <el-table-column prop="cardNo" label="卡号" align="center" ></el-table-column>
                <el-table-column prop="outBizNo" label="机构订单号" align="center"></el-table-column>
                <el-table-column prop="amount" label="车费金额/元" align="center"></el-table-column>
                <el-table-column prop="bizTime" label="乘车时间" align="center">
                </el-table-column>
                <el-table-column  label="上车脱机信息" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex;justify-content:center;">
                            <el-button size="small" type="text" plain><div class="clipboardDiv" :data-clipboard-text="scope.row.inCardRecord">复制</div></el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="endBalance" label="下车脱机信息" align="center">
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
import commonServer from '../../../service/commonService/common.js'
import tradeServer from "../../../service/scavengingManagement/transactionRelevant.js";
import headTop from '../../../components/headTop'
import { weeks, ostreamRequset } from '../../../utils/common.js'
import Clipboard from 'clipboard'

var clipboard = new Clipboard('.clipboardDiv')
clipboard.on('success', function(e) {
  console.log(e)
})
clipboard.on('error', function(e) {
  console.log(e)
})
export default {
  data() {
    return {
      daterange: '',
      issuerList: [],
      tradeCodeList: [],
      disableTradeCode: '',
      loadingShow: false,
      tableData: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        issuerCode: '',
        tradeCode: '',
        startDate: '',
        endDate: '',
        dateType: '1'
      },
      totalSize: 0
    }
  },
  methods: {
    //复合检索
    compoundSearch() {
      if (this.searchParams.issuerCode && this.searchParams.tradeCode) {
        this.searchParams.currentPage = 1
        this.getTableList()
      } else {
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        })
      }
    },

    //获取表格数据
    getTableList() {
      this.searchParams.startDate = this.daterange && this.daterange[0]
      this.searchParams.endDate = this.daterange && this.daterange[1]
      tradeServer.getExtendedTrading(this.searchParams).then(
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

    updateSelectData(){
      if(this.searchParams.issuerCode){
        this.getSelectData(8,this.searchParams.issuerCode)
      }else{
        this.searchParams.tradeCode = ''
      }
    },

    // 时间单位选择
    handleClick(str) {
      this.searchParams.dateType = str
      if(this.searchParams.issuerCode && this.searchParams.tradeCode) {
        this.getTableList()
      }
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
        this.daterange = weeks()
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
      const formData = {
        issuerCode: this.searchParams.issuerCode,
        startDate: this.daterange[0],
        endDate: this.daterange[1],
        dateType: this.searchParams.dateType,
        tradeCode: this.searchParams.tradeCode
      }
      const url = '/export/trade/overdue'
      commonServer.reportExport(formData, url).then(
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
    this.daterange = weeks()
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