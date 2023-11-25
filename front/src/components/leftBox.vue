<template>
  <el-container class="left-box map-overlay">
    <el-main>
      <div id="name">崩岸风险评估结果</div>
      <el-divider />
      <div class="section-list">
        <el-scrollbar ref="scrollbar" always>
          <el-collapse class="collapse" v-model="store.currentName" accordion>
            <el-collapse-item v-for="(value, key, index) in store.configData" :name="key">
              <template #title>
                <div class="section-name">{{ key }}</div>
                <el-card class="card">
                  <div
                    class="stability"
                    :style="{ color: statusColors[store.statuses[key]] }"
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
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, onMounted, ref, watch, computed } from "vue";
import calculation from "@/components/calculation.vue";

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

// const activeColor = computed(() => {
//   return function (key) {
//     return key === store.currentName ? 'yellow' : 'transparent';
//   };
// });
</script>

<style scoped>
.left-box {
  position: absolute;
  top: 3%;
  width: 25%;
  left: 1%;
  height: 95%;
}

.el-divider {
  border-color: rgb(150, 150, 150);
  margin: 15px 0;
}

#name {
  padding: 5px 0;
  font-family: 思源黑体Bold;
  text-align: center;
  font-size: 20px;
  color: #333333;
}

.bold-text {
  padding: 10px 0;
  font-family: 黑体;
  font-size: 15px;
  font-weight: bold;
}

.collapse {
  --el-collapse-header-bg-color: transparent;
  --el-collapse-header-height: 80px;
  --el-collapse-border-color: #6b6b6b;
  border-top: 0;
  --el-collapse-content-bg-color: transparent;
}

.section-list {
  position: relative;
  height: 80%;
  /* overflow: auto; */
  border: 1px solid #6b6b6b;
  /* border-top: 0; */
}

.section-name {
  position: relative;
  font-family: 思源黑体N;
  padding: 10px;
  font-size: 16px;
  line-height: 17px;
  text-align: left;
  width: 60%;
}

.card {
  position: relative;
  line-height: 30px;
  width: 60px;
  height: 60px;
  --el-card-padding: 0;
}

.stability {
  background-color: #e8e8e8;
  font-weight: bold;
}

.probability {
  color: white;
  font-weight: bold;
  font-size: 16px;
}

</style>
