<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-row style="height: 100%" justify="start" align="middle">
          <el-col :span="9">
            <RouterLink to="/home"
              ><span class="title-item" :class="{ active: curIndex === 1 }"
                >岸坡监测数据融合及预警分析系统</span
              >
            </RouterLink></el-col
          >
          <el-col :span="2">
            <RouterLink to="/home"
              ><span class="nav-item" :class="{ active: curIndex === 1 }"
                >崩岸风险预警</span
              >
            </RouterLink></el-col
          >
          <el-col :span="2"
            ><RouterLink to="/statistics"
              ><span class="nav-item" :class="{ active: curIndex === 2 }">监测数据统计</span>
            </RouterLink></el-col
          >
          <el-col :span="2"
            ><RouterLink to="/device"
              ><span
                class="nav-item"
                style="margin-left: 10px"
                :class="{ active: curIndex === 3 }"
                >远程设备管理</span
              >
            </RouterLink></el-col
          >
        </el-row>
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
//import mapView from "@/components/mapView.vue";

export default {
  name: "index",
  components: {},
};
</script>

<script setup>
import { useRoute } from "vue-router";
import { ref, reactive, watchEffect } from "vue";

const curIndex = ref(0);

const route = useRoute();

watchEffect(() => {
  switch (route.path) {
    case "/home":
      curIndex.value = 1;
      break;
    case "/statistics":
      curIndex.value = 2;
      break;
    case "/device":
      curIndex.value = 3;
      break;
    default:
      curIndex.value = 1;
      break;
  }
});
</script>

<style scoped>
.home {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.el-container {
  height: 100%;
}

.el-header {
  position: relative;
  height: 6vh;
  background-color: rgb(2, 2, 38);
  color: #fff;
  padding: 0;
  margin: 0;
}

.el-main {
  position: relative;
  padding: 0;
  margin: 0;
}

span.nav-item {
  color: white;
  text-decoration: none;
  font-size: calc(0.6vh + 0.75vw);
  font-weight: 600;
  font-family: 'SimHei';
}

span.title-item {
  color: white;
  text-decoration: none;
  font-size: calc(0.6vh + 1vw);
  font-weight: 600;
  font-family: 'SimHei';

  letter-spacing: 0.2em;

  background-image: linear-gradient(25deg,
        #fdfffc 0%,
        #a7d1ec 40%,
        #3862eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

span.nav-item:hover {
  color: rgb(144, 190, 255);
}

span.nav-item.active {
  color: rgb(0, 101, 238);
}
</style>
