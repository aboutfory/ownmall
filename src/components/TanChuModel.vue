<template>
  <div>
    <div class=tanChuModel v-bind:class="{'mdShow' : mdShow}">
      <div class="zheZhao"></div>
      <div class="msgBox">
        <slot name="msg"></slot>
        <!-- <div class="msg">这是相关信息</div> -->
        <slot name="btnGroup"></slot>
        <!-- <div class="btnGroup">
          <button>确认</button>
          <button>取消</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:["mdShow"],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@keyframes tanChuModel{  
0%   {margin-top: -90px;}  
25%  {margin-top: -105px;}  
50%  {margin-top: -120px;}  
75%  {margin-top: -135px;}  
100% {margin-top: -150px;}  
}  
.tanChuModel{
  width: 100%;
  height: 100%;
}
.mdShow {
  display: none;
}
.zheZhao{
  position: fixed;
  background-color: rgba(0,0,0,.5);
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 99;
}
.msgBox {
  width: 600px;
  height: 300px;
  background-color: #fff;
  border: 2px solid black;
  z-index: 100;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -300px;
  border-radius: 20px;
  animation: tanChuModel .5s linear;
}
.msg {
  position: relative;
  top: 35px;
  width: 100%;
  height: 100px;
  font-size: 30px;
  line-height: 100px;
  font-family: "微软雅黑";
  color: gray;
  text-align: center;
}
.btnGroup {
  display: flex;
  align-items: center;
  justify-content: center;
}
.btnGroup button,
.btnGroup a {
  width: 180px;
  height: 40px;
  line-height: 40px;
  background-color: orange;
  position: relative;
  top: 60px;
  margin: 0 20px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color .5s ease-out;
}
.btnGroup button:hover,
.btnGroup a:hover {
  background-color: #D1434A;
}
</style>
