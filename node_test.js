const http = require("http");
var querystring = require('querystring');
const server = http.createServer();
server.on("request",(request,response) => {
    let visitor = request.headers.origin;
    console.log(`Request from ${visitor}`);
    
    var data = '';

    //2.注册data事件接收数据（每当收到一段表单提交的数据，该方法会执行一次）
    request.on('data', function (chunk) {
        // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
        data += chunk;
    });

    request.on('end', function () {
        data = decodeURI(data);
        //console.log(data);
        var dataObject = querystring.parse(data);
        console.log(dataObject);
    });

    console.log("-----------------------------------------------");
    response.writeHead(200,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,GET"
    });
    let resp_data = {
        code:20000,
        message:"",
        data:{

        }
    };
    response.write(JSON.stringify(resp_data));
    response.end();
});
server.listen(8001,() =>{
    console.log("Server is running at port 8001.");
});