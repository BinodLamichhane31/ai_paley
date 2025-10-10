import { Stringifier } from 'csv-stringify'
import { stringify } from 'csv-stringify'
import type { Response } from 'express'

export function streamCsv(res: Response, filename: string, header: string[], rowsAsync: AsyncIterable<string[]>) {
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
  const csv: Stringifier = stringify({ header: true, columns: header })
  csv.pipe(res)
  ;(async () => {
    for await (const row of rowsAsync) {
      csv.write(row)
    }
    csv.end()
  })().catch((e) => {
    csv.end()
    res.end()
  })
}


