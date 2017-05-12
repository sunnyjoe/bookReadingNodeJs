const express = require('express');
const router = express.Router();

const url = require('url');
const heorkuDbUrl = 'postgres://yyahnrmdhogkni:ed11615dbf0849b9bfe9454bcd49e277cd56138fa338d1edf2aacddbe754394e@ec2-54-83-205-71.compute-1.amazonaws.com:5432/d5fpav39pfmns8';
const pg = require('pg');
const path = require('path');
const connectionString = heorkuDbUrl;//'postgres://localhost:5432/biblereading';

const fs = require('fs');
var dir = path.join(__dirname, 'public');

var homeTitle = "方舟图书系统"
// /* GET home page. */
// router.get('/', function(req, res) {
//     console.log("Hello World");
//
//     if (req.cookies.islogin) {
//         req.session.islogin = req.cookies.islogin;
//     }
//     if (req.session.islogin) {
//         res.locals.islogin = req.session.islogin;
//     }
//
//     if (req.cookies.islogin) {
//         console.log("render home");
//         res.render('home', {
//             title: homeTitle,
//             user: res.locals.islogin
//         });
//     } else {
//         console.log("render login");
//         res.render('login', {
//             title: homeTitle,
//             user: res.locals.islogin
//         });
//     }
// });
//
//
// router.route('/login')
//     .get(function(req, res) {
//         res.redirect('/');
//     })
//     .post(function(req, res) {
//         const username = req.body.username;
//         const password = req.body.password;
//         found = false;
//         pg.connect(connectionString, (err, client, done) => {
//             // Handle connection errors
//             if (err) {
//                 console.log('A db connect error occurred: ' + err);
//                 res.redirect('/');
//                 return;
//             }
//
//             queryStr = "select * from userinfo where name='" + username + "' and password ='" + password + "';";
//             console.log("queryStr " + queryStr);
//
//             var query = client.query(queryStr);
//             var rows = [];
//             query.on('row', function(row, res) {
//                 rows.push(row);
//             });
//             query.on('end', function(result) {
//                 if (result.rowCount > 0) {
//                     console.log('user found :)');
//                     req.session.islogin = username;
//                     res.locals.islogin = username;
//                     res.cookie('islogin', username, {
//                         maxAge: 60000
//                     });
//                     res.redirect('/home');
//                 } else {
//                     console.log('user not found');
//                     res.redirect('/');
//                 }
//             });
//
//         });
//
//
//     });
//
// router.get('/logout', function(req, res) {
//     res.clearCookie('islogin');
//     req.session.destroy();
//     res.redirect('/');
// });
//
// router.route('/home')
//     .get(function(req, res) {
//         if (req.session.islogin) {
//             res.locals.islogin = req.session.islogin;
//         }
//         if (req.cookies.islogin) {
//             req.session.islogin = req.cookies.islogin;
//         }
//
//         if (req.cookies.islogin) {
//             console.log("render home");
//             res.render('home', {
//                 title: homeTitle,
//                 user: res.locals.islogin
//             });
//         } else {
//             res.redirect('/');
//         }
//     })
//     .post(function(req, res) {
//         res.send("no action")
//     });
//
//
// router.route('/reg')
//     .get(function(req, res) {
//         res.render('reg', {
//             title: '注册'
//         });
//     })
//     .post(function(req, res) {
//         pg.connect(connectionString, (err, client, done) => {
//             name = req.body.username;
//             pw = req.body.password2;
//             queryStr = "insert into UserInfo values('" + name + "','" + pw + "')";
//             console.log(queryStr);
//             client.query(queryStr);
//             if (err) res.send('该用户名已经存在，请返回重新注册');
//             res.clearCookie('islogin');
//             req.session.destroy();
//             res.redirect('/');
//         });
//     });

router.route('/')
    .get(function(req, res) {
        res.render('booklist', {
            title: '添加新书'
        });
    })
    .post(function(req, res) {
        res.send("no post")
    });

router.route('/images')
.get(function(req, res) {

  var url_parts = url.parse(req.url, true);
  var name = url_parts.query.name;
  var file = path.join(dir, name);

    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.setHeader('Content-Type', 'image/jpeg');
        s.pipe(res);
    });

});

router.route('/newaddedbooknextpage')
    .get(function(req, res) {
         var url_parts = url.parse(req.url, true);
         isnext = url_parts.query.isnext;
         timestamp = url_parts.query.timestamp;

         var queryStr = "select bookid, name from bookinfo where bookid > '"+timestamp+"'order by bookid asc limit 35;";
         if (isnext==1){
           queryStr = "select bookid, name from bookinfo where bookid < '"+timestamp+"'order by bookid desc limit 35;";
         }
        console.log(queryStr);

        var client = new pg.Client(connectionString);
        client.connect()

        if (!client) res.json()
        client.query(queryStr, function(err, results, fields) {
            client.end();
            if (!err) {
                res.json(results.rows);
            } else {
                res.json()
            }
        });
    })
    .post(function(req, res) {
        res.send("no post")
    });

// router.route('/newaddedbook')
//     .get(function(req, res) {
//         queryStr = "select bookid, name, author from bookinfo order by bookid desc limit 5;";
//         console.log(queryStr);
//
//         var client = new pg.Client(connectionString);
//         client.connect()
//
//         if (!client) res.json()
//         client.query(queryStr, function(err, results, fields) {
//             client.end();
//             if (!err) {
//                 res.json(results.rows);
//             } else {
//                 res.json()
//             }
//         });
//     })
//     .post(function(req, res) {
//         res.send("no post")
//     });

router.route('/searchbooklist')
    .get(function(req, res) {
        var url_parts = url.parse(req.url, true);
        keywords = url_parts.query.keywords;

        queryStr = "select bookid, name, author from bookinfo where name like '%" + keywords + "%' or author like '%" + keywords + "%' or description like '%" + keywords + "%' limit 100;";
        console.log(queryStr);

        var client = new pg.Client(connectionString);
        client.connect()

        client.query(queryStr, function(err, results, fields) {
            client.end();

            if (!err) {
                res.json(results.rows);
            }
            console.log(results.rows)
            res.end();
        });
    })
    .post(function(req, res) {
        res.send("no post")
    });

router.route('/addbook')
    .get(function(req, res) {
        res.render('addbook2', {
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

        queryStr = "insert into bookinfo values('" + timestamp + "','" + name + "','" + author + "','" + desc + "','" + count + "'); insert into borrowhistory values('" + timestamp+ "','0');";
        console.log(queryStr);

        var client = new pg.Client(connectionString);
        client.connect();

        client.query(queryStr, function(err, results, fields) {
            client.end();

            if (!err) {
                res.send('ok');
            }
            console.log(results.rows)
            res.end();
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

router.route('/getbookborrowlist')
    .get(function(req, res) {
        var url_parts = url.parse(req.url, true);
        bookid = url_parts.query.bookid;
        queryStr = "select reader, thetime from borrowinfo where bookid='" + bookid + "';";
        console.log(queryStr);

        var client = new pg.Client(connectionString);
        client.connect();

        client.query(queryStr, function(err, results, fields) {
            client.end();
            // console.log(results.rows);
            if (!err) res.json(results.rows);
            res.end();
        });
    })
    .post(function(req, res) {
        res.send("no post")
    });

    router.route('/popularbooks')
        .get(function(req, res) {
            var url_parts = url.parse(req.url, true);
            bookid = url_parts.query.bookid;

            var queryStr = "SELECT p.bookid, t.name, t.author FROM (SELECT * FROM borrowhistory ORDER BY thetime limit 50) p INNER JOIN bookinfo t ON p.bookid = t.bookid order by thetime desc;";
            console.log(queryStr);

            var client = new pg.Client(connectionString);
            client.connect();

            client.query(queryStr, function(err, results, fields) {
                client.end();
                if (!err) res.json(results.rows);
                res.end();
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

        var queryStr = "insert into borrowinfo values('" + bookid + "','" + reader + "','" + thetime + "');";
        updateStr= "insert into borrowhistory select '" + bookid + "', '0' where not exists (select * from borrowhistory where bookid='" + bookid + "'); update borrowhistory set thetime=thetime + 1 where bookid='" + bookid + "';"
        queryStr += updateStr;
        console.log(queryStr);

        var client = new pg.Client(connectionString);
        client.connect();

        client.query(queryStr, function(err, results, fields) {
            client.end();
            if (!err) res.send("ok");
            res.end();
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

        queryStr = "insert into borrowinfo values('" + bookid + "','" + reader + "','" + thetime + "');";
        console.log(queryStr);

        var client = new pg.Client(connectionString);
        client.connect();

        client.query(queryStr, function(err, results, fields) {
            client.end();
            if (!err) res.send("ok");
            res.end();
        });
    })



router.route('/confirmreturnbook')
    .get(function(req, res) {
        var url_parts = url.parse(req.url, true);
        bookid = url_parts.query.bookid;
        reader = url_parts.query.reader;
        thetime = url_parts.query.time;

        queryStr = "delete from borrowinfo where bookid='" + bookid + "' and reader='" + reader + "' and thetime='" + thetime + "';";
        console.log(queryStr);

        var client = new pg.Client(connectionString);
        client.connect();

        client.query(queryStr, function(err, results, fields) {
            client.end();
            if (!err) res.send("ok");
            res.end();
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

        var client = new pg.Client(connectionString);
        client.connect();

        client.query(queryStr, function(err, results, fields) {
            client.end();
            if (!err) res.json(results.rows);
            res.end();
          });
   })
   .post(function(req, res) {
       res.send("no post")
   });


   router.route('/editbook')
       .get(function(req, res) {
           var url_parts = url.parse(req.url, true);

           var bookid = url_parts.query.bookid;
           var name= url_parts.query.name;
           var author= url_parts.query.author;
           var desc= url_parts.query.desc;
           var count= url_parts.query.count;

        //   console.log(name);

           res.render('editbook', {
             bookid: bookid,
             name: name,
             author: author,
             desc: desc,
             count: count
           });
       })
       .post(function(req, res) {
           res.send("no post")
       });

   router.route('/updatebook')
       .get(function(req, res) {
         var url_parts = url.parse(req.url, true);
           bookid = url_parts.query.bookid;
           name = url_parts.query.name;
           author = url_parts.query.author;
           desc = url_parts.query.desc;
           count = url_parts.query.count;

           queryStr = "update bookinfo set name='"+name+"', author='"+author+"', description='"+desc+"', count='"+count+"'where bookid='"+bookid+"';";
           console.log(queryStr);

           var client = new pg.Client(connectionString);
           client.connect();

           client.query(queryStr, function(err, results, fields) {
               client.end();

               if (!err) {
                   res.send('ok');
               }
               res.end();
           });
       })
       .post(function(req, res) {
           res.send("no post")
       });

module.exports = router;
