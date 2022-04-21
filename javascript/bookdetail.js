const vm = new Vue({
    el:"#main_container",
    data:{
        button_message:"Borrow",
        button_available:true,
        button_style:"",
        book:{
            ISBN:"0",
            img_src:"",
            bookname:"No Name",
            author:"",
            publisher:"",
            cate0:"",
            cate1:"",
            description:"",
            price:888.88,
            total:400,
            remain:40
        }
    },
    methods:{
        borrowBook(){
            if (button_available){
                
            }
        }
    },
    mounted(){
        if (!token){
            this.button_available = false;
            this.button_message = "Not logged in";
            this.button_style = "background-color: #AAAAAA";
        }
        this.ISBN = getQueryVariable("isbn");
    }
});