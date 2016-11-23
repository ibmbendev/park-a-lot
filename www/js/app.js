// 2015.12.18: Firebase URL
var firebaseUrl = "https://boiling-torch-5555.firebaseio.com";

angular.module('SpaceApp', ['ionic', 'ionic.service.core', 'ngCordova', 'ionic-material', 'ionMdInput', 'ngMaterial', 'ngMap', 'ngResource', 'ngMockE2E', 'ja.qr', 'firebase', 'pdf', 'SpaceApp.controllers', 'SpaceApp.services'])


.run(function ($ionicPlatform, GeoAlert, $rootScope) {
	$ionicPlatform.ready(function () {

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}

		// To Resolve Bug
		$rootScope.firebaseUrl = firebaseUrl;

		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		$ionicPlatform.registerBackButtonAction(function (e) {
			if ($ionicHistory.backView()) {
				$ionicHistory.goBack();
			} else {
				var confirmPopup = $ionicPopup.confirm({
					title: 'Confirm Exit',
					template: "Are you sure you want to exit?"
				});
				confirmPopup.then(function (close) {
					if (close) {
						// there is no back view, so close the app instead
						ionic.Platform.exitApp();
					} // otherwise do nothing
					console.log("User canceled exit.");
				});
			}

			e.preventDefault();
			return false;
		}, 101);

	});


})


.config(function ($stateProvider, $resourceProvider, $urlRouterProvider, USER_ROLES, $ionicConfigProvider, $httpProvider) {

	//$resourceProvider.defaults.stripTrailingSlashes = false;
	$ionicConfigProvider.views.maxCache(0);
	$ionicConfigProvider.backButton.previousTitleText(false);


	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl'
		})

	.state('main', {
		url: '/',
		abstract: true,
		templateUrl: 'templates/main.html',
		controller: 'AppCtrl'
	})

	.state('main.bookings', {
			url: 'main/bookings',
			views: {
				'menuContent': {
					templateUrl: 'templates/bookings.html',
					controller: 'BookingsCtrl'
				}
			}

		})
		.state('main.booking', {
			url: 'main/bookings/:bookId',
			views: {
				'menuContent': {
					templateUrl: 'templates/user-view-booking.html',
					controller: 'BookingDetailCtrl'
				}
			}

		})
		.state('main.bookaspot', {
			url: '/main/bookings/spot',
			views: {
				'menuContent': {
					templateUrl: 'templates/bookaspot.html',
					controller: 'BookingSpotCtrl'
				}
			}

		})

	.state('main.search', {
		url: 'main/search',
		views: {
			'menuContent': {
				templateUrl: 'templates/search.html',
				controller: 'SearchCtrl2'
			}
		}
	})

	.state('main.service', {
		url: 'main/service',
		views: {
			'menuContent': {
				templateUrl: 'templates/service.html',
				controller: 'ServiceCtrl'
			}
		}
	})

	.state('main.services', {
			url: 'main/services',
			views: {
				'menuContent': {
					templateUrl: 'templates/services.html',
					controller: 'ServiceFulCtrl'
				}
			}
		})
		.state('main.parks', {
			url: 'main/parks',
			views: {
				'menuContent': {
					templateUrl: 'templates/parks.html',
					controller: 'MapCtrl'
				}
			}
		})
		.state('main.park', {
			url: 'main/parks/:parkId',
			views: {
				'menuContent': {
					templateUrl: 'templates/park.html',
					controller: 'ParkingsDetCtrl'
				}
			}
		})
		.state('main.dash', {
			url: 'main/dashboard',
			views: {
				'menuContent': {
					templateUrl: 'templates/dashboard.html',
					controller: 'DashCtrl'
				}
			},
			data: {
				authorizedRoles: [USER_ROLES.admin]
			}
		})
		.state('main.reports', {
			url: 'main/reports',
			views: {
				'menuContent': {
					templateUrl: 'templates/reports.html',
					controller: 'ReportsCtrl'
				}
			},
			data: {
				authorizedRoles: [USER_ROLES.admin]
			}
		})
		.state('main.verify', {
			url: 'main/verify',
			views: {
				'menuContent': {
					templateUrl: 'templates/report-verify.html',
					controller: 'VerifyCtrl'
				}
			}
		})
		.state('main.profile', {
			url: 'main/profile',
			views: {
				'menuContent': {
					templateUrl: 'templates/profile.html',
					controller: 'ProfileCtrl'
				}

			}
		})
		.state('main.payment', {
			url: 'main/payment',
			views: {
				'menuContent': {
					templateUrl: 'templates/payment.html',
					controller: 'PaymentCtrl'
				}
			}
		})
		.state('main.inbox', {
			url: 'main/inbox',
			views: {
				'menuContent': {
					templateUrl: 'templates/inbox.html',
					controller: 'ProfileCtrl'
				}

			}
		})

	// 2015.12.01
	.state('main.slot-report', {
		url: 'main/slot-report',
		views: {
			'menuContent': {
				templateUrl: 'templates/slot-report.html',
				controller: 'SlotReportCtrl'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.admin]
		}
	})

	// 2016.01.24
	.state('main.users-report', {
		url: 'main/users-report',
		views: {
			'menuContent': {
				templateUrl: 'templates/users-report.html',
				controller: 'UserReportCtrl'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.admin]
		}
	})

	.state('main.underconstruction', {
			url: 'main/underconstruction',
			views: {
				'menuContent': {
					templateUrl: 'templates/under-construction.html',
					controller: 'AppCtrl'
				}
			}
		})
		.state('main.management', {
			url: 'main/management',
			views: {
				'menuContent': {
					templateUrl: 'templates/management.html',
					controller: 'ManageCtrl'
				}
			},
			data: {
				authorizedRoles: [USER_ROLES.admin]
			}
		})
		.state('main.about', {
			url: 'main/about',
			views: {
				'menuContent': {
					templateUrl: 'templates/about.html'
				}

			}
		});

	$urlRouterProvider.otherwise(function ($injector, $location) {
		var $state = $injector.get("$state");
		$state.go("main.bookings");

	});


	// $urlRouterProvider.otherwise('/');
	$httpProvider.interceptors.push('AuthInterceptor');
})


.run(function ($httpBackend) {
	$httpBackend.whenGET('http://localhost:8100/valid')
		.respond({
			message: 'This is my valid response!'
		});
	$httpBackend.whenGET('http://localhost:8100/notauthenticated')
		.respond(401, {
			message: "Not Authenticated"
		});
	$httpBackend.whenGET('http://localhost:8100/notauthorized')
		.respond(403, {
			message: "Not Authorized"
		});

	$httpBackend.whenGET(/templates\/\w+.*/).passThrough();

	console.log('backend');

})



.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
	$rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {

		if ('data' in next && 'authorizedRoles' in next.data) {
			var authorizedRoles = next.data.authorizedRoles;
			if (!AuthService.isAuthorized(authorizedRoles)) {
				event.preventDefault();
				$state.go($state.current, {}, {
					reload: true
				});
				$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
			}


		}

		if (!AuthService.isAuthenticated()) {
			if (next.name !== 'login') {
				event.preventDefault();
				$state.go('login');
			}
		}


	});

})

.run(function (PushProcessingService) {
	console.log('Push processing initialize');
	PushProcessingService.initialize();
})

// Cordova Push Notification Testing
/*
.run(function($rootScope, $cordovaPush) {

  var androidConfig = {
    "senderID": "619467984284",
  };

  document.addEventListener("deviceready", function(){
    $cordovaPush.register(androidConfig).then(function(result) {
      console.info('Success');
    }, function(err) {
      console.info('Error');
    })

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            alert('registration ID = ' + notification.regid);
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });


    // WARNING: dangerous to unregister (results in loss of tokenID)
    //$cordovaPush.unregister(options).then(function(result) {
      // Success!
    //}, function(err) {
      // Error
    //})

  }, false);
})
*/

.filter('numberFixedLen', function () {
	return function (n, len) {
		var num = parseInt(n, 10);
		len = parseInt(len, 10);
		if (isNaN(num) || isNaN(len)) {
			return n;
		}
		num = '' + num;
		while (num.length < len) {
			num = '0' + num;
		}
		return num;
	};
})


.filter('isEmpty', function () {
	return function (object) {
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				return false;
			}
		}

		return true;
	}
})


angular.module('SpaceApp.controllers', []);

angular.module('SpaceApp.services', []);