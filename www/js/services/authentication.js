angular.module('SpaceApp.services')

.factory('AuthService', function ($q, $http, USER_ROLES, $firebaseAuth, AccountService) {
	var LOCAL_TOKEN_KEY = 'SpaceApp';
	var username = '';
	var isAuthenticated = '';
	var role = '';
	var users = [];
	var authToken;
	var profile = {};
	var test = true;
	var user = {
		tokenID: '',
		userID: '',
		username: '',
		name: '',
		isAdmin: '',
		lastname: '',

		email: '',
		role: 'role_user',
		status: '',
		dateReg: '',
		dateLastSeen: '',

		sync: 'false'


	};

	function getToken() {
		return authToken;
	}
	/*
	  var setUserID = function (userid) {
	    this.userID = userid;
	  }*/

	var getUser = function () {
		return user;
	}


	var setUser = function (_user) {
		user = _user;
		/*
		    this.userID = user.userID;
		    this.username = user.username;
		    this.name = user.username;
		    this.passwd = user.password;
		    this.lastname = user.lastname;
		    this.email = user.email;
		    this.status = user.status;
		    this.dateReg = user.dateReg;
		    this.dateLastSeen = user.dateLastSeen;
		    this.role = user.role;
		    this.isAdmin = user.isAdmin;
		    this.sync = user.sync;*/
	}

	var getProfile = function (tokenID) {
		var k = 'PK-' + tokenID;
		console.log("getProfile -- key : " + k);
		AccountService.setKey(k);
		profile = AccountService.get();

		console.log("getProfile -- result " + JSON.stringify(profile));
		if (profile === null) {
			console.log("getProfile -- null.. will create ");
			profile = AccountService.Profile(user.name, user.name, 'null', {}, '000000', {}, user.email);
			profile.id = user.userID;
			AccountService.set(profile);
			AccountService.save();
		}
		return profile;
	}




	function loadUserCredentials() {
		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
		console.log("loadUserCredentials LOCAL_TOKEN_KEY ---- [" + LOCAL_TOKEN_KEY + "]");
		console.log("loadUserCredentials ---- [" + JSON.stringify(token) + "]");
		if (token) {
			console.log("token found ---> use credentials loaded  ---- " + JSON.stringify(token));
			useCredentials(token);
		}

	}

	function storeUserCredentials(token) {

		console.log("set token for local user  -- " + JSON.stringify(token));
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);

		useCredentials(token);
	}

	function assignRole() {
		if (test === true) {
			if (user.name === 'admin') {
				user.role = 'admin_role';
				user.isAdmin = true;
			} else {
				user.role = 'user_role';
				user.isAdmin = false;
			}
		} else {
			// UID for supangbe@ph.ibm.com  
			//(user.tokenID === '1e9bb838-c0e6-4395-80fc-531f6af81a0d') || 
			if ((user.tokenID === '5cca7f93-97f3-4a2d-954b-bafe06254227') || (user.tokenID === 'b5ba6fb7-4eba-4088-90b3-45a7e8f419aa')) {
				user.role = 'admin_role';
				user.isAdmin = true;

			} else {
				user.role = 'user_role';
				user.isAdmin = false;
			}
		}
	}

	function useCredentials(token) {
		var localInfo = '';
		console.log("useCredentials -- token " + JSON.stringify(token));
		//username = token.split('.')[0];
		user.username = token.split('~')[0];
		user.tokenID = token.split('~')[1];
		user.userID = user.tokenID;

		console.log("useCredentials -- User: " + user.username + " tokenID: " + user.tokenID);
		isAuthenticated = true;
		authToken = token;
		user.email = user.username;
		user.name = user.username.split('@')[0];

		assignRole();

		console.log("useCredentials -- role :" + user.role);

		profile = getProfile(user.tokenID);

		user.dateLastSeen = new Date();


		user.name = profile.firstname;
		user.lastname = profile.lastname;

		user.status = 1; //active

		console.log("useCredentialse - profile : " + JSON.stringify(profile));
		console.log("useCredentialse - user : " + JSON.stringify(user));

		// Set the token as header for your requests!
		$http.defaults.headers.common['X-Auth-Token'] = token;
	}

	/*assuming everything has been checked before it calls register. */
	function register(user) {
		console.log("register: " + JSON.stringify(user));
		var token = user.username + "." + user.userID;

		user.dateReg = new Date();
		console.log("register: " + JSON.stringify(token));
		storeUserCredentials(token);
		//	setUserInfo(token, user);

	}


	function destroyUserCredentials() {
		authToken = undefined;
		username = '';
		isAuthenticated = false;
		user = {};
		
		$http.defaults.headers.common['X-Auth-Token'] = undefined;
		window.localStorage.removeItem(LOCAL_TOKEN_KEY);

	}


	var login = function (name, pw) {
		var firebaseUrl = "https://boiling-torch-5555.firebaseio.com";
		var ref = new Firebase(firebaseUrl);
		var authObj = $firebaseAuth(ref);
		var result = {
			error: {
				code: '',
				msg: ''
			},
			status: ''
		};
		var localUser = {};
		var authReq = {
			email: name,
			password: pw
		};
		console.log("Login function firebase: ---- " + firebaseUrl + ":" + name + ":" + pw);




		return $q(function (resolve, reject) {

			if (test) {

				console.log("TEST: test status " + JSON.stringify(result));
			
				if( name.toLowerCase() === 'admin@ibm.com'){
					
					localUser.username = 'admin@ibm.com';
					localUser.name =  'Test Admin';
					localUser.userID = '5cca7f93-97f3-4a2d-954b-admin@ibm.com';
					localUser.email = 'admin@ibm.com';
					localUser.role = 'role_admin';
				}
				else{
					
					localUser.username = 'testuser@ibm.com';
					localUser.name =  'Test User';
					localUser.userID = '5cca7f93-97f3-4a2d-954b-testuser@ibm.com';
					localUser.email = 'testuser@ibm.com';
					localUser.role = 'role_user';
					
				}
				
				setUser(localUser);
				storeUserCredentials(name + '~' + localUser.userID);
				console.log("User " + localUser.name + " is logged in.");
				result.status = 'ok';
				isAuthenticated = true;
				resolve(result);

			} else {
				authObj.$authWithPassword({
						email: authReq.email,
						password: authReq.password
					})
					.then(function (authData) {
						localUser.username = authReq.email;
						localUser.name = '';
						localUser.userID = authData.uid;
						localUser.email = authReq.email;
						localUser.role = 'role_user';
						setUser(localUser);
						storeUserCredentials(name + '~' + authData.uid);
						console.log("User " + authData.uid + " is logged in with " + authData.provider);
						result.status = 'ok';
						console.log("---- result ----: " + JSON.stringify(result));

						resolve(result);
					}).catch(function (error) {


						result.status = 'failed';
						result.error = error;
						console.log("ERROR: " + JSON.stringify(result));
						// temporary
						reject(result);

					});
			}
		});
	}


	function getEmailByUserName(username) {
		for (var i = 0; i < users.length; i++) {
			if (users[i].username === username) {
				console.log("Found: username -------" + username + ":" + users[i].email);
				return users[i].email;
			}
		}
		return null;
	}

	var logout = function () {
		destroyUserCredentials();
	};

	var isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (isAuthenticated && authorizedRoles.indexOf(user.role) !== -1);
	};


	loadUserCredentials();
	return {
		register: register,
		getUser: getUser,
		getProfile: function () {
			return profile;
		},
		//create: User,
		//  setDemoAdmin: setDemoAdmin,
		login: login,
		logout: logout,
		isAuthorized: isAuthorized,
		isAuthenticated: function () {
			return isAuthenticated;
		},
		username: function () {
			return username;
		},
		role: function () {
			return user.role;
		},
		token: function () {
			//	window.localStorage.getItem(LOCAL_TOKEN_KEY);
			return authToken;
		},
		get: function (id) {
			return user;
		}


	};
})


.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
	return {
		responseError: function (response) {
			$rootScope.$broadcast({
				401: AUTH_EVENTS.notAuthenticated,
				403: AUTH_EVENTS.notAuthorized
			}[response.status], response);
			return $q.reject(response);
		}
	};
})