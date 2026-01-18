import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

export const useAuth = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const unsubscribeSnapshotRef = React.useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
       // Clean up previous user listener if any
       if (unsubscribeSnapshotRef.current) {
         unsubscribeSnapshotRef.current();
         unsubscribeSnapshotRef.current = null;
       }

      if (firebaseUser) {
        // Create ref to user doc
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen to Firestore updates for this user
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
           if (docSnap.exists()) {
             const userData = docSnap.data();
             setUser({
               id: firebaseUser.uid,
               email: firebaseUser.email,
               displayName: userData.displayName || firebaseUser.displayName,
               photoURL: userData.avatar || firebaseUser.photoURL,
               ...userData,
               // Normalize for app types
               username: userData.username || firebaseUser.displayName?.replace(/\s+/g, '').toLowerCase() || 'user',
               avatar: userData.avatar || firebaseUser.photoURL || '/icons/avatar-robot.svg',
               role: userData.role || 'user',
               bookmarks: userData.bookmarks || [],
               history: userData.history || []
             });
           } else {
             // If doc doesn't exist yet, just use auth data and maybe create it
             const basicUser = {
               id: firebaseUser.uid,
               email: firebaseUser.email,
               displayName: firebaseUser.displayName,
               username: firebaseUser.displayName?.replace(/\s+/g, '').toLowerCase() || 'user',
               // Prefer Auth Photo (Google), else Robot
               avatar: firebaseUser.photoURL || '/icons/avatar-robot.svg',
               role: 'user',
               bookmarks: [],
               history: []
             };
             setUser(basicUser);
             
             // Create default profile if missing
             setDoc(userRef, {
               username: basicUser.username,
               displayName: basicUser.displayName,
               email: basicUser.email,
               avatar: basicUser.avatar,
               role: 'user',
               bookmarks: [],
               history: [],
               createdAt: new Date().toISOString()
             }, { merge: true });
           }
           setLoading(false);
        });
        
        // Store unsubscribe function
        unsubscribeSnapshotRef.current = unsubscribeSnapshot;

      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeSnapshotRef.current) unsubscribeSnapshotRef.current();
      unsubscribeAuth();
    };
  }, []);

  return { user, loading };
};
