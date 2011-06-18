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
** history view UI
** ------------------------------------------------------------------------
*/
var historyWindow = Titanium.UI.createView({
  height:300,
  top:122,
  width:320
});
  var historyRefresh = Titanium.UI.createImageView({
    image:"refreshButton.png",
    width:25,
    height:25,
    bottom:10,
    right:5
  });
  var historyTable= Titanium.UI.createTableView({
    data:"",
    top:0,
    height:300
  });
historyWindow.add(historyTable);


/* ------------------------------------------------------------------------
** history window interactions
** ------------------------------------------------------------------------
*/
function getHistory() {													// Retrieve Session History
  actInd.message="Loading History";
  actInd.show();            											// Loading indicator
  historyX = Titanium.Network.createHTTPClient();						// new HTTP client
  historyX.open('POST',sites.login);									// First we login to get a cookie
  historyX.onload = function () {										// On HTTP response
    if(historyX.status == '200') {											// HTTP Status 200 OK
      if(historyX.readyState == 4) {										// xhr
        var response=JSON.parse(historyX.responseText);						// Parse response (JSON)
        if(response.error!=null) {										// if error
          actInd.hide();												// hide loading indicator
          alertDialog("Error", response.error);							// Let em know what happened
        }
        else {															// Otherwise let's get the history
          history=[];													// clear current history contents
          history2X = Titanium.Network.createHTTPClient();				// Open new HTTP client
          history2X.open("POST",sites.getActivity);						// we will get the history activity data
          history2X.onload = function() {								// On HTTP response
            if(history2X.status=='200') {									// HTTP Status 200 OK
              if(history2X.readyState == 4) {								// xhr
                var response=JSON.parse(history2X.responseText);      		// Parse response (JSON)
                if(typeof(response.aaData)!="undefined") {				// if the data is not empty
                  var txns=response.aaData;								// store data in temp var for easier access
                  var g=true;											// g = ground = background indicator (for color)
                  for(i=txns.length-1;i>=0;i--) {						// loop backwards throught he list
                    actInd.message="Loading History\n"+Math.round(((txns.length-i)/txns.length)*100)+"%";	// Update status indicator % completion

					/*
					** UI for History Row
					*/
                    var historyRow = Titanium.UI.createTableViewRow({
                      backgroundColor:(g?"#cce":"#fff")
                    });
                    g=(g?false:true);									// toggle g
          

                    var hWhen = Titanium.UI.createLabel({
                      text:txns[i][0].replace(" ","\n"),
                      top:7,
                      left:0,
                      font:{fontSize:8},              
                      width:40,
                      textAlign:'right',
                      color:'#000',      
                      height:'auto'
                    });
                    var hType = Titanium.UI.createLabel({
                      text:txns[i][1],
                      top:18,
                      right:2,
                      width:'auto',
                      font:{fontSize:10,fontWeight:'bold'},
                      textAlign:'left',
                      color:'#000',      
                      height:'auto'
                    });
                    var hDesc = Titanium.UI.createLabel({
                      text:txns[i][2],
                      top:6,
                      left:44,
                      width:'auto',
                      font:{fontSize:10,fontWeight:'bold'},
                      textAlign:'left',
                      color:'#000',      
                      height:'auto'
                    });
                    var hDelta = Titanium.UI.createLabel({
                      text:'∆',
                      top:18,
                      left:44,
                      width:'auto',
                      font:{fontSize:8,fontWeight:'bold'},
                      textAlign:'left',
                      color:'#000',      
                      height:'auto'
                    });
                    var hDeltaBTC = Titanium.UI.createLabel({
                      text:'฿ '+txns[i][3],
                      top:18,
                      left:52,
                      width:80,
                      font:{fontSize:8},
                      textAlign:'left',
                      color:'#000',      
                      height:'auto'
                    });
                    var hDeltaUSD = Titanium.UI.createLabel({
                      text:'$ ' + txns[i][4],
                      top:28,
                      left:52,
                      width:80,
                      font:{fontSize:8},
                      textAlign:'left',
                      color:'#000',      
                      height:'auto'
                    });            
                    var hTotal = Titanium.UI.createLabel({
                      text:'Total',
                      top:18,
                      left:144,
                      width:'auto',
                      font:{fontSize:8,fontWeight:'bold'},
                      textAlign:'left',
                      color:'#000',      
                      height:'auto'
                    });
                    var hTotalBTC = Titanium.UI.createLabel({
                      text:"฿" + txns[i][5],
                      top:18,
                      left:165,
                      width:80,
                      font:{fontSize:8},
                      textAlign:'left',
                      color:'#000',      
                      height:'auto'
                    });
                    var hTotalUSD = Titanium.UI.createLabel({
                      text:"$" + txns[i][6],
                      top:28,
                      left:165,
                      width:80,
                      font:{fontSize:8},
                      textAlign:'left',
                      color:'#000',      
                      height:'auto'
                    });            
                    historyRow.add(hWhen);
                    historyRow.add(hType);
                    historyRow.add(hDesc);
                    historyRow.add(hDelta);
                    historyRow.add(hDeltaBTC);
                    historyRow.add(hDeltaUSD);            
                    historyRow.add(hTotal);
                    historyRow.add(hTotalBTC);
                    historyRow.add(hTotalUSD);
                    historyRow.className = 'history_row';
                    
                    history.push(historyRow);								// push this into the history[]
                  }
                  if(gotHistory==0) {										// If this is the first time
                    gotHistory=1;											// Save the fact that we have history now
                  }
                  actInd.hide();											// hide loading indicator
                  historyTable.data=history;								// put the data on the UI
                  var ost = Titanium.Network.createHTTPClient();			// Open new HTTP client
                  ost.open("POST",sites.logout);							// Logout
                  ost.send();          										// send request
                }
              }
            }
            actInd.hide();    												// hide rogue indicators
          };
          history2X.send();													// send get history cmd
        }
      }
    }
  };
  historyX.send(params);													// send login cmd
}
historyRefresh.addEventListener('click',function(e) {						// on refresh
  getHistory();
});
      