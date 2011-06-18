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
** Withdraw Globals
** ------------------------------------------------------------------------
*/
var btcaddress=0;															// holds the bitcoin address



/* ------------------------------------------------------------------------
** Withdraw UI
** ------------------------------------------------------------------------
*/
var withdrawWindow = Titanium.UI.createView({
  height:300,
  top:122,
  width:320
});
  var withdrawRefresh = Titanium.UI.createImageView({
    image:"refreshButton.png",
    width:25,
    height:25,
    bottom:10,
    right:5
  });
  var withdrawPowered = Titanium.UI.createLabel({
    color:'#009',
    text:'Powered by btc.to',
    font:{fontSize:10,fontFamily:'Arial'},
    width:300,
    textAlign:'center',
    bottom:10,
    left:10
  });
  var withdrawAmount = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'amount to send',
    height:44,
    width:175,
    top:10,
    left:100,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var withdrawAmount_ = Titanium.UI.createImageView({
    image:'btc.png',
    top:16,
    width:32,
    height:32,
    right:224
  });  
  var withdrawAddress = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'',
    height:44,
    width:175,
    top:50,
    left:100,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var withdrawAddress_ = Titanium.UI.createLabel({
    color:'#009',
    text:'btc.to/',
    font:{fontSize:18,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    top:54,
    right:224
  });
  var withdrawNow = Titanium.UI.createButton({
    backgroundImage:"button.png",
    color:"#333",
    textAlign:'center',
    height:39,
    width:144,
    title:"send bitcoins",
    font:{fontFamily:'Arial',fontWeight:'bold'},
    right:45,
    top:104
  });
withdrawWindow.add(withdrawAmount);
withdrawWindow.add(withdrawAddress);
withdrawWindow.add(withdrawAmount_);
withdrawWindow.add(withdrawAddress_);
withdrawWindow.add(withdrawPowered);
withdrawWindow.add(withdrawNow);


/* ------------------------------------------------------------------------
** Withdraw Actions
** ------------------------------------------------------------------------
*/
function doWithdrawal() {														// do withdraw
  withdrawX = Titanium.Network.createHTTPClient();								// new HTTP client
  withdrawX.open("GET","http://btc.to/"+withdrawAddress.value+"");				// ask for btc.to resolution
  withdrawX.setRequestHeader("Content-Type","text/html");						// set to text/html type talk
  withdrawX.onload = function() {												// on response
    if(withdrawX.status=='200') {												// HTTP status 200 OK
      if(withdrawX.readyState == 4) {											// 4
      var response=withdrawX.responseText;										// save response in a temporary var
        if(response.length==0) {												// invalid address?
          alertDialog("Error","Invalid Address");								// let em know
        }
        else if(response.length>0) {											// otherwise
          btcaddress=(response.length>10?response.trim():addy.trim());			// set the address to either the response or keep it if it is a real addy anyway
          var alert = Titanium.UI.createAlertDialog({ title: 'Send', message: 'Send '+withdrawAmount.value+'฿ to '+btcaddress+'?', buttonNames: ['Yes', 'No'], cancel: 1 });
          alert.addEventListener('click', function(ev) {
            if (!(ev.cancel === ev.index || ev.cancel === true)) {
              switch (ev.index) {
                case 0: actInd.message="Withdrawing Bitcoins";					// show loading indicator
                        actInd.show();
                        withdraw2X = Titanium.Network.createHTTPClient();		// new http client
                        withdraw2X.open('POST',sites.withdraw);  				// ask for withdraw
                        withdraw2X.onload = function () {						// on http response
                          if(withdraw2X.status == '200') {						// status 200 OK
                            if(withdraw2X.readyState == 4) {
                              var response=JSON.parse(withdraw2X.responseText);	// parse json response
                              if(response.error!=null) {						// error?
                                actInd.hide();									// hide indicator
                                alertDialog("Error", response.error);			// let em know
                              }
                              else {
                                setBalance(response);							// set balance
                                homeClick(0);									// go home
                                actInd.hide();									// hide indicator
                                alertDialog("Send Bitcoins",response.status);	// let them know the success
                              }
                            }
                          }
                          actInd.hide();										// hide rogue indicator
                        };
                        withdraw2X.send({name:params.name,pass:params.pass,amount:withdrawAmount.value,btca:btcaddress.trim(),group1:"BTC"});    
                        break;
                case 1:
                        break;
                default:
                        break;
              }
            }
          });
          alert.show();
        }
      }
    }
  };
  withdrawX.send();
}  
withdrawNow.addEventListener('click',function(e) {							// on withdraw
  doWithdrawal();
});
withdrawRefresh.addEventListener('click',function(e) {						// on refresh
  reloadAll(2);																// reload function 2
});
