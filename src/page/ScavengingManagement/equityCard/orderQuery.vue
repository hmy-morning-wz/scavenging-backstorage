<template>
  <div>
    <head-top></head-top>
    <div class="outermost">
      <el-card shadow="never">
        <div class="queryOption">
          <el-tabs tab-position="right" v-model="activeName">
            <el-tab-pane name="first">
              <span slot="label">
                <i class="el-icon-arrow-up"></i> 快速检索
              </span>
              <div class="fastQuery">
                <el-tabs v-model="activeName2" type="card">
                  <!-- <el-tab-pane label="用户手机号" name="first">
                    <span slot="label"><i class="el-icon-document"></i>商户订单号</span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入商户订单号"
                        suffix-icon="el-icon-document"
                        v-model="selectValue"
                        clearable>
                      </el-input>
                    </div>
                    <el-button type="primary" plain  icon="el-icon-search" round @click="quickSearch('orderNo')"></el-button>
                  </el-tab-pane>-->
                  <el-tab-pane label="订单流水号" name="first">
                    <span slot="label">
                      <i class="el-icon-refresh"></i>订单流水号
                    </span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入订单流水号"
                        suffix-icon="el-icon-refresh"
                        v-model="quickSearchParams.bizTransId"
                        clearable
                      ></el-input>
                    </div>
                    <el-button icon="el-icon-search" round @click="quickSearch()"></el-button>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>
            <el-tab-pane name="second" style="float:left">
              <span slot="label">
                <i class="el-icon-arrow-down"></i> 复合查询
              </span>
              <div class="fastQuery">
                <el-tabs v-model="activeName3" type="card">
                  <el-tab-pane label="虚拟卡卡号" name="first">
                    <span slot="label">
                      <i class="el-icon-phone-outline"></i>虚拟卡卡号
                    </span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入虚拟卡卡号"
                        suffix-icon="el-icon-phone-outline"
                        v-model="cardNo"
                        clearable
                      ></el-input>
                    </div>
                    <el-button
                      type="primary"
                      plain
                      icon="el-icon-search"
                      round
                      @click="compoundSearch('cardNo')"
                    ></el-button>
                  </el-tab-pane>
                  <el-tab-pane label="支付宝uid" name="second">
                    <span slot="label">
                      <i class="el-icon-goods"></i>支付宝uid
                    </span>
                    <div class="inputOption">
                      <el-input
                        placeholder="请输入支付宝uid"
                        suffix-icon="el-icon-goods"
                        v-model="userId"
                        clearable
                      ></el-input>
                    </div>
                    <el-button
                      type="primary"
                      plain
                      icon="el-icon-search"
                      round
                      @click="compoundSearch('uid')"
                    ></el-button>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div class="compoundQuery">
                <div class="optionLine1">
                  <div class="chooseDate">
                    <el-tag type="info" plain>下单时间</el-tag>
                    <el-date-picker
                      v-model="tradeDaterange"
                      type="daterange"
                      unlink-panels
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    ></el-date-picker>
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
                  </el-date-picker></div>-->
                </div>
                <div class="optionLine2">
                  <div class="each">
                    <el-tag type="info" plain>主体商户</el-tag>
                    <el-select
                      v-model="compoundSearchParams.issuerCode"
                      @change="updateSelectData"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in issuerList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </div>

                  <div class="each">
                    <el-tag type="info" plain>下单商品</el-tag>
                    <el-select
                      v-model="compoundSearchParams.productCode"
                      :disabled="!compoundSearchParams.issuerCode"
                      clearable
                      :placeholder="!compoundSearchParams.issuerCode ? '请先选择发卡主体':'请选择'"
                    >
                      <el-option
                        v-for="item in productList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </div>

                  <div class="each">
                    <el-tag type="info" plain>订单状态</el-tag>
                    <el-select
                      v-model="compoundSearchParams.orderStatus"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in orderStatusList"
                        :key="item.orderStatus"
                        :label="item.orderStatusName"
                        :value="item.orderStatus"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>

      <div class="queryResult" v-show="activeName==='first'">
        <div class="tableList">
          <el-table :data="rechargeList" size="small" border>
            <el-table-column type="index" prop="id" align="center"></el-table-column>
            <el-table-column prop="mainMerchantName" label="主体商户" align="center"></el-table-column>
            <el-table-column prop="bizTransId" label="订单流水号" align="center">
              <template slot-scope="scope" style="text-align:center">
                <div class="nowWrap">{{scope.row.bizTransId}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="userId" label="支付宝uid" show-overflow-tooltip align="center">
              <template slot-scope="scope" class="detail-content">
                <div class="detail-content">{{scope.row.userId}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="cardNo" label="虚拟卡卡号" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="transTime" label="下单时间" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="productName" label="下单商品" align="center"></el-table-column>
            <el-table-column prop="orderAmout" label="订单金额/元" align="center">
              <template slot-scope="scope" class="detail-content">
                <div class="detail-content">{{scope.row.orderAmout}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="statusName" label="订单状态" align="center"></el-table-column>
            <el-table-column label="操作" align="center" style="text-align:center">
              <template slot-scope="scope">
                <div style="display:flex">
                  <!-- <el-button size="small" type="text" plain @click="handleJump('cardDetail?active=detail',scope.row.cardNo,scope.row.cityCode)">查看该用户<i class="el-icon-zoom-in"></i></el-button> -->
                  <el-button
                    size="small"
                    type="text"
                    plain
                    class="ml10"
                    @click="handleJump2(scope.row)"
                  >
                    订单详情
                    <i class="el-icon-zoom-in"></i>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-card shadow="never">
          <div class="foot-page" style="text-align:center">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="quickSearchParams.currentPage"
              :page-sizes="[10,20,30,50,100]"
              :page-size="quickSearchParams.showCount"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalSize"
            ></el-pagination>
          </div>
        </el-card>
      </div>
      <div class="queryResult" v-show="activeName==='second'">
        <div class="tableList">
          <el-table :data="rechargeList2" size="small" border>
            <el-table-column type="index" prop="id" align="center"></el-table-column>
            <el-table-column prop="mainMerchantName" label="主体商户" align="center"></el-table-column>
            <el-table-column prop="bizTransId" label="订单流水号" align="center">
              <template slot-scope="scope" style="text-align:center">
                <div class="nowWrap">{{scope.row.bizTransId}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="userId" label="支付宝uid" show-overflow-tooltip align="center">
              <template slot-scope="scope" class="detail-content">
                <div class="detail-content">{{scope.row.userId}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="cardNo" label="虚拟卡卡号" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="transTime" label="下单时间" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="productName" label="下单商品" align="center"></el-table-column>
            <el-table-column prop="orderAmout" label="订单金额/元" align="center">
              <template slot-scope="scope" class="detail-content">
                <div class="detail-content">{{scope.row.orderAmout}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="statusName" label="订单状态" align="center"></el-table-column>
            <el-table-column label="操作" align="center" style="text-align:center">
              <template slot-scope="scope">
                <div style="display:flex">
                  <!-- <el-button size="small" type="text" plain @click="handleJump('cardDetail?active=detail',scope.row.cardNo,scope.row.cityCode)">查看该用户<i class="el-icon-zoom-in"></i></el-button> -->
                  <el-button
                    size="small"
                    type="text"
                    plain
                    class="ml10"
                    @click="handleJump2(scope.row)"
                  >
                    订单详情
                    <i class="el-icon-zoom-in"></i>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-card shadow="never">
          <div class="foot-page" style="text-align:center">
            <el-pagination
              background
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page="compoundSearchParams.currentPage"
              :page-sizes="[10,20,30,50,100]"
              :page-size="compoundSearchParams.showCount"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalSize2"
            ></el-pagination>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import httpsServer from "../../../service/scavengingManagement/orderQuery.js";
import headTop from "../../../components/headTop";
export default {
  data() {
    return {
      activeName: "first",
      activeName2: "first",
      activeName3: "first",
      selectValue: "",
      selectValue2: "",
      selectVal: "",
      selectVal2: "",
      searchKey: "orderNo",
      compoundKey: "cardNo",
      nowDate1: "",
      nowDate2: "",
      rechargeList: [],
      rechargeList2: [],
      tradeDaterange: "",
      entryDaterange: "",
      cardNo:"",
      userId:"",
      issuerList: [],
      productList: [],
      orderStatusList:[
          {
              orderStatus:1,
              orderStatusName:"待支付",
          },
          {
              orderStatus:2,
              orderStatusName:"支付成功",
          },
          {
              orderStatus:0,
              orderStatusName:"已退卡",
          },
          {
              orderStatus:-1,
              orderStatusName:"支付取消",
          },
      ],
      issuer: "",
      channel: "",
      disableChannel: "",

      loadingShow: false,
      currentOption: {},
      quickSearchParams: {
        quickScreen: true,
        currentPage: 1,
        showCount: 10,
        bizTransId: ""
      },
      compoundSearchParams: {
        quickScreen: false,
        currentPage: 1,
        showCount: 10,
        startDate: "",
        endDate: "",
        issuerCode: "",
        productCode: "",
        orderStatus: "",
        cardNo: "",
        userId: ""
      },
      totalSize: 0,
      totalSize2: 0
    };
  },
  methods: {
    //快速检索
    quickSearch() {
      
        if (!this.quickSearchParams.bizTransId) {
             this.$message.error("请先填写订单流水号！");
        }else {
            this.getTableList(this.quickSearchParams);
        }
      
    },
    //复合检索
    compoundSearch(compoundKey) {
      
      if (compoundKey === "cardNo") {
        this.compoundSearchParams.cardNo = this.cardNo;
        this.compoundSearchParams.userId = "";
      }else{
        this.compoundSearchParams.cardNo = "";
        this.compoundSearchParams.userId = this.userId;
      }

      this.compoundSearchParams.startDate = this.tradeDaterange
        ? this.tradeDaterange[0]
        : "";
      this.compoundSearchParams.endDate = this.tradeDaterange
        ? this.tradeDaterange[1]
        : "";

    //   if (!page) this.compoundSearchParams.currentPage = 1;
        if (this.compoundSearchParams.cardNo || this.compoundSearchParams.userId || this.compoundSearchParams.startDate || this.compoundSearchParams.issuerCode) {
            this.getTableList(this.compoundSearchParams);
        }else {
            this.$message.error("虚拟卡卡号、支付宝uid、下单时间和主体商户请至少选择一个进行查询！");
        }
      
        
      
    },

    //获取表格数据
    getTableList(data) {
    //   var oobj = Object.assign(this.currentOption, this.compoundSearchParams);
        const param = this.handparams(data);
      httpsServer.getOrderList(param).then(
        response => {
          if (response.list instanceof Array) {
            if (this.activeName === "first") {
              this.rechargeList = response.list;
              this.totalSize = response.totalCount;
            } else {
              this.rechargeList2 = response.list;
              this.totalSize2 = response.totalCount;
            }
          }else {
              if (this.activeName === "first") {
              this.rechargeList = [];
              this.totalSize = 0;
            } else {
              this.rechargeList2 = [];
              this.totalSize2 = 0;
            }
          }
        },
        response => {
          this.$message.error(response.msg || "服务器连接失败！");
        }
      );
    },

    //获取下拉选项列表
    getSelectData(type, issuerCode) {
      if (type === 14) {
        const data = {
          issuerCode: issuerCode
        };
        httpsServer.getProductData(data).then(
          response => {
            this.productList = response;
            // this.compoundSearchParams.productCode = "";
          },
          response => {
              this.productList = [];
            this.$message.error(response.msg || "服务器连接失败！");
          }
        );
      } else {
        const data = {
          type: type,
          issuerCode: issuerCode
        };
        httpsServer.getSelectData(data).then(
          response => {
            if (type === 1) {
              this.issuerList = response;
            } else if (type === 3) {
              this.statusList = response;
            }
          },
          response => {
            this.$message.error(response.msg || "服务器连接失败！");
          }
        );
      }
    },

    updateSelectData() {
      if (this.compoundSearchParams.issuerCode) {
        this.getSelectData(14, this.compoundSearchParams.issuerCode);
      } else {
        this.compoundSearchParams.productCode = "";
      }
    },

    handleSizeChange(val) {
      this.searchParams.showCount = val;
      this.quickSearch();
    },
    handleSizeChange2(val) {
      // debugger
      this.currentOption.showCount = val;
    //   this.selectValue2 = this.selectVal2;
    //   this.tradeDaterange = [
    //     this.currentOption.startDate,
    //     this.currentOption.endDate
    //   ];
    //   var oobj = Object.assign(this.compoundSearchParams, this.currentOption);
    this.compoundSearchParams.startDate = this.tradeDaterange[0] || "";
    this.compoundSearchParams.endDate = this.tradeDaterange[1] || "";
      if (this.compoundKey === "cardNo") {
        this.activeName3 = "first";
      } else {
        this.activeName3 = "second";
      }
      this.compoundSearch(this.compoundKey);
    },
    handleCurrentChange(val) {
      this.quickSearchParams.currentPage = val;
      this.quickSearch();
    },
    handleCurrentChange2(val) {
      // debugger
      this.compoundSearchParams.currentPage = val;
    //   this.selectValue2 = this.selectVal2;
    //   this.tradeDaterange = [
    //     this.currentOption.startDate,
    //     this.currentOption.endDate
    //   ];
    //   var oobj = Object.assign(this.compoundSearchParams, this.currentOption);
    this.compoundSearchParams.startDate = this.tradeDaterange[0] || "";
    this.compoundSearchParams.endDate = this.tradeDaterange[1] || "";
      if (this.compoundKey === "cardNo") {
        this.activeName2 = "first";
      } else {
        this.activeName2 = "second";
      }
      this.compoundSearch(this.compoundKey);
    },

    //页面跳转
    handleJump(link, cardNo, cityCode) {
      const router = `./${link}&num=${cardNo}&code=${cityCode}`;
      this.$router.push(router);
    },
    //页面跳转
    handleJump2(row) {
    //   const router = `./packageDetail?num=${row.id}&no=${row.cardNo}`;
    //   this.$router.push(router);
        this.$router.push({
          name: "equityCardOrderDetail",
          query: { bizTransId: row.bizTransId, cityCode:row.cityCode,issuerCode:row.issuerCode,cardNo:row.cardNo}
        });
    },


    beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    if(from.name==='equityCardOrderDetail'){
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

    hidden(str, link, frontLen, endLen) {
      var len = str.length - frontLen - endLen;
      var xing = "";
      if (len > 4) {
        xing += link + link + link + link;
      } else {
        for (var i = 0; i < len; i++) {
          xing += link;
        }
      }
      return (
        str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
      );
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
    if (from.name === "cardDetail" || "rechargeDetail") {
      to.meta.isBack = true;
      //判断是从哪个路由过来的，
      //如果是everydayChange过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    }

    next();
  },
  activated() {
    if (!this.$route.meta.isBack) {
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      // this.getData();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false;
  },

  created() {
    this.getSelectData(1);
  },

  mounted() {},
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
.chooseDate {
  margin-top: 0.8rem;
}
.optionLine2 {
  display: flex;
  margin-top: 1rem;
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
  width: 70%;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.radioDiv {
  padding: 0 1rem 1rem 1rem;
  float: right;
}
.el-tag {
  font-size: 15px;
  line-height: 2.4rem;
  margin-right: 0.5rem;
  height: auto;
  padding: 0 1rem;
}
</style>
