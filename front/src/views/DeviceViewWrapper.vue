<template>
    <Suspense>
        <template #fallback>
            <el-scrollbar>
                <el-skeleton :loading="loading" animated :count="8">
                    <template #template>
                        <el-skeleton-item variant="rect" style="width: 20vw; height: 40vh" />
                    </template>
                </el-skeleton>
            </el-scrollbar>
        </template>
        <DeviceView />
    </Suspense>
</template>
  
<script setup>
import { ref } from "vue";
import DeviceView from "./DeviceView.vue";

const loading = ref(true);
</script>

<style lang="scss" scoped>

div.el-scrollbar {
    background-image: url(../assets/deviceBg.png);
    background-size: 100% 100%;
}
div.el-skeleton {
    padding-top: 4vh;
    padding-left: 4vw;
    padding-right: 4vw;
    width: 92vw;
    height: 94vh;
    display: flex;
    flex-flow: row wrap;
    row-gap: 6vh;
    column-gap: 4vw;

    // background-color: linear-gradient(to bottom right, "#164773", "#5FCDD9");


    div {
        opacity: 50%;
    }
}
</style>