<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-row style="height: 100%" justify="center" align="middle">
          <el-col :span="2">
            <RouterLink to="/home"
              ><span class="nav-item" :class="{ active: curIndex === 1 }"
                >首页</span
              >
            </RouterLink></el-col
          >
          <el-col :span="2"
            ><RouterLink to="/statistics"
              ><span class="nav-item" :class="{ active: curIndex === 2 }">统计分析</span>
            </RouterLink></el-col
          >
          <el-col :span="2"
            ><RouterLink to="/device"
              ><span
                class="nav-item"
                style="margin-left: 10px"
                :class="{ active: curIndex === 3 }"
                >设备维护</span
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
  font-size: calc(0.6vh + 0.8vw);
  font-weight: 600;
  font-family: 'SimHei';
}

span.nav-item:hover {
  color: rgb(144, 190, 255);
}

span.nav-item.active {
  color: rgb(0, 101, 238);
}
</style>
