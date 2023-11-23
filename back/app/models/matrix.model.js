import fs from 'fs';

const matrixMap = [
    [1, 0, 0, 0], 
    [0, 1, 0, 0], 
    [0, 0, 1, 0], 
    [0, 0, 0, 1], 
]

const baseMatrix = [
    [0, 0, 0, 0], 
    [0, 0, 0, 0], 
    [0, 0, 0, 0], 
    [0, 0, 0, 0],
]

function generateMatrix4ABank(bankFactor) {
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

export default class MatrixModel {
    jsonObject = {};
    factorMatrix = {};

    constructor() {}

    static async Create() {
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


}