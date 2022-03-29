<template>
  <div> 
    <div class="footer">
      <ul class="footer-ul">
        <li class="footer-li">关于商城</li>
        <li class="footer-li">合作伙伴</li>
        <li class="footer-li">营销中心</li>
        <li class="footer-li">廉正举报</li>
        <li class="footer-li">联系客服</li>
        <li class="footer-li">开放平台</li>
        <li class="footer-li">诚征英才</li>
        <li class="footer-li">联系我们</li>
        <li class="footer-li">网站地图</li>
        <li class="footer-li">法律声明</li>
        <li class="footer-li">知识产权</li>
      </ul>
      <p>© 2019 yangbo.com All Rrights Reserved, it'sjust for learn</p>
    </div>
  </div> 
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.footer{
  width: 100%;
  height: 100px;
  background: #f3f5f7;
  position: relative;
  text-align: center;
}
.footer-ul{
  width: 638px;
  height: 17px;
  position: absolute;
  left: 50%;
  margin-left: -319px;
  text-align: center;
  top: 40%;
  overflow: hidden;
}
.footer-li{
  float: left;
  list-style: none;
  font-size: 12px;
  color: gray;
  margin:0 5px 0 5px;
}
.footer-li:hover{
  color: #07111b;
  cursor: pointer;
}
.footer p{
  width: 100%;
  height: 17px;
  position: absolute;
  font-size: 12px;
  color: gray;
  top: 60%;
}
</style>
