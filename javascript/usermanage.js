const vm = new Vue({
    el:"#main_container",
    data:{
        pages_total:1,
        currentPage:1,
        list:[],
        dialogTableVisible: false,
        barcode:"",
        search_for:""
    },
    methods:{
        viewBarcode(index){
            this.barcode = this.list[index].barcode_url;
            this.dialogTableVisible = true;
        },
        viewUser(index){
            location.href = `./account_manage.html?uid=${this.list[index].uid}`;
        },
        viewOrder(index){
            location.href = `./order_manage.html?uid=${this.list[index].uid}`;
        },
        deleteUser(index){
            console.log(this.list[index].uid);
            const pms = SendJSON("DELETE",`${serverHost}:8001/usercenter/deleteuser/${this.list[index].uid}`,null,token);
            pms.then((value) => {
                alert(value.message);
                history.go(0);
            },(reason) => {
                alert(reason);
            });
        },
        updateInfo(index){
            location.href = `./register.html?uid=${this.list[index].uid}`;
        },
        current_change(e){
            this.getUsers(e);
        },
        getUsers(page = 1){
            if (page === 1){
                this.currentPage = 1;
            }
            if (this.search_for.trim().length === 0){
                const pms = SendJSON("GET",`${serverHost}:8001/usercenter/getalluserinfo/${page}/12`,null,token);
                pms.then((value) => {
                    this.list = [];
                    for (let i of value.data.usersList){
                        let user = {
                            uid:i.userId,
                            email:i.mail,
                            type:i.type,
                            barcode_url:i.userBarcode
                        }
                        this.list.push(user);
                    }
                    this.pages_total = Math.ceil(value.data.total / 12);
                });
            }
            else {
                let sendmessage = {
                    userId:this.search_for,
                }
                const pms = SendJSON("POST",`${serverHost}:8001/usercenter/getuserbycondition`,sendmessage,token);
                pms.then((value) => {
                    this.list = [];
                    for (let i of value.data.userList){
                        let user = {
                            uid:i.userId,
                            email:i.mail,
                            type:i.type,
                            barcode_url:i.userBarcode
                        }
                        this.list.push(user);
                    }
                    this.pages_total = Math.ceil(value.data.total / 12);
                });
            }
            
        },
        searchUser(){
            this.getUsers();
        }
    },
    mounted(){
        this.getUsers();
    }
});