<template>
  <div>
    <div class="rootLoginMain">
    	<div class="msgzzz">欢迎来到农产品小型商城商品管理员登陆界面</div>
    	<div class="loginBox">
    		<div class="loginContent">
    			<div class="title">管理员登陆</div>
          <div class="errMsgsss" v-if="ifErr">管理员账号或密码错误</div>
    			<div class="inputMsg">
    				<input type="text" v-model="name" placeholder="请输入管理员账号">
    				<input type="password" v-model="pwd" placeholder="请输入管理员密码" @keyup.enter="rootLogin">
    				<a @click="rootLogin">登陆</a>
    			</div>
    		</div>
    	</div>
    </div>
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
      name : '',
      pwd : '',
      ifErr : false 
    }
  },
  mounted() {
  	
  },
  components: {
    NavHeader,
    NavFooter,
    NavBred,
    TanChuModel
  },
  methods: {
    rootLogin() {
      if (!this.name || !this.pwd) {
        return;
      }
      axios.post("/roots",{
        rootName : this.name,
        rootPassword : this.pwd
      }).then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.ifErr = false;
          this.$router.push('/roots');
        } else {
          this.ifErr = true;
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
.rootLoginMain {
  width: 100%;
  height: 100%;
  background-image: url("../../static/picture/projectPic/rootback.jpg");
	background-size: cover;
  position:fixed;
}
@keyframes animationMsg{  
0%   {top: 0px;}  
25%  {top: 35px;}  
50%  {top: 70px;}  
75%  {top: 105px;}  
100% {top: 140px;}  
} 
.msgzzz {
	font-family: "STXingkai";
  color: #01bec2;
	font-size: 50px;
	position: relative;
	top: 150px;
	animation: animationMsg 1s linear;
}
.loginBox {
	width: 100%;
	height: 500px;
	position: relative;
	top: 152px;
}
@keyframes animationCont{  
0%   {top: 140px;}  
25%  {top: 105px;}  
50%  {top: 70px;}  
75%  {top: 35px;}  
100% {top: 0px;}  
} 
.loginContent {
	width: 300px;
	height: 300px;
	background-color: rgba(0,0,0,.3);
	position: relative;
	left: 50%;
	margin-left: -150px;
	animation: animationCont 1s linear;
}
.title {
	color: #fff;
	background-color: rgba(0,0,0,.5);
	height: 60px;
	line-height: 60px;
	font-size: 25px;
	text-align: left;
	text-indent: 15px;
}
.errMsgsss {
  color: red;
  position: absolute;
  left: 66px;
}
.inputMsg {
  width: 100%;
  height: 240px;
}
.inputMsg input,
.inputMsg a{
	display: block;
	height: 28px;
	width: 220px;
  position: relative;
	top: 40px;
  margin-bottom: 30px;
	margin-left: 35px;
	background-color: transparent;
	outline: none;
	border: 3px solid rgba(244,244,244,.6);
	color: #fff;
	text-indent: 10px;
}
.inputMsg a {
	cursor: pointer;
	text-indent: 0px;
	transition: background-color .6s ease-out;
}
.inputMsg a:hover {
	cursor: pointer;
	background-color: rgba(0,0,0,.4);
}
</style>
