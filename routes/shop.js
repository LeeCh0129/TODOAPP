var router = require('express').Router();


function 로그인했니(요청, 응답, next){
    if (요청.user){
        next()
    } else {
        응답.send('로그인이 필요합니다.')
    }
}

// 여기있는 모든 URL에 적용할 미들웨어
router.use('/shirts', 로그인했니); // '/shirts'에 접속할때만 실행


// 개별 URL에 미들웨어 적용하는법 - (로그인한 사람만 방문 가능하게)
router.get('/shirts',function(요청, 응답){ 
    응답.send('셔츠 파는 페이지입니다.');
});

router.get('/pants', function(요청, 응답){
    응답.send('바지 파는 페이지입니다.');
});

module.exports = router;
// module.exports = 내보낼 변수명, require('파일경로'), require('라이브러리명')