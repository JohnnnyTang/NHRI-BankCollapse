<template>
    <div class="tide-chart-container" v-if="ifShow" :style="{ width: chartWidth + 'px', height: chartHeight + 'px' }">
        <div class="stat-board" v-if="chartWidth < 240">
            <div class="stat-time">最大位移量</div>
            <div class="stat-content">
                <div class="up-stream stat-box single">
                    <p>{{ maxMove.toFixed(2) }}</p>
                </div>
            </div>
        </div>
        <div class="echart-container" v-show="chartShown" ref="chartDom"
            :style="{ width: chartWidth + 'px', height: chartHeight + 'px' }">无数据</div>
        <div class="log-button" v-show="chartShown">
            <div class="log-button-text" @click="generateDataLog">统计报表</div>
        </div>
    </div>
</template>
  
  
<script setup>
import { onMounted, toRef, ref } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

const getGnssData = async () => {
    const res = await axios.get('http://localhost:8181/gnss');
    // console.log(res.data.data)
    return res.data.data;
}

const getGnssStat = async () => {
    const res = await axios.get('http://localhost:8181/gnss/statistic');
    return res.data.data;
}

const maxMove = ref(0);


const props = defineProps([
    "show",
    "chartWidth",
    "chartHeight"
]);
console.log("props", props)

const ifShow = toRef(props, 'show')
// console.log('chart props', props);
const chartWidth = toRef(props, 'chartWidth');
const chartHeight = toRef(props, 'chartHeight');
const chartDom = ref();

let logText = "金河口GNSS监测数据统计报表\n";
// console.log(logText)

const buildGnssChartOption = (gnssData) => {
    const seriesData = gnssData["time"].map((e, i) => {
        return [Date.parse(e), gnssData["value"][i]];
    })
    console.log(seriesData);
    return {
        // color: ['#91ca8c', '#f49f42', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#dd6b66', '#8dc1a9', '#759aa0', '#e69d87', '#ea7e53'],
        color: ['#F29325', '#F29F05', '#5AC9B5'],
        animation: false,
        // visualMap: visualMaps,
        dataZoom: {
            type: 'inside'
        },
        legend: {
            show: true,
            orient: 'horizontal',
            left: 'center',
            top: '2%',
            height: '12%',
            itemGap: 0,
            // itemWidth: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            padding: 10,
            textStyle: {
                fontWeight: 'bold',
                color: 'rgba(0, 29, 91, 0.75)'
            },
            lineStyle: {
                width: 4
            }
        },
        tooltip: { show: true, trigger: 'axis' },
        xAxis: {
            type: 'time',
            // name: '起点距(米)',
            nameTextStyle: {
                color: 'rgba(255,255,255, 0.7)',
                fontSize: 14,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 29, 91, 0.75)'
                },
                onZero: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                fontSize: 12,
                fontWeight: 'bold',
                color: 'rgba(0, 29, 91, 0.9)',
                formatter: '{dd}日{HH}时'
            },
            minInterval: 3600 * 1000 * 12,
            // min: (value) => {
            //     return value.min
            // },
            // max: (value) => {
            //     return value.max
            // },
            boundaryGap: ['5%', '5%']
        },
        yAxis: {
            type: 'value',
            name: 'mm',
            nameTextStyle: {
                color: 'rgba(0, 29, 91, 0.75)',
                fontSize: 15,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 29, 91, 0.75)'
                },
                onZero: false
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 29, 91, 0.15)',
                    width: 1.5
                }
            },
            axisLabel: {
                fontSize: 14,
                fontWeight: 'bold',
                color: 'rgba(0, 29, 91, 0.9)'
            },
            min: (value) => {
                // return (value.min/1.2).toFixed(4)
                return 0;
            },
            max: (value) => {
                return (value.max).toFixed(4)
            },
        },
        grid: {
            top: '12%',
            bottom: '2%',
            left: '2%',
            right: '2%',
            containLabel: true
        },
        series: {
            name: "GNSS位移",
            symbolSize: 2,
            data: seriesData,
            type: 'line',
            emphasis: {
                focus: 'series'
            },
            lineStyle: {
                width: 3,
            },
        }
    }
}

const generateDataLog = () => {
    const strData = new Blob([logText], { type: 'text/plain;charset=utf-8' });
    saveAs(strData, 'dataLog.txt');
}

let chartOption = null;

let chartShown = ref(false);
let chartInited = false;
let echart = null;
// TODO: emit
const toggleChartStatus = () => {
    // console.log("toggle chart", props.stationName);
    if (chartShown.value) {
        // console.log("dispose", echart);
        // echart.dispose();
        // chartInited = false;
        chartShown.value = false;
    }
    else {
        // console.log("init");
        // chartInited = true;
        chartShown.value = true;
        // console.log("print chart dom");
        // console.log(chartDom.value.clientWidth, chartDom.value.clientHeight);
        if (chartOption) {
            echart = echarts.init(chartDom.value);
            // console.log("print chart dom after");
            // console.log(chartDom.value.clientWidth, chartDom.value.clientHeight);
            // console.log(props.stationName, chartOption);
            echart.setOption(chartOption);
        }
    }
}

const resizeEchart = () => {
    if (echart) {
        echart.resize({ width: chartWidth.value, height: chartHeight.value })
    }
}

defineExpose({
    toggleChartStatus, resizeEchart
})


onMounted(async () => {
    const gnssData = await getGnssData();
    const gnssStat = await getGnssStat();
    maxMove.value = gnssStat["max"];

    chartOption = buildGnssChartOption(gnssData);

    logText += ("监测时间："+gnssData["time"][0] + "——" + gnssData["time"][gnssData["time"].length - 1] + "\n");
    logText += ("最大位移值：" + gnssStat["max"] + ", 最小位移值：" + gnssStat["min"] + "\n");
    // console.log(gnssData["time"].length, gnssData["value"].length)
    for (let i = 0; i < gnssData["time"].length; i++) {
        logText += (gnssData["time"][i] + ", 位移值：" + gnssData["value"][i] + "\n");
    }
    // console.log(logText);
})

</script>
  
<style lang='scss' scoped>
$orders: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10;

div.tide-chart-container {
    //    background-color: transparent;
    z-index: 100;
    color: black;

    div.stat-board {
        background-color: rgba(177, 255, 255, 0.6);
        width: 100%;
        height: 100%;

        div.stat-time {
            background-color: rgba(255, 224, 177, 0.6);
            text-align: center;
            font-size: calc(0.4vw + 0.3vh);
            font-weight: 600;
            height: 35%;
        }

        div.stat-content {
            height: 65%;
            display: flex;
            flex-flow: row;

            div.stat-box {
                flex: 1;
                text-align: center;
                font-size: calc(0.5vw + 0.5vh);
                //    font-weight: 600;
                font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
                line-height: 100%;
                vertical-align: middle;
                display: flex;
                align-items: center;
                justify-content: center;

                &.single {
                    font-size: calc(0.75vw + 0.75vh);
                }

                &.up-stream {
                    background-color: rgb(197, 95, 27);
                    color: rgb(234, 252, 255);
                }

                &.down-stream {
                    background-color: rgb(73, 202, 231);
                    color: rgb(0, 13, 42);
                }
            }

        }
    }

    div.echart-container {
        // background-color: brown;
        width: 100%;
        height: 100%;
    }

    div.log-button {
        position: absolute;
        top: 2%;
        right: 5%;
        width: 14%;
        height: 8%;
        text-align: center;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgb(211, 232, 251);

        border-radius: 6px;
        transition: all 0.3s ease-in-out;

        &:hover {
            cursor: pointer;
            width: 13%;
            height: 7.5%;
            transition: all 0.3s ease-in-out;
        }

        div.log-button-text {
            font-weight: 600;

            &:hover {
                color: rgb(37, 59, 107);
            }
        }
    }
}
</style>