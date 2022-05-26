const vm = new Vue({
    el:"#user_reg",
    data:{
        password:""
    },
    methods:{
        submit(){
            let sendmessage = {
                userName:"admin",
                passWord:this.password
            }
            const pms = SendJSON("POST",`${serverHost}:8001//usercenter/login`,sendmessage);
            pms.then((value) => {
                let token = value.data.token;
                let time = new Date();
                time.setTime(time.getTime() + 21600000);    //cookie持续六个小时
                document.cookie = `token=${token};expires=${time.toGMTString()}`;
                location.href = "./book_manage.html";
            },(reason) => {
                pop_up_tip(reason,0); 
            });
        }
    }
})