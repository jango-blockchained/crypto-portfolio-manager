## Crypto Portflio Manager (CPM)
This is a tool to manage your portfolio of crypto assets. CoinMarketCap does not show the market share of a certain cryto asset but CPM will calculate it. You can define a portfolio (real or virtual) and adjust the shares of your portfolio with the market share of a certain asset. Your data will be stored in the localStorage of the browser. 

[Run CPM from here](https://samhess.github.io/crypto-portfolio-manager/cpm.html)

## Manual Import / Export
To export, in the browser console type `JSON.stringify(portfolio.object)`.

To import, in the browser console type `portfolio.object = JSON.parse( '{"BTC":1},{"ETH":2}' )`. Note: use single apostroph
