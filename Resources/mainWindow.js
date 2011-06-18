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
** The Main APP Window
** ------------------------------------------------------------------------
*/
var mainWindow = Titanium.UI.createWindow({
  navBarHidden: true,
  fullscreen: true,
  backgroundImage:"backgroundImage.png"
});
  var mainHeader = Titanium.UI.createView({
    top:0,
    height:124
  });
  var balanceInfoBTC = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:16,fontFamily:'Arial',fontWeight:'bold'},
    top:76,
    right:10,
    textAlign:'right',
    text:balance.btcs + ' BTC'
  });  
  var balanceInfoUSD = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:16,fontFamily:'Arial',fontWeight:'bold'},
    top:92,
    right:10,
    textAlign:'right',
    text:balance.usds + 'USD'
  });
  var balanceUser = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:14,fontFamily:'Arial',fontWeight:'bold'},
    top:50,
    right:10,
    text:params.name+''
  });
  var tickerLast = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:16,fontFamily:'Arial',fontWeight:'bold'},
    top:50,
    left:10,
    text:'Last'
  });
  var tickerLast_ = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:16,fontFamily:'Arial'},
    top:50,
    left:90,
    text:'$'+ticker.last
  });
  var tickerHigh = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:14,fontFamily:'Arial',fontWeight:'bold'},
    top:68,
    left:10,
    text:'High'
  });
  var tickerHigh_ = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:14,fontFamily:'Arial'},
    top:68,
    left:90,
    text:'$'+ticker.high  
  });
  var tickerLow = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:14,fontFamily:'Arial',fontWeight:'bold'},
    top:82,
    left:10,
    text:"Low"
  });
  var tickerLow_ = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:14,fontFamily:'Arial'},
    text:"$"+ticker.low,
    top:82,
    left:90
  });
  var tickerVol = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:14,fontFamily:'Arial',fontWeight:'bold'},
    top:96,
    left:10,
    text:"Volume"  
  });
  var tickerVol_ = Titanium.UI.createLabel({
    color:'#000',
    font:{fontSize:14,fontFamily:'Arial'},
    top:96,
    left:90,
    text:"$"+ticker.vol
  });


  mainHeader.add(mainMenu);
  mainHeader.add(balanceInfoBTC);
  mainHeader.add(balanceInfoUSD);
  mainHeader.add(balanceUser);
  mainHeader.add(tickerLast);
  mainHeader.add(tickerLast_);
  mainHeader.add(tickerHigh);
  mainHeader.add(tickerHigh_);
  mainHeader.add(tickerLow);
  mainHeader.add(tickerLow_);
  mainHeader.add(tickerVol);
  mainHeader.add(tickerVol_);
    

/* ------------------------------------------------------------------------
** Footer
** ------------------------------------------------------------------------
*/
  var mainFooter = Titanium.UI.createView({
    bottom:0,
    height:46,
    width:320,
    backgroundImage:"menuBar.png"

  });
  var title1 = Titanium.UI.createLabel({
    color:'#fff',
    font:{fontSize:24,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    bottom:18,
    left:4,
    text:'MtGox'
  });
  var title2 = Titanium.UI.createLabel({
    color:'#999',
    font:{fontSize:24,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    bottom:18,
    left:80,    
    text:'Live'
  });
  var subTitle = Titanium.UI.createLabel({
    color:'#999',
    font:{fontSize:10,fontFamily:'Arial'},
    width:'auto',
    bottom:3,
    left:4,
    height:'auto',
    text:'Bitcoin Trader v'+VERSION_NUMBER
  });
  var depthLink = Titanium.UI.createLabel({
    color:'#fff',
    font:{fontSize:12,fontFamily:'Arial',fontWeight:'bold'},
    text:"Depth",
    textAlign:'center',
    borderColor:'#44b',
    backgroundImage:"menuBar.png",
    borderWidth:1,
    height:47,
    width:55,
    bottom:-1,
    right:38

  });
  mainFooter.add(title1);
  mainFooter.add(title2);
  mainFooter.add(subTitle);
  mainFooter.add(depthLink);    


  mainWindow.add(mainHeader);
  mainWindow.add(mainFooter);  
  mainWindow.add(homeWindow);
  mainFooter.add(homeRefresh);


  
/* ------------------------------------------------------------------------
** Main Window Actions
** ------------------------------------------------------------------------
*/  
function depthClick(e) {												// click on Depth Link
  if(activeLink==depthLink) {											// if it's active
    return;																// do nothing
  }
  if(noBG==false) {														// if the current active needs a bg when inactive
    activeLink.backgroundImage="menuBar.png";							// set a bg
  }
  activeLink.color='#fff';												// change the current active to white font

  depthLink.backgroundImage="selectedBar.png";
  depthLink.color="#000";

  mainWindow.remove(activeWindow);										// remove current active window
  mainFooter.remove(activeRefresh);										// remove current active refresh utton
  mainWindow.add(depthWindow);											// open depth window
  mainFooter.add(depthRefresh);											// open refresh window

  activeWindow=depthWindow;												// set active window to depth
  activeLink=depthLink;													// set active link to depth
  activeRefresh=depthRefresh;											// set active refresh button to depth

  if(gotDepth==0) {														// if we havent gotten depth yet
    getDepth();															// load the depth
  }
}
depthLink.addEventListener('click',depthClick);							// if someone clicks on depth do depthClick
 
mainWindow.addEventListener('focus',function(e) {						// when the window is focused (i.e., anytime you come in to the main login screen)
  reloadAll(3);												    		// reload home window completely
});
    
    

/* ------------------------------------------------------------------------
** Exit command
** ------------------------------------------------------------------------
*/  
mainWindow.addEventListener('android:back', function(e){				// If someone presses back
  alert = Titanium.UI.createAlertDialog({ title: 'Logout', message: 'Are you sure you want to logout?', buttonNames: ['Logout', 'Cancel'], cancel: 1 });
  alert.addEventListener('click', function(ev) {
    if (!(ev.cancel === ev.index || ev.cancel === true)) {
      switch (ev.index) {
        case 0:  mainWindow.close();									// close main window
                 topWindow.open();										// open top window (login screen basically which should have user/pass still set)
                 break;
        case 1:
                 break;
        default:
                 break;
      }
    }
  });
  alert.show();															// show alert
});
