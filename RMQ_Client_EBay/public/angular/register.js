var register = angular.module('register', []);
login.controller('register', function($scope, $http) {

 	
	$scope.register_user = function() {
		
	console.log("inside register sending data to server");
	console.log($scope.firstname);
	var user = {
			"firstname" : $scope.firstname,
			"lastname" : $scope.lastname,
			"username" : $scope.email,
			"password" : $scope.pwd
	};
	

	
			
			$http({
				method : "POST",
				url : '/registeruser',
				data : user
			     }).success(function(data){
			    	 	console.log("inside success of registeruser");
			    	 	
			     }).error(function(error){
			    	 console.log("error aya hai aya hai error aya hai.inside success buy");
			});
		};
			
});
