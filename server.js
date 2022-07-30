const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));


var db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://admin:1424125abb!@cluster0.o2erudw.mongodb.net/todoapp?retryWrites=true&w=majority', function(에러, client){
    // 연결되면 할 일
    if (에러) return console.log(에러)
    db = client.db('todoapp'); // todoapp 이라는 database(폴더)에 연결

    db.collection('post').insertOne( {이름: 'John', _id : 100}, function(에러, 결과){
        console.log('저장완료');
    }); // post라는 파일에 저장

    app.listen(8080, function(){
        console.log('listening on 8080')
    });

})



// 누군가가 /pet 으로 방문을 하면... pet관련된 안내문을 띄워주자

app.get('/beauty',function(req, res){
    res.send('뷰티용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/pet',function(req, res){
    res.send('펫용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/write',function(req, res){
    res.sendFile(__dirname + '/write.html');
});

// 어떤 사람이 /add 경로로 POST 요청을 하면... ??를 해주세요~

app.post('/add', function(req, res){
    res.send('전송완료');
    console.log(req.body.date);
    console.log(req.body.title);
    db.collection('post').insertOne( { 제목 : req.body.title, 날짜 : req.body.date}, function(){
        console.log('저장완료');
    });
});

// /list로 GET요청으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
