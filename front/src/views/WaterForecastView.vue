<template>
  <div id="main">
    <div id="pop" v-show="false"></div>
    <div
      v-for="(station, index) in regionStationGeojson.features"
      :id="station.properties.name"
      v-show="false"
      :key="index"
    ></div>
    <div id="container"></div>
    <div class="legend" v-show="!chartInited">
      <div class="legend-sub legend-one">
        <span>上游水位</span>
      </div>
      <div class="legend-sub legend-two">
        <span>下游水位</span>
      </div>
    </div>
    <div class="over-look" @click="zoomOut"></div>
  </div>
</template>
<script setup>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  onMounted,
  createApp,
  ref,
} from "vue";
import axios from "axios";
import popUpChart from '../components/popUpChart.vue';
// import LoginView from "./LoginView.vue";

function formatDate(value) {
    // console.log(value)
    var date = new Date(value);
    // console.log(date)
    var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
    if (m < 10) { m = '0' + m; }
    if (d < 10) { d = '0' + d; }
    if (h < 10) { h = '0' + h; }
    if (i < 10) { i = '0' + i; }
    if (s < 10) { s = '0' + s; }
    var t = y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
    return t;
}

const popUpChartsPropRefs = {};

// const pop = new mapboxgl.Popup({ maxWidth: "400px" });
// pop.addClassName("pop-up");

let popUpChartsApps = new Map();
let popUpChartsAppIns = new Map();
let popUpMap = new Map();


const getRegionTideStation = async () => {
  return await axios.get("http://localhost:8181/stations")
}

const curTimeStr = +(new Date());
const curTime = formatDate(new Date());
const ysdTime = formatDate(new Date(+curTimeStr - 24 * 3600 * 1000));

const markerHeight = 80;
const markerRadius = 10;
const linearOffset = 25;
const popupOffsets = {
  top: [0, markerHeight/2],
  "top-left": [0, 0],
  "top-right": [0, 0],
  bottom: [0, -markerHeight/2],
  "bottom-left": [
    linearOffset,
    (markerHeight - markerRadius + linearOffset) * -1,
  ],
  "bottom-right": [
    -linearOffset,
    (markerHeight - markerRadius + linearOffset) * -1,
  ],
  left: [markerRadius, (markerHeight - markerRadius) * -1],
  right: [-markerRadius, (markerHeight - markerRadius) * -1],
};
let zoomOut = () => {};

// console.log('stations', regionStation)
const regionStationGeojson = ((await getRegionTideStation()).data).data;
console.log(regionStationGeojson)
let chartInited = ref(false);
const initStationsLayer = (map) => {
  // console.log("station geojson",regionStationGeojson);

  map.loadImage("/tideStation.png", (error, image) => {
    if (error) throw error;

    map.addImage("tideStation", image);

    map.addSource("stations", {
      type: "geojson",
      data: regionStationGeojson,
    });

    map.addLayer({
      id: "stations-icon",
      type: "symbol",
      source: "stations",
      layout: {
        "icon-image": "tideStation",
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          0.007,
          5,
          0.0125,
          10,
          0.128,
          22,
          0.5,
        ],
        "icon-allow-overlap": true,
      },
    });

    map.addLayer({
      id: "station-label",
      type: "symbol",
      source: "stations",
      layout: {
        "text-field": ["format", ["get", "name"], { "font-scale": 0.8 }],
        "text-anchor": "bottom",
        "text-offset": [
          0, 3.5
        ],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          2,
          0,
          5,
          10,
          10,
          18,
          22,
          56,
        ],
        "text-font": ["Open Sans Bold"],
      },
      paint: {
        "text-color": "#ebe5ff",
        "text-halo-color": "#f0800f",
        "text-halo-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          1,
          0,
          5,
          0.2,
          9,
          0.1,
          10,
          0.5,
          22,
          1,
        ],
        "text-halo-blur": 0.3,
      },
    });

    map.on("mouseenter", "stations-icon", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "stations-icon", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("click", "stations-icon", (e) => {
      map.flyTo({
        zoom: 12.6,
        center: e.lngLat,
        essential: true,
      });
    });
  });

  for (let aStation of regionStationGeojson.features) {
    popUpChartsPropRefs[aStation.properties.name] = {
      stationName: aStation.properties.name,
      stationType: aStation.properties.type,
      show: ref(true),
      curTime,
      ysdTime,
      chartWidth: ref(100),
      chartHeight: ref(60),
    };
    popUpChartsApps.set(
      aStation.properties.name,
      createApp(popUpChart, popUpChartsPropRefs[aStation.properties.name])
    );
    popUpChartsAppIns.set(
      aStation.properties.name,
      popUpChartsApps
        .get(aStation.properties.name)
        .mount("#" + aStation.properties.name)
    );
    let popChart = new mapboxgl.Popup({
      maxWidth: "1000px",
      closeOnClick: false,
      offset: popupOffsets,
    });
    popChart.addClassName("pop-chart");
    popChart
      .setLngLat(aStation.geometry.coordinates)
      .setDOMContent(popUpChartsAppIns.get(aStation.properties.name).$el)
      .addTo(map);
    popUpMap.set(aStation.properties.name, popChart);
  }
  console.log('send props',popUpChartsPropRefs)

  map.on("zoom", (e) => {
    const zoom = map.getZoom();
    
    if (zoom < 7.5) {
      for (let popUp of popUpMap.values()) {
        if (popUp.isOpen()) {
          popUp.remove();
        }
      }
    } else {
      for (let popUp of popUpMap.values()) {
        if (!popUp.isOpen()) {
          popUp.addTo(map);
        }
      }
      if (zoom < 10) {
        for (let station of regionStationGeojson.features) {
          popUpChartsPropRefs[station.properties.name].chartWidth.value = zoom * 10;
          popUpChartsPropRefs[station.properties.name].chartHeight.value = zoom * 6;
          // console.log(zoom, popUpChartsPropRefs[station.name].chartWidth.value)
        }
        if (
          chartInited.value &&
          popUpChartsPropRefs[regionStationGeojson.features[0].properties.name].chartWidth.value < 240
        ) {
          // console.log("remove")
          for (let station of regionStationGeojson.features) {
            popUpChartsAppIns.get(station.properties.name).toggleChartStatus();
          }
          chartInited.value = false;
        }
      } else if (zoom < 12) {
        for (let station of regionStationGeojson.features) {
          popUpChartsPropRefs[station.properties.name].chartWidth.value = zoom * 24;
          popUpChartsPropRefs[station.properties.name].chartHeight.value = zoom * 16;
          // console.log(zoom, popUpChartsPropRefs[station.name].chartWidth.value)
        }
        if (
          chartInited.value &&
          popUpChartsPropRefs[regionStationGeojson.features[0].properties.name].chartWidth.value < 240
        ) {
          // console.log("remove")

          for (let station of regionStationGeojson.features) {
            popUpChartsAppIns.get(station.properties.name).toggleChartStatus();
          }
          chartInited.value = false;
        } else if (
          !chartInited.value &&
          popUpChartsPropRefs[regionStationGeojson.features[0].properties.name].chartWidth.value >= 240
        ) {
          for (let station of regionStationGeojson.features) {
            popUpChartsAppIns.get(station.properties.name).toggleChartStatus();
          }
          chartInited.value = true;
        }
      } else {
        for (let station of regionStationGeojson.features) {
          popUpChartsPropRefs[station.properties.name].chartWidth.value = zoom * 42;
          popUpChartsPropRefs[station.properties.name].chartHeight.value = zoom * 28;
          // console.log(zoom, popUpChartsPropRefs[station.name].chartWidth.value)
        }
        if (!chartInited.value) {
          for (let station of regionStationGeojson.features) {
            popUpChartsAppIns.get(station.properties.name).toggleChartStatus();
          }
          chartInited.value = true;
        }
      }
    }
    if (chartInited.value) {
      for (let station of regionStationGeojson.features) {
        popUpChartsAppIns.get(station.properties.name).resizeEchart();
      }
    }
  });
  // console.log(popUpChartsAppIns);
};


onMounted(async () => {
  const map = new mapboxgl.Map({
    container: "container",
    style: "mapbox://styles/johnnyt/clld6armr00f901q0dyqh7452",
    center: [120.001, 31.8813],
    zoom: 9.05,
    accessToken:
      "pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg",
  });
  zoomOut = () => {
    map.flyTo({
      center: [120.001, 31.8813],
      zoom: 9.05,
      essential: true,
    });
  };
  map.on("load", () => {
    initStationsLayer(map);
  })


});
</script>
<style lang="scss">
#main {
  width: 100%;
  //   height: 100%;
  height: 94vh;

  #container {
    width: 100%;
    height: 100%;

    div.pop-chart {
      width: fit-content;
      height: fit-content;

      div.mapboxgl-popup-content {
        background-color: #cde5ffc8;
        backdrop-filter: blur(5px);
        padding: 3px 3px 3px 3px;
      }
    }

    div.pop-up {
      div.mapboxgl-popup-anchor-bottom {
        border-top-color: #b9d6f5d8; //no func
      }
      div.mapboxgl-popup-content {
        background-color: #cde5ffc8;
      }
    }
  }

  div.legend {
    position: absolute;
    right: calc(6vw + 2vh);
    bottom: 4.5vh;
    width: 8vw;
    height: 5vh;
    display: flex;
    flex-flow: row;
    border-radius: 6px;

    div.legend-sub {
      display: flex;
      width: 50%;
      height: 100%;
      align-items: center;
      justify-content: center;
      font-size: calc(0.5vw + 0.55vh);
      font-weight: 600;

      &.legend-one {
        background-color: rgb(21, 60, 168);
        color: rgb(234, 252, 255);
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }

      &.legend-two {
        background-color: rgb(73, 202, 231);
        color: rgb(0, 13, 42);
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }
    }
  }

  div.over-look {
    position: absolute;
    width: calc(2vw + 2vh);
    height: calc(2vw + 2vh);
    right: 2vw;
    bottom: 4vh;
    background-image: url("../assets/zoom-blue.png");
    background-size: cover;

    transition: all 0.5s ease-in-out;

    &:hover {
      cursor: pointer;
      width: calc(2.5vw + 2.5vh);
      height: calc(2.5vw + 2.5vh);
    }
  }
}
</style>