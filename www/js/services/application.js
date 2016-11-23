angular.module('SpaceApp.services')


.factory('AppService', function ($q, $http, PaypalSvc, CreditCardSvc) {
  var key = 'AppsKey';
  var applications = [{}];

  var Application = function Application(id, type, apps) {
    this.id = id;
    this.type = type;
    this.applications = apps;
  }
  
  
  var addApp = function(app){
    applications.push(app);  
  }
  
  var sync = function(){
    window.localStorage.setItem(key, JSON.stringify(applications));
		console.log("applications sync:", JSON.stringify(applications));
  }
  
  
  var getAll = function(){
    if (!isInitiated) {
			initialize();
		}

    return applications;
  }
  
  var setKey = function(k){
    key = k+"-"+key;
  }
  
  var initialize = function(k){
    setKey(k);
    initiated = true;
		var saved = window.localStorage.getItem(key)
    if (saved === null) {
			console.log("no local applications method found[" + saved + "]");
		} else {
			applications = angular.copy(JSON.parse(saved));
			console.log("found local applications method:" + applications.length);
		}
  }
  
  var getApplication = function (appid) {
    for(var i=0; i<=applications.length; i++){
      if (applications[i].id === appid){
        return applications[i];
      }
    }
    return null;
  }
  
  return {
    Payment: Payment,
    get: getApplication,
    fetch: getAll,
    add: addApp,
    init: initialize,
    save: sync,
    key: setKey
  }

})