var body = document.getElementsByTagName("body")[0];
var pop_up_tip = function(message,response){
    var tipbar = document.createElement("div");
    tipbar.className=response === 0 ? "e_tip e_refuse" : "e_tip e_agree";
    tipbar.innerHTML = message;
    body.appendChild(tipbar);
    setTimeout(() => {
        body.removeChild(tipbar);
        tipbar = null;
    },2000);
}