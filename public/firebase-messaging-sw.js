// Scripts for firebase messaging authentication
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyD_8X5llOpk-oi6HvaW8S77N4a9jOLnsMg",
  authDomain: "conime-firev3.firebaseapp.com",
  projectId: "conime-firev3",
  storageBucket: "conime-firev3.firebasestorage.app",
  messagingSenderId: "285137932762",
  appId: "1:285137932762:web:38173d178c57747a58f0e3",
  measurementId: "G-2FWP0ENSZD"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background Message Handler
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png' // Use our PWA icon
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
