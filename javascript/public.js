function getCookie(key){
    let cookies = document.cookie;
    cookies = cookies.split(";");
    for (let i = 0;i < cookies.length;i++){
        cookies[i] = cookies[i].trim().split("=");
    }
    for (let i = 0;i < cookies.length;i++){
        if (cookies[i][0] === key){
            return cookies[i][1];
        }
    }
    return undefined;
}

function SendJSON(method,url,Send,token){
    return new Promise((resolve,reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method,url);
        xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
        if (token){
            xhr.setRequestHeader("token",token);
        }
        if (method === "GET" || method === "DELETE"){
            xhr.send();
        }
        else if (method === "POST"){
            xhr.send(JSON.stringify(Send));
        }
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4){
                if (xhr.status >= 200 && xhr.status <= 300){
                    let received = JSON.parse(xhr.response);
                    if (received.code === 20000){
                        resolve(received);
                    }
                    else{
                        reject(received.message);
                    }
                }
                else{
                    reject("StateCode:" + xhr.status);
                }
            }
        }
    });
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return undefined;
}

const serverHost = "http://47.108.137.135";