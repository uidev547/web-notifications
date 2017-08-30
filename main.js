var serviceWorkerSrc = "./service-worker.js";
var callhome = function(status) {
  console.log(status);
}
var storage = window.localStorage;
var registration;

function postSubscribeObj(statusType, subscription) {
    // Send the information to the server with fetch API.
    // the type of the request, the name of the user subscribing,
    // and the push subscription endpoint + key the server needs
    // to send push messages
    var subscriptionJson = subscription.toJSON();
    console.log('statusType', statusType, subscriptionJson);
    if(statusType === 'subscribe') {
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
      document.querySelector('#sub-obj').textContent = '';
      document.querySelector('#token').textContent = '';
	document.querySelector('#sample-curl').textContent = '';
    }
    // API call to store the endpoint in the database

}
function unsubscribe() {
    navigator.serviceWorker.ready.then(function(existing_reg) {
        // Get the Subscription to unregister
        registration.pushManager.getSubscription()
        .then(function(subscription) {
                // Check we have a subscription to unsubscribe
                if (!subscription) {
                   postSubscribeObj('unsubscribe', subscription);
                    return;
                }
                subscription.unsubscribe()
                .then(function () {
                    console.info('Push notification unsubscribed.');
                    postSubscribeObj('unsubscribe', subscription);
                })
        })
    });
}

function subscribe() {
  if(!isAllowed(registration)) {
    return false;
  }
   registration.pushManager.getSubscription().then(
       function(existing_subscription) {
           window.existing_subscription = existing_subscription;
         // Check if Subscription is available
         console.log('existing_subscription', existing_subscription);
         if (existing_subscription) {
           endpoint = existing_subscription.toJSON()['endpoint']
           if (storage.getItem(endpoint) === 'failed') {
             postSubscribeObj('subscribe', existing_subscription);
           }
           return existing_subscription;
         }
         // If not, register one using the
         // registration object we got when
         // we registered the service worker
         registration.pushManager.subscribe({
           userVisibleOnly: true
         }).then(
           function(new_subscription) {
                postSubscribeObj('subscribe', new_subscription);
           }
         );
       }
     )
 }

 function getExistingToken() {
   if(!isAllowed(registration)) {
    return false;
  }
   registration.pushManager.getSubscription().then(
       function(existing_subscription) {
           window.existing_subscription = existing_subscription;
         // Check if Subscription is available
         console.log('existing_subscription', existing_subscription);
         if (existing_subscription) {
           postSubscribeObj('subscribe', existing_subscription);
           endpoint = existing_subscription.toJSON()['endpoint']
           return existing_subscription;
         }
       }
     )
 }

// Once the service worker is registered set the initial state
 function isAllowed(reg) {
   // Are Notifications supported in the service worker?
   if (!(reg.showNotification)) {
     callhome("showing-notifications-not-supported-in-browser");
     return;
   }

   // Check the current Notification permission.
   // If its denied, it's a permanent block until the
   // user changes the permission
   if (Notification.permission === 'denied') {
     callhome("notifications-disabled-by-user");
     return;
   }

   // Check if push messaging is supported
   if (!('PushManager' in window)) {
     // Show a message and activate the button
     console.log('push-notifications-not-supported-in-browser');
     return;
   }
   return true;
 }

function onPageLoad() {
   // Do everything if the Browser Supports Service Worker
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register(serviceWorkerSrc)
       .then(
         function(reg) {
           registration = reg;
           registration.update();
           getExistingToken();
         }
       );
   }
   // If service worker not supported, show warning to the message box
   else {
     callhome("service-worker-not-supported");
   }
}

onPageLoad();