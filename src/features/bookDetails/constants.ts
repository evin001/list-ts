import { ListItemType } from '~/common/api/firebaseAPI'

export const listItemTypes = [
  { value: ListItemType.Done, label: 'Прочитанные' },
  { value: ListItemType.InProcess, label: 'Читаю' },
  { value: ListItemType.Planned, label: 'Запланированные' },
]
