const vm = new Vue({
    el:"#main_container",
    data:{
        pages_total:1,
        currentPage:1,
        bookname:"",
        isbn:"",
        number:"",
        list:[
            {
                bookid:123456,
                state:23,
                borrower:"wang",
                barcode:"./img/barcode.png"
            }
        ],
        barcode:"",
        dialogTableVisible:false
    },
    methods:{
        current_change(e){
            this.getBorrowedBooks(e);
        },
        getBooks(page = 1){
            if (page === 1){
                this.currentPage = 1;
            }
            const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getisbnbooklist/${this.isbn}`,null,token);
            pms.then((value) => {
                console.log(value);
                this.list = [];
                for (let i of value.data.booklist){
                    let item = {
                        bookid:i.bookId,
                        state:i.state,
                        borrower:i.uid,
                        barcode:i.url
                    };
                    this.list.push(item);
                }
                this.pages_total = Math.ceil(value.data.total / 12);
            });
        },
        viewBarcode(index){
            this.barcode = this.list[index].barcode;
            this.dialogTableVisible = true;
        },
        deletebook(index){
            const pms = SendJSON("DELETE",`${serverHost}:8002/bookservice/deletebook/${this.list[index].bookid}`,null,token);
            pms.then((value) => {
                alert(value.message);
                this.getBooks();
            },(reason) => {
                alert(reason);
            });
        }
    },
    mounted(){
        this.isbn = getQueryVariable("isbn");
        let pms = SendJSON("GET",`${serverHost}:8002//bookservice/getbookinfobyisbn/${this.isbn}`,null,token);
        pms.then((value) => {
            this.bookname = value.data.bookInfo.bookName;
            this.number = value.data.bookInfo.bookNum;
        });
        this.getBooks();
    }
});