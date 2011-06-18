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
** Sell Window UI
** ------------------------------------------------------------------------
*/
var sellWindow = Titanium.UI.createView({
  height:300,
  top:122,
  width:320
});
  var sellRefresh = Titanium.UI.createImageView({
    image:"refreshButton.png",
    width:25,
    height:25,
    bottom:10,
    right:5
  });
    
  var sellAmount = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'amount to sell',
    height:44,
    width:175,  
    top:10,
    left:100,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var sellAmount_ = Titanium.UI.createImageView({
    image:"btc.png",
    width:32,
    height:32,
    top:14,
    right:224
  });  
  var sellPrice = Titanium.UI.createTextField({
    color:'#336699',
    value:''+realSubtraction(ticker.buy,0.00001),
    height:44,
    width:175,
    top:50,
    left:100,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var sellPrice_ = Titanium.UI.createLabel({
    color:'#009',
    text:'@',
    font:{fontSize:22,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    top:54,
    right:256
  });    
  var sellPrice__ = Titanium.UI.createImageView({
    image:"usd.png",
    width:32,
    height:32,
    right:224,
    top:54
  });
  var sellTotal = Titanium.UI.createLabel({
    color:'#009',
    text:'Total',
    font:{fontSize:22,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    top:92,
    right:224
  });  
  var sellTotal_ = Titanium.UI.createLabel({
    color:'#009',
    text:'$'+realMultiplication(sellAmount.value,sellPrice.value),
    font:{fontSize:22,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    top:92,
    right:45
  });  
  var sellMtgox = Titanium.UI.createLabel({
    color:'#009',
    text:'Mt Gox charges a small fee (0.65%) for each trade.',
    font:{fontSize:10,fontFamily:'Arial'},
    width:300,
    textAlign:'center',
    bottom:10,
    left:10
  });
  var sellNow = Titanium.UI.createButton({
    backgroundImage:"button.png",
    color:"#333",
    textAlign:'center',
    height:39,
    width:144,
    title:"sell bitcoins",
    font:{fontFamily:'Arial',fontWeight:'bold'},
    right:45,
    top:124
  });
sellWindow.add(sellAmount);
sellWindow.add(sellPrice);
sellWindow.add(sellTotal);
sellWindow.add(sellAmount_);
sellWindow.add(sellPrice_);
sellWindow.add(sellPrice__);
sellWindow.add(sellMtgox);
sellWindow.add(sellTotal_);
sellWindow.add(sellNow);

/* ------------------------------------------------------------------------
** Sell Window Interactions
** ------------------------------------------------------------------------
*/
sellNow.addEventListener('click',function(e) {									// sell order
  actInd.message="Selling Bitcoins";
  actInd.show();																// show loading indicator

  sellX = Titanium.Network.createHTTPClient();									// new HTTP client
  sellX.open('POST',sites.sellBTC);  											// open sell page
  sellX.onload = function () {													// on http response
    if(this.status == '200') {													// http status 200 OK
      if(this.readyState == 4) {    											// xhr ready state 4
        var response=JSON.parse(this.responseText);								// parse json
        if(response.error!=null) {												// if there is an error
          actInd.hide();														// hide the indicator
          alertDialog("Error", response.error);									// report the error
        }
        else {																	// otherwise
          setOrders(response);													// set session orders
          setBalance(response);													// set session balance
          homeClick(0);															// goto home window
          actInd.hide();														// hide loading indicator
          alertDialog("Sell Order",response.status);							// let them know it went well.
        }
      }
    }
    actInd.hide();																// hide rogue indicator
  };
  sellX.send({name:username.value,pass:password.value,amount:sellAmount.value,price:sellPrice.value});
});
sellAmount.addEventListener('blur',function(e) {								// update total
  sellTotal_.text='$'+realMultiplication(sellAmount.value,sellPrice.value);
});
sellPrice.addEventListener('blur',function(e) {									// update total
  sellTotal_.text='$'+realMultiplication(sellAmount.value,sellPrice.value);
});
sellRefresh.addEventListener('click',function(e) {								// reload sell window
  reloadAll(2);
});
