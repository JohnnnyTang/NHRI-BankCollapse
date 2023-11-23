<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-row style="height: 100%" justify="center" align="middle">
          <el-col :span="2">
            <router-link to="/Home"
              ><span class="nav-item-active">首页</span>
            </router-link></el-col
          >
          <el-col :span="2"
            ><router-link to="/Statistics"
              ><span class="nav-item">统计分析</span>
            </router-link></el-col
          >
          <el-col :span="2"
            ><router-link to="/Device"
              ><span class="nav-item" style="margin-left: 10px">设备维护</span>
            </router-link></el-col
          >
        </el-row>
      </el-header>
      <el-main>
        <mapView />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import mapView from "@/components/mapView.vue";

export default {
  name: "HomeView",
  components: {
    mapView,
  },
};
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
  height: 60px;
  background-color: rgb(17, 17, 17);
  color: #fff;
  padding: 0;
  margin: 0;
}

.el-main {
  position: relative;
  padding: 0;
  margin: 0;
}

.nav-item {
  color: white;
  text-decoration: none;
}

.nav-item-active {
  color: rgb(0, 101, 238);
  text-decoration: none;
}
</style>
