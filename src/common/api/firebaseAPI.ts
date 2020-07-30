import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const app = firebase.initializeApp({
  apiKey: FIREBASE.apiKey,
  authDomain: `${FIREBASE.projectId}.firebaseapp.com`,
  //databaseURL: `https://${FIREBASE.projectId}.firebaseio.com`,
  projectId: FIREBASE.projectId,
  storageBucket: `${FIREBASE.projectId}.appspot.com`,
  //messagingSenderId: FIREBASE.messagingSenderId,
  //appId: FIREBASE.appId,
})

const store = firebase.firestore(app)
const storage = firebase.storage(app)

export interface User {
  id: string
  email?: string
}

export interface ListItem {
  id: string
  doneDate?: number
  readingTarget: string
  type: ListItemType
  book: Book
  userId: string
}

export interface Book {
  id: string
  description: string
  name: string
  year: string
  edition: string
  cover: string
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
): Promise<User | undefined> {
  const response = await app.auth().signInWithEmailAndPassword(email, password)
  if (response.user) {
    const userResponse = await store
      .collection('users')
      .where('id', '==', response.user.uid)
      .get()
    if (!userResponse.empty) {
      const userDoc = userResponse.docs[0]
      return {
        id: userDoc.id,
        email: userDoc.data().email,
      }
    }
  }
  return void 0
}

export async function getBookFromList(listId: string): Promise<ListItem> {
  const listDoc = await store.collection('lists').doc(listId).get()
  const listData = listDoc.data()

  const bookDoc = await listData?.bookId.get()
  const bookData = bookDoc.data()

  const authors = await fetchCollections<Author>(bookData.authors)
  const genres = await fetchCollections<Genre>(bookData.genres)
  const tags = await fetchCollections<Tag>(bookData.tags)

  const userDoc = await listData?.userId.get()

  let coverUrl = ''
  if (bookData.cover) {
    coverUrl = await storage.ref().child(bookData.cover).getDownloadURL()
  }

  return {
    userId: userDoc.id,
    id: listDoc.id,
    doneDate: (listData?.doneDate as firebase.firestore.Timestamp)?.toMillis(),
    readingTarget: listData?.readingTarget,
    type: listData?.type,
    book: {
      id: bookDoc.id,
      name: bookData.name,
      description: bookData.description,
      year: bookData.year,
      edition: bookData.edition,
      authors,
      genres,
      tags,
      cover: coverUrl,
    },
  }
}

export async function searchAuthors(needle: string): Promise<Author[]> {
  return searchInCollection<Author>(needle, 'authors')
}

export async function searchGenres(needle: string): Promise<Genre[]> {
  return searchInCollection<Genre>(needle, 'genres', 'name')
}

export async function searchTags(needle: string): Promise<Tag[]> {
  return searchInCollection<Genre>(needle, 'tags', 'name')
}

export async function setBookList(
  listItem: ListItem,
  cover: File | null
): Promise<void> {
  if (cover) {
    const coverRef = storage.ref().child(cover.name)
    await coverRef.put(cover)
  }

  const batch = store.batch()

  const tags = batchCollection(batch, listItem.book.tags, 'tags', (tag) => ({
    name: tag.name,
  }))

  const genres = batchCollection(
    batch,
    listItem.book.genres,
    'genres',
    (genre) => ({
      name: genre.name,
    })
  )

  const authors = batchCollection(
    batch,
    listItem.book.authors,
    'authors',
    (author) => ({
      name: author.name,
      search: author.search,
    })
  )

  const bookRef = getDocID(listItem.book.id, 'books')
  batch.set(
    bookRef,
    {
      tags,
      genres,
      authors,
      name: listItem.book.name,
      search: listItem.book.name.toLocaleLowerCase(),
      description: listItem.book.description,
      year: listItem.book.year,
      edition: listItem.book.edition,
      ...(cover ? { cover: cover.name } : {}),
    },
    { merge: true }
  )

  batch.set(
    getDocID(listItem.id, 'lists'),
    {
      doneDate: listItem.doneDate
        ? firebase.firestore.Timestamp.fromMillis(listItem.doneDate)
        : null,
      readingTarget: listItem.readingTarget,
      type: listItem.type,
      bookId: bookRef,
      userId: getDocID(listItem.userId, 'users'),
    },
    { merge: true }
  )

  await batch.commit()
}

function batchCollection<T extends ID>(
  batch: firebase.firestore.WriteBatch,
  collection: T[],
  collectionPath: string,
  onData: (item: T) => Omit<T, 'id'>
): firebase.firestore.DocumentReference[] {
  const refs: firebase.firestore.DocumentReference[] = []
  replaceEmptyIDs<T>(collection, collectionPath).forEach((item) => {
    const ref = store.collection(collectionPath).doc(item.id)
    batch.set(ref, onData(item), {
      merge: true,
    })
    refs.push(ref)
  })
  return refs
}

function getDocID(
  id: string,
  collectionPath: string
): firebase.firestore.DocumentReference {
  return id
    ? store.collection(collectionPath).doc(id)
    : store.collection(collectionPath).doc()
}

function replaceEmptyIDs<T extends ID>(
  collection: T[],
  collectionPath: string
): T[] {
  const nextCollection: T[] = []
  for (const key in collection) {
    const item = collection[key]
    const itemRef = getDocID(item.id, collectionPath)
    nextCollection[key] = { ...item, id: itemRef.id }
  }
  return nextCollection
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
    year: bookDoc.data().year,
    edition: bookDoc.data().edition,
    cover: bookDoc.data().cover,
  }))
}
