<template>
    <div class="furtherInformation">
    
        <mt-header title="">
    
            <router-link to="/homePage" slot="left">
    
                <mt-button icon="back"></mt-button>
    
            </router-link>
    
        </mt-header>
    
        <div class="furtherInformation_content">
    
            <div class="header">首次提现补充资料</div>
    
            <div class="formData">
    
                <mt-field class="required" placeholder="请输入姓名" v-model="formData.name"></mt-field>
    
                <mt-field class="required" placeholder="请输入身份证" v-model="formData.id_card"></mt-field>
    
                <mt-field placeholder="请输入职业" v-model="formData.job"></mt-field>
    
                <mt-field placeholder="请输入联系地址" v-model="formData.address"></mt-field>
    
                <mt-field placeholder="请输入店名" v-model="formData.store_name"></mt-field>
    
                <div class="header">支付宝</div>
    
                <mt-field class="required" placeholder="请输入支付宝账号" v-model="formData.alipay_account"></mt-field>
    
                <mt-field class="required" placeholder="请输入支付宝姓名" v-model="formData.alipay_name"></mt-field>
    
                <div class="header">银行卡</div>
    
                <mt-field class="required" placeholder="请输入银行名称" v-model="formData.bank_title"></mt-field>
    
                <mt-field class="required" placeholder="请输入银行卡号" v-model="formData.bank_id"></mt-field>
    
            </div>
    
            <div class="btn " :class="isSubmit?'red':''" @click="submit">提交资料</div>
    
        </div>
    
    </div>
</template>
<script>
    import axios from "axios";
    
    import nvLoading from "../common/loading";
    
    import {
    
        API_ROOT
    
    } from "../api/config";
    
    import {
    
        MessageBox
    
    } from "mint-ui";
    
    import {
    
        Header
    
    } from "mint-ui";
    
    import {
    
        Field
    
    } from 'mint-ui';
    
    
    
    export default {
    
        name: 'furtherInformation',
    
        data() {
    
            return {
                isSubmit:false,
    
                formData: {
    
                    name: '',
    
                    id_card: '',
    
                    job: '',
    
                    address: '',
    
                    store_name: '',
    
                    alipay_account: '',
    
                    alipay_name: '',
    
                    bank_title: '',
    
                    bank_id: '',
    
                }
    
            }
    
        },
    
        components: {
    
            nvLoading,
    
            MessageBox,
    
            Header,
    
            Field
    
        },
    
        created() {
            this.token=sessionStorage.getItem('token');
            this.getUserInfo();  
    
        },
    
        mounted() {
    
    
    
        },
    
        methods: {
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
                        if(rs && rs.code == 1001){
                            _this.formData=rs.data;
                        }else{

                        }
                    })
                    .catch(function(err) {
                    });
            },
            /**
             * 提交用户数据
            */
            submit() {
                if(this.isSubmit){
                    let _this=this,
                        data=this.formData,
                        url = API_ROOT + "/profile/editProfile";
                    axios({
                        method: "POST",
                        url,
                        params: {
                            token: _this.token,
                        },
                        data,
                    })
                        .then(function(res) {
                            let rs = res.data;
                            if(rs && rs.code ==1001){
                                MessageBox.alert(rs.msg, '提示').then(action => {
                                    _this.$router.push({
                                    path: "/withdrawals"
                                    });
                                });
                            }else if(rs.code == 4006){
                                MessageBox.alert(rs.msg, '提示');
                            }else{
                            }            
                        })
                        .catch(function(err) {
                            MessageBox.alert('出现异常', '提示');
                        });
                }

            },
            /**
             * 验证非空
            */
            verify(){
                let data = this.formData;
                if(data.name && data.id_card && data.alipay_account && data.alipay_name && data.bank_title && data.bank_id){
                    this.isSubmit=true;
                }else{
                    this.isSubmit=false;
                }
            }
        },
        watch: {
            formData:{
                handler(val, oldVal){
                    this.verify();
                },
                deep:true,
            }
        }

    }
</script>

<style>
    .furtherInformation .mint-header {
    
        background-color: #fff;
    
        height: .9rem;
    
    }
    
    
    
    .furtherInformation .mintui-back:before {
    
        color: #000 !important;
    
    }
    
    
    
    .furtherInformation .mintui-back {
    
        font-size: .46rem;
    
    }
    
    
    
    .furtherInformation .mint-cell {
    
        border: 1px solid #eeeeee;
    
        min-height: 0;
    
        height: .75rem;
    
        margin: .3rem 0 0 .3rem;
    
    }
    
    
    
    .furtherInformation .mint-cell:last-child {
    
        background-size: 100% 0px;
    
    }
    input::-webkit-input-placeholder{
        color:#999999;
    }
</style>

<style lang="less" scoped>
    .furtherInformation {
    
        width: 7.5rem;
    
        padding: 0;
    
        margin: 0;
    
        .furtherInformation_content {
    
            padding: 0 0.3rem;
    
            .header {
    
                margin: 0.6rem 0 0.4rem;
    
                font-size: 0.36rem;
    
                font-weight: 600;
    
                letter-spacing: .01rem;
    
            }
    
            .formData {
    
                .required {
    
                    position: relative;
    
                    overflow: inherit;
    
                    &::before {
    
                        content: '*';
    
                        color: #d53c3e;
    
                        position: absolute;
    
                        top: 50%;
    
                        left: -.3rem;
    
                        margin-top: -.15rem;
    
                        font-size: .32rem;
    
                    }
    
                }
    
            }
    
            .btn {
    
                width: 6rem;
    
                height: .88rem;
    
                margin: .4rem auto .5rem;
    
                background: #dddddd;
    
                text-align: center;
    
                line-height: .88rem;
    
                font-size: .36rem;
    
                color: #ffffff;

                &.red{
                    background: #d53c3e;  
                }
    
            }
    
        }
    
    }
</style>

