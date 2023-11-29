<template>
  <el-container class="right-top-box map-overlay">
    <el-main>
      <el-scrollbar>
        <div id="title">历史崩岸信息查询</div>
        <el-divider />
        <el-input
          style="height: 4vh"
          v-model="inputContent"
          class="searchinput"
          placeholder="请输入关键词进行查询"
        >
          <template #suffix>
            <el-icon @click="clear" style="cursor:pointer"><Close /></el-icon>
          </template>
          <template #append>
            <el-button :icon="Search" @click="search" style="height: 4vh" />
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
            :cell-style="{
              background: '#042B56',
              color: '#DFFBFC',
              fontSize: 'calc(0.5vw + 0.4vh)',
              borderColor: '#B7B7B7',
              padding: '0.1vh 0.1vw',
              textAlign: 'center'
            }"
            :header-cell-style="{
              background: '#293241',
              color: '#D8E0FA',
              fontSize: 'calc(0.5vw + 0.4vh)',
              borderColor: '#B7B7B7',
              padding: '0.1vh 0.1vw',
              textAlign: 'center'
            }"
            height="33.5vh"
            class="style-table box-overlay"
            border
            stripe
            :fit="true"
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
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import { Search, Close } from "@element-plus/icons-vue";

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

function clear() {
  inputContent.value = ''
}

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
  return tabledata;
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
  top: 2vh;
  width: 26vw;
  right: 1vw;
  height: 53vh;
}

.el-divider {
  border-color: rgb(150, 150, 150);
  margin: 2vh 0;
}

#title {
  font-family: 思源黑体Bold;
  color: #d8e0fa;
  text-align: center;
  font-size: calc(0.95vw + 0.95vh);
}

.history-info {
  position: relative;
  margin: 2vh 0;
  overflow: auto;
}

.style-table {
  background-color: transparent !important;
  width: 100%;
}
</style>
