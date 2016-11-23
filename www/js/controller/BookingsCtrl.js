/* global angular, document, window */
'use strict';

angular.module('SpaceApp.controllers')

.controller('MapBookCtrl', function ($scope, ParkingService, BookingService) {
    console.log("lets map it");
    // default parking lot services
    var vm = this;
    ParkingService.initialize();
    $scope.isNetConnected = $scope.$parent.isNetConnected;
    vm.positions = ParkingService.getParkings() || {};
    var myLocation = ParkingService.getDefaultLocation();
    console.log(JSON.stringify(location));
    vm.addMarker = function (event) {
        var ll = event.latLng;
        vm.positions.push({
            pos: [ll.lat(), ll.lng()]
        });

    }

})

.controller('BookingsCtrl', function ($rootScope, $scope, $state, $compile, BookingService, ParkingService, $timeout) {
    console.log("BookingsCtrl --- in");
    //$scope.$parent.showLoading(1000);
    BookingService.initialize();
    $rootScope.bookings = BookingService.fetch() || [];
   	$scope.$parent.clearFabs();
    $scope.$parent.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	
		$scope.$parent.showLoading(1000);
    //$scope.myLocation = ParkingService.getDefaultLocation();

    $scope.qrcodeString = '';
    $scope.size = 50;
    $scope.correctionLevel = ''; // '' = Auto
    $scope.typeNumber = 0;
    $scope.inputMode = ''; // '' = Auto
    $scope.image = true;


    $scope.isAdmin = $scope.$parent.isAdmin;
    $scope.isApproved = '';

    console.log("is approve ---- " + $scope.isApproved);


    $scope.dataCount = $scope.bookings.length || 0;

    $scope.isListEmpty = function () {
        return ($scope.dataCount > 0) ? false : true;
    }

    $scope.options = [
        {
            id: 1,
            label: 'All',
            status: ''
    },
        {
            id: 2,
            label: 'Open',
            status: 'pending'
    },
        {
            id: 3,
            label: 'Approved',
            status: 'approved'
    }
  ];

    $scope.selectedItem = $scope.options[0].status;
    console.log("is selected  " + JSON.stringify($scope.selectedItem));

    $scope.update = function () {
        console.log("is update  " + JSON.stringify($scope.selectedItem));
        $scope.options = $scope.selectedItem;

    }



    $scope.$watchCollection('bookings', function (newNames, oldNames) {
        $scope.dataCount = newNames.length;
    })



})


.controller('BookingSpotCtrl', function ($scope, $rootScope, $state, $ionicModal, $ionicPopup, $ionicLoading, BookingService, OtherService, $ionicActionSheet) {

    var handleSuccess = '';
    var handleError = '';


    $scope.bookForm = '';
    $scope.park = BookingService.getPark();
    $scope.booking = BookingService.create($scope.park);
    $scope.minDate = new Date();

    var srv = {};

    $scope.myServices = [];
    $scope.booking.services = [];

    $scope.isAdmin = $scope.$parent.isAdmin;
    $scope.types = BookingService.getTypes() || [];

    var isEmpty = function (object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }


    $ionicModal.fromTemplateUrl('templates/modal-bookconfirm.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalConfirm = modal;
    });



    $scope.ShowConfirmModal = function (booking, event) {

        calculate(booking, event);
        $scope.modalConfirm.show();

    }


    $scope.HideConfirmModal = function () {
        $scope.modalConfirm.hide();

    }


    $scope.confirmBooking = function (booking) {
        console.log("BookingsSpotCtrl --> confirm " + JSON.stringify(booking));
        $scope.$parent.showLoading(600);
        $scope.booking = booking;

        console.log("addbooking ---> success");
        addBooking(booking);

        $scope.HideConfirmModal();
        $state.go('main.bookings');


        //$state.go('main.bookings');

    }



    $scope.showDelServicePopup = function (pid) {
        var deletePopup = $ionicPopup.confirm({
            title: 'Cancel Service',
            template: 'Are you sure you want to cancel this service?'
        }).then(function (res) {
            if (res) {
                deleteService(pid);
                console.log('Cancelled: ' + pid);
            } else {
                console.log('Nothing happened');
            }
        });
    }



    $scope.showActionsheet = function () {
            $ionicActionSheet.show({
                titleText: 'Other Services',
                buttons: [
                    {
                        text: '<i class="icon ion-paintbucket"></i> Fluids check and top-up'
							},
                    {
                        text: '<i class="icon ion-wrench"></i> Tire check and repair'
							},
                    {
                        text: '<i class="icon ion-loop"></i> Tire rotation'
							},

                    {
                        text: '<i class="icon ion-waterdrop"></i> Truck wash'
							},
    				],
                buttonClicked: function (index) {
                    var idx = index + 1;
                    var dup = false;
                    for (var i = 0; i < $scope.myServices.length; i++) {
                        if ($scope.myServices[i].bookid === $scope.booking.bookid &&

                            $scope.myServices[i].svcid === idx) {
                            console.log(idx + " --- found dup --> " + JSON.stringify($scope.myServices[i]));
                            dup = true;
                        }

                    }

                    if (!dup) {
                        console.log(idx + " -- not dup --> " + JSON.stringify(srv));
                        srv = OtherService.create($scope.booking.bookid, $scope.user.name, $scope.user.name,
                            0, idx);

                        //	$scope.showAddServicePopup(srv);
                        addService(srv);
                        console.log("clicked --> " + JSON.stringify(srv));
                        //$scope.myServices.push(srv);
                        return true;
                    }
                },
                cancelText: 'Cancel',
                cancel: function () {
                    console.log('CANCELLED');
                }

            });


        } //SHOW ACTION SHEET - SHOW OTHER SERVICES

    function deleteService(pid) {
        for (var i = 0; i < $scope.myServices.length; i++) {
            if ($scope.myServices[i].id == pid) {
                $scope.myServices.splice(i, 1);
            }
        }
    }

    function addService(srv) {
        $scope.myServices.push(srv);
    }


    function calculate(booking, event) {
        var services = [];
        console.log("calculate -- function");
        $scope.booking = booking;
        $scope.$parent.showLoading(600);
        $scope.booking.status = 'pending';
        $scope.booking.totDays = (booking.to.getDate() - booking.from.getDate()) | 1;
        $scope.booking.trn.amount = $scope.booking.park.fee * booking.totDays;
        $scope.booking.trn.update = new Date();
        for (var i = 0; i < $scope.myServices.length; i++) {
            services.push($scope.myServices[i].serviceName);
        }
        $scope.booking.services = angular.copy(services);
        return;
    }

    function addBooking(booking) {
        //$scope.booking = booking;

        BookingService.save(booking).
        then(function (result) {
            $ionicPopup.alert({
                title: 'Booking Alert!',
                template: 'Successfully save booking!'
            });
            $rootScope.bookings = angular.copy(result.bookings);
            $scope.bookForm = '';
            $scope.booking = {};

        }).catch(function (result) {
            $ionicPopup.alert({
                title: 'Booking Alert!',
                template: result.error
            });

            $scope.errorMessage = result.error;
            $scope.bookForm = '';
            event.stopPropagation();
        });

        return;
    }





    //$scope.serve = function () {
    //$state.go('main.service');
    //}


})






.controller('BookingDetailCtrl', function ($scope, $q, $stateParams, $http, $ionicPopup, BookingService) {
    var handleSuccess;
    var handleError;
    var handleRes;
    var errorPrompt;
    var action;
    var ask = {
        title: 'Booking Alert',
        template: 'Are you sure you want to change the status request?'
    };
    var ok = {
        title: 'Booking Alert!',
        template: 'Successfully change booking status!'
    };


    console.log("BookingDetailCtrl --> id: " + $stateParams.bookId);

    $scope.action = '';
    $scope.comment = {};
    $scope.isAdmin = $scope.$parent.isAdmin;
    $scope.statuses = ['pending', 'approved', 'rejected'];
    $scope.booking = BookingService.get($stateParams.bookId) || {};
    $scope.oldbook = $scope.booking;
    $scope.booking.comments = [];
    $scope.qr = $scope.booking.qr || {};

    $scope.qrcodeString = $scope.qr.code || '0';
    $scope.size = 230;
    $scope.correctionLevel = '';
    $scope.typeNumber = 0;
    $scope.inputMode = '';
    $scope.image = true;

    $scope.isRejected = ($scope.booking.status === 'rejected') ? true : false;
    $scope.isApproved = ($scope.booking.status === 'approved') ? true : false;

    $scope.ApproveBooking = function (booking, event) {
        console.log("Approve booking ---> " + JSON.stringify(booking.status));
        if (booking.status === 'approved') {
            console.log("stop propagation booking ---> " + JSON.stringify(booking.status));
            errorPrompt('approve');
            event.stopPropagation();
        } else {
            action = 'approve';
            $scope.booking = booking;
            $scope.booking.status = 'approved';
            $scope.isApproved = true;
            $scope.isRejected = false;
            $ionicPopup.confirm(ask).then(handleRes);
        }
    }

    $scope.RejectBooking = function (booking, event) {
        if ('rejected' === booking.status) {
            errorPrompt('reject');
            event.stopPropagation();
        } else {
            action = 'reject';
            $scope.booking = booking;
            $scope.booking.status = 'rejected';
            $scope.isApproved = false;
            $scope.isRejected = true;
            $ionicPopup.confirm(ask).then(handleRes);
        }
    }

    $scope.CancelBooking = function (booking, event) {
        if ('cancelled' === $scope.booking.status) {
            errorPrompt('cancel', event);
            event.stopPropagation();
        } else {
            action = 'cancel';
            $scope.booking = booking;
            $scope.booking.status = 'cancelled';
            $ionicPopup.confirm(ask).then(handleRes);
        }
    }

    handleRes = function (res) {
        if (res) {
            $scope.$parent.showLoading(500);
            BookingService.update($scope.oldbook, $scope.booking)
                .then(function (result) {
                    $ionicPopup.alert(ok);
                    if (action === 'approve') {
                        $scope.isApproved = true;
                    } else {
                        $scope.isApproved = false;
                    }
                }).catch(function (result) {
                    $ionicPopup.alert({
                        title: 'Booking Alert!',
                        template: result.error
                    });
                });
        }
    }

    function errorPrompt(action) {
        $ionicPopup.alert({
            title: 'Booking Alert!',
            template: 'Request Already ' + action + '!'
        });
    }

    $scope.ShowCommentBox = function (booking) {
        $scope.action = 'show';
        /* showCommentForm(); 
        TODOS
        */
        function addComments(comment) {
            $scope.comment = comment;
        }
    }


})