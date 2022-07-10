module.exports.handler = async (e) => {
        let page = 'index'
        const path = e.rawPath

        if (path === '/') {
            page = 'index'
        } else {
            page = path.split('.html')[0]
        }

        let html = ""
        try {
            html = require('./' + page + '.js')
        } catch (e) {
            html = "<p>Page Not Found</p>"
        }
        return {
            statusCode: 200,
            "headers": {'Content-Type': 'text/html'},
            body: html
        }
    }