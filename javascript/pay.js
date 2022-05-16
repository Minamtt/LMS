const token = getCookie("token");
var vm = new Vue({
    el:"#new_payment",
    data:{
        price:"",
        orderId:"",
        bincode:"",
        timer:null,
        remain_time:180,
    },
    methods:{
        listen(){
            this.timer = setInterval(() => {
                let status = SendJSON("GET",`${serverHost}:8004/pay/paydebt/getstatus/${this.orderId}`,null);
                status.then((value) => {
                    alert(value.message);
                    clearInterval(this.timer);
                    this.timer = null;
                    history.go(-1);
                },(reason) => {
                    
                });
            },2000);
        }
    },
    mounted(){
        var pms = SendJSON("GET",`${serverHost}:8004/pay/paydebt/ali`,null,token);
        pms.then((value) => {
            this.orderId = value.data.orderId;
            this.price = value.data.price;
            this.bincode = value.data.url;
            this.listen();
        },(reason) => {
            alert(reason);
            history.go(-1);
        });
        setInterval(() => {
            if (this.remain_time > 1){
                this.remain_time--;
            }
            else {
                history.go(0);
            } 
        },1000);
    }
})