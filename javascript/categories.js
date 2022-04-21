var vm = new Vue({
    el:"#main_container",
    data:{
        cates:[
            {
                categoryID:1,
                categoryName:"Education",
                children:[
                    {
                        categoryID:101,
                        categoryName:"Family"
                    },
                    {
                        categoryID:102,
                        categoryName:"Children"
                    },
                    {
                        categoryID:103,
                        categoryName:"Primary School"
                    }
                ]
            },
            {
                categoryID:2,
                categoryName:"Novel",
                children:[
                    {
                        categoryID:201,
                        categoryName:"Western"
                    },
                    {
                        categoryID:202,
                        categoryName:"Chinese"
                    },
                    {
                        categoryID:203,
                        categoryName:"Arabric"
                    }
                ]
            }
        ],
        cate1_pointer:0,
        cate2_pointer:0,
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
        },
        changeCate1(index){
            this.cate1_pointer = index;
            this.cate2_pointer = 0;
        },
        changeCate2(index){
            this.cate2_pointer = index;
        }
    },
    computed:{
        cates1(){
            let arr = ["all"];
            let maxlen = this.cates.length;
            if (maxlen > 5){
                maxlen = 5;
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
                if (maxlen > 5){
                    maxlen = 5;
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
        
    }
})