<template>
    <div><head-top></head-top>
    <div class="outermost">
      <el-card shadow='never'>
        <div class="compoundQuery">
          <div class="optionLine1">              
            <el-tag type="info" plain>退卡时间</el-tag>
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
            <el-button type="primary" plain  icon="el-icon-search" round @click="compoundSearch"></el-button>
          </div>
          <div class="optionLine2">              
            <div class="each">
               <el-tag type="info" plain>发卡主体</el-tag>
                <el-select v-model="searchParams.issuerCode"  placeholder="(必选)请选择">
                  <el-option
                    ref="selectOp"
                    v-for="item in issuerList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>  
            </div> 

            <el-button class="chooseBtn" :class="{activeBtn : searchParams.auditStatus === '0'} " @click="handleClick('0')" style="float: right;border-right:none">未审核</el-button>
            <el-button class="chooseBtn" :class="{activeBtn : searchParams.auditStatus === '1'} " @click="handleClick('1')" style="float: right;border-left:none;border-right:none">已通过</el-button>
            <el-button class="chooseBtn" :class="{activeBtn : searchParams.auditStatus === '2'} " @click="handleClick('2')" style="float: right;border-left:none">出错</el-button> 

          </div>
        </div>
      </el-card>

      <div class="queryResult">
        <div class="tableList">
            <el-table :data="tableData" size="small" ref="multipleTable"
            @selection-change="handleSelectionChange" border>
                <el-table-column
                  type="selection"
                  width="45">
                </el-table-column>
                <el-table-column type="index" prop="id" align="center"></el-table-column>
                <el-table-column prop="issuerName" label="发卡主体" min-width="38" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.issuerName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="payChannel" label="发卡渠道" min-width="40" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.payChannel}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="cardNo" label="卡号" min-width="45" align="center" >
                    <template slot-scope="scope" class="detail-content">
                        <div class="detail-content">{{scope.row.cardNo}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="applyTime" label="申请退卡时间" min-width="50" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <!-- <div class="nowWrap">{{scope.row.applyTime}}</div> -->
                      <el-tooltip :content="scope.row.applyTime" placement="bottom" effect="light">
                      <el-button type="text" style="color:#595E66;" class="nowWrap">{{scope.row.applyTime}}</el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="refundAmt" label="退卡退款金额/元" min-width="50" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.refundAmt/100}}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="searchParams.auditStatus == '2'" prop="attach" label="出错原因" min-width="50" align="center">
                  <template slot-scope="scope" style="text-align:center">
                    <el-tooltip :content="scope.row.attach" placement="bottom" effect="light">
                      <el-button type="text" style="color:#595E66;" class="nowWrap">{{scope.row.attach}}</el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column v-if="searchParams.auditStatus == '1'" prop="auditTime" label="审过时间"  min-width="40" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.auditTime}}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="searchParams.auditStatus == '1'" prop="auditor" label="审核账号" min-width="40" align="center">
                  <template slot-scope="scope" style="text-align:center">
                      <div class="nowWrap">{{scope.row.auditor}}</div>
                  </template>
                </el-table-column>
                <el-table-column  label="操作" min-width="65" align="center" style="text-align:center">
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button v-if="scope.row.isNeedAudit" size="small" type="text" plain class="ml10">审核通过</el-button>
                            <el-button v-if="searchParams.auditStatus === '2'" size="small" type="text" plain class="ml10" @click="auditOne(scope.row)">重试</el-button>
                            <el-button v-if="searchParams.auditStatus != '2'" size="small" type="text" plain class="ml10" @click="handleJump('cardDetail?active=detail',scope.row.cardNo,scope.row.cityCode)">卡详情</el-button>
                            <el-button v-if="searchParams.auditStatus != '2'" size="small" type="text" plain class="ml10" @click="handleJump('cardDetail?active=event',scope.row.cardNo,scope.row.cityCode)">卡事件明细</el-button>
                            
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="searchParams.auditStatus != '2'" class="foot-page checkDiv" style="text-align:center">
              <el-button size="small" type="text" @click="selectAll">勾选全部 <i class="el-icon-check"></i> </el-button>
              <el-button size="small" :disabled="searchParams.auditStatus != '0'" type="text" @click="auditTogether">批量审核 <i class="el-icon-edit"></i> </el-button>
            </div>
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
import cardServer from "../../../service/scavengingManagement/userRelevant.js";
import headTop from '../../../components/headTop'
import { weeks, ostreamRequset } from '../../../utils/common.js'

export default {
  data() {
    return {
      daterange: '',
      selectValue: '',
      showFirstTable: true,
      issuerList: [],
      status: '',        
      loadingShow: false,
      tableData: [],
      searchParams: {
        currentPage: 1,
        showCount: 10,
        issuerCode: '',
        startTime: '',
        endTime: '',
        auditStatus: '0'
      },
      totalSize: 0,
      multipleSelection: []
      }
  },
  methods: {
    // 审核状态
    handleClick(str) {
      if(this.searchParams.auditStatus === str){
        return
      }
      this.searchParams.auditStatus = str   
      this.compoundSearch()   
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectAll() {
      this.tableData.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    },
    auditRefund(data) {
      cardServer.auditRefund(data).then(
        response => {
          this.$message({
            type: 'success',
            message: '审核成功!'
          });
          this.compoundSearch()
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },
    auditOne(row) {
      let refundNoList = [];
      
      refundNoList.push(row.refundNo);
      if(refundNoList.length>0) {
        this.$confirm('确认审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            refundNoList: refundNoList,
            issuerCode: this.searchParams.issuerCode
          }          
          this.auditRefund(data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消审核'
          });          
        });
      } else {
        this.$message.error('重试失败！');
      }
    },
    auditTogether(){
      // console.log(this.multipleSelection)
      if(this.searchParams.auditStatus !== '0') {
        return
      }
      let refundNoList = []
      this.multipleSelection.forEach(row => {
        refundNoList.push(row.refundNo)
      });
      console.log(refundNoList)
      console.log(this.searchParams.issuerCode)
      if(refundNoList.length>0) {
        this.$confirm('确认审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            refundNoList: refundNoList,
            issuerCode: this.searchParams.issuerCode
          }          
          this.auditRefund(data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消审核'
          });          
        });
      } else {
        this.$message.error('请至少勾选一条');
      }
    },
    //复合检索
    compoundSearch(){
      if(this.searchParams.issuerCode){
        this.searchParams.currentPage = 1
        this.getTableList()
      }else{
        this.$message({
          type: 'warning',
          message: '有选项未选择哦'
        });
      }
        
    },

    //获取表格数据
    getTableList(){
      this.searchParams.startTime = this.daterange[0]
      this.searchParams.endTime = this.daterange[1]
      cardServer.getEcRefundList(this.searchParams).then(
        response => {
          this.tableData = response.ecRefundList
          this.totalSize = response.totalCount
        },
        response => {
          this.tableData = []
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    //获取下拉选项列表
    getSelectData(){
      const data = {
        type: 1
      }
      cardServer.getSelectData(data).then(
        response => {
          this.issuerList = response
        },
        response => {
          this.$message.error(response.msg || '服务器连接失败！');
        }
      )
    },

    handleSizeChange(val) {
      this.searchParams.currentPage = 1
      this.searchParams.showCount = val;
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.searchParams.currentPage = val;
      this.getTableList()
    },

    //页面跳转
    handleJump(link,cardNo,cityCode){
      const router = `./${link}&num=${cardNo}&code=${cityCode}`;
      this.$router.push(router);
    },
  },
  components: {
    headTop
  },
  async created(){
    this.daterange = weeks()
    await this.getSelectData()
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

.optionLine2{
  display: flex;
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
.activeBtn{
  background: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}
.chooseBtn {
  margin: 0;
}
.optionLine2{
  display: flex;
  margin-top: 1.5rem;
}
.checkDiv {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #ebeef5;
  border-top: none;
  border-radius: 0 0 3px 3px;
}
.el-button.is-disabled {
  border: none;
}
</style>