

app.controller('formCtrl', ['$scope', function($scope)  { 
	$scope.submitForm = function() {
		$scope.submitted = false;
		if ($scope.myForm.$valid) {
		    alert('submit');
		} else {
		    $scope.myForm.submitted = true;
		}
	};

}]);


var uppercase = false;
var number = false;
var specialchar = false;
var lowercase = false;
var password = "";
var repeatedpassword = "";

app.directive('checkpassword', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			ctrl.$parsers.unshift(function(viewValue) {
				password = $('input[name=userpassword]').val();
				if(password.length == 0) {
					uppercase = false;
					number = false;
					specialchar = false;
					lowercase = false;
				}
					
				lowercase = /[a-z]/.test(password);
				uppercase = /[A-Z]/.test(password);
				number = /[0-9]/.test(password);
				specialchar = /[!,@,£,$,∞,/,&,),(,+,#,€,%,=,-,_]/.test(password);
				
				if(uppercase == true && number == true && specialchar == true && lowercase == true) {
					ctrl.$setValidity('checkpassword', true);
					uppercase = false;
					number = false;
					specialchar = false;
					lowercase = false;
					return viewValue;
				}
				else {
					ctrl.$setValidity('checkpassword', false);
					return undefined;
				}
			});
		}
	};
});

app.directive('matchpassword', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			ctrl.$parsers.unshift(function(viewValue) {
				repeatedpassword = $('input[name=repeatpassword]').val();
				
				if(password == repeatedpassword) {
					ctrl.$setValidity('matchpassword', true);
					return viewValue;
				}
				else {
					ctrl.$setValidity('matchpassword', false);
					return undefined;
				}
			});
		}
	};
});
