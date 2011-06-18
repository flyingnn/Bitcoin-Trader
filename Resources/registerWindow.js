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
** register view UI
** ------------------------------------------------------------------------
*/
var registerView = Titanium.UI.createView({  
  top:68,
  height:340,
  width:320
});
  var registerUsername = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'new username',
    height:44,
    width:300,
    top:0,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var registerPassword = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'password',
    height:44,
    width:300,
    top:44,
    passwordMask:true,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var confirmPassword = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'retype password',
    height:44,
    width:300,
    top:88,
    passwordMask:true,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  var registerMail = Titanium.UI.createTextField({
    color:'#336699',
    value:'',
    hintText:'email',
    height:44,
    width:300,
    top:132,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });  
  var registerNow = Titanium.UI.createLabel({
    backgroundImage:"button.png",
    text:"signup",
    color:"#333",
    textAlign:'center',
    height:39,
    width:144,
    left:10,
    top:178
  });  
  registerView.add(registerUsername);
  registerView.add(registerPassword);
  registerView.add(confirmPassword);  
  registerView.add(registerMail);  
  registerView.add(registerNow);
  
  var registerBack = Titanium.UI.createLabel({
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
** register interactions
** ------------------------------------------------------------------------
*/
registerNow.addEventListener('click',function(e) {							// Register button
  if(registerUsername.value=='' || registerPassword.value=='' || confirmPassword.value=='' || registerMail.value=='') {
    alertDialog("Blank Fields", "Please complete all of the fields.");
  }
  else if(registerPassword.value!=confirmPassword.value) {
    alertDialog("Password Mismatch","Your passwords do not match.");
  }
  else {
    actInd.message="Signing up";
    actInd.show();															// Show loading indicator	

    registerX = Titanium.Network.createHTTPClient();						// create new HTTP client
    registerX.open('POST',sites.register);									// open registration page

    registerX.onload = function () {										// on http response
      if(this.status == '200') {											// http status 200 OK
        if(this.readyState == 4) {
          var response=JSON.parse(this.responseText);						// parse JSON response
          if(response.error!=null) {										// if error
            actInd.hide();													// hide loading indicator
            alertDialog("Error", response.error);							// output the error message
          }
          else {															// otherwise
            topWindow.remove(registerBack);									// remove the register window back button
            topWindow.remove(registerView);									// remove the register window view
            topWindow.add(loginView);										// add the login view
			myCurrentView=loginView;										// set current view to login view
            actInd.hide();													// hide the loading indicator
            alertDialog("Signup", response.status);							// let them know the success
          }
        }
      }
      actInd.hide();														// hide the rogue
    };
    registerX.send({name:registerUsername.value,pass:registerPassword,email:registerMail});	// send
  }
});
registerBack.addEventListener('click',function(e) {							// back button
  topWindow.remove(registerBack);											// remove the register back button
  topWindow.remove(myCurrentView);											// remove curr window (register)
  myCurrentView=loginView;													// set current to login
  topWindow.add(loginView);													// open login/ add it.
});
  
