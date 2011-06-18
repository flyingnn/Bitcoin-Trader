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
** Top Window UI
** This is basically the mini app before logging in.
** ------------------------------------------------------------------------
*/
var topWindow = Titanium.UI.createWindow({  
  title:"MtGox Live Bitcoin Trader",
  backgroundImage:"backgroundImage.png"
});
  var topTitle1 = Titanium.UI.createLabel({
    color:'#009',
    text:'MtGox',
    font:{fontSize:30,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    top:10,
    right:70
  });
  var topTitle2 = Titanium.UI.createLabel({
    color:'#999',
    text:'Live',
    font:{fontSize:30,fontFamily:'Arial',fontWeight:'bold'},
    width:'auto',
    top:10,
    right:10
  });
  var topSubtitle = Titanium.UI.createLabel({
    color:'#999',
    text:'Bitcoin Trader v'+VERSION_NUMBER,
    font:{fontSize:18,fontFamily:'Arial'},
    width:'auto',
    top:40,
    right:9
  });
  var topURL = Titanium.UI.createLabel({
    color:'#555',
    text:'mtgoxlive.com • @mtgoxlive • irc.freenode.net/mtgoxlive',
    font:{fontSize:10,fontFamily:'Arial'},
    width:300,
    textAlign:'center',
    bottom:6,
    left:10
  });
topWindow.add(topTitle1);
topWindow.add(topTitle2);
topWindow.add(topSubtitle);
topWindow.add(topURL);


/* ------------------------------------------------------------------------
** The beginning of the app!
** ------------------------------------------------------------------------
*/
myCurrentView=loginView;		// Set our current view to login view
topWindow.add(loginView);		// Add the login "View" to the "Window"

topWindow.open();				// Open the window