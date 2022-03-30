<template>
  <div> 
    <div class="header">
      <div class="header-wrap">
        <div class="header-left">
          <ul>
            <li>
              <img src="../../static/picture/projectPic/PhoneIcon.png" alt="" class="header-icon">
              <span>15096366666</span>
            </li>
            <li>
              <img src="../../static/picture/projectPic/TimeIcon.png" alt="" class="header-icon">
              <span>上午9点到晚上9点</span>
            </li>
          </ul>
        </div>
        <div class="header-right">
          <img src="../../static/picture/projectPic/LoginIcon.png" alt="" class="header-icon">
          <slot name="login"></slot>
          <img src="../../static/picture/projectPic/RegisterIcon.png" alt="" class="header-icon">
          <slot name="register"></slot>
        </div>
      </div>
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
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
a {
  text-decoration: none;
}
.header-icon {
  position: relative;
  top: 4px;
  width: 15px;
  height: 15px;
}
.header {
  width: 100%;
  height: 40px;
  color: #757575;
  font-size: 12px;
  background-color: #f3f3f3;
}
.header-wrap {
  width: 1200px;
  height: 40px;
  position: relative;
  left: 50%;
  margin-left: -600px;
}
.header-left {
  float: left;      
}
.header-left ul{
  height: 40px;
  line-height: 40px;
}
.header-left ul li {
  float: left;
}
.header-right {
  float: right;
  height: 40px;
  line-height: 40px;
}
.header-right a {
  color: #757575;
}
.header-right a:hover {
  color: #000000;
}
.header-left ul li,
.header-right a {
  margin-right: 5px;
}
</style>
