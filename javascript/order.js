const token = getCookie("token");
const vm = new Vue({
    el:".main_container",
    data:{
        uid:"",
        list:[]
    },
    methods:{
        getOrders(){
            const pms = SendJSON("GET",`${serverHost}:8004/pay/getorderhistory/1/64`,null,token);
            pms.then((value) => {
                this.list = [];
                for (let i of value.data.orders){
                    let record = {
                       orderId:i.orderId,
                       price:i.price,
                       createTime:i.createTime,
                       finishTime:i.finishTime,
                    }
                    this.list.push(record);
                }
            });
        },
    },
    mounted(){
        const pms2 = SendJSON("GET",`${serverHost}:8001/usercenter/getuserinfo`,"",token);
        pms2.then((value) =>{
            this.uid = value.data.userInfo.userId;
        });
        this.getOrders();
    }
});