angular.module('SpaceApp.controllers')

.controller('AppCtrl',
  function ($scope, $rootScope, $state, $ionicPopup, $ionicModal, AuthService, AUTH_EVENTS, ParkingService, BookingService, $timeout, 
						 $ionicLoading, $cordovaNetwork, $cordovaGeolocation) {
    console.log("Appctrl --- in");
    $scope.isNetConnected = false;
    $scope.networkType = null;
    $scope.connectionType = null;
    $scope.parkings = [];
		$scope.data = {};
  
		console.log("ctrl -- network initialized... ");
    document.addEventListener("deviceready", function () {
				console.log("ctrl -- device ready... ");
      	$scope.networkType = $cordovaNetwork.getNetwork();
		$scope.isOnline = $cordovaNetwork.isOnline();
        $scope.$apply();
				
				
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            $scope.isOnline = true;
            $scope.networkType = $cordovaNetwork.getNetwork();

            $scope.$apply();
        })

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("got offline");
            $scope.isOnline = false;
            $scope.networkType = $cordovaNetwork.getNetwork();

            $scope.$apply();
        })
				
	
    }, false);

	
		$scope.isNetConnected = true;
		console.log("ctrl -- network "+ $scope.connectionType );
	

		console.log("ctrl -- is connected: "+ $scope.isNetConnected );

   // $scope.user = {};
	
  
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
    
    $scope.user = AuthService.getUser();
	console.log("ctrl -- user: "+ JSON.stringify($scope.user ));
    $scope.isAdmin = (AuthService.role() === "admin_role") ? true : false;
    $scope.username = AuthService.username();

    $scope.getUser = function(){
      return $scope.user;
    }

    $scope.setCurrentUsername = function (name) {
      $scope.username = name;
    };

    $scope.setUserAdmin = function (bool) {
      $scope.isAdmin = bool;
    }

    $scope.logout = function () {
      AuthService.logout();
      $scope.user = {};
      $scope.isAdmin = false;
      $scope.username = '';
			$scope.data.username = '';
			$scope.data.password = '';
      console.log("AppCtrl::logout --> user(" + $scope.username + ") logout");
      console.log("AppCtrl::logout --> reset all");
 					$state.go('login');
    };


    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
      navIcons.addEventListener('click', function () {
        this.classList.toggle('active');
      });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function () {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function () {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function () {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
        if (content[i].classList.contains('has-header')) {
          content[i].classList.toggle('has-header');
        }
      }
    };

    $scope.setExpanded = function (bool) {
      $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function (location) {
      var hasHeaderFabLeft = false;
      var hasHeaderFabRight = false;

      switch (location) {
      case 'left':
        hasHeaderFabLeft = true;
        break;
      case 'right':
        hasHeaderFabRight = true;
        break;
      }

      $scope.hasHeaderFabLeft = hasHeaderFabLeft;
      $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function () {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
        if (!content[i].classList.contains('has-header')) {
          content[i].classList.toggle('has-header');
        }
      }

    };

    $scope.hideHeader = function () {
      $scope.hideNavBar();
      $scope.noHeader();
    };

    $scope.showHeader = function () {
      $scope.showNavBar();
      $scope.hasHeader();
    };

    $scope.clearFabs = function () {
      var fabs = document.getElementsByClassName('button-fab');
      if (fabs.length && fabs.length > 1) {
        fabs[0].remove();
      }
    };

    $scope.showLoading = function (speed) {
      var s = speed || 1000;
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      });
      return $timeout(function () {
        $ionicLoading.hide();
      }, s);
    }

    $scope.hideLoading = function () {
      $ionicLoading.hide();
    }

	

    $scope.clearFabs();
    $scope.isExpanded = false;
    $scope.setExpanded(false);
    $scope.setHeaderFab(false);
	
		$scope.showLoading();
	
	
  })

 