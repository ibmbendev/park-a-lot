/* global angular, document, window */
'use strict';

angular.module('SpaceApp.controllers')


.controller('DashCtrl', function ($scope, $state, $http, $ionicPopup, AuthService, AUTH_EVENTS, BookingService, OtherService) {
 	$scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

    BookingService.initialize();
	
  $scope.isAdmin = $scope.$parent.isAdmin;
  $scope.bookingConfirmedCnt = 0;
	$scope.bookingCancelledCnt = 0;
	$scope.bookingPendingCnt = 0;
	
		$scope.user = AuthService.getUser() || {};
		
	
			$scope.profile = AuthService.getProfile() || {};
		
			
	
  $scope.bookings =  BookingService.fetch() || [];

	for(var i=0; i < $scope.bookings.length;i++){
		if($scope.bookings[i].status === 'approved'){
			$scope.bookingConfirmedCnt++;
		}
		else if($scope.bookings[i].status === 'cancelled'){
			$scope.bookingCancelledCnt++;
		}
		else if($scope.bookings[i].status === 'pending'){
			$scope.bookingPendingCnt++;
		}
		else{
		}
		
		console.log("000000 - inside "+JSON.stringify($scope.bookings[i].status));
	}
 
	
	   $scope.$parent.clearFabs();
    $scope.$parent.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	
		$scope.$parent.showLoading(1000);
  
// start of other services section
  $scope.servicesCount = OtherService.getAllServices().length;
// end of other services section
})


.controller('ManageCtrl', function ($scope, $state, $http, $ionicPopup, AuthService, AUTH_EVENTS, BookingService) {
 BookingService.initialize();
	$scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });


  $scope.isAdmin = $scope.$parent.isAdmin;
  
	$scope.manage = function ( what ) {
		switch(what){
			case 1:
				$state.go('main.bookings');
				break;
				case 2:
					$state.go('main.search');
				break;
				case 3:
					$state.go('main.services');
				break;
				case 4:
					$state.go('main.reports');
				break;
					case 5:
					$state.go('main.verify');
				break;
			default:
				console.log("default---");
				break;
		}
		
	}

})

