
var app = angular.module('myApp', [ 'ngRoute' ]);
app.config(function($routeProvider) {
	console.log("inside routeprovider");
		$routeProvider
		
		
		.when("/sell", {
			templateUrl : "templates/sell.html",
			
			
		})
		
		.when("/buy", {
			templateUrl : "templates/buy.ejs",
			
			
		})
		
		.when("/cart", {
			templateUrl : "templates/cart.ejs",
			
			
		})
		.when("/history", {
			templateUrl : "templates/history.ejs",
			
			
		})
		.when("/yourads", {
			templateUrl : "templates/yourads.ejs",
			
			
		})
		.when("/info", {
			templateUrl : "templates/info.ejs",
			
			
		})
		.when("/buy2", {
			templateUrl : "templates/buy2.ejs",
			
			
		})
		
		.when("/bidding", {
			templateUrl : "templates/bidding.ejs",
			
			
		})
	});



app.controller('sellController1', function($scope,$http) {
	console.log("I am in sell controller");
	console.log("here" +$scope.status);
	console.log("printing product name" + $scope.p_name);
	$scope.addproduct = function() {
		$http({
			method : "POST",
			url : '/sell',
			data : {
				"p_name" : $scope.p_name,
				"p_price" : $scope.p_price,
				"p_disc" : $scope.p_disc,
				"p_bid" : $scope.p_bid,
				"p_info":$scope.p_info,
				"p_number" : $scope.p_number
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 200) {
				console.log("sent the data over server succssfully.");
			
			}
			else
				{
				console.log("failed while sending data new product");
				}
				//Making a get call to the '/redirectToHomepage' API
		}).error(function(error) {
               console.log("failed inside products.js");
		});
	};
});








app.controller('buyController', function($scope,$http) {
	console.log("I am in buy controller");
	//console.log("here" +$scope.status);
	//console.log("printing product name" + $scope.p_name);
	
		$http({
			method : "POST",
			url : '/buy'
			
		}).success(function(data) {
			//checking the response data for statusCode
			console.log(data+ "oho");
			if (data.statusCode == 200) {
				console.log("data received successfully");
				$scope.allproducts = data.results;
				console.log("Result fetached is " + $scope.allproducts);
				console.log(JSON.stringify($scope.allproducts));
				
			
			}
			else
				{
				console.log("failed while sending data new product");
				}
				//Making a get call to the '/redirectToHomepage' API
		}).error(function(error) {
               console.log("failed inside products.js");
		});
		
	
		
		$scope.addToBid = function(data,bid) {
			
			console.log(data);
			console.log(bid);
			console.log("inside the addToBid");
			var p_id = {
				"p_id" : data,
				"bidding": bid
			
			};
		
			console.log("inside bid function");
			$http({
				method : "POST",
				url : '/addToBid',
				data : p_id
			}).success(function(data) {

				if (data.statusCode == 200) {
					console.log("added to the bid successfully");
				} else {
					console.log("error while adding data to the cart");
				}
			})
		}
		
});

app.controller('buy2Controller', function($scope,$http) {
	console.log("I am in buy controller");
	//console.log("here" +$scope.status);
	//console.log("printing product name" + $scope.p_name);
	
		$http({
			method : "POST",
			url : '/buy2'
			
		}).success(function(data) {
			//checking the response data for statusCode
			console.log(data+ "oho");
			if (data.statusCode == 200) {
				console.log("data received successfully");
				$scope.allproducts = data.results;
				console.log("Result fetached is " + $scope.allproducts);
				console.log(JSON.stringify($scope.allproducts));
				
			
			}
			else
				{
				console.log("failed while sending data new product");
				}
				//Making a get call to the '/redirectToHomepage' API
		}).error(function(error) {
               console.log("failed inside products.js");
		});
		
		
	$scope.addToCart = function(data) {
			var p_id = {
				"p_id" : data
			};
			console.log(p_id);
			console.log(data.p_price);
			console.log(JSON.stringify(data)+"stringify");

			console.log("inside addCart function");
			$http({
				method : "POST",
				url : '/addToCart',
				data : p_id
			}).success(function(data) {

				if (data.statusCode == 200) {
					console.log("added to the cart successfully");
				} else {
					console.log("error while adding data to the cart");
				}
			})
		}
		
		
	/*	$scope.addToBid = function(data,bid) {
			
			console.log(data);
			console.log(bid);
			var p_id = {
				"p_id" : data,
				"bid"  : bid
			};
		
			console.log("inside bid function");
			$http({
				method : "POST",
				url : '/addToBid',
				data : p_id
			}).success(function(data) {

				if (data.statusCode == 200) {
					console.log("added to the bid successfully");
				} else {
					console.log("error while adding data to the cart");
				}
			})
		}*/
		
});

app.controller('cartController', function($scope,$http,$route) {
	console.log("I am in cart controller");

			$http({
			method : "POST",
			url : '/cart'
			
		}).success(function(data) {
			//checking the response data for statusCode
			console.log(data+ "oho");
			if (data.statusCode == 200) {
				console.log("data received successfully");
				$scope.allproducts = data.results;
				//console.log("Result fetached is " + $scope.allproducts);
				//console.log(JSON.stringify($scope.allproducts));
				
			
			}
			else
				{
				console.log("failed while sending data new product");
				}
		}).error(function(error) {
               console.log("failed inside products.js");
		});
		
		
		$scope.purchase = function() {
			
			console.log("inside the purchse function");
			//console.log(JSON.stringify(data.Object+ "products inside the cart for purchase"));
			//console.log("printing p_id object"+p_id);
			//console.log("Printing the card number"+p_id.card);
			
			
			//credit card validation code
			
			
			if($scope.card.length===16 && $scope.cvv.length===3 && !isNaN($scope.card)){
			var p = 0;
			$http({
				method : "POST",
				url : '/purchase',
				//data : p_id
			}).success(function(data) {

				if (data) {
					console.log("purchased successfully"+data.price);
					confirm("total cost " + data.price);
				} else {
					console.log("error while adding data to the cart");
					//alert("invalid credentails");
					console.log("purchased successfully"+data.price);
					p = data.price;
					$scope.price = p;

				}
			})
						$scope.price = p;

			//confirm("item purchased successfully"+p);
			
			$route.reload();

			
			}
			
			else {
				alert("invalid credentails");
				
			}
		}
		
			
			
			
			$scope.deleteFromCart = function(data) {
				var p_id = {
					"p_id" : data,
				};
				
				console.log("Printing the product name"+p_id.p_name);
				console.log("inside delete from cart function");
				
				
				//credit card validation code
				
				
				
				$http({
					method : "POST",
					url : '/delete',
					data : p_id
				}).success(function(data) {

					if (data.statusCode == 200) {
						console.log("purchased successfully");
						alert("item purchased");
					} else {
						console.log("error while adding data to the cart");
						//alert("invalid credentails");
					}
				})
				
				alert("item removed successfully");
				$route.reload();
				}
			
});



app.controller('historyController', function($scope,$http) {
	console.log("I am in history controller");
	//console.log("here" +$scope.status);
	//console.log("printing product name" + $scope.p_name);
	
		$http({
			method : "POST",
			url : '/history'
			
		}).success(function(data) {
			//checking the response data for statusCode
			console.log(data+ "oho");
			if (data.statusCode == 200) {
				console.log("data received successfully");
				$scope.allproducts = data.results;
				console.log("Result fetached is " + $scope.allproducts);
				console.log(JSON.stringify($scope.allproducts));
				}
			else
				{
				console.log("failed while sending data new product");
				}
				//Making a get call to the '/redirectToHomepage' API
		}).error(function(error) {
               console.log("failed inside products.js");
		});
		
});



app.controller('youradsController', function($scope,$http,$route) {
	console.log("I am in yourads controller");
	//console.log("here" +$scope.status);
	//console.log("printing product name" + $scope.p_name);
	
		$http({
			method : "POST",
			url : '/yourads'
			
		}).success(function(data) {
			//checking the response data for statusCode
			console.log(data+ "oho");
			if (data.statusCode == 200) {
				console.log("data received successfully");
				$scope.allproducts = data.results;
				console.log("Result fetached is " + $scope.allproducts);
				console.log(JSON.stringify($scope.allproducts));
				}
			else
				{
				console.log("failed while sending data new product");
				}
				//Making a get call to the '/redirectToHomepage' API
		}).error(function(error) {
               console.log("failed inside info.js");
		});
		
});



app.controller('infoController', function($scope,$http,$route) {
	

	
	
	console.log("I am in info controller");
	console.log("here" +$scope.Birthday);
	console.log("printing USER  contact number " + $scope.Contact);
	
	
	var i = 0;
	
	

	$http({
		method : "POST",
		url : '/info1'
		
	}).success(function(data) {
		//checking the response data for statusCode
		console.log(data+ "oho");
		if (data.statusCode == 200) {
			console.log("data received successfully");
			$scope.allproducts = data.results;
			if(i=0)
				{
				$route.reload();
				i++;

				}

			console.log("Result fetached is " + $scope.allproducts);
			console.log(JSON.stringify($scope.allproducts));
			//$route.reload();

			}
		else
			{
			console.log("failed while sending data new product");
			}
			//Making a get call to the '/redirectToHomepage' API
	}).error(function(error) {
           console.log("failed inside info.js");
	});
	
	
	
	
	
	
	

	$scope.addinfo = function() {
		$http({
			method : "POST",
			url : '/info',
			data : {
				"about" : $scope.about,
				"Birthday" : $scope.Birthday,
				"Ebay_handle" : $scope.Ebay_handle,
				"Address" : $scope.Address,
				"Contact" : $scope.Contact
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 200) {
				console.log("sent the data over server succssfully.");
				$scope.allproducts = data.results;
				//$route.reload();

				console.log("Result fetached is " + $scope.allproducts);
				console.log(JSON.stringify("This is the data receved fom server"+$scope.allproducts));
				console.log(JSON.stringify($scope.allproducts));

			
			}
			else
				{
				console.log("failed while sending data new product");
				}
				//Making a get call to the '/redirectToHomepage' API
		}).error(function(error) {
               console.log("failed inside info.js");
		});
		
		$route.reload();

	};
});



app.controller('biddingController', function($scope,$http) {
	console.log("I am in bidding controller");
	//console.log("here" +$scope.status);
	//console.log("printing product name" + $scope.p_name);
	
		$http({
			method : "POST",
			url : '/bidding'
			
		}).success(function(data) {
			//checking the response data for statusCode
			console.log(data+ "oho");
			if (data.statusCode == 200) {
				console.log("data received successfully");
				$scope.allproducts = data.results;
				console.log("Result fetached is " + $scope.allproducts);
				console.log(JSON.stringify($scope.allproducts));
				}
			else
				{
				console.log("failed while sending data new product");
				}
				//Making a get call to the '/redirectToHomepage' API
		}).error(function(error) {
               console.log("failed inside products.js");
		});
		
});


