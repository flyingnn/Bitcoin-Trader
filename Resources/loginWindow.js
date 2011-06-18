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
** Login View UI
** ------------------------------------------------------------------------
*/
var loginView = Titanium.UI.createView({  
  top:68,
  height:380,
  width:320
});
  var username = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'username',
    height:44,
    width:300,
    top:0,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var password = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'password',
    height:44,
    width:300,
    top:44,
    passwordMask:true,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var signup_now = Titanium.UI.createLabel({
    color:'#009',
    text:'Signup now',
    font:{fontSize:12,fontFamily:'Arial'},
    width:'auto',
    textAlign:'right',
    top:90,
    right:10
  });
  var forgot_password = Titanium.UI.createLabel({
    color:'#009',
    text:'Forgot Password?',
    font:{fontSize:12,fontFamily:'Arial'},
    width:'auto',
    textAlign:'right',
    top:104,
    right:10
  });
  var loginNow = Titanium.UI.createLabel({
    backgroundImage:"button.png",
    text:"login",
    color:"#333",
    textAlign:'center',
    height:39,
    width:144,
    left:12,
    top:90
  });

  loginView.add(signup_now);
  loginView.add(forgot_password);
  loginView.add(username);
  loginView.add(password);
  loginView.add(loginNow);

  
/* ------------------------------------------------------------------------
** Login View Interactions
** ------------------------------------------------------------------------
*/  

forgot_password.addEventListener('click',function(e) {			// Open passwordView
  topWindow.add(passwordBack);									// Set the GO BACK button
  topWindow.remove(myCurrentView);								// Remove the current view
  myCurrentView=passwordView;									// Set our current view to password View
  topWindow.add(passwordView);									// Actually open the password View
});
  

signup_now.addEventListener('click',function(e) {				// Open registerView
  topWindow.add(registerBack);									// Set the GO BACK button
  topWindow.remove(myCurrentView);								// Remove the current view
  myCurrentView=registerView;									// Set our current view to register View
  topWindow.add(registerView);									// Actually open the register View
});


loginNow.addEventListener('click',function(e) {					// Login button
  if(username.value=='' || password.value=='') {
    alertDialog("Blank Fields", "Please enter your username and password.");
  }
  else {
    actInd.message="Logging in";
    actInd.show();												// Show loading indicator

    params.name=username.value;									// Set session username (user input)
    params.pass=password.value;									// Set session password (user input)

    loginX = Titanium.Network.createHTTPClient();				// Create HTTP Client
    loginX.open('POST',sites.getOrders);						// Request orders list

    loginX.onload = function () {								// on HTTP Response
      if(loginX.status == '200') {								// HTTP Status 200 OK
        if(loginX.readyState == 4) {
          var response=JSON.parse(this.responseText);			// Parse JSON reply
          if(response.error!=null) {							// If an error is incurred
            actInd.hide();										// Hide loading indicator
            alertDialog("Error", response.error);				// Spit out our error message
          }
          else {												// Otherwise we're all good
            setBalance(response);								// Set session balance
            setOrders(response);        						// Set session order list

            login2X = Titanium.Network.createHTTPClient();		// Another new HTTP Client
            login2X.open('POST',sites.ticker);					// Request Ticker
            login2X.onload = function () {
              if(login2X.status == '200') {						// on HTTP status 200 OK
                if(login2X.readyState == 4) {
                  var response=JSON.parse(this.responseText);	// Parse JSON reply
                  if(response.error!=null) {					// If an error is incurred
                    actInd.hide();								// Hide loading indicator
                    alertDialog("Error", response.error);		// Spit out error message
                  }
                  else {										// Otherwise we're all good
                    setTicker(response);						// Set session ticker info

                    topWindow.close();							// Close "Not logged in." Window
                    mainWindow.open();							// Open "Logged in." Interface

                    activeWindow=homeWindow;					// Set active view to home/orders list
                    activeLink=homeLink;						// Set active link to home/orders list
                    activeRefresh=homeRefresh;					// Set refresh button to home/orders list
                    actInd.hide();								// Hide loading indicator
                  }
                }
              }
              actInd.hide();									// Hide rogue loading indicator
            };
            login2X.send();										// Send ticker request
          }
        }
      }
    };
    loginX.send(params);									// Send balance request
  }
});


