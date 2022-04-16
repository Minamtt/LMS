const token = getCookie("token");
var header_vm = new Vue({
    el:"#header",
    data:{
        username:"",
        email:"",
        id:"",

        search_for:""
    },
    methods:{
        logout(){
            let now = new Date();
            document.cookie = `token='';expires=${now.toGMTString()};`;
            window.location.href = "./index.html";
        },
        search(){
            location.href = `./categories.html?search=${this.search_for}`;
        }
    },
    mounted(){
        const pms = SendJSON("GET","http://47.108.137.135:8001/usercenter/getUserInfo","",token);
        pms.then((value) =>{
            this.username = value.data.userInfo.userName;
            this.email = value.data.userInfo.mail;
            this.id = value.data.userInfo.uid;
        },(reason) =>{
            this.username = "Visitor";
            this.email = "";
        });
        let search_content = getQueryVariable("search");
        console.log(search_content);
        if (search_content){
            this.search_for = search_content;
        }
    }
});