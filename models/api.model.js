
const fs = require('fs/promises')

exports.fetchApi = () => {
    return fs.readFile('./endpoints.json', 'utf-8', (err, data) => {
    })
    .then(result => JSON.parse(result))
}