import axios from "axios";

const stationPlaceMap = {
    "yangtze": "YangtzeDownstream",
    "hubei": "hubei",
    "anhui": "anhui",
    "jiangsu": "jiangsu",
    "zhejiang": "zhejiang",
}

const waterLevelPrefix = 'https://geomodeling.njnu.edu.cn/waterLevel/';


const axiosInstance = axios.create({
    baseURL: "https://geomodeling.njnu.edu.cn/waterLevel",
});

export default class WaterService {

    constructor() { }

    static async getWaterLevel(stationPlace, stationName, sTime, eTime) {
        try {
            const reqStr = waterLevelPrefix + stationPlaceMap[stationPlace] + "/getInfoByStationAndTime/" + stationName + "/" + sTime + "/" + eTime;
            // console.log("requesting...\n", reqStr);
            const res = await axiosInstance.get(reqStr);
            return res.data;
        } catch (error) {
            console.log(error);
            return -1;
        }
    }
}