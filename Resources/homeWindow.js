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
** Home Window UI
** ------------------------------------------------------------------------
*/
var homeWindow = Titanium.UI.createView({
  height:300,
  top:122,
  width:320
});
  var homeRefresh = Titanium.UI.createImageView({
    image:"refreshButton.png",
    width:25,
    height:25,
    bottom:10,
    right:5
  });
  var orderTable= Titanium.UI.createTableView({
    data:"",
    top:0,
    height:300
  });
  homeWindow.add(orderTable);


/* ------------------------------------------------------------------------
** Home Window Interactions
** ------------------------------------------------------------------------
*/
homeRefresh.addEventListener('click',function(e) {									// Reload Home
  reloadAll(1);
});

function delete_order(myoid,mytype) {												// Cancel Order
  actInd.message="Deleting Order";
  actInd.show();																	// Show loading indicator

  deleteX = Titanium.Network.createHTTPClient();									// New HTTP Client
  deleteX.open('POST',sites.cancelOrder);											// Open cancel page
  deleteX.onload = function () {													// on HTTP response
    if(this.status == '200') {														// on HTTP status 200
      if(this.readyState == 4) {
        var response=JSON.parse(this.responseText);									// parse json
        if(response.error!=null) {													// if error
          actInd.hide();															// hide loading indicator
          alertDialog("Error", response.error);										// show them what happened
        }
        else {																		// otherwise
          setBalance(response);														// set our session balance
          setOrders(response);														// set our session orders
          reloadMain();																// reload main/ticker
          reloadOrders();															// reload orders
          actInd.hide();      														// hide indicator
        }
      }
    }
    actInd.hide();																	// hide the rogue indicator
  };
  deleteX.send({name:username.value,pass:password.value,oid:myoid,type:mytype});	// send delete cmd
}

function createData() {																// create the data table
  var data=[];																		// temporary array to return
  for(i=0;i<orders.length;i++) {													// for all orders
    var myOid=orders[i].oid;														// set the oid
    var myType=orders[i].type;														// set the type
    var orderRow = Titanium.UI.createTableViewRow({									// ********* START UI ********
      backgroundColor:(orders[i].status==2?'#f00':'#fff')
    });
    var orderType = Titanium.UI.createImageView({
      image:(orders[i].type==1 ? "usd.png" : "btc.png"),
      width:32,
      height:32,
      left:0,
      top:8
    });
    var orderTotal = Titanium.UI.createLabel({
      text:(orders[i].type==1 ? "$" : "$") + realMultiplication(orders[i].amount,orders[i].price),
      font:{fontSize:16,fontWeight:'bold'},
      width:'auto',
      textAlign:'right',
      color:'#000',
      top:8,
      right:4,
      height:'auto'
    });
    var orderSubtitle = Titanium.UI.createLabel({
      text:(orders[i].type==1 ? "Sell ฿" : "Buy ฿") + orders[i].amount + " for $" + orders[i].price,
      font:{fontSize:14,fontWeight:'bold'},
      width:200,
      color:'#000',
      textAlign:'left',
      top:9,
      left:34,
      height:'auto'
    });
    var orderDate = Titanium.UI.createLabel({
      text:"Placed " + stringDate(orders[i].date),
      top:25,
      left:34,
      width:'auto',
      font:{fontSize:10},
      textAlign:'right',
      color:'#000',    
      height:'auto'
    });
    orderRow.add(orderType);
    orderRow.add(orderTotal);
    orderRow.add(orderSubtitle);
    orderRow.add(orderDate);
    orderRow.className = 'order_row';
    data.push(orderRow);															// Add row to array
    data[i].addEventListener('click',function(e) {									// on Row click
      var alert = Titanium.UI.createAlertDialog({ title: 'Delete', message: 'Are you sure you want to delete this order?', buttonNames: ['Delete', 'Cancel'], cancel: 1 });
      alert.addEventListener('click', function(ev) {								// Check yes or no...
        if (!(ev.cancel === ev.index || ev.cancel === true)) {
          switch (ev.index) {
            case 0:  delete_order(orders[e.index].oid,orders[e.index].type);		// If yes we delete.
                     break;
            case 1:
                     break;
            default:
                     break;
          }
        }
      });
      alert.show();																	// show alert
    });
  }
  return data;																		// return the data.
} 