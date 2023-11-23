<template>
  <div id="map"></div>
  <leftBox v-if="showBox" />
  <rightTopBox />
  <rightBottomBox v-if="showBox" />
</template>

<script>
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import leftBox from "@/components/leftBox.vue";
import rightTopBox from "@/components/rightTopBox.vue";
import rightBottomBox from "@/components/rightBottomBox.vue";

import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "mapView",
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
import { provide } from "vue";
import { useStore, nameStore } from "@/stores/index.js";

const store = useStore();
const namestore = nameStore();

const viewState = {
  latitude: 31.864162,
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

onMounted(() => {
  axios
    .get("http://localhost:5173/resJsonEx.json", { responseType: "json" })
    .then((res) => {
      const data = res.data;
      //configData = data;
      store.configData = data;
      store.calcAll();
    });

  const map = new mapboxgl.Map({
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

  map.on("load", function () {
    map.addSource("monitorLine", {
      type: "geojson",
      data: "http://localhost:5173/monitorLine.geojson",
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
        "line-color": "#888" /* 线条颜色 */,
        "line-width": 8 /* 线条宽度 */,
      },
    });

    map.addSource("monitorPoint", {
      type: "geojson",
      data: "http://localhost:5173/monitorPoint.geojson",
    });

    map.addLayer({
      id: "pointLayer",
      type: "circle",
      source: "monitorPoint",
      paint: {
        "circle-color": "#888",
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 7, 15, 13],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#DFE1EC",
      },
    });

    // 创建一个标注图层，并设置文字偏移量
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

    map.on("click", function (event) {
      const states = map.queryRenderedFeatures(event.point, {
        layers: ["lineLayer", "pointLayer"],
      });
      if (states.length) {
        showBox.value = true;
        store.currentName = states[0].properties.name;

        map.setPaintProperty("lineLayer", "line-color", [
          "match", //匹配模式
          ["get", "name"], //匹配的属性值名称，id，可以从feature的属性得到
          states[0].properties.name, //要匹配的值
          statusColors[store.status], //匹配中的颜色
          "#888", //未匹配上的颜色
        ]);

        map.setPaintProperty("pointLayer", "circle-color", [
          "match", //匹配模式
          ["get", "name"], //匹配的属性值名称，id，可以从feature的属性得到
          states[0].properties.name, //要匹配的值
          statusColors[store.status], //匹配中的颜色
          "#888", //未匹配上的颜色
        ]);

        map.setPaintProperty("pointLayer", "circle-stroke-width", [
          "match", //匹配模式
          ["get", "name"], //匹配的属性值名称，id，可以从feature的属性得到
          states[0].properties.name, //要匹配的值
          3.5,
          2, //未匹配上的颜色
        ]);
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
</style>
