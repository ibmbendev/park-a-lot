angular.module('SpaceApp.services')

.factory('AccountService', function ($q, $http, PaymentFactory) {
	
	var PROFILE_KEY = '';


	var paymentOptions = [];
	var profile = {};

	var Profile = function Profile(name, firstname, lastname, address, phone, payment, email) {
		this.id = 0;
		this.name = name;
		this.firstname = firstname;
		this.lastname = lastname;
		this.address = address;
		this.phone = phone;
		this.payment = payment;
		this.email = email;
		return this;
	};

	var addOptions = function(id){
		paymentOptions.push(id);
	}
	var getOptions = function(){
		return paymentOptions;
	}
	
	var setPayment = function(payment){
	
		this.payment = payment;
	}
	
	var getPayment = function(key){
		//PaymentFactory.key(key);
		//this.payment = PaymentFactory.getPrimary() || {};
		//console.log("get payment -- " + JSON.stringify(this.payment));
		
		return this.payment;
	}
	
	var setAddress = function(address){
		this.address = address;
	}
	
	var getAddress = function(){
		return this.address;
	}
	var setID = function (uid) {
		this.id = uid;
	}

	var save = function () {
		var result = {
			status: 'ok',
			error: ''
		};

		return $q(function (resolve, reject) {
			try {
				console.log("account -- save -- in sve.");
				
					console.log("ok --- " + JSON.stringify(profile) + PROFILE_KEY);
					window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
						resolve(result);
				
			} catch (e) {
				result.status = 'failed';
				result.error = e.message;
				console.log("ERROR Catch --- e:" + e);
				reject(result);
			}
			
			console.log("account -- save -- end");
		});

	}

	var get = function (key) {
		if (key) {
			PROFILE_KEY = key;
		}

		var saved = window.localStorage.getItem(PROFILE_KEY);
		if (saved === null) {
			console.log("no profile found for key:" + PROFILE_KEY);
			return null;
		}
		profile = angular.copy(JSON.parse(saved));

		console.log("found profile:" + JSON.stringify(profile));
		return profile;
	}
	var set = function (p) {
		profile = p;
	}


	var Inbox = [{
			id: 0,
			sender: 'John F.',
			subject: 'Good Morning',
			message: 'Good Morning, This is a dummy message sent to you by Mr. John. Have a nice day enjoy your weekend!',
			images: [
            "img/avatar.jpg"
        ]
    },

		{
			id: 1,
			sender: 'Ford H',
			subject: 'Good Afternoon!',
			message: 'Good Morning, This is a dummy message sent to you by Mr. Ford. Have a  nice day enjoy your weekend!',
			images: [
            "img/ayalalogo.jpg"
        ]

    },

		{
			id: 2,
			sender: 'Lisa M',
			subject: 'Good Evening!',
			message: 'Good Morning, This is a dummy message sent to you by Ms. Lisa. Have                   a nice day enjoy your weekend!',
			images: [
            "img/avatar.jpg"
        ]

  },

];



	return {
		Profile: Profile,
		setKey: function (key) {
			PROFILE_KEY = key;
			console.log("set key called:" + PROFILE_KEY);
		},
		set: set,
		save: save,
		remove: function (xp) {
			window.localStorage.removeItem(xp);
		},
		get: get,
		getAllMsg: function () {
			return Inbox;
		},
		setPayment: setPayment,
		getPayment: getPayment,
		setAddress: setAddress,
			getAddress: getAddress


	};
})