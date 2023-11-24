import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('config', () => {
  const configData = ref(null);

  // {
  //   "岸段1":[p1, p2, p3, p4],
  //   ...
  // }
  const results = ref({});
  const currentName = ref("")

  const statuses = computed(()=>{
    let statusObj = {}
    for(var key in results.value) {
      let stability = results.value[key];
      var maxNumber = stability[0];
      for (var i = 0; i <= stability.length; i++) {
        if (stability[i] >= maxNumber) {
          maxNumber = stability[i];
          var index = i;
        }
      }
      statusObj[key] = index;
    }
    return statusObj;
  })

  function calc(name) {
    let data = configData.value[name];
    let w_fs = data.weight;

    let vec_f1 = multiply(data["水流动力因子"].weight, data["水流动力因子"].matrix);
    let vec_f2 = multiply(data["河床演变因子"].weight, data["河床演变因子"].matrix);
    let vec_f3 = multiply(data["岸坡特征因子"].weight, data["岸坡特征因子"].matrix);
    let vec_f4 = multiply(data["人类活动因子"].weight, data["人类活动因子"].matrix);
    let totalMatrix = [vec_f1, vec_f2, vec_f3, vec_f4];

    results.value[name] = multiply(w_fs, totalMatrix);
  }

  function calcAll() {
    for (var key in configData.value) {
      calc(key);
    }
  }

  //系数乘矩阵
  function multiply(vec, mat) {
    let newVec = [];
    vec.forEach((item, index) => {
      newVec;
    });

    //转置二维数组
    var res = [];
    for (var i = 0; i < mat[0].length; i++) {
      res[i] = [];
      for (var j = 0; j < mat.length; j++) {
        res[i][j] = mat[j][i];
      }
    }

    res.forEach((row) => {
      let sum = 0;
      row.forEach((item, index) => {
        sum += item * vec[index];
      });
      newVec.push(Number(sum.toFixed(2)));
    });

    return newVec;
  }

  return { configData, results, currentName, calcAll, calc, multiply, statuses };
})

export const nameStore = defineStore('name', () => {
  const currentName = ref("");

  const showBox = computed(() => {
    return currentName.value != ""
  })
  return { currentName, showBox };
})

