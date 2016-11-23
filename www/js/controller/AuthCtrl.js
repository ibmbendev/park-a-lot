    angular.module('SpaceApp.controllers')


    .controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicPopup, AuthService, $timeout, $ionicLoading, $ionicModal) {
      var authenticUser;
      var errorHandler;

      $scope.loginForm = '';
				
      $scope.data = $scope.$parent.data;
			
      $scope.modalReg = '';
      $scope.modalResPass = '';
        //$scope.modalChangePass = '';

      $ionicModal.fromTemplateUrl('templates/modal-register.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modalReg = modal;
      })

      $ionicModal.fromTemplateUrl('templates/modal-resetpassword.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modalResPass = modal;
      })

        /*
        // 2015.12.23 - Change Password
      $ionicModal.fromTemplateUrl('templates/modal-changepassword.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modalChangePass = modal;
      })	
        */

      $scope.showModal = function (modal, n) {
        console.log("showModal click --> " +  n);
            $scope.errorMessage = '';
            modal.show();
					

      };

      $scope.hideModal = function (modal, n) {
        console.log("hideModal click --> " + n);
            $scope.errorMessage = '';
        modal.hide();
      };

      console.log("LoginCtrl --> invoked");

      $scope.loginApp = function (data, event) {

        console.log("loginApp --> Login(" + data.username + ")");
            //		$ionicLoading.show({
            //	template: '<ion-spinner icon="spiral"></ion-spinner>'
            //});
        if (data.username === '' || data.password === '') {
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Username/Password Required!',
                    okType: 'button-dark'
          });
          event.stopPropagation();
          return;
        }

        //$ionicLoading.show({
        //  template: '<ion-spinner icon="spiral"></ion-spinner>'
        //});
            $scope.errorMessage = '';

        console.log("AuthService --> Login(" + data.username + ")");
        AuthService.login(data.username, data.password)
                .then(function (result) {
            $ionicLoading.hide();

            console.log("AuthService --> status [" + result.status + "]");
            $scope.$parent.setCurrentUsername(data.username);
          //  $scope.$parent.setUser(data.username, AuthService.role());

					
					
            if (AuthService.role() === "admin_role") {
              $scope.$parent.setUserAdmin(true);
              console.log("route to --> main.dash");
              $state.go('main.dash', {}, {
                reload: true
              });
            } else {
              $scope.$parent.setUserAdmin(false);
              console.log("route to --> main.booking");
              $state.go('main.bookings', {}, {
                reload: true
              });
            }
					
					
					
          })
                .catch(function (result) {				
                    //$ionicLoading.hide();
                    switch (result.error.code) {
                        case 'INVALID_EMAIL':
                            $scope.errorMessage = 'Email or password is incorrect';						
                            break;
                        case 'INVALID_PASSWORD':
                            $scope.errorMessage = 'Email or password is incorrect';						
                            break;
                        case 'INVALID_USER':
                            $scope.errorMessage = 'The specified user account does not exist.';
                            break;
                        case 'INVALID_ORIGIN':
                            $scope.errorMessage  = 'A security error occurred while processing the authentication request.';
                            break;
                        case 'NETWORK_ERROR':
                            $scope.errorMessage  = 'An error occurred while attempting to contact the authentication server.';
                            break;
                        default:
                            $scope.errorMessage = 'Error: [' + result.error.code + ']';					
                    }
                    console.log("AuthService --> Error: " + $scope.errorMessage);
                        $ionicLoading.hide();


                }); 		

            }
			
					  $scope.data.username = '';
            $scope.data.password = '';
            console.log("AuthService --> login");
    })


    // 2015.11.04: Reset Password
    .controller('ResetCtrl', function ($scope, $ionicModal, $ionicLoading, $firebaseAuth) {
      var firebaseUrl = "https://boiling-torch-5555.firebaseio.com";
      var ref = new Firebase(firebaseUrl);
      $scope.authObj = $firebaseAuth(ref);

      $scope.user = {
        email: ''
      };
        $scope.modalResPass = $scope.$parent.modalResPass;

      $scope.errorMessage = '';

      $scope.resetpass = function () {
        console.log("ResetPassword function");
        $scope.errorMessage = '';
        $scope.emailMessage = '';

        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner>'
        });

        $scope.authObj.$resetPassword({
            email: $scope.user.email
          })
          .then(displayConfirmation)
          .catch(handleError);
      };


      function displayConfirmation() {
            $ionicLoading.hide();
        $scope.emailSent = true;
        $scope.emailMessage = 'Email sent. Please check your inbox.';   
      }

      function handleError(error) {
            $scope.errorMessage = '';
        $ionicLoading.hide();
            switch (error.code) {
        case 'INVALID_EMAIL':
          $scope.errorMessage = 'The specified email address is invalid.';
          break;
        case 'INVALID_USER':
          $scope.errorMessage = 'The specified user account does not exist.';
          break;
        case 'INVALID_ORIGIN':
          $scope.errorMessage = 'A security error occurred while processing the authentication request. [' + error.code + ']';
          break;
        case 'NETWORK_ERROR':
          $scope.errorMessage = 'An error occurred while attempting to contact the authentication server. [' + error.code + ']';
          break;
        default:
          $scope.errorMessage = 'Error: [' + error.code + ']';
        }    
      };

    })

    // 2015.11.24: Register Controller
    .controller('RegisterCtrl', function ($rootScope, $scope, $state, $ionicLoading, $firebaseAuth, AuthService, ParkingService) {
      var firebaseUrl = "https://boiling-torch-5555.firebaseio.com";
      var ref = new Firebase(firebaseUrl);
        var users = ref.child("users");
      $scope.authObj = $firebaseAuth(ref);
      var passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
        var emailRegex = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        var isRegistered = false;


      $scope.isNetConnected = ParkingService.getNetStatus();
        $scope.errorMessage = '';

      $scope.user = {
        username: '',
        email: '',
        password: '',
        passwordConfirmed: ''
      };

      $scope.passwordValid = true;
        $scope.emailValid = true;

      var newUser = {};

      $scope.signup = function (user) {

            console.log("signup --> " + JSON.stringify(user));
        if ($scope.isNetConnected) {
          console.log("signup <-- won't be able to register. no-connection.");
        }
        $scope.emailValid = emailRegex.test($scope.user.email);
            if (!$scope.emailValid) {
            $scope.errorMessage = 'Error: The specified email address is invalid.';
                console.log("signup <-- "+$scope.errorMessage);
          return;  
        }

            $scope.passwordValid = passwordStrengthRegex.test($scope.user.password);

            if (user.password !== user.passwordConfirmed) {
          $scope.errorMessage = 'Error: Passwords do not match';
          console.log("signup <-- " + $scope.errorMessage);
          return;
        }

        if (!$scope.passwordValid) {
            $scope.errorMessage = 'Error: Password is invalid';
                console.log("signup <-- " + $scope.errorMessage);
          return;  
        }


        $scope.registerMessage = '';
        $scope.errorMessage = '';
        console.log("signup <-- ok -- saving user: " + JSON.stringify(user));
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner>'

        });

        $scope.authObj.$createUser({
          email: user.email,
          password: user.password
        })
            .then(function(user) {
                $ionicLoading.hide();
                console.log("User " + user.uid + " created successfully!");
                console.log("Credentials: " + $scope.user.email + " " + $scope.user.password);
                $scope.registerSuccess = true;
                $scope.registerMessage = 'Email registration successful.';

                isRegistered = true;

                return $scope.authObj.$authWithPassword({
                    email: $scope.user.email,
                    password: $scope.user.password
                });

            }).then(function(authData) {
                    console.log("Logged in as: ", authData.uid);

                    // Save user in Firebase dashboard
                    ref.child("users").child(authData.uid).set({
                        provider: authData.provider,
                        name: authData.password.email.replace(/@.*/, '')
                    });

            }).catch(function(error) {
                $ionicLoading.hide();
                console.log("signup <-- Exception result from server: " +  $scope.authData + " -- " +JSON.stringify(error));
                switch (error.code) {
                    case 'INVALID_EMAIL':
                        $scope.errorMessage = 'The specified email address is invalid.';
                        break;
                    case 'EMAIL_TAKEN':
                        //if (isRegistered == false) {
                            $scope.errorMessage = 'The specified email address is already registered.';
                        //} 
                        //else {	
                        //	$scope.errorMessage = '';
                        //}
                        break;
                    case 'INVALID_ORIGIN':
                        $scope.errorMessage = 'A security error occurred while processing the authentication request. [' + error.code + ']';
                        break;
                    case 'NETWORK_ERROR':
                        $scope.errorMessage = 'An error occurred while attempting to contact the authentication server. [' + error.code + ']';
                        break;
                    default:
                        $scope.errorMessage = 'Error: [' + error.code + ']';
            }
                throw error;
                $scope.loginForm.$setPristine();
            })
        }
    })

    // 2015.11.24: Change Password controller 
    .controller('ChangePasswordCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, $firebaseAuth) {
        var firebaseUrl = "https://boiling-torch-5555.firebaseio.com";
      var ref = new Firebase($scope.firebaseUrl);
      $scope.authObj = $firebaseAuth(ref);
      var passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

      $scope.user = {
        email: '',
        oldPassword: '',
        newPassword: '',
        newPasswordConfirmed: ''
      };


      $scope.done = function () {
        $scope.passwordValid = passwordStrengthRegex.test($scope.user.newPassword);
            $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner>'
        });
        if ($scope.user.newPassword !== $scope.user.newPasswordConfirmed) {
                $ionicLoading.hide();
          $scope.errorMessage = 'Error: Passwords do not match';
          return;
        }

        if (!$scope.passwordValid) {
                $ionicLoading.hide();
          return;
        }

        $scope.errorMessage = '';



        $scope.authObj.$changePassword({
          email: $scope.user.email,
          oldPassword: $scope.user.oldPassword,
          newPassword: $scope.user.newPassword
        }) 
            .then(displayConfirmation)
        .catch(handleError);
        }



        function displayConfirmation(authData) {
            $ionicLoading.hide();
        console.log("Password changed successfully!");
        $scope.changePassSuccess = true;
            $scope.changePassMessage = 'Password changed successfully!';

        }

      function handleError(error) {
        switch (error.code) {
        case 'INVALID_PASSWORD':
                      $ionicLoading.hide();
          $scope.errorMessage = 'Invalid password';
          break;
        default:
          $scope.errorMessage = 'Error: [' + error.code + ']';
        }

        $ionicLoading.hide();
      }	
    })


    // 2016.01.24
    .controller('UserReportCtrl', function ($scope, $firebaseAuth) {
      //var ref = new Firebase("https://boiling-torch-5555.firebaseio.com/users");

        //ref.orderByValue().on("value", function(snapshot) {
        //	snapshot.forEach(function(data) {
        //		console.log("User ID: " + data.key());
        //	});
        //});

        $scope.users = [
        { id: 1, email: 'test_jac@xyz.com', name: 'Jac', location: 'T.Sora, QC' },
        { id: 2, email: 'test_adriam@gmail.com', name: 'Adrian', location: 'Eastwood City, QC' },
            { id: 3, email: 'test_amy@ph.ibm.com', name: 'Amy', location: 'Eastwood City, QC' }
        //{ id: 4, email: "spidey@marvel.com", name: "Peter Parker", location: "Queens, NYC" },
            //{ id: 5, email: "sandman@vertigo.com", name: "Morpheus", location: "Strange Horizons" },
        ];  

        $scope.sort = function(keyname){
            $scope.sortKey = keyname;   
        $scope.reverse = !$scope.reverse; 
      }
    });

