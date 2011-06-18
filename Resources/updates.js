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

/* ------------------------------------------------------------------------
** Reload Everything (except for depth and history)
** ------------------------------------------------------------------------
*/
function reloadAll(reloadFunction) {
  if(reloadFunction != 3) {														// If it's not our first reload...
    actInd.message="Reloading";
    actInd.show();																// Show loading indicator
  }
  reloadX = Titanium.Network.createHTTPClient();								// create HTTP client
  reloadX.open('POST',sites.ticker);											// open a Ticker post
  reloadX.onload = function() {													// on HTTP response
    if(this.status == '200') {													// http status 200 OK
      if(this.readyState == 4) {
        var response=JSON.parse(this.responseText);								// parse json response
        if(response.error!=null) {												// if there is an error
          actInd.hide();														// hide loading indicator
          alertDialog("Error", response.error);									// let them know what happened
        }
        else {																	// otherwise
          setTicker(response);													// set ticker data
          if(reloadFunction==2) {												// if reload function level 2
            reloadMain();														// reload ticker
            reloadBuy();														// reload buy price
            reloadSell();														// reload sell price
            actInd.hide();														// hide loading indicator
          }
          else {																// if reload function level 1
            reload2X = Titanium.Network.createHTTPClient();						// create HTTP client
            reload2X.open('POST',sites.getOrders);								// get Orders data
            reload2X.onload = function() {										// on http response
              if(this.status=='200') {											// HTTP status 200 OK
                if(this.readyState == 4) {
                  var response=JSON.parse(this.responseText);					// parse json response
                  if(response.error!=null) {									// if there is an error
                    actInd.hide();												// hide loading indicator
                    alertDialog("Error",response.error);						// let them know what happened
                  }
                  else {														// otherwise..
                    setBalance(response);										// set balance
                    setOrders(response);										// set orders
                    reloadMain();												// reload ticker
                    reloadBuy();												// reload buy price
                    reloadSell();												// reload sell price
                    reloadOrders();												// reload orders table
                    actInd.hide();												// hide loading indicator
                  }
                }
              }
            };
            reload2X.send(params);												// send second ask (reload function 1)
          }
        }
      }
    }
  };
  reloadX.send();																// send primary ask (reload function 2)
}
