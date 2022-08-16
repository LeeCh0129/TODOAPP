var router = require('express').Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

router.use(session({secret : '비밀코드', resave : true, saveUninitialized : false}));
router.use(passport.initialize()); // 미들웨어 : 요청과 응답 사이에 실행되는 코드 - 전역 미들웨어
router.use(passport.session());

router.get('/', function(요청, 응답){
    응답.render('login.ejs')
});

router.post('/', passport.authenticate('local', {
    failureRedirect : '/fail'
}), function(요청, 응답){
    응답.redirect('/')
});

router.get('/mypage', 로그인했니, function(요청, 응답){
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

module.exports = router;