var app = new Vue({
    el: '#app',
    data: {
        title: "Crypto Portfolio Manager",
        pageNames: {
            1: "Market Overview",
            2: "Portfolio",
            3: "Portfolio Analysis",
            4: "Performance Analysis"
        },
        currentPageName: "Market Overview"
    }
});


var currency = 'USD';
var locale = 'de-CH';
var coinListLimit = 100;
var coinList = {}; // associative array which is an object in Javascript
var sortableCoinList = []; // sortable array
var total_market_cap = 0;
var active_cryptocurrencies = 0;
var portfolio_value = 0; 
var portfolio; 
var historicalPrices = []; 
var histCoinLimit = 20; 
/**
* Make AJAX calls to CMC API, endpoint global
*/
function getMarketInfo() {
    $.get( 'https://api.coinmarketcap.com/v2/global/', { "convert": currency }, function( data ) {
        total_market_cap = data.data.quotes[currency].total_market_cap;
        active_cryptocurrencies = data.data.active_cryptocurrencies;
        // get the coin infos
        getCoinList();
    });
}

/**
* Make AJAX calls to CMC API, endpoint global ticker, maximum 100 items per call
*/
function getCoinList() {
    var numberOfReq = Math.ceil(coinListLimit/100)
    var req = [];
    for (var i=0; i<numberOfReq; i++){
        var limit = (i+1 != numberOfReq) ? 100 : coinListLimit % 100;
        req.push($.get(  'https://api.coinmarketcap.com/v2/ticker/', { "convert": currency, "start": i*100+1, "limit":limit }))
    }
    $.when(...req).done(function() {
        var data = {}
        if (req.length > 1 && arguments[0][1] == 'success') { // array of jqXHR responses due to multiple ajax calls
            for( var i=0; i<arguments.length; i++ ){
                // merge data to single data object
                if (arguments[i][1] == 'success') {
                    Object.assign(data, arguments[i][0].data)
                } else {
                    console.log('error: ' + arguments[i])
                }
            }
        } else if (arguments[1] == 'success') { // single xhr response due to single ajax call
            data = arguments[0].data
        }
        sortableCoinList = [];
        for (var key in data) {
            coinList[data[key].symbol] = data[key];
            sortableCoinList.push(data[key]);
        }
        sortableCoinList.sort(function (a, b) {
            return a.rank - b.rank;
        });
        fetchHistoricalPrices(sortableCoinList.slice(0,histCoinLimit));
        showOverview()
        // console.log(coinList)
    });    
}

/**
* Show overview on home page
*/
function showOverview() {
    $("#marketcap").html(total_market_cap.toLocaleString(locale,  { style: 'currency', currency: currency }));     
    
    var dtApi = $('#tableOverview').DataTable();
    dtApi.clear();
    for (var key in sortableCoinList) {
        var rank = sortableCoinList[key].rank;
        var symbol = sortableCoinList[key].symbol;
        var name = sortableCoinList[key].name;
        var market_cap = sortableCoinList[key].quotes[currency].market_cap;
        var market_share = market_cap / total_market_cap;
        var price = sortableCoinList[key].quotes[currency].price;
        var percent_change_1h = sortableCoinList[key].quotes[currency].percent_change_1h;
        var percent_change_24h = sortableCoinList[key].quotes[currency].percent_change_24h;
        var percent_change_7d = sortableCoinList[key].quotes[currency].percent_change_7d;
        dtApi.row.add([rank, name + ' (' + symbol + ')', price, percent_change_1h, percent_change_24h, percent_change_7d, market_share]);
    }
    dtApi.columns.adjust();
    dtApi.draw();
}

function definePortfolio() {
    var datatable = $('#tablePortfolio').DataTable();
    datatable.clear();
    for (var key in portfolio.object) { // portfolio is a proxy to localStorage, object returns an object
        var coin = {}
        coin.symbol = key;
        coin.amount = portfolio[key];
        if (key in coinList) {
            coin.rank = coinList[key].rank
            coin.name = coinList[key].name
            coin.market_cap = coinList[key].quotes[currency].market_cap
        } else {
            console.warn('Warning: Unknown coin. ' + key + ' is not amongst top ' + coinListLimit + ' coins on CMC')
            coin.rank = null
            coin.name = 'unknown'
            coin.market_cap = 0
        }
        datatable.row.add([coin.rank, coin.amount, coin.name + ' (' + coin.symbol + ')', coin.symbol]);
    } 
    datatable.columns.adjust();
    datatable.draw();
}

function analyzePortfolio() {
    var datatable = $('#tableAnalysis').DataTable();
    datatable.clear();
    portfolio_value = 0;
    var tmpPortfolio = portfolio.object;
    var coins = [];
    for (var key in tmpPortfolio) {
        var coin = {}
        if (key in coinList) {
            coin.rank = coinList[key].rank;
            coin.symbol = coinList[key].symbol;
            coin.name = coinList[key].name;
            coin.market_cap = coinList[key].quotes[currency].market_cap;
            coin.price = Number(coinList[key].quotes[currency].price.toFixed(6));
            coin.market_share = Number((100 * coin.market_cap / total_market_cap).toFixed(3));
            coin.amount = tmpPortfolio[key];
            coin.value = Number((coin.price * coin.amount).toFixed(0));
            portfolio_value += coin.value;
            coins.push(coin);
        } else {
            console.warn('Warning: we have no data for ' + key + '. Coin will be ignored for calculations!')
        }
    }
    for (var key in coins) {
        coins[key].portfolio_share = Number((100 * coins[key].value / portfolio_value).toFixed(2));
        var relweight = coins[key].portfolio_share / coins[key].market_share;
        if (coins[key].amount == 0) { 
            coins[key].weight =  'not present'
        } else {
            coins[key].weight = (100*relweight).toFixed(0)
        }
    }
    coins.sort(function (a, b) {
        return a.rank - b.rank;
    });
    // console.log(coins)
    var pv = portfolio_value.toLocaleString('de-CH',  { style: 'currency', currency: currency })
    // console.log('Portfolio value is ' + pv)
    var pvBTC = (portfolio_value / coinList["BTC"].quotes.USD.price).toFixed(2)
    $("#portfolioValue").html(pv + ' | ' +  pvBTC + ' BTC');
    var m2pRatio = total_market_cap / portfolio_value;
    m2pRatio = m2pRatio.toLocaleString('de-CH',  { style : 'decimal', maximumFractionDigits : 0 });
    $("#m2pRatio").html(m2pRatio);
    for (var key in coins) {
        var coin = coins[key];
        datatable.row.add([coin.rank, coin.amount, coin.name + ' (' + coin.symbol + ')', coin.portfolio_share, coin.market_share, coin.weight]);
    }
    datatable.columns.adjust();
    datatable.draw();
}

function fetchHistoricalPrices(list, limit) {
    historicalPrices = [];
    var numberOfCoins =list.length;
    var numberOfLastCoins = numberOfCoins % 15
    var numberOfCalls = Math.ceil(numberOfCoins/15);
    var i=0;      
    var interv = setInterval(function(){ 
        var end = (i+1 == numberOfCalls) ? i*15 + numberOfLastCoins : (i+1)*15
        var symbols = list.slice(i*15,end).map( x => x.symbol)
        $('#status').html('Getting prices for coins ' + (i*15+1) + ' to ' + end)
        getHistPrices(symbols, limit)
        i++
        if (i == numberOfCalls) { // number of coins to get hist data from 
            clearInterval(interv)
            setTimeout(function(){ 
                $('#status').html('Got historical data')
                console.log('Got historical data')
                // console.log(historicalPrices)
                prepareData();
            }, 1000)
        }
    }, 1500);  // wait a bit more than a second, 15 calls per second allowed
}

function getHistPrices(symbols, limit) {
    symbols = symbols.map( x => (x == 'MIOTA') ? 'IOT' : x )
    var limit = limit || 30; // days back
    var deferreds = []
    for (var key in symbols) {
        var symbol = symbols[key]
        deferreds.push($.get( 'https://min-api.cryptocompare.com/data/histoday', { "fsym" : symbol,  "tsym" : currency, "limit" : limit }))
    }
    $.when.apply(null, deferreds).done(function() {
        var prices = []
        if (arguments[0] instanceof Array) { // array of array, multiple ajax calls (more than 100 coins) have been made
            for( var i=0; i<arguments.length; i++ ){   
                data = arguments[i][0]
                if (data.Response == 'Success') {
                    // console.log(data.Data)
                    historicalPrices.push({ symbol : symbols[i], data: data.Data})
                } else {
                    console.log(data)
                }
            }
        } else {
            data = arguments[0]
            if (data.Response == 'Success') {
                // console.log(data.Data)
                historicalPrices.push({ symbol : symbols[0], data: data.Data})
            } else {
                console.log(data)
            } 
        }
    });
}

function prepareData() {         
    // console.log(historicalPrices)
    var normalized = $("#normalizePrices").is(":checked")
    var datasets = []
    for (var i=0; i < historicalPrices.length; i++) {
        var data = historicalPrices[i].data
        var labels = data.map( d => d.time*1000)
        var prices = data.map( d => d.close)
        var color = '#' + Math.floor(Math.random()*16777215).toString(16)
        var dataset = {}
        dataset.label = historicalPrices[i].symbol;
        var prices = data.map( d => d.close)
        var index = prices.findIndex(val => val > 0) // frist non-zero index
        prices = (normalized) ? prices.map( x => 100*x/prices[index]-100) : prices
        dataset.data = prices
        dataset.type = 'line'
        dataset.fill = false
        dataset.pointRadius = 2
        dataset.lineTension = 0 
        dataset.borderWidth = 2
        dataset.backgroundColor = color
        dataset.borderColor = color
        datasets.push(dataset)        
    }
    plotChart(labels, datasets)
}  

var myChart // must be global
function plotChart(labels, datasets) {
    if (myChart) {
        myChart.destroy();
    }
    var normalized = $("#normalizePrices").is(":checked")
    var cfg = {}
    cfg.type = 'line';
    cfg.data = {};
    cfg.data.labels = labels;
    cfg.data.datasets = datasets;
    cfg.options = {
        title: {
            display: true,
            fontSize: 14,
            text:  (normalized) ? 'Indexed coin prices':'Coin prices'
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    // format: timeFormat,
                    // round: 'day',
                    tooltipFormat: 'll'
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                display: true,
                // type: 'logarithmic',
                scaleLabel: {
                    display: true,
                    labelString: (normalized) ? 'Performance in %' : 'Value in ' + currency
                }, 
            }]
        },
    }
    var ctx = document.getElementById("myChart");
    myChart = new Chart(ctx, cfg);
}

$(document).ready(function () {    
    portfolio = new Proxy(localStorage, {
            get(target, name){
                var obj = JSON.parse(target.getItem(localStorage)) || {}
                return (name == 'object') ? obj : obj[name]
            },
            set(target, name, val) {
                var obj = JSON.parse(target.getItem(localStorage)) || {}
                if (name == 'object') {
                    target.setItem(localStorage, JSON.stringify(val));
                } else {
                    obj[name] = val
                    target.setItem(localStorage, JSON.stringify(obj));
                }
            },
            has(target, key) {
                 var obj = JSON.parse(target.getItem(localStorage)) || {}
                 return key in obj
            }, 
            deleteProperty(target, prop) {
                var obj = JSON.parse(target.getItem(localStorage)) || {}
                if (prop in obj) {
                    delete obj[prop];
                    target.setItem(localStorage, JSON.stringify(obj));
                    console.log(`property removed: ${prop}`);
                }
            }
        })
    
    $( "#updateChart" ).on('click', function() {
        var startDate = $('#startDate')[0].valueAsNumber
        var numberOfDays = Math.floor((Date.now()-startDate)/1000/60/60/24)
        numberOfDays = (numberOfDays < 1) ? 1 : numberOfDays
        var limit = $("#numberOfCoins")[0].value
        fetchHistoricalPrices(sortableCoinList.slice(0,limit), numberOfDays);
    });
    $( "#currency" ).on('change', function() {
        currency = $("#currency")[0].value;
        getMarketInfo();
    });
    
    $('#modalAdd button[name=apply]').on('click', function (e) {
        var amount = Number($('#modalAdd .modal-body input').val())
        var symbol = $('#modalAdd .modal-body select').val()
        if (amount != undefined && symbol != undefined) {
            dt = $('#tablePortfolio').DataTable();
            dt.row.add([coinList[symbol].rank, amount, coinList[symbol].name + ' (' + symbol + ')', symbol]);
            dt.draw();
            var data = dt.data().toArray().map( x => [x[1], x[3]]) // just return symbol and amount
            portfolio[symbol] = amount
        }
    })
    
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {   
        $("#portfolioInfo").hide();
        if (e.target.id == 'nav-overview-tab') {
            showOverview();          
        } else if (e.target.id == 'nav-definition-tab') {
            definePortfolio();
        } else if (e.target.id == 'nav-analysis-tab') {
            $("#portfolioInfo").show();
            analyzePortfolio();
        } else if (e.target.id == 'nav-performance-tab') {
        }
    })
    
    
    $('#tableOverview').DataTable({
        columns : [
            { title: "Rank" },
            { title: "Coin" },
            { title: "Price" },
            { title: "1h Change" },
            { title: "24h Change" },
            { title: "7d Change" },
            { title: "Market Share" }
        ],
        columnDefs: [{targets: [3,4,5],
                        render: function ( data, type, row ) {
                          if (type == "sort" || type == 'type')
                            return data
                          var color = 'black';
                          if (data > 0) {
                            data = '+' + data + '%'
                            color = 'green';
                          } 
                          if (data < 0) {
                            data = data + '%'
                            color = 'red';
                          }
                          return '<span style="color:' + color + '">' + data + '</span>';
                        }
                    },{targets: [2],
                        render: function ( data, type, row ) {
                          if (type == "sort" || type == 'type')
                            return data
                          return data.toLocaleString(locale,  { style: 'currency', currency: currency, maximumSignificantDigits : 4 });
                        }
                    },{targets: [6],
                        render: function ( data, type, row ) {
                          if (type == "sort" || type == 'type')
                            return data
                          return data.toLocaleString(locale,  { style: 'percent', maximumSignificantDigits : 2 });
                        }
                    }],
        dom: 'Blftrip',
        select: true,
        paging: false,
        order: [[ 0, "asc" ]],
        buttons: [
            {
                extend: 'collection',
                text: 'Export',
                buttons: [
                    'copy', 
                    'print',
                    'csv',
                    'excel', 
                    'pdf'
                ]
            }
        ]           
    });
    
    // dataTable Portfolio
    $('#tablePortfolio').DataTable({
        columns : [
            { title: "Rank" },
            { title: "Amount" },
            { title: "Name" },
            { title: "Symbol" }
        ],
        columnDefs: [{
                        "targets": [],
                        "visible": false
                    }],
        dom: 'Blftrip',
        select: true,
        paging: false,
        buttons: [
            {
                text: 'Add',
                action: function ( e, dt, node, config ) {
                    $('#modalAdd .modal-body').empty()
                    $('#modalAdd').modal()
                    var el = document.createElement('select');                   
                    for (var key in coinList) {
                        if (portfolio && !(key in portfolio)) {
                            el.options.add(new Option(key,key))
                        } 
                    } 
                    if (el.options.length) {
                        $('#modalAdd .modal-body').append(el)
                        $('#modalAdd .modal-body').append('<input type=number>')
                    } else {
                        $('#modalAdd .modal-body').html('All available coins are already in portfolio')
                        console.warn('All available coins are already in portfolio')
                    }
                }
            }, 
            {
                extend: 'selectedSingle',
                text: 'Delete',
                action: function ( e, dt, node, config ) {
                    var symbol = dt.row({ selected : true }).data()[3]
                    dt.row({ selected : true }).remove().draw();
                    console.log(symbol)
                    delete portfolio[symbol]
                }
            },             
            {
                extend: 'collection',
                text: 'Export',
                buttons: [
                    // 'colvis',
                    'copy', 
                    'print',
                    'csv',
                    'excel', 
                    'pdf',
                    {
                        text: 'Copy JSON',
                        action: function ( e, dt, node, config ) {
                            alert(JSON.stringify(portfolio.object))
                        }
                    }
                ]
            }
        ]           
    });
    
    $('#tableAnalysis').DataTable({
        columns : [
            { title: "Rank" },
            { title: "Amount" },
            { title: "Coin" },
            { title: "Portfolio Share" },
            { title: "Market Share" },
            { title: "Weight" }
        ],
        columnDefs:  [{targets: [3,4,5],
                        render: function ( data, type, row ) {
                          if (type == "sort" || type == 'type')
                            return data
                          return data = data + '%';
                        }
                    }],
        dom: 'lftrip',
        select: true,
        paging: false,      
    });  
    
    $('startDate').valueAsDate = new Date()
    $("#portfolioInfo").hide();
    getMarketInfo();
    feather.replace();
});