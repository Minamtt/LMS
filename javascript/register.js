var vm = new Vue({
    el:"form",
    data:{
        username:"",
        password:"",
        password_guarantee:"",
        email:"",
        agree_term:false
    },
    methods:{
        post(){
            let post_data = {
                userName:this.username,
                passWord:this.password,
                mail:this.email,
            };
            const xhr = new XMLHttpRequest();
            xhr.open("post","http://47.108.137.135:8001/usercenter/regist");
            xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
            xhr.send(JSON.stringify(post_data));
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) 
                {
                    if(xhr.status >= 200 && xhr.status < 300)
                    {
                        let received = JSON.parse(xhr.response);
                        if (received.code === 20000){
                            pop_up_tip(received.message,1);
                            setTimeout(()=>{
                                window.location.href = "./index.html";
                            },1000);
                        }
                        else{
                            pop_up_tip(received.message,0);
                        }
                    }
                }
            }
        },
        submit(){
            if (this.username.length < 3){
                pop_up_tip("User name must be 3 letters or above.",0);
                return;
            }
            if (this.password.length < 9){
                pop_up_tip("Password must be 9 letters or above.",0);
                return;
            }
            if (this.password_guarantee !== this.password){
                pop_up_tip("确认密码与原密码不一致",0);
                return;
            }
            if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(this.email)){
                pop_up_tip("Invalid e-mail address.",0);
                return;
            }
            if (!this.agree_term){
                pop_up_tip("请勾选“同意网站服务条款”",0);
                return;
            }
            this.post();
        }
    }
})