<template>
  <el-container class="left-box map-overlay">
    <el-main>
      <div id="title">崩岸风险评估结果</div>
      <el-divider />
      <el-row justify="end">
        <el-button class="btn-export-all" @click="exportAllResults">
          <el-icon :size="15" color="#7E8988"><Download /></el-icon>
          导出结果
        </el-button>
      </el-row>
      <div class="section-list box-overlay">
        <el-scrollbar ref="scrollbar" always>
          <el-collapse class="collapse box-overlay" v-model="store.currentName" accordion>
            <el-collapse-item v-for="(value, key, index) in store.configData" :name="key">
              <template #title>
                <div class="section-name">{{ key }}</div>
                <el-card class="card">
                  <div
                    class="stability"
                    :style="{
                      color: statusColors[store.statuses[key]],
                      'background-color': '#D9E2FF',
                    }"
                  >
                    {{ statusNames[store.statuses[key]] }}
                  </div>
                  <div
                    class="probability"
                    :style="{ 'background-color': statusColors[store.statuses[key]] }"
                  >
                    {{ store.results[key][store.statuses[key]] }}
                  </div>
                </el-card>
              </template>
              <calculation :sectionName="key" />
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
      <el-row justify="center" style="margin: 0vh"> </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, onMounted, ref, watch, computed } from "vue";
import calculation from "@/components/calculation.vue";
import { Download } from "@element-plus/icons-vue";

export default defineComponent({
  name: "leftBox",
  components: {
    calculation,
  },
  computed: {},
});
</script>

<script setup>
import { useStore } from "@/stores/index.js";
const store = useStore();

const scrollbar = ref();

const sections = ref(["民主沙右缘段"]);
const statusColors = ["#0174BC", "#17BC01", "#F18614", "#ED3324"];
const statusNames = ["稳定", "较稳定", "较不稳定", "不稳定"];

// store.$subscribe((mutation, state) => {
//   sections.value = [store.currentName];
// });
watch(
  () => store.currentName,
  (newValue, oldValue) => {
    sections.value = [newValue];
    var index = 0;

    //自动调整scrollbar
    for (var key in store.configData) {
      if (key === newValue) {
        scrollbar.value.setScrollTop(index * 80);
        break;
      }
      index += 1;
    }
  }
);

function exportAllResults() {
  const fileName = "岸坡崩塌概率计算结果.csv";
  let data = [["岸段名称","稳定概率","较稳定概率","较不稳定概率","不稳定概率"]];
  for (var key in store.results) {
    let content = [key].concat(store.results[key]);
    data.push(content);
  }

  var text = "";
  for (var i = 0; i < data.length; i++) {
    text += data[i].join(",") + "\n";
  }

  const blob = new Blob(["\uFEFF" + text], {
    //加bom头
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, fileName);
}
</script>

<style scoped>
.left-box {
  position: absolute;
  top: 2vh;
  width: 25vw;
  left: 1vw;
  height: 90vh;
  z-index: 3;
}

.el-divider {
  border-color: rgb(150, 150, 150);
  margin-top: 3vh;
  margin-bottom: 0;
}

#title {
  padding: 1vh 0;
  font-family: 思源黑体Bold;
  text-align: center;
  font-size: calc(1.1vw + 1.1vh);
  color: #d8e0fa;
}

.collapse {
  --el-collapse-header-bg-color: transparent;
  --el-collapse-header-height: 14vh;
  --el-collapse-border-color: #6b6b6b;
  border-top: 0;
  --el-collapse-content-bg-color: transparent;
  --el-collapse-header-text-color: #c0d0ff;
}

.section-list {
  position: relative;
  height: 77%;
  /* overflow: auto; */
  /* border: 1px solid #6b6b6b; */
  /* border-top: 0; */
}

.section-name {
  position: relative;
  font-family: 思源黑体N;
  padding: 1vh 0.7vw;
  font-size: calc(0.85vw + 0.85vh);
  line-height: 3vh;
  text-align: left;
  width: 60%;
  color: #c0d0ff;
}

.card {
  position: relative;
  line-height: 4.5vh;
  width: 10vh;
  height: 9vh;
  --el-card-padding: 0;
}

.stability {
  background-color: #e8e8e8;
  font-weight: bold;
  font-size: calc(0.7vw + 0.7vh);
}

.probability {
  color: white;
  font-weight: bold;
  font-size: calc(0.8vw + 0.8vh);
}

/* 箭头样式 */
.el-icon {
  --color: #e8e8e8;
}

.btn-export-all {
  height: 4.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 0;
  color: #7E8988;
  font-size: calc(0.7vw + 0.7vh);
}
</style>
