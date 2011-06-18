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
** Buy Window UI
** ------------------------------------------------------------------------
*/
var buyWindow = Titanium.UI.createView({
  height:300,
  top:122,
  width:320
});
  var buyRefresh = Titanium.UI.createImageView({
    image:"refreshButton.png",
    width:25,
    height:25,
    bottom:10,
    right:5
  });  
  var buyAmount = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'amount to buy',
    height:44,
    width:175,
    top:10,
    left:100,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var buyAmount_ = Titanium.UI.createImageView({
    image:"btc.png",
    width:32,
    height:32,
    top:14,
    right:224
  });  
  var buyPrice = Titanium.UI.createTextField({
    color:'#336699',
    value:''+realAddition(ticker.sell,0.00001),
    height:44,
    width:175,
    top:50,
    left:100,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var buyPrice_ = Titanium.UI.createLabel({
    color:'#009',
    text:'@',
    font:{fontSize:22,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    top:54,
    right:256
  });  
  var buyPrice__ = Titanium.UI.createImageView({
    image:"usd.png",
    width:32,
    height:32,
    right:224,
    top:54
  });   
  var buyTotal = Titanium.UI.createLabel({
    color:'#009',
    text:'Total',
    font:{fontSize:22,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    top:92,
    right:224
  });  
  var buyTotal_ = Titanium.UI.createLabel({
    color:'#009',
    text:'$'+realMultiplication(buyAmount.value,buyPrice.value),
    font:{fontSize:22,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    top:92,
    right:45
  });  
  var buyMtgox = Titanium.UI.createLabel({
    color:'#009',
    text:'Mt Gox charges a small fee (0.65%) for each trade.',
    font:{fontSize:10,fontFamily:'Arial'},
    width:300,
    textAlign:'center',
    bottom:10,
    left:10
  });
  var buyNow = Titanium.UI.createButton({
    backgroundImage:"button.png",
    color:"#333",
    textAlign:'center',
    height:39,
    width:144,
    title:"buy bitcoins",
    font:{fontFamily:'Arial',fontWeight:'bold'},
    right:45,
    top:124
  });
    
buyWindow.add(buyAmount);
buyWindow.add(buyPrice);
buyWindow.add(buyTotal);
buyWindow.add(buyAmount_);
buyWindow.add(buyPrice_);
buyWindow.add(buyPrice__);
buyWindow.add(buyMtgox);
buyWindow.add(buyTotal_);
buyWindow.add(buyNow);


/* ------------------------------------------------------------------------
** Buy Window Interactions
** ------------------------------------------------------------------------
*/
buyNow.addEventListener('click',function(e) {									// buy click
  actInd.message="Buying Bitcoins";
  actInd.show();																// show loading indicator

  buyX = Titanium.Network.createHTTPClient();									// new HTTP client
  buyX.open('POST',sites.buyBTC);  												// open buy btc page
  buyX.onload = function () {													// on http response
    if(this.status == '200') {													// http status 200 ok
      if(this.readyState == 4) {
        var response=JSON.parse(this.responseText);								// parse json
        if(response.error!=null) {												// if error
          actInd.hide();														// hide loading indicator
          alertDialog("Error", response.error);									// let them know the error
        }
        else {
          setOrders(response);													// set orders
          setBalance(response);													// set balance
          homeClick(0);															// goto home screen
          actInd.hide();														// hide loading indicator
          alertDialog("Buy Order",response.status);								// let them know the success
        }
      }
    }
    actInd.hide();																// close rogue indicator
  };
  buyX.send({name:params.name,pass:params.pass,amount:buyAmount.value,price:buyPrice.value});  
});
buyAmount.addEventListener('blur',function(e) {									// update total
  buyTotal_.text='$'+realMultiplication(buyAmount.value,buyPrice.value);
});
buyPrice.addEventListener('blur',function(e) {									// update total
  buyTotal_.text='$'+realMultiplication(buyAmount.value,buyPrice.value);
});
buyRefresh.addEventListener('click',function(e) {								// reload buy page
  reloadAll(2);
});
  