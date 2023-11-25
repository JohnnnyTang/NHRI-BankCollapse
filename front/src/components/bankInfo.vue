<template>
  <el-main>
    <div id="title">{{ store.currentName }}</div>
    <div id="content">
      <el-scrollbar>
        {{ info[store.currentName] }}
      </el-scrollbar>
    </div>
  </el-main>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "bankInfo",
});
</script>

<script setup>
import { useStore } from "@/stores/index.js";
const store = useStore();

const info = {
  栖龙弯道三江口段:
    "栖龙弯道自龙潭港二期码头下游端至三江河口下游的中石油码头，三江口是弯道下节点，长江主流过三江口节点后向北转向左岸进入仪征水道。栖龙弯道南侧凹岸岸坡和滩地同样属于现代冲积层，抗冲性较差，南侧凹岸因长期受弯道水流冲刷，不仅滩面不断后退，水下深槽深度达50m之多，因而临近主流的滩缘形成高大陡坡。2008年11月18日下午16时40分，栖霞区龙潭三官村友庄圩（三江河口上游侧）发生崩岸，发展过程迅速,窝塘平面形态为Ω形，面积约5.3万m3，底部高程由原+5m左右至-20m，崩塌土方量约l10万m3，导致约200m长的主江堤遭受水毁，龙潭街道花园水厂取水头塌入江中。",
  和畅洲左汊进口右缘段:
    "和畅洲位于镇江扬州河段，为典型的鹅头型分汊河道，长期以来，该河段历史上频繁冲淤变迁，曾出现南北两汊交替冲淤发展，主副汊道易位。近几十年来，和畅洲左汊分流急剧增大而成为主汊，洲头受上游主流顶冲。20世纪80年初，和畅洲头曾发生过一次较大规模窝崩，之后连年受水流冲刷，窝塘逐渐扩大，形成长度400m、进深200m左右的半圆形。2010年为阻止北汊发展，和畅洲北汊口门实施了潜坝工程，使得洲头附近局部冲刷有所增加。",
  嘶马弯道杨湾段:
    "杨湾段位于嘶马弯道下段，随着上游河势的调整、三益桥边滩的淤长以及入海水道等因素影响，过五峰山后主流有所南偏，入流顶冲嘶马弯道段的位置有所下移，为此杨湾段自上世纪90年代后期以来冲刷幅度较大，近年来近岸冲淤变幅有所减小，但大流速依旧近岸，深槽有向近岸冲刷的趋势。",
  民主沙右缘段:
    "近年福中水流加强，顶冲点有所下移，民主沙右缘冲刷后退。主流深槽坐弯，河势不稳定，相应太子圩边滩淤长，同时也导致航道右侧局部水深不足。",
};
</script>

<style scoped>
#title {
  padding: 5px 10px;
  font-family: 思源黑体Bold;
  color: #d8e0fa;
  text-align: center;
  font-size: 16px;
}

#content {
  font-family: 思源黑体L;
  padding: 5px 10px;
  text-indent: 26px;
  font-size: 13px;

  height: 25vh;
}
</style>
