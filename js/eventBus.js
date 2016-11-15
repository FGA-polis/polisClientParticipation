/*
 * Copyright 2012-present, Polis Technology Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights for non-commercial use can be found in the PATENTS file
 * in the same directory.
 */

var _ = require("underscore");
var Backbone = require("backbone");

var bus = _.extend({}, Backbone.Events);
bus.authNeeded = "authNeeded";
bus.backgroundClicked = "backgroundClicked";
bus.vote = "vote";
bus.exitConv = "exitConv";
bus.votableShown = "votableShown";
bus.clusterClicked = "clusterClicked";
bus.clusterSelectionChanged = "clusterSelectionChanged";
bus.commentSelected = "commentSelected";
bus.doneUsingWipCommentFormText = "doneUsingWipCommentFormText";
bus.participantCount = "participantCount";
bus.pidChange = "pidChange"; // PID_FLOW
bus.voteCount = "voteCount";
bus.commentCount = "commentCount";
bus.moderated = "moderated";
bus.moderatedPtpt = "moderatedPtpt";
bus.deselectGroups = "deselectGroups";
bus.interacted = "interacted"; // user has interacted (voted, written, changed tabs, etc)
bus.twitterConnected = "twitterConnected";
bus.twitterConnectedCommentForm = "twitterConnectedCommentForm";
bus.twitterConnectedParticipationView = "twitterConnectedParticipationView";
bus.twitterConnectedVoteView = "twitterConnectedVoteView";
bus.visShown = "visShown";
bus["beforehide:majority"] = "beforehide:majority";
bus["aftershow:majority"] = "aftershow:majority";
bus.firstRender = "firstRender";

module.exports = bus;
