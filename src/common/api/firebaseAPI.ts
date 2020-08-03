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

export interface Quote {
  id: string
  userId: string
  quote: string
}

export interface ShortItemList
  extends Omit<ListItem, 'book' | 'readingTarget'> {
  shortBook: ShortBook
}

export type ShortBook = Omit<
  Book,
  'genres' | 'tags' | 'series' | 'numberInSeries' | 'edition' | 'description'
>

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
  numberInSeries: string
  authors: Author[]
  genres: Genre[]
  tags: Tag[]
  series: Series[]
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

export interface Series extends ID {
  name: string
}

export type ID = { id: string }

export type FilteredBook = Omit<Book, 'authors' | 'genres' | 'tags' | 'series'>

export enum ListItemType {
  Done = 'done',
  InProcess = 'in-process',
  Planned = 'planned',
}

export const listItemTypes = [
  { value: ListItemType.Done, label: 'Прочитанные' },
  { value: ListItemType.InProcess, label: 'Читаю' },
  { value: ListItemType.Planned, label: 'Запланированные' },
]

const LIMIT_ITEMS = 3

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

export async function deleteQuote(
  bookId: string,
  quoteId: string
): Promise<void> {
  await getDocID(quoteId, getQuotesPath(bookId)).delete()
}

export async function setQuote(bookId: string, quote: Quote): Promise<void> {
  const quoteDoc = getDocID(quote.id, getQuotesPath(bookId))
  await quoteDoc.set(
    {
      id: quoteDoc.id,
      userId: getUserRef(quote.userId),
      quote: quote.quote,
    },
    { merge: true }
  )
}

export async function getQuote(
  bookId: string,
  quoteId: string
): Promise<Quote> {
  const quoteDoc = await store
    .collection(getQuotesPath(bookId))
    .doc(quoteId)
    .get()
  return getQuoteFromDoc(quoteDoc)
}

export async function getQuotes({
  bookId,
  userId,
  lastId,
}: {
  bookId: string
  userId?: string
  lastId?: string
}): Promise<Quote[]> {
  let request = store
    .collection(getQuotesPath(bookId))
    .orderBy('id', 'desc')
    .limit(LIMIT_ITEMS)

  if (userId) {
    request = request.where('userId', '==', getUserRef(userId))
  }

  if (lastId) {
    const lastDoc = await getDocID(lastId, getQuotesPath(bookId)).get()
    request = request.startAfter(lastDoc)
  }

  const quoteDocs = await request.get()

  const quotes: Quote[] = []
  for (const quoteDoc of quoteDocs.docs) {
    quotes.push(getQuoteFromDoc(quoteDoc))
  }

  return quotes
}

function getQuotesPath(bookId: string): string {
  return `quotes/${bookId}/items`
}

function getQuoteFromDoc(quoteDoc: firebase.firestore.DocumentSnapshot): Quote {
  const quoteData = quoteDoc.data()
  return {
    id: quoteDoc.id,
    userId: quoteData?.userId.id || '',
    quote: quoteData?.quote || '',
  }
}

export async function getUserBooks(
  userId: string,
  lastItemId: string,
  type?: ListItemType
): Promise<ShortItemList[]> {
  let request = store
    .collection('lists')
    .orderBy(firebase.firestore.FieldPath.documentId(), 'desc')
    .where('userId', '==', getUserRef(userId))
    .limit(LIMIT_ITEMS)

  if (lastItemId) {
    const lastItemDoc = await store.collection('lists').doc(lastItemId).get()
    request = request.startAfter(lastItemDoc)
  }

  if (type) {
    request = request.where('type', '==', type)
  }

  const listDocs = await request.get()

  const shortItemList: ShortItemList[] = []
  for (const listDoc of listDocs.docs) {
    const listData = listDoc.data()
    const bookDoc = await listData?.bookId.get()
    const bookData = bookDoc.data()
    const userDoc = await listData?.userId.get()
    const coverUrl = await getCoverUrl(bookData.cover)
    const authors = await fetchCollections<Author>(bookData.authors)

    const itemList: ShortItemList = {
      userId: userDoc.id,
      id: listDoc.id,
      doneDate: (listData?.doneDate as firebase.firestore.Timestamp)?.toMillis(),
      type: listData?.type,
      shortBook: {
        id: bookDoc.id,
        name: bookData.name,
        year: bookData.year,
        cover: coverUrl,
        authors,
      },
    }

    shortItemList.push(itemList)
  }

  return shortItemList
}

export async function getBookFromList(listId: string): Promise<ListItem> {
  const listDoc = await store.collection('lists').doc(listId).get()
  const listData = listDoc.data()

  const bookDoc = await listData?.bookId.get()
  const bookData = bookDoc.data()

  const authors = await fetchCollections<Author>(bookData.authors)
  const genres = await fetchCollections<Genre>(bookData.genres)
  const tags = await fetchCollections<Tag>(bookData.tags)
  const series = await fetchCollections<Series>(bookData.series)

  const userDoc = await listData?.userId.get()

  const coverUrl = await getCoverUrl(bookData.cover)

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
      numberInSeries: bookData.numberInSeries,
      authors,
      genres,
      tags,
      series,
      cover: coverUrl,
    },
  }
}

async function getCoverUrl(cover: string): Promise<string> {
  if (cover) {
    return await storage.ref().child(cover).getDownloadURL()
  }
  return ''
}

export async function searchAuthors(needle: string): Promise<Author[]> {
  return searchInCollection(needle, 'authors')
}

export async function searchGenres(needle: string): Promise<Genre[]> {
  return searchInCollection(needle, 'genres', 'name')
}

export async function searchTags(needle: string): Promise<Tag[]> {
  return searchInCollection(needle, 'tags', 'name')
}

export async function searchSeries(needle: string): Promise<Series[]> {
  return searchInCollection(needle, 'series', 'name')
}

export async function setBookList(
  listItem: ListItem,
  cover: File | null
): Promise<void> {
  if (cover) {
    if (listItem.book.cover) {
      await storage.refFromURL(listItem.book.cover).delete()
    }
    const coverRef = storage.ref().child(cover.name)
    await coverRef.put(cover)
  }

  const batch = store.batch()

  const tags = batchCollection(batch, listItem.book.tags, 'tags', (tag) => ({
    name: tag.name,
  }))

  const series = batchCollection(
    batch,
    listItem.book.series,
    'series',
    (series) => ({
      name: series.name,
    })
  )

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
      series,
      genres,
      authors,
      name: listItem.book.name,
      search: listItem.book.name.toLocaleLowerCase(),
      description: listItem.book.description,
      year: listItem.book.year,
      edition: listItem.book.edition,
      numberInSeries: listItem.book.numberInSeries,
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

  const books = []
  for (let i = 0; i < booksDoc.size; i++) {
    const bookDoc = booksDoc.docs[i]
    const bookData = booksDoc.docs[i].data()

    const cover = await getCoverUrl(bookData.cover)

    const book: FilteredBook = {
      id: bookDoc.id,
      name: bookData.name,
      description: bookData.description,
      year: bookData.year,
      edition: bookData.edition,
      numberInSeries: bookData.numberInSeries,
      cover,
    }
    books.push(book)
  }

  return books
}

function getBookRef(bookId: string) {
  return store.collection('books').doc(bookId)
}

function getUserRef(userId: string) {
  return store.collection('users').doc(userId)
}
