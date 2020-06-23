const http = require('http');
const fs = require('fs');
const port = process.env.PORT;

http.createServer((req, res) => {
	let responseCode = 404;
	let content = '404 Error';

	if (req.url === 'https://kassadinbot-beta.herokuapp.com/') {
		responseCode = 200;
		content = fs.readFileSync('./index.html');
	}

	res.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
	});

	res.write(content);
	res.end();
})
	.listen(port);
