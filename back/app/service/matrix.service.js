import MatrixModel from "../models/matrix.model.js";

export default class MatrixService {
    matrixModel;

    constructor() {}

    static async CreateFromLocal() {
        const matrixService = new MatrixService();
        matrixService.matrixModel = await MatrixModel.CreateFromLocal();
        if (matrixService.matrixModel == null) {
            return null;
        }
        return matrixService;
    }

    static CreateFromRequest(reqData) {
        const matrixService = new MatrixService();
        matrixService.matrixModel = MatrixModel.CreateFromRequest(reqData);
        return matrixService;
    }

    update2Local() {
        return this.matrixModel.update2Local();
    }
}