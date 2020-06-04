import { Book, ListItem, ListItemType } from '~/common/api/firebaseAPI'

export type BookType = keyof Omit<Book, 'id' | 'authors'>
export type BookDetailsType = keyof Pick<ListItem, 'readingTarget'>

class BookDetailsForm {
  static READING_TARGET_MAX_LENGTH = 250

  readonly #book: BookField

  #type: ListItemType
  #readingTarget: string
  #withoutDate: boolean

  doneDate?: Date

  constructor(listItem?: ListItem, withoutDate = false) {
    this.#book = new BookField(listItem?.book)
    this.#type = listItem?.type || ListItemType.Done
    this.#readingTarget = listItem?.readingTarget || ''
    this.doneDate =
      (listItem?.doneDate && new Date(listItem.doneDate)) || void 0
    this.#withoutDate = withoutDate
  }

  get type() {
    return this.#type
  }

  set type(value) {
    this.doneDate = value !== ListItemType.Done ? void 0 : new Date()
    this.#type = value
  }

  get withoutDate() {
    return this.#withoutDate
  }

  set withoutDate(value) {
    if (value) {
      this.doneDate = void 0
    }
    this.#withoutDate = value
  }

  get book(): BookField {
    return this.#book
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

  clone() {
    return new BookDetailsForm(
      {
        id: '',
        doneDate: this.doneDate?.getMilliseconds(),
        readingTarget: this.#readingTarget,
        type: this.#type,
        book: this.#book.toObject(),
      },
      this.#withoutDate
    )
  }
}

class BookField {
  static NAME_MAX_LENGTH = 100
  static DESCRIPTION_MAX_LENGTH = 1000

  readonly #id: string
  readonly #complete: boolean

  #name: string
  #description: string

  constructor(book?: Book) {
    this.#id = book?.id || ''
    this.#complete = Boolean(book)
    this.#name = book?.name ?? ''
    this.#description = book?.description ?? ''
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

  get errorName() {
    return this.#complete && this.#name === ''
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

  get errorDescription() {
    return this.#complete && this.#description === ''
  }

  toObject(): Book {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      authors: {},
    }
  }
}

export default BookDetailsForm
