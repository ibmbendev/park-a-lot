angular.module('SpaceApp.services')

.factory('PushProcessingService', function() {
	function onDeviceReady() {
		console.info('NOTIFY Device is ready. Registering with GCM server');
    //register with google GCM server
    var pushNotification = window.plugins.pushNotification;
		pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {
			"senderID": "954258294602",
			"ecb": "onNotificationGCM"
		});
	}
  function gcmSuccessHandler(result) {
		console.info('NOTIFY  pushNotification.register succeeded.  Result = '+result)
  }
  function gcmErrorHandler(error) {
		console.error('NOTIFY  '+error);
  }
  return {
			initialize : function () {
				console.info('NOTIFY initializing... ');
				document.addEventListener('deviceready', onDeviceReady, false);
			},
			registerID : function (id) { 
				RequestsService.register(id).then(function(response){
					console.info('NOTIFY Registration succeeded');
					alert('NOTIFY Registration succeeded');
				});
			},
			unregister : function () {
				console.info('unregister')
				var push = window.plugins.pushNotification;
				if (push) {
					push.unregister(function () {
					console.info('unregister success')
				});
			}
		}
  }
 
	function onNotificationGCM(e) {
		console.log('EVENT RECEIVED:' + e.event + '');
		switch( e.event ) {
			case 'registered':
				if ( e.regid.length > 0 ) {
					console.log('REGISTERED with GCM Server: ' + e.regid + ''); 
						var device_token = e.regid;
						RequestsService.register(device_token).then(function(response){
							alert('registered!');
						});
				}
				break;
 
			case 'message':
				if (e.foreground) {
					console.log('--INLINE NOTIFICATION--' + '');
					alert(e.payload.message);        
				} else {
					if (e.coldstart) {
						console.log('-- COLDSTART NOTIFICATION--' + '');
					} else {
						console.log('-- BACKGROUND NOTIFICATION--' + '');
					}
				}
 
				console.log('MESSAGE ' + e.payload.message + '');
				console.log('MESSAGE: ' + JSON.stringify(e.payload));
				break;
 
			case 'error':
				console.log('ERROR ' + e.msg + '');
				break;
 
			default:
				console.log('EVENT: Unknown event received');
				break;
		}
	}
})