<template>
  <el-container class="right-bottom-box map-overlay">
    <el-main> </el-main>
  </el-container>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "rightBottomBox",
  computed: {},
});
</script>

<script setup>
const tableData = [
  {
    section: "岸段1",
  },
  {
    section: "岸段2",
  },
  {
    section: "岸段3",
  },
  {
    section: "岸段4",
  },
  {
    section: "岸段5",
  },
];
</script>

<style scoped>
.right-bottom-box {
  position: absolute;
  top: 63%;
  width: 22%;
  right: 2%;
  height: 32%;
}
</style>
