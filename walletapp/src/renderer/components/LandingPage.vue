<template>
  <div id="wrapper">
    <el-row>
      <br>
    </el-row>
    <el-row>
      <el-col :offset="7" :span="16">
        <div>
          <img id="logo" src="~@/assets/planet.png">
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="8" :span="12">
        <span class="title">欢迎使用Carota钱包服务</span>
      </el-col>
    </el-row>
    <el-row>
      <br>
    </el-row>
    <el-row>
      <el-col :offset="7" :span="16">
        <el-button type="success" @click="startWalletService">启动钱包服务</el-button>
        <el-button type="info" @click="stopWalletService">关闭钱包服务</el-button>
      </el-col>
    </el-row>
    <el-row>
      <br>
    </el-row>
    <el-row>
      <el-col :offset="8" :span="16" v-if="isConnected">
        <el-button type="success" icon="el-icon-check" circle></el-button>
        <span>&nbsp;</span>
        <span>用户 {{user}}已连接</span>
      </el-col>
      <el-col :offset="8" :span="16" v-else>
        <el-button type="danger" icon="el-icon-close" circle></el-button>
        <span>&nbsp;</span>
        <span>未连接到Fabric网络</span>
      </el-col>
    </el-row>
    <el-row>
      <br>
    </el-row>
    <el-row>
      <el-col :offset="1" :span="22">
        <el-input type="textarea" :rows="10" placeholder v-model="log"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */

import { discoveryWallet, connectToFabric } from "../services/operations";
import startExpress from "../services/startExpress";
import { getNow } from "../services/utils";

export default {
  name: "landing-page",
  components: {},
  data() {
    return {
      log: "",
      isConnected: false,
      user: "",
      server: null,
    };
  },
  methods: {
    displayMsg(log) {
      let now = getNow();
      this.log = `${now}${log}\n` + `${this.log}`;
    },
    startWalletService() {
      let user = discoveryWallet();
      if (!user) {
        this.showAlert("未发现钱包用户，请确保wallet和本应用在同一目录内！");
        return;
      }

      this.showConfirm(
        `发现钱包用户${user}，是否连接到Fabric网络？`,
        async () => {
          let walletService = await connectToFabric(user);
          if (walletService) {
            let server = startExpress(walletService);
            if (!server) {
              this.showAlert(
                "连接Fabric网络成功，但钱包服务启动失败，请检查3000端口是否被占用"
              );
              return;
            }

            this.user = user;
            this.isConnected = true;
            this.server = server;

            this.showAlert("连接成功！");

          } else {
            this.showAlert(
              "连接失败，请检查wallet文件夹以及connection.json文件！"
            );
          }
        }
      );
    },
    stopWalletService() {

      if(this.server){
        this.server.close();
        this.server = null;
        const loading = this.$loading({
          lock: true,
          text: '关闭中',
        });
        setTimeout(() => {
          loading.close();
          this.user = '';
          this.isConnected =false;
        }, 3000);
      }
    },
    showAlert(msg) {
      this.$alert(msg, "提示", {
        confirmButtonText: "确定",
        showClose: false
      });
    },
    showConfirm(challenge, func) {
      this.$confirm(challenge, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false
      })
        .then(() => {
          func();
        })
        .catch(() => {
          this.showAlert("操作已取消");
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
  height: 685px;
  width: 685px;
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
