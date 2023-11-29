<template>
  <el-container class="right-bottom-box map-overlay">
    <el-main>
      <div v-show="store.currentType == 'bank'"><bankInfo /></div>
      <div
        v-show="store.currentType == 'device'"
        ref="chartDom"
        style="position: relative; width: 100%; height: 100%"
      ></div>
      <div v-show="store.currentType == 'empty'" class="no-data">无数据</div>
    </el-main>
  </el-container>
</template>

<script>
import bankInfo from "@/components/bankInfo.vue";
import { defineComponent, onMounted, ref, onUpdated, watch, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import randomData from "@/utils/random.js";

export default defineComponent({
  name: "rightBottomBox",
  components: {
    bankInfo,
  },
});
</script>

<script setup>
import { useStore } from "@/stores/index.js";
import axios from "axios";

const store = useStore();

let positionData = {};

let option = {
  title: {
    textStyle: { fontSize: 14, color: "#C0D0FF" },
    x: "center",
    y: "3px",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    textStyle: { color: "#C0D0FF" },
    //orient: 'vertical',
    top: 25,
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: [
      "11/24 0时",
      "11/24 1时",
      "11/24 2时",
      "11/24 3时",
      "11/24 4时",
      "11/24 5时",
      "11/24 6时",
      "11/24 7时",
      "11/24 8时",
      "11/24 9时",
      "11/24 10时",
      "11/24 11时",
      "11/24 12时",
      "11/24 13时",
      "11/24 14时",
      "11/24 15时",
      "11/24 16时",
      "11/24 17时",
      "11/24 18时",
      "11/24 19时",
      "11/24 20时",
      "11/24 21时",
      "11/24 22时",
      "11/24 23时",
      "11/25 0时",
      "11/25 1时",
      "11/25 2时",
      "11/25 3时",
      "11/25 4时",
      "11/25 5时",
      "11/25 6时",
      "11/25 7时",
      "11/25 8时",
      "11/25 9时",
      "11/25 10时",
      "11/25 11时",
      "11/25 12时",
      "11/25 13时",
      "11/25 14时",
      "11/25 15时",
      "11/25 16时",
      "11/25 17时",
      "11/25 18时",
      "11/25 19时",
      "11/25 20时",
      "11/25 21时",
      "11/25 22时",
      "11/25 23时",
    ],
    axisLabel: {
      interval: 7,
      textStyle: { fontSize: 8, color: "#C0D0FF" },
    },
  },
  yAxis: {
    type: "value",
    nameTextStyle: {
      //y轴上方单位的颜色
      color: "#C0D0FF",
    },
    axisLabel: {
      formatter: function (value) {
        // 如果值为正数，就在前面加上+号
        if (value > 0) {
          return "+" + value;
        }
        // 否则，直接返回原值
        else {
          return value;
        }
      },
      textStyle: { color: "#C0D0FF" },
    },
  },
  series: [
    {
      name: "x方向",
      type: "line",
      stack: "Total",
      showSymbol: false,
    },
    {
      name: "y方向",
      type: "line",
      stack: "Total",
      showSymbol: false,
    },
  ],
};

const chartDom = ref();

let chart = ref(null);

let units = { GNSS: "mm", 压力计: "Kpa", 应变桩: "Mpa" };

watch(
  () => store.currentName,
  (newValue, oldValue) => {
    if (store.currentType == "device") {
      // chartDom.value.style.height = chartDom.value.parentNode.clientHeight + "px";
      // chartDom.value.style.width = chartDom.value.parentNode.clientWidth + "px";
      option.title.text = newValue + "—48小时变化情况";
      if (positionData[newValue].type === "GNSS") {
        option.series = [
          {
            name: "x方向",
            type: "line",
            stack: "Total",
            showSymbol: false,
            data: positionData[newValue].xPos,
          },
          {
            name: "y方向",
            type: "line",
            stack: "Total",
            showSymbol: false,
            data: positionData[newValue].yPos,
          },
        ];
        option.legend.data = ["x方向", "y方向"];
      } else {
        option.series = [{}];
        option.series = [
          {
            type: "line",
            stack: "Total",
            showSymbol: false,
            data: positionData[newValue].value,
          },
        ];
        option.legend.data = [];
      }
      option.yAxis.name = units[positionData[newValue].type];
      chart.setOption(option, true);
    }
  }
);

onMounted(() => {
  chartDom.value.style.height = chartDom.value.parentNode.clientHeight + "px";
  chartDom.value.style.width = chartDom.value.parentNode.clientWidth + "px";

  axios.get("http://localhost:8181/monitor", { responseType: "json" }).then((res) => {
    let data = res.data.data;
    for (var key in data.features) {
      let feature = data.features[key];
      let name = feature.properties.name;

      positionData[name] = {};
      positionData[name].type = feature.properties.type;

      if (positionData[name].type === "GNSS") {
        positionData[name].xPos = randomData(48, 0.5);
        positionData[name].yPos = randomData(48, 0.5);
      } else {
        positionData[name].value = randomData(48, 0.02);
      }
    }
  });

  chart = echarts.init(chartDom.value);
  chart.setOption(option);
});

onBeforeUnmount(() => {
  chart.dispose();
});
</script>

<style scoped>
.el-main {
  padding: 0px;
  margin: 0.5vh 0.2vw;
}

.right-bottom-box {
  position: absolute;
  top: 57vh;
  width: 26vw;
  right: 1vw;
  height: 35vh;
  z-index: 3;
}

.no-data {
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  font-size: 20px;
  font-family: 思源黑体R;
}
</style>
