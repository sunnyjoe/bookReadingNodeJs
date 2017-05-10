const express = require('express');
const router = express.Router();

const url = require('url');
const heorkuDbUrl = 'postgresql-rigid-68995';
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/biblereading';


var homeTitle = "方舟图书系统"

/* GET home page. */
router.get('/', function(req, res) {
    console.log("Hello World");

    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }

    if (req.cookies.islogin) {
        console.log("render home");
        res.render('home', {
            title: homeTitle,
            user: res.locals.islogin
        });
    } else {
        console.log("render login");
        res.render('login', {
            title: homeTitle,
            user: res.locals.islogin
        });
    }
});


router.route('/login')
    .get(function(req, res) {
        res.redirect('/');
    })
    .post(function(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        found = false;
        pg.connect(connectionString, (err, client, done) => {
            // Handle connection errors
            if (err) {
                console.log('A db connect error occurred: ' + err);
                res.redirect('/');
                return;
            }

            queryStr = "select * from userinfo where name='" + username + "' and password ='" + password + "';";
            console.log("queryStr " + queryStr);

            var query = client.query(queryStr);
            var rows = [];
            query.on('row', function(row, res) {
                rows.push(row);
            });
            query.on('end', function(result) {
                if (result.rowCount > 0) {
                    console.log('user found :)');
                    req.session.islogin = username;
                    res.locals.islogin = username;
                    res.cookie('islogin', username, {
                        maxAge: 60000
                    });
                    res.redirect('/home');
                } else {
                    console.log('user not found');
                    res.redirect('/');
                }
            });

        });


    });

router.get('/logout', function(req, res) {
    res.clearCookie('islogin');
    req.session.destroy();
    res.redirect('/');
});

router.route('/home')
    .get(function(req, res) {
        if (req.session.islogin) {
            res.locals.islogin = req.session.islogin;
        }
        if (req.cookies.islogin) {
            req.session.islogin = req.cookies.islogin;
        }

        if (req.cookies.islogin) {
            console.log("render home");
            res.render('home', {
                title: homeTitle,
                user: res.locals.islogin
            });
        } else {
            res.redirect('/');
        }
    })
    .post(function(req, res) {
        res.send("no action")
    });


router.route('/reg')
    .get(function(req, res) {
        res.render('reg', {
            title: '注册'
        });
    })
    .post(function(req, res) {
        pg.connect(connectionString, (err, client, done) => {
            name = req.body.username;
            pw = req.body.password2;
            queryStr = "insert into UserInfo values('" + name + "','" + pw + "')";
            console.log(queryStr);
            client.query(queryStr);
            if (err) res.send('该用户名已经存在，请返回重新注册');
            res.clearCookie('islogin');
            req.session.destroy();
            res.redirect('/');
        });
    });

 router.route('/addbook')
  .get(function(req, res) {
    res.render('addbook', {
        title: '添加新书'
    });
  })
  .post(function(req, res) {
    res.send("no post")
  });

router.route('/insertbook')
    .get(function(req, res) {
        var url_parts = url.parse(req.url, true);
        name = url_parts.query.name;
        author = url_parts.query.author;
        desc = url_parts.query.desc;
        count = url_parts.query.count;
        timestamp = (new Date()).getTime();

        queryStr = "insert into bookinfo values('" + timestamp + "','" + name + "','" + author +  "','" + desc + "','" + count +"');";
        console.log(queryStr);

        pg.connect(connectionString, (err, client, done) => {
            client.query(queryStr);
            if (!err) res.send('ok');
          });
    })
    .post(function(req, res) {
        res.send("no post")
    });

router.route('/booklist')
  .get(function(req, res) {
       res.render('booklist', {
           title: '新书'
       });
  })
  .post(function(req, res) {
       res.send("no post")
  });

  router.route('/newaddedbook')
      .get(function(req, res) {
          queryStr = "select * from bookinfo order by bookid desc limit 25";
          console.log(queryStr);
          pg.connect(connectionString, (err, client, done) => {
            client.query(queryStr, function(err, results, fields){
              if (!err) res.json(results.rows);
              });
          });
      })
      .post(function(req, res) {
           res.send("no post")
      });



router.route('/searchbook')
.get(function(req, res) {
  res.render('searchbook', {
      title: '新书'
  });
})
.post(function(req, res) {
    res.send("no post")
});

router.route('/borrow')
.get(function(req, res) {
  var url_parts = url.parse(req.url, true);
  bookid = url_parts.query.bookid;
  name = url_parts.query.name;
  author = url_parts.query.author;
  console.log(bookid);
  res.render('borrow', {
      bookid: bookid,
      name: name,
      author: author
  });
})
.post(function(req, res) {
    res.send("no post")
});


router.route('/confirmborrow')
.get(function(req, res) {
    var url_parts = url.parse(req.url, true);
    bookid = url_parts.query.bookid;
    reader = url_parts.query.reader;
    thetime = (new Date()).getTime();

    queryStr = "insert into borrowinfo values('" + bookid + "','" + reader + "','" + thetime +"')";
    console.log(queryStr);

    pg.connect(connectionString, (err, client, done) => {
      client.query(queryStr, function(err, results, fields){
        if (!err) res.send("ok");
        });
      });
})
.post(function(req, res) {
      res.send("no post")
});

router.route('/returnbook')
.get(function(req, res) {
    var url_parts = url.parse(req.url, true);
    bookid = url_parts.query.bookid;
    reader = url_parts.query.reader;
    thetime = (new Date()).getTime();

    queryStr = "insert into borrowinfo values('" + bookid + "','" + reader + "','" + thetime +"')";
    console.log(queryStr);

    pg.connect(connectionString, (err, client, done) => {
      client.query(queryStr, function(err, results, fields){
        if (!err) res.send("ok");
        });
      });
})



router.route('/confirmreturnbook')
.get(function(req, res) {
    var url_parts = url.parse(req.url, true);
    bookid = url_parts.query.bookid;
    reader = url_parts.query.reader;
    thetime = url_parts.query.time;

    queryStr = "delete from borrowinfo where bookid='" + bookid + "' and reader='"+reader+"' and thetime='"+thetime+"';";
    console.log(queryStr);

    pg.connect(connectionString, (err, client, done) => {
      client.query(queryStr, function(err, results, fields){
        if (!err) res.send("ok");
        });
      });
})
.post(function(req, res) {
      res.send("no post")
});

router.route('/getbookborrowlist')
.get(function(req, res) {
    var url_parts = url.parse(req.url, true);
    bookid = url_parts.query.bookid;

    queryStr = "select reader, thetime from borrowinfo where bookid='" + bookid + "';";
    console.log(queryStr);

    pg.connect(connectionString, (err, client, done) => {
      client.query(queryStr, function(err, results, fields){
        console.log(results.rows);
        if (!err) res.json(results.rows);
        });
      });
})
.post(function(req, res) {
      res.send("no post")
});

router.route('/searchbooklist')
  .get(function(req, res) {
              var url_parts = url.parse(req.url, true);
              keywords = url_parts.query.keywords;

              queryStr = "select bookid, name, author from bookinfo where name like '%" + keywords + "%' or author like '%" + keywords + "%' or description like '%" + keywords + "%' limit 100;";
              console.log(queryStr);

              pg.connect(connectionString, (err, client, done) => {
                client.query(queryStr, function(err, results, fields){
                  if (!err) res.json(results.rows);
                  });
                });
  })
  .post(function(req, res) {
      res.send("no post")
  });

router.route('/bookdetail')
  .get(function(req, res) {
    var url_parts = url.parse(req.url, true);
    bookid = url_parts.query.bookid;
    name = url_parts.query.name;
    author = url_parts.query.author;
    console.log(bookid);
    res.render('bookdetail', {
        bookid: bookid,
        name: name,
        author: author
    });
  })
  .post(function(req, res) {
      res.send("no post")
  });



router.route('/getbookdetail')
  .get(function(req, res) {
              var url_parts = url.parse(req.url, true);
              bookid = url_parts.query.bookid;

              queryStr = "select * from bookinfo where bookid='" + bookid + "';";
              console.log(queryStr);

              pg.connect(connectionString, (err, client, done) => {
                client.query(queryStr, function(err, results, fields){
                //  console.log(results.rows);
                  if (!err) res.json(results.rows);
                  });
                });
  })
  .post(function(req, res) {
      res.send("no post")
  });


module.exports = router;
