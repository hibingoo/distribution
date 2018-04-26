<template>
  <div class="withdrawals">
    <mt-header title="">
      <router-link to="/homePage" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <article>
      <div class="article">
        <div class="header">提现到</div>
        <div class="radiolist">
          <a class="cell">
            <div class="cellWrapper" @click="checkinput(1)">
              <label class="cellTitle">
                <span class="radio">
                  <input type="radio" class="radioInput" value="支付宝" :checked="checked">
                  <span class="radioCore"></span>
                </span>
                <span class="bank">支付宝</span>
                <span class="number">{{baseData.account}}</span>
              </label>
            </div>
          </a>
          <a class="cell" v-if="baseData.bank_title!=null">
            <div class="cellWrapper" @click="checkinput(2)">
              <div class="cellTitle">
                <span class="radio">
                  <input type="radio" class="radioInput" value="支付宝" :checked="!checked">
                  <span class="radioCore"></span>
                </span>
                <span class="bank">银行卡</span>
                <div class="numberbr">{{baseData.bank_title}}&nbsp;{{baseData.bank_id}}</div>
              </div>
            </div>
          </a>
        </div>
        <div class="withdrawsMoney clear">
          <div class="moneyList left" @click.stop="sendMoney(4)" :class="{active:4==index}">
            <span class="money">4</span>
            <span class="small">元</span>
          </div>
          <div class="moneyList left" @click.stop="sendMoney(50)" :class="{active:50==index}">
            <span class="money">50</span>
            <span class="small">元</span>
          </div>
          <div class="moneyList left" @click.stop="sendMoney(100)" :class="{active:100==index}">
            <span class="money">100</span>
            <span class="small">元</span>
          </div>
          <div class="moneyList left" @click.stop="sendMoney(500)" :class="{active:500==index}">
            <span class="money">500</span>
            <span class="small">元</span>
          </div>
          <div class="moneyList left" @click.stop="sendMoney(1000)" :class="{active:1000==index}">
            <span class="money">1000</span>
            <span class="small">元</span>
          </div>
          <div class="moneyList left" @click.stop="sendMoney(10000)" :class="{active:10000==index}">
            <span class="maxMoney">10000</span>
            <span class="small">元</span>
          </div>
        </div>
      </div>
    </article>
    <footer>
      <button type="button" class="btn" @click.stop="submitWithdrawals(index)">申请提现</button>
      <div class="tips">每天可以提现一次哦</div>
    </footer>
  </div>
</template>
<script>
import axios from "axios";
import nvLoading from "../common/loading";
import { API_ROOT } from "../api/config";
import { Radio, Header, MessageBox } from "mint-ui";
export default {
  name: "CreateLover",
  data() {
    return {
      bank: "招商银行",
      Alipay: "848782824",
      BankNumber: "636423574678258",
      isActive: false,
      checked: true,
      index: 4,
      AccountMoney: "100",
      baseData: {}
    };
  },
  components: {
    nvLoading,
    Radio,
    Header,
    MessageBox
  },
  created() {},
  mounted() {
    this.getTradeInfo();
  },
  methods: {
    checkinput(value) {
      switch (value) {
        case 1:
          this.checked = true;
          break;
        case 2:
          this.checked = false;
          break;
        default:
          this.checked = true;
          break;
      }
    },
    //点击登录调用方法
    sendMoney(value) {
      switch (value) {
        case 4:
          this.index = 4;
          break;
        case 50:
          this.index = 50;
          break;
        case 100:
          this.index = 100;
          break;
        case 500:
          this.index = 500;
          break;
        case 1000:
          this.index = 1000;
          break;
        case 10000:
          this.index = 10000;
          break;
        default:
          break;
      }
    },
    submitWithdrawals(data) {
      let url = API_ROOT + "/order/applyCash";
      let token = sessionStorage.getItem("token");
      let _this = this;
      let account = this.checked ? "alipay" : "bank";
      if (false) {
        MessageBox("友情提醒", "每天只可以提现一次哦，明天再来提现！");
      } else {
        if (data >= this.baseData.available_money) {
          MessageBox(
            "友情提醒",
            "您账户余额应大于" + data + "元可提现,请继续努力！"
          );
        } else {
          MessageBox.confirm("您确定提现" + data + "元？").then(action => {
            axios({
              method: "POST",
              url: url,
              params: {
                token: token
              },
              data: {
                price_cash: data,
                bill_type: account
              }
            })
              .then(function(res) {
                let rs = res.data;
                if (rs && rs.code === 1001) {
                  MessageBox("友情提醒", "提现成功，等待人工审核通知！");
                } else if (rs.code === 4001) {
                   MessageBox("友情提醒", rs.msg+',请明日再来！');
                } else if (rs && rs.code === 4008) {
                }
              })
              .catch(function(err) {
                console.log(err);
              });
          });
        }
      }
    },
    //初始化页面数据
    getTradeInfo() {
      let token = sessionStorage.getItem("token");
      let url = API_ROOT + "/order/getTradeInfo";
      let _this = this;
      axios({
        method: "GET",
        url: url,
        params: {
          token: token
        }
      })
        .then(function(res) {
          let rs = res.data;
          if (rs && rs.code === 1001) {
            _this.baseData = rs.data;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
</script>
<style>

</style>
<style scoped lang="less">
.mint-header {
  background-color: #fff;
}

.mintui-back:before {
  color: #000 !important;
}

.withdrawals {
  background-color: #fff;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  article {
    .article {
      .header {
        margin-top: 0.6rem;
        font-size: 0.36rem;
        font-weight: 600;
        padding: 0 0.3rem;
      }
      .radiolist {
        margin-top: 0.6rem;
        padding: 0 0.3rem;
        .cell {
          background-color: #fff;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          min-height: 1rem;
          display: block;
          overflow: hidden;
          position: relative;
          text-decoration: none;
          .cellWrapper {
            background-repeat: no-repeat;
            background-position: top left;
            background-origin: content-box;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            line-height: 1;
            min-height: inherit;
            overflow: hidden;
            width: 100%;
            .cellTitle {
              -webkit-box-flex: 1;
              -ms-flex: 1;
              flex: 1;
              cursor: default;
              .radio {
                .radioInput {
                  box-sizing: border-box;
                  padding: 0;
                  display: none;
                }
                .radioInput:checked + .radioCore::after {
                  background-color: #d53c3e;
                  -webkit-transform: scale(1);
                  transform: scale(1);
                }
                .radioInput:checked + .radioCore {
                  background-color: #fff;
                }
                .radioCore {
                  -webkit-box-sizing: border-box;
                  box-sizing: border-box;
                  display: inline-block;
                  background-color: #fff;
                  border-radius: 100%;
                  border: 1px solid #e4e4e4;
                  position: relative;
                  width: 0.4rem;
                  height: 0.4rem;
                  vertical-align: middle;
                }
                .radioCore::after {
                  content: " ";
                  border-radius: 100%;
                  top: 0.06rem;
                  left: 0.06rem;
                  position: absolute;
                  width: 0.24rem;
                  height: 0.24rem;
                  -webkit-transition: -webkit-transform 0.2s;
                  transition: -webkit-transform 0.2s;
                  transition: transform 0.2s;
                  transition: transform 0.2s, -webkit-transform 0.2s;
                  -webkit-transform: scale(0);
                  transform: scale(0);
                }
              }
              .bank {
                font-size: 0.32rem;
                font-weight: 600;
              }
              .number {
                font-size: 0.26rem;
                font-weight: 600;
                color: #666;
              }
              .numberbr {
                padding-left: 0.48rem;
                font-size: 0.26rem;
                font-weight: 600;
                color: #666;
              }
            }
          }
        }
      }
      .withdrawsMoney {
        margin-top: 1rem;
        width: 100%;
        padding-left: 0.1rem;
        z-index: 1;
        .moneyList {
          margin: 0 0.225rem 0.4rem 0.225rem;
          width: 2rem;
          height: 1.8rem;
          background-color: #fff;
          border-radius: 10px;
          line-height: 1.8rem;
          text-align: center;
          box-shadow: 0px 0px 4px 0 rgba(0, 0, 0, 0.2);
          .money {
            font-size: 0.6rem;
            color: #d53c3e;
            font-weight: 600;
            font-style: italic;
          }
          .small {
            font-size: 0.3rem;
            color: #d53c3e;
            font-weight: 600;
          }
          .maxMoney {
            color: #d53c3e;
            font-weight: 600;
            font-style: italic;
            font-size: 0.5rem;
          }
        }
        .active {
          background-color: #d53c3e;
          .money {
            color: #fff;
          }
          .small {
            color: #fff;
          }
          .maxMoney {
            color: #fff;
          }
        }
      }
    }
  }
  footer {
    margin-top: 0.6rem;
    padding: 0 0.3rem;
    .btn {
      width: 100%;
      height: 0.88rem;
      background-color: #d53c3e;
      border-radius: 10px;
      font-size: 0.36rem;
      line-height: 0.88rem;
      color: #fff;
    }
    .btn:active {
      transform: scale(0.98);
    }
    .tips {
      margin-top: 0.24rem;
      font-size: 0.3rem;
      color: #999999;
    }
  }
}
</style>
