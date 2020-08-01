import { blue, cyan, green, pink, deepOrange } from '@material-ui/core/colors'

const colors = [blue[500], green[500], cyan[500], pink[500], deepOrange[500]]

export function getColor(index: number): string {
  const colorCount = colors.length,
    calcIndex = index + 1

  let rangeIndex = Math.ceil(calcIndex / colorCount)
  rangeIndex *= colorCount
  rangeIndex -= colorCount
  rangeIndex = calcIndex - rangeIndex - 1

  return colors[rangeIndex]
}
