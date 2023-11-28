// 生成一个符合指数分布的随机数，范围在[0, max]之间，保留三位小数
function expRandomNum(max) {
  let lambda = 1 / max; // 计算分布的参数，使得平均值等于max
  let x = -Math.log(1 - Math.random()) / lambda; // 用反函数法生成一个指数分布的随机数
  return Number(x.toFixed(3)); // 保留三位小数并返回
}

// 生成一个符合你要求的差值，范围在[diffMin, diffMax]之间，绝对值越大出现的概率越小
function randomDiff(diffMin, diffMax) {
  let diff = expRandomNum(diffMax); // 生成一个指数分布的随机数，范围在[0, diffMax]之间
  if (diff < diffMin) {
    // 如果小于diffMin，就取diffMin
    diff = diffMin;
  }
  let sign = Math.random() < 0.5 ? -1 : 1; // 随机生成一个符号，-1或1
  return sign * diff; // 返回符号乘以差值
}

// 生成一个随机数数组，长度为n，第一个数为start，每个数与前一个数的差值在[diffMin, diffMax]之间，且差值越大出现的概率越小
function randomData(n, threshold) {
  let start = Number((Math.random() - 0.5).toFixed(3))
  let array = [start]; // 初始化数组，第一个数为start
  for (let i = 1; i < n; i++) {
    // 从第二个数开始，循环n-1次
    let prev = array[i - 1]; // 前一个数
    let diff = randomDiff(-threshold, threshold); // 用新函数生成一个符合你要求的差值
    let next = Number(prev + diff); // 下一个数等于前一个数加上差值
    array.push(Number(next.toFixed(3))); // 把下一个数加入数组
  }
  return array; // 返回数组
}

export default randomData;