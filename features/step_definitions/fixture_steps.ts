import { Then } from '../../'
import { expect } from 'chai'
import {
  normalizeMessageOutput,
  normalizeJsonOutput,
} from '../support/formatter_output_helpers'
import fs from 'mz/fs'
import path from 'path'

Then(
  'the {string} formatter output matches the fixture {string}',
  async function(formatter: string, filePath: string) {
    let actual: any
    if (formatter === 'message') {
      actual = this.lastRun.envelopes.map(e => e.toJSON())
      actual = normalizeMessageOutput(actual, this.tmpDir)
    } else {
      const actualPath = path.join(this.tmpDir, `${formatter}.out`)
      actual = await fs.readFile(actualPath, 'utf8')
      if (formatter === 'json') {
        actual = normalizeJsonOutput(actual, this.tmpDir)
      }
    }
    const fixturePath = path.join(__dirname, '..', 'fixtures', filePath)
    const expected = require(fixturePath) // eslint-disable-line @typescript-eslint/no-var-requires
    expect(actual).to.eql(expected)
  }
)
