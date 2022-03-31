<template>
  <div>
  	<div class="btnsFix">
  		<button @click="totoporbottom('1')">去顶部</button>
  		<button @click="totoporbottom('0')">去底部</button>
  	</div>
  	<div class="rootTitle">
  		<div class="rootWrap">
  			<p>欢迎来到商品后台管理界面</p>
				<router-link to="/rootlogin" v-if="checkIfLogin">去登陆</router-link>
  			<a href="javascript:;" v-if="checkIfLogin" @click="register">注销</a>
  		</div>
  		<div class="methodsTitle">
  			<button v-bind:class="{'nowChoose':ifAdd}" @click="nowChooseBtn('add')">添加商品</button>
  			<button v-bind:class="{'nowChoose':ifDel}" @click="nowChooseBtn('del')">删除商品</button>
  			<button v-bind:class="{'nowChoose':ifChange}" @click="nowChooseBtn('change')">修改商品</button>
  		</div>
  		<div class="addGood" v-if="ifAdd">
  			<div>
  				<div class="proName">
  					<p>请上传商品图片</p>
  					<p>请输入上传商品的名字</p>
  					<p>请输入上传商品的价格</p>
  					<p>请输入上传商品的搜索字段</p>
  					<p>请输入上传商品的简单描述</p>
  				</div>
  				<div class="proInput">
  					<input type="file" accept="image/*" ref="addImg"> 
  					<!-- <div>{{this.$refs.addImg.files[0]}}</div> -->
	  				<input type="text" maxlength="10" placeholder="请输入上传商品的名字" v-model="addName">
	  				<input type="text" placeholder="请输入上传商品的价格" oninput="value=value.replace(/[^\d]/g,'')" maxlength="6" v-model="addPrice">
	  				<input type="text" placeholder="请输入上传商品的搜索字段" maxlength="5" v-model="addSearch">
	  				<textarea placeholder="请输入上传商品的描述" v-model="addMsg"></textarea>
  				</div>	
  			</div>
  			<button @click="tijiao">提交</button>
  		</div>
  		<div class="delGood" v-if="ifDel">
  			<div class="delInput">
  				<input type="text" v-model="delSerch" @keyup.enter="serch('del')">
  				<button @click="serch('del')">搜索</button>
  			</div>
  			<div class="delGoodList">
  				<ul>
  					<li v-for="items in delGoodsList">
  						<div>
  							<img v-lazy="'../../static/picture/' + items.productImage" :key="'../../static/picture/' + items.productImage" alt="">
  						</div>
  						<div>
  							{{items.productName}}
  						</div>
  						<div>
  							<button @click="ifDelItem(items.productId,items.productImage)">删除</button>
  						</div>
  					</li>
  				</ul>
  			</div>
  		</div>
  		<div class="changeGood" v-if="ifChange">
  			<div class="changeInput">
  				<input type="text" v-model="changeSerch" @keyup.enter="serch('change')">
  				<button @click="serch('change')">搜索</button>
  			</div>	
  			<div class="changeGoodList">
  				<ul>
  					<li v-for="items in changeGoodsList">
  						<div>
  							<img v-lazy="'../../static/picture/' + items.productImage" :key="'../../static/picture/' + items.productImage" alt="">
  						</div>
  						<div>
  							{{items.productName}}
  						</div>
  						<div>
  							{{items.salePrice}}元
  						</div>
  						<div>
  							搜索关键字：{{items.productSerchKey}}
  						</div>
  						<div>
  							<button @click="showChangeTanchu(items.productId)">修改</button>
  						</div>
  					</li>
  				</ul>
  			</div>
  		</div>
  	</div>
  	<tan-chu-model v-bind:mdShow="delTanchu">
      <div slot="msg" class="msg">确定要永久删除该商品么</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="sureDel">确定</button>
        <button @click="closeDel">取消</button>
      </div>
    </tan-chu-model>
    <tan-chu-model v-bind:mdShow="addTanchuOne">
      <div slot="msg" class="msg">请将所有项目填写完整</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="closeTijiaoOne">关闭</button>
      </div>
    </tan-chu-model>
    <tan-chu-model v-bind:mdShow="addTanchuTwo">
      <div slot="msg" class="msg">提交商品成功</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="closeTijiaoTwo">关闭</button>
      </div>
    </tan-chu-model>
    <tan-chu-model v-bind:mdShow="addTanchuThree">
      <div slot="msg" class="msg">确定提交商品么</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="sureTijiaoThree">确定</button>
        <button @click="closeTijiaoThree">取消</button>
      </div>
    </tan-chu-model>
    <tan-chu-model v-bind:mdShow="addTanchuFour">
      <div slot="msg" class="msg">以存在该商品</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="closeTijiaoFour">关闭</button>
      </div>
    </tan-chu-model>
    <div class="changeTanchu" v-if="changeTanchu">
    	<div class="changeZhezhao"></div>
    	<div class="changeMain">
    		<span @click="closeChangeTanchu">x</span>
    		<input type="file" accept="image/*" ref="changeImg"> 
  			<!-- <div>{{this.$refs.chngeImg.files[0]}}</div> -->
			<input type="text" maxlength="10" placeholder="请输入修改商品的名字" v-model="changeName">
			<input type="text" placeholder="请输入修改商品的价格" oninput="value=value.replace(/[^\d]/g,'')" maxlength="6" v-model="changePrice">
			<input type="text" placeholder="请输入修改商品的搜索字段" maxlength="5" v-model="changeSearchKey">
			<textarea placeholder="请输入修改商品的描述" v-model="changeMsg"></textarea>
			<button @click="toChange">修改</button>
    	</div>
    </div>
    <tan-chu-model v-bind:mdShow="changeTanchusure">
      <div slot="msg" class="msg">确认修改商品么</div>
      <div slot="btnGroup" class="btnGroup">
        <button @click="sureChange">确认</button>
        <button @click="closeChange">取消</button>
      </div>
    </tan-chu-model>
    <div>{{changeImgName}}</div>
  </div>
</template>

<script>
import NavHeader from '../components/NavHeader'
import NavFooter from '../components/NavFooter'
import NavBred from '../components/NavBred'
import TanChuModel from '../components/TanChuModel'
import axios from 'axios';
axios.defaults.withCredentials = true
import { mainHost } from "./../lib/mainHost";

export default {
  data () {
    return {
		checkIfLogin : false,
		ifAdd : true,
		ifDel : false,
		ifChange : false,
		delGoodsList : [],
		delSerch : '',
		delProductId : '',
		delProductImage : '',
		delTanchu : true,
		addImgName : '',
		addName : '',
		addPrice : '',
		addMsg : '',
		addSearch : '',
		addTanchuOne : true,
		addTanchuTwo : true,
		addTanchuThree : true,
		addTanchuFour : true,
		changeGoodsList : [],
		changeSerch : '',
		changeName: '',
		changePrice: '',
		changeSearchKey: '',
		changeMsg: '',
		changeProductId : '',
		changeTanchu : false,
		changeTanchusure : true,
		changeImgName : ''
    }
  },
  mounted() {
  	this.checkIf();
  },
  components: {
    TanChuModel
  },
  methods: {
  	/*初始化检测管理员是否登陆*/
  	checkIf() {
  		axios.post(mainHost + "/roots/checkIf").then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.checkIfLogin = true;
        } else {
          this.checkIfLogin = false;
        }
      });
  	},
  	/*注销*/
  	register() {
  		axios.post(mainHost + "/roots/register").then((response) => {
        let res = response.data;
        if (res.status=='0') {
          this.checkIfLogin = false;
          this.$router.push({
	        path:"/"
	      });
        }
      });
  	},
  	/*点击切换项目*/
  	nowChooseBtn(mth) {
  		if (mth == 'add') {
  			this.ifAdd = true;
			this.ifDel = false;
			this.ifChange = false;
  		} else if (mth == 'del') {
  			this.ifAdd = false;
			this.ifDel = true;
			this.ifChange = false;
			axios.get(mainHost + "/roots/allGoods").then((response) => {
				let res = response.data;
				if (res.status=='0') {
				  this.delGoodsList = res.result;
				}
			});
  		} else {
  			this.ifAdd = false;
			this.ifDel = false;
			this.ifChange = true;
			axios.get(mainHost + "/roots/allGoods").then((response) => {
				let res = response.data;
				if (res.status=='0') {
				  this.changeGoodsList = res.result;
				}
			});
  		}
  	},
  	/*搜索商品*/
  	serch(pro) {
  		if (pro == "del") {
  			axios.get(mainHost + "/roots/serch",{
  				params : {"productSerchKey" : this.delSerch}
  			}).then((response) => {
				let res = response.data;
				if (res.status=='0') {
				  this.delGoodsList = res.result;
				} else {
					this.delSerch = ''
				}
			});
  		} else {
  			axios.get(mainHost + "/roots/serch",{
  				params : {"productSerchKey" : this.changeSerch}
  			}).then((response) => {
				let res = response.data;
				if (res.status=='0') {
				  	this.changeGoodsList = res.result;
				} else {
					this.changeGoodsList = ''
				}
			});
  		}
  	},
  	/*点删除按钮弹出框出现*/
  	ifDelItem(id,imgName) {
  		this.delProductId = id;
  		this.delProductImage = imgName;
		this.delTanchu = false;
  	},
  	/*点取消按钮弹出框关闭*/
  	closeDel() {
  		this.delProductId = '';
		this.delTanchu = true;
  	},
  	/*点确定删除商品*/
  	sureDel() {
  		axios.post(mainHost + "/roots/del",{
				"productId" : this.delProductId,
				"productImage" : this.delProductImage
			}).then((response) => {
			let res = response.data;
			if (res.status=='0') {
			  	this.delProductId = '';
			  	this.delGoodsList = res.result;
			} else {
				alert("删除失败");
			}
		});
		this.delTanchu = true;
  	},
  	/*点击提交添加*/
  	tijiao() {
  		if (!this.addName || !this.addPrice || !this.addMsg || !this.addSearch || !this.$refs.addImg.files[0]) {
  			this.addTanchuOne = false;
  		} else {
  			let img = this.$refs.addImg.files[0];
			let Form = new FormData();
			Form.append('avatar', img);
			let config = {
				headers:{"Content-Type":"multipart/form-data"}
			}
			axios.post(mainHost + '/roots/addGoodImg',Form,config).then((response)=>{
				let res = response.data;
				this.addImgName = res.result;
				console.log(this.addImgName)
			});

			this.addTanchuThree = false;
  		}
  	},
  	/*关闭提交弹窗*/
  	closeTijiaoOne() {
  		this.addTanchuOne = true;
  		console.log(this.$refs.addImg.files[0])
  	},
  	closeTijiaoTwo() {
  		this.addName = '';
		this.addPrice = '';
		this.addMsg = '';
		this.addSearch = '';
  		this.addTanchuTwo = true;
  	},
  	/*确定是否提交商品*/
	sureTijiaoThree() {
		axios.post(mainHost + "/roots/addGood",{
			"productName" : this.addName,
			"productSerchKey" : this.addSearch,
			"salePrice" : this.addPrice,
			"productImage" : this.addImgName,
			"productMessage" : this.addMsg
		}).then((response) => {
			let res = response.data;
			if (res.status=='0') {
			  	console.log("添加成功");
			  	this.addTanchuFour = true;
			  	this.addTanchuTwo = false;
			} else {
				this.addTanchuFour = false;
			}
		});
		this.addTanchuThree = true;
	},
	closeTijiaoThree() {
		axios.post(mainHost + "/roots/delImg",{
				"productImage" : this.addImgName
			}).then((response) => {
			let res = response.data;
			if (res.status=='0') {
			  	console.log("图片删除成功");
			} else {
				alert("删除失败");
			}
		});
		this.addTanchuThree = true;
	},
	closeTijiaoFour() {
		this.addTanchuFour = true;
	},
	/*点修改弹出修改弹窗*/
	showChangeTanchu(tid) {
		this.changeProductId = tid;
		this.changeTanchu = true;
	},
	/*点x弹出修改弹窗*/
	closeChangeTanchu() {
		this.changeTanchu = false;
		this.changeProductId = '';
		this.changeName = '';
		this.changeSearchKey = '';
		this.changePrice = '';
		this.changeMsg = '';
	},
	/*点修改*/
	toChange() {
		let img = this.$refs.changeImg.files[0];
		if (img) {
			let Form = new FormData();
			Form.append('avatar', img);
			let config = {
				headers:{"Content-Type":"multipart/form-data"}
			}
			axios.post(mainHost + '/roots/addGoodImg',Form,config).then((response)=>{
				let res = response.data;
				this.changeImgName = res.result;
				console.log(this.addImgName)
			});
		}
		this.changeTanchu = false;
		this.changeTanchusure = false;
	},
	/*确认和取消修改*/
	sureChange() {
		axios.post(mainHost + "/roots/changeGood",{
			"productId" : this.changeProductId,
			"productName" : this.changeName,
			"productSerchKey" : this.changeSearchKey,
			"salePrice" : this.changePrice,
			"productImage" : this.changeImgName,
			"productMessage" : this.changeMsg
		}).then((response) => {
			let res = response.data;
			if (res.status=='0') {
			  	this.changeGoodsList = res.result;
			} else {
				alert("商品修改失败");
			}
		});
		this.changeImgName = '';
		this.changeName = '';
		this.changeSearchKey = '';
		this.changePrice = '';
		this.changeMsg = '';
		this.changeTanchu = false;
		this.changeTanchusure = true;
	},
	closeChange() {
		if (this.changeImgName) {
			axios.post(mainHost + "/roots/delImg",{
				"productImage" : this.changeImgName
			}).then((response) => {
				let res = response.data;
				if (res.status=='0') {
				  	console.log("图片删除成功");
				} else {
					alert("删除失败");
				}
			});
		}
		this.changemgName = '';
		this.changeTanchu = true;
		this.changeTanchusure = true;
	},
	/*回顶部或底部*/
	totoporbottom(msg) {
		if (msg == '1') {
			window.scrollTo(0,0);
		} else {
			window.scrollTo(0,100000);
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
.rootTitle {
	width: 100%;
	height: 60px;
	background-color: #5097ff;
}
.rootWrap {
	width: 1200px;
	height: 60px;
	position: relative;
	left: 50%;
	margin-left: -600px;
}
.rootWrap p {
	width: 800px;
	float: left;
	height: 60px;
	line-height: 60px;
	text-align: left;
	color: #fff;
	font-size: 30px;
	font-family: "STXingkai";
}
.rootWrap a {
	display: block;
	width: 100px;
	float: right;
	height: 60px;
	line-height: 60px;
	color: #fff;
}
.methodsTitle {
	width: 100%;
	height: 60px;
}
.methodsTitle button {
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
	border-radius: 10px;
	transition: background-color .5s ease-out;
}
.methodsTitle button.nowChoose {
	background-color: #d1434a;
}
.methodsTitle button:hover {
	background-color: #d1434a;
}
.addGood,
 .delGood,
 .changeGood {
	width: 100%;
	min-height: 542px;
}
.addGood {
	background-color: #f3f5fc;
}
.addGood>div {
	width: 1194px;
	border: 3px solid rgba(0,0,0,.2);
	position: relative;
	left: 50%;
	margin-left: -597px;
}
.addGood>div:after {
	clear: both;
	content: '';
	height: 0;
	display: block;
	visibility: hidden;
}
.addGood>div div.proName {
	width: 597px;
	float: left;
}
.addGood>div div.proName p {
	text-align: right;
}
.addGood>div div.proName p:nth-child(1) {
	height: 54px;
	line-height: 54px;
}
.addGood>div div.proName p:nth-child(2) {
	height: 50px;
	line-height: 36px;
}
.addGood>div div.proName p:nth-child(3) {
	height: 50px;
	line-height: 33px;
}
.addGood>div div.proName p:nth-child(4) {
	height: 50px;
	line-height: 31px;
}
.addGood>div div.proName p:nth-child(5) {
	height: 50px;
	line-height: 33px;
}
.addGood>div div.proInput {
	width: 597px;
	float: right;
}
.addGood>div div.proInput input:nth-child(1) {
	display: block;
	margin: 15px;
	outline: none;
}
.addGood>div div.proInput input:nth-child(2),
.addGood>div div.proInput input:nth-child(3), 
.addGood>div div.proInput input:nth-child(4) {
	display: block;
	width: 200px;
	height: 30px;
	margin: 15px;
	outline: none;
	border: 2px solid rgba(0,0,0,0.2);
}
.addGood>div div.proInput textarea {
	display: block;
	width: 400px;
	height: 200px;
	margin: 15px;
	outline: none;
	border: 2px solid rgba(0,0,0,0.2);
	resize:none;
}
.addGood button {
	width: 60px;
	height: 40px;
	margin-top: 10px;
	cursor: pointer;
}
.addInput,
.delInput,
.changeInput {
	width: 100%;
	height: 60px;
}
.addInput {
	background-color: #caa595;
}
.delInput {
	background-color: #b6dbee;
}
.changeInput {
	background-color: #fea178;
}
.addInput input, 
.delInput input, 
.changeInput input {
	width: 200px;
	height: 30px;
	position: relative;
	top: 10px;
	text-indent: 10px;
	outline: none;
	border: 3px solid rgba(0,0,0,.2);
	border-radius: 10px;
}
.addInput button, 
.delInput button, 
.changeInput button {
	width: 50px;
	height: 40px;
	position: relative;
	top: 10px;
	cursor: pointer;
	background-color: orange;
	outline: none;
	border: none;
	border-radius: 8px;
	color: #fff;
	font-weight: bold;
	transition: background-color .5s ease-out;
}
.addInput button:hover, 
.delInput button:hover, 
.changeInput button:hover {
	background-color: #d1434a;
}
.delGoodList,
.changeGoodList {
	width: 100%;
}
.delGoodList ul,
.changeGoodList ul {
	width: 1200px;
	position: relative;
	left: 50%;
	margin-left: -600px;
}
.delGoodList ul li,
.changeGoodList ul li {
	width: 1198px;
	height: 150px;
	margin-top: 30px;
	border: 3px solid rgba(0,0,0,.2);
	border-radius: 30px;
}
.delGoodList ul li div {
	width: 399px;
	height: 150px;
	line-height: 150px;
	float: left;
}
.changeGoodList ul li div {
	width: 239px;
	height: 150px;
	line-height: 150px;
	float: left;
}
.delGoodList ul li div img,
.changeGoodList ul li div img {
	height: 100px;
	width: 100px;
	position: relative;
	top: 25px;
}
.delGoodList ul li div button,
.changeGoodList ul li div button {
	width: 50px;
	height: 40px;
	position: relative;
	top: 10px;
	cursor: pointer;
	background-color: orange;
	outline: none;
	border: none;
	border-radius: 8px;
	color: #fff;
	font-weight: bold;
	transition: background-color .5s ease-out;
}
.delGoodList ul li div button:hover,
.changeGoodList ul li div button:hover {
	background-color: #d1434a;
}
.changeZhezhao {
	position: fixed;
	width: 100%;
	height: 1200%;
	top: -60px;
	background-color: rgba(0,0,0,.5);
}
.changeMain {
	position: fixed;
	width: 500px;
	height: 500px;
	left: 50%;
	top: 50%;
	margin-left: -250px;
	margin-top: -250px;
	background-color: #fff;
}
.changeMain input,
.changeMain button,
.changeMain textarea {
	display: block;
	outline: none;
}
.changeMain input:nth-child(2) {
	border: none;
	width: 300px;
	position: relative;
	left: 85px;
	height: 35px;
	margin: 10px;
}
.changeMain input:nth-child(3),
.changeMain input:nth-child(4),
.changeMain input:nth-child(5) {
	width: 300px;
	position: relative;
	left: 85px;
	height: 35px;
	margin: 10px;
	border: 2px solid rgba(0,0,0,.2);
}
.changeMain textarea {
	width: 301px;
	height: 210px;
	position: relative;
	left: 95px;
	resize: none;
}
.changeMain button {
	width: 60px;
	height: 40px;
	margin-top: 10px;
	cursor: pointer;
	position: relative;
	left: 212px;
}
.changeMain span {
	position: absolute;
	display: inline-block;
	width: 30px;
	height: 30px;
	font-size: 30px;
	left: 465px;
	cursor: pointer;
}
.changeMain span:hover {
	color: red;
}
.btnsFix {
	position: fixed;
	z-index: 100;
	width: 30px;
	height: 120px;
	left: 100%;
	top: 100%;
	margin-left: -100px;
	margin-top: -180px;
}
.btnsFix button {
	outline: none;
	cursor: pointer;
	background-color: orange;
	color: #fff;
}
</style>
