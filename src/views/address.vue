<template>
  <div>
    <nav-header>
      <a href="javascript:;" slot="login" v-if="checkIfLogin">
        欢迎  {{userName}}
      </a>
      <a href="javascript:;" slot="register" v-if="checkIfLogin">
        当前是地址选择
      </a>
      <img src="../../static/picture/CartIcon.png" slot="register" v-if="checkIfLogin" class="header-icon">
      <a href="#/cart" slot="register" v-if="checkIfLogin">
        去购物车
      </a>
      <img src="../../static/picture/HomeIcon.png" slot="register" v-if="checkIfLogin"  class="header-icon">
      <a href="/" slot="register" v-if="checkIfLogin">
        去主页
      </a>
    </nav-header>
    <nav-bred>
      <slot>当前是地址选择页面</slot>
    </nav-bred>
    <div class="adressMain">
      <div class="adressWrap">
        <ul class="adressWrap-ul">
          <li class="adressWrap-li" v-bind:class="{'adressWrap-li-checked':item.ifChecked=='1'?true:false}" v-for="item in addressList">
            <span @click="openIfDel(item.addressId)">x</span>
            <div class="addressUserName">{{item.addressUserName}}</div>
            <div class="addressMsg">{{item.addressMsg}}</div>
            <div class="postCode">{{item.postCode}}</div>
            <div class="tel">{{item.tel}}</div>
            <button @click="chooseThisAddress(item.addressId)">选择此地址</button>
          </li>
          <li class="adressWrap-li" @click="openAddressForm">
            <a>+</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="toPayMain">
      <div class="toPayWrap">
        <button @click="openIfPay">付款</button>
      </div>
    </div>
    <div class="zhifubaozhanghao" v-if="zhanghao">
      <div class="zhifubaozhezhao"></div>
      <div class="box">
        <span @click="closezhaohaoOrmima('11')">x</span>
        <img src="../../static/picture/zhifubao.png" alt="">
        <input autofocus="autofocus" type="text" v-model="zhifuzhanghao" placeholder="请输入您的支付宝账号" oninput="value=value.replace(/[^\d]/g,'')" maxlength="11">
        <button @click="zhaanghaotopay">支付</button>
      </div>   
    </div>
    <div class="zhifubaozhanghao" v-if="mima">
      <div class="zhifubaozhezhao"></div>
      <div class="box">
        <span @click="closezhaohaoOrmima('22')">x</span>
        <img src="../../static/picture/zhifubao.png" alt="">
        <input type="password" v-model="zhifumima" placeholder="请输入您的支付密码" oninput="value=value.replace(/[^\d]/g,'')" maxlength="6">
        <button @click="mimatopay">确定</button>
      </div>   
    </div>
    <div class="likePay" v-if="ifPay">
      <div class="payZhezhao"></div>
      <p>正在支付</p>
      <img src="../../static/picture/payLoading.gif" alt="">
    </div>
    <div class="addNewAddress" v-bind:class="{'addNewAddressShow':addNewAddressClose}">
      <div class="addNewAddressZheZhao" @click="closeAddressForm"></div>
      <div class="addNewAddressMsg">
        <span @click="closeAddressForm">x</span>
        <input type="text" v-model="souHuoName" placeholder="请输入您的收货名" maxlength="10">
        <input type="text" v-model="souHuoAddress" placeholder="请输入您的收货地址">
        <input type="text" v-model="souHuoPostCode" placeholder="请输入您的邮编" oninput="value=value.replace(/[^\d]/g,'')" maxlength="6">
        <input type="text" v-model="souHuoTel" placeholder="请输入您的电话号码" oninput="value=value.replace(/[^\d]/g,'')" maxlength="11">
        <button @click="addAddressNow">添加</button>
      </div>
    </div>
    <tan-chu-model v-bind:mdShow="toDelAdress">
      <div slot="msg" class="msg">您确定要删除该地址吗</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="sureDel">确定</button>
        <button @click="closeIfDel">取消</button>
      </div>
    </tan-chu-model>
    <tan-chu-model v-bind:mdShow="successPay">
      <div slot="msg" class="msg">恭喜您付款成功</div>
      <div slot="btnGroup" class="btnGroup">
        <a href="http://localhost:8080/#/" @click="delCartIschecked">回主页</a>
        <a href="http://localhost:8080/#/order" @click="delCartIschecked">去订单中心</a>
      </div>
    </tan-chu-model>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '../components/NavHeader'
import NavFooter from '../components/NavFooter'
import NavBred from '../components/NavBred'
import TanChuModel from '../components/TanChuModel'
import axios from 'axios'

export default {
  data () {
    return {
      toDelAdress : true,
      toPay : true,
      successPay : true,
      checkIfLogin : false,
      ifChecked : false,
      userName : '',
      addressList : [],
      addressId : '',
      addNewAddressClose : true,
      souHuoName : '',
      souHuoAddress : '',
      souHuoPostCode : '',
      souHuoTel : '',
      cartMsg : [],
      addressMsg : [],
      ifPay : false,
      zhanghao : false,
      mima : false,
      zhifuzhanghao : '',
      zhifumima : ''
    }
  },
  computed: {
    /*ifChecked() {
      addressList.forEach(function (item) {

      });
    }*/
  },
  mounted() {
    this.whenNew();
  },
  components: {
    NavHeader,
    NavFooter,
    NavBred,
    TanChuModel
  },
  methods: {
    /*页面初始化检测是否已经登陆*/
    whenNew() {
      axios.post("/users/checkIfLogin").then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.userName = res.result.userName;
          this.addressList = res.result.addressList;
          this.checkIfLogin = true;
        } else {
          this.checkIfLogin = false;
          this.userName = '';
        }
      });
    },
    /*打开地址添加选项单*/
    openAddressForm() {
      this.addNewAddressClose = false;
    },
    /*关闭地址添加选项单*/
    closeAddressForm() {
      this.addNewAddressClose = true;
    },
    /*点击添加地址*/
    addAddressNow() {
      if (this.souHuoName == '' || this.souHuoAddress == ''|| this.souHuoPostCode == '' || this.souHuoTel == '') {
        return;
      }
      axios.post("/users/addAddress",{
          souHuoName : this.souHuoName,
          souHuoAddress : this.souHuoAddress,
          souHuoPostCode : this.souHuoPostCode,
          souHuoTel : this.souHuoTel
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          axios.post("/users/checkIfLogin").then((response1) => {
            let res = response1.data;
            if (res.status=='0') {
              this.userName = res.result.userName;
              this.addressList = res.result.addressList;
            }
          });
          this.addNewAddressClose = true;
          this.souHuoName = '';
          this.souHuoAddress = '';
          this.souHuoPostCode = '';
          this.souHuoTel = '';
        } else {
          alert("添加地址失败");
        }
      });
    },
    /*打开删除地址提示框*/
    openIfDel(addressId) {
      this.toDelAdress = false;
      this.addressId = addressId;
    },
    /*关闭删除地址提示框*/
    closeIfDel() {
      this.toDelAdress = true;
      this.addressId = '';
    },
    /*确定删除地址*/
    sureDel() {
      axios.post("/users/delAddress",{
        addressId : this.addressId
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.userName = res.result.userName;
          this.addressList = res.result.addressList;
          this.toDelAdress = true;
          this.addressId = '';
        }
      });
    },
    /*选中地址*/
    chooseThisAddress(addressId) {
      this.addressId = addressId;
      axios.post("/users/chooseAddress",{
        addressId : this.addressId
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.userName = res.result.userName;
          this.addressList = res.result.addressList;
          this.addressId = '';
        }
      });
    },
    /*关闭支付宝账号或密码框*/
    closezhaohaoOrmima(msg) {
      if (msg == '11') {
        this.zhanghao = false;
      } else {
        this.mima = false;
      }
    },
    /*去输支付宝密码*/
    zhaanghaotopay() {
      if (this.zhifuzhanghao) {
        this.zhanghao = false;
        this.mima = true;
      } 
    },
    /*输入密码弹出正在支付*/ 
    mimatopay() {
      if (this.zhifumima) {
        this.zhanghao = false;
        this.mima = false;
        this.ifPay = true;
        axios.post("/users/surePay").then((response) => {
          let res = response.data;
          if (res.status=='0') {
            this.cartMsg = res.result;
          }
        });
        var that = this;
        setTimeout(function(args) {
          that.ifPay = false;
          that.successPay = false;
        }, 2300);
      }
    },
    /*打开付款提示框*/
    openIfPay() {
      // this.toPay = false;
      if (this.addressList.length == 0) {
        alert("当前没有收货地址，不能付款!");
        return;
      }
      let a = true;
      this.addressList.forEach((item) => {
        if (item.ifChecked == '1') {
          a = false;
        }
      });
      if (a) {
        alert("未选中任何地址，不能付款！");
        return;
      } else {
        this.zhanghao = true;
      }
    },
    /*删除购物车中已经被下为订单的商品*/
    delCartIschecked() {
      axios.post("/users/delCartIschecked").then((response) => {
        let res = response.data;
        if (res.status=='0') {
          console.log("删除成功");
        }
      });
    }
  }
}
</script>

<style >
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.adressMain {
  width: 100%;
  min-height:480px; 
  background-color: #f5f7fc;
}
.adressWrap {
  width: 1200px;
  position: relative;
  left: 50%;
  margin-left: -600px;
}
.adressWrap-ul {
  width: 1200px;
  min-height:480px;
  zoom:1
}
.adressWrap-ul:after {
  display:block;
  clear:both;
  content:"";
  visibility:hidden;
  height:0
}
.adressWrap-li {
  box-sizing: border-box;
  margin: 20px 50px;
  float: left;
  width: 300px;
  height: 200px;
  border: 1px solid gray;
  border-radius: 10px;
}
.adressWrap-li-checked {
  border: 2px solid #ee7a23;
}
.adressWrap-li span {
  display: block;
  width: 30px;
  height: 30px;
  font-size: 30px;
  position: relative;
  left: 265px;
  cursor: pointer;
  transition: color .5s ease-out;
}
.adressWrap-li span:hover {
  color: #ee7a23;
}
.adressWrap-li div {
  display: block;
  width: 100%;
  height: 37px;
  line-height: 29px;
  font-size: 18px;
}
.adressWrap-li div.ifDeault {
  color: #ee7a23;
}
.adressWrap-li button {
  width: 100px;
  height: 29px;
  cursor: pointer;
  outline: none;
  background-color: #ee7a23;
  color: #fff;
  border: none;
  transition: background-color .5s ease-out;
  border-radius: 10px;
}
.adressWrap-li button:hover {
  background-color: #d1434a;
}
.adressWrap-li a {
  display: block;
  width: 100%;
  height: 200px;
  line-height: 200px;
  font-size: 50px;
  cursor: pointer;
  color: #000;
  transition: color .5s ease-out;
}
.adressWrap-li a:hover {
  color: #ee7a23;
}
@keyframes addNewAdd{  
0%   {margin-top: -90px;}  
25%  {margin-top: -105px;}  
50%  {margin-top: -120px;}  
75%  {margin-top: -135px;}  
100% {margin-top: -150px;}  
}  
.addNewAddress {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.addNewAddressShow {
  display: none;
}
.addNewAddressZheZhao {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,.6);
}
.addNewAddressMsg {
  width: 350px;
  height: 300px;
  border-radius: 20px;
  position: fixed;
  background-color: #fff;
  left: 50%;
  top: 50%;
  margin-left: -175px;
  margin-top: -150px;
  animation: addNewAdd .5s linear;
}
.addNewAddressMsg input {
  height: 35px;
  width: 200px;
  margin: 10px 0;
  outline: none;
  border-radius: 5px;
  text-indent: 10px;
}
.addNewAddressMsg span {
  display: block;
  position: absolute;
  left: 310px;
  font-size: 30px;
  height: 30px;
  width: 30px;
  line-height: 30px;
  cursor: pointer;
  transition: color .5s ease-out;
}
.addNewAddressMsg span:hover {
  color: #ee7a23;
}
.addNewAddressMsg button {
  display: block;
  position: relative;
  width: 150px;
  height: 40px;
  left: 50%;
  margin-left: -75px;
  line-height: 40px;
  cursor: pointer;
  outline: none;
  background-color: #ee7a23;
  color: #fff;
  border: none;
  transition: background-color .5s ease-out;
  border-radius: 10px;
}
.addNewAddressMsg button:hover {
  background-color: #d1434a;
}
.toPayMain {
  width: 100%;
  margin-top: 30px;
  height: 60px;
}
.toPayWrap {
  width: 1200px;
  height: 60px;
  position: relative;
  left: 50%;
  margin-left: -600px;
}
.toPayWrap button {
  position: relative;
  display: block;
  width: 130px;
  height: 60px;
  line-height: 60px;
  border: none;
  outline: none;
  background-color: #d1434a;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
  transition: background-color .5s ease-out;
  left: 1020px;
}
.toPayWrap button:hover {
  background-color: #f16f75;
}
.likePay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  z-index: 100;
}
.payZhezhao {
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.5);
  position: fixed;
}
.likePay p {
  position: relative;
  top: 50%;
  margin-top: -35px;
  font-family: "STXingkai";
  color: rgba(255,255,255,.8);
  font-size: 35px;
}
.likePay img {
  display: block;
  position: relative;
  top: 50%;
  left: 50%;
  margin-left: -60px;
  width: 120px;
  height: 24px;
}
.zhifubaozhanghao {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  z-index: 100;
}
.zhifubaozhanghao div.zhifubaozhezhao {
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.5);
  position: fixed;
}
@keyframes zhifu{  
0%   {margin-top: -90px;}  
25%  {margin-top: -105px;}  
50%  {margin-top: -120px;}  
75%  {margin-top: -135px;}  
100% {margin-top: -150px;}  
}
.zhifubaozhanghao div.box {
  width: 400px;
  height: 300px;
  background-color: #fff;
  position: relative;
  z-index: 101;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -150px;
  animation: zhifu .5s linear;
}
.zhifubaozhanghao div.box img {
  display: block;
  width: 150px;
  height: 50px;
  position: relative;
  left: 50%;
  margin-left: -75px;
  top: 50px;
}
.zhifubaozhanghao div.box input {
  display: block;
  width: 200px;
  height: 30px;
  position: relative;
  left: 50%;
  margin-left: -100px;
  top: 70px;
} 
.zhifubaozhanghao div.box button {
  display: block;
  width: 80px;
  height: 40px;
  outline: none;
  cursor: pointer;
  position: relative;
  left: 50%;
  margin-left: -40px;
  top: 100px;
}
.zhifubaozhanghao div.box span{
  display: inline-block;
  width: 35px;
  height: 35px;
  font-size: 35px;
  cursor: pointer;
  position: absolute;
  left: 360px;
}
.zhifubaozhanghao div.box span:hover {
  color: red;
}  
</style>
