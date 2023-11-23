<template>
  <el-container class="right-top-box map-overlay">
    <el-main>
      <div id="title">历史崩岸信息</div>
      <el-divider />
      <div class="history-info">
        <el-table
          :data="tableData"
          style="width: 100%"
          :cell-style="{ background: '#F1F1F1', borderColor: '#6B6B6B' }"
          :header-cell-style="{
            background: '#C2C2C2',
            color: '#474747',
            borderColor: '#6B6B6B',
          }"
          height="205"
          class="style-table"
        >
          <el-table-column prop="section" label="岸段" width="128" />
          <el-table-column align="right"> </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "rightTopBox",
  computed: {},
});
</script>

<script setup>
const tableData = [
  {
    section: "岸段1",
  },
  {
    section: "岸段2",
  },
  {
    section: "岸段3",
  },
  {
    section: "岸段4",
  },
  {
    section: "岸段5",
  },
];
</script>

<style scoped>
.right-top-box {
  position: absolute;
  top: 5%;
  width: 22%;
  right: 2%;
  height: 55%;
}

.el-divider {
  border-color: rgb(150, 150, 150);
  margin: 15px 0;
}

#title {
  font-family: 黑体;
  text-align: center;
  font-size: 18px;
}

.bold-text {
  padding: 10px 0;
  font-family: 黑体;
  font-size: 15px;
  font-weight: bold;
}

.history-info {
  position: relative;
  margin: 10px 0;
  overflow: auto;
}

.style-table {
  background-color: #f1f1f1 !important;
  border: 1px solid #6b6b6b;
}
</style>
