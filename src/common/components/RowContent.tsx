import React from 'react'

type Props = { text: string }

const RowContent = ({ text }: Props) => (
  <span
    dangerouslySetInnerHTML={{
      __html: text.replace(/(?:\r\n|\r|\n)/g, '<br>'),
    }}
  />
)

export default RowContent
