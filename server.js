const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use('/public', express.static('public'));
const {ObjectId} = require('mongodb');
// require('dotenv').config();

const http = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(http);



var db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://admin:1424125abb!@cluster0.o2erudw.mongodb.net/todoapp?retryWrites=true&w=majority', function(에러, client){
    // 연결되면 할 일
    if (에러) return console.log(에러)
    db = client.db('todoapp'); // todoapp 이라는 database(폴더)에 연결
    // db.collection('post').insertOne( {이름: 'John', _id : 100}, function(에러, 결과){
    //     console.log('저장완료');
    // }); 
    // post라는 파일에 저장
    http.listen(8080, function(){
        console.log('listening on 8080')
    });
})

app.get('/socket', function(요청, 응답){
    응답.render('socket.ejs')
})

io.on('connection', function(socket){
    console.log('유저접속');

    socket.on('room1-send', function(data){
        io.to('room1').emit('broadcast', data)
    });

    socket.on('joinroom', function(data){
        socket.join('room1');
    });

    socket.on('user-send', function(data){
        // 서버 -> 유저 메세지 전송 io.emit() - 모든 유저에게 메시지 보냄, 메세지 수신은 언제나 socket.on()
        io.emit('broadcast', data)
        // io.to(socket.id).emit('broadcast', data) // 서버 - 유저 1명간 단독으로 소통
    });
    
});

// // server.js에서 env 파일의 변수들을 불러올 때는 process.env.변수이름 이렇게 불러올 수 있음.
// // env파일(환경변수)을 적용하는 server.js 코드
// var db;
//   const MongoClient = require('mongodb').MongoClient;
//   MongoClient.connect(process.env.DB_URL, function(err, client){
//   if (err) return console.log(err)
//   db = client.db('Example1');
//   app.listen(process.env.PORT, function() {
//     console.log('listening on 8080')
//   })
// }) 



// 누군가가 /pet 으로 방문을 하면... pet관련된 안내문을 띄워주자

// app.get('/beauty',function(요청, 응답){
//     응답.send('뷰티용품 쇼핑할 수 있는 페이지입니다.');
// });

// app.get('/pet',function(요청, 응답){
//     응답.send('펫용품 쇼핑할 수 있는 페이지입니다.');
// });

// app.get('/',function(요청, 응답){
//     응답.sendFile(__dirname + 'index.ejs');
// });

app.get('/', function(요청, 응답){
    응답.render('index.ejs')
})

app.get('/write', function(요청, 응답){
    응답.render('write.ejs');
});
// app.get('/write',function(요청, 응답){
//     응답.sendFile(__dirname + '/write.html');
// });

// app.get('/write', function(요청, 응답){
//     응답.render('write.ejs');
//     응답.sendFile(__dirname + '/write.html');
// });



// /list로 GET요청으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌

app.get('/list', function(요청, 응답){

    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs', { posts : 결과 });
        //디비에 저장된 post라는 collection안의 id가 뭐인 or 제목이 뭐인 or 모든 데이터를 꺼내주세요. find().toArray -> 모든 데이터
    });

});

// app.delete('/delete', function(요청, 응답){
//     console.log(요청.body); // 요청시 함께 보낸 데이터 찾기
//     요청.body._id = parseInt(요청.body._id); // 요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제
//     db.collection('post').deleteOne(요청.body, function(에러, 결과){
//         console.log('삭제완료')
//     })
//     응답.send('삭제완료')
// });



  // /detail 로 접속하면 detail.ejs 보여줌
  // /detail2로 접속하면 detail2.jes 보여줌

app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과);
        응답.render('detail.ejs', { data : 결과 });
    })
    
})

app.get('/edit/:id', function(요청, 응답){
    
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과)
        응답.render('edit.ejs', { post : 결과 })
    })  
});

app.put('/edit', function(요청, 응답){
    db.collection('post').updateOne({ _id : parseInt(요청.body.id) }, { $set : { 제목 : 요청.body.title, 날짜 : 요청.body.date } }, function(에러, 결과){
        console.log('수정완료')
        응답.redirect('/list')
    })
});

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized : false}));
app.use(passport.initialize()); // 미들웨어 : 요청과 응답 사이에 실행되는 코드 - 전역 미들웨어
app.use(passport.session());


app.get('/login', function(요청, 응답){
    응답.render('login.ejs')
});

app.post('/login', passport.authenticate('local', {
    failureRedirect : '/fail'
}), function(요청, 응답){
    응답.redirect('/')
});

app.get('/mypage', 로그인했니, function(요청, 응답){
    console.log(요청.user);
    응답.render('mypage.ejs', {사용자 : 요청.user})
})

function 로그인했니(요청, 응답, next){
    if (요청.user){
        next()
    } else {
        응답.send('로그인이 필요합니다.')
    }
}





//채팅방 기능
app.post('/chatroom', 로그인했니, function(요청, 응답){

    var 저장할거 = {
        title : '무슨무슨채팅방',
        member : [ObjectId(요청.body.당한사람id), 요청.user._id],
        date : new Date()
    }
    
    db.collection('chatroom').insertOne(저장할거).then((결과)=>{
        응답.send('저장완료')
    });
});

app.get('/chat', 로그인했니, function(요청, 응답){

    db.collection('chatroom').find({ member : 요청.user._id }).toArray().then((결과)=>{
        응답.render('chat.ejs',{data :결과 }) // chat.ejs 보여주기
    })

});

app.post('/message', 로그인했니, function(요청, 응답){

    var 저장할거 = {
        parent : 요청.body.parent,
        content : 요청.body.content,
        userid : 요청.user._id,
        date : new Date(),
    }

    db.collection('message').insertOne(저장할거).then(()=>{
        console.log('DB저장성공');
        응답.send('DB저장성공')
    
    })

});


// Server Sent Events 서버와 유저간 실시간 소통채널 열기
app.get('/message/:id', 로그인했니, function(요청, 응답){

    // Header를 이렇게 수정해주세요.
    응답.writeHead(200, {
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
    });
    // GET 요청시 서버로 데이터 전송하려면 URL 파라미터 or query string

    // 일반 GET, POST 요청은 1회요청시 1회응답만 가능 - But Header를 위 코드처럼 수정하면 여러번 응답가능
    db.collection('message').find({ parent : 요청.params.id }).toArray().then((결과)=>{
        응답.write('event: test\n'); // 유저에게 데이터 전송은 evnet:보낼데이터이름 \n
        응답.write('data: ' + JSON.stringify(결과) + '\n\n'); // object, array에 따옴표치면 -> JSON (JSON은 문자취급받음.)
    })

    // MongoDB change Stream 쓰면 실시간 업데이트 가능 - DB가 업데이트되면 유저에게 쏴주세요.
    // Change Stream 설정해놓으면 DB 변동시 -> 서버에 알려줌 -> 유저에게 보낼 수 있음.

    const pipeline = [
        { $match: { 'fullDocument.parent': 요청.params.id} } // 컬렉션 안의 원하는 doucument 감시하고 싶으면 - 이런 documnet가 추가/수정/삭제되면
    ];
    const collection = db.collection('message');
    const changeStream = collection.watch(pipeline); // .watch() 붙이면 실시간 감시해줌
    // 해당 컬렉션에 변동생기면 아래 코드 실행됨. - 일종의 이벤트 리스너
    changeStream.on('change', (result)=>{
        //여기 코드 실행
        응답.write('event: test\n');
        응답.write('data: ' + JSON.stringify([result.fullDocument]) + '\n\n');
        console.log(result.fullDocument)
        // result.fullDocument
    });

});



passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
}, function(입력한아이디, 입력한비번, done){
    console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({id : 입력한아이디}, function(에러, 결과){
        if (에러) return done(에러)

        if (!결과) return done(null, false, {message : '존재하지않는 아이디요'})
        if (입력한비번 == 결과.pw){
            return done(null, 결과) // 아이디/비번 검증 성공시 pass.port.serializeUser(function(user))로 보냄
        } else {
            return done(null, false, {message : '비번틀렸어요'})
        }
    })
}));

// 로그인 성공 -> 세션정보를 만듦 -> 마이페이지 방문시 세션검사

passport.serializeUser(function(user, done){
    done(null, user.id)
}); // id를 이용해서 세션을 저장신키는 코드(로그인 성고시 발동)
    // 세션 데이터를 만들고 세션의 id 정보를 쿠키로 보냄

passport.deserializeUser(function(아이디, done){
    //디비에서 위에 있는 user.id로 유저를 찾은뒤에 유저 정보를 done(null, {여기에 넣음})
    db.collection('login').findOne({id : 아이디}, function(에러, 결과){
        done(null, 결과)
    })
    
}); // 마이페이지 접속시 발동


// 회원기능이 필요하면 passport 세팅하는 부분이 위에 있어야함.
app.post('/register', function(요청, 응답){
    db.collection('login').insertOne( { id: 요청.body.id, pw : 요청.body.pw }, function(에러, 결과){
        응답.redirect('/')
    })
});


// 어떤 사람이 /add 경로로 POST 요청을 하면... ??를 해주세요~
app.post('/add', function(요청, 응답){

    응답.send('전송완료');
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost)
        var 총게시물갯수 = 결과.totalPost;
        // console.log(req.body.date);
        // console.log(req.body.title);

        var 저장할거 = { _id : 총게시물갯수 + 1,  작성자: 요청.user._id, 제목 : 요청.body.title, 날짜 : 요청.body.date }

        db.collection('post').insertOne(저장할거, function(에러, 결과){
            console.log('저장완료');
            // counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함 (수정);
            db.collection('counter').updateOne({name:'게시물갯수'}, { $inc : {totalPost:1} }, function(에러, 결과){
                if(에러){return console.log(에러)}
            })
        });

    });

});


app.delete('/delete', function(요청, 응답){
    console.log('삭제요청');
    console.log(요청.body);
    요청.body._id = parseInt(요청.body._id);

    var 삭제할데이터 = { _id : 요청.body._id, 작성자 : 요청.user._id }

    // 요청.body에 담겨온 게시물 번호를 가진 글을 DB에서 찾아서 삭제
    db.collection('post').deleteOne(삭제할데이터, function(에러, 결과){
      console.log('삭제완료');
      if (결과) {console.log(결과)}
      응답.status(200).send({ message : '성공했습니다'});
    })
  });






app.get('/search', (요청, 응답) => {
    var 검색조건 = [
        {
            $search: {
                index: 'titleSearch',
                text: {
                    query: 요청.query.value,
                    path: '제목' // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
                }
            }
        },
        { $sort : {_id : 1 } }, // 결과 정렬
        { $limit : 10 }, // 상위 몇개 가져올지
        // { $project : {제목: 1, _id: 1, score: { $meta: "searchScore" } } } // 검색조건에서 검색결과에서 필터주기, 1은 가져오기, 0은 안가져옴
    ]
    db.collection('post').aggregate(검색조건).toArray((에러, 결과)=> {
        console.log(결과)
        응답.render('search.ejs', {posts : 결과})
    })
});
// 그냥 find()로 DB의 데이터 내용을 다 찾는건 항상 오래걸림 -> indexing 해두면 게시물 1억개라도 찾기 빨라짐
// Binary Search -> 미리 숫자순으로 정렬이 되어있어야 사용가능





// 고객이 / 경로로 요청했을 때 이런 미들웨어를 적용
app.use('/shop', require('./routes/shop.js')); // server.js에 shop.js 라우터 첨부 ./ -> 현재경로를 뜻함. 
app.use('/board/sub', require('./routes/board.js'));

let multer = require('multer');
const { ObjectID } = require('bson');
var storage = multer.diskStorage({
// S3 Storage
  destination : function(req, file, cb){
    cb(null, './public/image') // 같은 폴더안에 저장
  },
  filename : function(req, file, cb){
    cb(null, file.originalname ) // 저장한 이미지의 파일명 설정하는 부분 - 기존의 파일 이름으로 저장
  },
  filefilter : function(req, file, callback){ // 파일 형식 (확장자) 거르기
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return callback(new Error('PNG, JPG만 업로드하세요'))
    }
    callback(null, true)
  },
  limits:{
    fileSize: 1024 * 1024
  }

});




var upload = multer({storage : storage});

app.get('/upload', function(요청, 응답){
    응답.render('upload.ejs')
});

// upload.ejs - input의 name속성 이름
app.post('/upload', upload.single('profile'), function(요청, 응답){
    응답.send('업로드완료')
});

//업로드한 이미지 보여주기
app.get('/image/:imageName', function(요청, 응답){
    응답.sendFile( __dirname + '/public/image/' + 요청.params.imageName ) // __dirname : 현재파일 경로
})