const token = getCookie("token");

var mainhead = Vue.extend({
    data(){
        return {
            username:"User",
            email:"",
            id:"",
            status:0,
            styles:["","",""],
            hrefs:["./mainpage.html","./categories.html","./scan_borrow.html"],
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
                <li><a :style="styles[2]" :href="hrefs[2]">Borrow</a></li>
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
                <button class="h_w_exitbtn" v-if="status===1" onclick="location.href='./reservation_log.html'">Reservations</button>
                <button class="h_w_exitbtn" v-if="status===1" onclick="location.href='./order.html'">My orders</button>
                <button class="h_w_exitbtn" v-if="status===1" onclick="location.href='./change_password.html'">Change Password</button>
                <button class="h_w_exitbtn" v-if="status===1" @click="logout">Log out</button>
                <button class="h_w_exitbtn" v-if="status===0" onclick="location.href='../login.html'">Log in</button>
            </div>
            <i class="fas fa-user"></i>
        </div>
    </div>
    `,
    methods:{
        logout(){
            let now = new Date();
            document.cookie = `token='';expires=${now.toGMTString()};`;
            window.location.href = "./scan_login.html";
        },
        search(){
            location.href = `./categories.html?search=${decodeURI(this.search_for)}`;
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
        else if (location.href.includes("scan_borrow")){
            this.styles[2] = "color:red";
            this.hrefs[2] = "javascript:;";
        }
        if (token){
            this.status = 1;
            const pms = SendJSON("GET",`${serverHost}:8001/usercenter/getuserinfo`,"",token);
            pms.then((value) =>{
                if (value.data.userInfo.type === 2){
                    location.href = "./book_manage.html"
                }
                this.email = value.data.userInfo.mail;
                this.id = value.data.userInfo.userId;

            },(reason) =>{
                this.username = "User";
                this.email = "";
            });
        }
        search_content = getQueryVariable("search");
        if (search_content){
            this.search_for = decodeURI(search_content);
        }
    }
});
var header_container = new Vue({
    el:"#header",
    components:{
        mainhead
    }
})