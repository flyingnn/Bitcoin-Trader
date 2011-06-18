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
** depth view UI (2 windows for now)
** ------------------------------------------------------------------------
*/
var depthWindow = Titanium.UI.createView({
  height:300,
  top:122,
  width:320
});
  var depthRefresh = Titanium.UI.createImageView({
    image:"refreshButton.png",
    width:25,
    height:25,
    bottom:10,
    right:5
  });
  var depthTable= Titanium.UI.createTableView({
    data:"",
    top:0,
    height:300
  });
depthWindow.add(depthTable);


/* ------------------------------------------------------------------------
** depth view interactions
** ------------------------------------------------------------------------
*/
function getDepth() {  																	// get the depth
  depth=[];																				// clear session depth
  actInd.message="Loading Depth";
  actInd.show();																		// Show loading indicator
  depthX = Titanium.Network.createHTTPClient();											// create new HTTP client
  depthX.open("POST",sites.getDepth);													// open getDepth page
  depthX.onload = function() {															// on HTTP response
    if(this.status=='200') {															// HTTP Status 200 OK
      if(this.readyState == 4) {
        var response = JSON.parse(this.responseText);									// parse JSON response
        var maxBids=(response.bids.length>DEPTH_MAX?DEPTH_MAX:response.bids.length);	// Either get DEPTH_MAX or the amt of bids
        var maxAsks=(response.asks.length>DEPTH_MAX?DEPTH_MAX:response.asks.length);	// same but for asks
        for(i=maxBids-1;i>=0;i--) {														// loop through bids till maxBids (backwards)
          actInd.message="Loading Depth\n"+Math.round((((maxBids-1)-i)/(maxBids+maxAsks))*100)+"%";	// Update loading %
          var depthRow = Titanium.UI.createTableViewRow({								// Begin UI
              backgroundColor:"#cce"
          });
          var dType = Titanium.UI.createLabel({
            text:"Bid",
            top:7,
            left:0,
            font:{fontSize:20},              
            width:40,
            textAlign:'right',
            color:'#000',      
            height:'auto'
          });
          var dPrice = Titanium.UI.createLabel({
            text:"$"+response.bids[i][0],
            top:7,
            left:60,
            font:{fontSize:20},
            color:'#000',
            height:'auto'
          });
          var dAmount = Titanium.UI.createLabel({
            text:response.bids[i][1],
            top:7,
            left:190,
            font:{fontSize:20},
            color:'#000',
            height:'auto'
          });
          depthRow.add(dType);
          depthRow.add(dPrice);
          depthRow.add(dAmount);
          depthRow.className = 'depth_row';
          depth.push(depthRow);															// Add row, rinse repeat.
        }        
        for(i=0;i<maxAsks;i++) {														// Loop through asks till maxAsks
          actInd.message="Loading Depth\n"+Math.round((i+maxBids)/(maxBids+maxAsks)*100)+"%";	// Update %
          var depthRow = Titanium.UI.createTableViewRow({								// Begin UI
              backgroundColor:"#fff"
          });
          var dType = Titanium.UI.createLabel({
            text:"Ask",
            top:7,
            left:0,
            font:{fontSize:20},              
            width:40,
            textAlign:'right',
            color:'#000',      
            height:'auto'
          });
          var dPrice = Titanium.UI.createLabel({
            text:"$"+response.asks[i][0],
            top:7,
            left:60,
            font:{fontSize:20},
            color:'#000',
            height:'auto'
          });
          var dAmount = Titanium.UI.createLabel({
            text:response.asks[i][1],
            top:7,
            left:190,
            font:{fontSize:20},
            color:'#000',
            height:'auto'
          });
          depthRow.add(dType);
          depthRow.add(dPrice);
          depthRow.add(dAmount);
          depthRow.className = 'depth_row';
          depth.push(depthRow);															// push to depth session data
        }        
        if(gotDepth==0) {																// Let the app know we have data
          gotDepth=1;																	// right here.
        }
        depthTable.data=depth;															// update UI
        actInd.hide();																	// hide indicator
      }  
    }
    actInd.hide();																		// hide indicator (rogue)
  };
  depthX.send();																		// send HTTP request for depth
}
depthRefresh.addEventListener('click',function(e) {										// on refresh click
  getDepth();																			// get Depth
});