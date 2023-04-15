const express = require("express");
const ws = require("ws");

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');

app.get('/', (req,res)=> {
    res.render('client')
})

const HTTPServer = app.listen(8000, ()=>{
    console.log("Server is open at port:8000");
});

const webSocketServer = new ws.Server(
    {
        server: HTTPServer,
    }
);

webSocketServer.on('connection', (ws, req)=>{
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 클라이언트의 ip를 가져옴
    console.log(`새로운 클라이언트[${ip}] 접속`);

    if(ws.readyState === ws.OPEN){
        ws.send(`클라이언트[${ip}] 접속을 환영합니다 from 서버`); // 데이터 전송
    }

    ws.on('message', (msg)=>{
        console.log(`클라이언트[${ip}]에게 수신한 메시지 : ${msg}`);
        webSocketServer.clients.forEach(client => {
            client.send(`${client.ip} : Echo ${msg}`);
        });
    })
    
    ws.on('error', (error)=>{
        console.log(`클라이언트[${ip}] 연결 에러발생 : ${error}`);
    })
    
    ws.on('close', ()=>{
        console.log(`클라이언트[${ip}] 웹소켓 연결 종료`);
    })
});