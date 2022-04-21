const token = getCookie("token");

var mainhead = Vue.extend({
    data(){
        return {
            username:"Visitor",
            email:"",
            id:"",
            status:0,
            styles:["","",""],
            hrefs:["./mainpage.html","./categories.html","javascript:;"],
            search_for:""
        }
    },
    template:`
    <div>
        <div class="h_left_text">
            <div>
                <i class="fas fa-home h_home"></i>
                <span class="h_title">XIDIAN BOOKS</span>
            </div>
        </div>
        <nav class="h_middle">
            <ul class="h_navitem">
                <li><a :style="styles[0]" :href="hrefs[0]">Home</a></li>
                <li><a :style="styles[1]" :href="hrefs[1]">Categories</a></li>
                <li><a :style="styles[2]" :href="hrefs[2]">Logs</a></li>
            </ul>
        </nav>
        <div class="h_search">
            <input type="text" class="h_searchbar" placeholder="javascript" v-model="search_for" @keydown.enter="search" />
            <div class="h_searchbutton" @click="search">
                <i class="fas fa-search" ></i>
            </div>
        </div>
        <div class="h_user">
            <div class="h_slipwindow">
                <p class="h_w_username">{{username}}</p>
                <p class="h_w_userinfo">ID:{{id}}</p>
                <p class="h_w_userinfo">{{email}}</p>
                <p class="h_w_userinfo" v-if="status===1">Student</p>
                <button class="h_w_exitbtn" v-if="status===1">Borrowed Books</button>
                <button class="h_w_exitbtn" v-if="status===1" onclick="location.href='./change_password.html'">Change Password</button>
                <button class="h_w_exitbtn" v-if="status===1" @click="logout">Log out</button>
                <button class="h_w_exitbtn" v-if="status===0" onclick="location.href='./index.html'">Log in</button>
            </div>
            <i class="fas fa-user"></i>
        </div>
    </div>
    `,
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
        if (location.href.includes("mainpage")){
            this.styles[0] = "color:red";
            this.hrefs[0] = "javascript:;";
        }
        else if (location.href.includes("categories")){
            this.styles[1] = "color:red";
            this.hrefs[1] = "javascript:;";
        }
        if (token){
            this.status = 1;
            const pms = SendJSON("GET","http://47.108.137.135:8001/usercenter/getUserInfo","",token);
            pms.then((value) =>{
                this.username = value.data.userInfo.userName;
                this.email = value.data.userInfo.mail;
                this.id = value.data.userInfo.uid;
            },(reason) =>{
                this.username = "Visitor";
                this.email = "";
            });
        }
        search_content = getQueryVariable("search");
        if (search_content){
            this.search_for = search_content;
        }

    }
});
var header_container = new Vue({
    el:"#header",
    components:{
        mainhead
    }
})