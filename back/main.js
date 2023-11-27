import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import MatrixModel from "./app/models/matrix.model.js";
import MatrixService from './app/service/matrix.service.js';
import MonitorService from './app/service/monitor.service.js';
import WaterService from './app/service/water.service.js';
import StationService from './app/service/station.service.js';
import MatrixModel from './app/models/matrix.model.js';

const app = express();

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

// content-type：application/json
app.use(bodyParser.json());

// content-type：application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// 简单路由
app.get("/matrix", async (req, res) => {
    const matrixService = await MatrixService.CreateFromLocal();
    if (matrixService == null) {
        res.status(500).send({
            status: 500,
            data: null,
            message: "no data, read file error!"
        });
        return;
    }
    res.status(200).send({
        status: 200,
        data: matrixService.matrixModel.factorMatrix,
        message: "success"
    });
});

app.post("/matrix", (req, res) => {
    const matrixService = MatrixService.CreateFromRequest(req.body);
    let resStatus = matrixService.update2Local();
    // console.log(resStatus);
    if (resStatus) {
        res.status(500).send({
            status: 500,
            message: resStatus
        })
    }
    else {
        res.status(200).send({
            status: 200,
            message: "success"
        })
    }
})

app.get("/monitor", async (req, res) => {
    const monitorService = await MonitorService.CreateFromLocal();
    if (monitorService == null) {
        res.status(500).send({
            status: 500,
            data: null,
            message: "no data, read local file error!"
        });
        return;
    }
    res.status(200).send({
        status: 200,
        data: monitorService.monitorModel.geoData,
        message: "success"
    });
});

app.post("/monitor", (req, res) => {
    const monitorService = MonitorService.CreateFromRequest(req.body);
    let resStatus = monitorService.update2Local();
    // console.log(resStatus);
    if (resStatus) {
        res.status(500).send({
            status: 500,
            message: resStatus
        })
    }
    else {
        res.status(200).send({
            status: 200,
            message: "success"
        })
    }
});

app.get("/waterLevel/:stationPlace/:stationName/:sTime/:eTime", async (req, res) => {
    const stationPlace = req.params.stationPlace;
    const stationName = req.params.stationName;
    const sTime = req.params.sTime;
    const eTime = req.params.eTime;
    const waterLevelRes = await WaterService.getWaterLevel(stationPlace, stationName, sTime, eTime);
    if (waterLevelRes == -1) {
        res.status(500).send({
            status: 500,
            data: null,
            message: "no data, read file error!"
        });
        return;
    }
    res.status(200).send({
        status: 200,
        data: waterLevelRes.data,
        message: "success"
    });
});

app.get("/stations", async (req, res) => {
    res.status(200).send({
        status: 200,
        data: StationService.getStationGeoJson(),
        message: "success"
    });
});

app.post("/matrixCalc", (req, res) => {
    try {
        const resData = MatrixModel.GernerateMatrixFromRequest(req.body);
        res.status(200).send({
            status: 200,
            data: resData, 
            message: "success"
        })
    } catch(error) {
        res.status(500).send({
            status: 500,
            data: null,
            message: error
        })
    }
});

// 设置监听端口
const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
    console.log(`服务器运行端口： ${PORT}.`);
});
