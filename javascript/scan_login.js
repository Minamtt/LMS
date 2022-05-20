new Vue({
  el: '#scan_login',
  data: {
    scanOK: false,
    userId: '',
    tipMessage: '',
    userBarcode: 'https://edu6666.oss-cn-beijing.aliyuncs.com/barcode/2022/05/04/7f2ec9b9e5354937b99613ecd9765cf1frx.jpg',
  },
  mounted() {
    // 监听扫码事件
    new ScanCode(this.handleScan)
  },
  methods: {
    toMainPage() {
      navTo('./mainpage.html')
    },
    handleScan(userId) {
      this.userId = userId
      this.scanOK = true
    },
    handleSubmit() {
      if(this.userId) {
        localStorage.userMsg = JSON.stringify({
          userId: this.userId
        })
        this.login()
      }
    },
    login(){
      let that = this;
      let post_data = {}
      const xhr = new XMLHttpRequest();
      let getted = false;
      xhr.open("post", `http://47.108.137.135:8001/usercenter/login/${this.userId}`);
      xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
      xhr.send(JSON.stringify(post_data));
      this.doTip("请求已发送，等待服务器响应...");

      let timer = setTimeout(() => {
        if (!getted){
          pop_up_tip("服务器响应超时",0);
          this.tipMessage = "";
        }
      },3000);

      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4)
        {
          if(xhr.status >= 200 && xhr.status < 300)
          {
            getted = true;
            let received = JSON.parse(xhr.response);
            that.doTip(" ");

            if (received.code === 20000){
              let token = received.data.token;
              let time = new Date();
              time.setTime(time.getTime() + 21600000);    //cookie持续六个小时
              document.cookie = `token=${token};expires=${time.toGMTString()}`;
              this.toMainPage()
            }
            else{
              pop_up_tip(received.message,0);
            }
          }
          else
          {
            this.doTip("服务器错误");
          }
        }
      }
    },
    doTip(tip_mess){
      this.tipMessage = tip_mess;
    }
  }
})