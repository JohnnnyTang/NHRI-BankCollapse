<template>
  <div class="calculation">
    <el-row class="bold-text">岸坡崩塌概率计算</el-row>
    <el-row>
      <el-col :span="12">
        选择主因子：
      </el-col>
      <el-col :span="12">
        <el-select v-model="currentFactor" class="m-2" placeholder="Select" size="small">
          <el-option
            v-for="(item, index) in mainFactors"
            :key="index"
            :label="item"
            :value="index"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        主因子权重：
      </el-col>
      <el-col :span="12">
        <el-input-number
          v-model="sectionData.weight[currentFactor]"
          :precision="2"
          :step="0.1"
          :max="1"
          :min="0"
        />
      </el-col>
    </el-row>
    <el-row>
      各次因子权重：
    </el-row>
    <div style="margin: 5px; padding: 5px" class="box-overlay">
      <el-row v-for="(item, index) in sectionData[mainFactors[currentFactor]].weight">
        <el-col :span="12">
          <div>{{ subfactors[currentFactor][index] }}：</div>
        </el-col>
        <el-col :span="12">
          <el-input-number
            v-model="sectionData[mainFactors[currentFactor]].weight[index]"
            :precision="2"
            :step="0.1"
            :max="1"
            :min="0"
          />
        </el-col>
      </el-row>
    </div>
    <el-row>
      指标权重判断矩阵：
    </el-row>
    <div style="margin: 5px; padding: 5px">
      <div
        v-for="(row, rowIndex) in sectionData[mainFactors[currentFactor]].matrix"
        style="display: flex; height: 25px"
      >
        <div
          v-for="(cell, colIndex) in row"
          style="display: flex; height: 25px; background-color: #e4e4e4"
        >
          <el-input
            v-model.number="
              sectionData[mainFactors[currentFactor]].matrix[rowIndex][colIndex]
            "
            type="number"
            :min="0"
            :max="1"
            :step="1"
            class="num-input"
          />
          <!--v-model不可以直接修改v-for循环迭代时别名上的数据, 可用索引绑定-->
        </div>
      </div>
    </div>
    <el-row justify="center" style="margin: 20px 0">
      <el-button type="success" @click="reCalc()">重新计算</el-button>
      <el-button @click="reset()">重置参数</el-button>
      <el-button type="danger" @click="saveConfig()">保存配置</el-button>
    </el-row>
    <el-divider />
    <el-row class="bold-text">计算结果：</el-row>
    <el-main>
      <el-row>
        <el-col :span="12" class="cell-level" :style="cellColor(0)">稳定概率</el-col>
        <el-col :span="12" class="cell-level" :style="cellColor(1)">较稳定概率</el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="cell-p" :style="cellColor2(0)">{{
          stability[0]
        }}</el-col>
        <el-col :span="12" class="cell-p" :style="cellColor2(1)">{{
          stability[1]
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="cell-level" :style="cellColor(2)">较不稳定概率</el-col>
        <el-col :span="12" class="cell-level" :style="cellColor(3)">不稳定概率</el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="cell-p" :style="cellColor2(2)">{{
          stability[2]
        }}</el-col>
        <el-col :span="12" class="cell-p" :style="cellColor2(3)">{{
          stability[3]
        }}</el-col>
      </el-row>
    </el-main>
    <el-row style="align-items: center">
      <el-col :span="16" class="bold-text">预警等级：</el-col>
      <el-col :span="2"
        ><span
          class="circle"
          :style="{ color: statusColors[store.statuses[props.sectionName]] }"
          >●</span
        ></el-col
      >
      <el-col :span="6" style="text-align: start" class="bold-text">
        {{ riskLevels[store.statuses[props.sectionName]] }}
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch, computed } from "vue";

export default defineComponent({
  name: "calculation",
  components: {},
});
</script>

<script setup>
import { useStore, nameStore } from "@/stores/index.js";
const store = useStore();
const namestore = nameStore();

const props = defineProps({
  sectionName: {
    type: String,
  },
});

const sectionData = ref(store.configData[props.sectionName]); //如何解除sectionData与仓库的绑定？

const cellColor = computed(() => {
  return function (index) {
    let style =
      index === store.statuses[props.sectionName]
        ? { "background-color": "#F4C367", color: "#14192A" }
        : { "background-color": "#121C3D", color: "#D8E0FA" };
    return style;
  };
});

const cellColor2 = computed(() => {
  return function (index) {
    let style =
      index === store.statuses[props.sectionName]
        ? { "background-color": "#C4C4C4", color: "#5B6270" }
        : { "background-color": "#DDE6F9", color: "#5B6270" };
    return style;
  };
});

const currentFactor = ref(0); //当前主因子
const stability = ref(store.results[props.sectionName]);

const riskLevels = ["IV级风险", "Ⅲ级风险", "Ⅱ级风险", "Ⅰ级风险"];
const statusColors = ["#0081D1", "#15C900", "#F18614", "#ED3324"];
//const status = ref(3); //稳定

const mainFactors = ["水流动力因子", "河床演变因子", "岸坡特征因子", "人类活动因子"];
const subfactors = [
  ["造床流量当量", "流速指标", "水位变幅", "河道二次流"],
  ["滩槽高差", "深泓离岸相对距离", "近岸冲刷", "汊道分流比"],
  ["岸坡坡比/抗滑稳定性", "土体组成", "沉降位移", "渗流坡降"],
  ["岸坡防护方量", "近岸采沙", "突加荷载"],
];

//计算各状态概率
function reCalc() {
  store.calc(props.sectionName);
  stability.value = store.results[props.sectionName];
  //evaluate();
}

function reset() {
  //store.configData[namestore.currentName].$reset;
}

function saveConfig() {
  //store.configData[store.currentName] = sectionData;
}

onMounted(() => {
  /*
  const provideData = inject("provideData");
  const configData = provideData().configData;
  console.log(configData);*/
  //calc();
});
</script>

<style scoped>
.el-row {
  color: #C0D0FF;
}

.el-col {
  color: #C0D0FF;
}

.calculation {
  border-top: 1px solid #6b6b6b;
  padding: 10px;
}

.bold-text {
  padding: 5px 0;
  font-family: 思源黑体Bold;
  font-size: 14px;
  color: #C0D0FF;
}

.el-divider {
  border-color: rgb(150, 150, 150);
  margin: 15px 0;
}

.num-input {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #808080;
  --el-input-bg-color: #DDE6F9;
  --el-input-border-color: transparent;
}

.cell-level {
  display: flex;
  height: 25px;
  /* background-color: #606060;
  color: #fff; */
  justify-content: center;
  align-items: center;
  border: 1px solid #6b6b6b;
}

.cell-p {
  display: flex;
  height: 25px;
  /* background-color: #e4e4e4; */
  justify-content: center;
  align-items: center;
  border: 1px solid #6b6b6b;
}

.circle {
  font-size: 22px;
}
</style>
