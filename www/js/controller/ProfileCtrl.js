angular.module('SpaceApp.controllers')
	.controller('ProfileCtrl', function ($scope, $rootScope, $state, $http, $timeout, $ionicPopup, $ionicModal, AuthService,
		AccountService, PaymentFactory) {
		$scope.isExpanded = false;
		$scope.isAdmin = $scope.$parent.isAdmin;
		$scope.$parent.showHeader();
		$scope.$parent.clearFabs();
		$scope.$parent.setExpanded(false);
		$scope.$parent.setHeaderFab(false);
	
		$scope.paymentOK = false;
	
		$scope.user = AuthService.getUser() || {};
		$rootScope.profile = '';
		$scope.payment = '';
		
		getUserProfile();
		/*
		// Delay expansion
		$timeout(function () {
			$scope.isExpanded = true;
			$scope.$parent.setExpanded(true);
		}, 300);

	*/
		$ionicModal.fromTemplateUrl('templates/modal-paypal.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modalPaypal = modal;
		})

		$rootScope.ShowPaypalModal = function () {
			$scope.modalPaypal.show();
		}

		$rootScope.HidePaypalModal = function () {
			$scope.modalPaypal.hide();
		}


		$scope.ShowCcForm = function () {
			$state.go('main.payment');
		}

		getUserProfile();

		$scope.errorMessage = 'failed';
		$scope.ppForm = '';
		$scope.paypal = {
			username: '',
			password: ''
		};

		$scope.LoginToPaypal = function (paypal) {

			console.log("ok here Login:" + JSON.stringify(paypal));
			$ionicPopup.alert({
				title: 'Payment Option!',
				template: 'Successfully linked paypal to your account.'
			});
			$rootScope.HidePaypalModal();


		}

		function getUserProfile() {

			$scope.profile = AuthService.getProfile() || {};
		
			
			PaymentFactory.init($scope.profile.id);
				
			console.log("profilectrl - profile -- " + JSON.stringify($scope.profile));
			AccountService.setKey($scope.profile.id);
			$scope.payment = PaymentFactory.getPayment($scope.profile.id) || {};
				console.log("profilectrl - payment  : " + JSON.stringify($scope.payment));
				
				console.log("profilectrl - billing  : " + JSON.stringify($scope.payment.billing));
			
			//	console.log("profilectrl - card  : " + JSON.stringify($scope.profile.payment));
			
			
			if (!isEmpty($scope.payment)) {
				AccountService.setPayment($scope.payment);
				$scope.profile.payment = $scope.payment;
				console.log("profilectrl - payment -- empty : " + JSON.stringify($scope.profile.payment));
			
				$scope.paymentOK = true;
				$scope.profile.address = $scope.payment.billing.address +" " +$scope.payment.billing.city +" "+ $scope.payment.billing.country +","+ $scope.payment.billing.zip;
			}
			

			console.log("profilectrl --> profile.payment: " + JSON.stringify($scope.profile.payment));

		}
	
	
	


    $scope.$watchCollection('profile', function (newNames, oldNames) {
       // $scope.dataCount = newNames.length;
					console.log("profilectrl --> profile updated: " + JSON.stringify($scope.profile));
			
    })
		
		
		function isEmpty(object) {
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	}

	})