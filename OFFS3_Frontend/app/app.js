window.faculty = angular.module('faculty', ['ngAnimate', 'ngRoute', 'BotDetectCaptcha'])
.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
        .when('/', {
            controller: 'SignupCtrl',
            templateUrl: './app/templates/Signup.html'
        })
        .when('/verify', {
        	controller: 'SignupCtrl',
        	templateUrl: './app/templates/verify.html'
        })
        .when('/dashboard', {
        	controller: 'dashboardCtrl',
        	templateUrl: './app/templates/dashboard.html'
        })
        .when('/userFeedback', {
            controller: 'feedbackCtrl',
            templateUrl: './app/templates/userFeedback.html'
        })
        .when('/thankYouPage', {
            templateUrl: './app/templates/thankYouPage.html'
        });
        // .when('/Signup', {
        // 	controller: 'SignupCtrl',
        // 	templateUrl: '/app/templates/Signup.html',
        // 	reloadOnSearch: false
        // });

        // $locationProvider.html5Mode(true);
        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        // });
    }
]);


faculty.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

faculty.config(function(captchaSettingsProvider) {
  captchaSettingsProvider.setSettings({
    captchaEndpoint: '/bdc4-simple-api-angularjs-captcha-example/botdetectcaptcha'
  });
});
