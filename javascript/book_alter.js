const token = getCookie("token");
const required_isbn = getQueryVariable("isbn");
const vm = new Vue({
    el:"#update_book",
    data:{
        isbn:"",
        bookdetail:{
            bookname:"",
            author:"",
            publisher:"",
            price:""
        },
        cates:[],
        parent_category:-1,
        child_category:-1,
        new_parent_category:"",
        new_child_category:"",
        number:1,
        area:"",
        loCation:"",
        mode:0  //0 -> add， 1 -> update
    },
    methods:{
        checkISBN(){
            let pms = SendJSON("GET",`${serverHost}:8002/bookservice/getbookinfobyisbn/${this.isbn}`);
            pms.then((value) => {
                this.bookdetail.bookname = value.data.bookInfo.bookName;
                this.bookdetail.author = value.data.bookInfo.author;
                this.bookdetail.price = value.data.bookInfo.bookPrice;
                this.bookdetail.publisher = value.data.bookInfo.publisher;
            },(reason) => {
                alert(reason);
            });
        },
        submit(){
            if (this.isbn.length === 0){
                alert("please input isbn");
                return;
            }
            if (this.loCation.length === 0){
                alert("please input location");
                return;
            }
            if (
                    (this.available1 && this.new_parent_category.trim().length === 0) || 
                    (this.available2 && this.new_child_category.trim().length === 0)
                ){
                alert("please input category name.");
                return;
            }
            let sendmessage = {
                isbn:this.isbn,
                location:this.loCation,
                num:Number.parseInt(this.number),
            };
            if (this.parent_category === -1){
                sendmessage.parentName = this.new_parent_category;
            }
            else{
                sendmessage.parentName = this.cates.filter((i) => i.categoryId === this.parent_category)[0].categoryName;
            }

            if (this.child_category === -1){
                sendmessage.categoryName = this.new_child_category;
            }
            else {
                sendmessage.categoryName = this.child_cates.filter((i) => i.categoryId === this.child_category)[0].categoryName;
            }
            if (this.mode === 0){
                console.log(sendmessage);
                const pms = SendJSON("POST",`${serverHost}:8002/bookservice/addbook`,sendmessage,token);
                pms.then((value) => {
                    alert(value.message);
                    window.open(`./barcodes.html?isbn=${this.isbn}`,"_blank")
                },(reason) => {
                    alert(reason);
                });
            }
            else if (this.mode === 1){
                const pms = SendJSON("POST",`${serverHost}:8002/bookservice/modifybook`,sendmessage,token);
                pms.then((value) => {
                    alert(value.message);
                    history.go(0);
                },(reason) => {
                    alert(reason);
                });
            }
        },
    },
    computed:{
        available1(){
            return this.parent_category === -1;
        },
        available2(){
            return this.child_category === -1;
        },
        child_cates(){
            if (this.parent_category !== -1){
                return this.cates.filter((i) => i.categoryId === this.parent_category)[0].children;
            }
            else{
                this.child_category=-1;
                return [];
            }
        },
        rooms(){
            let arr = [];
            for (let i = 1;i <= 4;i++){
                arr.push(`${this.area}-10${i}`);
            }
            if (this.area.length > 0){
                this.loCation = arr[0];
            }
            return arr;
        }
    },
    mounted(){
        this.mode = 0;
        const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getbookcategoryinfo`);
        pms.then((value) => {
            this.cates = value.data.parentCategories;
            if (required_isbn){
                this.mode = 1;
                let pms2 = SendJSON("GET",`${serverHost}:8002/bookservice/getbookinfobyisbn/${required_isbn}`);
                pms2.then((value) => {
                    this.isbn = value.data.bookInfo.isbn;
                    this.bookdetail.bookname = value.data.bookInfo.bookName;
                    this.bookdetail.author = value.data.bookInfo.author;
                    this.bookdetail.price = value.data.bookInfo.bookPrice;
                    this.bookdetail.publisher = value.data.bookInfo.publisher;
                    this.location = value.data.bookInfo.location;
                    this.total_number = value.data.bookInfo.bookNum;
                    this.parent_category = value.data.bookInfo.parentId;
                    this.child_category = value.data.bookInfo.categoryId;
                });
            }
            else{

            }
        },(reason) => {
            console.error(reason);
        });
    }
});