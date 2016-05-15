/*
 * Copyright 2012-present, Polis Technology Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights for non-commercial use can be found in the PATENTS file
 * in the same directory.
 */

var $ = require("jquery");

function isVisible(tag) {
  return function() {
    // console.log("body > #" + tag);
    // console.log($("body > #" + tag).css("display"));
    return /block/.exec($("body > #" + tag).css('display'));
  };
}

function getWidth() {
  return $(document.body).width();
}

var widthCache = getWidth();

$(window).resize(function() {
  widthCache = getWidth();
});

function xs() {
  return widthCache <= window.xsThresh;
}

module.exports = {
  init: function() {
    var body = $(document.body);
    body.append("<span id='xs' class='visible-xs'></span>");
    body.append("<span id='sm' class='visible-sm'></span>");
    body.append("<span id='md' class='visible-md'></span>");
    body.append("<span id='lg' class='visible-lg'></span>");
  },
  xs: xs,
  sm: isVisible('sm'),
  md: isVisible('md'),
  lg: isVisible('lg'),
  getCachedWidth: function() {
    return widthCache;
  },
};

