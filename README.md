## Crypto Portfolio Manager (CPM)
This is a tool to manage and track your portfolio of crypto assets. CoinMarketCap does not show the market share of a certain crypto asset but CPM will calculate it for you. You can define a portfolio (real or virtual) and adjust the shares of your portfolio with the market share of a certain asset. The data will be stored in the `localStorage` of your web browser, hence no user account is needed.

[Run CPM from here](https://samhess.github.io/crypto-portfolio-manager/index.html)

## Manual Import / Export
To export, in the browser console type `JSON.stringify(portfolio.object)`.

To import, in the browser console type `portfolio.object = JSON.parse( '{"BTC":1},{"ETH":2}' )`. Note: use single apostroph
