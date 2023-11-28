<template>
  <div class="calculation">
    <el-row class="bold-text"> 岸坡崩塌概率计算</el-row>
    <el-row style="margin: 2vh 0">
      <el-col :span="12" class="text"> 选择配置方案： </el-col>
      <el-col :span="12">
        <el-select
          ref="selectRef"
          v-model="store.schemes[props.sectionName]"
          @change="changeScheme"
          placeholder="Select"
        >
          <el-option
            v-for="(value, key, index) in store.configData[props.sectionName]"
            :key="key"
            :label="key"
            :value="key"
          />
          <template #footer>
            <el-row style="color: #444444; margin: 1.2vh 0.6vw">添加配置方案:</el-row>
            <el-row style="color: #444444; margin: 1.5vh 0.6vw"
              ><el-input v-model="schemeName" placeholder="输入方案名称"
            /></el-row>
            <el-row style="color: #444444; margin: 1.5vh 0.6vw">
              <el-upload
                ref="uploadRef"
                action
                accept=".json"
                :auto-upload="false"
                :on-change="upload"
              >
                <el-button size="small" style="width: 100%">导入JSON文件</el-button>
              </el-upload>
            </el-row>
            <el-row justify="center">
              <el-button type="primary" @click="addScheme">确认添加</el-button>
            </el-row>
          </template>
        </el-select>
      </el-col>
    </el-row>
    <el-divider />
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
          v-model="schemeData.weight[currentFactor]"
          :precision="2"
          :step="0.1"
          :max="1"
          :min="0"
        />
      </el-col>
    </el-row>
    <el-row class="text"> 各次因子权重： </el-row>
    <div style="margin: 1vh 0.3vw; padding: 1vh 0.3vw" class="box-overlay">
      <el-row v-for="(item, index) in schemeData[mainFactors[currentFactor]].weight">
        <el-col :span="12" class="text">
          {{ subfactors[currentFactor][index] }}：
        </el-col>
        <el-col :span="12">
          <el-input-number
            v-model="schemeData[mainFactors[currentFactor]].weight[index]"
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
        v-for="(row, rowIndex) in schemeData[mainFactors[currentFactor]].matrix"
        style="display: flex; height: 4.5vh"
      >
        <div
          v-for="(cell, colIndex) in row"
          style="display: flex; height: 4.5vh; background-color: #e4e4e4"
        >
          <el-input
            v-model.number="
              schemeData[mainFactors[currentFactor]].matrix[rowIndex][colIndex]
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
    <el-row align="middle">
      <el-col :span="17" class="bold-text"> 崩塌概率计算结果： </el-col>
      <el-col :span="7">
        <el-button class="btn-export" @click="exportResult">
          <el-icon :size="15"><Download /></el-icon>
          导出
        </el-button>
      </el-col>
    </el-row>
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
import { saveAs } from "file-saver";
import { Download } from "@element-plus/icons-vue";

const store = useStore();

const props = defineProps({
  sectionName: {
    type: String,
  },
});

//const sectionData = ref(store.configData[props.sectionName]); //如何解除sectionData与仓库的绑定？
const bankData = ref(store.configData[props.sectionName]);

const schemeData = ref(bankData.value[store.schemes[props.sectionName]]); //为什么改变schemes没有响应?

function changeScheme(e) {
  schemeData.value = bankData.value[store.schemes[props.sectionName]]; //重新赋值
}

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
    let scheme = store.schemes[props.sectionName];
    store.configData[props.sectionName][scheme] = data[props.sectionName][scheme];
    schemeData.value = store.configData[props.sectionName][scheme];
  });
}

function saveConfig() {
  axios.get("http://localhost:8181/matrix", { responseType: "json" }).then((res) => {
    const data = res.data.data;
    data[props.sectionName][store.schemes[props.sectionName]] = schemeData.value;
    axios
      .post("http://localhost:8181/matrix", data)
      .then(function (response) {
        console.log("Saved");
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

//方案添加相关逻辑
const jsonFile = ref(null);
const schemeName = ref("");
const uploadRef = ref();
const selectRef = ref();

function upload(file, fileList) {
  jsonFile.value = file;
}

// 解析JSON文件
function addScheme() {
  if (schemeName.value == "" || jsonFile.value == null) return;
  let reader = new FileReader(); //新建一个FileReader
  reader.readAsText(jsonFile.value.raw, "UTF-8"); //读取文件
  reader.onload = (evt) => {
    //读取文件完毕执行此函数
    const jsonData = JSON.parse(evt.target.result);
    axios.post("http://localhost:8181/matrixCalc", jsonData).then((res) => {
      const newScheme = res.data.data;
      //将新方案存入后端
      axios.get("http://localhost:8181/matrix", { responseType: "json" }).then((res) => {
        const data = res.data.data;
        data[props.sectionName][schemeName.value] = newScheme;

        axios
          .post("http://localhost:8181/matrix", data)
          .then(function (response) {
            store.configData[props.sectionName][schemeName.value] = newScheme;
            store.schemes[props.sectionName] = schemeName.value;
            schemeData.value = bankData.value[schemeName.value]; //重新赋值
            schemeName.value = "";
            jsonFile.value = null;
            uploadRef.value.clearFiles();

            console.log("Successfully added!");
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    });
  };
}

//导出结果
function exportResult() {
  const fileName = props.sectionName + "-计算结果.csv";
  //let tableData = store.results[props.sectionName].unshift(props.sectionName);
  let data = [["岸段名称", "稳定概率", "较稳定概率", "较不稳定概率", "不稳定概率"]];
  let content = [props.sectionName].concat(store.results[props.sectionName]);
  data.push(content);

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

.btn-export {
  height: 4.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 0;
  color: #7e8988;
  font-size: calc(0.7vw + 0.7vh);
}
</style>
