import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const app = firebase.initializeApp({
  apiKey: FIREBASE.apiKey,
  authDomain: `${FIREBASE.projectId}.firebaseapp.com`,
  //databaseURL: `https://${FIREBASE.projectId}.firebaseio.com`,
  projectId: FIREBASE.projectId,
  //storageBucket: `${FIREBASE.projectId}.appspot.com`,
  //messagingSenderId: FIREBASE.messagingSenderId,
  //appId: FIREBASE.appId,
})

const store = firebase.firestore(app)

interface UserResult {
  [key: string]: any
}

export async function signInByEmail(
  email: string,
  password: string
): Promise<UserResult | null> {
  const response = await app.auth().signInWithEmailAndPassword(email, password)
  if (response.user) {
    const userResponse = await store
      .collection('users')
      .where('id', '==', response.user.uid)
      .get()
    if (!userResponse.empty) {
      return userResponse.docs[0].ref
    }
  }
  return null
}
