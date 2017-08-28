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

    var subscription = subscription.toJSON();
    console.log('statusType', statusType, subscription);
    // API call to store the endpoint in the database

}
function unsubscribe() {
    navigator.serviceWorker.ready.then(function(existing_reg) {
        // Get the Subscription to unregister
        registration.pushManager.getSubscription()
        .then(function(subscription) {
                // Check we have a subscription to unsubscribe
                if (!subscription) {
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
           window.registration = reg;
           initialiseState(reg);
         }
       );
   }
   // If service worker not supported, show warning to the message box
   else {
     callhome("service-worker-not-supported");
   }
}

onPageLoad();
