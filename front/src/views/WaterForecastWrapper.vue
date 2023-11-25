<template>
    <Suspense>
        <template #fallback>
            <el-skeleton :loading="loading" animated :count="9">
                <template #template>
                    <el-skeleton-item variant="rect" style="width: 33.3vw; height: 30vh" />
                </template>
            </el-skeleton>
        </template>
        <WaterForecastView />
    </Suspense>
</template>
  
<script setup>
import { ref } from "vue";
import WaterForecastView from "./WaterForecastView.vue";

const loading = ref(true);
</script>

<style lang="scss" scoped>
div.el-skeleton {
    width: 100vw;
    height: 94vh;
    display: flex;
    flex-flow: row wrap;

    justify-content: space-around;
    // align-content: space-around;
    row-gap: 0.1vh;

    background-color: linear-gradient(to bottom right, "#164773", "#5FCDD9");
    background-size: cover;

    div {
        opacity: 50%;
    }
}
</style>