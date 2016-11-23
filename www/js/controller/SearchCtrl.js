/* global angular, document, window */
'use strict';
angular.module('SpaceApp.controllers')


/* */
.controller('SearchCtrl2', function ($scope, $ionicLoading, $state, $ionicPopup, ParkingService, $cordovaGeolocation) {
	$scope.states = ['PH'];
	$scope.cities = ['MAKATI', 'PASIG', 'MARIKINA', 'QC'];


	$scope.$parent.showLoading(1000);

	$scope.isAdmin = $scope.$parent.isAdmin;
	$scope.$parent.showHeader();
	$scope.$parent.clearFabs();
	$scope.isExpanded = false;
	$scope.$parent.setExpanded(false);
	$scope.$parent.setHeaderFab(false);
	$scope.isNetConnected = $scope.$parent.isNetConnected;
	$scope.parkings = [];
	
	ParkingService.initialize();
	$scope.mapdata = {
		type: 1,
		city: '',
		state: '',
		zip: ''
	};

	$scope.myLocation = ParkingService.getDefaultLocation();
	/*** **/
	var posOptions = {
		timeout: 10000,
		enableHighAccuracy: false
	};
	
	console.log("checking correct location... ");

	$cordovaGeolocation.getCurrentPosition(posOptions)
		.then(function (position) {
			$scope.myLocation.lat = position.coords.latitude;
			$scope.myLocation.long = position.coords.longitude;
			console.log("correct location... " + $scope.myLocation.lat + ":" + $scope.myLocation.long);
			ParkingService.setCurrentLocation($scope.myLocation);

		}, function (err) {
			console.log("ERROR -- get location: " + err);
			$ionicPopup.alert({
				title: 'Geo Alert!',
				template: 'Unable to get correct location.'
			});

			console.log("unable to get correct location, will use default loc.");
		});



	$scope.searchByZip = function (map) {
		
		ParkingService.clearParkingList();
		console.log("search --- map --- :" + JSON.stringify(map));
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral"></ion-spinner>'
		});

		ParkingService.getParkingListByzip(map)
			.then(function (results) {
				console.log("handleResults  --- :" + JSON.stringify(results));
				$ionicLoading.hide();
				if (results.length <= 0) {
					$ionicPopup.alert({
						title: 'Search Parking Alert!',
						template: 'We cant seem to find parking spot on that location.'
					});
				} else {
					console.log("ok here is the result ok:" + JSON.stringify(results));
					ParkingService.setParkings(results);
					//$scope.parkings = angular.copy(results);
					console.log("redirecto to main.parks");
					$state.go('main.parks');
				}

			}).catch(function (results) {
				$ionicLoading.hide();
				console.log("handling error --- unable to find location...");
				$ionicPopup.alert({
					title: 'Search Parking Alert!',
					template: 'Searching encountered an error.'
				});
			});

	}
	
	$scope.search = function (map) {
		
		ParkingService.clearParkingList();
		console.log("search --- map --- :" + JSON.stringify(map));
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral"></ion-spinner>'
		});

		ParkingService.getParkingList(map)
			.then(function (results) {
				console.log("handleResults  --- :" + JSON.stringify(results));
				$ionicLoading.hide();
				if (results.length <= 0) {
					$ionicPopup.alert({
						title: 'Search Parking Alert!',
						template: 'We cant seem to find parking spot on that location.'
					});
				} else {
					console.log("ok here is the result ok:" + JSON.stringify(results));
					ParkingService.setParkings(results);
					//$scope.parkings = angular.copy(results);
					console.log("redirecto to main.parks");
					$state.go('main.parks');
				}

			}).catch(function (results) {
				$ionicLoading.hide();
				console.log("handling error --- unable to find location...");
				$ionicPopup.alert({
					title: 'Search Parking Alert!',
					template: 'Searching encountered an error.'
				});
			});

	}

	$scope.nearby = function (location) {
		console.log("nearby --- searching --- :" + JSON.stringify(location));
		
		ParkingService.clearParkingList();
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral"></ion-spinner>'
		});
		ParkingService.getNearByParking(location)
			.then(function (results) {
				console.log("handleResults  --- :" + JSON.stringify(results));
				$ionicLoading.hide();
				if (results.length <= 0) {
					$ionicPopup.alert({
						title: 'Search Parking Alert!',
						template: 'We cant seem to find parking spot on that location.'
					});

				} else {
					ParkingService.setParkings(results);
					//$scope.parkings = angular.copy(results);
					console.log("redirecto to main.parks");
					
					$state.go('main.parks');
				}
			}).catch(function (results) {
				$ionicLoading.hide();
				console.log("handling error --- unable to find location...");
				$ionicPopup.alert({
					title: 'Search Parking Alert!',
					template: 'Searching encountered an error.'
				});
			});

	}


})



.controller('MapCtrl', function ($scope, $rootScope, $ionicLoading, ParkingService, $ionicPopup, $cordovaGeolocation) {
	var vm = this;
	$scope.isAdmin = $scope.$parent.isAdmin;
	$scope.parkings = 	ParkingService.getParkings() || [];

	$scope.isNetConnected = $scope.$parent.isNetConnected;
  $scope.myLocation = ParkingService.getCurrentLocation();
	console.log(" --- MapCtrl current location: ---- " + JSON.stringify($scope.myLocation));
	console.log(" --- MapCtrl list of parking found ---- " + JSON.stringify($scope.parkings));
	
	/***
	var posOptions = {
		timeout: 10000,
		enableHighAccuracy: false
	};


	$cordovaGeolocation.getCurrentPosition(posOptions)
		.then(function (position) {
			$scope.myLocation.lat = position.coords.latitude;
			$scope.myLocation.long = position.coords.longitude;
			console.log("correct location... " + $scope.myLocation.lat + ":" + $scope.myLocation.long);
		}, function (err) {
			console.log("ERROR -- get location: " + err);
			$ionicPopup.alert({
				title: 'Geo Alert!',
				template: 'Unable to get correct location, well use some default.'
			});
			console.log("unable to get correct location... lets use some default");
			//event.stopPropagation();
		});
	console.log("correct location... " + $scope.myLocation.lat + ":" + $scope.myLocation.long);
	
	var watchOptions = {
timeout : 3000,
enableHighAccuracy: false // may cause errors if true
};
var watch = $cordovaGeolocation.watchPosition(watchOptions);
watch.then(
null,
function(err) {
// error
},
function(position) {
var lat = position.coords.latitude
var long = position.coords.longitude
});
watch.clearWatch();
	*/
	/***/


})


.controller('ParkingsDetCtrl', function ($scope, $state, $ionicPopup, $rootScope, $stateParams, ParkingService, BookingService, $cordovaGeolocation) {
	$scope.isAdmin = $scope.$parent.isAdmin;
	$scope.park = ParkingService.get($stateParams.parkId) || {};
	$scope.park.view = "img/vmap.png";
	$scope.isNetConnected = $scope.$parent.isNetConnected;

	$scope.slots = $scope.park.slots || [];
	var booking = {};
	var count = BookingService.fetch().length || 1;

	$scope.bookaspot = function (park, slotno, status, event) {
		if (status) {
			$ionicPopup.alert({
				title: 'Booking Alert',
				template: 'Slot no:' + slotno + ' is already occupied.'
			});

			console.log("error: slot already occupied -- " + status);
			event.stopPropagation();
		} else {
			booking.park = {
				id: park.id,
				name: park.name,
				no: slotno,
				status: 1,
				fee: park.fees.perday
			};
			BookingService.setPark(booking.park);
			$state.go('main.bookaspot');
		}
	}

})

.controller('GeoCtrl', function (GeoAlert, ParkingService, $cordovaGeolocation) {
	var myLocation = {
		name: 'IBM Bldg J, Don Mariano Marcos Ave',
		lat: '14.657720',
		long: '121.054912',
		city: 'QC',
		location: 'Quezon City',
		zipcode: '',
		country: 'Philippines',
		state: 'PH'
	};

	console.log("my location ---" + JSON.stringify(myLocation));

	$scope.myLocation = ParkingService.clearLocation();
	/*** **/
	var posOptions = {
		timeout: 10000,
		enableHighAccuracy: false
	};
	
	console.log("checking correct location... " );

	
	$cordovaGeolocation.getCurrentPosition(posOptions)
		.then(function (position) {
		
			$scope.myLocation.lat = position.coords.latitude;
			$scope.myLocation.long = position.coords.longitude;
			console.log("correct location... " + $scope.myLocation.lat + ":" + $scope.myLocation.long);
		}, function (err) {
			console.log("ERROR -- get location: " + err);
			$ionicPopup.alert({
				title: 'Geo Alert!',
				template: 'Unable to get correct location, well use some default.'
			});
			console.log("unable to get correct location... lets use some default");
		});

	/*
	var watchOptions = {
timeout : 3000,
enableHighAccuracy: false // may cause errors if true
};
var watch = $cordovaGeolocation.watchPosition(watchOptions);
watch.then(
null,
function(err) {
// error
},
function(position) {
var lat = position.coords.latitude
var long = position.coords.longitude
});
watch.clearWatch();
	*/
	/***/


})


.controller('MarkerMapCtrl', function ($scope, ParkingService) {
	var vm = this;
	vm.positions = ParkingService.getParkings() || [];
	console.log(JSON.stringify(vm.positions));
	vm.addMarker = function (event) {
		var ll = event.latLng;
		vm.positions.push({
			pos: [ll.lat(), ll.lng()]
		});

	}

})