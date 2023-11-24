import MonitorModel from "../models/monitor.model.js";

export default class MonitorService {
    monitorModel;

    constructor() {}

    static async CreateFromLocal() {
        const monitorService = new MonitorService();
        monitorService.monitorModel = await MonitorModel.CreateFromLocal();
        if (monitorService.monitorModel == null) {
            return null;
        }
        return monitorService;
    }

    static CreateFromRequest(reqData) {
        const monitorService = new MonitorService();
        monitorService.monitorModel = MonitorModel.CreateFromRequest(reqData);
        // console.log(monitorService.monitorModel)
        return monitorService;
    }

    update2Local() {
        return this.monitorModel.update2Local();
    }
}