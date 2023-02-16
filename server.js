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

app.get('/pet',function(요청,응답){
    응답.send('펫용품 쇼핑을 할 수 있는 사이트입니다.')
});

app.get('/beauty',function(요청,응답){
    응답.send('뷰티용품 사세요')
});

app.get('/',function(요청,응답){
    응답.sendFile(__dirname + '/index.html')
});
app.get('/write',function(요청,응답){
    응답.sendFile(__dirname + '/write.html')
});

// 어떤 사람이 /add 라는 경로로 post 요청을 하면,
// 데이터 2개(날짜, 제목)을 보내주는데,
// 이때, 'post'라는 이름을 가진 collection에 두개 데이터를 저장하기
// {제목 : '어쩌구', 날짜 : '어쩌구'}
app.post('/add', function (요청, 응답) {
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
      var 총게시물갯수 = 결과.totalPost
  
      db.collection('post').insertOne({ _id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date }, function (에러, 결과) {
        db.collection('counter').updateOne({name:'게시물갯수'},{ $inc: {totalPost:1} },function(에러, 결과){
      if(에러){return console.log(에러)}
          응답.send('전송완료');
        })
      })
  
    })
  })
  app.delete('/delete', function(요청, 응답){
    console.log(요청.body)
    요청.body._id = Number(요청.body._id);
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
      console.log('삭제완료');
      응답.status(200).send({message: '성공했습니다.'});
    })
    
  });

  app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({ _id : parseInt(요청.params.id) }, function(에러, 결과){
      응답.render('detail.ejs', {data : 결과} )
    })
  });


















// list로 GET요청으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌

app.get('/list', function(요청,응답){
    // DB에 저장된 post라는 collection안의 모든 데이터를 꺼내주세요
    db.collection('post').find().toArray(function(에러,결과){
        console.log(결과);
        응답.render('list.ejs', { posts:결과});
        // 1. DB에서 자료찾아주세요
        // 2. 찾은걸 ejs 파일에 넣어주세요

    }) // 다 찾아주세요~
});

