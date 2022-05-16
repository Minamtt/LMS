const token = getCookie("token");
var vm = new Vue({
    el:"form",
    data:{
        userId:"",
        password:"",
        email:"",
        type:"0",
        mode:0
    },
    methods:{
        post(){
            let post_data = {
                userId:this.userId,
                password:this.password,
                mail:this.email,
                type:Number.parseInt(this.type)
            };
            const pms = SendJSON("POST",`${serverHost}:8001/usercenter/regist`,post_data,token);
            pms.then((value) => {
                pop_up_tip(value.message,1);
                location.href = "./index.html";
            },(reason) => {
                pop_up_tip(reason,0);
            });
        },
        submit(){
            if (this.userId.length < 3){
                pop_up_tip("User name must be 3 letters or above.",0);
                return;
            }
            if (this.password.length < 9){
                pop_up_tip("Password must be 9 letters or above.",0);
                return;
            }
            if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(this.email)){
                pop_up_tip("Invalid e-mail address.",0);
                return;
            }
            this.post();
        }
    },
    mounted(){
        let uid = getQueryVariable("uid");
        if (uid){
            this.mode = 1;
        }
        if (this.mode === 1){
            const pms = SendJSON("GET",`${serverHost}:8001/usercenter/getuserinfo/${uid}`,null,token);
            pms.then((value) =>{
            this.userId = value.data.userInfo.userId;
            this.email = value.data.userInfo.mail;
            this.type = value.data.userInfo.type;
        });
        }
    }
})