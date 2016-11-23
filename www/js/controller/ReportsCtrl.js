angular.module('SpaceApp.controllers')


.controller('ReportsCtrl', function ($scope, $state, $http, $ionicPopup, AuthService, AUTH_EVENTS, BookingService, OtherService) {
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
  BookingService.initialize();
  $scope.bookings = [];

  $scope.bookings = BookingService.fetch() || [];

  $scope.dataCount = $scope.bookings.length;

  // other service section
  $scope.servicesCount = OtherService.getAllServices().length;





})