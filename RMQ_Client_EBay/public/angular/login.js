//loading the 'login' angularJS module


//defining the login controller
login.controller('login', function($scope, $http,$state) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	
	$scope.invalid_login = true;
	$scope.validlogin = true;
	
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/checklogin',
			data : {
				"username" : $scope.username,
				"password" : $scope.password
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.validlogin = true;
			}
			else
				{
				$scope.validlogin = false;
				$scope.invalid_login = true;
				}
				//Making a get call to the '/redirectToHomepage' API
				window.location.assign("/signin"); 
		}).error(function(error) {
			$scope.validlogin = true;
			$scope.invalid_login = true;
		});
	};
})





