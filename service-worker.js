let counter = 0;
self.addEventListener('push', function(event) {
  let notificationTitle = 'Hello';
  const notificationOptions = {
    body: 'version1 ' + counter++,
    icon: './favicon.png',
    badge: './',
    tag: 'Hi',
    data: {
      url: location.origin,
    },
  };

  if (event.data) {
    const dataText = event.data.text();
    notificationTitle = 'Received Payload';
    notificationOptions.body = `Push data: '${dataText}'`;
  }
  self.registration.showNotification(notificationTitle+ 'version1.2', notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  let clickResponsePromise = Promise.resolve();
  if (event.notification.data && event.notification.data.url) {
    clickResponsePromise = clients.openWindow(event.notification.data.url);
  }
  console.log('notificationclick', event);
});

self.addEventListener('notificationclose', function(event) {
  console.log('notificationclose', event);
});
