var vm = new Vue({
    el:"#logincontainer",
    data:{
        tipMessage:"",
        username:"",
        password:""
    },
    methods:{
        post(){
            let that = this;
            let post_data = {
                userName:this.username,
                passWord:this.password
            }
            const xhr = new XMLHttpRequest();
            let getted = false;
            xhr.open("post","http://47.108.137.135:8001/usercenter/login");
            xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
            xhr.send(JSON.stringify(post_data));
            this.doTip("请求已发送，等待服务器响应...");

            let timer = setTimeout(() => {
                if (!getted){
                    pop_up_tip("服务器响应超时",0);
                    this.tipMessage = "";
                }
            },3000);

            xhr.onreadystatechange = function() {
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
                            window.location.href = "./mainpage.html";
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
});