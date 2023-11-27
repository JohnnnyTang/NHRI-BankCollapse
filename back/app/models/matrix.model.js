import fs from 'fs';

const matrixMap = [
    [1, 0, 0, 0], 
    [0, 1, 0, 0], 
    [0, 0, 1, 0], 
    [0, 0, 0, 1], 
]

const factorMap = {
    "水动力因子": ["造床流量当量", "流速指标", "水位变幅", "河道二次流"],
    "河床演变因子": ["滩槽高差", "深泓离岸相对距离", "近岸冲刷", "分流比变化"],
    "岸坡特征因子": ["抗滑稳定性", "土体组成", "沉降位移", "渗流坡降"],
    "人类活动因子": ["岸坡防护方量", "近岸采沙", "突加荷载"]
}

const isEqualOne = (ele) => ele == 1;

function generateMatrix4APlan(bankFactor) {
    let res = {};
    for(let factorKey in bankFactor) {
        if (factorKey != "权重") {
            res[factorKey] = {"matrix":[], "weight": []};
            for(let factor in bankFactor[factorKey]) {
                if (factor != "权重") {
                    res[factorKey]["matrix"].push(matrixMap[bankFactor[factorKey][factor]]);
                }
            }
            res[factorKey]["weight"] = bankFactor[factorKey]["权重"];
        }
    }
    res["weight"] = bankFactor["权重"];
    return res;
}

function generateMatrix4ABank(bankFactor) {
    let res = {};
    for(let planName in bankFactor) {
        res[planName] = generateMatrix4APlan(bankFactor[planName]);
    }
    return res;
}

function generateJsonObject4APlan(planFactor) {
    let res = {}
    for(let factor in planFactor) {
        console.log(planFactor[factor]);
        if (factor != "weight") {
            res[factor] = {}
            for(let i = 0; i < planFactor[factor]["matrix"].length; i++) {
                res[factor][factorMap[factor][i]] = planFactor[factor]["matrix"][i].findIndex(isEqualOne);
            }
            res[factor]["权重"] = planFactor[factor]["weight"];
        }
    }
    res["权重"] = planFactor["weight"];
    return res;
}

function generateJsonObject4ABank(bankFactor) {
    let res = {};
    for(let plan in bankFactor) {
        // console.log("plan: ", plan, bankFactor[plan]);
        res[plan] = generateJsonObject4APlan(bankFactor[plan]);
    }
    // console.log(res)
    return res;
}

export default class MatrixModel {
    jsonObject = {};
    factorMatrix = {};

    constructor() {}

    static async CreateFromLocal() {
        const dataMatrix = new MatrixModel();
        try {
            dataMatrix.jsonObject = await JSON.parse(fs.readFileSync("D:/bankConfig/stableConfig.json", 'utf-8'));
            // console.log(dataMatrix.jsonObject);
            dataMatrix.generateMatrix()
            return dataMatrix;
        } catch(err) {
            console.log("Read file error!!!\n", err);
            return null;
        }
    }

    static CreateFromRequest(reqData) {
        const dataMatrix = new MatrixModel();
        dataMatrix.factorMatrix = reqData;
        dataMatrix.generateJsonObject();
        return dataMatrix;
    }

    static GernerateMatrixFromRequest(reqData) {
        return generateMatrix4APlan(reqData);
    }

    generateMatrix() {
        if(this.jsonObject == {}) {
            return 'No data';
        }
        else {
            for(let bank in this.jsonObject) {
                this.factorMatrix[bank] = generateMatrix4ABank(this.jsonObject[bank]);
                console.log(this.factorMatrix[bank]);
            }
        }
    }

    generateJsonObject() {
        console.log(this.factorMatrix)
        for(let name in this.factorMatrix) {
            this.jsonObject[name] = generateJsonObject4ABank(this.factorMatrix[name]);
            // this.jsonObject[name] = {};
            // for(let factor in this.factorMatrix[name]) {
            //     console.log(factor);
            //     if (factor != "weight") {
            //         this.jsonObject[name][factor] = {}
            //         for(let i = 0; i < this.factorMatrix[name][factor]["matrix"].length; i++) {
            //             this.jsonObject[name][factor][factorMap[factor][i]] = this.factorMatrix[name][factor]["matrix"][i].findIndex(isEqualOne);
            //         }
            //         this.jsonObject[name][factor]["权重"] = this.factorMatrix[name][factor]["weight"];
            //     }
            // }
            // this.jsonObject[name]["权重"] = this.factorMatrix[name]["weight"];
        }
    }

    update2Local() {
        try{
            fs.writeFileSync("D:/bankConfig/stableConfig.json", JSON.stringify(this.jsonObject, null, 2), 'utf-8');
            console.log('Data successfully saved to disk');
            return null;
        } catch(err) {
            console.log('An error has occurred ', err);
            return err;
        }
    }


}