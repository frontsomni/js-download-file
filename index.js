const express = require('express')
const stream = require('stream')
const path = require('path')

const app = express()
const port = 8866
const download = require('download')


app.use(express.json())
// assets 为静态资源文件夹，但 assets 不出现在资源路径中
app.use(express.static('assets'))
// 处理跨域
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Connection", "keep-alive")
	res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
  if(req.method=="OPTIONS") {
    res.sendStatus(200)
  } else {
    next()
  }
})
app.get('/api/download', async (req, res) => {
  let filename = req.query.name
  console.log(filename)
  if (!filename) {
    res.json({
      msg: '请求不被允许'
    })
    return false
  }
  // stream 方法：下载 weui.min.css 文件
  const filePath = 'https://weui.io/weui.min.css'
  let buffer = await download(filePath)
  var fileContents = Buffer.from(buffer, 'base64')
  var readStream = new stream.PassThrough()
  readStream.end(fileContents)

  res.set(
    'Content-disposition', 'attachment; filename=' + filename + '.css'
  )
  res.set('Content-Type', 'text/css')
  
  readStream.pipe(res)

  // 直接下载服务器磁盘上文件
  // res.download('./assets/weui.min.css')
})
app.get('/', async (req, res) => {
  console.log(path.join(__dirname, 'index.html'))
  res.sendfile(path.join(__dirname, 'index.html'))
})

app.listen(
  port,
  () => {
    console.log(`run app on port ${port}`)
  }
)