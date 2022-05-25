const token = getCookie("token");
var mainhead = Vue.extend({
    data(){
        return {
            styles:["","",""],
            hrefs:["./book_manage.html","./user_manage.html","./return_manage.html"],
            id:"",
            email:"",
        }
    },
    template:`
    <div>
        <div class="h_left_text">
            
        </div>
        <nav class="h_middle">
            <ul class="h_navitem">
                <li><a :style="styles[0]" :href="hrefs[0]">Book management</a></li>
                <li><a :style="styles[1]" :href="hrefs[1]">User management</a></li>
                <li><a :style="styles[2]" :href="hrefs[2]">Return management</a></li>
            </ul>
           
        </nav> 
        <div class="h_user">
            <div class="h_slipwindow">
                <p class="h_w_username">Administrator</p>
                <p class="h_w_userinfo">ID:{{id}}</p>
                <p class="h_w_userinfo">{{email}}</p>
                <button class="h_w_exitbtn" @click="logout">Log out</button>
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
    },
    beforeMount(){
        if (location.href.includes("book")){
            this.styles[0] = "color:red";
            this.hrefs[0] = "javascript:;";
        }
        else if (location.href.includes("user")){
            this.styles[1] = "color:red";
            this.hrefs[1] = "javascript:;";
        } else if (location.href.includes("return")){
            this.styles[2] = "color:red";
            this.hrefs[2] = "javascript:;";
        }
        const pms = SendJSON("GET",`${serverHost}:8001/usercenter/getuserinfo`,"",token);
        pms.then((value) =>{
            this.email = value.data.userInfo.mail;
            this.id = value.data.userInfo.userId;
        },(reason) =>{
            this.username = "User";
            this.email = "";
        });
    }  
});
var header_container = new Vue({
    el:"#header",
    components:{
        mainhead
    }
})