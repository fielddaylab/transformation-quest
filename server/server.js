
let getEnv = require('./getEnv')
let app = require('.')
let port = getEnv('PORT')

app.listen(port, () => console.log(`Transformations data collection server listening on port ${port}!`))
