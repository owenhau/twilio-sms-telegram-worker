CHAT_ID = globalThis.TG_CHAT_ID
TOKEN = globalThis.TG_TOKEN

function addURLOptions(urlstr, options = {}) {
  let url = urlstr
  for (const key of Object.keys(options)) {
    if (options[key]) url += '&' + key + '=' + options[key]
  }
  return url
}

class Handler {
  constructor(config) {
    this.chat_id = CHAT_ID
    this.token = TOKEN
    this.url = 'https://api.telegram.org/bot' + TOKEN
  }

  async send(req) {
    const formData = await req.formData()
		const body = {}
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }

		const url = this.getURL("From:" + body['From'] + "\r\n==== Message: ====\r\n" + body['Body'])
		console.log(await fetch(url))
		return new Response('', {status: 200})
	}

  getURL(text) {
    let url = this.url + '/sendMessage?chat_id=' + this.chat_id
    url = addURLOptions(url, {
      "text": text,
      "disable_web_page_preview": true
    })
    return url
  }
}

// Initialize new request handler
const handler = new Handler()

// Listen to all fetch events received by worker
addEventListener('fetch', event => {
	event.respondWith(handler.send(event.request))
})
