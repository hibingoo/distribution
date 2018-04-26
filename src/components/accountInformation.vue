<template>
  <div class="accountInformation">
    <mt-header title="账户信息">
      <router-link to="/homePage" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="accountInformation_content">
        <ul>
            <li>
                <div class="label ">账号</div>
                <div class="content ">{{data.account}}</div>
            </li>
            <li>
                <div class="label ">姓名</div>
                <div class="content ">{{data.name}}</div>
            </li>
            <li>
                <div class="label ">级别</div>
                <div class="content ">{{data.level_title}}</div>
            </li>
            <li>
                <div class="label ">店名</div>
                <div class="content ">{{data.store_name}}</div>
                <div class="rewrite" @click="rewrite('store_name')">修改</div>
            </li>
            <li>
                <div class="label ">地址</div>
                <div class="content ">{{data.address}}</div>
                <div class="rewrite" @click="rewrite('address')">修改</div>
            </li>
            <li>
                <div class="label ">上级</div>
                <div class="content ">{{data.higher_account}}</div>
            </li>
            <li>
                <div class="label ">职业</div>
                <div class="content ">{{data.job}}</div>
                <div class="rewrite" @click="rewrite('job')">修改</div>
            </li>
            <li>
                <div class="label ">支付宝</div>
                <div class="content ">{{data.alipay_account}}<span class="alipayName">{{data.alipay_name}}</span></div>
                <div class="rewrite" @click="rewrite('alipay_account','alipay_name')">修改</div>
            </li>
            <li>
                <div class="label ">银行卡</div>
                <div class="content "><p>{{data.bank_title}}</p><p>{{data.bank_id}}</p></div>
                <div class="rewrite" @click="rewrite('bank_title','bank_id')">修改</div>
            </li>
            <li>
                <div class="lgLabel ">超级头条账号</div>
                <div class="content ">{{data.app_account}}</div>
            </li>
            <li>
                <div class="lgLabel ">超级头条邀请码</div>
                <div class="content ">{{data.register_invite_code}}</div>
            </li>
            <li>
                <div class="label ">密码修改</div>
                <div class="rewrite"  @click="rewrite('old_password','password')">修改</div>
            </li>
        </ul>
    </div>
    <div class="modal" v-show="rewriteModalShow" >
        <div class="rewriteModal" v-if="!rewriteModalTwoShow">
            <div class="contentBox">
                <mt-field label="" placeholder="输入" v-model="paramValue"></mt-field>
                <div class="errMsg" v-if="isParamErr">{{message}}</div>
            </div>
            <div class="btnBox">
                <div class="cancel" @click="close">取消</div>
                <div class="ok" @click="ok">确认</div>
            </div>
        </div>
        <div class="rewriteModalTwo" v-if="rewriteModalTwoShow">
            <div class="contentBoxTwo">
                <mt-field label="" :placeholder="placeholderOne" v-model="paramValue"></mt-field>
                <div class="errMsg" v-if="isParamErr">{{message}}</div>
                <mt-field label="" :placeholder="placeholderTwo" v-model="extraParamValue"></mt-field>
                <div class="errMsg" v-if="isExtraParamErr">{{message}}</div>
            </div>
            <div class="btnBox">
                <div class="cancel" @click="close">取消</div>
                <div class="ok" @click="ok">确认</div>
            </div>
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
import { Field } from 'mint-ui';
export default {
  name:'accountInformation',
  data(){
      return{
            rewriteModalShow:false,
            rewriteModalTwoShow:false,
            paramValue:'',
            extraParamValue:'',
            param:'',
            extraParam:'',
            data:{},
            token:'',   
            placeholderOne:'',
            placeholderTwo:'', 
            message:'* 内容不能为空！',
            isParamErr:false,    
            isExtraParamErr:false, 
            isSubmit:true,
      }
  },
  components: {
    nvLoading,
    MessageBox,
    Header,
    Field
  },
  computed: {},
  created(){
      this.token=sessionStorage.getItem('token');
      this.getUserInfo();
  },
  mounted(){},
  methods:{
    /**
     * 获取用户数据
     */
    getUserInfo(){
        let url = API_ROOT + "/profile/getProfile",
            _this = this;
        axios.get(url,{
            params:{'token':_this.token}
        })
            .then(function(res) {
                let rs = res.data;
                console.log(rs.data);
                if(rs && rs.code == 1001){
                    _this.data=rs.data;
                }else{

                }
            })
            .catch(function(err) {
                MessageBox.alert('出现异常', '提示');
            });
    },

    /**
     * 打开修改弹窗
     */
    rewrite(param,extraParam=""){
        this.rewriteModalShow = true;
        this.param=param;
        this.extraParam=extraParam;
        this.rewriteModalTwoShow = extraParam?true:false;
        this.paramValue = this.data[param];
        if(extraParam){
            this.extraParamValue = this.data[extraParam];
        }       
        switch(param){
            case 'alipay_account':
            this.placeholderOne='输入支付宝账号';
            this.placeholderTwo='输入支付宝姓名';
            break;
            case 'bank_title':
            this.placeholderOne='输入银行名称';
            this.placeholderTwo='输入银行卡号';
            break;
            case 'old_password':
            this.placeholderOne='输入旧密码';
            this.placeholderTwo='输入新密码';
            break;
            default:
            break;
        }
    },
    /**
     * 修改
     */
     ok(){
        this.verify(); 
        if(this.isSubmit){
            
            let paramName=this.param,
                extraParamName=this.extraParam,
                _this = this,
                data={},
                url = API_ROOT + "/profile/editProfile";
            data[paramName]=this.paramValue;       
            if(extraParamName){
                data[extraParamName]=this.extraParamValue;
            }
            axios({
                method: "POST",
                url: url,
                params: {
                    token: _this.token,
                },
                data:data,
            })
                .then(function(res) {
                    let rs = res.data;
                    if(rs && rs.code ==1001){
                        MessageBox.alert(rs.msg, '提示');
                        _this.getUserInfo();
                        _this.rewriteModalShow = false;
                        _this.paramValue='';
                        _this.extraParamValue='';
                    }else if(rs.code == 4006){
                        _this.rewriteModalShow = false;
                        MessageBox.alert(rs.msg, '提示');
                        _this.paramValue='';
                        _this.extraParamValue='';
                    }else if(rs.code == 3002){
                        if(_this.param =='old_password'){
                            _this.message=rs.msg;
                            _this.isParamErr=true;
                            clearTimeout(_this.timer1);
                            _this.timer1 = setTimeout(() => {
                                _this.message='* 内容不能为空';
                                _this.isParamErr=false;
                            }, 1500);
                        }
                    }else if(rs.code == 3003){
                        if(_this.param =='old_password'){
                            _this.message=rs.msg;
                            _this.isExtraParamErr=true;
                            clearTimeout(_this.timer2);
                            _this.timer2 = setTimeout(() => {
                                _this.message='* 内容不能为空';
                                _this.isExtraParamErr=false;
                            }, 1500);
                        }
                    }else{

                    }           
                })
                .catch(function(err) {
                    console.log(err);
                });
        }else{}
        
    },
    /**
     * 关闭弹窗
     */
    close() {
      this.rewriteModalShow = false;
      this.paramValue='';
      this.extraParamValue='';
    },
    /**
     * 验证
    */
    verify(){
        if(this.extraParam){
            if(this.paramValue && this.extraParamValue){
                if(this.param =='old_password'){
                    let reg = /^\w{6,12}$/;
                    if(reg.test(this.extraParamValue)){
                        this.isSubmit=true;
                    }else{
                        this.message='* 请输入6至12位包含数字、字母、下划线的密码';
                        this.isExtraParamErr=true;
                        clearTimeout(this.timer1);
                        this.timer1 = setTimeout(() => {
                            this.message='* 内容不能为空';
                            this.isExtraParamErr=false;
                        }, 1500);
                        this.isSubmit=false;
                    }
                }else{
                    this.isSubmit=true;
                }
            }else{
                if(!this.paramValue){
                    this.isParamErr=true;
                    clearTimeout(this.timer2);
                    this.timer2 = setTimeout(() => {
                        this.isParamErr=false;
                    }, 1500);
                }else{

                }
                if(!this.extraParamValue){
                    this.isExtraParamErr=true;
                    clearTimeout(this.timer3);
                    this.timer3 = setTimeout(() => {
                        this.isExtraParamErr=false;
                    }, 1500);
                }
                this.isSubmit=false;
            }
        }else{
            if(!this.paramValue){
                this.isParamErr=true;
                clearTimeout(this.timer4);
                this.timer4 = setTimeout(() => {
                    this.isParamErr=false;
                }, 1500);
                this.isSubmit=false;
            }else{
                this.isSubmit=true;
            }
        }
        
        
    }
  },
    filters: {},
}
</script>
<style>
    .accountInformation .mint-header {
        background-color: #fff;
        height: .9rem;        
    }
    .accountInformation .mint-header .mint-button,
    .accountInformation .mint-header .mint-header-button{
        height: .9rem;
    }
    .accountInformation .mintui-back:before {
        color: #000 !important;
    }
    .accountInformation .mintui-back{
        font-size: .46rem;
    }
    .accountInformation .mint-header-title{
        font-size: .36rem !important;
        overflow: inherit;
    }
    .mint-msgbox{
        width: 70%;
    }
    .accountInformation .mint-cell{
        border-bottom: 1px solid #eeeeee;
        min-height:0;
        height: .75rem;
    }
    .accountInformation .mint-cell-value input{
        color:#999999;
        font-size: .32rem;
    }
    .accountInformation .mint-cell:last-child,
    .accountInformation .mint-cell-wrapper{
        background-size: 0;
        background-image:none;
    }
    .accountInformation .mint-cell-wrapper,
    .accountInformation .mint-cell-value,
    .accountInformation .mint-cell-value input,{
        border: none;
    }
    .accountInformation .mint-cell:last-child:not(:first-child){
        margin-top: .28rem;
    }
</style>

<style scoped lang='less'>
.accountInformation{
    width:7.5rem;
    padding: 0;
    margin:0;
    .accountInformation_content{
        width: 6.9rem;
        margin: 0 auto;
        ul{
            width: 100%;
            li{
                padding: .32rem 0 .32rem 0;
                border-bottom: 1px solid #dddddd;
                font-size: .3rem;
                overflow: hidden;
                zoom: 1;
                &::after {
                    content: '';
                    display: block;
                    clear: both;
                }
                .label,.content,.lgLabel,.rewrite{
                    float: left;
                }
                .label{
                    width: 1.38rem;
                    color: #333333;
                }
                .content{
                    color: #666666;
                    max-width: 4.5rem;
                    p{
                       color: #666666; 
                    }
                    .alipayName{
                        margin-left: .2rem;
                        color: #666666;
                    }
                }
                .lgLabel{
                    width: 2.57rem;
                    color: #333333;
                }
                .rewrite{
                    margin-left: .3rem;
                    text-decoration: underline;
                    color: #3142e1;
                }
            }
        }
    }
    .modal{
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 2;
        .rewriteModal{
            width: 5rem;
            height: 3.3rem;
            position: absolute;
            top: 50%;
            margin-top:-1.65rem;
            left: 50%;
            margin-left:-2.5rem;
            background: #ffffff;
            .contentBox{
                height: 2.42rem;
                padding: .82rem .3rem 0;
            }
        }
        .rewriteModalTwo{
            width: 5rem;
            height: 4.2rem;
            position: absolute;
            top: 50%;
            margin-top:-2.1rem;
            left: 50%;
            margin-left:-2.5rem;
            background: #ffffff;
            .contentBoxTwo{
                height: 3.32rem;
                padding: .72rem .3rem 0;
            }
        }
        .rewriteModal,.rewriteModalTwo{
            .errMsg{
                padding-left: 10px;
                line-height: 1;
                margin: .05rem 0;
                color: #d53c3e;
            }
            .btnBox{
                width: 100%;
                .cancel,.ok{
                    height: .88rem;
                    width: 50%;
                    float: left;
                    text-align: center;
                    line-height: .88rem;
                    font-size: .36rem;
                }
                .cancel{
                    background: #eeeeee;
                    color:#666666;
                }
                .ok{
                    background: #d53c3e;
                    color:#ffffff;
                }
            }
        }
    }
}

</style>

