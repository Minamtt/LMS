const token = getCookie("token");
const vm = new Vue({
    el:".main_container",
    data:{
        showall:false,
        uid:123456789,
        debt:12,
        list:[],
        available:true,
        btnstyle:"",
    },
    methods:{
        getBorrowedBooks(){
            const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getborrowinfo`,null,token);
            pms.then((value) => {
                this.list = [];
                for (let i of value.data.borrowList){
                    let item = {
                        bookId:i.bookId,
                        borrowId:i.borrowId,
                        bookName:i.bookName,
                        createTime:i.createTime,
                        dueTime:i.dueTime,
                        state:i.state
                        // debt:
                    };
                    item.debt = 0;
                    if (item.state < 0){
                        item.debt = Math.max(0,-item.state);
                    }
                    
                    this.list.push(item);
                }
            });
        },
        conti(index){
            const pms = SendJSON("GET",`${serverHost}:8002/bookservice/addduetime/${this.list[index].bookId}`,null,token);
            pms.then((value) => {
                alert(value.message);
                this.getBorrowedBooks();
            },(reason) => {
                alert(reason);
            })
            
        },
        paydebt(){
            location.href = "./pay.html";
        }
    },
    mounted(){
        const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getuserdebt`,null,token);
        pms.then((value) => {
            if (value.data.debt === 0){
                this.available = false;
                this.btnstyle = "background-color:#AAAAAA";
            }
            this.debt = value.data.debt;
        });
        const pms2 = SendJSON("GET",`${serverHost}:8001/usercenter/getuserinfo`,"",token);
        pms2.then((value) =>{
            this.uid = value.data.userInfo.userId;
        });
        this.getBorrowedBooks();
    }
});