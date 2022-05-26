// 工具类函数

// 拼接路径字符串
function concatPath(pathArr, split) {
  return pathArr.join(split)
}

// 判断字符串是否能转换为数字
function isConvertToNum(str) {
  let flag = false
  if(str !== '' && Number.isInteger(Number(str))) {
    flag = true
  }
  return flag
}