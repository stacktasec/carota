<template>
  <div id="wrapper">
    <div>
      <img id="logo" src="~@/assets/planet.png">
    </div>
    <div>
      <main>
        <div class="left-side">
          <span class="title">Welcome to your new project!</span>
          <span class="title">
            <button @click="callFunc">调用一次</button>
            <button @click="start">启动服务器</button>
            <button @click="showBox">弹窗</button>
          </span>
          <span class="title">           
            <span>用户 User1已连接</span>
            <span>&nbsp;</span>
            <el-button type="success" icon="el-icon-check" circle></el-button>
          </span>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import SystemInformation from "./LandingPage/SystemInformation";
import connectToNetwork from "../services/connectToNetwork";
import startExpress from "../services/startExpress";

export default {
  name: "landing-page",
  components: { SystemInformation },
  data() {
    return {
      debugValue: ""
    };
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    async callFunc() {
      try {
        await connectToNetwork();
      } catch (error) {}
    },
    start() {
      startExpress();
    },
    showBox(){
      this.$alert('这是一段内容', '标题名称', {
          confirmButtonText: '确定',
          showClose:false,
          center:true,
        });
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items:center;
  justify-content:center;
  height: 500px;
}

#logo {
  
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 100%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
