const vm = new Vue({
    el:"#main_container",
    data:{
        pages_total:5,
        currentPage:1,
        list:[],
        statistic: {},
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
            const pms = SendJSON("DELETE",`${serverHost}:8002//bookservice/deletebookbyisbn/${this.list[index].isbn}`,null,token);
            pms.then((value) => {
                alert(value.methods || 'success');
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
                let keyword = decodeURI(this.search_for)
                if (isConvertToNum(keyword)) {
                    sendmessage.isbn = keyword;
                } else {
                    sendmessage.searchName = keyword;
                }
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
                        category:concatPath([i.parentName, i.categoryName], '/'),
                        area:concatPath([i.parentLocation, i.location], '-'),
                        number:i.bookNum,
                        barcode:i.isbnCode,
                    };
                    this.list.push(book);
                }
                this.pages_total = Math.ceil(value.data.total / 12);
            });
        },
        getStatistic() {
            let pms = SendJSON("GET",`${serverHost}:8002/bookservice/getstatistics`,null,token);
            pms.then((value) => {
                this.statistic = {
                    totDebt: value.data.totDebt,
                    totBorrower: value.data.totBorrower,
                    totOrder: value.data.totOrder,
                    totDamaged: value.data.totDamaged,
                    totBook: value.data.totBook,
                    totLost: value.data.totLost
                }
            })
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
        this.getStatistic();
        this.getBooks(1);
    }
});