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
        locations: [],
        parent_location:-1,
        child_location:-1,
        new_parent_location:"",
        new_child_location:"",
        number:1,
        mode:0  //0 -> add， 1 -> update
    },
    methods:{
        handleScan(isbn) {
            this.isbn = isbn
        },
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
        getBookInfo() {
            let pms2 = SendJSON("GET",`${serverHost}:8002/bookservice/getbookinfobyisbn/${required_isbn}`);
            pms2.then((value) => {
                this.isbn = value.data.bookInfo.isbn;
                this.bookdetail.bookname = value.data.bookInfo.bookName;
                this.bookdetail.author = value.data.bookInfo.author;
                this.bookdetail.price = value.data.bookInfo.bookPrice;
                this.bookdetail.publisher = value.data.bookInfo.publisher;
                this.parent_location = value.data.bookInfo.parentLocation;
                this.child_location = value.data.bookInfo.location;
                this.parent_category = value.data.bookInfo.parentId;
                this.child_category = value.data.bookInfo.categoryId;
                this.total_number = value.data.bookInfo.bookNum;
            });
        },
        submit(){
            if (this.isbn.length === 0){
                alert("please input isbn");
                return;
            }
            if (
              (this.parent_category === -1 && this.new_parent_category.trim().length === 0) ||
              (this.child_category === -1 && this.new_child_category.trim().length === 0)
            ){
                alert("please input category name.");
                return;
            }
            if (
              (this.parent_location === -1 && this.new_parent_location.trim().length === 0) ||
              (this.child_location === -1 && this.new_child_location.trim().length === 0)
            ){
                alert("please input location name.");
                return;
            }
            let sendmessage = {
                isbn:this.isbn,
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
            if (this.parent_location === -1){
                sendmessage.parentLocation = this.new_parent_location;
            }
            else{
                sendmessage.parentLocation = this.locations.filter((i) => i.location === this.parent_location)[0].location;
            }
            if (this.child_location === -1){
                sendmessage.location = this.new_child_location;
            }
            else {
                sendmessage.location = this.child_locas.filter((i) => i.location === this.child_location)[0].location;
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
                console.log(sendmessage);
                const pms = SendJSON("POST",`${serverHost}:8002/bookservice/modifybook`,sendmessage,token);
                pms.then((value) => {
                    alert(value.message);
                    history.go(-1);
                },(reason) => {
                    alert(reason);
                });
            }
        },
    },
    computed:{
        child_cates(){
            if (this.parent_category !== -1){
                return this.cates.filter((i) => i.categoryId === this.parent_category)[0]?.children || [];
            } else{
                this.child_category=-1;
                return [];
            }
        },
        child_locas() {
            if (this.parent_location !== -1){
                return this.locations?.filter((i) => i.location === this.parent_location)[0]?.children || [];
            } else{
                this.child_location=-1;
                return [];
            }
        },
    },
    mounted(){
        this.mode = 0;
        const pms1 = SendJSON("GET",`${serverHost}:8002/bookservice/getbookcategoryinfo`);
        pms1.then((value) => {
            this.cates = value.data.parentCategories;
            if (required_isbn){
                this.mode = 1;
                this.getBookInfo();
            }
        },(reason) => {
            console.error(reason);
        });
        const pm2 = SendJSON("GET", `${serverHost}:8002/bookservice/getlocationinfo`);
        pm2.then((value) => {
            this.locations = value.data.parentLocations
        },(reason) => {
            console.error(reason);
        })

        // 如果是添加图书，增加扫码监听
        if(this.mode === 0) {
            new ScanCode(this.handleScan)
        }
    }
});