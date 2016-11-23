angular.module('SpaceApp.services')


.factory('ParkingService', function ($filter, $http, $rootScope, $location, $q) {
	var fake_parkings = [];
	var parkings = [];
	var isInitiated = false;
	var mylocation = {};
	var isNetConnected = false;


	// lets say its a meter. 500 meters away from your location are consider part of nearby.
	// equivalent to nearme
	var range = 500;

	var count = 0;

	var Parking = function (name, slots, fees) {
		this.id = '';
		this.name = '';
		this.location = '';
		this.state = 'PH';
		this.city = 'PASIG';
		this.zipcode = '';
		this.lat = 0;
		this.long = 0;
		this.distance = 0;
		this.view = 'img/vmap.png';
		this.logo = 'img/ball.png';
		this.slots = slots;
		this.slotcount = 20;
		this.fees = fees;

	}

	function setParkings(parks) {
		console.log("set parking ---> " + JSON.stringify(parks));
		parkings = angular.copy(parks);
	}

	function getParkings() {
		if (!isInitiated) {
			init();
		}
		console.log("get parking ---> " + JSON.stringify(parkings));
		return parkings;

	}


	function getParkinsCount() {
		return count;
	}

	var init = function () {
		isInitiated = true;
		var saved = window.localStorage.getItem('parkings');
		if (saved === null) {
			console.log("no local parking found - lets sync the files[" + saved + "]");
			window.localStorage.setItem('parkings', JSON.stringify(setFakeParkings()));
			console.log("fake parkings has been added to local storage");
			saved = window.localStorage.getItem('parkings');
		}
		parkings = angular.copy(JSON.parse(saved));
		count = parkings.length;
		console.log("found local parkings count:" + count);
		console.log("found local parkings:" + JSON.stringify(parkings));


		return count;
	}

	var get = function (pid) {
		if (!isInitiated) {
			init();
		}

		for (var i = 0; i < count; i++) {
			if (parkings[i].id === parseInt(pid)) {
				return parkings[i];
			}
		}
		return null;
	}
	var getParkingNameByID = function (pid) {

		var p = get(pid);
		if (p !== null) {
			return p.name;
		}
		return null;
	}

	var searchCityState = function (map) {
		//var parkings = getParkings() || [{}];
	//	if (!isInitiated) {
			init();
	//	}
		var results = [];
		console.log("searchCityState" + parkings.length);
		return $q(function (resolve, reject) {
			try {
				for (var i = 0; i < parkings.length; i++) {
					if (angular.uppercase(parkings[i].city) === angular.uppercase(map.city) &&
						angular.uppercase(parkings[i].state) === angular.uppercase(map.state)) {
						results.push(parkings[i]);
					}
				}
				resolve(results);
			} catch (e) {
				reject(e);
			}

		});
	}
	
	var searchZip = function(map){
			//var parkings = getParkings() || [{}];
	//	if (!isInitiated) {
			init();
	//	}
		var results = [];
		console.log("searchZip" + parkings.length);
		return $q(function (resolve, reject) {
			try {
				for (var i = 0; i < parkings.length; i++) {
					if (parkings[i].zipcode === map.zip){
						results.push(parkings[i]);
					}
				}
				resolve(results);
			} catch (e) {
				reject(e);
			}

		});
	}

	var searchNearby = function (location) {
	//	if (!isInitiated) {
			init();
	//	}
		//var parkings = getParkings() || [{}];
		var results = [];
		var distance = 0
		console.log("searchNearby: location --- [ " + JSON.stringify(location) +"]");

		return $q(function (resolve, reject) {
			try {
				for (var i = 0; i < parkings.length; i++) {
					distance = getDistance(parkings[i].lat, parkings[i].long, location.lat, location.long);
					if (distance <= range) {
						results.push(parkings[i]);
						console.log("found nearby:", JSON.stringify(results));
					}
				}
				resolve(results);
			} catch (e) {
				console.log("error: " + e);
				reject(e);
			}

		});
	}



	var getDistance = function (lat1, lon1, lat2, lon2) {
		var pi = Math.atan2(1, 1) * 4; // pi: 3.14159265358979
		var deg2radmul = pi / 180; // degrees to radians multiplier: 0.0174532925199433
		var rad2degmul = 180 / pi; // radians to degrees multiplier: 57.2957795130823
		var deg2milmul = 69.09; // degrees to miles multiplier
		var mil2kilmul = 1.609344; // miles to kilometers multiplier
		var dlon = lon1 - lon2;
		var dist = Math.sin(lat1 * deg2radmul) * Math.sin(lat2 * deg2radmul) +
			Math.cos(lat1 * deg2radmul) * Math.cos(lat2 * deg2radmul) * Math.cos(dlon * deg2radmul);
		dist = Math.atan2(Math.sqrt(1 - ((dist * 2) - 1)), dist);
		dist = dist * rad2degmul; // radians to degrees
		dist = dist * deg2milmul; // degrees to miles
		dist = dist * 1000; // to get the meter from killometer 1kilo = 1000 meter
		return dist;

	}

	var updateParkings = function (park) {
		for (var i = 0; i <= parkings.length; i++) {
			if (parkings[i].id === parseInt(park.id)) {
				parkings[i] = angular.copy(park);
				console.log("parking updated:" + park.id);
				break;
			}
		}


		window.localStorage.setItem('parkings', JSON.stringify(parkings));
		console.log("parkings updated:", JSON.stringify(parkings));
		return getParkings();
	}

	function clearLocation() {
		mylocation = {
			name: '',
			lat: '',
			long: '',
			city: '',
			location: '',
			zipcode: '',
			country: '',
			state: '',
			position: ''
		};
	}

	function setDefaultLoc() {
		mylocation = {
			name: 'IBM Bldg J, Don Mariano Marcos Ave',
			lat: '14.657720',
			long: '121.054912',
			city: 'QC',
			location: 'Quezon City',
			zipcode: '',
			country: 'Philippines',
			position: '',
			state: 'PH'
		};

		return mylocation;
	}

	function setFakeParkings() {
		fake_parkings = [{
				id: 1,
				name: 'Ayala Parking Basement 1',
				location: 'Ayala Triangle',
				state: 'PH',
				city: 'Makati',
				zipcode: '1700',
				lat: 14.5567663,
				long: 121.0223622,
				distance: 0,
				view: 'img/vmap.jpg',
				logo: 'img/ayalalogo.jpg',

				slots: [{
					no: 1,
					status: 0
				}, {
					no: 2,
					status: 1
				}, {
					no: 3,
					status: 0
				}, {
					no: 4,
					status: 0
				}, {
					no: 5,
					status: 1
				}, {
					no: 6,
					status: 0
				}],
				slotcount: 20,
				fees: {
					perday: 110,
					permonth: 3200,
					fixrate: 100,
					discounted: 90
				}

}, {
				id: 2,
				name: 'Glorieta 3 Parking 1',
				location: 'Glorieta 3 Park',
				state: 'PH',
				city: 'Makati',
				zipcode: '2500',
				lat: 14.5532962,
				long: 121.0247088,
				distance: 0,
				view: 'img/vmap.png',
				logo: 'img/ayalalogo.jpg',

				slots: [{
					no: 1,
					status: 0
		}, {
					no: 2,
					status: 1
		}, {
					no: 3,
					status: 0
		}, {
					no: 4,
					status: 0
		}, {
					no: 5,
					status: 1
		}, {
					no: 6,
					status: 0
		}],
				slotcount: 20,
				fees: {
					perday: 110,
					permonth: 3200,
					fixrate: 100,
					discounted: 90
				}
},
			{
				id: 3,
				name: '6750 Office Tower',
				location: 'Ayala Avenue, Ayala Center',
				state: 'PH',
				city: 'Makati',
				zipcode: '2500',
				lat: 14.5543591,
				long: 121.0251455,
				distance: 0,
				view: 'img/vmap.png',
				logo: 'img/ayalalogo.jpg',
				slots: [{
					no: 1,
					status: 0
		}, {
					no: 2,
					status: 1
		}, {
					no: 3,
					status: 0
		}, {
					no: 4,
					status: 0
		}, {
					no: 5,
					status: 1
		}, {
					no: 6,
					status: 0
		}],
				slotcount: 20,
				fees: {
					perday: 110,
					permonth: 3200,
					fixrate: 100,
					discounted: 90
				}

},
			{
				id: 4,
				name: 'UP-AyalaLand TechnoHub',
				location: 'Quezon City',
				state: 'PH',
				city: 'QC',
				zipcode: '1700',
				lat: 14.657877,
				long: 121.0548253,
				distance: 0,
				view: 'img/vmap.png',
				logo: 'img/ayalalogo.jpg',

				slots: [{
					no: 1,
					status: 0
		}, {
					no: 2,
					status: 1
		}, {
					no: 3,
					status: 0
		}, {
					no: 4,
					status: 0
		}, {
					no: 5,
					status: 1
		}, {
					no: 6,
					status: 0
		}],
				slotcount: 20,
				fees: {
					perday: 110,
					permonth: 3200,
					fixrate: 100,
					discounted: 90
				}
},
										 {
				id: 5,
				name: '1800 Eastwood',
				location: 'Quezon City',
				state: 'PH',
				city: 'QC',
				zipcode: '1800',
				lat: 14.6086562,
				long: 121.08016599999999,
				distance: 0,
				view: 'img/vmap.png',
				logo: 'img/ayalalogo.jpg',

				slots: [{
					no: 1,
					status: 0
		}, {
					no: 2,
					status: 1
		}, {
					no: 3,
					status: 0
		}, {
					no: 4,
					status: 0
		}, {
					no: 5,
					status: 1
		}, {
					no: 6,
					status: 0
		}],
				slotcount: 20,
				fees: {
					perday: 110,
					permonth: 3200,
					fixrate: 100,
					discounted: 90
				}
}];
		return fake_parkings;
	}

	var getCurrentLocation = function () {
		var result = {};
		return $q(function (resolve, reject) {
			try {
				setDefaultLoc();
				result.status = 'ok';
				result.error = '';
				result.loc = mylocation;
				resolve(result);
			} catch (e) {
				result.status = 'failed';
				result.error = e;
				reject(result);
			}
		});
		/*
		return $q(function (resolve, reject) {
	
			document.addEventListener("deviceready", function () {
				$cordovaGeolocation.getCurrentPosition({
					timeout: 10000,
					enableHighAccuracy: false
				})
				.then(function (position) {
					console.log("position found:" + JSON.stringify(position));			
					mylocation.lat      = position.coords.latitude;
					mylocation.long     = position.coords.longitude;
					mylocation.position = position;
					result.loc 			 = mylocation;		
					result.status 	 = 'ok';
					
					console.log("location found ---- "+ JSON.stringify(result));
					resolve(result);
				}, function (err) {
					result.errorMsg  = "Error : " + err.message;
					result.status	   = 'failed';
					
					setDefaultLoc();
					console.log("unable to find location ---- "+ JSON.stringify(result));
					reject(result);
				});
			}, false);
		});*/
	}

	var setConnectionStatus = function (status) {
		isNetConnected = status;
	}


	var getConnectionStatus = function () {
		return isNetConnected;
	}

	return {
		setNetStatus: setConnectionStatus,
		getNetStatus: getConnectionStatus,
		getParkings: getParkings,
		setParkings: setParkings,
		get: get,
		getParkingListByzip:searchZip,
		getParkingList: searchCityState,
		getNearByParking: searchNearby,
		updateParking: updateParkings,
		getParkingName: getParkingNameByID,
		setCurrentLocation: function (location) {
			mylocation = location;
		},
		getDefaultLocation: function () {
			return setDefaultLoc();
		},
		clearLocation: function () {
			clearLocation();
		},
		getCurrentLocation: getCurrentLocation,
		all: function () {
			if (!isInitiated) {
				init();
				return parkings;
			}
		},
		remove: function (p) {
			parkings.splice(parkings.indexOf(p), 1);
		},
		clearParkingList:function(){
			parkings = [];
		},
		initialize: init
	}


})