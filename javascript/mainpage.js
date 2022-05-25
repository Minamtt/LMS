let category_arrs = category_list.getElementsByTagName("li");
let window_arrs = category_list.getElementsByClassName("category_window");
function change_color(){
    for (let i = 0;i < category_arrs.length;i++){
        category_arrs[i].style.backgroundColor = "#ECF0F0";
    }
}
for (let i = 0;i <window_arrs.length;i++){
    window_arrs[i].onmouseleave = function(){
        window_arrs[i].style.visibility = "hidden";
        category_arrs[i].style.backgroundColor = "#ECF0F0";
    }
}
for (let i = 0;i < category_arrs.length;i++){
    category_arrs[i].onmouseover = function(){
        category_arrs[i].style.backgroundColor = "orange";
        window_arrs[i].style.visibility = "visible";
    }
    category_arrs[i].onmouseleave = function(e){
        if (e.layerY <= i*92 || e.layerY >= (i+1)*92 || e.layerX <= 8){
            window_arrs[i].style.visibility = "hidden";
            category_arrs[i].style.backgroundColor = "#ECF0F0";
        }
    }
}


var hot_books = new Vue({
    el:"#hot_container",
    data:{
        hotest:{
            img_url:"http://api.jisuapi.com/isbn/upload/e3/169f585cebac39.jpg",
            bookname:"计算机网络",
            author:" (美) 詹姆斯·F. 库罗斯 (James F. Kuro",
            link:"./bookdetail.html?isbn=9787111599715"
        },
        hot_books:[
            {
                bookname:"Effective C++",
                isbn:1
            },
            {
                bookname:"Effective C#",
                isbn:2
            },
            {
                bookname:"Effective Java",
                isbn:3
            },
            {
                bookname:"Effective Python",
                isbn:4
            }
        ]
    },
    computed:{
        hot_book_links(){
            let links = [];
            let search_url = "./bookdetail.html";
            for (let i of this.hot_books){
                links.push(`${search_url}?isbn=${i.isbn}`);
            }
            return links;
        }
    },
    mounted(){
        let pms = SendJSON("POST",`${serverHost}:8002/bookservice/booksearch/1/5`,{});
        pms.then((value) => {
            this.hotest = {
                img_url:value.data.booklist[0].cover,
                bookname:value.data.booklist[0].bookName,
                author:value.data.booklist[0].author,
                link:`./bookdetail.html?isbn=${value.data.booklist[0].isbn}`
            }
            this.hot_books = [];
            for (let j = 1; j <= 4;j++){
                let i = value.data.booklist[j];
                let book = {
                    isbn:i.isbn,
                    bookname:i.bookName,
                };
                this.hot_books.push(book);
            }
        });
    }
})
var recommends = new Vue({
    el:"#recommend",
    data:{
        recommend_books:[{},{},{},{},{}]
    },
    methods:{

    },
    computed:{
        recommend_links(){
            let links = [];
            let search_url = "./bookdetail.html";
            for (let i of this.recommend_books){
                links.push(`${search_url}?isbn=${i.isbn}`);
            }
            return links;
        }
    },
    mounted(){
        let pms = SendJSON("POST",`${serverHost}:8002/bookservice/booksearch/1/5`,{});
        pms.then((value) => {
            this.recommend_books = [];
            for (let j = 0;j < 5;j++){
                let i = value.data.booklist[j];
                let book = {
                    img_url:i.cover,
                    isbn:i.isbn,
                    bookname:i.bookName,
                    author:i.author,
                };
                this.recommend_books.push(book);
            }
        });
    }
});

var usertip = new Vue({
    el:"#news_container",
    data:{
        usermessage: [],
    },
    mounted(){
        let pms = SendJSON("GET",`${serverHost}:8002/bookservice/getNotification`,null,token);
        pms.then((value) => {
            this.usermessage = value.data.notification;
        });
    },
    computed: {
        borrowDueNum() {
            return this.usermessage.filter((item, i) => item.state === 0).length
        },
        reserveDueNum() {
            return this.usermessage.filter((item, i) => item.state === 1).length
        },
        fineDueNum() {
            return this.usermessage.filter((item, i) => item.state === 2).length
        }
    },
    methods: {
        toNotice() {
            navTo('./notification.html')
        }
    }
});

var catelist = new Vue({
    el:".category_list_container",
    data:{
        cates:[],
    },
    methods:{
        findCate(index){
            window.location.href = `./categories.html?cateid=${this.cates[index].categoryId}`;
        }
    },
    mounted(){
        let pms =  SendJSON("GET",`${serverHost}:8002/bookservice/getbookcategoryinfo`);
        pms.then((value) => {
            for (let i = 0;i < Math.min(5,value.data.parentCategories.length);i++){
                this.cates.push(value.data.parentCategories[i]);
            }
        });
    }
});

var carousel = new Vue({
    el:".pic",
    data:{
        pointer:0,
        booklist:[],
        timer:null,
    },
    methods:{
        change(i){
            this.pointer = i;
            clearInterval(this.timer);
            this.timer = null;
            this.setTimer();
        },
        go(){
            location.href = `./bookdetail.html?isbn=${this.isbn}`;
        },
        setTimer(){
            this.timer = setInterval(() => {
                if (this.pointer >= 3){
                    this.pointer = 0;
                }
                else {
                    this.pointer++;
                }
            },2500);
        }
    },
    computed:{
        img_url(){
            if (this.booklist.length > 0){
                return this.booklist[this.pointer].img_url;
            }
        },
        isbn(){
            if (this.booklist.length > 0){
                return this.booklist[this.pointer].isbn;
            }
        },
        stylelist(){
            let arr = ["dot","dot","dot","dot"];
            arr[this.pointer] = "dot dot_selected";
            return arr;
        }
    },
    mounted(){
        let pms = SendJSON("POST",`${serverHost}:8002/bookservice/booksearch/1/4`,{});
        pms.then((value) => {
            this.booklist = [];
            for (let j = 0;j < 4;j++){
                let i = value.data.booklist[j];
                let book = {
                    img_url:i.cover,
                    isbn:i.isbn,
                };
                this.booklist.push(book);
            }
        });
        this.setTimer();
    },
});