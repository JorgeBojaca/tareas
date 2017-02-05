// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'chart.js']);

app.run(function ($ionicPlatform, $state) {
	$ionicPlatform.ready(function () {
       /* if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }*/
		var notificationOpenedCallback = function (jsonData) {
			console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
		};
		window.plugins.OneSignal
			.startInit("00a00c97-cf43-454b-845d-2e339406343b")
			.handleNotificationOpened(notificationOpenedCallback)
			.endInit();
	});
});

app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider.state('login', {
		templateUrl: 'pages/login.html',
		url: '/',
		controller: 'loginCtrl'
	});
	$stateProvider.state('registrarUsr', {
		templateUrl: 'pages/registrarUsr.html',
		url: '/registro',
		controller: 'registroCtrl'
	});
	$stateProvider.state('home', {
		templateUrl: 'pages/home.html',
		url: '/home',
		controller: 'homeCtrl'
	});
    $stateProvider.state('grafico', {
		templateUrl: 'pages/grafico.html',
		url: '/grafico',
		controller: 'graficoCtrl'
	});
	$urlRouterProvider.otherwise('/grafico');
});

app.controller('loginCtrl', ["$scope", 'users', '$state', 'currentUser',
							 function ($scope, users, $state, currentUser) {
		$scope.user = "";
		$scope.pass = "";
		$scope.error = false;

		$scope.login = function (usuario, password) {
			var cUser = users.get(usuario, password)
			console.log(cUser);
			if (cUser !== undefined) {
				currentUser.login(cUser);
				$state.go('home');
			} else {
				$scope.error = true;
			}
		};
}]);

app.controller('registroCtrl', ["$scope", 'users', '$state', function ($scope, users, $state) {
	//	console.log("Ingrese a 'registroCtrl'");
	//	vm = this;
	$scope.usr = "";
	$scope.pass1 = "";
	$scope.pass2 = "";
	$scope.registrar = registrar;


	function registrar(usuario, password, password2) {
		if (password !== password2) {
			alert("Las contraseñas no coinciden!");
			$scope.pass1 = "";
			$scope.pass2 = "";
			return;
		} else {
			users.create(usuario, password);
			$state.go('login');
		}


	};
}]);

app.controller('homeCtrl', ["$scope", "$state", 'currentUser', function ($scope, $state, currentUser) {

	$scope.user = currentUser.get();
	$scope.logOut = function () {
		$state.go('login');
	}
}]);

app.controller('graficoCtrl', ["$scope", function ($scope) {
    $scope.labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    $scope.series = ['Mes'];
    $scope.type = 'bar';
       $scope.data = [8000000, 5500000, 3000000, 5130000, 10000000, 7254000];
    $scope.colors = ["#0E0664","#373268","#03001F","#191072","#08014A","#1E0DC7"];
    
    $scope.aumentar = function () {
        $scope.data[2]=6000000;
    }
}]);
    


app.factory('currentUser', function () {
	var currentUser = angular.fromJson(window.localStorage['currentUser'] || '{}');
	var service = {
		get: get,
		login: login,
		logout: logout
	}

	function persist() {
		window.localStorage['user'] = angular.toJson(currentUser);
	}

	function get() {
		return currentUser;
	}

	function login(user) {
		currentUser = user;
		persist();
	}

	function logout() {
		currentUser = {};
		persist();
	}
	return service;
});
app.factory('users', function () {

	var users = angular.fromJson(window.localStorage['users'] || '[]');
	var service = {
		get: get,
		create: create,
		update: update
	}

	function persist() {
		window.localStorage['users'] = angular.toJson(users);
	}

	function deleteAll() {
		window.localStorage['users'] = "";
	}

	function get(user, pass) {
		var i = 0;
		for (i; i < users.length; i++) {
			if (users[i].usuario === user && users[i].password === pass) {
				users[i].state = 1;
				persist();
				return users[i];
			}
		}
		return {};
	}

	function create(user, password) {
		var newUser = {
			usuario: user,
			password: password
		};
		users.push(newUser);
		persist();
	}

	function update(user, password) {

	}

	return service;
});
