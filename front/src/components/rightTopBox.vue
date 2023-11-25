<template>
  <el-container class="right-top-box map-overlay">
    <el-main>
      <div id="title">历史崩岸信息</div>
      <el-divider />
      <el-input
        v-model="inputContent"
        class="searchinput"
        placeholder="请输入关键词进行查询"
      >
        <template #prepend>
          <el-button :icon="Search" @click="search" />
        </template>
      </el-input>
      <!-- <span style="margin: 0px 5px 0px 0px">查询时间范围</span>
      <div class="block">
        <span class="demonstration">Default</span>
        <el-date-picker
          v-model="value1"
          type="monthrange"
          range-separator="To"
          start-placeholder="Start month"
          end-placeholder="End month"
        />
      </div> -->

      <div class="history-info">
        <el-table
          v-if="showTable"
          :data="tables"
          style="width: 100%"
          :cell-style="{ background: '#5B637C', color:'#D8E0FA' ,borderColor: '#B7B7B7', padding: '1px' }"
          :header-cell-style="{
            background: '#333E52',
            color: '#D8E0FA',
            borderColor: '#B7B7B7',
            padding: '1px',
          }"
          height="185"
          class="style-table box-overlay"
          border
          stripe
        >
          <el-table-column prop="时间" label="时间" width="84" />
          <el-table-column prop="县（市、区）" label="县(市、区)" width="85" />
          <el-table-column prop="崩岸地点" label="崩岸地点" width="70" />
          <el-table-column prop="崩岸类型" label="崩岸类型" width="70" />
          <el-table-column prop="所在河段" label="所在河段" width="70" />
          <el-table-column prop="岸别" label="岸别" width="70" />
          <el-table-column prop="口门长度（m）" label="口门长度(m)" width="90" />
          <el-table-column prop="崩窝宽度(m)" label="崩窝宽度(m)" width="90" />
          <el-table-column prop="宽/深比" label="宽/深比" width="70" />
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import { Search } from "@element-plus/icons-vue";

export default defineComponent({
  name: "rightTopBox",
  computed: {},
});
</script>

<script setup>
import axios from "axios";

const tableData = ref(null);
const showTable = ref(false);

const searchContent = ref("");
const inputContent = ref("");

const searchTime = ref({
  startTime: "",
  endTime: "",
});

function search() {
  searchContent.value = inputContent.value;
}

const tables = computed(() => {
  let tabledata = tableData.value;
  const search = searchContent.value;
  //当将input框清空时，使列表自动展示搜索前的完整数据，并返回至首页，防止叠加搜索
  if (inputContent.value == "") {
    searchContent.value = "";
    return tabledata;
  }
  if (search !== "") {
    let t = tabledata.filter((dataNews) => {
      return Object.keys(dataNews).some((key) => {
        return String(dataNews[key]).toLowerCase().indexOf(search) > -1;
      });
    });
    return t;
  }
  return tableData;
});

onMounted(() => {
  axios
    .get("http://localhost:5173/historyInfo.json", { responseType: "json" })
    .then((res) => {
      tableData.value = res.data;
      //configData = data;
      showTable.value = true;
    });
});
</script>

<style scoped>
.right-top-box {
  position: absolute;
  top: 3%;
  width: 26%;
  right: 1%;
  height: 55%;
}

.el-divider {
  border-color: rgb(150, 150, 150);
  margin: 10px 0;
}

#title {
  font-family: 思源黑体Bold;
  color: #D8E0FA;;
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
