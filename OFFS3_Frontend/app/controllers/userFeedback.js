
faculty.controller('feedbackCtrl',function($scope, $rootScope, $location, userService) {

	$scope.feedback;
	$scope.pointer  = 0;
	$scope.pointer2 = -1;
	$scope.seggregatedTeacherType = {}
	$scope.checkOccurence = 0;
	$scope.feedbackGivenByTheUser = [];
	$scope.buttonToggler = true;

	$scope.teacherFeedback = [];

	$scope.attributesList = {
		theory: [
			"Coverage of all the topics prescribed in the syllabus, with adequate depth and detail.",
			"Compliance with the number of teaching hours allotted and actual hours taught.",
			"Clarity of speech, pace of teaching, logical flows as well as continuity of thought and expression in lectures.",
			"Ability to explain the concepts clearly.",
	    	"Teaching methodology and the use of teaching aids (blackboard/power point presentation/OHP) adequately served your learning needs.",
	    	"Knowledge of the teacher in the subject.",
	    	"The extent of interaction students involvement students participation in discussing the subject matter.",
			"Encourages and makes you feel comfortable about asking questions. ",
			"Provides enthusiastic, clear and satisfactory response to students questions.",
			"Teacher generated enough interest and stimulated your intellectual curiosity.",
			"Teacher enhanced your capability to critically analyze and scrutinize scientific information.",
			"Stimulates and maintains interest and attention of students throughout the course.",
			"Because of the teacher you felt enthusiastic about studying the subject.",
			"How much enriched did you feel at the end of the course.",
			"Teaching helped you to develop an independent thinking/perspective about the subject."
		],
		practicals: [
			"The extent of direct supervision by the teacher throughout the practical.",
			"The theoretical basis technical considerations related to the experimental practical exercises were explained well.",
			"The experiments generated enough interest and helped in developing/strengthening your concepts.",
		    "Created sufficient opportunity for students to practice their skill.",
		    "Adequate time was devoted to interactive sessions to discuss analyze the results and clarify doubts of students.",
			"The teacher helped you build your capability to think and plan the experiments independently and analyze the results critically",
			"Encourages and makes you feel comfortable about asking questions.",
			"Provides enthusiastic, clear and satisfactory response to student s questions."
		]

	}

	$scope.getInstructorsForFeedback = function() {

		console.log($rootScope);

		var tablename = $rootScope.tablename;

		var table=tablename.split("_");
		$scope.college_name=table[0];
		// $scope.college_name = "usap";

		$scope.email = $rootScope.userInfo.email;
		// $scope.email = "hanugautam96@gmail.com";
		// var course = "B.Arch";
		// var stream = "Section A";
		// var semester = "1";

		var course = $rootScope.userInfo.course;;

		var stream = $rootScope.userInfo.stream;
		var semester = $rootScope.semester;


		console.log(course, stream, semester);
		userService.getInstructorsForFeedback($scope.college_name, course, stream, semester, function(response) {
			$scope.feedback = response;

			console.log(response);
			for (var x=0;x<$scope.feedback.length;x++) {
				$scope.feedback[x].type = ($scope.feedback[x].type).toLowerCase();

			}

			var seggregatedTeacherType = _.groupBy(response, function(result) {
            		return result.type;
        	});
			console.log(seggregatedTeacherType);
        	$scope.theoryTeacher = seggregatedTeacherType.Theory;
        	$scope.practicalTeacher = seggregatedTeacherType.Practical;
        	console.log($scope.theoryTeacher);
        	console.log($scope.practicalTeacher)
		})
	}

	$scope.addFeedbackToTheoryTeacher = function(feedbackId, index) {
		if ($scope.feedbackGivenByTheUser[index] == null) {
			return;
		}

		var foundTeacher = _.find($scope.teacherFeedback, ['feedbackId', feedbackId]);


		if (foundTeacher) {
			if (foundTeacher.score[$scope.pointer] == null) {
				foundTeacher.score.push($scope.feedbackGivenByTheUser[index]);
			}else {
				foundTeacher.score[$scope.pointer] = $scope.feedbackGivenByTheUser[index];
			}

		} else {
			$scope.teacherFeedback.push({
				feedbackId: feedbackId,
				score: [$scope.feedbackGivenByTheUser[index]],
				type: 'Theory'
			})
		}

		$scope.checkOccurence++;

		if ($scope.theoryTeacher.length <= $scope.checkOccurence) {
			$scope.buttonToggler = false;
		}
	}

	$scope.addFeedbackToPracticalTeacher = function(feedbackId, index) {
		if ($scope.feedbackGivenByTheUser[index] == null) {
			return;
		}

		var foundTeacher = _.find($scope.teacherFeedback, ['feedbackId', feedbackId]);

		if (foundTeacher) {
			if (foundTeacher.score[$scope.pointer2] == null) {
				foundTeacher.score.push($scope.feedbackGivenByTheUser[index]);
			} else {
				foundTeacher.score[$scope.pointer2] = $scope.feedbackGivenByTheUser[index];
			}
		} else {
			$scope.teacherFeedback.push({
				feedbackId: feedbackId,
				score: [$scope.feedbackGivenByTheUser[index]],
				type: 'Practical'
			})
		}
		$scope.checkOccurence++;

		if ($scope.practicalTeacher.length <= $scope.checkOccurence) {
			$scope.buttonToggler = false;
		}

	}

	$scope.increasePointer = function() {
		$scope.pointer += 1;
		$scope.buttonToggler = true;
		$scope.checkOccurence = 0;
		for (var x=0;x<$scope.feedbackGivenByTheUser.length; x++ ) {
			$scope.feedbackGivenByTheUser[x] = null;
		}

	}

	$scope.decreasePointer = function() {
		$scope.pointer -=1;
		var foundTeacher = $scope.teacherFeedback[$scope.pointer];
		console.log($scope.teacherFeedback);

		for (var x=0; x<$scope.teacherFeedback.length;x++) {
			$scope.feedbackGivenByTheUser[x] = $scope.teacherFeedback[x].score[$scope.pointer];
		}
	}

	// $scope.decreasePointer2 = function() {
	// 	$scope.pointer2 -= 1;
	// 	var foundTeacher = $scope.teacherFeedback[$scope.pointer2];

	// 	console.log($scope.teacherFeedback);

	// 	for (var x=0; x<$scope.teacherFeedback.length;x++) {
	// 		$scope.feedbackGivenByTheUser[x] =
	// 	}
	// }

	$scope.switchPointer = function() {
		$scope.pointer2 += 1;

	}

	$scope.increasePointer2 = function() {
		$scope.pointer2 += 1;
		$scope.buttonToggler = true;
		$scope.checkOccurence = 0;
		for (var x=0;x<$scope.feedbackGivenByTheUser.length; x++ ) {
			$scope.feedbackGivenByTheUser[x] = null;
		}
	}

	$scope.sendFeedbackEvaluation = function() {

		var object = {
			college_name: $scope.college_name,
			teacherFeedback: $scope.teacherFeedback,
			email: $scope.email

		}

		userService.sendFeedbackForEvaluation(object, function(response) {
			console.log(response);
			if (response == 400) {
				// $location.path("/")
			} else {
				$location.path("/thankYouPage");
			}
		})
	}


	$scope.getInstructorsForFeedback();

});
