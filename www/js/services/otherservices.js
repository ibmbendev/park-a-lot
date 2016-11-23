angular.module('SpaceApp.services')
	.factory('OtherService', function ($filter) {
		var offers = [];
		
		var other = {

			id: 0,
			serviceName: '',
			status: 0,
			bookid: '',
			requestor: 'Adrian Eusebio',
			svcid: 0,
			icon: 'ion-waterdrop',
			fufilledBy: ''

		};

		var servicename = '';
		var myService = [];


		var userServices = [];

		var services = [
			{
				id: 09888,
				svcid: 4,
				serviceName: 'Truck wash',
				status: 0,
				bookid: '',
				requestor: 'Adrian Eusebio',
			
				icon: 'ion-waterdrop',
				fufilledBy: ''

        },
			{
				id: 9299,
				svcid: 3,
				serviceName: 'Tire rotation',
				status: 1,
				bookid: '',
		
				icon: 'ion-paintbucket',
				requestor: 'Gerard Taopo',

				fufilledBy: ''
        }
    ];

		var setUserServices = function (svces) {
			userServices = angular.copy(svces) || [];

		}


		var getUserServices = function () {
			console.log ("getUserServices --->" );
			return userServices;

		}
		
		var addUserService = function(){
			
			var found = false;
			
			for (var i = 0; i < userServices.length; i++) {
					if (userServices[i].id == other.id) {
						found=true;
					}
			};
			
			if(!found){
				userServices.push(other);
			}
			
			
				console.log("addUserService ---" +JSON.stringify(other));
		}
		
		var create = function (bookid, reqName, fullfilledBy, status, svcid) {
			other = {};
			other.id = userServices.length + 1;
			other.bookid = bookid	;
			other.requestor = reqName;
			other.fullfilledBy = fullfilledBy;
			other.status = status;
			other = get(svcid);
			
			console.log("create ---" +JSON.stringify(other));
			return other;
			
		}



		var get = function (svcid) {
			switch (svcid) {
			case 1:
					other.svcid = 1;
				other.serviceName = 'Fluids check and pop-up';
				other.icon = 'ion-paintbucket';
				break;
			case 2:
				other.svcid = 2;
				other.serviceName = 'Tire check and repair';
				other.icon = 'ion-wrench';

				break;
			case 3:
					other.svcid = 3;
				other.serviceName = 'Tire rotation';
				other.icon = 'ion-loop';
				break;
			case 4:
					other.svcid = 4;
				other.serviceName = 'Truck wash',
					other.icon =  'ion-waterdrop';

				break;
			default:
				break;
			}
			
				console.log("get ---" +JSON.stringify(other));
			return other;
	//	setUserServices(userServices);
		}

		return {
			getSvc:function (){
				return other;
			},
			getServiceName: function () {
				return servicename;
			},
			setServiceName: function (value) {
				servicename = value;
			},
			addService: function (request) {
				services.push(request);
			},
			getAllServices: function () {
				return services;
			},
			deleteService: function (sid) {
				for (var i = 0; i < services.length; i++) {
					if (services[i].id == sid) {
						services.splice(i, 1);
					}
				};
			},
			addMyService: function (my) {
				myService.push(my);
			},
			delMyService: function (pid) {
				for (var i = 0; i < myService.length; i++) {
					if (myService[i].id == pid) {
						myService.splice(i, 1);
					}
				};
			},
			getMyServices: function () {
				return myService;
			},
			create: create,
			addUserService: addUserService,
			getUserServices: getUserServices,
			setUserServices: setUserServices
		};
	})