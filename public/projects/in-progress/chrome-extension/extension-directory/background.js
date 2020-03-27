'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({color: '#000000'}, function() {
  });
});
