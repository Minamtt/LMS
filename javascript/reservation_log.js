const token = getCookie("token");
const vm = new Vue({
    el:".main_container",
    data:{
        uid:"",
        list:[]
    },
    methods:{
        getReservations(){
            const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getReservationsList`,null,token);
            pms.then((value) => {
                this.list = [];
                if (value.data.reservations.length > 0){
                    this.uid = value.data.reservations[0].uid;
                }
                for (let i of value.data.reservations){
                    let record = {
                        reservationId:i.reservationId,
                        createTime:i.createTime,
                        state:i.state,
                        bookname:i.bookName
                    }
                    this.list.push(record);
                }
            });
        },
        cancel(index){
            const pms = SendJSON("GET",`${serverHost}:8002/bookservice/cancelReservation/${this.list[index].reservationId}`,null,token);
            pms.then((value) => {
                alert(value.message);
                this.getReservations();
            },(reason) => {
                alert(reason);
            })
        }
    },
    mounted(){
        const pms2 = SendJSON("GET",`${serverHost}:8001/usercenter/getuserinfo`,"",token);
        pms2.then((value) =>{
            this.uid = value.data.userInfo.userId;
        });
        this.getReservations();
    }
});