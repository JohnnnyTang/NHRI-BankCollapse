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

</script>

<style scoped>
.right-bottom-box {
  position: absolute;
  top: 63%;
  width: 25%;
  right: 2%;
  height: 32%;
}
</style>
