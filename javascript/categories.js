var vm0 = new Vue({
    el:"#main_container",
    data:{
        currentPage:1,
        pages_total:4,
        books:[
            {
                ISBN:"6",
                img_url:"./img/e.jpg",
                bookname:"Yuri is master!",
                author:"Yuri",
                description:"Be one with Yuri!"
            },
            {
                ISBN:"7",
                img_url:"./img/e2.jpg",
                bookname:"How is it going?",
                author:"Macheal Bilnt",
                description:"No Description."
            },
            {
                ISBN:"9",
                img_url:"./img/e3.jpg",
                bookname:"How is it going?",
                author:"Macheal Bilnt",
                description:"No Description."
            }
        ]
    },
    methods:{
        getBookDetail(number){
            location.href = `./bookdetail.html?isbn=${this.books[number].ISBN}`;
        }
    },
    mounted(){
        
    }
})