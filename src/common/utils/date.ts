import DateFnsUtils from '@date-io/date-fns'
import format from 'date-fns/format'

export class RuLocalizedUtils extends DateFnsUtils {
  getCalendarHeaderText(date: Date) {
    return format(date, 'LLLL', { locale: this.locale })
  }

  getDatePickerHeaderText(date: Date) {
    return format(date, 'dd MMMM', { locale: this.locale })
  }
}
