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

interface User {
  [key: string]: any
}

export interface ListItem {
  id: string
  doneDate?: number
  readingTarget: string
  type: ListItemType
  book: Book
}

export interface Book {
  id: string
  description: string
  name: string
  authors: Record<string, Author>
}

export interface Author {
  name: string
  search: string
}

export enum ListItemType {
  Done = 'done',
  InProcess = 'in-process',
  Planned = 'planned',
}

export async function signInByEmail(
  email: string,
  password: string
): Promise<User | null> {
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

export async function getBookFromList(listId: string): Promise<ListItem> {
  const listDoc = await store.collection('lists').doc(listId).get()
  const listData = listDoc.data()
  const bookDoc = await listData?.bookId.get()
  const bookData = bookDoc.data()

  const authors: Record<string, Author> = {}
  for (const authorRef of bookData.authors) {
    const authorDoc = await authorRef.get()
    authors[authorDoc.id] = authorDoc.data()
  }

  return {
    id: listDoc.id,
    doneDate: (listData?.doneDate as firebase.firestore.Timestamp)?.toMillis(),
    readingTarget: listData?.readingTarget,
    type: listData?.type,
    book: {
      id: bookDoc.id,
      name: bookData.name,
      description: bookData.description,
      authors,
    },
  }
}
