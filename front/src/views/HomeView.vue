<template>
  <div id="map"></div>
  <leftBox v-if="showBox" />
  <rightTopBox />
  <rightBottomBox v-if="showBox" />
  <el-button class="btn-full-extent" @click="fullExtent">
    <el-icon class="icon" :size="20"><FullScreen /></el-icon>全图</el-button
  >
</template>

<script>
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import leftBox from "@/components/leftBox.vue";
import rightTopBox from "@/components/rightTopBox.vue";
import rightBottomBox from "@/components/rightBottomBox.vue";

import { defineComponent, onMounted, ref, watch } from "vue";
import { FullScreen } from "@element-plus/icons-vue";

export default defineComponent({
  name: "homeView",
  components: {
    leftBox,
    rightTopBox,
    rightBottomBox,
  },
  props: {
    msg: String,
  },
});
</script>

<script setup>
import { useStore } from "@/stores/index.js";
import AnimatedPoint from "@/utils/shining.js";

const store = useStore();

var map = null;

const viewState = {
  latitude: 31.964162,
  longitude: 120.150697,
  zoom: 8,
  pitch: 0,
  bearing: 0,
};

const showBox = ref(false);

const statusColors = ["#0081D1", "#15C900", "#F18614", "#ED3324"];
//点击要素后才可向组件传值并计算，无法加载后全部计算（有无更好办法？）
/*
var configData = null;
const provideData = () => {
  return {
    configData: configData,
  };
};
provide("provideData", provideData);*/

function fullExtent() {
  map.easeTo({
    zoom: viewState.zoom,
    center: [viewState.longitude, viewState.latitude],
    pitch: viewState.pitch,
    bearing: viewState.bearing,
    duration: 2000,
  });
}

onMounted(async () => {
  map = new mapboxgl.Map({
    accessToken:
      "pk.eyJ1IjoiZmxpY2tlcjA1NiIsImEiOiJjbGVwZTdoZ3EwNDZyM3NwN21zeXltYmQ0In0.X2048MURPAfoPoDx0OkGQQ",
    container: "map",
    style: "mapbox://styles/flicker056/clp2geuv700dz01r6f8rp5b4a",
    //interactive: false,
    zoom: viewState.zoom,
    center: [viewState.longitude, viewState.latitude],
    pitch: viewState.pitch,
    bearing: viewState.bearing,
  });

  await axios
    .get("http://localhost:5173/resJsonEx.json", { responseType: "json" })
    .then((res) => {
      const data = res.data;
      //configData = data;
      store.configData = data;
      store.calcAll();
      showBox.value = true;
    });

  const animePoint = new AnimatedPoint(map); //动画图层

  map.on("load", async function () {
    var pointJson = null;
    var lineJson = null;
    var deviceJson = null;

    await axios
      .get("http://localhost:5173/monitorPoint.geojson", { responseType: "json" })
      .then((res) => {
        pointJson = res.data;
      });

    await axios
      .get("http://localhost:5173/monitorLine.geojson", { responseType: "json" })
      .then((res) => {
        lineJson = res.data;
      });

    await axios
      .get("http://localhost:8181/monitor", { responseType: "json" })
      .then((res) => {
        deviceJson = res.data.data;
      });

    let nameLists = { 0: [], 1: [], 2: [], 3: [] };
    for (var key in store.statuses) {
      let value = store.statuses[key];
      nameLists[value].push(key);
    }

    map.addSource("monitorLine", {
      type: "geojson",
      data: lineJson,
    });

    map.addLayer({
      id: "lineLayer",
      type: "line",
      source: "monitorLine",
      layout: {
        "line-join": "round" /* 线条相交的形状 */,
        "line-cap": "round" /* 线条末端形状 */,
      },
      paint: {
        "line-color": [
          "case",
          ["in", ["get", "name"], ["literal", nameLists["0"]]],
          statusColors[0],
          ["in", ["get", "name"], ["literal", nameLists["1"]]],
          statusColors[1],
          ["in", ["get", "name"], ["literal", nameLists["2"]]],
          statusColors[2],
          ["in", ["get", "name"], ["literal", nameLists["3"]]],
          statusColors[3],
          "#888",
        ] /* 线条颜色 */,
        "line-width": 8 /* 线条宽度 */,
      },
    });

    var points = map.addSource("monitorPoint", {
      type: "geojson",
      data: pointJson,
    });

    map.addLayer({
      id: "pointLayer",
      type: "circle",
      source: "monitorPoint",
      paint: {
        "circle-color": [
          "case",
          ["in", ["get", "name"], ["literal", nameLists["0"]]],
          statusColors[0],
          ["in", ["get", "name"], ["literal", nameLists["1"]]],
          statusColors[1],
          ["in", ["get", "name"], ["literal", nameLists["2"]]],
          statusColors[2],
          ["in", ["get", "name"], ["literal", nameLists["3"]]],
          statusColors[3],
          "#888",
        ],
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 5, 15, 13],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#DFE1EC",
      },
    });

    var points = map.addSource("devicePoint", {
      type: "geojson",
      data: deviceJson,
    });

    await map.loadImage("http://localhost:5173/device.png", (error, image) => {
      if (error) throw error;
      map.addImage("device", image);
    });

    map.addLayer({
      id: "deviceLayer",
      type: "symbol",
      source: "devicePoint",
      layout: {
        "icon-image": "device",
        "icon-size": ["interpolate", ["linear"], ["zoom"], 8, 0.2, 13, 0.4], // 图标大小
        "icon-allow-overlap": true,
      },
    });

    // map.addLayer({
    //   id: "deviceLayer",
    //   type: "circle",
    //   source: "devicePoint",
    //   paint: {
    //     "circle-color": "#30F100",
    //     "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 3, 15, 12],
    //   },
    // });

    map.addLayer({
      id: "labelLayer",
      type: "symbol",
      source: "monitorPoint",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-size": 12,
        "text-offset": [0, 1.5],
        "text-letter-spacing": 0.1,
        "text-max-width": 11,
        "text-allow-overlap": true,
      },
      paint: {
        "text-halo-color": "white",
        "text-halo-width": 1,
        "text-halo-blur": 0.5,
      },
    });

    map.addLayer({
      id: "deviceLabelLayer",
      type: "symbol",
      source: "devicePoint",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-size": 10,
        "text-offset": [0, 1.5],
        "text-letter-spacing": 0.1,
        "text-max-width": 11,
      },
      paint: {
        "text-halo-color": "white",
        "text-halo-width": 1,
        "text-halo-blur": 0.5,
        "text-opacity": ["step", ["zoom"], 0, 10, 1],
      },
    });

    map.on("click", function (event) {
      const states = map.queryRenderedFeatures(event.point, {
        layers: ["lineLayer", "pointLayer"],
      });
      if (states.length) {
        store.currentName = states[0].properties.name;
      } else {
        store.currentName = "";
      }
    });

    watch(
      () => store.currentName,
      (newValue, oldValue) => {
        if (newValue === "") {
          map.setPaintProperty("pointLayer", "circle-stroke-width", 2);
          animePoint.clearPoint();
        } else {
          map.setPaintProperty("pointLayer", "circle-stroke-width", [
            "match", //匹配模式
            ["get", "name"], //匹配的属性值名称，id，可以从feature的属性得到
            newValue, //要匹配的值
            3.5,
            2, //未匹配上的颜色
          ]);

          store.currentDevice = "";
          var features = pointJson.features;
          //漫游
          for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            if (feature.properties.name === newValue) {
              var coordinates = feature.geometry.coordinates;
              map.easeTo({
                center: coordinates,
                zoom: 12.5,
                duration: 1500,
              });

              animePoint.drawPoint(feature);
              break;
            }
          }
        }
      }
    );

    map.on("click", function (event) {
      const states = map.queryRenderedFeatures(event.point, {
        layers: ["deviceLayer"],
      });
      if (states.length) {
        store.currentDevice = states[0].properties.name;
        //漫游
        let coordinates = event.lngLat;
        map.easeTo({
          center: coordinates,
          zoom: 12.5,
          duration: 1500,
        });
      } else {
        store.currentDevice = "";
      }
    });
  });
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.btn-full-extent {
  position: absolute;
  top: 5%;
  right: 29%;
  height: 5vh;
  width: 6vw;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.8);
}

.icon {
  padding-right: 5px;
}
</style>
