/*
 * Copyright 2012-present, Polis Technology Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights for non-commercial use can be found in the PATENTS file
 * in the same directory.
 */

var Strings = require("../strings");
var M = require("../util/metrics");

// FB.getLoginStatus(function(response) {
//   if (response.status === 'connected') {
//     alert(1);
//     console.log('Logged in.');
//   }
//   else {



function facebookLoginOkHandler(response, optionalPassword) {
  console.log("onFbLoginOk");
  console.dir(response);
  var data = {
    response: JSON.stringify(response)
  };
  if (response && response.authResponse && response.authResponse.grantedScopes) {
    data.fb_granted_scopes = response.authResponse.grantedScopes;
  }
  data.owner = false; // since this is the participation view, don't add them to intercom


  M.add(M.FB_AUTH_INIT);
  var promise = $.ajax({
    url: "/api/v3/auth/facebook",
    contentType: "application/json; charset=utf-8",
    headers: {
      //"Cache-Control": "no-cache"  // no-cache
      "Cache-Control": "max-age=0"
    },
    xhrFields: {
      withCredentials: true
    },
    // crossDomain: true,
    dataType: "json",
    data: JSON.stringify(data),
    type: "POST"
  });
  promise.fail(function(o) {
    if ("polis_err_reg_fb_verification_email_sent" === o.responseText) {
      alert(Strings.polis_err_reg_fb_verification_email_sent);
    }
    if ("polis_err_reg_fb_verification_noemail_unverified" === o.responseText) {
      alert(Strings.polis_err_reg_fb_verification_noemail_unverified);
    }
  });

  promise.then(
    M.addp(M.FB_AUTH_OK),
    M.addp(M.FB_AUTH_ERR));

  return promise;
}


function fbLoginPrompt() {
  var dfd = $.Deferred();
  FB.login(
    function(response) {
      if (response.authResponse) {
        return facebookLoginOkHandler(response).then(dfd.resolve, dfd.reject);
      } else {
        return dfd.reject();
      }
    }, {
      return_scopes: true, // response should contain the scopes the user allowed
      scope: [
        // 'taggable_friends', // requires review.
        // invitable_friends NOTE: only for games with a fb Canvas presence, so don't use this
        'public_profile',
        'user_location',
        'user_friends',
        'email'
      ].join(',')
    });
  return dfd.promise();
}




function connect() {

  M.add(M.FB_CONNECT_INIT);

  var dfd = $.Deferred();

  if (FB.getAuthResponse()) {
    M.add(M.FB_GETAUTHRESPONSE_TRUE);

    M.add(M.FB_GETLOGINSTATUS_INIT);

    FB.getLoginStatus(function(x) {
      if (x.status === "connected") {
        M.add(M.FB_GETLOGINSTATUS_CONNECTED);
        facebookLoginOkHandler(x /*, password */ ).then(dfd.resolve, dfd.reject);
      } else {
        M.add(M.FB_GETLOGINSTATUS_NOTCONNECTED);
        // this code path may trigger popup blockers.
        // ideally the fbLoginPrompt call below is called instead.
        var promise = fbLoginPrompt();
        promise.then(dfd.resolve, dfd.reject);
        promise.then(
          M.addp(M.FB_LOGIN_PROMPT_OK),
          M.addp(M.FB_LOGIN_PROMPT_ERR));
      }
    });
  } else {
    M.add(M.FB_GETAUTHRESPONSE_FALSE);
    // test for FB.getUserID() so we can show the prompt on the same stack, preventing the popup-blocker from showing.
    var promise = fbLoginPrompt();
    promise.then(dfd.resolve, dfd.reject);
    promise.then(
      M.addp(M.FB_LOGIN_PROMPT_OK),
      M.addp(M.FB_LOGIN_PROMPT_ERR));
  }

  return dfd.promise();
}

module.exports = {
  connect: connect,
};
