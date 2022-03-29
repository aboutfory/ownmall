<template>
  <div> 
    <div class="bred">
      <div class="bred-wrap">
        <a href="/" class="bred-main">主页</a>
        <span class="bred-span">/</span>
        <span class="bred-slot">
          <slot></slot>
        </span>
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
.bred {
  height: 40px;
  width: 100%;
  background-color: #f5f3fc;
}
.bred-wrap {
  width: 1200px;
  height: 40px;
  position: relative;
  left: 50%;
  margin-left: -600px;
}
.bred-main,
.bred-span,
.bred-slot {
  float: left;
  display: block;
  color: #757575;
  font-size: 15px;
  line-height: 40px;
  margin-right: 10px;
}
.bred-slot:hover {
  cursor: pointer;
}
</style>
