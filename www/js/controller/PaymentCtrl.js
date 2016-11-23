angular.module("SpaceApp.controllers")

.controller("PaymentCtrl", function ($rootScope, $state, $scope, AuthService, AccountService, PaymentFactory, CreditCardSvc, $ionicPopup) {
	var vm = $scope;
	$scope.isAdmin = $scope.$parent.isAdmin;
	$scope.$parent.showHeader();
	$scope.$parent.clearFabs();
	$scope.isExpanded = false;
	$scope.$parent.setExpanded(false);
	$scope.$parent.setHeaderFab(false);
	
	$scope.isQAMode = true;
		
	$scope.payment = '';
	$scope.cardForm = '';
	
		
	$scope.card = '';
	$scope.profile = AuthService.getProfile() || {};

	console.log("paymentctrl -- profile: " + JSON.stringify($scope.profile));

	
	$scope.payment  = PaymentFactory.Payment('card', $scope.profile.id, true);
	$scope.billing = PaymentFactory.getBilling();
	//$scope.address = '';
	//$scope.card = '';
	
	$scope.AddCCInfo = function (payment, $event){
		// do some validation here
			console.log("paymentctrl -- payment " + JSON.stringify(payment));
		//$scope.billing = payment.billing;
			console.log("paymentctrl -- billing " + JSON.stringify(payment.billing));
	
		if(isEmpty(payment)){
			return true;
		}
		
		console.log("paymentctrl -- AddCCInfo " + JSON.stringify(payment));
		AddPaymentOption(payment);
		
	}
	
	function AddPaymentOption(payment){
	//	$scope.$parent.showLoading(500);
		PaymentFactory.setPayment(payment);
		PaymentFactory.key($scope.profile.id);
		PaymentFactory.setBilling(payment.billing);
		PaymentFactory.setCard(payment.card);
		
	
		if(payment.card.primary){
			PaymentFactory.primary($scope.profile.id);
		}
  	console.log("profilectrl - save card :" + JSON.stringify(payment.card));
		
			PaymentFactory.add(payment);
						console.log("profilectrl - payment -- not empty : " + JSON.stringify(payment));
			
			PaymentFactory.save().then(
				function (result) {
					UpdateProfile();
				    
					console.log("paymentctrl -- successful save payment opt.");
					
				}).catch(
				function (result) {
					$ionicPopup.alert({
						title: 'Payment Option Alert!',
						template: 'Unable to save Payment Options.'
					});
					
				//	$state.go('main.profile');
					console.log("ERROR: Unable to SAVE payment opt.");
				});	
			//$state.go('main.profile');
		//$state.go('main.profile');
	}
	
	
	
		function isEmpty(object) {
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	}
	
	function UpdateProfile(payment){
		console.log("paymentctrl -- updating profile payment "+ payment);
		 		
			AccountService.setKey($scope.profile.id);
			AccountService.setPayment(payment);
					
					
		AccountService.save().then(
				function (result) {
					console.log("paymentctrl -- updating profile result :" + JSON.stringify(result));
					$scope.$parent.showLoading(500);
					$ionicPopup.alert({
						title: 'Payment Option!',
						template: 'Successfully saved Payment Options to your account.'
					});
					
					$scope.profile.payment = payment;
                    
                    $rootScope.profile = $scope.profile;
                    
                    console.log("paymentctrl -- updating profile result :" + JSON.stringify( $rootScope.profile));
                    
					$state.go('main.profile');
				}).catch(
				function (result) {
					$ionicPopup.alert({
						title: 'Payment Option Alert!',
						template: 'Unable to save Payment Options.'
					});
					console.log("error update profile - unable to save");
                    	$state.go('main.profile');
				});
		
	}


})