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
** Forgot Password View UI
** ------------------------------------------------------------------------
*/
var passwordView = Titanium.UI.createView({  
  top:68,
  height:340,
  width:320
});

  var passwordUsername = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'username or email',
    height:44,
    width:300,
    top:0,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var passwordNow = Titanium.UI.createLabel({
    backgroundImage:"button.png",
    text:"recover password",
    color:"#333",
    textAlign:'center',
    height:39,
    width:144,
    left:10,
    top:46
  });  

  passwordView.add(passwordUsername);
  passwordView.add(passwordNow);
  
  var passwordBack = Titanium.UI.createLabel({
    width:54,
    height:48,
    backgroundImage:"goBack.png",
    color:"#ccc",
    textAlign:"center",
    font:{fontSize:"12",fontWeight:"bold"},
    left:2,
    top:15
  });
/* ------------------------------------------------------------------------
** Forgot Password Interaction
** ------------------------------------------------------------------------
*/  
passwordNow.addEventListener('click',function(e) {							// Password Button
  if(passwordUsername.value=='') {
    alertDialog("Blank Field", "Please complete the field.");
  }
  else {
    actInd.message="Attempting recovery";
    actInd.show();															// Show loading indicator

    passwordX = Titanium.Network.createHTTPClient();						// Create new HTTP Client
    passwordX.open('POST',sites.sendPassReset);								// Open Password Reset

    passwordX.onload = function () {										// On HTTP response
      if(this.status == '200') {											// HTTP Status 200 OK
        if(this.readyState == 4) {
          var response=JSON.parse(this.responseText);						// Parse JSON
          if(response.error!=null) {										// If there is an error
            actInd.hide();													// Hide loading indicator
            alertDialog("Error", response.error);							// Let them know what's good
          }
          else {															// Otherwise...
            topWindow.remove(passwordBack);									// Remove the back button
            topWindow.remove(passwordView);									// Remove the password window
            myCurrentView=loginView;										// set current view to login
            topWindow.add(loginView);										// open login
            actInd.hide();													// hide loading indicator
            alertDialog("Password Recovery", response.status);				// tell them about our success
          }
        }
      }
      actInd.hide();														// catch rogue loading indicator
    };
    if(passwordUsername.value.indexOf("@")==-1) {							// if not an email
      passwordX.send({"name":passwordUsername.value,"email":""});			// request by username
    }
    else {																	// otherwise
      passwordX.send({"name":"","email":passwordUsername.value});  			// request by email
    }
  }
});
		
passwordBack.addEventListener('click',function(e) {  						// back button
  topWindow.remove(passwordBack);											// remove back button
  topWindow.remove(myCurrentView);											// remove password view
  myCurrentView=loginView;													// set login to current view
  topWindow.add(loginView);													// add login view
});
