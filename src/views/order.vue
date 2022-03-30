<template>
  <div>
    <nav-header>
      <a href="javascript:;" slot="login" v-if="checkIfLogin">
        欢迎  {{userName}}
      </a>
      <a href="javascript:;" slot="register" v-if="checkIfLogin">
        当前是订单中心
      </a>
      <img src="../../static/picture/projectPic/CartIcon.png" slot="register" v-if="checkIfLogin" class="header-icon">
      <a href="http://localhost:8080/#/cart" slot="register" v-if="checkIfLogin">
        去购物车
      </a>
      <img src="../../static/picture/projectPic/HomeIcon.png" slot="register" v-if="checkIfLogin"  class="header-icon">
      <a href="/" slot="register" v-if="checkIfLogin">
        去主页
      </a>
    </nav-header>
    <nav-bred>
      <slot>当前是订单中心</slot>
    </nav-bred>
    <div class="orderMain">
    	<div class="orderWrap">
    		<div class="orderTitle">
	          {{userName}}的订单中心
	        </div>
	        <div class="orderItem">
	        	<ul class="orderItem-ul">
	        		<li class="orderItem-li" v-for="items in orderList">
	        			<div class="orderItemIdAndTime">
	        				<div class="orderId">
	        					订单编号：{{items.orderId}}
	        				</div>
	        				<div class="orderTime">
	        					创建时间：{{items.orderTime}}
	        				</div>
	        				<div class="orderTotle">
	        					订单总额：
	        					<span>{{items.orderTotal}}元</span>
	        				</div>
	        			</div>
	        			<div class="orderGoodsList" v-for="ite in items.orderGoodsList">
	        				<div class="goodImg">
	        					<img v-lazy="'../../static/picture/' + ite.productImage" :key="'../../static/picture/' + ite.productImage" alt="">
	        				</div>
	        				<div class="goodName">{{ite.productName}}</div>
	        				<div class="goodSalePrice">
	        					售价：
	        					<span>{{ite.salePrice}}元</span>
	        				</div>
	        				<div class="goodNumber">
	        					数量：
		        				<span>x{{ite.productNumber}}</span>
		        			</div>
	        				<div class="goodTotle">
	        					总价：
	        					<span>{{ite.salePrice*ite.productNumber}}元</span>
	        				</div>
	        			</div>
	        			<div class="peopleMsg">
	        				<div>
	        					收货人姓名：
	        					<span>{{items.addressInfo.addressUserName}}</span>
	        				</div>
	        				<div>
	        					收货人地址：
	        					<span>{{items.addressInfo.addressMsg}}</span>
	        				</div>
	        				<div>
	        					号码：
	        					<span>{{items.addressInfo.tel}}</span>
	        				</div>
	        			</div>
	        			<div class="sureReceived">
	        				<button @click="toSureRec(items.orderId)">确认收货</button>
	        			</div>
	        		</li>
	        	</ul>
	        </div>
    	</div>
    </div>
    <tan-chu-model v-bind:mdShow="toSureReceived">
      <div slot="msg" class="msg">您确定已经收到商品么</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="sureReceivedGoods">确定</button>
        <button @click="closeRec">取消</button>
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
import axios from 'axios';

export default {
  data () {
    return {
      checkIfLogin : false,
      toSureReceived : true,
      userName : '',
      orderList : [],
      orderId : ''
    }
  },
  mounted() {
  	this.whenNewCheckIfLogin();
  	this.orderShow();
  },
  components: {
    NavHeader,
    NavFooter,
    NavBred,
    TanChuModel
  },
  methods: {
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
    /*渲染订单列表*/
    orderShow() {
      if (this.checkIfLogin) {
        this.orderList = [];
        return;
      } else {
        axios.get("/users/orderShow").then((response) => {
          let res = response.data;
          if (res.status=='0') {
            this.orderList = res.result;
          } else {
            this.orderList = [];
          }
        });
      }
    },
    /*点确认收货弹出框显示*/
    toSureRec(theId) {
    	this.toSureReceived = false;
    	this.orderId = theId;
    },
    /*点取消收货弹出框关闭*/
    closeRec() {
    	this.toSureReceived = true;
    	this.orderId = '';
    },
    /*确认收货*/
    sureReceivedGoods() {
    	this.toSureReceived = true;
    	axios.post("/users/sureReceivedGoods",{
    		orderId : this.orderId
    	}).then((response) => {
          let res = response.data;
          if (res.status=='0') {
            this.orderList = res.result;
          } else {
            this.orderList = [];
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
.orderMain {
	width: 100%;
	min-height:480px; 
	background-color: #fff;
}
.orderWrap {
	width: 1200px;
	position: relative;
	left: 50%;
	margin-left: -600px;
}
.orderTitle {
	text-align: left;
	font-weight: bold;
	font-size: 30px;color: #666;
	height: 60px;
	line-height: 100px;
}
.orderItem-ul {
	width: 1200px;
	min-height:480px; 
}
.orderItem-li {
	width: 1200px;
}
.orderItemIdAndTime {
	width: 1198px;
	height: 40px;
	background-color: #f0f0f0;
	border: 1px solid #000;
	margin-top: 30px;
}
.orderItemIdAndTime:after,
.orderGoodsList:after,
.peopleMsg:after {
	clear: both;
	height: 0;
	display: block;
	content: '';
	visibility: hidden;
}
.orderId,
.orderTime,
.orderTotle {
	width: 399px;
	height: 40px;
	line-height: 40px;
	float: left;
	font-weight: bold;
}
.orderTotle span {
	color: #d1434a;
}
.orderGoodsList {
	width: 1198px;
	height: 150px;
	line-height: 150px;
	background-color: #e1f0fb;
	border-left: 1px solid #000;
	border-right: 1px solid #000;
}
.orderGoodsList div {
	float: left;
	width: 239px;
}
.orderGoodsList div.goodImg img {
	display: block;
	width: 100px;
	height: 100px;
	position: relative;
	left: 50%;
	top: 27px;
	margin-left: -50px;
}
.goodName {
	left: 60px;
}
.goodSalePrice {
	left: 130px;
}
.goodNumber {
	left: 235px;
}
.goodTotle {
	left: 410px;
}
.peopleMsg {
	width: 1198px;
	border-right: 1px solid #000;
	border-left: 1px solid #000;
	background-color: #fcf5cb;
	height: 60px;
	line-height: 60px;
}
.peopleMsg div {
	float: left;
	width: 399px;
}
.sureReceived {
	width: 1198px;
	height: 60px;
	background-color: #f0f0f0;
	border-right: 1px solid #000;
	border-left: 1px solid #000;
	border-bottom: 1px solid #000;
}
.sureReceived button {
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
	border-radius: 20px;
	position: relative;
	left: 50%;
	margin-left: -75px;
	transition: background-color .5s ease-out;
}
.sureReceived button:hover {
  background-color: #f16f75;
}
</style>
