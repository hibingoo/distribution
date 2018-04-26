<template>
  <div class="homePage">
    <header class="header">
      <div class="top">
        <router-link to="/accountInformation">
          <div class="tip">
            <span class="iconfont icon">&#xe647;</span>
            <span class="text">账户信息</span>
          </div>
        </router-link>
        <div class="tip" @click.stop="cashProvided('Lower')">+创建下级</div>
      </div>
      <div class="bottom">
        <div class="Load">
          <span class="LoadText" @click.stop="UpdateCrash()">可提现</span>
          <span class="iconfont Loadicon" @click.stop="UpdateCrash()" :class="{circle:circle}">&#xe666;</span>
        </div>
        <div class="money">{{withdrawCash}}
          <span class="small">元</span>
        </div>
        <div class="record">
          <div class="order" @click.stop="cashProvided('cash')">
            <span class="iconfont walet">&#xe616;</span>
            <span class="recordtext">提现</span>
          </div>
          <div class="order" @click.stop="cashProvided('Record')">
            <span class="iconfont walet">&#xe61e;</span>
            <span class="recordtext">记录</span>
          </div>
        </div>
      </div>
    </header>
    <article>
      <div class="todayNext">
        <div class="today">
          <div class="todayincome">今日收入</div>
          <div class="todaymoney">{{today}}
            <span class="yuan">元</span>
          </div>
          <div class="yesactive active">已结算</div>
        </div>
        <div class="today">
          <div class="todayincome">预估收入</div>
          <div class="todaymoney">{{nextDay}}
            <span class="yuan">元</span>
          </div>
          <div class="noactive active">待结算</div>
        </div>
      </div>
      <div class="data">
        <div class="list" @click.stop="cashProvided('LowerData')">
          <span class="dataText">下级数据</span>
          <span class="iconfont dataIcon">&#xe6a7;</span>
        </div>
          <div class="list" @click.stop="mechanism">
            <span class="dataText">奖励机制</span>
            <span class="iconfont dataIcon">&#xe6a7;</span>
          </div>
      </div>
    </article>

    <footer>
      <div class="footer">
        <!-- <div class="footerMes" @click.stop="feedback">反馈</div> -->
        <div class="footerMes" @click.stop="customer">联系客服</div>
        <div class="footerMes" @click.stop="superior">联系上级</div>
      </div>
    </footer>
  </div>
</template>
<script>
import axios from "axios";
import { API_ROOT } from "../api/config";
import { MessageBox } from "mint-ui";
export default {
  name: "homePage",
  data() {
    return {
      today: "",
      nextDay: "",
      withdrawCash: "",
      circle: false,
      firstapply: 1
    };
  },
  components: {},
  created() {
    this.UpdateCrash();
  },
  mounted() {},
  methods: {
    // 权限管理  /furtherInformation
    cashProvided(data) {
      let level = sessionStorage.getItem("level");
      if (data === "cash") {
        if (level == 1) {
          MessageBox("提现说明", "经理合伙人提现由客服专人处理");
        } else {
          if (this.firstapply == 1) {
            this.$router.push({
              path: "/furtherInformation"
            });
          } else {
            this.$router.push({
              path: "/withdrawals"
            });
          }
        }
      } else if (data === "Record") {
        if (level == 1) {
          MessageBox("提现说明", "经理合伙人提现由客服专人处理");
        } else {
          this.$router.push({
            path: "/withdrawalRecord"
          });
        }
      } else if (data === "Lower") {
        if (level == 3) {
          MessageBox("创建下级", "您不可以创建下级");
        } else {
          this.$router.push({
            path: "/CreateLower"
          });
        }
      } else if (data === "LowerData") {
        if (level == 1) {
          this.$router.push({
            path: "/supperPartner"
          });
        } else if (level == 2) {
          this.$router.push({
            path: "/bosslist"
          });
        } else if (level == 3) {
          this.$router.push({
            path: "/disciplePartner"
          });
        }
      }
    },
    // 提现金额数据更新
    UpdateCrash(value) {
      this.circle = true;
      let token = sessionStorage.getItem("token");
      let url = API_ROOT + "/order/getTradeShow";
      let _this = this;
      axios({
        method: "POST",
        url: url,
        params: {
          token: token
        },
        data: {
          value: value
        }
      })
        .then(function(res) {
          let rs = res.data;
          if (rs && rs.code === 1001) {
            _this.withdrawCash = rs.data.available_money;
            _this.today = rs.data.today_money;
            _this.nextDay = rs.data.estimate_money;
            _this.circle = false;
            _this.firstapply = rs.data.is_first_apply;
          } else if (rs.code == 4002) {
          } else {
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    // 联系客服
    customer() {
      MessageBox("联系客服", "微信号：SuperToutiao");
    },
    mechanism() {
      this.$router.push({
        path: "/mechanism"
      });
    },
    // 联系上级
    superior() {
      let level = sessionStorage.getItem("level");
      if (level == 1) {
        MessageBox("联系上级", "手机号：18625149596、18626298687");
      } else {
        MessageBox("联系上级", "手机号：上级的手机号");
      }
    }
  }
};
</script>
<style scoped lang="less">
.circle {
  display: inline-block;
  animation: circle 1s infinite linear;
  -webkit-animation: circle 1s infinite linear;
}
@-webkit-keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.homePage {
  .header {
    background-color: #fd9a31;
    padding: 0 0.3rem;
    height: 4.5rem;
    .top {
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      .tip {
        height: 1.1rem;
        font-size: 0.3rem;
        line-height: 1.1rem;
        color: #fff;
        .text {
          margin-left: 0.1rem;
          color: #fff;
        }
        .icon {
          font-size: 0.3rem;
          vertical-align: top;
        }
      }
    }
    .bottom {
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      margin-top: 0.4rem;
      .Load {
        .LoadText {
          font-size: 0.3rem;
          color: #fff;
        }
        .Loadicon {
          font-size: 0.3rem;
          color: #fff;
        }
      }
      .money {
        margin-top: 0.3rem;
        font-size: 0.72rem;
        font-weight: 700;
        color: #fff;
        .small {
          font-size: 0.36rem;
          color: #fff;
        }
      }
      .record {
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 0.5rem;
        .order {
          flex-grow: 1;
          .walet {
            font-size: 0.36rem;
            color: #fff;
          }
          .recordtext {
            font-size: 0.36rem;
            color: #fff;
            padding-left: 0.21rem;
          }
        }
      }
    }
  }
  article {
    .todayNext {
      display: flex;
      display: -webkit-flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: flex-start;
      height: 1.9rem;
      .today {
        flex-grow: 1;
        padding: 0 0.3rem;
        .todayincome {
          font-size: 0.3rem;
          color: #666666;
          margin-top: 0.3rem;
        }
        .todaymoney {
          font-size: 0.4rem;
          font-weight: 700;
          margin-top: 0.1rem;
          .yuan {
            font-size: 0.3rem;
            font-weight: 700;
          }
        }
        .active {
          font-size: 0.26rem;
          margin-top: 0.2rem;
        }
        .yesactive {
          color: #3142e1;
        }
        .noactive {
          color: #fcb045;
        }
      }
    }
    .data {
      border-top: 0.2rem solid #f5f5f5;
      padding: 0 0.3rem;
      .list {
        height: 1rem;
        width: 100%;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;
        .dataText {
          line-height: 1rem;
          font-size: 0.3rem;
          font-weight: 700;
          color: #333;
        }
        .dataIcon {
          line-height: 1rem;
          font-size: 0.3rem;
          color: #333;
        }
      }
    }
  }
  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    .footer {
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      .footerMes {
        width: 3.72rem;
        height: 0.94rem;
        font-size: 0.34rem;
        line-height: 0.94rem;
        background-color: #eeeeee;
        text-align: center;
      }
    }
  }
}
</style>
