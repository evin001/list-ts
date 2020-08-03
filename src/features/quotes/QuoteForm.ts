import { Quote } from '~/common/api/firebaseAPI'

class QuoteForm {
  static QUOTE_MAX_LENGTH = 1000

  readonly #id: string
  #userId: string
  #quote: string

  constructor(quote?: Quote) {
    this.#id = quote?.id || ''
    this.#userId = quote?.userId || ''
    this.#quote = quote?.quote || ''
  }

  clone() {
    return new QuoteForm(this.toObject())
  }

  toObject(): Quote {
    return {
      id: this.#id,
      userId: this.#userId,
      quote: this.#quote,
    }
  }

  get hasError() {
    return this.#quote === '' || /[<>]/.test(this.#quote)
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

  get userId() {
    return this.#userId
  }

  set userId(value) {
    this.#userId = value
  }
}

export default QuoteForm
