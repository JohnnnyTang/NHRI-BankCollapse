<template>
    <div class="deviceView-container">
        <el-scrollbar>
            <div class="device-card-container">
                <deviceCard v-for="aFeature in featuresInfo" :feature="aFeature" />
                <div class="device-add">
                    <div class="add-icon" @click="dialogFormVisible = true">+</div>
                </div>
            </div>
        </el-scrollbar>
        <el-dialog v-model="dialogFormVisible" title="Shipping address" center align-center>
            <el-form :model="form">
                <el-form-item label="Promotion name" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Zones" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="Please select a zone">
                        <el-option label="Zone No.1" value="shanghai" />
                        <el-option label="Zone No.2" value="beijing" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import axios from "axios";
import deviceCard from "../components/deviceCard.vue";
import { defineComponent, onMounted, ref, reactive } from "vue";

const featuresInfo = ref();

const res = (await axios.get("http://localhost:8181/monitor")).data.data;
// console.log(res);

featuresInfo.value = res.features;
console.log(featuresInfo.value);

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

onMounted(() => {

})

</script>

<style lang="scss" scoped>
div.deviceView-container {
    height: 94vh;
    width: 100vw;

    background-image: url(../assets/deviceBg.png);
    background-size: 100% 100%;

    div.el-scrollbar {

        div.device-card-container {
            padding-top: 4vh;
            padding-left: 4vw;
            padding-right: 4vw;
            width: 92vw;
            height: fit-content;
            // background-color: rgb(196, 226, 252);

            display: flex;
            flex-flow: row wrap;
            row-gap: 6vh;
            column-gap: 4vw;

            justify-content: flex-start;
            align-content: space-around;

            div.device-add {
                width: 20vw;
                height: 40vh;

                border-radius: 8px;

                background-color: rgba(240, 248, 255, 0.748);
                backdrop-filter: blur(5px);

                display: flex;
                justify-content: center;
                align-items: center;

                div.add-icon {
                    transition: all 0.30s ease-in-out;
                    width: calc(2vw + 5vh);
                    height: calc(2vw + 3vh);
                    line-height: calc(2vw + 3vh);
                    padding-top: 1vh;
                    padding-bottom: 1vh;
                    background: rgba(220, 238, 254, 0.648);
                    color: rgb(0, 37, 93);
                    text-align: center;
                    vertical-align: middle;
                    font-size: calc(2vw + 5vh);
                    font-weight: 600;
                    border-radius: 8px;
                    border: 0;
                    outline: 0;
                    will-change: transform;

                    &:hover {
                        background: darken(rgba(240, 248, 255, 0.748), 15%);
                        transform: scale(.95);
                        color: rgb(202, 228, 250);
                        cursor: pointer;
                    }

                    &:active {
                        transform: scale(.9);
                        color: rgb(229, 238, 246);
                    }
                }
            }
        }
    }
}
</style>