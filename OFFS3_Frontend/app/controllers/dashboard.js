faculty.controller('dashboardCtrl',function($scope, $location, $rootScope, userService) {

	$scope.user = {}

	$scope.logout = function() {
		$location.path("/");
	}

	$scope.feedbackProcess = function() {
		$location.path("/userFeedback")
	}

	$scope.getUser = function() {
		console.log($rootScope);

		var enrollment_no = $rootScope.rollno;
		var tablename = $rootScope.userDetails.tablename;

		var table=tablename.split("_");
		$scope.college_name=table[0];

		$scope.tablename = $rootScope.userDetails.tablename;
		console.log(enrollment_no + ' ' + tablename);
		userService.getUser(enrollment_no, tablename, function(response) {
			$scope.user = response[0];
			$rootScope.userInfo = response[0];
			console.log($rootScope);
		})
	}



	$scope.getUser();
})
