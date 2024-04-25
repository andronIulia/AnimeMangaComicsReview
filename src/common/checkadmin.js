import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore"

import { getDoc, doc } from "firebase/firestore";

import { firestore } from '../common/firebase';


const checkIfUserIsAdmin = async (userId) => {
  try {
    console.log('User ID in checkIfUserIsAdmin:', userId);
    if (!userId) {
        throw new Error('Invalid user ID');
      }
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    console.log('User Document:', userDoc);
    if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User Data:', userData);
        return userData?.isAdmin === true;
      } else {
        console.error("User document not found");
        return false;
      }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false; 
  }
};

export{checkIfUserIsAdmin} ;

