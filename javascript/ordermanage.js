const vm = new Vue({
    el:"#main_container",
    data:{
        pages_total:1,
        currentPage:1,
        uid:"",
        list:[],
    },
    methods:{
        current_change(e){
            this.getOrders(e);
        },
        getOrders(page = 1){
            if (page === 1){
                this.currentPage = 1;
            }
            const pms = SendJSON("GET",`${serverHost}:8004/pay/getorderhistory/${this.uid}/${page}/12`,null,token);
            pms.then((value) => {
                this.list = [];
                for (let i of value.data.orders){
                    let item = {
                        orderId:i.orderId,
                        price:i.price,
                        createTime:i.createTime,
                        finishTime:i.finishTime
                    };
                    this.list.push(item);
                }
                this.pages_total = Math.ceil(value.data.total / 12);
            });
        },
    },
    mounted(){
        this.uid = getQueryVariable("uid");
        const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getuserdebt`,null,token);
        pms.then((value) => {
            this.debt = value.data.debt;
        });
        this.getOrders(1);
    }
});