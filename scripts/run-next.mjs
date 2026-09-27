/**
 * Cross-platform launcher for `dev` and `start`.
 *
 * The previous scripts relied on POSIX-only shell syntax:
 *
 *   next dev -p 3000 2>&1 | tee dev.log
 *   PORT=3000 NODE_ENV=production bun .next/standalone/server.js | tee server.log
 *
 * Inline env assignment and `tee` do not exist in cmd.exe/PowerShell, so the
 * scripts failed on Windows. This wrapper does the same three things (spawn the
 * right entry point, forward the output to a log file *and* the terminal) in
 * plain Node, so `bun run dev` / `bun run start` behave identically on every
 * platform.
 *
 * Usage: node scripts/run-next.mjs <dev|start> <port>
 */

import { spawn } from 'node:child_process'
import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const [mode, portArg] = process.argv.slice(2)
const PORT = Number(portArg)

if ((mode !== 'dev' && mode !== 'start') || !Number.isInteger(PORT)) {
  console.error('Usage: node scripts/run-next.mjs <dev|start> <port>')
  process.exit(1)
}

const root = process.cwd()
const logDir = path.join(root, 'logs')

if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true })

const logFile = path.join(logDir, `${mode}.log`)
const logStream = createWriteStream(logFile, { flags: 'a' })

/** Writes to the terminal and the log file at the same time. */
function forward(stream, target) {
  let buffer = ''
  stream.setEncoding('utf8')
  stream.on('data', (chunk) => {
    buffer += chunk
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      target.write(`${line}\n`)
      logStream.write(`${line}\n`)
    }
  })
  stream.on('end', () => {
    if (buffer) {
      target.write(buffer)
      logStream.write(buffer)
    }
    logStream.end()
  })
}

const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
const standaloneServer = path.join(root, '.next', 'standalone', 'server.js')

const [command, args, env] =
  mode === 'dev'
    ? [process.execPath, [nextBin, 'dev', '-p', String(PORT)], {}]
    : [
        process.execPath,
        [standaloneServer],
        { PORT: String(PORT), NODE_ENV: 'production' },
      ]

if (mode === 'start' && !existsSync(standaloneServer)) {
  console.error(
    `Missing ${standaloneServer}. Run "bun run build" before "bun run start".`
  )
  process.exit(1)
}

console.log(`> ${mode} on port ${PORT} (logging to ${logFile})`)

const child = spawn(command, args, {
  cwd: root,
  env: { ...process.env, ...env },
  stdio: ['inherit', 'pipe', 'pipe'],
})

forward(child.stdout, process.stdout)
forward(child.stderr, process.stderr)

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})
