import { spawn } from 'child_process'
import { Request, Response } from 'express'

const STREAM_CLOSE_EVENT = 'close'

export function streamCLI(
  req: Request,
  res: Response,
  cmd: string,
  args?: string[],
) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.flushHeaders()

  const process = spawn(cmd, args)

  process.stdout.on('data', (data) => {
    const message = data.toString()
    sendSSEMessage(res, message)
  })

  process.stderr.on('data', (data) => {
    const message = data.toString()
    sendSSEMessage(res, 'stderr: ' + message)
  })

  process.on('close', (code) => {
    // Send an event to indicate completion
    sendSSEMessage(res, `Command exited with code ${code}`)
    sendSSECloseEvent(res)
    res.end()
  })

  // Handle client disconnection
  req.on('close', () => {
    // console.log('Client disconnected')
    process.kill()
    res.end()
  })
}

export function sendSSEMessage(res: Response, message: string) {
  message = message.replace(/[\r\n]+/g, '\n') // Normalize newlines
  const lines = message.split('\n')
  lines.forEach((line) => {
    res.write(`data: ${line}\n`)
  })
  res.write('\n')
}

export function sendSSECloseEvent(res: Response) {
  res.write(`event: ${STREAM_CLOSE_EVENT}\n`)
  // I don't know why sending some data is required after close event
  res.write(`data:  \n`)
  res.write('\n')
}
