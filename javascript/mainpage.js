let category_arrs = category_list.getElementsByTagName("li");
let window_arrs = category_list.getElementsByClassName("category_window");
function change_color(){
    for (let i = 0;i < category_arrs.length;i++){
        category_arrs[i].style.backgroundColor = "#ECF0F0";
    }
}
for (let i = 0;i <window_arrs.length;i++){
    window_arrs[i].onmouseleave = function(){
        window_arrs[i].style.visibility = "hidden";
        category_arrs[i].style.backgroundColor = "#ECF0F0";
    }
}
for (let i = 0;i < category_arrs.length;i++){
    category_arrs[i].onmouseover = function(){
        category_arrs[i].style.backgroundColor = "orange";
        window_arrs[i].style.visibility = "visible";
    }
    category_arrs[i].onmouseleave = function(e){
        if (e.layerY <= i*92 || e.layerY >= (i+1)*92 || e.layerX <= 8){
            window_arrs[i].style.visibility = "hidden";
            category_arrs[i].style.backgroundColor = "#ECF0F0";
        }
    }
}

let pic_frame = 3;
let pic_urlarr = ["e.jpg","e2.jpg","e3.jpg","e4.jpg"];
let pic_dots = dots.getElementsByClassName("dot");
let pic_switch = function(){
    if (pic_frame < 3){
        pic_frame++;
    }
    else{
        pic_frame = 0;
    }
    if (pic_frame > 0){
        pic_dots[pic_frame-1].className = "dot";
        pic_dots[pic_frame].className = "dot dot_selected";
    }
    else{
        pic_dots[3].className = "dot";
        pic_dots[0].className = "dot dot_selected";
    }
    carousel_pic.src = `./img/${pic_urlarr[pic_frame]}`;
}
for (let i = 0;i < pic_dots.length;i++){
    pic_dots[i].onclick = function(){
        for (let j = 0;j < pic_dots.length;j++){
            pic_dots[j].className = "dot";
        }
        pic_dots[i].className = "dot dot_selected";
        pic_frame = i;
        carousel_pic.src = `./img/${pic_urlarr[pic_frame]}`;
        clearInterval(timer);
        timer = setInterval(pic_switch,2500);
    }
}
pic_switch();
var timer = setInterval(pic_switch,2500);
var hot_books = new Vue({
    el:"#hot_container",
    data:{
        hotest:{
            img_url:"img/e.jpg",
            bookname:"钢铁是怎样炼成的",
            author:"奥斯特洛夫斯基",
            link:"./categories.html"
        },
        hot_books:[
            {
                bookname:"Effective C++",
                bookid:1
            },
            {
                bookname:"Effective C#",
                bookid:2
            },
            {
                bookname:"Effective Java",
                bookid:3
            },
            {
                bookname:"Effective Python",
                bookid:4
            }
        ]
    },
    computed:{
        hot_book_links(){
            let links = [];
            let search_url = "./categories.html";
            for (let i of this.hot_books){
                links.push(`${search_url}?bookid=${i.bookid}`);
            }
            return links;
        }
    }
})
var recommends = new Vue({
    el:"#recommend",
    data:{
        recommend_books:[
            {
                img_url:"img/e.jpg",
                bookname:"钢铁是怎样炼成的",
                bookid:0,
                author:"奥斯特洛夫斯基",
            },
            {
                img_url:"img/e2.jpg",
                bookname:"Thinking in Java",
                bookid:1,
                author:"Bruce Eckel",
            },
            {
                img_url:"img/e3.jpg",
                bookname:"Hong Lou Meng",
                bookid:2,
                author:"Xueqin Cao",
            },
            {
                img_url:"img/e4.jpg",
                bookname:"宏观经济学",
                author:"Andrul B Abol",
                bookid:3,
            },
            {
                img_url:"img/e.jpg",
                bookname:"钢铁是怎样炼成的",
                author:"奥斯特洛夫斯基",
                bookid:4,
            },
        ]
    },
    methods:{

    },
    computed:{
        recommend_links(){
            let links = [];
            let search_url = "./categories.html";
            for (let i of this.recommend_books){
                links.push(`${search_url}?bookid=${i.bookid}`);
            }
            return links;
        }
    }
});