<template>
  <div>
    <mt-header title="">
      <router-link to="/homePage" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="register">
      <div class="register_partner">创建下级</div>
      <form class="register_input">
        <section class="form_wrap">
          <input type="tel" maxlength="11" placeholder="超级头条账号（手机号码）" v-model="ruleForm.phoneNmuber">
          <div class="matchNumber" @click.stop="matchNumber">匹配手机号</div>
        </section>
        <section class="form_wrap">
          <div class="readonly">{{ruleForm.invitationcode}}</div>
        </section>
        <section class="form_wrap">
          <div class="readonly">{{ruleForm.password}}</div>
        </section>
        <section class="form_wrap">
          <button @click.stop="submitForm" type="button">立即创建</button>
        </section>
      </form>
      <transition name="fade">
        <div class="errMsg">{{message}}</div>
      </transition>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import nvLoading from "../common/loading";
import { API_ROOT } from "../api/config";
import { MessageBox, Header } from "mint-ui";
export default {
  name: "CreateLover",
  data() {
    return {
      ruleForm: {
        phoneNmuber: "",
        password: "初始密码6个8",
        invitationcode: "超级头条邀请码"
      },
      message: "",
      request: false
    };
  },
  components: {
    nvLoading,
    MessageBox,
    Header
  },
  created() {
    console.log(API_ROOT);
  },
  mounted() {},
  methods: {
    //点击登录调用方法
    matchNumber() {
      var name = this.ruleForm.phoneNmuber;
      var pattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (name == "" || name == null || !pattern.test(name)) {
        this.message = "请输入正确手机号";
        setTimeout(() => {
          this.message = "";
        }, 1500);
        return;
      }
      let url = API_ROOT + "/auth/checkFlow";
      let _this = this;
      axios({
        method: "POST",
        url: url,
        data: {
          account: this.ruleForm.phoneNmuber
        },
        params:{
          token: sessionStorage.getItem("token")
        }
      })
        .then(function(res) {
          let rs = res.data;
          if (rs && rs.code === 1001) {
            _this.request = true;
            _this.ruleForm.invitationcode = rs.data.register_invite_code;
            _this.message = rs.msg;
            setTimeout(() => {
              _this.message = "";
            }, 1500);
          } else {
            _this.message = rs.msg;
            setTimeout(() => {
              _this.message = "";
            }, 1500);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    submitForm() {
      var name = this.ruleForm.phoneNmuber;
      if (name == "" || name == null) {
        this.message = "请输入正确手机号";
        setTimeout(() => {
          this.message = "";
        }, 1500);
        return;
      } else {
        if (this.request) {
          let url = API_ROOT + "/auth/generateJunior";
          let _this = this;
          axios({
            method: "POST",
            url: url,
            data: {
              account: this.ruleForm.phoneNmuber
            },
            params:{
              token: sessionStorage.getItem("token")
            }
          })
            .then(function(res) {
              MessageBox("创建下级", "创建下级成功");
            })
            .catch(function(err) {
              _this.message = "出现异常";
            });
        } else {
          this.message = "请先匹配手机号";
          setTimeout(() => {
            this.message = "";
          }, 1500);
          return;
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
.mint-header {
  background-color: #fff;
}

.mintui-back:before {
  color: #000 !important;
}

.register {
  padding: 0 0.6rem;
  .register_partner {
    font-size: 0.36rem;
    color: #000;
    font-weight: 600;
    margin-top: 0.84rem;
    text-align: center;
  }
  .register_input {
    margin-top: 0.54rem;
    box-sizing: inherit;
    -webkit-tap-highlight-color: transparent;
    .form_wrap {
      position: relative;
      height: 0.85rem;
      font-size: 0.3rem;
      line-height: 0.85rem;
      margin-top: 0.34rem;
      input {
        width: 100%;
        height: 100%;
        left: 0;
        padding-left: 0.21rem;
        border: 1px solid #ddd;
        color: #999;
        -webkit-appearance: none;
        border-radius: 0.1rem;
      }
      .readonly{
        width: 100%;
        height: 100%;
        left: 0;
        padding-left: 0.21rem;
        border: 1px solid #ddd;
        background-color: #f5f5f5;
        color: #999;
        border-radius: 0.1rem;
      }
      button {
        width: 100%;
        height: 0.88rem;
        border-radius: 0.1rem;
        background-color: #d53c3e;
        font-size: 0.32rem;
        color: #fff;
        line-height: 0.88rem;
      }
      button:active {
        transform: scale(0.98);
      }
      .matchNumber {
        position: absolute;
        right: 0;
        top: 0;
        width: 2.2rem;
        height: 100%;
        background-color: #d53c3e;
        color: #fff;
        font-size: 0.34rem;
        border-top-right-radius: 0.1rem;
        border-bottom-right-radius: 0.1rem;
        text-align: center;
      }
    }
    .form_wrap:last-child {
      margin-top: 0.8rem;
    }
    .form_wrap:nth-child(2) {
      input {
        background: #f5f5f5;
        border: 0;
      }
    }
    .form_wrap:nth-child(3) {
      input {
        background: #f5f5f5;
        border: 0;
      }
    }
  }
  .errMsg {
    height: 1rem;
    width: 100%;
    line-height: 1rem;
    display: block;
    text-align: center;
    color: #d53c3e;
  }
}
</style>
