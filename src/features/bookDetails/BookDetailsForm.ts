import { Book, ListItem, ListItemType } from '~/common/api/firebaseAPI'

export type BookType = keyof Omit<Book, 'id' | 'authors'>

class BookDetailsForm {
  readonly #book: BookField

  #type: ListItemType
  doneDate?: Date

  constructor(listItem?: ListItem) {
    this.#book = new BookField(listItem?.book)
    this.#type = listItem?.type || ListItemType.Done
    this.doneDate =
      (listItem?.doneDate && new Date(listItem.doneDate)) || void 0
  }

  get type() {
    return this.#type
  }

  set type(value) {
    this.doneDate = value !== ListItemType.Done ? void 0 : new Date()
    this.#type = value
  }

  get book(): BookField {
    return this.#book
  }

  clone() {
    return new BookDetailsForm({
      id: '',
      doneDate: this.doneDate?.getMilliseconds(),
      readingTarget: '',
      type: this.#type,
      book: this.#book.toObject(),
    })
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
