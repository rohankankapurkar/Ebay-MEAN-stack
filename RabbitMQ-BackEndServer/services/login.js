var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";


function handle_request(msg,callback){
	var res = {};
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('login');
		console.log("printing the username here"+msg.username);

		coll.findOne({username: msg.username, password:msg.password}, function(err, user){
			if (user) {
				console.log("habibi is here" +user.username);
				res.code = 200;
				res.value = "Success Login";
				res.msg = msg;
				console.log("found one entry in mongo db");
				callback(null, res);


			} else {
				console.log("returned false");
				res.code = 401;
				res.value = "Failed Login";
				//callback(null, res);
			}
		});
		
		
	});
}

function handle_register(msg,callback){
	mongo.connect(mongoURL, function(){
	console.log('Connected to mongo at: ' + mongoURL);
	var coll = mongo.collection('users');
   var res={};
	coll.insert({username: msg.username, password:msg.hash,firstname:msg.firstname,lastname:msg.lastname}, function(err, user){
		if (user) {
			
			console.log("Inside the server, Rabbittt MQ");
			res.code = 200;
			res.value = "Successfully registerd the user";
			res.msg = msg;
			callback(null, res);

		} else {
			console.log("returned false");
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
			res.code = 401;
			res.value = "Failed to register user";
		}
	});
});
}




function handle_buy(msg,callback){
	mongo.connect(mongoURL, function(){	
		var res = {};
		//var username = req.session.username.username; 
		console.log("inside handle buy function");
		console.log("The username inside the handle_buy is "+msg.username.username);
		var username = msg.username.username;
		var coll = mongo.collection('product');

		var cursor = coll.find({username : { $ne : username},p_bid: "yes", sold : {$ne : "yes"}}).toArray(function(err, items) {
			if (items)
			{
			console.log("I am printing the items in servr"+items.p_name);
			
			console.log("Inside the buy function, Rabbittt MQ");
			res.code = 200;
			res.value = "Successfully sent the buy items to the user";
			res.items = items;
			callback(null, res);
			}
			else
				{
				
				console.log("Error while getting the data from messge queue buy with bidding");
				}
			}
		);
		});
}



function handle_buy2(msg,callback){
	mongo.connect(mongoURL, function(){	
		var res = {};
		//var username = req.session.username.username; 
		console.log("inside handle buy function");
		console.log("The username inside the handle_buy is "+msg.username.username);
		var username = msg.username.username;
		var coll = mongo.collection('product');

		var cursor = coll.find({username : { $ne : username},p_bid: "no" , sold : {$ne : "yes" }}).toArray(function(err, items) {
			if (items)
			{
			console.log("I am printing the items in servr"+items.p_name);
			
			console.log("Inside the buy function, Rabbittt MQ");
			res.code = 200;
			res.value = "Successfully sent the buy items to the user";
			res.items = items;
			callback(null, res);
			}
			else
				{
				
				console.log("Error while getting the data from messge queue buy with bidding");
				}
			}
		);
		});
}


function handle_sell(msg,callback){
	mongo.connect(mongoURL, function(){
	console.log('Connected to mongo at: ' + mongoURL);
	var coll = mongo.collection('product');
   var res={};
	coll.insert({p_name: msg.p_name,p_price:msg.p_price,p_disc:msg.p_disc,p_now : msg.p_now,username : msg.username,p_info:msg.p_info,p_number:msg.p_number,p_bid:msg.p_bid,endtime:msg.endtime}, function(err, user){
		if (user) {
			
			console.log("Inside the server submitting the ad, Rabbittt MQ");
			res.code = 200;
			res.value = "Successfully inserted the ad";
			res.msg = msg;
			callback(null, res);

		} else {
			console.log("returned false");
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
			res.code = 401;
			res.value = "Failed to add product to the db";
		}
	});
});
}


function handle_cart(msg,callback){
	mongo.connect(mongoURL, function(){
	console.log('Connected to mongo at: ' + mongoURL);
	var coll = mongo.collection('cart');
   var res={};
	coll.insert({_id :msg._id,p_name: msg.p_name,p_price:msg.p_price,p_disc:msg.p_disc,p_now : msg.p_now,username : msg.username,p_info:msg.p_info,p_number:msg.p_number,p_bid:msg.p_bid,p_bid2: msg.p_bid2,seller : msg.seller}, function(err, user){
		if (user) {
			
			console.log("Inside the server submitting the ad, Rabbittt MQ");
			res.code = 200;
			res.value = "Successfully inserted the ad";
			res.msg = msg;
			callback(null, res);

		} else {
			console.log("returned false");
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
			res.code = 401;
			res.value = "Failed to add product to the db";
		}
	});
});
}


function handle_show_cart(msg,callback){
	mongo.connect(mongoURL, function(){
	console.log('Connected to mongo at: ' + mongoURL);
	var coll = mongo.collection('cart');
   var res={};
   coll.find({username : msg.username.username}).toArray(function(err, items) {
	   if (items) {
			
			console.log("Inside the server bringing the cart items , Rabbittt MQ");
			res.code = 200;
			res.value = "Successfully got all  the ads in the cart";
			res.items = items;
			callback(null, res);

		} else {
			console.log("returned false");
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
			res.code = 401;
			res.value = "Failed to add product to the db";
		}
	});
});
}




function handle_delete_cart(msg,callback){
	mongo.connect(mongoURL, function(){
	console.log('Connected to mongo at: ' + mongoURL);
	var coll = mongo.collection('cart');
   var res={};
	coll.deleteOne({username:msg.username.username}, function(err, items){
	   if (items) {
			
			console.log("Inside the server bringing the cart items , Rabbittt MQ");
			res.code = 200;
			res.value = "Successfully got all  the ads in the cart";
			res.items = items;
			callback(null, res);

		} else {
			console.log("returned false");
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
			res.code = 401;
			res.value = "Failed to add product to the db";
		}
	});
});
}

function handle_purchase(msg,callback){

	var coll = mongo.collection('cart');
	var res = {};
	var cursor = coll.find({username :  msg.username.username,p_bid: "no" }).toArray(function(err, items) {
		
		if(items)
			{
			console.log("found items in cart for this customer");
			
			items.forEach(function(obj) { 
				
				var history = mongo.collection('history');
					var id = obj._id;
					var p_name = obj.p_name;
					var p_price = obj.p_price;
					var p_disc = obj.p_disc;
					var seller = obj.seller;
					var bidwon = msg.username.username;
					
					history.insert({p_name : p_name , p_price: p_price, p_disc :p_disc, seller:seller,bidwon:bidwon,bidding : "directly purchased"}, function(err, user){

						if (user) 
							{
							mongo.connect(mongoURL, function(){
							console.log('Connected to mongo at: ' + mongoURL);
							var coll = mongo.collection('cart');
							var res={};
								coll.deleteOne({username:msg.username.username}, function(err, items){
								   if (items) {
										console.log("Inside deleting the item from products table");
										//res.code = 200;
										//res.value = "Successfully deleted from product";
										//res.items = items;
										//callback(null, res);
										console.log("deleing the item after purchaseing from cart RABBIITTT");
										mongo.connect(mongoURL, function(){
										console.log('Connected to mongo at: ' + mongoURL);
										var ram = mongo.collection('product');
										ram.update({p_name:p_name},{$set : {sold : "yes"}}, function(err, user){
										//ram.deleteOne({p_name:p_name}, function(err, user){

											   if (user) {
													
													console.log("Inside deleting the item from products table");
													res.code = 200;
													res.value = "Successfully deleted from product";
													res.items = items;
													callback(null, res);

												} else {
													console.log("returned false");
													json_responses = {"statusCode" : 401};
													res.send(json_responses);
													res.code = 401;
													res.value = "Failed to add product to the db";
												}
											});
										});
										
										
										
										
										
										
										
										
										
										
										
										

									} else {
										console.log("returned false");
										json_responses = {"statusCode" : 401};
										res.send(json_responses);
										res.code = 401;
										res.value = "Failed to add product to the db";
									}
								});
							});
							
							
							
							
							
							} 
						else 
							{
							console.log("returned false");
							//json_responses = {"statusCode" : 401};
							//res.send(json_responses);
							res.code = 401;
							res.value = "Error in the purchase function RabbitMQ";
							}
				});

				//price = price + parseInt(obj.p_price); cartitems[i]=obj.p_disc; i++; 
					});
			
			}
		
	})

}



function handle_history(msg,callback){
	mongo.connect(mongoURL, function(){
	console.log('Connected to mongo at: ' + mongoURL);
	var coll = mongo.collection('history');
   var res={};
   coll.find({bidwon : msg.username.username}).toArray(function(err, items) {
	   if (items) {
			
			console.log("Inside the server bringing the cart items , Rabbittt MQ");
			res.code = 200;
			res.value = "Successfully got all  the ads in the cart";
			res.items = items;
			callback(null, res);

		} else {
			console.log("returned false");
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
			res.code = 401;
			res.value = "Failed to add product to the db";
		}
	});
});
}



function handle_yourads(msg,callback){
	mongo.connect(mongoURL, function(){	
		var res = {};
		//var username = req.session.username.username; 
		console.log("inside handle buy function");
		console.log("The username inside the handle_buy is "+msg.username.username);
		var username = msg.username.username;
		var coll = mongo.collection('product');

		var cursor = coll.find({username:username}).toArray(function(err, items) {
			if (items)
			{
			console.log("I am printing the items in servr"+items.p_name);
			
			console.log("Inside the buy function, Rabbittt MQ");
			res.code = 200;
			res.value = "Successfully sent the buy items to the user";
			res.items = items;
			callback(null, res);
			}
			else
				{
				
				console.log("Error while getting the data from messge queue buy with bidding");
				}
			}
		);
		});
}









exports.handle_delete_cart = handle_delete_cart;
exports.handle_purchase = handle_purchase;
exports.handle_history = handle_history;

exports.handle_show_cart = handle_show_cart;
exports.handle_buy = handle_buy;
exports.handle_buy2 = handle_buy2;
exports.handle_sell = handle_sell;
exports.handle_cart = handle_cart;
exports.handle_request = handle_request;
exports.handle_register = handle_register;