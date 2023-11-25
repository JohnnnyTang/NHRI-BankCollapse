<template>
  <el-container class="right-bottom-box map-overlay">
    <el-main>
        <div v-if="store.currentName != ''"><bankInfo /></div>
        <div
          v-show="store.currentDevice != ''"
          ref="chartDom"
          style="width: 100%; height: 100%"
        ></div>
        <div
          v-show="store.currentName == '' && store.currentDevice == ''"
          class="no-data"
        >
          无数据
        </div>
    </el-main>
  </el-container>
</template>

<script>
import bankInfo from "@/components/bankInfo.vue";
import { defineComponent, onMounted, ref, onUpdated, watch } from "vue";
import * as echarts from "echarts";

export default defineComponent({
  name: "rightBottomBox",
  components: {
    bankInfo,
  },
});
</script>

<script setup>
import { useStore } from "@/stores/index.js";
const store = useStore();

let positionData = {
  GNSS测量站1: {
    xPos: [
      0.291,
      0.455,
      0.694,
      1.085,
      1.21,
      0.654,
      0.871,
      -0.248,
      -0.567,
      -0.257,
      -0.345,
      -0.09,
      -0.029,
      -0.269,
      -0.439,
      -0.267,
      -0.273,
      -0.143,
      -1.025,
      -0.653,
      -0.21,
      -0.065,
      -0.017,
      0.046,
      0.045,
      -1.165,
      -1.988,
      -1.834,
      -2.165,
      -3.051,
      -2.978,
      -2.6,
      -2.978,
      -3.17,
      -3.15,
      -2.516,
      -2.146,
      -2.215,
      -2.659,
      -2.247,
      -2.294,
      -1.266,
      -1.155,
      -1.39,
      -1.516,
      -1.004,
      -1.14,
      -1.248,
    ],
    yPos: [
      0.531,
      0.716,
      1.029,
      0.825,
      1.007,
      0.521,
      0.594,
      0.663,
      1.113,
      0.968,
      0.94,
      1.591,
      1.556,
      2.039,
      1.905,
      1.467,
      1.086,
      1.348,
      1.912,
      2.131,
      2.061,
      1.784,
      2.13,
      1.621,
      1.4,
      1.29,
      1.425,
      1.628,
      2.413,
      1.962,
      2.768,
      2.762,
      2.833,
      3.077,
      2.75,
      2.683,
      2.409,
      1.938,
      2.704,
      2.582,
      4.074,
      4.034,
      3.54,
      3.533,
      2.873,
      2.235,
      2.071,
      1.654,
    ],
  },
  GNSS基准站1: {
    xPos: [
      2.591,
      2.247,
      2.855,
      2.84,
      2.564,
      2.162,
      2.328,
      2.325,
      2.343,
      2.575,
      3.225,
      3.271,
      2.275,
      2.094,
      2.598,
      2.206,
      1.522,
      1.587,
      2.03,
      1.402,
      1.407,
      1.309,
      1.017,
      1.636,
      2.023,
      2.213,
      1.798,
      2.311,
      2.457,
      1.705,
      1.692,
      1.595,
      3.127,
      3.108,
      2.599,
      3.357,
      3.389,
      3.006,
      3.428,
      3.424,
      2.67,
      3.333,
      3.577,
      3.136,
      3.355,
      3.204,
      3.663,
      3.009,
    ],
    yPos: [
      0.292,
      0.436,
      -0.281,
      -0.329,
      -0.055,
      -0.291,
      -0.104,
      0.245,
      0.293,
      0.826,
      0.865,
      1.27,
      1.34,
      0.595,
      0.935,
      1.178,
      1.104,
      0.738,
      0.688,
      0.25,
      0.724,
      1.149,
      2.104,
      2.052,
      2.784,
      2.634,
      1.743,
      1.657,
      1.806,
      2.316,
      2.508,
      2.157,
      1.712,
      1.717,
      1.7,
      1.356,
      1.305,
      1.681,
      2.1,
      1.432,
      1.405,
      1.878,
      1.853,
      1.811,
      2.375,
      2.109,
      2.075,
      1.969,
    ],
  },
  孔隙水压力和测斜管1: {
    xPos: [
      0.247,
      0.296,
      0.326,
      -0.372,
      -0.428,
      -0.691,
      -0.7,
      -0.087,
      -0.337,
      -0.327,
      -0.162,
      -0.516,
      -0.448,
      -0.501,
      0.191,
      -1.929,
      -1.743,
      -1.811,
      -2.001,
      -2.342,
      -2.244,
      -2.518,
      -2.573,
      -2.565,
      -2.584,
      -2.37,
      -1.683,
      -1.746,
      -1.904,
      -1.875,
      -2.028,
      -2.367,
      -2.17,
      -2.032,
      -2.007,
      -1.874,
      -1.193,
      -0.676,
      -0.645,
      -0.848,
      -1.107,
      -1.506,
      -1.423,
      -1.253,
      -1.131,
      -1.219,
      -1.996,
      -2.253,
    ],
    yPos: [
      0.681,
      0.795,
      0.619,
      0.592,
      0.467,
      0.56,
      1.221,
      2.233,
      2.167,
      2.085,
      2.194,
      2.22,
      2.267,
      1.855,
      0.43,
      -0.112,
      -0.502,
      -1.236,
      -1.439,
      -1.62,
      -1.82,
      -1.738,
      -1.513,
      -0.889,
      -0.923,
      -0.781,
      -0.806,
      -0.996,
      -1.027,
      -1.26,
      -2.239,
      -1.96,
      -2.316,
      -2.243,
      -3.075,
      -2.853,
      -2.765,
      -2.742,
      -3.362,
      -3.317,
      -2.364,
      -2.684,
      -2.921,
      -3.703,
      -4.082,
      -3.988,
      -3.908,
      -3.825,
    ],
  },
  应变桩1: {
    xPos: [
      0.201,
      0.026,
      -0.124,
      -0.119,
      -0.457,
      -0.796,
      -0.569,
      -0.292,
      -0.046,
      0.045,
      0.652,
      1.027,
      0.895,
      1.076,
      1.844,
      2.344,
      1.755,
      2.073,
      1.815,
      2.532,
      2.186,
      1.878,
      1.824,
      1.917,
      2.231,
      2.225,
      1.409,
      2.07,
      2.142,
      2.165,
      2.076,
      2.008,
      2.058,
      1.164,
      0.956,
      1.023,
      1.13,
      1.202,
      0.607,
      0.26,
      0.244,
      0.182,
      0.176,
      -0.428,
      -0.413,
      -0.347,
      -0.283,
      -0.63,
    ],
    yPos: [
      0.463,
      0.627,
      0.702,
      0.343,
      0.679,
      0.676,
      0.875,
      0.233,
      0.111,
      0.098,
      -0.513,
      -0.571,
      -0.705,
      -0.71,
      -2.09,
      -1.602,
      -1.126,
      -1.202,
      -1.694,
      -1.927,
      -2.008,
      -2.688,
      -2.252,
      -2.397,
      -1.832,
      -1.733,
      -2.329,
      -2.108,
      -1.3,
      -1.481,
      -1.985,
      -2.304,
      -2.32,
      -2.308,
      -2.649,
      -2.516,
      -2.478,
      -2.945,
      -2.67,
      -2.421,
      -2.234,
      -2.603,
      -1.985,
      -2.198,
      -1.535,
      -0.979,
      -0.886,
      -0.365,
    ],
  },
};

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
    data: ["x方向", "y方向"],
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

watch(
  () => store.currentDevice,
  (newValue, oldValue) => {
    if (newValue) {
      // chartDom.value.style.height = chartDom.value.parentNode.clientHeight + "px";
      // chartDom.value.style.width = chartDom.value.parentNode.clientWidth + "px";
      option.title.text = newValue + "—48小时点位变化情况";
      option.series[0].data = positionData[newValue].xPos;
      option.series[1].data = positionData[newValue].yPos;
      chart.setOption(option);
    }
  }
);

onMounted(() => {
  chartDom.value.style.height = chartDom.value.parentNode.clientHeight + "px";
  chartDom.value.style.width = chartDom.value.parentNode.clientWidth + "px";

  chart = echarts.init(chartDom.value);
  chart.setOption(option);
});
</script>

<style scoped>
.el-main {
  padding: 0px;
  margin: 5px;
}

.right-bottom-box {
  position: absolute;
  top: 60%;
  width: 26%;
  right: 1%;
  height: 38%;
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
