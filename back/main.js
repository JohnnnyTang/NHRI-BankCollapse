import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import MatrixModel from "./app/models/matrix.model.js";

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
app.get("/", async (req, res) => {
    // res.json({ message: "欢迎访问卡拉云后端服务器" });
    const dataMatrix = await MatrixModel.Create();
    res.send(dataMatrix.factorMatrix);
});

// 设置监听端口
const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
    console.log(`服务器运行端口： ${PORT}.`);
});
