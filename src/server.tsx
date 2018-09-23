import * as http from "http"
import * as fs from "fs"
import * as streamLib from "stream"
import * as pathLib from "path"
import * as urlLib from "url"

import Purview from "./purview"
import App from "./app"

const CLIENT_BASENAME = "client.js"
const CLIENT_PATH = pathLib.join(__dirname, "..", "dist", CLIENT_BASENAME)

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.statusCode = 400
    res.end()
    return
  }

  const url = urlLib.parse(req.url)
  switch (url.pathname) {
    case "/":
      const html = `
        <!DOCTYPE html>
        <html>
          <body>
            <h1>This is a counter</h1>
            <div id="root">
              ${Purview.render(<App />)}
            </div>
            <script src="/${CLIENT_BASENAME}"></script>
          </body>
        </html>
      `

      res.setHeader("Content-type", "text/html")
      res.end(html)
      break

    case `/${CLIENT_BASENAME}`:
      const readStream = fs.createReadStream(CLIENT_PATH)
      res.setHeader("Content-type", "application/javascript")
      streamLib.pipeline(readStream, res)
      break

    default:
      res.statusCode = 404
      res.end()
      break
  }
})

Purview.handleWebSocket(server)

const port = 2597
const host = "127.0.0.1"

/* tslint:disable no-console */
server.listen(port, host, () => console.log(`Listening on ${host}:${port}`))
/* tslint:enable no-console */
