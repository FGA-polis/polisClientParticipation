/*
 * Copyright 2012-present, Polis Technology Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights for non-commercial use can be found in the PATENTS file
 * in the same directory.
 */

var template = require("../tmpl/groupSelectionView");
var Handlebones = require("handlebones");
var _ = require("underscore");
var Strings = require("../strings");


module.exports =  Handlebones.ModelView.extend({
  name: "groupSelectionView",
  template: template,
  className: "groupSelectionView",
  events: {
    "click .groupButton": "onClick",
    "click .visiblePart": "onClickGroupButtonInner",
    "click .infoPaneButton": "onClickInfoPaneButton",
  },
  setSelectedGroup: function(gid) {
    if (!_.isNaN(gid)) {
      this.model.set("selectedGid", gid);
      this.onChangedCallbacks.fire(gid);
    }
  },
  onClickGroupButtonInner: function(e) {
    var $target = $(e.target).parent();
    var gid = Number($target.data("gid"));
    this.setSelectedGroup(gid);
  },
  onClick: function(e) {
    var $target = $(e.target);
    var gid = Number($target.data("gid"));
    this.setSelectedGroup(gid);
  },
  onClickInfoPaneButton: function(e) {
    this.onClickInfoPaneButtonClickedCallbacks.fire();
    this.model.set("infoSlidePaneViewActive", true);
  },
  gotoInfoPaneTab: function() {
    this.model.set("infoSlidePaneViewActive", true);
  },
  show: function() {
    this.model.set("visible", true);
  },
  addSelectionChangedListener: function(f) {
    this.onChangedCallbacks.add(f);
  },
  addInfoPaneButtonClickedListener: function(f) {
    this.onClickInfoPaneButtonClickedCallbacks.add(f);
  },
  context: function() {
    var ctx = Handlebones.ModelView.prototype.context.apply(this, arguments);
    var infoSlidePaneViewActive = ctx.infoSlidePaneViewActive;
    ctx.groups2 = ctx.groups.map(function(g) {
      g = $.extend({}, g);
      if (g.gid === ctx.selectedGid && !infoSlidePaneViewActive) {
        g.selected = true;
      }
      return g;
    });
    ctx.s = Strings;
    return ctx;
  },
  initialize: function(options) {
    Handlebones.ModelView.prototype.initialize.apply(this, arguments);
    this.onChangedCallbacks = $.Callbacks();
    this.onClickInfoPaneButtonClickedCallbacks = $.Callbacks();
  }
});

