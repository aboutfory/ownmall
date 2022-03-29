<template>
  <div>
    <nav-header>
      <a href="javascript:;" slot="login" v-if="checkIfLogin">
        欢迎  {{userName}}
      </a>
      <a href="javascript:;" slot="register" v-if="checkIfLogin">
        当前是购物车
      </a>
      <img src="../../static/picture/DingdanIcon.png" slot="register" v-if="checkIfLogin" class="header-icon">
      <a href="http://localhost:8080/#/order" slot="register" v-if="checkIfLogin">
        去订单中心
      </a>
      <img src="../../static/picture/HomeIcon.png" slot="register" v-if="checkIfLogin"  class="header-icon">
      <a href="/" slot="register" v-if="checkIfLogin">
        去主页
      </a>
    </nav-header>
    <nav-bred>
      <slot>当前是购物车</slot>
    </nav-bred>
    <div class="cartMain">
      <div class="cartWrap">
        <div class="cartTitle">
          {{userName}}的购物车
        </div>
        <div class="carItemTitle">
          <ul class="carItemTitle-ul">
            <li class="carItemTitle-li">商品信息</li>
            <li class="carItemTitle-li">单价</li>
            <li class="carItemTitle-li">数量</li>
            <li class="carItemTitle-li">总价</li>
            <li class="carItemTitle-li">删除</li>
          </ul>
        </div>
        <div class="cartItems">
          <ul class="cartItems-ul">
            <li class="cartItems-li" v-for="(items,index) in cartList">
              <div class="cartItems-li-div">
                <a href="javascript:;" v-bind:class="{'a-ifChecked':items.checked == '1'}" @click="itemIfToggle(items,index)"></a>
                <img v-lazy="'../../static/picture/' + items.productImage" :key="'../../static/picture/' + items.productImage" alt="">
                <div>{{items.productName}}</div>
              </div>
              <div class="cartItems-li-div">
                <span>{{items.salePrice}}元</span>
              </div>
              <div class="cartItems-li-div">
                <button @click="changeProductNumber('pre',items.productId,items.productNumber)">-</button>
                <span>{{items.productNumber}}</span>
                <button @click="changeProductNumber('add',items.productId,items.productNumber)">+</button>
              </div>
              <div class="cartItems-li-div">
                <span>{{items.salePrice*items.productNumber}}元</span>
              </div>
              <div class="cartItems-li-div">
                <button @click="delCartItem(items.productId)">删除</button>
              </div>
            </li>
          </ul>
        </div>
        <div class="cartToCheckout">
          <div class="selctAll">
            <a href="javascript:;" v-bind:class="{'allChecked':ifAllChecked == '1'}" @click="ifCheckAll"></a>
            <span>全选</span>
          </div>
          <div class="checkoutBtn">
            <a href="javascript:;" @click="toPayto">结算</a>
          </div>
          <div class="itemsTotal">
            <span>购物车总价：</span>
            <span>{{totle}}元</span>
          </div>
        </div>
      </div>
    </div>
    <tan-chu-model v-bind:mdShow="toDelCartItemMsg">
      <div slot="msg" class="msg">您确定要删除吗</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="del">确定</button>
        <button @click="noDel">取消</button>
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
      userName : '',
      cartList : [],
      toDelCartItemMsg : true,
      productId : '',
      ifAllChecked : ''
    }
  },
  computed: {
    totle() {
      var money = 0;
      this.cartList.forEach((item)=>{
        if (item.checked == '1') {
          money += item.productNumber*item.salePrice;
        }
      });
      return money;
    }
  },
  mounted() {
    this.whenNewCheckIfLogin();
    this.cartShow();
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
    /*渲染购物车列表*/
    cartShow() {
      axios.get("/users/cartShow").then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.ifAllChecked = res.result.ifAllChecked;
          this.cartList = res.result.cartList;
        } else {
          this.cartList = [];
        }
      });
    },
    /*点击按钮改变购物车商品数量*/
    changeProductNumber(met, productId, num) {
      axios.post("/users/changeProductNumber",{
        met : met,
        productId : productId,
        num : num
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.cartList = res.result;
        }
      });
    },
    /*点击弹出是否删除选项*/
    delCartItem(productId) {
      this.productId = productId;
      this.toDelCartItemMsg = false;
    },
    /*确认删除*/
    del() {
      axios.post("/users/delCartItem",{
        productId : this.productId,
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.cartList = res.result;
        }
      });
      this.toDelCartItemMsg = true;
    },
    /*取消删除*/
    noDel() {
      this.toDelCartItemMsg = true;
    },
    /*商品单项点击是否选中并修改数据库值*/
    itemIfToggle(items, index) {
      if (items.checked == '1') {
        items.checked = '0';
      } else {
        items.checked = '1';
      }

      axios.post("/users/ifItemChecked",{
        checkItem : items.checked,
        index : index
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          console.log('update suc');
        }
      });
      axios.get("/users/cartShow").then((response) => {
        let res = response.data;
        if (res.status=='0') {
            this.ifAllChecked = res.result.ifAllChecked;
            this.cartList = res.result.cartList;
          } else {
            this.cartList = [];
          }
        });
    },
    /*全选功能*/
    ifCheckAll() {
      if (this.ifAllChecked == '1') {
        this.ifAllChecked = '0';
      } else {
        this.ifAllChecked = '1';
      }
      this.cartList.forEach((items) => {
          items.checked = this.ifAllChecked;
      });

      axios.post("/users/ifAllChecked",{
        checkAll : this.ifAllChecked
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          console.log('update suc');
        }
      });
      axios.get("/users/cartShow").then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.cartList = res.result.cartList;
        } else {
          this.cartList = [];
        }
      });
    },
    /*跳转去结算*/
    toPayto() {
      if (this.cartList.length == 0) {
        alert("购物车没有商品，不能结算！");
        return;
      }
      let a = true;
      this.cartList.forEach((item) => {
        if (item.checked == '1') {
          a = false;
        }
      });
      if (a) {
        alert("未选中任何商品，不能结算！");
      } else {
        this.$router.push({
          path:"/address"
        });
      }
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
.cartMain {
  width: 100%;
  min-height:480px; 
  background-color: #fff5ec;
}
.cartWrap {
  width: 1200px;
  position: relative;
  left: 50%;
  margin-left: -600px;
}
.cartTitle {
  text-align: left;
  font-weight: bold;
  font-size: 30px;color: #666;
  height: 100px;
  line-height: 100px;
}
.carItemTitle-ul {
  width: 1200px;
  height: 50px;
  background-color: #605f5f;
}
.carItemTitle-li:nth-child(1) {
  width: 400px;
}
.carItemTitle-li {
  float: left;
  width: 200px;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  color: #ffe6c3;
  text-align :center;
}
.cartItems-li {
  width: 1198px;
  height: 150px;
  background-color: #fff;
  overflow: hidden;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
}
.cartItems-li-div:nth-child(1) {
  width: 398px;
}
.cartItems-li-div:nth-child(2),
.cartItems-li-div:nth-child(3),
.cartItems-li-div:nth-child(4),
.cartItems-li-div:nth-child(5) {
  line-height: 150px;
}
.cartItems-li-div {
  width: 200px;
  float: left;
  display: inline-block;
  height: 150px;
}
.cartItems-li-div:nth-child(1) a,
.cartItems-li-div:nth-child(1) img,
.cartItems-li-div:nth-child(1) div{
  display: inline-block;
  float: left;
}
.cartItems-li-div:nth-child(1) a {
  width: 20px;
  height: 20px;
  margin-left: 20px;
  border-radius: 50%;
  background-color: rgba(0,0,0,.7);
  position: relative;
  top: 65px;
}
.cartItems-li-div:nth-child(1) a.a-ifChecked {
  background-color: #ee7a23;
}
.cartItems-li-div:nth-child(1) img {
  width: 100px;
  height: 100px;
  margin-left: 20px;
  position: relative;
  top: 25px;
}
.cartItems-li-div:nth-child(1) div {
  width: 210px;
  margin: 0 5px;
  padding-top: 63px;
  height: 87px;
  margin-left: 20px;
  color: #000;
  font-weight: bold;
}
.cartItems-li-div:nth-child(2) span {
  color: #000;
  font-size: 20px;
  font-weight: bold;
}
.cartItems-li-div:nth-child(3) button {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.cartItems-li-div:nth-child(4) span {
  color: #d1434a;
  font-size: 20px;
  font-weight: bold;
}
.cartItems-li-div:nth-child(5) button {
  width: 50px;
  height: 35px;
  cursor: pointer;
  outline: none;
  background-color: orange;
  border: none;
  color: #fff;
  font-size: 16px;
  border-radius: 10px;
  transition: background-color .5s ease-out;
}
.cartItems-li-div:nth-child(5) button:hover {
  background-color: rgb(209,67,74);
}
.cartToCheckout {
  width: 1200px;
  background-color: #fff;
  margin-top: 30px;
  height: 60px;
}
.selctAll {
  width: 110px;
  height: 60px;
  line-height: 60px;
  float: left;
}
.selctAll a {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0,0,0,.7);
  position: relative;
  top: 4px;
  right: 6px;
}
.selctAll a.allChecked {
  background-color: #ee7a23;
}
.itemsTotal {
  float: right;
  width: 400px;
  height: 60px;
  line-height: 60px;
  text-align: right;
  margin-right: 50px;
}
.itemsTotal span:nth-child(2) {
  color: #d1434a;
  font-weight: bold;
  font-size: 20px;
}
.checkoutBtn {
  float: right;
  width: 130px;
  height: 60px;
}
.checkoutBtn a {
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
}
.checkoutBtn a:hover {
  background-color: #f16f75;
}
</style>
