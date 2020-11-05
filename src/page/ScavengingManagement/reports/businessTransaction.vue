<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div class="compoundQuery" style="position:relative;">
          <div class="optionLine1">              
            <el-tag type="info" plain>交易日期</el-tag>
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
          </div>
          <div class="optionLine2">              
            <div class="each">
              <el-tag type="info" plain>交易类型</el-tag>
                <el-select v-model="searchParams.tradeType"  @change="updateSelectData"  placeholder="(必选)请选择">
                  <el-option
                    v-for="item in tradeTypeList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>   
            </div> 

            <div class="each">
              <el-tag type="info" plain>交易商户</el-tag>
              <el-select v-model="disableTradeCode" v-if="!searchParams.tradeType" disabled clearable placeholder="请先选择交易类型"></el-select>
              <el-select v-model="searchParams.tradeCode" v-if="searchParams.tradeType"  placeholder="(必选)请选择">
                <el-option
                  v-for="item in tradeCodeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </div>

            <el-button type="primary" plain icon="el-icon-printer" @click="chartsExport" style="position:absolute;right:2rem;" >导出报表</el-button>
          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="totalTable" v-show="(tradeCodeValue === 'all')">
          <el-table :data="tableData3" size="small" border>              
              <el-table-column prop="cityCode" label="CityCode" min-width="40" align="center">
              </el-table-column>
              <el-table-column prop="bizMerchantName" label="交易商户" min-width="50" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.bizMerchantName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="tradeTypeName" label="交易类型" min-width="40" align="center"></el-table-column>
              <el-table-column prop="billData"  label="交易日期" min-width="80" align="center">
                <!-- <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">{{dateString}}</div>
                </template> -->
              </el-table-column>
              <el-table-column prop="cnt" label="交易笔数" min-width="45" align="center"></el-table-column>
              <el-table-column prop="amt" label="交易总额（元）" min-width="55" align="center">
                <!-- <template slot-scope="scope">
                  <span>{{ scope.row.amt/100 }}</span>
                </template> -->
              </el-table-column>
          </el-table>
        </div>
        <div class="totalTable">
          <el-table :data="tableData" size="small" border>
              <el-table-column prop="cityCode" label="CityCode" min-width="40" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.cityCode }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="bizMerchantName" label="交易商户" min-width="50" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.bizMerchantName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="tradeTypeName" label="交易类型" min-width="40" align="center"></el-table-column>
              <el-table-column prop="billData"  label="交易日期" min-width="80" align="center">
                <template slot-scope="scope" class="detail-content">
                    <div class="detail-content">{{dateString}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="cnt" label="交易笔数" min-width="45" align="center"></el-table-column>
              <el-table-column prop="amt" label="交易总额（元）" min-width="55" align="center">
                <!-- <template slot-scope="scope">
                  <span>{{ scope.row.amt/100 }}</span>
                </template> -->
              </el-table-column>
          </el-table>
        </div>
        <div class="tableList" v-show="(tradeCodeValue !== 'all')">
            <el-table :data="tableData2" size="small" border>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="bizMerchantName" label="交易商户" min-width="38" align="center"></el-table-column>
                <el-table-column prop="tradeTypeName" label="交易类型" min-width="38" align="center"></el-table-column>
                <el-table-column prop="billData" label="交易日期" min-width="38" align="center"></el-table-column>
                <el-table-column prop="cnt" label="交易笔数" min-width="50" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.cnt}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="amt" label="交易总额/元" min-width="35" align="center">
                  <!-- <template slot-scope="scope">
                    <span>{{ scope.row.amt/100 }}</span>
                  </template> -->
                </el-table-column>
            </el-table>
        </div>
        <el-card shadow='never' v-show="(tradeCodeValue !== 'all')">
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
import { weeks,ostreamRequset } from '../../../utils/common.js';

export default {
  data() {
    return {
      showFirstTable: true,
      daterange:'',
      dateString:'',
      tradeTypeList: [],
      tradeCodeList: [],
      disableTradeCode: '',
      tradeCodeValue:'',     
      loadingShow: false,
      tableData2: [],
      tableData: [],
      tableData3: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        startDate: '',
        endDate: '',
        tradeCode: '',
        tradeType: ''
      },
      totalSize: 0
      }
  },
  methods: {
    //复合检索
    compoundSearch(page){      
      this.searchParams.startDate = this.daterange[0]
      this.searchParams.endDate = this.daterange[1]

      if(!(this.daterange&&this.searchParams.tradeCode&&this.searchParams.tradeType)){
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        });
      }else{
        if(page) {
          this.searchParams.currentPage = 1
        }
        this.getTableList(this.searchParams)
        if(this.searchParams.tradeCode != 'all'){
          this.getTableList2(this.searchParams)
        } else {
          this.getTableList3(this.searchParams)
        }
      }      
    },

    //获取汇总表格数据
    getTableList(data){
      this.tableData = []
      cardServer.merchantGatherV2(data).then(
        response => {
          this.tradeCodeValue = this.searchParams.tradeCode
          if(response.data !== null) {
            this.dateString = this.daterange[0]+'~'+this.daterange[1]
            // this.tableData.push(response.data)
            this.tableData = response.data
          } else {
            this.tableData = []
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    //获取表格数据
    getTableList2(data){
      this.tableData2 = []
      cardServer.merchantDataV2(data).then(
        response => {
          this.tableData2 = response.recordList
          this.totalSize = response.totalCount
          this.tradeCodeValue = this.searchParams.tradeCode
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    //获取汇总的汇总表格数据 v2.2
    getTableList3(data){
      this.tableData = []
      cardServer.merchantGatherAll(data).then(
        response => {
          this.tradeCodeValue = this.searchParams.tradeCode
          if(response.data !== null) {
            // this.dateString = this.daterange[0]+'~'+this.daterange[1]
            // this.tableData.push(response.data)
            this.tableData3 = response.data
          } else {
            this.tableData3 = []
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    //获取下拉选项列表
    getSelectData(type,tradeTypeCode){
      const data = {
        type: type,
        tradeTypeCode: tradeTypeCode
      }
      cardServer.getSelectData(data).then(
        response => {
          if(type === 15){
            this.tradeTypeList = response
          }
          if(type === 16){
            this.tradeCodeList = response
            this.searchParams.tradeCode = ''
          }
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    updateSelectData(){
      if(this.searchParams.tradeType){
        this.getSelectData(16,this.searchParams.tradeType)
      }else{
        this.searchParams.tradeCode = ''
      }
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val;
      this.compoundSearch()
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val;
      this.compoundSearch()
    },
    hidden(str,link,frontLen,endLen) { 
        var len = str.length-frontLen-endLen;
        var xing = '';
        for (var i=0;i<len;i++) {
        xing+=link;
      }
        return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
    },

    //页面跳转
    handleJump(link,cardNo){
      const router = `./${link}&card_no=${cardNo}`;
      this.$router.push(router);
    },
    chartsExport() {
      if(!(this.searchParams.tradeCode&&this.searchParams.tradeType)){
        this.$message({
          message: '有选项未选择哦',
          type: 'warning'
        });
        return
      }
      const formData = {
          tradeCode: this.searchParams.tradeCode,
          tradeType: this.searchParams.tradeType,
          startDate: this.daterange ? this.daterange[0] : '',
          endDate: this.daterange ? this.daterange[1] : '',
      }
      const url = '/export/v2/merchant/trade'
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
    }
  },
  components: {
    headTop
  },
  created(){
    this.getSelectData(15)
  },
  mounted(){
    this.daterange = weeks()
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

.optionLine2{
  display: flex;
  margin-top: 1.5rem;
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
  width: 80%;
  margin: 0 auto;
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}
.el-tag{
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>
