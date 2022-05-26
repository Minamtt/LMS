const vm = new Vue({
    el:"#main_container",
    data:{
        borrowed:6,
        currentPage:1,
        pages_total:4,
        books:[
            // {
            //     isbn:"6",
            //     img_url:"./img/e.jpg",
            //     bookname:"Yuri is master!",
            //     author:"Yuri",
            //     overdue:false,
            //     last_time:30
            // },
            // {
            //     isbn:"7",
            //     img_url:"./img/e2.jpg",
            //     bookname:"How is it going?",
            //     author:"Macheal Bilnt",
            //     overdue:false,
            //     last_time:2
            // },
            // {
            //     isbn:"9",
            //     img_url:"./img/e3.jpg",
            //     bookname:"How is it going?",
            //     author:"Macheal Bilnt",
            //     overdue:true,
            //     last_time:-2
            // }
        ],
        total:0
    },
    methods:{
        getBookDetail(number){
            location.href = `./bookdetail.html?isbn=${this.books[number].isbn}`;
        },
        getBorrowedBooks(page){
            const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getborrowedhistory/${page}/6`,"",token);
            pms.then((value) => {
                this.books = [];
                for (let i of value.data.borrowlist){
                    let book = {
                        isbn:i.isbn,
                        img_url:i.cover,
                        bookname:i.bookName,
                        author:i.author,
                        description:i.description
                    };
                    this.books.push(book);
                }
                this.total = value.data.total;
                this.pages_total = Math.trunc(this.total / 6);
            });
        },
        current_change(e){
            this.getBorrowedBooks(e);
        }
    },
    computed:{
        be_overdue(){
            return this.books.filter(book => book.overdue).length;
        }
    },
    mounted(){
        this.getBorrowedBooks(1);
    }
});