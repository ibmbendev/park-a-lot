/* global angular, document, window */
'use strict';
//angular.module('SpaceApp')


angular.module('SpaceApp.controllers')



.controller('VerifyCtrl', function ($scope, $cordovaBarcodeScanner) {
	$scope.scanBarcode = function () {
		console.log("verifying...");
		
		$cordovaBarcodeScanner.scan().then(function (imageData) {
			alert(imageData.text);
			console.log("format " + imageData.format);
		}, function (error) {
			console.log("error: " + error);
		})
		
		
	};
})

.controller('ServiceCtrl', function ($scope, $state, $q, OtherService, $ionicPopup, $timeout) {
	$scope.service = OtherService.getAllServices();
	$scope.myService = OtherService.getMyServices();
	OtherService.setServiceName('');
/*
	$scope.service = function (num) {
		switch (num) {
		case 1:
			OtherService.setServiceName('Fluids check and pop-up');
			break;
		case 2:
			OtherService.setServiceName('Tire check and repair');
			break;
		case 3:
			OtherService.setServiceName('Tire rotation');
			break;
		case 4:
			OtherService.setServiceName('Truck wash');
			break;
		};

		var confirmPopup = $ionicPopup.confirm({
			title: OtherService.getServiceName(),
			template: 'Are you sure you want to avail this service?'

		});
		confirmPopup.then(function (res) {
			if (res) {
				OtherService.addService({
					id: OtherService.getAllServices().length,
					serviceName: OtherService.getServiceName(),
					requestor: 'Blue'
				});
				OtherService.addMyService({
					id: OtherService.getAllServices().length - 1,
					serviceName: OtherService.getServiceName(),
					requestor: 'Blue'
				});
				console.log('You availed: ' + OtherService.getServiceName());
			} else {
				console.log('You quitted');
			}
		});
	};
	$scope.delServe = function (pid) {
		var deletePopup = $ionicPopup.confirm({
			title: 'Cancel Service',
			template: 'Are you sure you want to cancel this service?'
		});
		deletePopup.then(function (res) {
			if (res) {
				OtherService.deleteService(pid);
				OtherService.delMyService(pid);
				console.log('Cancelled: ' + pid);
			} else {
				console.log('Nothing happened');
			}
		});

	};
	*/
})

.controller('ServiceFulCtrl', function ($scope, $state, $q, OtherService, $ionicPopup, $timeout) {
	$scope.services = OtherService.getAllServices();
	/*
	$scope.deleteService = function (pid) {
		var deletePopup = $ionicPopup.confirm({
			title: 'Done?',
			template: 'Are you done with this service?'
		});
		deletePopup.then(function (res) {
			if (res) {
				OtherService.deleteService(pid);
				OtherService.delMyService(pid);
				console.log('Done: ' + pid);
			} else {
				console.log('Not done');
			}
		});

	};
	*/
})