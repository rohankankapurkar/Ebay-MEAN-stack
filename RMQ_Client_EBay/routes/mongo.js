var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
  
};


/*
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var numberOfConnection = 50;
var connection;
var statck = [];
var q = [];


var createConnectionPool = function(numberOfConnection){
	var conn;
	
	for(var count=0; count < numberOfConnection; count++){
		
exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      callback(db);
    });
};
		
		stack.push(conn);
		
	}
}

var getConnection = function(callback){
	
	if(stack.length > 0){
		console.log("Length of cntnStack in getConnection before pop: "+ cntnStack.length)
		connection = stack.pop();

		callback(null, connection);
	}
	else{
		q.push(callback);
	}
	
}

setInterval(function(){
	if(stack.length > 0){
		if(q.length > 0){
			callback = q.shift();
			connection = stack.pop();
			callback(null, connection);
		}
	}
}, 100000)


createConnectionPool(numberOfConnection);


exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
};

exports.collection = collection;*/