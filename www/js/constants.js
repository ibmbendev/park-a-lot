angular.module('SpaceApp')

.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
    admin: 'admin_role',
    users: 'user_role',
    public: 'public_role'
})

.constant('TIMEOUT',{
  IO: '3000', // 5seconds Input Output
  NW: '3000'  // Network Timeout
});