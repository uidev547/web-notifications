var serviceWorkerSrc = '/service-worker.js';
var registration;

function postSubscribeObj(statusType, subscription) {
    // Send the information to the server with fetch API.
    // the type of the request, the name of the user subscribing,
    // and the push subscription endpoint + key the server needs
    // to send push messages
    
    if(statusType === 'subscribe') {
      var subscriptionJson = subscription.toJSON();
      console.log('statusType', statusType, subscriptionJson);
      var index = subscriptionJson.endpoint.lastIndexOf('/');
      var token = subscriptionJson.endpoint.substring(index+1);
      var sampleCurl = `curl -X POST \
        https://fcm.googleapis.com/fcm/send \
        -H 'authorization: key=AAAAz8ua_Ms:APA91bGqCEHBK6CjpuLPbULwAmstnZXZuFCVzcRnUKMmD4qQ4pg3iWV_Df9RS-Ea_vj_awH9UkP3eS07H-ec16k0eZLiGOWk2cOnbE2oIHJwYOOb_hzq63T9z8CDfxXvPAu4Y_ePJEGN' \
        -H 'cache-control: no-cache' \
        -H 'content-type: application/json' \
        -d '{
        "to":"${token}",
        "data": {
          "title": "Hi title",
          "body": "Hii How are you"
        }
      }'`;
      document.querySelector('#token').textContent = token;
      document.querySelector('#sub-obj').textContent = JSON.stringify(subscriptionJson, null, '    ');
      document.querySelector('#sample-curl').textContent = sampleCurl;
    } else {
      console.log('unsubscribe');
      document.querySelector('#sub-obj').textContent = '';
      document.querySelector('#token').textContent = '';
	    document.querySelector('#sample-curl').textContent = '';
    }
    // API call to store the endpoint in the database

}


function unsubscribe() {
    unsubscribeSw()
    .then((response) => {
      postSubscribeObj('unsubscribe');
    });
}

function subscribe() {
  subscribeSw();
}


function isServiceWorkerSupported() {
  return 'serviceWorker' in navigator && 'Notification' in window;
};

function notificationSettings() {
    return Notification && Notification.permission;
}

function getRegistation() {
    if(registration) {
        return Promise.resolve(registration);
    }
    return navigator.serviceWorker.register(serviceWorkerSrc)
    .then(function(serviceReg) {
      registration = serviceReg;
      return registration;
    });
}


function getExistingSubscription(registration) {
  if(Notification.permission === 'denied') {
    console.log('permission denied');
    return Promise.reject();
  }
  return registration.pushManager.getSubscription()
  .then(function(existing_subscription) {
        return existing_subscription;
    });
}

function getSubscription(registration) {
    if(Notification.permission === 'denied') {
      console.log('permission denied');
      return Promise.reject();
    }
    getExistingSubscription(registration)
    .then((subscription) => {
        // If not, register one using the
        // registration object we got when
        // we registered the service worker

        if(subscription) {
          postSubscribeObj('subscribe', subscribe);
          return subscription;
        }
        return registration.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function(new_subscription) {
            postSubscribeObj('subscribe', new_subscription);
            return new_subscription;
        });
    });
}

function subscribeSw() {
  if(isServiceWorkerSupported()) {
    getRegistation()
    .then((registration) => {
        getSubscription(registration);
    });
  }
}

function unsubscribeSw() {
    return navigator.serviceWorker.ready.then(function(existing_reg) {
        // Get the Subscription to unregister
        getExistingSubscription(existing_reg)
        .then(function(subscription) {
              // Check we have a subscription to unsubscribe
              if (!subscription) {
                  return true;
              }
              return subscription.unsubscribe()
              .then(function() {
                  return true;
              })
        });
    });
}

function onPageLoad() {
  if(isServiceWorkerSupported()) {
    getRegistation()
    .then(function(registration){
      getExistingSubscription(registration)
      .then(function(subscription) {
        if(subscription) {
          postSubscribeObj('subscribe', subscription);
        }
      });
    });
  }
}

onPageLoad();