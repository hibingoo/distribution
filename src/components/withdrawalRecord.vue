<template>
  <div class="withdrawalRecord">
    <mt-header title="提现记录">
      <router-link to="/homePage" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="withdrawalRecord_gap"></div>
    <div class="withdrawalRecord_table">
        <div class="tableRow" v-for="(item,$index) in data" :key="$index">
            <div class="recordDate tableCell">
                <p>
                    <span>{{item.created_date}}</span>
                    <span>{{item.created_time}}</span>
                </p>
            </div>
            <div class="record tableCell">提现{{item.price_cash}}元</div>
            <div class="alipay tableCell">
                <p>
                    <span v-if="item.bill_type == 'alipay'">支付宝</span>
                    <span v-if="item.bill_type == 'wechat'">微信</span>
                    <span v-if="item.bill_type == 'bank'">银行卡</span>
                    <span>{{item.account}}</span>
                </p>
            </div>
            <div class="recordStatus tableCell" v-if="item.status == 1">待处理</div>
            <div class="recordStatus tableCell" v-if="item.status == 2">通过</div>
            <div class="recordStatus tableCell" v-if="item.status == 3">拒绝</div>
            <div class="recordStatus tableCell" v-if="item.status == 4">处理失败</div>
        </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import nvLoading from "../common/loading";
import { API_ROOT } from "../api/config";
import { MessageBox } from "mint-ui";
import { Header } from "mint-ui";

export default {
  name:'withdrawalRecord',
  data(){
      return{
          data:[],
      }
  },
  components: {
    nvLoading,
    MessageBox,
    Header
  },
  computed: {},
  created(){
      this.token=sessionStorage.getItem('token');
      this.getWithdrawalRecord();
  },
  mounted(){

  },
  methods:{
      getWithdrawalRecord(page){
        let url = API_ROOT + "/order/applyLog",
            _this = this;
        axios.get(url,{
            params:{'token':_this.token}
        })
            .then(function(res) {
                let rs = res.data;
                if(rs && rs.code == 1001){
                    _this.data=rs.data.data;
                }else{

                }
            })
            .catch(function(err) {
                MessageBox.alert('出现异常', '提示');
            });
      }
  },
  filters: {},
}
</script>
<style>
    .withdrawalRecord .mint-header {
        background-color: #fff;
        height: .9rem;
    }
    .withdrawalRecord .mint-header .mint-button,
    .withdrawalRecord .mint-header .mint-header-button{
        height: .9rem;
    }
    .withdrawalRecord .mintui-back:before {
        color: #000 !important;
    }
    .withdrawalRecord .mintui-back{
        font-size: .46rem;
    }
    .withdrawalRecord .mint-header-title{
        font-size: .36rem !important;
        overflow: inherit;
    }
</style>

<style scoped lang='less'>
.withdrawalRecord{
    width:7.5rem;
    padding: 0;
    margin:0;
    .withdrawalRecord_gap{
        width:100%;
        height: .2rem;
        background:#f5f5f5;
    }
    .withdrawalRecord_table{
        width:100%;
        .tableRow{
            width:100%;
            border-bottom:.01rem solid #dddddd;
            overflow: hidden;
            .tableCell{
                height: 1rem;
                float: left;
                text-align: center;
                display:-webkit-box;
                display: -webkit-flex;
                display: flex;
                justify-content: space-around;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                -webkit-flex-direction:column;
                flex-direction: column;
            }
            .recordDate{
                width: 2.01rem;
                border-right:.01rem solid #dddddd;
                span{
                    font-size: .24rem;
                    color: #666666;
                }

            }
            .record{
                width: 2.21rem;
                border-right:.01rem solid #dddddd;
                font-size: .26rem;
                color: #333333;
            }
            .alipay{
                width: 1.96rem;
                border-right:.01rem solid #dddddd;
                span{
                    font-size: .24rem;
                    color: #666666;
                }
            }
            .recordStatus{
                width: 1.29rem;
                font-size: .26rem;
                color: #666666;
            }
        }
    }
}

</style>

