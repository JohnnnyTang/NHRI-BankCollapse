import fs from 'fs';


export default class MonitorModel {
    geoData;

    constructor() {}

    static async CreateFromLocal() {
        const monitorModel = new MonitorModel();
        try {
            const fileData = fs.readFileSync("D:/bankConfig/monitorPt.json", 'utf-8')
            // console.log(fileData);
            monitorModel.geoData = JSON.parse(fileData);
            return monitorModel;
        } catch(err) {
            console.log("Read file error!!!\n", err);
            return null;
        }
    }

    static CreateFromRequest(reqData) {
        const monitorModel = new MonitorModel();
        monitorModel.geoData = reqData;
        return monitorModel;
    }

    update2Local() {
        try{
            fs.writeFileSync("D:/bankConfig/monitorPt.json", JSON.stringify(this.geoData, null, 2), 'utf-8');
            console.log('Data successfully saved to disk');
            return null;
        } catch(err) {
            console.log('An error has occurred ', err);
            return err;
        }
    }
}