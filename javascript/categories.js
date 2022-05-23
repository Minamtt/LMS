const search_for = getQueryVariable("search");
var vm = new Vue({
    el:"#main_container",
    data:{
        cates:[],
        cate1_pointer:0,
        cate2_pointer:0,
        currentPage:1,
        pages_total:4,
        books:[]
    },
    methods:{
        getBookDetail(number){
            location.href = `./bookdetail.html?isbn=${this.books[number].isbn}`;
        },
        changeCate1(index){
            this.cate1_pointer = index;
            this.cate2_pointer = 0;
            this.getBooks();
        },
        changeCate2(index){
            this.cate2_pointer = index;
            this.getBooks();
        },
        getBooks(page = 1){
            if (page === 1){
                this.currentPage = 1;
            }
            let sendmessage = {};
            if (search_for){
                let keyword = decodeURI(search_for)
                if (isConvertToNum(keyword)) {
                    sendmessage.isbn = keyword;
                } else {
                    sendmessage.searchName = keyword;
                }
            }
            if (this.cate1_pointer !== 0){
                sendmessage.parentID = this.cates[this.cate1_pointer - 1].categoryId;
            }
            if (this.cate2_pointer !== 0){
                sendmessage.categoryId = this.cates[this.cate1_pointer - 1].children[this.cate2_pointer  - 1].categoryId;
            }
            // 根据关键词搜索
            let pms = SendJSON("POST",`${serverHost}:8002/bookservice/booksearch/${page}/6`,sendmessage);
            pms.then((value) => {
                this.books = [];
                for (let i of value.data.booklist){
                    let book = {
                        isbn:i.isbn,
                        img_url:i.cover,
                        bookname:i.bookName,
                        author:i.author,
                        description:i.description
                    };
                    this.books.push(book);
                }
                this.pages_total = Math.ceil(value.data.total / 6);
            });
        },
        current_change(e){
            this.getBooks(e);
        }
    },
    computed:{
        cates1(){
            let arr = ["all"];
            let maxlen = this.cates.length;
            if (maxlen > 7){
                maxlen = 8;
            }
            for (let i = 0;i < maxlen;i++){
                arr.push(this.cates[i].categoryName);
            }
            return arr;
        },
        cates2(){
            let arr = ["all"];
            if (this.cate1_pointer === 0){
                return arr;
            }
            else {
                let maxlen = this.cates[this.cate1_pointer - 1].children.length;
                if (maxlen > 7){
                    maxlen = 7;
                }
                for (let i = 0;i < maxlen;i++){
                    arr.push(this.cates[this.cate1_pointer - 1].children[i].categoryName);
                }
            }
            return arr;
        }
    },
    watch:{

    },
    mounted(){
        const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getbookcategoryinfo`);
        pms.then((value) => {
            this.cates = value.data.parentCategories;
            const cateid = getQueryVariable("cateid");
            if (cateid){
                for (let i = 0;i < 5;i++){
                    if (this.cates[i].categoryId === cateid){
                        this.cate1_pointer = i + 1;
                        break;
                    }
                }
            }
            
            this.getBooks();
        },(reason) => {
            console.error(reason);
        });
    }
})