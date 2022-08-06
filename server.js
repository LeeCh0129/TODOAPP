const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use('/public', express.static('public'));


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

    app.listen(8080, function(){
        console.log('listening on 8080')
    });

})



// 누군가가 /pet 으로 방문을 하면... pet관련된 안내문을 띄워주자

app.get('/beauty',function(요청, 응답){
    응답.send('뷰티용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/pet',function(요청, 응답){
    응답.send('펫용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/',function(요청, 응답){
    응답.sendFile(__dirname + '/index.html');
});

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

// 어떤 사람이 /add 경로로 POST 요청을 하면... ??를 해주세요~

app.post('/add', function(요청, 응답){
    응답.send('전송완료');
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost)
        var 총게시물갯수 = 결과.totalPost;
        // console.log(req.body.date);
        // console.log(req.body.title);

        db.collection('post').insertOne( { _id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date}, function(){
            console.log('저장완료');
            // counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함 (수정);
            db.collection('counter').updateOne({name:'게시물갯수'}, { $inc : {totalPost:1} }, function(에러, 결과){
                if(에러){return console.log(에러)}
            })
        });

    });

});

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

app.delete('/delete', function(요청, 응답){
    요청.body._id = parseInt(요청.body._id)
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
      console.log('삭제완료');
      응답.status(200).send({ message : '성공했습니다'});
    })

  });

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
app.use(passport.initialize());
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