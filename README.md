# 📳 Twilio SMS to Telegram Proxy on a Cloudflare Worker

Project kick started from Cloudflare worker project.

## Deploy using Wrangler

- Install [wrangler](https://github.com/cloudflare/wrangler)
- Clone this repository
- Modify wrangler.toml with correct account_id

```bash
## To check your account ID
╭─owen@rackspace ~/twilio-sms-telegram-worker ‹master›
╰─$ wrangler whoami

    ╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
    │                                                                                                    │
    │      👋  You are logged in with an OAuth Token, associated with the email 'user@example.com'!      │
    │                                                                                                    │
    ╰────────────────────────────────────────────────────────────────────────────────────────────────────╯

+--------------+----------------------------------+
| Account Name | Account ID                       |
+--------------+----------------------------------+
| BCP Project  | 11111111111111111111111111111111 |
+--------------+----------------------------------+
| Rackspace    | 22222222222222222222222222222222 |
+--------------+----------------------------------+
| Warrior      | 33333333333333333333333333333333 |
+--------------+----------------------------------+
| Kouriten     | 44444444444444444444444444444444 |
+--------------+----------------------------------+
```

- Define secret for Telegram API Token and chat ID
- TG_CHAT_ID = Your chat ID with the Telegram bot

```console
╭─owen@rackspace ~/twilio-sms-telegram-worker ‹master› 
╰─$ wrangler secret put TG_CHAT_ID
Enter the secret text you'd like assigned to the variable TG_CHAT_ID on the script named twilio-sms-telegram-worker:
12345678 <Your Chat ID here>
🌀  Creating the secret for script name twilio-sms-telegram-worker
✨  Success! Uploaded secret TG_CHAT_ID.
```

- TG_TOKEN = Your Telegram bot API key from [@BotFather](https://t.me/botfather)

```console
╭─owen@rackspace ~/twilio-sms-telegram-worker ‹master› 
╰─$ wrangler secret put TG_TOKEN
Enter the secret text you'd like assigned to the variable TG_TOKEN on the script named twilio-sms-telegram-worker:
1234567890:SoMeRaNd0M-sTr1n6
🌀  Creating the secret for script name twilio-sms-telegram-worker
✨  Success! Uploaded secret TG_TOKEN.```
```

- Start the local server for testing

```console
╭─owen@rackspace ~/twilio-sms-telegram-worker ‹master› 
╰─$ wrangler dev
👂  Listening on http://127.0.0.1:8787
💁  watching "./"
🌀  Detected changes...
```

- Send a test message simulating a Twilio SMS webhook(POST Method) in another terminal

```console
╭─owen@rackspace ~/twilio-sms-telegram-worker ‹master*›
╰─$ curl -v -d 'ToCountry=US&ToState=WI&SmsMessageSid=SM1234567890abcdef&NumMedia=0&ToCity=&FromZip=&SmsSid=SMabcdef1234567890&FromState=MI&SmsStatus=received&FromCity=&FromCountry=US&To=%2B11231234567&ToZip=&NumSegments=1&ReferralNumMedia=0&MessageSid=SM1234567890abcdef&AccountSid=ACffffffffffffffffffffffffffffff&From=%2B11231234567&ApiVersion=2010-04-01' --data-urlencode "Body=This is a test message" http://127.0.0.1:8787
*   Trying 127.0.0.1:8787...
* Connected to 127.0.0.1 (127.0.0.1) port 8787 (#0)
> POST / HTTP/1.1
> Host: 127.0.0.1:8787
> User-Agent: curl/7.74.0
> Accept: */*
> Content-Length: 377
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 377 out of 377 bytes
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< date: Sun, 26 Jun 2022 06:41:10 GMT
< content-type: text/plain;charset=UTF-8
< connection: keep-alive
< expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
< report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=somestrings"}],"group":"cf-nel","max_age":604800}
< nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
< vary: Accept-Encoding
< cf-ray: fffffffffff-NRT
< alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400
< server: cloudflare
< content-length: 0
<
* Connection #0 to host 127.0.0.1 left intact
```

- Publish to the Cloudflare Worker when everything looks good

```console
╭─owen@rackspace ~/twilio-sms-telegram-worker ‹master› 
╰─$ wrangler publish
✨  Basic JavaScript project found. Skipping unnecessary build!
✨  Successfully published your script to
 https://twilio-sms-telegram-worker.yourdomain.workers.dev
```

## Optional handler class for sending debug message

```javascript
async send(req) {
    const formData = await req.formData()
    const body = {}
    for (const entry of formData.entries()) {
        body[entry[0]] = entry[1]
    }

    const url = this.getURL(JSON.stringify({
        'method': req.method,
        'type': req.type,
        'url': req.url,
        'body': JSON.stringify(body)
    }, null, 2))
    console.log(await fetch(url))
    return new Response('', {status: 200});
}
```
