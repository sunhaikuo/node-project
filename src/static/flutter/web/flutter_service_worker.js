'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "/index.html": "2eb0bc614a583e9adccaed5c6ebe4e50",
"/main.dart.js": "039652f9f8fae305cc2604150133330c",
"/assets/LICENSE": "a085b254006ee32f2b8b5df97e3b6173",
"/assets/AssetManifest.json": "acececb2609d9bcf942bfa2016ab8f7b",
"/assets/FontManifest.json": "d088d01a3e4e2ae59a526ac199130524",
"/assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"/assets/packages/open_iconic_flutter/assets/open-iconic.woff": "3cf97837524dd7445e9d1462e3c4afe2",
"/assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"/assets/assets/images/no-net.png": "f94478578a303ad824966f64bc3abda7",
"/assets/assets/images/suspend.png": "b844a3610e69b5eab70bc0d6a03850d4",
"/assets/assets/images/video_rank.png": "f1876155296a61648bcb6fe6214a97ac",
"/assets/assets/images/icon_back.png": "a66aea90c9654c547e11edf68b6e0006",
"/assets/assets/images/msg.png": "b8c77eab0ffc14cb227f8b6c529b659b",
"/assets/assets/images/main.png": "7272f0bd04f488f51a8097b17ab8eb7c",
"/assets/assets/images/level7.png": "268ccb88ba7069d7609432bfcf0c1d9b",
"/assets/assets/images/up.png": "4b7d5040d1184b79432709ecd06fda70",
"/assets/assets/images/search-s.png": "0e917c92c101280a4b6e6cf47c6dc055",
"/assets/assets/images/main-s.png": "809565398d254020968f1b43c8472df1",
"/assets/assets/images/video-s.png": "5de93ceb064caf08e32a7d8e8a3a1e86",
"/assets/assets/images/like.png": "4425af3744bd72454c7226774ed066e2",
"/assets/assets/images/weixin.png": "099f37b8b6122ab09168925027ea9169",
"/assets/assets/images/search.png": "7e3a55d09a8090b2aef0a78e587b7268",
"/assets/assets/images/up-clicked.png": "b31aa74babc0b09c1845fa8c25764622",
"/assets/assets/images/logo.png": "007335cef2bf4acff790b383373b3bac",
"/assets/assets/images/video.png": "6a2dc37d3269cec841431a496f34b1bd",
"/assets/assets/images/vlog.png": "17b90e79200e2ba71ac795b91f9fb0ac",
"/assets/assets/images/share.png": "8855f3f665326fea171ea2547c0b1606",
"/assets/assets/images/hot.png": "2ba92e157f2be1ceb215d19592b83e03",
"/assets/assets/images/search_rank.png": "32e070bc55677d406b7bc30dff073a80",
"/assets/assets/images/msg-clicked.png": "042cfd5f4d5c69d0238e1beace1ca518",
"/assets/assets/images/play.png": "7740a237c492897e45c3c99aab91f5e6",
"/assets/assets/json/emoji.json": "338876b86a6c4a2ddbae5448fee9fcff",
"/assets/assets/json/comments.json": "e3a05f3c9f0d2902cdca40f7380f426a",
"/assets/assets/json/channel.json": "27dfc46918f459c11dc6110091eecaed",
"/assets/assets/json/weibo.json": "23129ed21d38de4306633420235e87f3"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
