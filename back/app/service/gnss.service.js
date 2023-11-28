import gnssData from "../models/gnss.model.js";

function calcDiffData(dataAray) {
    const res = [];
    res.push(dataAray[0].toFixed(4));
    for(let i = 1; i < dataAray.length; i++) {
        res.push(Number((dataAray[i] - dataAray[i-1]).toFixed(4)));
    }
    return res;
}

class GnssService {
    gnss = gnssData;

    getGnssData() {
        return this.gnss;
    }

    getGnssStatistic() {
        const diffData = calcDiffData(this.gnss.value);
        // console.log("diff", diffData);
        const max = Number((diffData.reduce((a, b) => Math.max(a, b), -Infinity)).toFixed(4));
        const min = Number((diffData.reduce((a, b) => Math.min(Math.abs(a), Math.abs(b)), Infinity)).toFixed(4));
        // console.log(min, max);

        return {"diff": diffData, min, max};
    }
}

const gnssService = new GnssService();
export default gnssService;