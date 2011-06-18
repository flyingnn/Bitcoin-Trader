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
** The Main Menu UI
** ------------------------------------------------------------------------
*/
var mainMenu = Titanium.UI.createView({
  top:0,
  width:320,
  height:50,
  shadowColor:"#009",
  shadowOffset:{x:0,y:2}    
});
  var homeLink = Titanium.UI.createLabel({
    backgroundImage:"selectedBar.png",
    text:"Orders",
    color:'#000',
    textAlign:'center',
    top:0,
    left:-1,
    borderColor:'#44b',
    borderWidth:1,
    height:51,
    width:67
  });
  var buyLink = Titanium.UI.createLabel({
    backgroundImage:"menuBar.png",
    text:"Buy",
    color:'#fff',
    textAlign:'center',
    top:0,
    left:65,
    borderColor:'#44b',
    borderWidth:1,
    height:51,
    width:65
  });
  var sellLink = Titanium.UI.createLabel({
    backgroundImage:"menuBar.png",
    text:"Sell",
    color:'#fff',
    textAlign:'center',
    top:0,
    left:129,
    borderColor:'#44b',
    borderWidth:1,
    height:51,
    width:65
  });   
  var withdrawLink = Titanium.UI.createLabel({
    backgroundImage:"menuBar.png",
    text:"Send",
    color:'#fff',
    textAlign:'center',
    top:0,
    left:192,
    borderColor:'#44b',
    borderWidth:1,
    height:51,
    width:65
  });

  var historyLink = Titanium.UI.createLabel({
    backgroundImage:"menuBar.png",
    text:"History",
    color:'#fff',
    textAlign:'center',
    top:0,
    left:256,
    borderColor:'#44b',
    borderWidth:1,
    height:51,
    width:65
  });      

  mainMenu.add(homeLink);
  mainMenu.add(buyLink);
  mainMenu.add(sellLink);
  mainMenu.add(withdrawLink);    
  mainMenu.add(historyLink);    
    
    
/* ------------------------------------------------------------------------
** The Main Menu Actions
** ------------------------------------------------------------------------
*/
function homeClick(e) {												// home
  if(activeLink==homeLink) {										// if its active do nothing
    return;															// stop
  }
  if(noBG==false) {													// if we do bg for this link
    activeLink.backgroundImage="menuBar.png";						// set the bg to blue again
  }
  noBG=false;														// make sure we let them know we do need bg for this one
  activeLink.color='#fff';											// set active link color to white
  homeLink.backgroundImage="selectedBar.png";						// set home background to selected
  homeLink.color="#000";											// set text color
  mainWindow.remove(activeWindow);									// remove active window from the view
  mainFooter.remove(activeRefresh);									// remove current active refresh from view
  reloadMain();														// reload everything
  reloadOrders();													// reload orders
  mainWindow.add(homeWindow);										// add homewindow into view
  mainFooter.add(homeRefresh);										// add home refresh into view
  activeWindow=homeWindow;										 	// set active window to home
  activeLink=homeLink;												// set activelink to home
  activeRefresh=homeRefresh;										// set active refresh to home
}
homeLink.addEventListener('click',homeClick);      					// setup the click listener for home
        
function buyClick(e) {
  if(activeLink==buyLink) {
    return;
  }
  if(noBG==false) {
    activeLink.backgroundImage="menuBar.png";
  }
  noBG=false;
  activeLink.color='#fff';
  buyLink.backgroundImage="selectedBar.png";
  buyLink.color="#000";

  mainWindow.remove(activeWindow);
  mainFooter.remove(activeRefresh);
  reloadMain();
  reloadBuy();
  mainWindow.add(buyWindow);
  mainFooter.add(buyRefresh);

  activeWindow=buyWindow;
  activeLink=buyLink;
  activeRefresh=buyRefresh;
}
buyLink.addEventListener('click',buyClick);
            
function sellClick(e) {
  if(activeLink==sellLink) {
    return;
  }
  if(noBG==false) {
    activeLink.backgroundImage="menuBar.png";
  }
  noBG=false;
  activeLink.color='#fff';
  sellLink.backgroundImage="selectedBar.png";
  sellLink.color="#000";

  mainWindow.remove(activeWindow);
  mainFooter.remove(activeRefresh);
  reloadMain();
  reloadSell();
  mainWindow.add(sellWindow);
  mainFooter.add(sellRefresh);

  activeWindow=sellWindow;
  activeLink=sellLink;
  activeRefresh=sellRefresh;
}
sellLink.addEventListener('click',sellClick);

function withdrawClick(e) {
  if(activeLink==withdrawLink) {
    return;
  }
  if(noBG==false) {
    activeLink.backgroundImage="menuBar.png";
  }
  noBG=false;
  activeLink.color='#fff';
  withdrawLink.backgroundImage="selectedBar.png";
  withdrawLink.color="#000";

  mainWindow.remove(activeWindow);
  mainFooter.remove(activeRefresh);
  reloadMain();
  mainWindow.add(withdrawWindow);
  mainFooter.add(withdrawRefresh);

  activeWindow=withdrawWindow;
  activeLink=withdrawLink;
  activeRefresh=withdrawRefresh;
}
withdrawLink.addEventListener('click',withdrawClick);      

function historyClick(e) {
  if(activeLink==historyLink) {
    return;
  }
  if(noBG==false) {
    activeLink.backgroundImage="menuBar.png";
  }
  noBG=false;
  activeLink.color='#fff';
  historyLink.backgroundImage="selectedBar.png";
  historyLink.color="#000";

  mainWindow.remove(activeWindow);
  mainFooter.remove(activeRefresh);
  reloadMain();
  mainWindow.add(historyWindow);
  mainFooter.add(historyRefresh);

  activeWindow=historyWindow;
  activeLink=historyLink;
  activeRefresh=historyRefresh;
  if(gotHistory==0) {												// if we haven't yet got the history
    getHistory();													// get the history
  }
}
historyLink.addEventListener('click',historyClick);          
            