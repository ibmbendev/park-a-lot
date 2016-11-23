
angular.module("SpaceApp.controllers")

.controller( "AboutCtrl", function( $scope ) {
	var vm = $scope;
	$scope.isAdmin = $scope.$parent.isAdmin;
		$scope.$parent.showHeader();
		$scope.$parent.clearFabs();
		$scope.isExpanded = false;
		$scope.$parent.setExpanded(false);
	  $scope.$parent.setHeaderFab(false);

	vm.isQAMode = true;
	
	
	vm.clearStorage = function (){
		
	}
	
	vm.readLogs = function (){
	}
	
	
	function onSuccess(imageData) {
	
	}

	function onFail(message) {
		alert('Failed because: ' + message);
	}	


	
})
