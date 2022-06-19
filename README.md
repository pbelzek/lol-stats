# lol-stats

This app is a simple API that returns info about League of Legends player's match stats and rank.

## What is it & how it works & why was it made

The main reason for this app to exist was to allow Twitch StreamElement's chatbot display info about streamer's match history and rank in League of Legends.

Chatbot is setup with a command that sends a request to this API and displays the response on chat. It supports fetching data for multiple summoners - if streamer plays on multiple accounts, both `rank` and `stats` endpoints will return correct data.

Currently, this API consists of two endpoints:

- `/rank` - returns info about summoners' ranks, LP and winratio, along with a link to [op.gg](op.gg) profile
- `/stats` - returns info about summoners' match history during current stream.

### Examples

Let's say that a streamer plays on two accounts: `Foo` and `Bar`, and stream has been running for 2 hours 30 minutes.

You can get current rank info for these accounts by sending request to this URL:

`/rank?summoner-name=Foo&summoner-name=Bar&summoner-platform=EUN1&summoner-platform=EUW1`

And example response will be:

```
EUNE Foo: PLATINUM I 27 LP 52% WR https://op.gg/summoners/eune/Foo | EUW Bar: GOLD II 257 LP 49% WR https://op.gg/summoners/euw/Bar
```

For match history you send a request like this:

`/stats?summoner-name=Foo&summoner-name=Bar&summoner-platform=EUN1&summoner-platform=EUW1&&stream-uptime=%202%20hours%2030%20minutes`

And example response will be:

```
Bilans [W-L]: 1:2. Ezreal ✔ 5/5/10; Jinx ✖ 1/7/3; Tristana ✖ 3/5/5. Dzisiejsze KDA: 9/17/18 (3.00). Średnie KDA: 3.00/5.67/6.00
```