// 扫码类
class ScanCode {
  constructor(scanCallback) {
    this.lastKeyCode = ""
    this.keycode = ""
    this.lastTime = null
    this.lastCode = null
    // 获取扫描信息的回调函数
    this.scanCallback = scanCallback
    // 箭头函数保持 this 指向
    document.onkeydown = (e) => {this.scanInput(e)}
  }

  scanInput(e) {
    let nextCode = null
    let nextTime = null

    // 获取输入
    if (window.event) {
      nextCode = e.keyCode
    } else if (e.which) {
      nextCode = e.which
    }
    // 当前时间
    nextTime = new Date().getTime()

    // 扫码枪输入格式为 code + enter
    if (nextCode === 13 && this.keycode !== "" && nextTime - this.lastTime <= 30) {   // 扫码枪末尾输入回车，结束输入
      // 将扫码得到输入传递给回调函数
      this.lastKeyCode = String(this.keycode)
      this.scanCallback(this.lastKeyCode)
      this.keycode = ""
      this.lastCode = null
      this.lastTime = null
    } else {
      if (this.lastCode === null && this.lastTime === null) {   // 扫码枪输入的第一个字母
        this.keycode = String.fromCharCode(nextCode)
      } else if (this.lastCode !== null && this.lastTime !== null && nextTime - this.lastTime <= 30) {   // 扫码枪输入的中间字母
        this.keycode += String.fromCharCode(nextCode)
      } else {    // 手动输入
        this.keycode = ""
        this.lastCode = null
        this.lastTime = null
      }
      this.lastCode = nextCode
      this.lastTime = nextTime
    }
  }
}