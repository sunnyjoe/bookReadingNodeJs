var pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/BibleReading';

function connectServer(){
    var client = new pg.Client(connectionString);

    return client;
}


function  selectFun(client,username,callback){
    //client为一个pg连接对象
    client.query('select password from UserInfo where name="'+username+'"',function(err,results,fields){
        if(err) throw err;

        callback(results);
    });
}

function insertFun(client, username, password, callback){
    client.query('insert into UserInfo values(?,?)', [username, password], function(err,result){
        if( err ){
            console.log( "error:" + err.message);
            callback(err)
        }
          callback(err);
    });
}

function queryMyBibleLogFun(client, userName, callback){
	var query = 'select * from Readinglog where name =\''+userName+'\';';
    console.log("queryMyBibleLogFun " + query);
    client.query(query, function(err, results, fields){
    console.log("queryMyBibleLogFun " + query);
        if( err ) throw err;
        callback(err, results);
        });
}

function queryBibleLogFun(client, callback){
    var d = new Date();
    d.setHours(0,0,0,0);

    var today = d.getTime() / 1000;
    today = Math.floor(today);

    console.log("queryBibleLogFun " + today);

    client.query('select * from Readinglog where date >="'+today+'"', function(err, results, fields){
        if( err ) throw err;
    	console.log("queryBibleLogFun " + results);
        callback(err, results);
        });
}

function insertBibleLogFun(client, username, biblelog, callback){
    var current = Date.now() / 1000;
    current = Math.floor(current);
    console.log("insertBibleLogFun " + username + biblelog + current);
    client.query('insert into Readinglog values(?,?,?)', [username, biblelog, current], function(err,result){
        if( err ){
            console.log( "error:" + err.message);
            return err;
        }
          callback(err);
        });
}

exports.connect = connectServer;
exports.selectFun  = selectFun;
exports.insertFun = insertFun;
exports.insertBibleLogFun = insertBibleLogFun;
exports.queryBibleLogFun = queryBibleLogFun;
exports.queryMyBibleLogFun = queryMyBibleLogFun;
