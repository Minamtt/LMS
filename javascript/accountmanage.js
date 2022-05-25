const vm = new Vue({
    el:"#main_container",
    data:{
        pages_total:1,
        currentPage:1,
        uid:"",
        username:"",
        debt:"",
        list:[],
        bookStateName: ['Normal', 'Borrowed', 'Lost', 'Damaged', 'Normal']
    },
    methods:{
        returnBook(index) {
            // 保存书籍二维码
            localStorage.scanMsg = JSON.stringify({
                mode: 1,
                barcode: this.list[index].barcode
            })
            // 导航到借书面板
            navTo('./return_manage.html')
        },
        current_change(e){
            this.getBorrowedBooks(e);
        },
        getBorrowedBooks(page = 1){
            if (page === 1){
                this.currentPage = 1;
            }
            const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getborrowinfo/${this.uid}`,null,token);
            pms.then((value) => {
                this.list = [];
                for (let i of value.data.borrowList){
                    let item = {
                        bookId:i.bookId,
                        borrowId:i.borrowId,
                        bookName:i.bookName,
                        createTime:i.createTime,
                        dueTime:i.dueTime,
                        state:Number.parseInt(i.state),
                        bookState: i.bookState,
                        barcode: i.url
                    };
                    item.debt = 0;
                    item.debt = 0;
                    if (item.state < 0){
                        item.debt = Math.max(0,-item.state);
                    }
                    this.list.push(item);
                }
                // this.pages_total = Math.ceil(value.data.total / 12);
            });
        },
    },
    mounted(){
        this.uid = getQueryVariable("uid");
        const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getuserdebt/${this.uid}`,null,token);
        pms.then((value) => {
            this.debt = value.data.debt;
        });
        this.getBorrowedBooks();
    }
});