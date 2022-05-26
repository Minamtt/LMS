const token = getCookie("token");
const vm = new Vue({
    el:".maincontainer",
    data:{
        barcodes:[],
    },
    mounted(){
        let isbn = getQueryVariable("isbn");
        const pms = SendJSON("GET",`${serverHost}:8002/bookservice/getisbnbooklist/${isbn}`,null,token);
        pms.then((value) => {
            for (let i of value.data.booklist){
                this.barcodes.push(i.url);
            }
        });
    }
});