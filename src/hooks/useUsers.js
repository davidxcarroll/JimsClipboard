import { useState, useEffect, useRef } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const usersRef = useRef(null);
  
    useEffect(() => {
    //   console.log('🔥 Setting up Firestore listener');
      const usersRef = collection(db, 'users');
      
      const unsubscribe = onSnapshot(usersRef, (snapshot) => {

        // console.log('🔥 Firestore snapshot received:', {
        //   empty: snapshot.empty,
        //   size: snapshot.size,
        //   metadata: snapshot.metadata
        // });

        const usersData = [];
        snapshot.forEach((doc) => {
        //   console.log('🔥 Processing doc:', doc.id);
          usersData.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // console.log('🔥 Setting users:', usersData);
        setUsers(usersData);
        setLoading(false);
      }, (error) => {
        console.error('🔥 Firestore error:', error);
        setLoading(false);
      });
  
      return () => {
        // console.log('🔥 Cleaning up Firestore listener');
        unsubscribe();
      }
    }, []);
  
    return { users, loading };
};