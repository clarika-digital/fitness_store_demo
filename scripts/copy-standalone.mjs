/**
 * Copies the assets Next leaves out of the standalone output.
 *
 * `next build` emits a self-contained server in `.next/standalone/`, but static
 * assets and `public/` live outside it, so they have to be copied in before
 * `next start` can serve them. The original shell script used `cp -r`, which
 * only exists on macOS/Linux; `fs.cp` is recursive and works everywhere.
 */

import { cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()

const COPIES = [
  { from: '.next/static', to: '.next/standalone/.next/static' },
  { from: 'public', to: '.next/standalone/public' },
]

for (const { from, to } of COPIES) {
  const source = path.join(root, from)
  if (!existsSync(source)) {
    console.warn(`Skipping ${from} — not found.`)
    continue
  }
  await cp(source, path.join(root, to), { recursive: true })
  console.log(`Copied ${from} → ${to}`)
}
