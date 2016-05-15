/*
 * Copyright 2012-present, Polis Technology Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights for non-commercial use can be found in the PATENTS file
 * in the same directory.
 */

var eb = require("../eventBus");
var Handlebones = require("handlebones");
var template = require("../tmpl/readReactView");
var CommentModel = require("../models/comment");
var VoteView = require('../views/vote-view');
var PolisFacebookUtils = require('../util/facebookButton');
// var serverClient = require("../stores/polis");
// var Utils = require("../util/utils");

// var iOS = Utils.isIos();

var SHOULD_PROMPT_FOR_FB = false;

module.exports = Handlebones.ModelView.extend({
  name: "readReactView",
  template: template,
  events: {

    "click #fbNotNowBtn": "fbNotNowBtn",
    "click #fbNoUseBtn": "fbNoUseBtn",
    "click #fbConnectBtn": "fbConnectBtn",
    // "click #passButton": "participantPassed",

    // "hover .starbutton": function(){
    //   this.$(".starbutton").html("<i class='fa fa-star'></i>");
    // }
  },
  fbNotNowBtn: function() {
    this.model.set("response", "fbnotnow");
  },
  fbNoUseBtn: function() {
    this.model.set("response", "fbnouse");
  },
  fbConnectBtn: function() {
    PolisFacebookUtils.connect().then(function() {
      // that.model.set("response", "fbdone");
      location.reload();
    }, function(err) {
      // alert("facebook error");
    });
  },

  context: function() {
    var ctx = Handlebones.ModelView.prototype.context.apply(this, arguments);
    // ctx.iOS = iOS;
    var hasFacebookAttached = window.userObject.hasFacebook;

    var voteCountForFacebookPrompt = 3;

    ctx.promptFacebook = SHOULD_PROMPT_FOR_FB && !hasFacebookAttached && !this.model.get("response") && this.model.get("voteCount") > voteCountForFacebookPrompt;
    return ctx;
  },
  initialize: function(options) {
    Handlebones.ModelView.prototype.initialize.apply(this, arguments);
    var that = this;
    this.model = options.model;

    this.voteView = this.addChild(new VoteView({
      firstCommentPromise: options.firstCommentPromise,
      serverClient: options.serverClient,
      model: new CommentModel(),
      conversationModel: options.conversationModel,
      votesByMe: options.votesByMe,
      is_public: options.is_public,
      isSubscribed: options.isSubscribed,
      conversation_id: options.conversation_id
    }));

    eb.on("vote", function() {
      that.model.set("voteCount", (that.model.get("voteCount") + 1) || 1);
    });
  }
});
