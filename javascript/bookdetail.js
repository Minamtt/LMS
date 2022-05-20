const vm = new Vue({
    el:"#main_container",
    data:{
        button_available:true,
        button_style:"",
        book:{
            isbn:"0",
            img_src:"",
            bookname:"No Name",
            author:"",
            publisher:"",
            cate0:"",
            cate1:"",
            description:"",
            price:888.88,
            total:400,
            remain:40,
            location:"",
        },
        selection:[],
        selected:""
    },
    methods:{
        subscribe(){
            if (this.button_available){
                let pms = SendJSON("GET",`${serverHost}:8002/bookservice/reserveBook/${this.selected}`,null,token);
                pms.then((value) => {
                    alert(value.message);
                    this.getEachBooks();
                },(reason) => {
                    alert(reason);
                });
            }
        },
        borrowBook(){
            if (this.button_available){
                // 保存书籍二维码
                localStorage.scanMsg = JSON.stringify({
                    mode: 0,
                    barcode: this.book.barcode
                })
                // 导航到借书面板
                navTo('/rjgc/scan_borrow.html', {menu: 'board'})
            }
        },
        getEachBooks(){
            let pms2 = SendJSON("GET",`${serverHost}:8002/bookservice/getavailablelist/${this.isbn}`,null,token);
            pms2.then((value) => {
                this.selection = [];
                for (let i of value.data.booklist){
                    let _book = {
                        value:i.bookId,
                        label:i.bookId
                    }
                    this.selection.push(_book);
                }
                if (this.selection.length > 0){
                    this.selected = this.selection[0].value;
                }
            });
        },
        getBookDetail(){
            let pms = SendJSON("GET",`${serverHost}:8002/bookservice/getbookinfobyisbn/${this.isbn}`,null,token);
            pms.then((value) => {
                this.book.isbn = value.data.bookInfo.isbn;
                this.book.img_src = value.data.bookInfo.cover;
                this.book.bookname = value.data.bookInfo.bookName;
                this.book.author = value.data.bookInfo.author;
                this.book.publisher = value.data.bookInfo.publisher;
                this.book.cate0 = value.data.bookInfo.parentName;
                this.book.cate1 = value.data.bookInfo.categoryName;
                this.book.description = value.data.bookInfo.description;
                this.book.price = value.data.bookInfo.bookPrice;
                this.book.total = value.data.bookInfo.bookNum;
                this.book.remain = value.data.bookInfo.bookRemain;
                this.book.location = value.data.bookInfo.location;
                this.book.barcode = value.data.bookInfo.isbnCode;
                this.getEachBooks();
            });
        }
    },
    mounted(){
        if (!token){
            this.button_available = false;
            this.button_style = "background-color: #AAAAAA";
        }
        this.isbn = getQueryVariable("isbn");
        this.getBookDetail();
    }
});