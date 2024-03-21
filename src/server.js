import http from 'node:http'

const server = http.createServer(async (req, res) => {
  return res.end(JSON.stringify({ message: 'Hello world'}))
})

server.listen(3333, () => console.log('Server running on port 3333'))