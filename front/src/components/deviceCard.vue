<template>
    <div class="device-card">
        <div class="card-title">{{ props.feature.properties.name }}</div>
        <div class="card-pic" :style="{ 'background-image': 'url(' + picMap[props.feature.properties.type] + ')' }"></div>
        <div class="card-desc">
            <div class="pos-desc desc-item">
                <div class="desc-title pos-title">位置<br>坐标</div>
                <div class="desc-content pos-content">{{ props.feature.geometry.coordinates }}</div>
            </div>
            <div class="type-desc desc-item">
                <div class="desc-title type-title">监测<br>类型</div>
                <div class="desc-content type-content">{{ props.feature.properties.type }}</div>
            </div>
            <div class="bank-desc desc-item">
                <div class="desc-title bank-title">监测<br>岸段</div>
                <div class="desc-content bank-content">{{ props.feature.properties.bank }}</div>
            </div>
            <div class="status-desc desc-item">
                <div class="desc-title status-title">当前<br>状态</div>
                <div class="desc-content status-content">
                    <div class="status-bar load-status" v-if="loadStatus === 0">
                        <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="4.8vh" height="4.8vh"
                            viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                            <path fill="#000"
                                d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                                <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25"
                                    to="360 25 25" dur="0.7s" repeatCount="indefinite" />
                            </path>
                        </svg>
                    </div>
                    <div class="status-bar work-status" v-else-if="loadStatus === 1">
                        <div class="status-text work-text">正常运行</div>
                        <div class="status-icon work-icon"></div>
                    </div>
                    <div class="status-bar warn-status" v-else-if="loadStatus === 2">
                        <div class="status-text warn-text">待机中</div>
                        <div class="status-icon warn-icon"></div>
                    </div>
                    <div class="status-bar wrong-status" v-else>
                        <div class="status-text wrong-text">状态异常</div>
                        <div class="status-icon wrong-icon"></div>
                    </div>
                    <div class="check-button">
                        <button class="custom-btn btn-3" @click="checkStatus"><span>检查状态</span></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { defineComponent, onMounted, ref } from "vue";

const picMap = {
    "GNSS": "./gnssStation1.png",
    "GNSSBase": "./gnssBase.png",
    "压力计": "./waterPress.jpg",
    "应变桩": "./changePress.jpg",
}

const props = defineProps(['feature']);
console.log(props);

const monitorStatus = ref("正常运行");

const loadStatus = ref(0);

const checkStatus = () => {
    console.log("checking status...");
    loadStatus.value = 0;
    setTimeout(() => {
        loadStatus.value = 1;
    }, 1500)
}

onMounted(() => {
    setTimeout(() => {
        loadStatus.value = 1;
    }, 1000)
})

</script>

<style lang="scss" scoped>
div.device-card {
    width: 20vw;
    height: 40vh;

    border-radius: 8px;

    background-color: rgba(240, 248, 255, 0.748);
    backdrop-filter: blur(5px);

    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;

    div.card-title {
        width: 18vw;
        height: 5vh;
        line-height: 5vh;

        text-align: center;
        font-size: calc(0.7vw + 0.5vh);
        font-weight: 600;

        // background-color: aliceblue;
    }

    div.card-pic {
        width: 18vw;
        height: 18vh;

        background-image: url(../assets/gnssStation1.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    div.card-desc {
        width: 18vw;
        height: 15vh;
        // background-color: aliceblue;

        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: center;

        div.desc-item {
            height: 4.8vh;
            display: flex;
            flex-flow: row nowrap;
            border-radius: 8px;

            div.desc-title {
                width: 3vw;
                height: 4vh;
                padding-top: 0.4vh;
                padding-bottom: 0.4vh;
                line-height: 2vh;
                text-align: center;
                font-size: calc(0.5vw + 0.5vh);
                font-weight: 600;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;

                background-color: rgb(0, 52, 157);
                color: rgba(208, 233, 255, 0.9);
            }

            div.desc-content {
                height: 4.8vh;
                line-height: 4.8vh;
                text-align: center;
                font-size: calc(0.5vw + 0.3vh);
                font-weight: 600;

                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;

                background-color: rgb(152, 186, 255);
                color: rgb(0, 30, 56);
            }

            &.pos-desc {
                width: 18vw;

                // background-color: antiquewhite;
                div.desc-title {
                    line-height: 2vh;
                }

                div.desc-content {
                    width: 15vw;
                }
            }

            &.type-desc {
                width: 7.8vw;
                // background-color: rgb(222, 250, 215);

                div.desc-content {
                    width: 4.8vw;
                    font-size: calc(0.6vw + 0.3vh);
                }
            }

            &.bank-desc {
                width: 10vw;

                // background-color: rgb(215, 232, 250);
                div.desc-content {
                    width: 7vw;
                    font-size: calc(0.6vw + 0.3vh);
                }
            }

            &.status-desc {
                width: 18vw;

                // background-color: rgb(250, 246, 215);
                div.desc-content {
                    width: 15vw;
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: space-around;

                    div.status-bar {
                        width: 8vw;
                        height: 4.8vh;
                        // background-color: aqua;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-around;

                        svg path,
                        svg rect {
                            fill: #0037ff;
                        }

                        div.status-text {
                            width: 6vw;
                            height: 4.8vh;
                            line-height: 4.8vh;
                            font-weight: 600;
                            font-size: calc(0.6vw + 0.4vh);

                            &.work-text {
                                color: #109210;
                            }

                            &.warn-text {
                                color: #b1b822;
                            }

                            &.wrong-text {
                                color: rgb(184, 34, 34);
                            }
                        }

                        div.status-icon {
                            width: 2vw;
                            height: 4.8vh;
                            background-size: contain;
                            background-repeat: no-repeat;
                            background-position: center;

                            &.work-icon {
                                background-image: url(../assets/check.png);
                            }

                            &.warn-icon {
                                background-image: url(../assets/offline.png);
                            }

                            &.warn-icon {
                                background-image: url(../assets/cancel.png);
                            }
                        }
                    }

                    div.check-button {
                        width: 6vw;
                        height: 4.8vh;
                        // background-color: aquamarine;

                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .btn-3 {
                            width: 4vw;
                            height: 3vh;
                            // padding: 10px 25px;
                            border: none;
                            font-weight: 600;
                            font-size: calc(0.5vw + 0.2vh);
                            background: rgb(183, 249, 255);
                            cursor: pointer;
                            transition: all 0.3s ease;
                            position: relative;
                            display: inline-block;

                            border-radius: 8px;

                            line-height: 3vh;
                            padding: 0;
                        }

                        .btn-3:hover {
                            background: transparent;
                            color: #000;
                        }

                        .btn-3 span {
                            position: relative;
                            display: block;
                            width: 100%;
                            height: 100%;
                            border-radius: 4px;
                        }

                        .btn-3:before,
                        .btn-3:after {
                            position: absolute;
                            content: "";
                            left: 0;
                            top: 0;
                            background: #000;
                            border-radius: 4px;
                            transition: all 0.3s ease;
                        }

                        .btn-3:before {
                            height: 0%;
                            width: 2px;
                            border-radius: 4px;
                        }

                        .btn-3:after {
                            width: 0%;
                            height: 2px;
                            border-radius: 4px;
                        }

                        .btn-3:hover:before {
                            height: 100%;
                            border-radius: 4px;
                        }

                        .btn-3:hover:after {
                            width: 100%;
                            border-radius: 4px;
                        }

                        .btn-3 span:before,
                        .btn-3 span:after {
                            position: absolute;
                            content: "";
                            right: 0;
                            bottom: 0;
                            background: #000;
                            border-radius: 4px;
                            transition: all 0.3s ease;
                        }

                        .btn-3 span:before {
                            width: 2px;
                            height: 0%;
                            border-radius: 4px;
                        }

                        .btn-3 span:after {
                            width: 0%;
                            height: 2px;
                            border-radius: 4px;
                        }

                        .btn-3 span:hover:before {
                            height: 100%;
                            border-radius: 4px;
                        }

                        .btn-3 span:hover:after {
                            width: 100%;
                            border-radius: 4px;
                        }
                    }
                }
            }
        }
    }
}</style>