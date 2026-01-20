import { useState, useEffect } from 'react';
import { messaging } from '../lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        // 1. Check if browser supports notifications
        if (!('Notification' in window)) {
          console.log('This browser does not support desktop notification');
          return;
        }

        const currentPermission = Notification.permission;
        setPermission(currentPermission);

        if (currentPermission === 'granted') {
           const msg = await messaging();
           if (msg) {
               console.log('Retrieving FCM Token...');
               // Get Token
               // VAPID Key is public key from Firebase Console -> Cloud Messaging -> Web Config
               // NOTE: You need to generate a VAPID Key pair in Firebase Console if not done yet.
               // For now we will try without VAPID or use a placeholder if needed. 
               // usually getToken(msg, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' });
               // If no vapidKey provided, it relies on default config? 
               // Let's try basic get token.
               
               const token = await getToken(msg, { 
                   vapidKey: "BJ7_P_gWqS21qRk9s_1r_X_Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R" // Replace with actual Key from user later if needed, or leave empty to fail softly
                   // Actually, for this step let's just create the hook logic. 
                   // The user might need to supply the key.
               }).catch(err => {
                   console.log("FCM Token Error (VAPID maybe missing):", err);
                   return null;
               });
               
               if (token) {
                   console.log('FCM Token:', token);
                   setFcmToken(token);
                   // TODO: Send this token to backend/firestore for targeted messaging
               }
               
               // Listen for foreground messages
               onMessage(msg, (payload) => {
                   console.log('Message received. ', payload);
                   // Show toast or in-app notification
                   new Notification(payload.notification?.title || 'New Message', {
                       body: payload.notification?.body,
                       icon: '/pwa-192x192.png'
                   });
               });
           }
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };

    requestPermission();
  }, []);

  const askPermission = async () => {
     if (!('Notification' in window)) return;
     const result = await Notification.requestPermission();
     setPermission(result);
     if (result === 'granted') {
         window.location.reload(); // Reload to trigger the effect properly or just re-run logic
     }
  };

  return { permission, askPermission, fcmToken };
};
