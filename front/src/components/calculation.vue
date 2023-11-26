<template>
  <div class="calculation">
    <el-row class="bold-text">岸坡崩塌概率计算</el-row>
    <el-row>
      <el-col :span="12" class="text"> 选择主因子： </el-col>
      <el-col :span="12" class="text">
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
      <el-col :span="12" class="text"> 主因子权重： </el-col>
      <el-col :span="12" class="text">
        <el-input-number
          v-model="sectionData.weight[currentFactor]"
          :precision="2"
          :step="0.1"
          :max="1"
          :min="0"
        />
      </el-col>
    </el-row>
    <el-row class="text"> 各次因子权重： </el-row>
    <div style="margin: 1vh 0.3vw; padding: 1vh 0.3vw" class="box-overlay">
      <el-row v-for="(item, index) in sectionData[mainFactors[currentFactor]].weight">
        <el-col :span="12" class="text">
          {{ subfactors[currentFactor][index] }}：
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
    <el-row class="text" style="margin: 2vh 0"> 指标权重判断矩阵： </el-row>
    <div style="padding: 1vh 1vw">
      <div
        v-for="(row, rowIndex) in sectionData[mainFactors[currentFactor]].matrix"
        style="display: flex; height: 4.5vh"
      >
        <div
          v-for="(cell, colIndex) in row"
          style="display: flex; height: 4.5vh; background-color: #e4e4e4"
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
    <el-row justify="center" style="margin: 4vh 0">
      <el-button class="btn" type="success" @click="reCalc()">重新计算</el-button>
      <el-button class="btn" @click="reset()">重置参数</el-button>
      <el-button class="btn" type="danger" @click="saveConfig()">保存配置</el-button>
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
import { useStore } from "@/stores/index.js";
import axios from "axios";

const store = useStore();

const props = defineProps({
  sectionName: {
    type: String,
  },
});

//const sectionData = ref(store.configData[props.sectionName]); //如何解除sectionData与仓库的绑定？
const sectionData = ref(store.configData[props.sectionName]);

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

const mainFactors = ["水动力因子", "河床演变因子", "岸坡特征因子", "人类活动因子"];
const subfactors = [
  ["造床流量当量", "流速指标", "水位变幅", "河道二次流"],
  ["滩槽高差", "深泓离岸相对距离", "近岸冲刷", "分流比变化"],
  ["抗滑稳定性", "土体组成", "沉降位移", "渗流坡降"],
  ["岸坡防护方量", "近岸采沙", "突加荷载"],
];

//计算各状态概率
function reCalc() {
  store.calc(props.sectionName);
  stability.value = store.results[props.sectionName];
  //evaluate();
}

function reset() {
  axios.get("http://localhost:8181/matrix", { responseType: "json" }).then((res) => {
    const data = res.data.data;
    store.configData[props.sectionName] = data[props.sectionName];
    sectionData.value = store.configData[props.sectionName]
  });
}

function saveConfig() {
  axios.get("http://localhost:8181/matrix", { responseType: "json" }).then((res) => {
    const data = res.data.data;
    data[props.sectionName] = sectionData.value;
    axios
      .post("http://localhost:8181/matrix", data)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

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
.text {
  margin: 0.5vh 0;
  font-size: calc(0.65vw + 0.65vh);
}

.el-row {
  color: #c0d0ff;
}

.el-col {
  color: #c0d0ff;
}

.calculation {
  border-top: 1px solid #6b6b6b;
  padding: 1vh 1vw;
}

.bold-text {
  padding: 1vh 0;
  font-family: 思源黑体Bold;
  font-size: calc(0.7vw + 0.7vh);
  color: #c0d0ff;
}

.el-divider {
  border-color: rgb(150, 150, 150);
  margin: 2vh 0;
}

.num-input {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #808080;
  --el-input-bg-color: #dde6f9;
  --el-input-border-color: transparent;
}

.cell-level {
  display: flex;
  height: 4vh;
  /* background-color: #606060;
  color: #fff; */
  justify-content: center;
  align-items: center;
  border: 1px solid #6b6b6b;
  margin: 0;
  font-size: calc(0.65vw + 0.65vh);
}

.cell-p {
  display: flex;
  height: 4vh;
  /* background-color: #e4e4e4; */
  justify-content: center;
  align-items: center;
  border: 1px solid #6b6b6b;
  margin: 0;
  font-size: calc(0.65vw + 0.65vh);
}

.btn {
  width: 5vw;
  height: 4vh;
  font-size: calc(0.6vw + 0.6vh);
}

.circle {
  font-size: calc(1.2vw + 1.2vh);
}
</style>
