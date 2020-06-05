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
  authors: Array<Author>
}

export interface Author {
  id: string
  name: string
  search: string
}

export interface FilteredBook {
  id: string
  name: string
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

  const authors: Array<Author> = []
  for (const authorRef of bookData.authors) {
    const authorDoc = await authorRef.get()
    authors.push({
      id: authorDoc.id,
      ...authorDoc.data(),
    })
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

function getEndCode(value: string): string {
  const startCode = value.slice(0, value.length - 1)
  const lastChar = value.slice(value.length - 1, value.length)
  return `${startCode}${String.fromCharCode(lastChar.charCodeAt(0) + 1)}`
}

export async function searchAuthors(needle: string): Promise<Author[]> {
  const normalizeNeedle = needle.toLocaleLowerCase()
  const endCode = getEndCode(normalizeNeedle)
  const authorsDoc = await store
    .collection('authors')
    .where('search', '>=', normalizeNeedle)
    .where('search', '<', endCode)
    .limit(10)
    .get()

  return authorsDoc.docs.map((authorDoc) => ({
    id: authorDoc.id,
    name: authorDoc.data().name,
    search: authorDoc.data().search,
  }))
}

export async function searchBooks(
  needle: string,
  authors: Author[]
): Promise<FilteredBook[]> {
  const normalizeNeedle = needle.toLocaleLowerCase()
  const endCode = getEndCode(normalizeNeedle)
  const booksDoc = await store
    .collection('books')
    .where('search', '>=', normalizeNeedle)
    .where('search', '<', endCode)
    .where(
      'authors',
      'array-contains-any',
      authors.map((author) => store.collection('authors').doc(author.id))
    )
    .limit(10)
    .get()

  return booksDoc.docs.map((bookDoc) => ({
    id: bookDoc.id,
    name: bookDoc.data().name,
  }))
}
