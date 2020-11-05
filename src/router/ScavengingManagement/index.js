const manage = resolve => {
  require(['@/page/manage.vue'], resolve)
}
const overview = resolve => {
  require(['@/page/ScavengingManagement/overview.vue'], resolve)
}
const cardQuery = resolve => {
  require(['@/page/ScavengingManagement/userRelevant/cardQuery.vue'], resolve)
}
const DWQCardQuery = resolve => {
  require(['@/page/ScavengingManagement/userRelevant/DWQCardQuery.vue'], resolve)
}
const cardDetail = resolve => {
  require(['@/page/ScavengingManagement/userRelevant/cardDetail.vue'], resolve)
}
const rechargeQuery = resolve => {
  require(['@/page/ScavengingManagement/transactionRelevant/rechargeQuery.vue'], resolve)
}
const rechargeDetail = resolve => {
  require(['@/page/ScavengingManagement/transactionRelevant/rechargeDetail.vue'], resolve)
}
const refundDetail = resolve => {
  require(['@/page/ScavengingManagement/transactionRelevant/refundDetail.vue'], resolve)
}
const consumptionDetail = resolve => {
  require(['@/page/ScavengingManagement/transactionRelevant/consumptionDetail.vue'], resolve)
}
const accountChanges = resolve => {
  require(['@/page/ScavengingManagement/reports/accountChanges.vue'], resolve)
}
const everydayChange = resolve => {
  require(['@/page/ScavengingManagement/reports/everydayChange.vue'], resolve)
}
const businessTransaction = resolve => {
  require(['@/page/ScavengingManagement/reports/businessTransaction.vue'], resolve)
}
const withdrawDetail = resolve => {
  require(['@/page/ScavengingManagement/reports/financialSettlement/withdrawDetail.vue'], resolve)
}
const depositDetail = resolve => {
  require(['@/page/ScavengingManagement/reports/financialSettlement/depositDetail.vue'], resolve)
}
const financialSettlement = resolve => {
  require(['@/page/ScavengingManagement/reports/financialSettlement/financialSettlement.vue'], resolve)
}
const consumptionQuery = resolve => {
  require(['@/page/ScavengingManagement/transactionRelevant/consumptionQuery.vue'], resolve)
}
const abnormalBalance = resolve => {
  require(['@/page/ScavengingManagement/userRelevant/abnormalBalance.vue'], resolve)
}
const cardRefund = resolve => {
  require(['@/page/ScavengingManagement/userRelevant/cardRefund.vue'], resolve)
}
const cardStatistics = resolve => {
  require(['@/page/ScavengingManagement/reports/cardStatistics.vue'], resolve)
}
const tradeStatistics = resolve => {
  require(['@/page/ScavengingManagement/reports/tradeStatistics.vue'], resolve)
}

const merchantTransactionBill = resolve => {
    require(['@/page/ScavengingManagement/bill/merchantTransactionBill.vue'], resolve)
}

const financialSettlementBill = resolve => {
    require(['@/page/ScavengingManagement/bill/financialSettlementBill.vue'], resolve)
}
// v1.2
const packagePurchase = resolve => {
  require(['@/page/ScavengingManagement/transactionRelevant/packagePurchase.vue'], resolve)
}
const packageDetail = resolve => {
  require(['@/page/ScavengingManagement/transactionRelevant/packageDetail.vue'], resolve)
}
const discountStatistics = resolve => {
  require(['@/page/ScavengingManagement/reports/discountStatistics.vue'], resolve)
}
const packageStatistics = resolve => {
  require(['@/page/ScavengingManagement/reports/packageStatistics.vue'], resolve)
}
const packageBill = resolve => {
  require(['@/page/ScavengingManagement/bill/packageBill.vue'], resolve)
}

// v1.3
const abnormalBusiness = resolve => {
  require(['@/page/ScavengingManagement/reports/abnormalBusiness.vue'], resolve)
}
const customPath = resolve => {
  require(['@/page/ScavengingManagement/custom/customPath.vue'], resolve)
}
const modifyPwd = resolve => {
  require(['@/page/ScavengingManagement/modifyPwd.vue'], resolve)
}

// v1.4
const extendedTrading = resolve => {
  require(['@/page/ScavengingManagement/transactionRelevant/extendedTrading.vue'], resolve)
}
// v1.4.1
// const weekCardSettle = resolve => {
//   require(['@/page/ScavengingManagement/reports/weekCardSettle.vue'], resolve)
// }
// const weekCardSale = resolve => {
//   require(['@/page/ScavengingManagement/reports/weekCardSale.vue'], resolve)
// }

// v1.4.2
const orderQuery = resolve => {
  require(['@/page/ScavengingManagement/equityCard/orderQuery.vue'], resolve)
}
const equityCardOrderDetail = resolve => {
  require(['@/page/ScavengingManagement/equityCard/equityCardOrderDetail.vue'], resolve)
}
const settlementBill = resolve => {
  require(['@/page/ScavengingManagement/equityCard/settlementBill.vue'], resolve)
}
const operationLog = resolve => {
  require(['@/page/ScavengingManagement/internalApplications/operationLog.vue'], resolve)
}

// v1.4.3
const weekCardSettle = resolve => {
  require(['@/page/ScavengingManagement/weekCardReport/weekCardSettle.vue'], resolve)
}
const weekCardSale = resolve => {
  require(['@/page/ScavengingManagement/weekCardReport/weekCardSale.vue'], resolve)
}
const dayDetail = resolve => {
  require(['@/page/ScavengingManagement/weekCardReport/dayDetail.vue'], resolve)
}
const goodsDetail = resolve => {
  require(['@/page/ScavengingManagement/weekCardReport/goodsDetail.vue'], resolve)
}

// v2.2
const refundStatistics = resolve => {
  require(['@/page/ScavengingManagement/reports/refundStatistics.vue'], resolve)
}

// v2.2.1
const couponStatistics = resolve => {
  require(['@/page/ScavengingManagement/coupon/couponStatistics.vue'], resolve)
}
const couponDayList = resolve => {
  require(['@/page/ScavengingManagement/coupon/couponDayList.vue'], resolve)
}

// v3.0
const refundRecords = resolve => {
  require(['@/page/ScavengingManagement/transactionRelevant/refundRecords.vue'], resolve)
}
const commissionSettle = resolve => {
  require(['@/page/ScavengingManagement/weekCardReport/commissionSettle.vue'], resolve)
}
const commissionDetail = resolve => {
  require(['@/page/ScavengingManagement/weekCardReport/commissionDetail.vue'], resolve)
}

export default [
  {
    path: '/index',
    component: manage,
    name: '',
    children: [
      {
        path: '/overview',
        component: overview,
        meta: {
          pageTitle: '概览'
        }
      },
      {
        path: '/cardQuery',
        component: cardQuery,
        meta:
        {
          pageTitle: '发卡查询',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/DWQCardQuery',
        component: DWQCardQuery,
        meta:
        {
          pageTitle: '大湾区发卡查询',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/abnormalBalance',
        component: abnormalBalance,
        meta: 
        {
          pageTitle: '欠费清单',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/cardRefund',
        component: cardRefund,
        meta: 
        {
          pageTitle: '退卡审核',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/cardDetail',
        name: 'cardDetail',
        component: cardDetail,
        meta: {
          pageTitle: '卡详情'
        }
      },
      {
        path: '/rechargeQuery',
        component: rechargeQuery,
        meta: {
          pageTitle: '充值查询',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/rechargeDetail',
        component: rechargeDetail,
        meta: {
          pageTitle: '充值详情'
        }
      },
      {
        path: '/refundDetail',
        component: refundDetail,
        meta: {
          pageTitle: '退款详情'
        }
      },
      {
        path: '/consumptionDetail',
        component: consumptionDetail,
        meta: {
          pageTitle: '消费详情'
        }
      },
      {
        path: '/consumptionQuery',
        component: consumptionQuery,
        meta: {
          pageTitle: '消费查询',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/accountingChanges',
        component: accountChanges,
        meta:
        {
          pageTitle: '账户变动',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/everydayChange',
        component: everydayChange,
        meta: {
          pageTitle: '每日变动'
        }
      },
      {
        path: '/businessTransaction',
        component: businessTransaction,
        meta: {
          pageTitle: '商户交易',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/financialSettlement',
        component: financialSettlement,
        meta:
        {
          pageTitle: '财务结算',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/depositDetail',
        component: depositDetail,
        meta: {
          pageTitle: '结算详情'
        }
      },
      {
        path: '/withdrawDetail',
        component: withdrawDetail,
        meta: {
          pageTitle: '结算详情'
        }
      },
      {
          path: '/MTBill',//MerchantTransactionBill
          component: merchantTransactionBill,
          meta: {
              pageTitle: '商户交易账单',
              keepAlive: true, //此组件需要被缓存
              isBack:false, //用于判断上一个页面是哪个
          }
      },
      {
          path: '/FSBill',//FinancialSettlementBill
          component: financialSettlementBill,
          meta: {
              pageTitle: '财务结算账单',
              keepAlive: true, //此组件需要被缓存
              isBack:false, //用于判断上一个页面是哪个
          }
      },
      {
        path: '/cardStatistics',
        component: cardStatistics,
        meta: {
          pageTitle: '发卡统计',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/tradeStatistics',
        component: tradeStatistics,
        meta: {
          pageTitle: '交易统计',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/packagePurchase',
        component: packagePurchase,
        meta: {
          pageTitle: '订单查询',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/packageDetail',
        component: packageDetail,
        meta: {
          pageTitle: '套餐购买详情'
        }
      },
      {
        path: '/discountStatistics',
        component: discountStatistics,
        meta: {
          pageTitle: '渠道抵扣',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/packageStatistics',
        component: packageStatistics,
        meta: {
          pageTitle: '购买统计',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/packageBill',
        component: packageBill,
        meta: {
          pageTitle: '套餐购买账单',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      // v1.3
      {
        path: '/abnormalBusiness',
        component: abnormalBusiness,
        meta:
        {
          pageTitle: '异常交易',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/customPath',
        component: customPath,
        meta: {
          pageTitle: '定制菜单',
          keepAlive: false
        }
      },
      {
        path: '/modifyPwd',
        component: modifyPwd,
        meta:
        {
          pageTitle: '修改密码',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      // v1.4
      {
        path: '/extendedTrading',
        component: extendedTrading,
        meta:
        {
          pageTitle: '超期交易',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      // v1.4.1
      {
        path: '/weekCardSettle',
        component: weekCardSettle,
        meta:
        {
          pageTitle: '结算汇总',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/weekCardSale',
        component: weekCardSale,
        meta:
        {
          pageTitle: '运营统计',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      // v1.4.3
      {
        path: '/dayDetail',
        component: dayDetail,
        meta:
        {
          pageTitle: '日报表',
          keepAlive: false, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/goodsDetail',
        component: goodsDetail,
        meta:
        {
          pageTitle: '商品报表',
          keepAlive: false, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      // v1.4.2
      {
        path: '/orderQuery',
        component: orderQuery,
        meta:
        {
          pageTitle: '订单查询',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/equityCardOrderDetail',
        component: equityCardOrderDetail,
        name:"equityCardOrderDetail",
        meta:
        {
          pageTitle: '订单详情',
        }
      },
      {
        path: '/settlementBill',
        component: settlementBill,
        meta:
        {
          pageTitle: '结算账单',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/operationLog',
        component: operationLog,
        meta:
        {
          pageTitle: '操作日志',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },

      // v2.2
      {
        path: '/refundStatistics',
        component: refundStatistics,
        meta:
        {
          pageTitle: '退卡统计',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },

      // v2.2.1
      {
        path: '/couponStatistics',
        component: couponStatistics,
        meta:
        {
          pageTitle: '券统计表',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/couponDayList',
        component: couponDayList,
        meta:
        {
          pageTitle: '券日汇总',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },

      // v3.0
      {
        path: '/refundRecords',
        component: refundRecords,
        meta:
        {
          pageTitle: '订单退款记录',
          keepAlive: false, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/commissionSettle',
        component: commissionSettle,
        meta:
        {
          pageTitle: '分佣结算',
          keepAlive: true, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      },
      {
        path: '/commissionDetail',
        component: commissionDetail,
        meta:
        {
          pageTitle: '分佣明细',
          keepAlive: false, //此组件需要被缓存
          isBack:false, //用于判断上一个页面是哪个
        }
      }
    ]
  }
]
