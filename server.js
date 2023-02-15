const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');


var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.1zbl9zz.mongodb.net/?retryWrites=true&w=majority',function(에러,client){
    if (에러) return console.log(에러)
    db = client.db('todoapp');

    // db.collection('post').insertOne( {이름 : 'John', 나이 : 20 , _id : 100},function(에러,결과){
    //     console.log('저장완료');
    // });

    app.listen(8088,function(){
        console.log('listening on 8088')
    });
})






// 누군가가 /pet 으로 방문을 하면..
// pet관련된 안내문을 띄워주자

app.get('/pet',function(req,res){
    res.send('펫용품 쇼핑을 할 수 있는 사이트입니다.')
});

app.get('/beauty',function(req,res){
    res.send('뷰티용품 사세요')
});

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html')
});
app.get('/write',function(req,res){
    res.sendFile(__dirname + '/write.html')
});

// 어떤 사람이 /add 라는 경로로 post 요청을 하면,
// 데이터 2개(날짜, 제목)을 보내주는데,
// 이때, 'post'라는 이름을 가진 collection에 두개 데이터를 저장하기
// {제목 : '어쩌구', 날짜 : '어쩌구'}
app.post('/add',function(req,res){
    res.send('전송완료'); // 항상 존재해야함
    db.collection('counter'),findOne({name : '게시물갯수'}, function(에러,결과){
       console.log(결과.totalPost)
       var 총게시물갯수 = 결과.totalPost;

       db.collection('post').insertOne({ _id: 총게시물갯수 +1,제목 : req.body.title, 날짜 : req.body.date}, function(){
            console.log('저장완료')
            res.send('전송완료')
            // + counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함;
            db.collection('counter').updateOne({name: '게시물갯수'},{$inc : {totalPost:1}},function(에러,결과){
                if(에러){return console.log(에러)}
            })
        });

    });


});



// list로 GET요청으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌

app.get('/list', function(req,res){
    // DB에 저장된 post라는 collection안의 모든 데이터를 꺼내주세요
    db.collection('post').find().toArray(function(에러,결과){
        console.log(결과);
        res.render('list.ejs', { posts:결과});
        // 1. DB에서 자료찾아주세요
        // 2. 찾은걸 ejs 파일에 넣어주세요

    }) // 다 찾아주세요~

});