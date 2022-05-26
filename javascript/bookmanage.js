const vm = new Vue({
    el:"#main_container",
    data:{
        pages_total:5,
        currentPage:1,
        list:[],
        search_for:"",
        dialogTableVisible: false,
        barcode:""
    },
    methods:{
        search(){
            this.getBooks(1);
        },
        updatebook(index){
            location.href = `./book_alter.html?isbn=${this.list[index].isbn}`;
        },
        deletebook(index){
            const pms = SendJSON("DELETE",`${serverHost}:8002//bookservice/deletebook/${this.list[index].isbn}`,null,token);
            pms.then((value) => {
                alert(value.methods);
                this.getBooks(this.currentPage);
            },(reason) => {
                alert(reason);
            })
        },
        getBooks(page = 1){
            if (page === 1){
                this.currentPage = 1;
            }
            let sendmessage = {};
            if (this.search_for.trim().length > 0){
                sendmessage.searchName = this.search_for;
            }
            let pms = SendJSON("POST",`${serverHost}:8002/bookservice/booksearch/${page}/12`,sendmessage,token);
            pms.then((value) => {
                this.list = [];
                for (let i of value.data.booklist){
                    let book = {
                        isbn:i.isbn,
                        bookname:i.bookName,
                        price:i.bookPrice,
                        author:i.author,
                        category:i.categoryName,
                        number:i.bookNum,
                        barcode:i.isbnCode,
                    };
                    this.list.push(book);
                }
                this.pages_total = Math.ceil(value.data.total / 12);
            });
        },
        viewDetail(index){
            location.href = `./detail_manage.html?isbn=${this.list[index].isbn}`
        },
        current_change(e){
            this.getBooks(e);
        },
        viewBarcode(index){
            this.barcode = this.list[index].barcode;
            this.dialogTableVisible = true;
        }
    },
    mounted(){
        this.getBooks(1);
    }
});