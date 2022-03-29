<template>
  <div>
    <!-- <div class="welcome">欢迎来到农产品商城网站</div> -->
    <nav-header>
      <a href="http://localhost:8080/#/rootlogin" slot="login" v-if="!checkIfLogin">
        管理员登陆
      </a>
      <a href="javascript:;" slot="login" @click="loginOrRegister(loginMsg)" v-if="!checkIfLogin">
        {{loginMsg}}
      </a>
      <a href="javascript:;" slot="login" v-if="checkIfLogin">
        欢迎  {{userName}}
      </a>
      <a href="javascript:;" slot="register"  @click="loginOrRegister(registerMsg)" v-if="!checkIfLogin">
        {{registerMsg}}
      </a>
      <a href="javascript:;" slot="register" v-if="checkIfLogin" @click="logOut">
        注销
      </a>
      <img src="../../static/picture/DingdanIcon.png" slot="register" v-if="checkIfLogin" class="header-icon">
      <a href="javascript:;" slot="register" v-if="checkIfLogin" @click="goOrder">
        去订单中心
      </a>
      <img src="../../static/picture/CartIcon.png" slot="register" v-if="checkIfLogin"  class="header-icon">
      <a href="javascript:;" slot="register" v-if="checkIfLogin" @click="goCart">
        去购物车
      </a>
    </nav-header>
    <div class="menu">
      <div class="menuWrap">
        <img src="../../static/picture/nongchanpin.png" alt="">
        <a href="/">商城首页</a>
        <a href="http://localhost:8080/#/jieqigushi">节气故事</a>
        <a href="http://localhost:8080/#/nongchanpinjianjie">农产品简介</a>
        <span>欢迎来到农产品网站小型商城</span>
      </div>
    </div>
    <nav-bred>
      <slot>当前是主页</slot>
    </nav-bred>
    <div>
      <div class="lunbo">
        <carousel class="index-carousel" :autoplay="true" :minSwipeDistance="40" :scrollPerPage="true" :speed="500" :perPage="1" :paginationPadding="5" :paginationSize="10" :loop="true" @param="right">
          <slide>
           <img src="../../static/picture/ban1.jpg" alt=""  class="lunbo-pic">
          </slide>
          <slide>
            <img src="../../static/picture/ban2.jpg" alt="" class="lunbo-pic">
          </slide>
          <slide>
            <img src="../../static/picture/ban3.jpg" alt="" class="lunbo-pic">
          </slide>
        </carousel>
      </div>
      <div class="priceSaiXuan">
        <ul class="priceSaiXuan-ul">
          <li>价格筛选：</li>
          <li class="chooseLi" v-for="(items,index) in priceSaiXuanZhiDuan" v-on:click="checkPriceSaixuan(index,items.startPrice,items.endPrice)">{{items.startPrice}}-{{items.endPrice}}</li>
          <li class="priceSaiXuanExpecial-li">当前是{{priceSaiXuanStart}}-{{priceSaiXuanEnd}}</li>
        </ul>
      </div>
      <div class="productSerch">
        <input type="text" class="productSerch-input" v-model="inputMsg" @keyup.enter="searchProduct" placeholder="请输入搜索关键字"> 
        <button class="productSerch-btn" @click="searchProduct">搜索商品</button>
      </div>
      <div class="productList">
        <ul class="productList-ul" v-if="!ifMsg">
          <li v-for="(items,index) in goodsList">
            <img v-lazy="'../../static/picture/' + items.productImage" :key="'../../static/picture/' + items.productImage" alt="" @click="toProductMsg(items.productMessage)">
            <p class="productList-price">{{items.salePrice}}元</p>
            <p class="productList-name">{{items.productName}}</p>
            <button class="productList-addCart" @click="addToCart(index)">加入购物车</button>
          </li>
        </ul>
        <div class="showProductMsg" v-if="ifMsg">
          <button @click="toProductList">回商品列表</button>
          <div>{{productMessage}}</div>
        </div>
      </div>
      <div class="pageControl">
        <div>
          <input v-model="inputPageUserWrite" type="number" placeholder="请选择您想跳转的页码" class="pageUserWrite" @keyup.enter="pageControlTo" min="1" v-bind:max="pageCount" onkeydown="return false;">
          <button class="pageControl-to" @click="pageControlTo">跳转到</button>
        </div>
        <button class="pageControl-pre" @click="huanYe('pre')">上一页</button>
        <button class="pageControl-next" @click="huanYe('next')">下一页</button>
        <div class="pageNow">当前是第“{{page}}”页</div>
      </div>
    </div>
    <div class="someMenu">
      <div class="someMenu-cart" @click="letsgo('1')"></div>
      <div class="someMenu-order" @click="letsgo('0')"></div>
    </div>
    <div class="doFor">
      <p>竭诚为您提供最优质的服务</p>   
    </div>
    <div class=loginTanChuModel v-bind:class="{'loginMdShow' : loginMdShow}">
      <div class="loginZheZhao" @click="closeLoginOrRegisterMd"></div>
      <div class="loginMsgBox">
        <div class="loginTitle">登陆</div>
        <div class="errMsg" v-show="loginErrMsgShow">用户名或密码错误</div>
        <input type="text" class="loginUserName" v-model="userName" placeholder="请输入您的登陆用户名" @keyup.enter="login">
        <input type="password" class="loginUserPsw" v-model="userPwd" placeholder="请输入您的登陆密码" @keyup.enter="login">
        <button class="loginBtn" @click="login">登陆</button>
        <a href="javascript:;" class="goLoginOrRegister" @click="goLoginOrRegister('去注册')">去注册</a>
        <span class="closeMd" @click="closeLoginOrRegisterMd">x</span>
      </div>
    </div>
    <div class=registerTanChuModel v-bind:class="{'registerMdShow' : registerMdShow}">
      <div class="registerZheZhao" @click="closeLoginOrRegisterMd"></div>
      <div class="registerMsgBox">
        <div class="registerTitle">注册</div>
        <div class="errMsg"  v-show="registerErrMsgShow">用户名已经存在</div>
        <input type="text" v-model="userRegisterName" class="registerUserName" placeholder="请输入您想注册的用户名">
        <input type="password" v-model="userRegisterPwd" class="registerUserPsw" placeholder="请输入您的密码" @keyup.enter="register">
        <button class="registerBtn" @click="register">注册</button>
        <a href="javascript:;" class="goLoginOrRegister" @click="goLoginOrRegister('去登陆')">去登陆</a>
        <span class="closeMd" @click="closeLoginOrRegisterMd">x</span>
      </div>
    </div>
    <tan-chu-model v-bind:mdShow="addCartErrMdShow">
      <div slot="msg" class="msg">当前未登陆</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="closeMdFun">关闭</button>
      </div>
    </tan-chu-model>
    <tan-chu-model v-bind:mdShow="registerSuccessMdShow">
      <div slot="msg" class="msg">注册成功</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="closeMdFun">关闭</button>
      </div>
    </tan-chu-model>
    <tan-chu-model v-bind:mdShow="loginSuccessMdShow">
      <div slot="msg" class="msg">登陆成功</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="closeMdFun">关闭</button>
      </div>
    </tan-chu-model>
    <tan-chu-model v-bind:mdShow="addCartSuccessMdShow">
      <div slot="msg" class="msg">加入购物车成功</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="closeMdFun">关闭</button>
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
import { Carousel, Slide } from 'vue-carousel';
import axios from 'axios';

export default {
  data () {
    return {
      loginMsg : '登陆',
      registerMsg : '注册',
      checkIfLogin : false,
      userName : '',
      userPwd : '',
      userRegisterName : '',
      userRegisterPwd : '',
      addCartSuccessMdShow : true,
      addCartErrMdShow : true,
      registerSuccessMdShow : true,
      loginSuccessMdShow : true,
      loginMdShow : true,
      registerMdShow : true,
      loginErrMsgShow : false,
      registerErrMsgShow : false,
      isA : false,
      ifMsg : false,
      productMessage : '',
      goodsList : [],
      page : 1,
      pageCount : 0,
      pageSize : 10,
      allProductCount : 0,
      productSerchKey : '',
      productPriceKey : '',
      inputMsg : '',
      inputPageUserWrite : '',
      priceSaiXuanNow : '',
      priceSaiXuanStart : '0',
      priceSaiXuanEnd : '0以上所有',
      priceSaiXuanZhiDuan : [
        {
          startPrice : '0',
          endPrice : '0以上所有'
        },
        {
          startPrice : '0',
          endPrice : '50'
        },
        {
          startPrice : '50',
          endPrice : '100'
        },
        {
          startPrice : '100',
          endPrice : '200'
        },
        {
          startPrice : '200',
          endPrice : '500'
        },
        {
          startPrice : '500',
          endPrice : '500以上所有'
        }
      ]
    }
  },
  mounted() {
    this.goodsListInit();
    this.whenNewCheckIfLogin();
  },
  components: {
    NavHeader,
    NavFooter,
    NavBred,
    TanChuModel,
    Carousel,
    Slide
  },
  methods: {
    /*商品初始化函数*/
    goodsListInit() {
      /*判断是否有搜索关键字或者商品价格筛选*/
      if (this.productSerchKey) {
        var params = {
          page : this.page,
          pageSize : this.pageSize,
          productSerchKey : this.productSerchKey
        };
      } else if(this.productPriceKey) {
        var params = {
          page : this.page,
          pageSize : this.pageSize,
          productPriceKey : this.productPriceKey
        };
      } else {
        var params = {
          page : this.page,
          pageSize : this.pageSize
        };
      }
      /*发请求确定符合条件的所有商品数目以确定页数*/
      axios.get("/goods/all",{
        params : params
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.allProductCount = res.result.count;
        }
      });
      /*发请求拿当前页的商品信息*/
      axios.get("/goods",{
        params : params
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.result = res.result;
          this.goodsList = res.result.list;
          this.pageCount = Math.ceil(parseInt(this.allProductCount)/parseInt(this.pageSize));
        } else {
          this.goodsList = [];
        }
      });
    },
    /*页面初始化检测是否已经登陆*/
    whenNewCheckIfLogin() {
      axios.post("/users/checkIfLogin").then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.userName = res.result.userName;
          this.checkIfLogin = true;
        } else {
          this.checkIfLogin = false;
          this.userName = '';
        }
      });
    },
    /*价格筛选的函数*/
    checkPriceSaixuan(index,start,end) {
      this.priceSaiXuanStart = start;
      this.priceSaiXuanEnd = end;

      this.productPriceKey = index;
      this.goodsListInit();
    },
    /*换页函数*/
    huanYe(met) {
      if (met == 'pre') {
        if (this.page == 1) {
          return;
        }
        this.page--;
      }
      if (met == 'next') {
        if (this.page == this.pageCount) {
          return;
        }
        this.page++;
      }
      this.goodsListInit();
    },
    /*搜索函数*/
    searchProduct() {
      if (this.inputMsg) {
        this.productSerchKey = this.inputMsg;
      }else {
        this.productSerchKey = '';
      }
      this.goodsListInit();
    },
    /*页面跳转函数*/
    pageControlTo() {
      if (this.inputPageUserWrite <= 0) {
        this.inputPageUserWrite == 1;
      }else if (this.inputPageUserWrite > this.pageCount) {
        this.inputPageUserWrite == this.pageCount;
      }
      this.page = this.inputPageUserWrite;
      this.goodsListInit();
    },
    /*点登陆或注册弹出登陆和注册框函数*/
    loginOrRegister(msg) {
      if (msg == '登陆') {
        this.loginMdShow = false;
      } else if (msg == '注册') {
        this.registerMdShow = false;
      }
    },
    /*点遮罩层或者关闭按钮关闭登陆和注册弹出框*/
    closeLoginOrRegisterMd() {
      this.loginMdShow = true;
      this.registerMdShow = true;
    },
    /*登陆和注册切换*/
    goLoginOrRegister(msg) {
      if (msg == '去登陆') {
        this.loginMdShow = false;
        this.registerMdShow = true;
      } else if (msg == '去注册') {
        this.loginMdShow = true;
        this.registerMdShow = false;
      }
    },
    /*加入购物车*/
    addToCart(ind) {
      var productId = this.goodsList.length && this.goodsList[ind].productId;
      axios.post("/goods/addCart",{
        productId : productId
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.addCartSuccessMdShow = false;
        } else {
          this.addCartErrMdShow = false;
        }
      });
    },
    /*登陆*/
    login() {
      if (!this.userName || !this.userPwd) {
        return;
      }
      axios.post("/users/login",{
        userName : this.userName,
        userPwd : this.userPwd
      }).then((response) => {
        let res = response.data;
        if (res.status == '0') {
          this.loginSuccessMdShow = false;
          this.loginMdShow = true;
          this.loginErrMsgShow = false;
          this.checkIfLogin = true;
          this.userName = res.result.userName;
        } else {
          this.loginErrMsgShow = true;
        }
      });
    },
    /*注销*/
    logOut() {
      this.checkIfLogin = false;
      axios.post("/users/logout").then((response) => {
        let res = response.data;
        if (res.status == '0') {
          this.userName = '';
          this.userPwd = '';
        }
      });
    },
    /*注册*/
    register() {
      if (!this.userRegisterName || !this.userRegisterPwd) {
        return;
      }
      axios.post("/users/register",{
        userRegisterName : this.userRegisterName,
        userRegisterPwd : this.userRegisterPwd
      }).then((response) => {
        let res = response.data;
        if (res.status == '0') {
          this.registerSuccessMdShow = false;
          this.registerMdShow = true;
          this.registerErrMsgShow = false;
          this.userRegisterName = '';
          this.userRegisterPwd = '';
        } else {
          this.registerErrMsgShow = true;
        }
      });
    },
    /*关闭提示的弹出框*/
    closeMdFun() {
      this.addCartSuccessMdShow = true;
      this.addCartErrMdShow = true;
      this.registerSuccessMdShow = true;
      this.loginSuccessMdShow = true;
    },
    /*去订单中心*/
    goOrder() {
      this.$router.push({
        path:"/order"
      });
    },
    /*去购物车*/
    goCart() {
      this.$router.push({
        path:"/cart"
      });
    },
    /*去商品详细信息*/
    toProductMsg(msg) {
      this.productMessage = msg;
      this.ifMsg = true;
    },
    /*回商品列表页*/
    toProductList() {
      this.productMessage = '';
      this.ifMsg = false;
    },
    /*悬浮链接  去购物车或者订单中心*/
    letsgo(mth) {
      if (mth == '1') {
        this.$router.push({
          path:"/cart"
        });
      } else {
        this.$router.push({
          path:"/order"
        });
      }
    }
  }
}
</script>
<style>
/* @keyframes topWelcome{  
0%   {background:#194169;}  
25%  {background:lightgray;}  
50%  {background:#666;}  
75%  {background:gray;}  
100% {background:#333;}  
}   
.welcome {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background-color: #090723;
  letter-spacing: 25px;
  font-family: "宋体";
  animation: topWelcome 5s infinite alternate;
} */
.priceSaiXuan {
  width: 100%;
  height: 40px;
  background-color: #f3f3f3;
}
.priceSaiXuan-ul li {
  width: 150px;
  height: 38px;
  line-height: 40px;
  float: left;
  transition: background-color .5s ease-out;
}
.priceSaiXuan-ul li.priceSaiXuanExpecial-li {
  width: 200px;
  background-color: #d1434a;
  color: #fff;
}
.priceSaiXuan-ul li:hover {
  background-color: rgb(200,200,200);
  cursor: pointer;
}
.priceSaiXuan-ul li:nth-child(1),
.priceSaiXuan-li-checked {
  background-color: rgb(200,200,200);
}
.lunbo {
  background-color: rgb(200,200,200);
}
.lunbo-pic {
  width: 100%;
  height: 460px;
}
.productSerch {
  width: 100%;
  height: 60px;
  background-color: rgb(200,200,200);
}
.productSerch-input {
  width: 300px;
  height: 30px;
  outline: none;
  position: relative;
  top: 15px;
  font-size: 16px;
  color: gray;
  text-indent: 10px;
}
.productSerch-btn {
  width: 100px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  position: relative;
  top: 15px;
  color: #fff;
  background-color: orange;
  outline: none;
  border: none;
  transition: background-color .5s ease-out;
}
.productSerch-btn:hover {
  background-color: #d1434a;
}
.productList {
  width: 100%;
  min-height: 620px;
  background-image: url(../../static/picture/back.jpeg);
}
.productList-ul {
  width: 1200px;
  height: 620px;
  position: relative;
  left: 50%;
  margin-left: -600px;
}
.productList-ul::after {
  clear: both;
  height: 0;
  display: block;
  content: '';
  visibility: hidden;
}
.productList-ul li {
  box-sizing: border-box;
  margin: 5px;
  width: 230px;
  height: 300px;
  background-color: #f3f3f3;
  float: left;
  border: 2px solid black;
  transition: all .5s ease-out;
  border-radius: 25px;
}
.productList-ul li:hover {
  border: 2px solid #d1434a;
  box-shadow: 0px 0px 30px rgba(0,0,0,.9);
}
.productList-ul li img {
  width: 200px;
  height: 140px;
  position: relative;
  top: 10px;
}
.productList-ul li img:hover {
  cursor: pointer;
}
.productList-name,
.productList-price {
  color: #d1434a;
  font-weight: bold;
  position: relative;
  top: 30px;
}
.productList-addCart {
  width: 100px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  position: relative;
  top: 50px;
  color: #fff;
  background-color: orange;
  outline: none;
  border: none;
  transition: background-color .5s ease-out;
}
.productList-addCart:hover {
  background-color: #d1434a;
}
.showProductMsg button {
  width: 80px;
  height: 35px;
  cursor: pointer;
  margin-top: 10px;
  line-height: 35px;
  color: #fff;
  background-color: orange;
  outline: none;
  border: none;
  border-radius: 10px;
  transition: background-color .5s ease-out;
}
.showProductMsg button:hover {
  background-color: #d1434a;
}
.showProductMsg div {
  width: 1200px;
  min-height: 620px;
  background-color: rgba(0,0,0,.5);
  position: relative;
  left: 50%;
  margin-left: -600px;
  margin-top: 20px;
  text-align: left;
  font-size: 35px;
  font-family: "STXingkai";
  color: #fff;
}
.pageControl {
  width: 100%;
  height: 150px;
  background-color: #f3f5f7;
}
.pageUserWrite {
  width: 150px;
  height: 30px;
  outline: none;
  position: relative;
  top: 15px;
  bottom: 15px;
  font-size: 12px;
  color: gray;
  text-indent: 10px;
}
.pageControl-to {
  outline: none;
  background-color: orange;
  width: 50px;
  height: 30px;
  position: relative;
  top: 15px;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color .5s ease-out;
}
.pageControl-to:hover {
  background-color: #d1434a;
}
.pageControl-pre,
.pageControl-next {
  width: 100px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  position: relative;
  top: 24px;
  color: #fff;
  background-color: orange;
  outline: none;
  border: none;
  transition: background-color .5s ease-out;
  display: inline-block;
}
.pageControl-pre:hover,
.pageControl-next:hover {
  background-color: #d1434a;
}
.pageNow {
  position: relative;
  top: 29px;
  color: #999;
  font-weight: bold;
  font-size: 20px;
  font-family: '微软雅黑'；
}
.doFor {
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.doFor p {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background-color: rgb(200,200,200);
  letter-spacing: 25px;
  font-family: "宋体";
}
.loginTanChuModel,
.registerTanChuModel {
  width: 100%;
  height: 100%;
}
.loginMdShow,
.registerMdShow {
  display: none;
}
.loginZheZhao,
.registerZheZhao{
  position: fixed;
  background-color: rgba(0,0,0,.5);
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 99;
}
.loginMsgBox,
.registerMsgBox{
  width: 600px;
  height: 300px;
  background-color: #fff;
  border: 1px solid red;
  z-index: 100;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -300px;
  animation: tanChuAnimall .5s linear;
}
@keyframes tanChuAnimall{  
0%   {margin-top: -90px;}  
25%  {margin-top: -105px;}  
50%  {margin-top: -120px;}  
75%  {margin-top: -135px;}  
100% {margin-top: -150px;}  
}   
.loginUserName,
.loginUserPsw,
.registerUserName,
.registerUserPsw {
  display: block;
  position: relative;
  left: 50%;
  width: 500px;
  height: 40px;
  margin-left: -250px;
  margin-top: 18px;
  margin-bottom: 5px;
  font-size: 20px;
  font-family: "宋体";
  color: #333;
  border: 1px solid gray;
  text-indent: 15px;
  outline: none;
}
.loginBtn,
.registerBtn {
  background-color: #009DE6;
  transition: all .5s ease-out;
  cursor: pointer;
  width: 500px;
  height: 40px;
  margin-top: 18px;
  margin-bottom: 5px;
  font-size: 20px;
  font-family: "宋体";
  color: #fff;
  border: none;
}
.loginBtn:hover,
.registerBtn:hover {
  background-color: rgb(97,177,239);
}
.loginTitle,
.registerTitle{
  width: 600px;
  height: 60px;
  line-height: 60px;
  font-size: 25px;
  font-weight: bold;
  color: #333;
}
.errMsg {
  height: 16px;
  font-size: 16px;
  color: red;
}
.goLoginOrRegister {
  display: block;
}
.closeMd {
  position: relative;
  font-size: 30px;
  cursor: pointer;
  top: -260px;
  left: 270px;
}
.menu {
  width: 100%;
  height: 132px;
}
.menuWrap {
  width: 1200px;
  height: 132px;
  position: relative;
  left: 50%;
  margin-left: -600px;
}
.menuWrap img {
  display: block;
  width: 53px;
  height: 92px;
  position: relative;
  left: 0px;
  top: 20px;
}
.menuWrap a {
  position: relative;
  left: -30px;
  margin-left: 20px;
  color: gray;
}
.menuWrap a:hover {
  color: black;
}
.menuWrap span {
  display: inline-block;
  font-family: "STXingkai";
  font-size: 30px;
  position: relative;
  left: 130px;
  top: -30px;
}
.someMenu {
  width: 50px;
  background-color: rgb(200,200,200);
  position: fixed;
  right: 0;
  bottom: 50px;
  z-index: 999;
  border-radius: 10px;
}
.someMenu .someMenu-cart,
.someMenu .someMenu-order {
  width: 25px;
  height: 25px;
  cursor: pointer;
  margin: 20px 0 20px 13px;
}
.someMenu .someMenu-cart {
  background-image: url("../../static/picture/CartIcon.png");
  background-size: 100%;
}
.someMenu .someMenu-order {
  background-image: url("../../static/picture/DingdanIcon.png");
  background-size: 100%;
}
</style>
