import { Quote } from '~/common/api/firebaseAPI'

class QuoteForm {
  static QUOTE_MAX_LENGTH = 1000

  readonly #id: string
  readonly #bookId: string
  readonly #userId: string
  #quote: string

  constructor(quote?: Quote) {
    this.#id = quote?.id || ''
    this.#bookId = quote?.bookId || ''
    this.#userId = quote?.userId || ''
    this.#quote = quote?.quote || ''
  }

  clone() {
    return new QuoteForm(this.toObject())
  }

  toObject(): Quote {
    return {
      id: this.#id,
      bookId: this.#bookId,
      userId: this.#userId,
      quote: this.#quote,
    }
  }

  get hasError() {
    return this.#quote === ''
  }

  get quote() {
    return this.#quote
  }

  set quote(value) {
    this.#quote = value.substr(0, QuoteForm.QUOTE_MAX_LENGTH)
  }

  get helpTextQuote() {
    return `${this.#quote.length}/${QuoteForm.QUOTE_MAX_LENGTH}`
  }
}

export default QuoteForm
