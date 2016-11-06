var ejs = require("ejs");
var session = require("express-session");
var mysql = require('./mysql');
var mongo = require('./mongo');
var objectid = require('objectid')
var ObjectId = require('mongodb').ObjectId; 
var mq_client = require('../rpc/client');



var sign = false;
var bcrypt = require('bcrypt');
const saltRounds = 10;
//const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
var mongoURL = "mongodb://localhost:27017/ebay";
var cartitems= [];

function signin(req,res) {
		res.render('signin.ejs',function(err, result) {
 // render on success
			if (!err) {
				res.end(result);
				console.log("inside signin");
			}
 // render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});
	}


function register(req,res) {
	res.render('register.ejs',function(err, result) {
// render on success
		if (!err) {
			res.end(result);
			
			console.log("inside register");
		}
// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}

function afterSignIn(req,res)
{
	
	




	console.log("inside the aftersignin");
		console.log(req.param("username"));
		console.log(req.param("password"));
		var username = req.param("username");
		var password_db = req.param("password");
		var pass = req.param("pwd");
		var salt = bcrypt.genSaltSync(saltRounds);
		var hash = bcrypt.hashSync(password_db, salt);
		//var firstname = req.session.username.firstname;
		//var lastname = req.session.username.lastname;

		if(bcrypt.compareSync(password_db, hash))
			{
			console.log("true. Encryption works ");
			}



	var mongoURL = "mongodb://localhost:27017/ebay";


	mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');

			coll.findOne({username: username}, function(err, user){
				if (user) {
	                    if(bcrypt.compareSync(password_db, hash))
	                        {
					// This way subsequent requests will know the user is logged in.
	                    	
	                    	console.log("successfully compared password");
	                    	//console.log(" date"+ new Date.getTime());
	                    	var d= new Date();
	                    	console.log(d);
	                    	
	                //adding code for displaying last login time
	                    	
	                    	coll.update({username: username},{$set: {time:d}},{upsert:true}, function(err, user){
	                            if (user) {
	                                    json_responses = {"statusCode" : 200};
					                    console.log("valid Login");
					                    console.log("added time successfullly");
			
	                            } 
	                            else
	                                {
	                                    console.log("returned false");
					                    json_responses = {"statusCode" : 401};
	                                    console.log("error while setting up the time");
					                    //res.send(json_responses);
				                     }
			              });
	                              	
	                    	
	                    	
					req.session.username = user;
					console.log(req.session.username.username +" is the session usrname");
					var jsonString = JSON.stringify(req.session.username);
					console.log("complet josn object is"+jsonString)
					json_responses = {"statusCode" : 200};
					//res.send(json_responses);
	                res.render('successLogin.ejs', {data: req.session.username},function(err, result) {
											// render on success
											if (!err) {
												res.end(result);
												sign = true;
											}
											// render or error
											else {
												res.end('An error occurred');
												console.log(err);
											}
										});

				}
	            }
	                else {
					console.log("returned false");
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
			});
		});







}







  exports.login = function(req,res) //redirect function to the homepage
  {
	  //console.log(req.session.username[0].username+ "checking the exports login");
	  
	  
	  
	  if(req.session.username && sign === true) //check whether session is valid
	  {
		  //console.log("cheking the validity inside login page"+ req.session.username[0].username);
		  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        
		  res.render("successLogin",{data: req.session.username});
	  }
	  else
	  {
		  res.render("signin");
	  }
  };


  
  exports.logout = function(req,res) //logout function
  {
	  sign = false;

	  //console.log(req.session.username[0].username+ "value of username before destroy");

      //res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');

	  req.session.destroy(); //destroy session
	  req.session = null;
      //res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');



	  res.redirect("signin");
      //res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');

	};


		
		
exports.registeruser = function(req,res){
	// These two variables come from the form on
	// the views/login.hbs page
	console.log("inside the registeruser");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var username = req.param("email");
	//var password = req.param("password");
	//console.log(password +" this is a password");
	console.log(username);
	var json_responses;

	var pass = req.param("pwd");
	console.log("the pasword without encryption is" + pass);
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(pass, salt);
	bcrypt.hash(req.param("pwd"), saltRounds, function(err, hash) {
		  // Store hash in your password DB. 
		});

	console.log("encryptrd password" + hash);
	
	msg_payload = {username: username, password:hash,firstname:firstname,lastname:lastname};
	
mq_client.make_request('register_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code === 200){
				console.log("valid Login");
				//req.session.username = results.msg;
                 
				res.render('signin.ejs', function(err, result) {
					// render on success
				if (!err) {
					res.end(result);
						
						}
					// render or error
						else {
						res.end('An error occurred');
						console.log(err);
					}
				});
				//console.log("printing here the msg"+results.msg.username);
				//res.send("welcome"+results.msg.username );
				//res.send({"login":"Success"});
			}
			else if(results.code === 401){    
				
				console.log("Invalid Login baby");
				res.send({"login":"Fail"});
			}
			else {
				console.log("code not working");
				
			}
		}  
	});
	
	

};

//show all the products up for bidding

exports.buy = function (req, res) {

	
	var msg_payload = {username : req.session.username};
mq_client.make_request('buy_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("successfully received the buying itesm for bidding");
				console.log(results.items.p_name + "is the product received");
				console.log("printing JSON"+JSON.stringify(results.items));
				var json_response = {
						"results" : results.items,"statusCode" : 200 
					};
				res.send(json_response);

		
			}
			else if(results.code == 401){    
				
				console.log("Invalid Login baby");
				res.send({"login":"Fail"});
			}
			else {
				console.log("code not working");
				
			}
		}  
	});
	
	

	
}

exports.buy2 = function (req, res) {

	
	var msg_payload = {username : req.session.username};
mq_client.make_request('buy2_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("successfully received the buying itesm for bidding");
				console.log(results.items.p_name + "is the product received");
				console.log("printing JSON"+JSON.stringify(results.items));
				var json_response = {
						"results" : results.items,"statusCode" : 200 
					};
				res.send(json_response);

		
			}
			else if(results.code == 401){    
				
				console.log("Invalid Login baby");
				res.send({"login":"Fail"});
			}
			else {
				console.log("code not working");
				
			}
		}  
	});
	}


exports.sell = function(req,res){
	var p_name = req.param("p_name");
	var p_price = req.param("p_price");
	var p_disc = req.param("p_disc");
	var p_info = req.param("p_info");
	var p_number = req.param("p_number");
	var p_bid = req.param("p_bid");

	
	var username = req.session.username.username;
	console.log(req.param("p_name")+ req.param("p_price")+req.param("p_disc"));
	console.log(username);
	var date = new Date();

	//mongo connect here
	
	var msg_payload = {p_name: p_name,p_price:p_price,p_disc:p_disc,p_now : new Date(),username : username,p_info:p_info,p_number:p_number,p_bid:p_bid,endtime:new Date(date.setTime( date.getTime() + 3 * 240000 ))};

	
	
	
mq_client.make_request('sell_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code === 200){
				console.log("valid Login");
				//req.session.username = results.msg;
                 
				res.render('signin.ejs', function(err, result) {
					// render on success
				if (!err) {
					res.end(result);
						
						}
					// render or error
						else {
						res.end('An error occurred');
						console.log(err);
					}
				});
				//console.log("printing here the msg"+results.msg.username);
				//res.send("welcome"+results.msg.username );
				//res.send({"login":"Success"});
			}
			else if(results.code === 401){    
				
				console.log("Invalid Login baby");
				res.send({"login":"Fail"});
			}
			else {
				console.log("code not working");
				
			}
		}  
	});
	

};


exports.addToCart  = function(req,res){
	//this is the object entire product object sent 
	var p_id = req.param("p_id");
	//inserting into cart 
	var p_name = p_id.p_name;
	var p_price = p_id.p_price;
	var p_disc = p_id.p_disc;
	var p_info = p_id.p_info;
	var p_number = p_id.p_number;
	var p_bid = p_id.p_bid;
	var seller = p_id.username;
	var _id = p_id._id;
	cartitems = [];

	//console.log(p_id.p_name);
	var username = req.session.username.username;
	console.log(username);
	var date = new Date();

	var msg_payload = {_id :_id,p_name: p_name,p_price:p_price,p_disc:p_disc,p_now : new Date(),username : username,p_info:p_info,p_number:p_number,p_bid:p_bid,p_bid2: date.setDate(date.getDate() + 4),seller : seller};

mq_client.make_request('cart_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code === 200){
				console.log("valid Login");
				//req.session.username = results.msg;
                 
				res.render('signin.ejs', function(err, result) {
					// render on success
				if (!err) {
					res.end(result);
						
						}
					// render or error
						else {
						res.end('An error occurred');
						console.log(err);
					}
				});
				//console.log("printing here the msg"+results.msg.username);
				//res.send("welcome"+results.msg.username );
				//res.send({"login":"Success"});
			}
			else if(results.code === 401){    
				
				console.log("Invalid Login baby");
				res.send({"login":"Fail"});
			}
			else {
				console.log("code not working");
				
			}
		}  
	});
	
};


exports.cart = function (req, res) {

	
	var msg_payload = {username : req.session.username};
mq_client.make_request('show_cart_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("successfully received the buying itesm for bidding");
				console.log(results.items.p_name + "is the product received");
				console.log("printing JSON"+JSON.stringify(results.items));
				var json_response = {
						"results" : results.items,"statusCode" : 200 
					};
				res.send(json_response);

		
			}
			else if(results.code == 401){    
				
				console.log("Invalid Login baby");
				res.send({"login":"Fail"});
			}
			else {
				console.log("code not working");
				
			}
		}  
	});

}



//deleteing from cart


exports.deleteCart = function (req, res) {
	

	var msg_payload = {username : req.session.username};
mq_client.make_request('delete_cart_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("successfully deleted item from cart");
			

		
			}
			else if(results.code == 401){    
				
				console.log("Invalid Login baby");
				res.send({"login":"Fail"});
			}
			else {
				console.log("code not working");
				
			}
		}  
	});


}





exports.purchase = function (req, res){

console.log("babu is inside the purchase");
var msg_payload = {username : req.session.username};
mq_client.make_request('purchase_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("successfully babmbba item from purchase");
				
				/*mongo.connect(mongoURL, function(){
					console.log('Connected to mongo at: ' + mongoURL);
					var ram = mongo.collection('product');
					//ram.update({p_disc:p_disc},{$set : {sold : "yes"}}, function(err, user){
					ram.deleteOne({p_disc:results.items.p_disc}, function(err, user){

						   if (user) {
								
								console.log("Inside deleting the item from products table");
								

							} else {
								console.log("returned false");
								json_responses = {"statusCode" : 401};
							
							}
						});
					});*/
				
				
				
			

		
			}
			else if(results.code == 401){    
				
				console.log("Invalid Login baby");
				res.send({"login":"Fail"});
			}
			else {
				console.log("code not working");
				
			}
		}  
	});
	

}



//code to show the hstory of purchase


exports.history = function (req, res) {


	var msg_payload = {username : req.session.username};
mq_client.make_request('history_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("successfully received the buying itesm for bidding");
				console.log(results.items.p_name + "is the product received");
				console.log("printing JSON"+JSON.stringify(results.items));
				var json_response = {
						"results" : results.items,"statusCode" : 200 
					};
				res.send(json_response);

		
			}
			else if(results.code == 401){    
				
				console.log("Invalid Login baby");
				res.send({"login":"Fail"});
			}
			else {
				console.log("code not working");
				
			}
		}  
	});

	}




exports.yourads = function (req, res) {

	

	var msg_payload = {username : req.session.username};
mq_client.make_request('history_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("successfully received the yourads");
				console.log(results.items.p_name + "is the product received");
				console.log("printing JSON"+JSON.stringify(results.items));
				var json_response = {
						"results" : results.items,"statusCode" : 200 
					};
				res.send(json_response);

		
			}
			else if(results.code == 401){    
				
				console.log("Invalid Login baby");
				res.send({"login":"Fail"});
			}
			else {
				console.log("code not working");
				
			}
		}  
	});

}

exports.info = function(req,res){

	var about = req.param("about");
	var Birthday = req.param("Birthday");
	var Ebay_handle = req.param("Ebay_handle");
	var Address = req.param("Address");
	var Contact = req.param("Contact");
	var username = req.session.username.username;
	console.log(username);


	//mongo connect here
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		//select the collection here
		var coll = mongo.collection('users');
    	coll.update({username: username},{$set: {about:about,Birthday:Birthday,Ebay_handle:Ebay_handle,Address:Address,Contact:Contact}},{upsert:true}, function(err, user){

				if (user) 
					{
					json_responses = {"statusCode" : 200};
					console.log("successfully updated the information in mongo for user collection");
					//res.send(json-responses);
					} 
				else 
					{
					console.log("returned false");
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
					}
		});
	});
};


exports.info1 = function (req, res) {

	
	console.log('Connected to mongo at: ' + mongoURL);
	var coll = mongo.collection('users');
	var username = req.session.username.username;
	mongo.connect(mongoURL, function(){
		
		coll.findOne({username: username}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				console.log(req.session.username +" is the session");
				json_responses = {"statusCode" : 200 , "results" : user };
				res.send(json_responses);
				

			} else {
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
	});
	
}


exports.addToBid  = function(req,res){
	//this is the object entire product object sent 
	var p_id = req.param("p_id");
	//inserting into bid collection 
	var bidding = parseInt(req.param("bidding"));
	
	var product_id = p_id._id;
	var p_name = p_id.p_name
	var p_price = p_id.p_price;
	var p_disc = p_id.p_disc;
	var p_info = p_id.p_info;
	var p_number = p_id.p_number
	var p_bid = p_id.p_bid;
	var owner = p_id.username;
	var p_now = new Date(p_id.p_now);
	var endtime = new Date(p_id.endtime);

	
	var username = req.session.username.username;
	console.log("my emial id is"+username);
	console.log("got product in bid table"+p_id.p_name);
	console.log("received the bidding succesfully"+bidding);
	console.log("printing p_bid"+endtime);
	
	var date = new Date();

	//mongo connect here
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		//select the collection here
		var coll = mongo.collection('bid');
	coll.insert({product_id :product_id ,p_name: p_name,p_price:p_price,p_disc:p_disc,bidding_started :p_now,username : username,p_info:p_info,p_number:p_number,p_bid:p_bid,endtime:endtime ,seller : owner,bidding:bidding}, function(err, user){

				if (user) 
					{
					json_responses = {"statusCode" : 200};
					console.log("valid Login");
					} 
				else 
					{
					console.log("returned false");
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
					}
		});
	});
};


//bidding part here
/*setInterval(function(req,res){
	
	console.log("printing date"+ new Date());
	
	
	
	
	
	var p_now = new Date();

		mongo.connect(mongoURL, function(){	
	//	var username = req.session.username.username; 
		console.log("inside getAllProducts2");
		var json_response;
		var coll = mongo.collection('bid');
		var prod = mongo.collection('product');
		var history = mongo.collection('history');
		var cursor = coll.find( {endtime : {$lt : new Date }});
    
	//sorting the bids in descending order
		cursor.sort({bidding: -1});
		cursor.limit(1);
		cursor.each(function (err, doc) {
	      if (doc === null) {
	        console.log("nothing special");
	      } else {
	        console.log('Fetched:', doc);
	        
	        product_id = doc.product_id;
			//removing the product from product table since bidding time is over
		     prod.remove({_id:ObjectId(product_id)}, function(err, user){

				
				if (user=== null) 
					{
					json_responses = {"statusCode" : 200};
					console.log("item deleted from product.");
					//console.log("here bancho");
					} 
				else if (user)
					{
					console.log("error while deleting item from cart false");
					json_responses = {"statusCode" : 401};
					
					
			        //now i have got the maximum bid. deleting this max bid from bid and product table.
			        
			           console.log(doc.username+"product id bc");
			        var product_id = doc.product_id;
			        var p_name = doc.p_name
			       	var p_price = doc.p_price;
			       	var p_disc = doc.p_disc;
			       	var p_info = doc.p_info;
			       	var p_number = doc.p_number
			       	var p_bid = doc.p_bid;
			       	var bidwon = doc.username;
			       	var owner = doc.seller;
			       	var bidding = doc.bidding;
			     
			         //adding item into historical database for purchased item. Assisgning the item to the person with maximum bid
			           
			       	history.insert({product_id :product_id ,p_name: p_name,p_price:p_price,p_disc:p_disc,bidwon : bidwon,p_info:p_info,p_number:p_number,p_bid:p_bid,seller : owner,bidding:bidding}, function(err, user){

						if (user) 
							{
							json_responses = {"statusCode" : 200};
							console.log("valid Login");
							} 
						else 
							{
							console.log("returned false");
							json_responses = {"statusCode" : 401};
							res.send(json_responses);
							}
				});
					
				
					}
		})

	           
	           
	           
	           
	           
	           
	           
	           
	           
	           
	           
	           
	           //removing all the entries from bidding table. 
	           coll.remove({product_id:product_id}, function(err, user){
		
						
						if (user) 
							{
							json_responses = {"statusCode" : 200};
							console.log("item deleted from bid. Assisgned to the correct person.");
							//console.log("here bancho");
							} 
						else 
							{
							console.log("error while deleting item from cart false");
							json_responses = {"statusCode" : 401};
							//res.send(json_responses);
							}
				})	       
	      }
	     
	    });
	


       
 
})

}, 10000)*/





exports.bidding = function (req, res) {

	mongo.connect(mongoURL, function(){	
	var seller = req.session.username.username; 
	console.log("inside bidding show bidding status");
	var json_response;
	var coll = mongo.collection('bid');
var cursor = coll.find(    {seller : seller}  ).toArray(function(err, items) {

	//var cursor = coll.find({username : { $ne : username},p_bid: "no" }).toArray(function(err, items) {
		//console.log(items);
		json_response = {
				"results" : items, "statusCode" : 200 
			};
		//console.log(json_response);
		res.send(json_response);
		console.log("bidding status brother"+JSON.stringify(json_responses));

		
		}
	)}
)}











exports.register = register;
//exports.registeruser = registeruser;
exports.signin=signin;
exports.afterSignIn=afterSignIn;
