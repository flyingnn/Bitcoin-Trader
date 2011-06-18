/*
** Bitcoin Trader by MtGox Live <http://mtgoxlive.com/>
** Copyright (c) 2011 MtGox Live <http://mtgoxlive.com/>
**
** Authors
** rasengan on irc.freenode.net - btc.to/2
**
** Please visit us at http://mtgoxlive.com/ and IRC.Freenode.Net #MtGoxLive
**
** This file is part of Bitcoin Trader by MtGox Live <http://mtgoxlive.com/>
**
** Bitcoin Trader by MtGox Live is free software: you can redistribute it
** and/or modify it under the terms of the GNU General Public License as
** published by the Free Software Foundation, either version 3 of the
** License, or (at your option) any later version.
**
** Bitcoin Trader by MtGox Live  is distributed in the hope that it will
** be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with Bitcoin Trader by MtGox Live.  If not,
** see <http://www.gnu.org/licenses/>.
**
*/

/*
** Third party helper functions
*/
Ti.include("strip_tags.js");									// This file includes its own license information.
Ti.include("date.format.js");									// This file includes its own license information.




/* ------------------------------------------------------------------------
** Constants
** ------------------------------------------------------------------------
*/
var DEPTH_MAX=75;												// Maximum # of Bids and Maximum # of Asks to Display (75+75 = 150 total records) -- set this to 100000000000 to get all of the bid/asks.
var BTC_DECIMAL=8;												// How many Decimals do we care about?  
var VERSION_NUMBER=1.2;											// Current release version

var sites = {
  getFunds:"https://mtgox.com/code/getFunds.php",				// get balance (unused)
  getOrders:"https://mtgox.com/code/getOrders.php",				// get balance and order list
  buyBTC:"https://mtgox.com/code/buyBTC.php",					// buy btc
  sellBTC:"https://mtgox.com/code/sellBTC.php",					// sell btc
  cancelOrder:"https://mtgox.com/code/cancelOrder.php",			// cancel order
  withdraw:"https://mtgox.com/code/withdraw.php",				// withdraw (send to btc address)
  ticker:"https://mtgox.com/code/data/ticker.php",				// get ticker data
  getDepth:"https://mtgox.com/code/data/getDepth.php",			// get depth / trade book
  getTrades:"https://mtgox.com/code/data/getTrades.php",		// get all recent trades
  login:"https://mtgox.com/code/login.php",						// login and get a cookie set
  register:"https://mtgox.com/code/register.php",				// register account
  sendPassReset:"https://mtgox.com/code/sendPassReset.php",		// reset password
  logout:"https://mtgox.com/code/logout.php",					// logout and unset cookie
  getActivity:"https://mtgox.com/code/user/getActivity.php",	// user account history
  send:"https://mtgox.com/code/user/send.php"					// transfer (send btc/usd to email)
};



	

/* ------------------------------------------------------------------------
** Session Data (purged on exit)
** ------------------------------------------------------------------------
*/
var gotHistory=0;												// Is the history loaded?
var gotDepth=0;													// Is the depth data loaded?
var activeWindow="";											// active Window/View
var activeLink="";												// active Menu link 
var activeRefresh="";											// active Refresh button (Diff for each window)
var noBG=false;													// don't set BG to menu item

var myCurrentView="";											// current view inside the "login/topwindow area"


var params = {													// User and Pass (set by loginWindow.js)
  name: 0,
  pass: 0
};
var balance = {													// Session Balance (set by setBalance)
  btcs: 0,
  usds: 0
};
var ticker = {													// Session Ticker (set by setTicker)
  high: 0,
  low: 0,
  vol: 0,
  buy: 0,
  sell: 0,
  last: 0
};
var orders = [];												// Session Orders (set by setOrders)
var history = [];												// Session History (set by historyWindow.js)
var depth = [];												// Trade depth (set by depthWindow.js)

// These functions are used in conjunction with JSON.parse'd responses (see buyWindow.js, etc.)
function setTicker(response) {
  if(typeof(response.ticker)!="undefined") {
    ticker.high=(typeof(response.ticker.high)!="undefined" ? response.ticker.high:ticker.high);
    ticker.low=(typeof(response.ticker.low)!="undefined" ? response.ticker.low:ticker.low);
    ticker.vol=(typeof(response.ticker.vol)!="undefined" ? response.ticker.vol:ticker.vol);
    ticker.buy=(typeof(response.ticker.buy)!="undefined" ? response.ticker.buy:ticker.buy);
    ticker.sell=(typeof(response.ticker.sell)!="undefined" ? response.ticker.sell:ticker.sell);
    ticker.last=(typeof(response.ticker.last)!="undefined" ? response.ticker.last:ticker.last);
  }
}
function setBalance(response) {
  if(typeof(response.btcs)!="undefined" && response.btcs!=null) {
    balance.btcs=response.btcs;
    balance.usds=response.usds;
  }
}
function setOrders(response) {
  if(typeof(response.orders)!="undefined" && response.orders!=null) {
    orders=[];
    for(var i in response.orders) {
        orders[i]=response.orders[i];
    }
  }
}

// Updates the main UI data (balance and ticker)
function reloadMain() {
  if(typeof(params.name)!="undefined" && params.name!=null) {
    balanceUser.text=params.name;
  }
  if(typeof(ticker.last)!="undefined" && ticker.last!=null) {
    tickerLast_.text="$"+ticker.last;
  }
  if(typeof(ticker.high)!="undefined" && ticker.high!=null) {
    tickerHigh_.text="$"+ticker.high;
  }
  if(typeof(ticker.vol)!="undefined" && ticker.vol!=null) {
    tickerVol_.text=ticker.vol;
  }
  if(typeof(ticker.low)!="undefined" && ticker.low!=null) {
    tickerLow_.text="$"+ticker.low;
  }
  if(typeof(balance.btcs)!="undefined" && balance.btcs!=null) {
    balanceInfoBTC.text=balance.btcs + " BTC";
  }
  if(typeof(balance.usds)!="undefined"  && balance.usds!=null) {
    balanceInfoUSD.text=balance.usds + " USD";
  }
}

// function updates buy price
function reloadBuy() {
  if(typeof(ticker.sell)!="undefined" && ticker.sell!=null) {
    buyPrice.value=''+realAddition(ticker.sell,0.00001);
  }
}

// function update sell price
function reloadSell() {
  if(typeof(ticker.buy)!="undefined" && ticker.buy!=null) {
    sellPrice.value=''+realSubtraction(ticker.buy,0.00001);
  }
}

/// reload orders
function reloadOrders() {
  if(typeof(orders)!="undefined" && orders!=null) {
    orderTable.data=createData(orders);
  }
}

/* ------------------------------------------------------------------------
** Default Background Color
** ------------------------------------------------------------------------
*/
Titanium.UI.setBackgroundColor('#fff');




/* ------------------------------------------------------------------------
** Please wait/Loading Indicator
** ------------------------------------------------------------------------
*/
var actInd = Titanium.UI.createActivityIndicator({
    height:50,
    width:10
});





/* ------------------------------------------------------------------------
** Helper Functions
** ------------------------------------------------------------------------
*/

/* alertDialog(title, message)
** just an alias for Titanium.UI.createAlertDialog().show()
*/
function alertDialog(t,er) {
  Titanium.UI.createAlertDialog({
    title: t,
    message: strip_tags(er),
    buttonNames: ['Return']
  }).show();
}

/* stringDate(unix timestamp)
** convert unix timestamp to a string
*/
function stringDate(d) {
  return dateFormat(new Date(d*1000),"mm/dd/yy HH:MM");
}

/* realMathOperations(left, right)
** Make javascript work with money.  Thanks coderrr
*/
function realAddition(x1,x2) {
  n=(x1 + x2).toFixed(BTC_DECIMAL);
  while(n.match(/\..+$/)[0].length > 3 && n.match(/0$/))  n = n.replace(/0$/,'')
  return n;
}
function realMultiplication(x1,x2) {
  n=(x1 * x2).toFixed(BTC_DECIMAL);
  while(n.match(/\..+$/)[0].length > 3 && n.match(/0$/))  n = n.replace(/0$/,'')
  return n;
}
function realSubtraction(x1,x2) {
  n=(x1 - x2).toFixed(BTC_DECIMAL);
  while(n.match(/\..+$/)[0].length > 3 && n.match(/0$/))  n = n.replace(/0$/,'')
  return n;
}



/* ------------------------------------------------------------------------
** The app files
** ------------------------------------------------------------------------
*/
// Excuse the wording, these are all actually Views (see Titanium API CreateView)

// Not Logged in
Ti.include("registerWindow.js");  		// User Registration
Ti.include("passwordWindow.js");		// Forgot Password
Ti.include("loginWindow.js");			// Login Window

// Logged in
Ti.include("homeWindow.js");			// Home/Orders Wnidow
Ti.include("buyWindow.js");				// Buy Window
Ti.include("historyWindow.js");			// History Window
Ti.include("sellWindow.js");			// Sell Window
Ti.include("depthWindow.js");			// Depth Window
Ti.include("withdrawWindow.js");		// Withdraw Window
Ti.include("updates.js");				// Updates (Reloads All Data)

// Main Windows
Ti.include("mainMenu.js");				// Main Menu
Ti.include("mainWindow.js");			// Logged in
Ti.include("topWindow.js");				// Not logged in



