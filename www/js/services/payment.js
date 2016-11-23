angular.module('SpaceApp.services')


.factory('PaymentFactory', function ($q, $http, PaypalSvc, CreditCardSvc) {
	var key = "";
	var payments = [{}];
	var isInitiated = false;
	var paymentOption = {};
	
	var Address = function Address(add, city, state, zip, country) {
		this.address = add;
		this.city = city;
		this.state = 'PH';
		this.zip = zip;
		this.country = 'PHILIPPINES';
	}
	var Payment = function Payment(type, profileId, isDef) {
		this.id = payments.length + 1;
		this.type = type;
		this.profileId = profileId;
		this.isDefault = false;
		this.card =  CreditCardSvc.CreditCard();
		this.billing = new Address();
		return this;
	}


	var setBillingAdd = function (address) {
		this.billing = address;
	}



	var getBillingAdd = function () {
		return this.billing;
	}

	var setCard = function (card) {
		this.card = card;
	}

	var getCard = function () {
		return this.card;
	}

	var addPayment = function (payment) {
		payments.push(payment);
	}

	var sync = function () {
		var result = {
			status: 'ok',
			error: ''
		};
		key = "PO-"+this.profileId;
		
		var paymentsNew = [];
		return $q(function (resolve, reject) {
			try {
				console.log("in sync...");

				window.localStorage.setItem(key, JSON.stringify(payments));
				paymentsNew = angular.copy(JSON.parse(window.localStorage.getItem(key)));
				if (payments.length < paymentsNew.length) {
					
					console.log("payments sync:", JSON.stringify(payments));
				} 
				payments = angular.copy(paymentsNew);
				resolve(result);
			} catch (e) {
				result.status = 'failed';
				result.error = e.message;
				console.log("ERROR: Catch --- e:" + e);
				reject(result);
			}
		});

	}



	var getAll = function () {
		if (!isInitiated) {
			initialize();
		}

		return payments;
	}

	var setKey = function (k) {
		key = '';
		key =  "PO-"+ k;
	}

	var initialize = function (k) {
	setKey(k);
		console.log("init [" + key + "]");
		var saved = window.localStorage.getItem(key)
		if (saved === null) {
			console.log("no local payment method found[" + saved + "]");
			payments = [];
		} else {
			payments = angular.copy(JSON.parse(saved));
			console.log("found local payment method:" + payments.length);
		}
		isInitiated = true;
	}

	var getPayment = function (profileID) {
		console.log("getpayment profileid:" + profileID);
		
		initialize(profileID);
		
		
		for (var i = 0; i < payments.length; i++) {
			if (payments[i].profileId === profileID) {
				console.log("getpayment method:" + JSON.stringify( payments[i]));
				setPayment(payments[i]);
				return payments[i];
				
			}
		}
		
		return null;
	}

	var getPrimary = function () {
		
		if (payments[0] === null) {
			return getPayment();
		}
		return payments[0];
	}

	var setPayment = function(payment){
		payment = payment;
	}
	
	var setPrimary = function (profileId) {
		var p = getPayment(profileId);
		if (p) {
			p.isDef = true;
			payments[0] = p;

		}
	}

	return {
		Payment: Payment,
		setPayment: setPayment,
		getPayment: getPayment,
		fetch: getAll,
		add: addPayment,
		primary: setPrimary,
		getPrimary: getPrimary,
		init: initialize,
		getCard: getCard,
		setCard: setCard,
		
		setBilling: setBillingAdd,
		getBilling: getBillingAdd,
		save: sync,
		key: setKey
	}

})

.service('CreditCardSvc', function ($q, $http) {

	var addressess = [];

	var cardType = {
		VISA: 'Visa',
		MASTERCARD: 'Mastercard',
		DISCOVER: 'Discover',
		AMERICANEXPRESS: 'American Express'
	}
	var CreditCard = function (id, ctype, ccno, ccv, exp, name, last, isDefault, address, primary) {
		this.id = id;
		this.ctype = ctype;
		this.ccno = ccno;
		this.ccv = ccv;
		this.exp = exp;
		this.name = name;
		this.last = last;
		this.address = address;
		this.primary = primary;
		this.show = function () {
			console.log("CC----" + this.ctype + ":" + this.ccno);
		}

	}

	return {
		CreditCard: CreditCard,
		setAddress: function (add) {
			billing = add;
		},
		getAddress: function () {
			return billing;
		},
		getInfo: function () {
			return this;
		}
	}

})


.service('PaypalSvc', function ($q, $http) {
	var Paypal = function (ctype, email, password, isAuth) {
		this.ctype = ctype;
		this.email = email;
		this.pass = password;
		this.isAuth = isAuth;
	}

	return {
		Paypal: Paypal,

		getPaypalInfo: function () {
			return this;
		}
	}
})