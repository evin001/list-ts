import {
  Author,
  Book,
  Genre,
  Tag,
  Series,
  ListItem,
  ListItemType,
} from '~/common/api/firebaseAPI'

export type BookType = keyof Omit<
  Book,
  'id' | 'cover' | 'authors' | 'genres' | 'tags' | 'series'
>
export type BookDetailsType = keyof Pick<ListItem, 'readingTarget'>
export type AutocompleteBookType = 'authors' | 'genres' | 'tags' | 'series'

class BookDetailsForm {
  static READING_TARGET_MAX_LENGTH = 250

  readonly #id: string

  #book: BookField
  #type: ListItemType
  #readingTarget: string
  #withoutDate: boolean

  #doneDate?: Date

  constructor(listItem?: ListItem, withoutDate = false) {
    this.#id = listItem?.id || ''
    this.#book = new BookField(listItem?.book)
    this.#type = listItem?.type || ListItemType.Done
    this.#readingTarget = listItem?.readingTarget || ''
    this.#doneDate =
      (listItem?.doneDate && new Date(listItem.doneDate)) || void 0
    this.#withoutDate = withoutDate || !this.#doneDate
  }

  clone() {
    return new BookDetailsForm(
      {
        id: this.#id,
        doneDate: this.#doneDate?.getTime(),
        readingTarget: this.#readingTarget,
        type: this.#type,
        book: this.#book.toObject(),
      },
      this.#withoutDate
    )
  }

  toObject(): ListItem {
    return {
      id: this.#id,
      doneDate: !this.#withoutDate ? this.#doneDate?.getTime() : undefined,
      readingTarget: this.#readingTarget,
      type: this.#type,
      book: this.#book.toObject(),
    }
  }

  get hasError(): boolean {
    return this.#book.hasError
  }

  get type() {
    return this.#type
  }

  set type(value) {
    this.#doneDate = value !== ListItemType.Done ? void 0 : new Date()
    this.#type = value
  }

  get doneDate() {
    return this.#doneDate
  }

  set doneDate(value) {
    this.#doneDate = value
    this.#withoutDate = false
  }

  get withoutDate() {
    return this.#withoutDate
  }

  set withoutDate(value) {
    this.#withoutDate = value
  }

  get book(): BookField {
    return this.#book
  }

  set book(value) {
    this.#book = value
  }

  get readingTarget() {
    return this.#readingTarget
  }

  set readingTarget(value) {
    this.#readingTarget = value.substr(
      0,
      BookDetailsForm.READING_TARGET_MAX_LENGTH
    )
  }

  get helperTextReadingTarget() {
    return `${this.#readingTarget.length}/${
      BookDetailsForm.READING_TARGET_MAX_LENGTH
    }`
  }
}

export class BookField {
  static NAME_MAX_LENGTH = 100
  static DESCRIPTION_MAX_LENGTH = 1000
  static EDITION_MAX_LENGTH = 20
  static AUTHORS_MAX_COUNT = 5
  static GENRES_MAX_COUNT = 10
  static TAGS_MAX_COUNT = 10
  static SERIES_MAX_COUNT = 3

  #id: string
  #name: string
  #description: string
  #year: string
  #edition: string
  #numberInSeries: string
  #cover: string
  #authors: Author[]
  #genres: Genre[]
  #tags: Tag[]
  #series: Series[]

  constructor(book?: Book) {
    this.#id = book?.id || ''
    this.#cover = book?.cover || ''
    this.#name = book?.name ?? ''
    this.#description = book?.description ?? ''
    this.#year = book?.year ?? ''
    this.#edition = book?.edition ?? ''
    this.#numberInSeries = book?.numberInSeries ?? ''
    this.#authors = book?.authors || []
    this.#genres = book?.genres || []
    this.#tags = book?.tags || []
    this.#series = book?.series || []
  }

  toObject(): Book {
    return {
      id: this.#id,
      cover: this.#cover,
      name: this.#name,
      description: this.#description,
      year: this.#year,
      edition: this.#edition,
      numberInSeries: this.#numberInSeries,
      authors: this.#authors,
      genres: this.#genres,
      tags: this.#tags,
      series: this.#series,
    }
  }

  get hasError(): boolean {
    return (
      this.#year === '' ||
      (this.#year && parseInt(this.#year, 10) <= 0) ||
      (this.#numberInSeries && parseInt(this.#numberInSeries, 10) <= 0) ||
      this.#genres.length === 0 ||
      this.#authors.length === 0 ||
      this.#name === '' ||
      this.#description === ''
    )
  }

  get id() {
    return this.#id
  }

  set id(value) {
    this.#id = value
  }

  get cover() {
    return this.#cover
  }

  set cover(value) {
    this.#cover = value
  }

  get name() {
    return this.#name
  }

  set name(value) {
    this.#name = value.substr(0, BookField.NAME_MAX_LENGTH)
  }

  get helperTextName() {
    return `${this.#name.length}/${BookField.NAME_MAX_LENGTH}`
  }

  get description() {
    return this.#description
  }

  set description(value) {
    this.#description = value.substr(0, BookField.DESCRIPTION_MAX_LENGTH)
  }

  get helpTextDescription() {
    return `${this.#description.length}/${BookField.DESCRIPTION_MAX_LENGTH}`
  }

  get year() {
    return this.#year
  }

  set year(value) {
    this.#year = value
  }

  get numberInSeries() {
    return this.#numberInSeries
  }

  set numberInSeries(value) {
    this.#numberInSeries = value
  }

  get edition() {
    return this.#edition
  }

  set edition(value) {
    this.#edition = value.substr(0, BookField.EDITION_MAX_LENGTH)
  }

  get helpTextEdition() {
    return `${this.#edition.length}/${BookField.EDITION_MAX_LENGTH}`
  }

  get authors() {
    return this.#authors
  }

  set authors(value: (string | Author)[]) {
    this.#authors = setFilteredField<Author>(
      value,
      BookField.AUTHORS_MAX_COUNT,
      true
    )
  }

  get helpTextAuthors() {
    return `${this.#authors.length}/${BookField.AUTHORS_MAX_COUNT}`
  }

  get genres() {
    return this.#genres
  }

  set genres(value: (string | Genre)[]) {
    this.#genres = setFilteredField<Genre>(
      value,
      BookField.GENRES_MAX_COUNT,
      false
    )
  }

  get helpTextGenres() {
    return `${this.#genres.length}/${BookField.GENRES_MAX_COUNT}`
  }

  get tags() {
    return this.#tags
  }

  set tags(value: (string | Tag)[]) {
    this.#tags = setFilteredField<Tag>(value, BookField.TAGS_MAX_COUNT, false)
  }

  get helpTextTags() {
    return `${this.#tags.length}/${BookField.TAGS_MAX_COUNT}`
  }

  get series() {
    return this.#series
  }

  set series(value: (string | Series)[]) {
    this.#series = setFilteredField<Series>(
      value,
      BookField.SERIES_MAX_COUNT,
      false
    )
  }

  get helpTextSeries() {
    return `${this.#series.length}/${BookField.SERIES_MAX_COUNT}`
  }
}

function setFilteredField<T>(
  value: (string | T)[],
  limit: number,
  search: boolean
): T[] {
  return value
    .map((item) => {
      if (typeof item === 'string') {
        return ({
          id: '',
          name: search ? item.trim() : item.toLocaleLowerCase().trim(),
          ...(search ? { search: item.toLocaleLowerCase().trim() } : {}),
        } as unknown) as T
      }
      return item
    })
    .slice(0, limit)
}

export default BookDetailsForm
