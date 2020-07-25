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

export interface User {
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
  authors: Author[]
  genres: Genre[]
  tags: Tag[]
}

export interface Author extends ID {
  name: string
  search: string
}

export interface Genre extends ID {
  name: string
}

export interface Tag extends ID {
  name: string
}

export type ID = { id: string }

export type FilteredBook = Omit<Book, 'authors' | 'genres' | 'tags'>

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

  const authors = await fetchCollections<Author>(bookData.authors)
  const genres = await fetchCollections<Genre>(bookData.genres)
  const tags = await fetchCollections<Tag>(bookData.tags)

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
      genres,
      tags,
    },
  }
}

export async function searchAuthors(needle: string): Promise<Author[]> {
  return searchInCollection<Author>(needle, 'authors')
}

export function searchGenres(needle: string): Promise<Genre[]> {
  return searchInCollection<Genre>(needle, 'genres', 'name')
}

export function searchTags(needle: string): Promise<Tag[]> {
  return searchInCollection<Genre>(needle, 'tags', 'name')
}

async function fetchCollections<T extends ID>(
  refs: firebase.firestore.DocumentReference[]
): Promise<T[]> {
  const res: T[] = []
  if (!refs) return res
  for (const ref of refs) {
    const doc = await ref.get()
    res.push({
      id: doc.id,
      ...doc.data(),
    } as T)
  }
  return res
}

function getEndCode(value: string): string {
  const startCode = value.slice(0, value.length - 1)
  const lastChar = value.slice(value.length - 1, value.length)
  return `${startCode}${String.fromCharCode(lastChar.charCodeAt(0) + 1)}`
}

async function searchInCollection<T extends ID>(
  needle: string,
  collection: string,
  searchField = 'search'
): Promise<T[]> {
  const normalizeNeedle = needle.toLocaleLowerCase()
  const endCode = getEndCode(normalizeNeedle)
  const querySnapshot = await store
    .collection(collection)
    .where(searchField, '>=', normalizeNeedle)
    .where(searchField, '<', endCode)
    .limit(10)
    .get()

  return querySnapshot.docs.map(
    (doc) =>
      (({
        id: doc.id,
        name: doc.data().name,
        ...(doc.data().search ? { search: doc.data().search } : {}),
      } as unknown) as T)
  )
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
    description: bookDoc.data().description,
  }))
}
