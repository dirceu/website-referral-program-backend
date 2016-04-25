const refferalProgram = require('../referral-program');
const bonus = refferalProgram.bonus;
const referral = refferalProgram.referral;

bonus.insert({
  id: 'jwt-t-shirt',
  description: 'JWT T-Shirt',
  type: 'code',
  enabledByActions: ['Paid'],
  activationUrl: 'http://localhost:8080/api/referral/bonus-fake-activation/code'
});
bonus.insert({
  id: 'auth0-t-shirt',
  description: 'Auth0 T-Shirt',
  type: 'code',
  enabledByActions: ['Paid'],
  activationUrl: 'http://localhost:8080/api/referral/bonus-fake-activation/code'
});
bonus.insert({
  id: '500-extra-active-users',
  description: '500 Extra Active Users',
  type: 'activation',
  enabledByActions: ['Paid'],
  activationUrl: 'http://localhost:8080/api/referral/bonus-fake-activation/activation'
});

// Add test referrals
referral.insert({
  id: 'auth0|alejo@alejo.com',
  referrerUserId: 'auth0|ramasilveyra1@gmail.com'
});
referral.insert({
  id: 'auth0|barbu@barbu.com',
  referrerUserId: 'auth0|ramasilveyra1@gmail.com'
});
referral.insert({
  id: 'auth0|gonto@gonto.com',
  referrerUserId: 'auth0|ramasilveyra1@gmail.com',
  action: {
    description: 'Paid'
  }
});
