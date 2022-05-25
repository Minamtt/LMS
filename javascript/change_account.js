const token = getCookie("token");

var vm = new Vue({
    el:"#new_pwd",
    data:{
        modify: 'password',
        modifyArr: ['password', 'email'],
        username:"",
        email:"",
        pwd: '',
        verify_code:"",
        post_able:true,
        time_counter:Infinity,
        timer:undefined,
    },
    methods:{
        post_code_wait(){
            this.post_able = false;
            this.time_counter = 120;
            this.timer = setInterval(() => {
                if (this.time_counter > 1){
                    this.time_counter--;
                }
                else if (this.time_counter === 1){
                    this.post_able = true;
                    clearInterval(this.timer);
                }
            },2000);
        },
        post_code(){
            let that = this;
            if (this.check() && this.post_able){
                let post_data = {
                    userName:this.username,
                    mail:this.email
                }
                let pms = SendJSON("GET",`${serverHost}:8001/email/sendcode/${this.email}${this.modify === 'password' ? '/'+this.username : '/'}`, null, token);
                pms.then((value) => {
                    console.log(value)
                    if (value.code === 20000){
                        pop_up_tip("邮件发送成功",1);
                        that.post_code_wait();
                    } else {
                        pop_up_tip(value.message,0);
                    }
                },(reason) => {
                    pop_up_tip(reason,0);
                });
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
            if (this.pwd.length < 9){
                pop_up_tip("Password must be 9 letters or above.",0);
                return false;
            }
            return true;
        },
        submit(){
            let that = this;
            if(this.check()){
                if(this.modify === 'email') {
                    this.changeEmail()
                } else if(this.modify === 'password') {
                    this.changePwd()
                }
            }
        },
        changePwd() {
            let sendData = {
                userId: this.username,
                mail: this.email,
                password: this.pwd
            }
            let pms = SendJSON("POST",`${serverHost}:8001/email/changepassword/${this.verify_code}`, sendData, token);
            pms.then((value) => {
                if (value.code === 20000){
                    pop_up_tip("密码修改成功",1);
                    history.go(-1)
                } else{
                    pop_up_tip(value.message,0);
                }
            },(reason) => {
                pop_up_tip(reason,0);
            });
        },
        changeEmail() {
            let pms = SendJSON("GET",`${serverHost}:8001/email/changeemail/${this.email}/${this.verify_code}`, null, token);
            pms.then((value) => {
                if (value.code === 20000){
                    pop_up_tip("邮箱修改成功",1);
                    history.go(-1)
                } else{
                    pop_up_tip(value.message,0);
                }
            },(reason) => {
                pop_up_tip(reason,0);
            });
        }
    },
    
});