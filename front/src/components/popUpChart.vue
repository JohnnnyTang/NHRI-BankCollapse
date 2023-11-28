<template>
    <div class="tide-chart-container" v-if="ifShow" :style="{ width: chartWidth + 'px', height: chartHeight + 'px' }">
        <div class="stat-board" v-if="chartWidth < 240">
            <div class="stat-time">{{ curTimeStrRef }}</div>
            <div class="stat-content">
                <div class="up-stream stat-box" :class="{ 'single': hasUpStreamData && (!hasDownStreamData) }"
                    v-if="hasUpStreamData">
                    <p>{{ upStreamData }}</p>
                </div>
                <div class="down-stream stat-box" :class="{ 'single': hasDownStreamData && (!hasUpStreamData) }"
                    v-if="hasDownStreamData">
                    <p>{{ downStreamData }}</p>
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


const getWaterLevelByStationAndTime = async (stationType, stationName, ysdTime, curTime) => {
    console.log(`http://localhost:8181/waterLevel/${stationType}/${stationName}/${ysdTime}/${curTime}`)
    const res = await axios.get(`http://localhost:8181/waterLevel/${stationType}/${stationName}/${ysdTime}/${curTime}`);
    return res.data;
}

// interface Props {
//     stationName: string,
//     stationType: string,
//     show: Ref<boolean>,
//     curTimeStr: string,
//     ysdTimeStr: string,
//     chartWidth: Ref<number>,
//     chartHeight: Ref<number>
// }

const props = defineProps([
    "stationName",
    "stationType",
    "show",
    "curTime",
    "ysdTime",
    "chartWidth",
    "chartHeight"
]);
console.log("props", props)

const ifShow = toRef(props, 'show')
// console.log('chart props', props);
const chartWidth = toRef(props, 'chartWidth');
const chartHeight = toRef(props, 'chartHeight');

const hasUpStreamData = ref(false);
const hasDownStreamData = ref(false);

const upStreamData = ref(7.83);
const downStreamData = ref(2.83);

const chartDom = ref();

const curTime = new Date();
let curTimeStrRef = ref(curTime.getHours() + ':' + curTime.getMinutes());

// type StringKeyNumArray = {
//     [key: string]: number[][]
// }

// type SeriesMinMax = {
//     [key: string]: [number, number]
// }
const nameMap = {
    'upstreamWaterLevel': '上游水位',
    'downstreamWaterLevel': '下游水位',
    'waterLevel': '水位'
}
let logText = props.stationName + "水位监测数据统计报表\n";
logText += (props.ysdTime + "——" + props.curTime + "\n");
// console.log(logText)
const visualMapColors = [['#6F04D9', '#05C7F2'], ['#F24638', '#F3A950']]
const buildData2ChartOption = (reqData, dataKeys) => {
    console.log("buildData2ChartOption", reqData)
    const dataSeries = [];
    const seriesData = {};
    let minMax = {};
    for (let dataKey of dataKeys) {
        seriesData[dataKey] = [];
        minMax[dataKey] = [reqData[0][dataKey], reqData[0][dataKey]]
    }
    let logDataText = "监测数据：\n";
    for (let dataItem of reqData) {
        logDataText += (dataItem["time"] + ", ");
        const dataTime = Date.parse(dataItem["time"].replace(' ', 'T'))
        for (let dataKey of dataKeys) {
            logDataText += (nameMap[dataKey] + ": " + dataItem[dataKey] + ", ");
            seriesData[dataKey].push([dataTime, dataItem[dataKey]]);
            minMax[dataKey][0] = minMax[dataKey][0] <= dataItem[dataKey] ? minMax[dataKey][0] : dataItem[dataKey];
            minMax[dataKey][1] = minMax[dataKey][1] >= dataItem[dataKey] ? minMax[dataKey][1] : dataItem[dataKey];
        }
        logDataText += "\n";
    }
    for (let dataKey of dataKeys) {
        logText += (nameMap[dataKey] + "最小值: " + minMax[dataKey][0] + ", 最大值: " + minMax[dataKey][1] + "\n");
    }
    logText += logDataText;
    // console.log(logText);
    const visualMaps = [];
    let i = 0;
    let seriesIndex = 0;
    for (let dataKey of dataKeys) {
        dataSeries.push({
            name: nameMap[dataKey],
            symbolSize: 2,
            data: seriesData[dataKey],
            type: 'line',
            emphasis: {
                focus: 'series'
            },
            lineStyle: {
                width: 3,
            },
        });
        visualMaps.push({
            show: false,
            type: 'continuous',
            seriesIndex: seriesIndex,
            min: minMax[dataKey][0],
            max: minMax[dataKey][1],
            inRange: {
                color: visualMapColors[i]
            }
        })
        seriesIndex += 1;
        i = (i + 1) % (visualMapColors.length);
    }
    // console.log('series', dataSeries);
    const chartOption = {
        // color: ['#91ca8c', '#f49f42', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#dd6b66', '#8dc1a9', '#759aa0', '#e69d87', '#ea7e53'],
        title: {
            left: 'center',
            // text: seriesData["title"] + curNameType["type"] + '流速',
            top: '2%',
            textStyle: {
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.8)'
            }
        },
        color: ['#1C58A6', '#F29F05', '#5AC9B5'],
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
                color: 'rgba(0, 29, 91, 0.9)'
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
                formatter: '{hh}:{mm}'
            },
            minInterval: 3600 * 1000 * 3,
            min: (value) => {
                return value.min
            },
            max: (value) => {
                return value.max
            },
            boundaryGap: ['5%', '5%']
        },
        yAxis: {
            type: 'value',
            // name: 'm/s',
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
                return value.min.toFixed(4)
            },
            max: (value) => {
                return value.max.toFixed(4)
            },
        },
        grid: {
            top: '12%',
            bottom: '2%',
            left: '2%',
            right: '2%',
            containLabel: true
        },
        series: dataSeries
    }


    return chartOption;
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
        console.log("print chart dom");
        console.log(chartDom.value.clientWidth, chartDom.value.clientHeight);
        if (chartOption) {
            echart = echarts.init(chartDom.value);
            console.log("print chart dom after");
            console.log(chartDom.value.clientWidth, chartDom.value.clientHeight);
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

    // console.log("test");
    const res = (await getWaterLevelByStationAndTime(props.stationType, props.stationName, props.ysdTime, props.curTime)).data;
    // console.log('res', res)
    if (res.length == 0) {
        // console.log(props);
        curTimeStrRef.value = '无数据';
        console.log("无数据")
    }
    else {
        curTimeStrRef.value = res[res.length - 1].time.split(' ')[1].slice(0, -3);
        // console.log(res[0])
        const dataKeyList = [];
        if ("upstreamWaterLevel" in res[res.length - 1] || "downstreamWaterLevel" in res[res.length - 1]) {
            const hasUpValue = ((res[res.length - 1].upstreamWaterLevel !== '') && (res[res.length - 1].upstreamWaterLevel));
            const hasDownValue = ((res[res.length - 1].downstreamWaterLevel !== '') && (res[res.length - 1].downstreamWaterLevel))
            if (hasUpValue) {
                // console.log(res[0], res[res.length - 1])
                hasUpStreamData.value = true;
                upStreamData.value = res[res.length - 1].upstreamWaterLevel.toFixed(2);
                dataKeyList.push("upstreamWaterLevel");
            }
            if (hasDownValue) {
                hasDownStreamData.value = true;
                downStreamData.value = res[res.length - 1].downstreamWaterLevel.toFixed(2);
                dataKeyList.push("downstreamWaterLevel");
            }
        }
        else if ("waterLevel" in res[res.length - 1]) {
            hasUpStreamData.value = true;
            upStreamData.value = res[res.length - 1].waterLevel.toFixed(2);
            dataKeyList.push("waterLevel");
        }
        // console.log(props.stationName, dataKeyList);
        chartOption = buildData2ChartOption(res, dataKeyList);
        // const echart = echarts.init(chartDom.value as HTMLElement);
        // echart.setOption(chartOption);
    }
    console.log("print chart dom after");
    console.log(chartDom.value.clientWidth, chartDom.value.clientHeight);
    // console.log(res)
    // setInterval(() => {
    //     console.log("chart update", chartDom.value?.clientHeight, chartDom.value?.clientWidth);
    // },2000)
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
            background-color: rgba(177, 229, 255, 0.6);
            text-align: center;
            font-size: calc(0.4vw + 0.5vh);
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
                    background-color: rgb(21, 60, 168);
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