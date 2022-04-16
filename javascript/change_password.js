var vm = new Vue({
    el:"#new_pwd",
    data:{
        username:"",
        email:"",
        newpswd:"",
        newpswd_guarentee:"",
        verify_code:"",

        post_able:true,
        time_counter:Infinity,
        timer:undefined
    },
    methods:{
        post_code_wait(){
            this.post_able = false;
            this.time_counter = 60;
            verify_code.innerHTML = `重新发送(${this.time_counter})`;
            verify_code.style.color = "#AAAAAA";
            this.timer = setInterval(() => {
                if (this.time_counter > 1){
                    this.time_counter--;
                    verify_code.innerHTML = `重新发送(${this.time_counter})`;
                }
                else if (this.time_counter === 1){
                    verify_code.style.color = "rgb(60, 132, 214)";
                    verify_code.innerHTML = "重新发送";
                    this.post_able = true;
                    clearInterval(this.timer);
                }
            },1000);
        },
        post_code(){
            let that = this;
            if (this.check() && this.post_able){
                let post_data = {
                    userName:this.username,
                    mail:this.email
                }
                const xhr = new XMLHttpRequest();
                xhr.open("post","http://47.108.137.135:8001/email/sendcode");
                xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
                xhr.send(JSON.stringify(post_data));
                xhr.onreadystatechange = function() {
                    if(xhr.readyState === 4) 
                    {
                        if(xhr.status >= 200 && xhr.status < 300)
                        {
                            let received = JSON.parse(xhr.response);
                            if (received.code === 20000){
                                pop_up_tip("邮件发送成功",1);
                                that.post_code_wait();
                            }
                            else{
                                pop_up_tip(received.message,0);
                            }
                        }
                    }
                }
            }
        },
        check(){
            if (this.username.length < 3){
                pop_up_tip("User name must be 3 letters or above.",0);
                return false;
            }
            if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(this.email)){
                pop_up_tip("Invalid e-mail address.",0);
                return false;
            }
            if (this.newpswd.length < 9){
                pop_up_tip("Password must be 9 letters or above.",0);
                return false;
            }
            if (this.newpswd_guarantee !== this.password){
                pop_up_tip("确认密码与原密码不一致",0);
                return false;
            }
            return true;
        },
        submit(){
            let that = this;
            if(this.check()){
                let post_data = {
                    userName:this.username,
                    mail:this.email,
                    passWord:this.newpswd
                }
                const xhr = new XMLHttpRequest();
                xhr.open("post","http://47.108.137.135:8001/email/checkandchange/" + this.verify_code);
                xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
                xhr.send(JSON.stringify(post_data));
                xhr.onreadystatechange = function() {
                    if(xhr.readyState === 4) 
                    {
                        if(xhr.status >= 200 && xhr.status < 300)
                        {
                            let received = JSON.parse(xhr.response);
                            if (received.code === 20000){
                                pop_up_tip("密码修改成功",1);
                                that.userName = "";
                                that.email="";
                                that.newpswd="";
                                that.newpswd_guarentee="";
                                that.verify_code="";

                            }
                            else{
                                pop_up_tip(received.message,0);
                            }
                        }
                    }
                }
            }
        }
    },
    
});