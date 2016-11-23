angular.module('SpaceApp.controllers')


.controller('SlotReportCtrl', function ($scope, $state, $http, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
    AuthService.logout();
   
		$state.go('login', {}, {
                reload: true
              });
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  $scope.isAdmin = $scope.$parent.isAdmin;
 
	$scope.pdfName = 'Slot Occupancy Management Report';
	$scope.pdfUrl = 'data/SlotOccupancyReport.pdf';
	$scope.scroll = 0;
	$scope.loading = 'loading';
		
	$scope.onError = function(error) {
		console.log("Error " + error);
	}

	$scope.onLoad = function() {
		$scope.loading = '';
	}

	$scope.onProgress = function(progress) {
		console.log(progress);
	}


})
