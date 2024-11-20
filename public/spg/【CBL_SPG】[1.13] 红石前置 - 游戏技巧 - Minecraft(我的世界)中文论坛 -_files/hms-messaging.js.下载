!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).hms=t()}(this,(function(){"use strict";
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * 2020.1.15-Changed delete some functions
     *                                         Huawei Technologies Co., Ltd.
     */
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(t,n)};function t(t,n){function o(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}var n=function(){return(n=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}).apply(this,arguments)};function o(e,t,n,o){return new(n||(n=Promise))((function(r,i){function s(e){try{u(o.next(e))}catch(e){i(e)}}function a(e){try{u(o.throw(e))}catch(e){i(e)}}function u(e){e.done?r(e.value):new n((function(t){t(e.value)})).then(s,a)}u((o=o.apply(e,t||[])).next())}))}function r(e,t){var n,o,r,i,s={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;s;)try{if(n=1,o&&(r=2&i[0]?o.return:i[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,i[1])).done)return r;switch(o=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,o=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(r=s.trys,(r=r.length>0&&r[r.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){s.label=i[1];break}if(6===i[0]&&s.label<r[1]){s.label=r[1],r=i;break}if(r&&s.label<r[2]){s.label=r[2],s.ops.push(i);break}r[2]&&s.ops.pop(),s.trys.pop();continue}i=t.call(e,s)}catch(e){i=[6,e],o=0}finally{n=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}}function i(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var o,r,i=n.call(e),s=[];try{for(;(void 0===t||t-- >0)&&!(o=i.next()).done;)s.push(o.value)}catch(e){r={error:e}}finally{try{o&&!o.done&&(n=i.return)&&n.call(i)}finally{if(r)throw r.error}}return s}function s(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(i(arguments[t]));return e}
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */var a,u=function(){function e(e,t){var n=this;this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then((function(){e(n)})).catch((function(e){n.error(e)}))}return e.prototype.next=function(e){this.forEachObserver((function(t){t.next(e)}))},e.prototype.error=function(e){this.forEachObserver((function(t){t.error(e)})),this.close(e)},e.prototype.complete=function(){this.forEachObserver((function(e){e.complete()})),this.close()},e.prototype.subscribe=function(e,t,n){var o,r=this;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");void 0===(o=function(e,t){var n,o;if("object"!=typeof e||null===e)return!1;try{for(var r=function(e){var t="function"==typeof Symbol&&e[Symbol.iterator],n=0;return t?t.call(e):{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}}}(t),i=r.next();!i.done;i=r.next()){var s=i.value;if(s in e&&"function"==typeof e[s])return!0}}catch(e){n={error:e}}finally{try{i&&!i.done&&(o=r.return)&&o.call(r)}finally{if(n)throw n.error}}return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:n}).next&&(o.next=c),void 0===o.error&&(o.error=c),void 0===o.complete&&(o.complete=c);var i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then((function(){try{r.finalError?o.error(r.finalError):o.complete()}catch(e){}})),this.observers.push(o),i},e.prototype.unsubscribeOne=function(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))},e.prototype.forEachObserver=function(e){if(!this.finalized)for(var t=0;t<this.observers.length;t++)this.sendOne(t,e)},e.prototype.sendOne=function(e,t){var n=this;this.task.then((function(){if(void 0!==n.observers&&void 0!==n.observers[e])try{t(n.observers[e])}catch(e){"undefined"!=typeof console&&console.error&&console.error(e)}}))},e.prototype.close=function(e){var t=this;this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then((function(){t.observers=void 0,t.onNoObservers=void 0})))},e}();function c(){}
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * 2020.1.15-Changed delete some annotation
     *                                      Huawei Technologies Co., Ltd.
     */!function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"}(a||(a={}));var p,l=a.INFO,h=function(e,t){for(var n=[],o=2;o<arguments.length;o++)n[o-2]=arguments[o];if(!(t<e.logLevel)){var r=(new Date).toLocaleDateString();switch(t){case a.DEBUG:case a.VERBOSE:console.log.apply(console,s(["["+r+"]  "+e.name+":"],n));break;case a.INFO:console.info.apply(console,s(["["+r+"]  "+e.name+":"],n));break;case a.WARN:console.warn.apply(console,s(["["+r+"]  "+e.name+":"],n));break;case a.ERROR:console.error.apply(console,s(["["+r+"]  "+e.name+":"],n));break;default:throw new Error("Attempted to log a message with an invalid logType (value: "+t+")")}}},d=new(function(){function e(e){this.name=e,this._logLevel=l,this._logHandler=h}return Object.defineProperty(e.prototype,"logLevel",{get:function(){return this._logLevel},set:function(e){if(!(e in a))throw new TypeError("Invalid value assigned to `logLevel`");this._logLevel=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"logHandler",{get:function(){return this._logHandler},set:function(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e},enumerable:!0,configurable:!0}),e.prototype.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._logHandler.apply(this,s([this,a.DEBUG],e))},e.prototype.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._logHandler.apply(this,s([this,a.VERBOSE],e))},e.prototype.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._logHandler.apply(this,s([this,a.INFO],e))},e.prototype.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._logHandler.apply(this,s([this,a.WARN],e))},e.prototype.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._logHandler.apply(this,s([this,a.ERROR],e))},e}())("hms/app"),f=((p={})["bad-options"]="App options not empty",p["bad-app-name"]="Illegal App name: '{$appName}",p["bad-project-id"]="Illegal Project ID: '{$projectId}",p["bad-app-id"]="Illegal App ID: '{$appId}",p["bad-api-key"]="Illegal Api Key: '{$apiKey}",p["bad-country-code"]="Illegal Country Code: '{$countryCode}",p["bad-browser-code"]="Illegal Browser: '{$hardware}",p["only-available-in-window"]="This method is available in a Window context.",p["only-available-in-sw"]="This method is available in a service worker context.",p["should-be-overriden"]="This method should be overriden by extended classes.",p["bad-sender-id"]="Please ensure that 'messagingSenderId' is set correctly in the options passed into hms.initializeApp().",p["permission-default"]="The required permissions were not granted and dismissed instead.",p["permission-blocked"]="The required permissions were not granted and blocked instead.",p["unsupported-browser"]="This browser doesn't support the API's required to use the hms SDK.",p["notifications-blocked"]="Notifications have been blocked.",p["failed-serviceworker-registration"]="We are unable to register the default service worker. {$browserErrorMessage}",p["sw-registration-expected"]="A service worker registration was the expected input.",p["get-subscription-failed"]="There was an error when trying to get any existing Push Subscriptions.",p["invalid-saved-token"]="Unable to access details of the saved token.",p["sw-reg-redundant"]="The service worker being used for push was made redundant.",p["token-subscribe-failed"]="A problem occured while subscribing the user to HMS: {$errorInfo}",p["token-subscribe-no-token"]="HMS returned no token when subscribing the user to push.",p["token-unsubscribe-failed"]="A problem occured while unsubscribing the user from HMS: {$errorInfo}",p["token-update-failed"]="A problem occured while updating the user from HMS: {$errorInfo}",p["token-update-no-token"]="HMS returned no token when updating the user to push.",p["use-sw-before-get-token"]="The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",p["invalid-delete-token"]="You must pass a valid token into deleteToken(), i.e. the token from getToken().",p["delete-token-not-found"]="The deletion attempt for token could not be performed as the token was not found.",p["delete-scope-not-found"]="The deletion attempt for service worker scope could not be performed as the scope was not found.",p["bg-handler-function-expected"]="The input to setBackgroundMessageHandler() must be a function.",p["no-window-client-to-msg"]="An attempt was made to message a non-existant window client.",p["unable-to-resubscribe"]="There was an error while re-subscribing the HMS token for push messaging. Will have to resubscribe the user on next visit. {$errorInfo}",p["no-hms-token-for-resubscribe"]="Could not find an HMS token and as a result, unable to resubscribe. Will have to resubscribe the user on next visit.",p["failed-to-delete-token"]="Unable to delete the currently saved token.",p["no-sw-in-reg"]="Even though the service worker registration was successful, there was a problem accessing the service worker itself.",p["bad-scope"]="The service worker scope must be a string with at least one character.",p["bad-vapid-key"]="The public VAPID key is not a Uint8Array with 65 bytes.",p["bad-subscription"]="The subscription must be a valid PushSubscription.",p["bad-token"]="The HMS Token used for storage / lookup was not a valid token string.",p["failed-delete-vapid-key"]="The VAPID key could not be deleted.",p["invalid-public-vapid-key"]="The public VAPID key must be a string.",p["use-public-key-before-get-token"]="The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.",p["public-vapid-key-decryption-failed"]="The public VAPID key did not equal 65 bytes when decrypted.",p);function b(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var o=t[0]||{},r="messaging/"+e,i=f[e],s=i?g(i,o):"Error",a="messaging: "+s+" ("+r+").",u=new Error(a);return u}function g(e,t){return e.replace(y,(function(e,n){var o=t[n];return null!==o?o.toString():"<"+n+"?>"}))}var v,y=/\{\$([^}]+)}/g,w=new Uint8Array([4,51,148,247,223,161,235,177,220,3,162,94,21,113,219,72,211,46,237,237,178,52,219,183,71,58,12,143,196,204,225,111,60,140,132,223,171,182,102,62,242,12,212,139,254,227,249,118,47,20,28,99,8,106,111,45,177,26,149,176,206,55,192,156,110]);
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * 2020.1.15-Changed Delete SUBSCRIPTION_DETAILS and modify ENDPOINT.
     *                  Huawei Technologies Co., Ltd. <likaiqiang4@huawei.com>
     */
/**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
function k(e,t){if(!e||!t)return!1;if(e===t)return!0;if(e.byteLength!==t.byteLength)return!1;for(var n=new DataView(e),o=new DataView(t),r=0;r<e.byteLength;r++)if(n.getUint8(r)!==o.getUint8(r))return!1;return!0}
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * 2020.1.15-Changed Modified and add some methods.
     *                                          Huawei Technologies Co., Ltd.
     */function m(e){return function(e){var t=new Uint8Array(e);return btoa(String.fromCharCode.apply(String,s(t)))}(e).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * 2020.1.15-Changed Modified some methods.
     *                                      Huawei Technologies Co., Ltd.
     */!function(e){e.PUSH_MSG_RECEIVED="push-msg-received",e.NOTIFICATION_CLICKED="notification-clicked"}(v||(v={}));var S=function(){function e(){}return e.prototype.getToken=function(e,t,n){return o(this,void 0,void 0,(function(){var o,i,s,a;return r(this,(function(r){switch(r.label){case 0:return[4,_()];case 1:o=r.sent(),i=function(e,t,n){var o=m(t.getKey("p256dh")),r=m(t.getKey("auth")),i={endpoint:t.endpoint,keys:{p256dh:o,auth:r},applicationServerKey:m(n),expirationTime:+new Date};return{token_context:{web_push:{subscription:JSON.stringify(i),api_key:e.options.apiKey,project_id:e.options.projectId,app_id:e.options.appId,country_code:e.options.countryCode,app_server_key:m(n)}},token_platform:{hardware:e.options.hardware,model:e.options.model}}}
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */(e,t,n),s={method:"POST",headers:o,body:JSON.stringify(i)},r.label=2;case 2:return r.trys.push([2,5,,6]),[4,fetch(T()+"/apply?appid="+e.options.appId,s)];case 3:return[4,r.sent().json()];case 4:return a=r.sent(),[3,6];case 5:throw b("token-subscribe-failed",{errorInfo:r.sent()});case 6:if(0!=a.tokens[0].ret)throw"token apply failed",b("token-subscribe-failed",{errorInfo:"token apply failed"});if(0==a.tokens.length)throw b("token-subscribe-no-token");return[2,a.tokens[0].token]}}))}))},e.prototype.deleteToken=function(e,t){return o(this,void 0,void 0,(function(){var n,o,i;return r(this,(function(r){switch(r.label){case 0:return[4,_()];case 1:n=r.sent(),o=function(e,t){return{cancel_context:{web_push:{token_info:{project_id:e.options.projectId,app_id:e.options.appId,token:t.pushToken},api_key:e.options.apiKey}},token_platform:{hardware:e.options.hardware,model:e.options.model}}}(e,t),i={method:"POST",headers:n,body:JSON.stringify(o)},r.label=2;case 2:return r.trys.push([2,5,,6]),[4,fetch(T()+"/cancel?appid="+e.options.appId,i)];case 3:return[4,r.sent().json()];case 4:if(0!=r.sent().tokens[0].ret)throw"token delete failed",b("token-unsubscribe-failed",{errorInfo:"token delete failed"});return[3,6];case 5:throw b("token-unsubscribe-failed",{errorInfo:r.sent()});case 6:return[2]}}))}))},e}();function T(e){return"https://token.push.dbankcloud.com/rest/web_push/v1"}function _(e){return o(this,void 0,void 0,(function(){return r(this,(function(e){return[2,new Headers({Accept:"application/json"})]}))}))}var I=function(){function e(){this.dbPromise=null}return e.prototype.get=function(e){return this.createTransaction((function(t){return t.get(e)}))},e.prototype.getIndex=function(e,t){return this.createTransaction((function(n){return n.index(e).get(t)}))},e.prototype.put=function(e){return this.createTransaction((function(t){return t.put(e)}),"readwrite")},e.prototype.delete=function(e){return this.createTransaction((function(t){return t.delete(e)}),"readwrite")},e.prototype.closeDatabase=function(){return o(this,void 0,void 0,(function(){return r(this,(function(e){switch(e.label){case 0:return this.dbPromise?[4,this.dbPromise]:[3,2];case 1:e.sent().close(),this.dbPromise=null,e.label=2;case 2:return[2]}}))}))},e.prototype.createTransaction=function(e,t){return void 0===t&&(t="readonly"),o(this,void 0,void 0,(function(){var n,o,i,s;return r(this,(function(r){switch(r.label){case 0:return[4,this.getDb()];case 1:return n=r.sent(),o=n.transaction(this.objectStoreName,t),i=o.objectStore(this.objectStoreName),[4,M(e(i))];case 2:return s=r.sent(),[2,new Promise((function(e,t){o.oncomplete=function(){e(s)},o.onerror=function(){t(o.error)}}))]}}))}))},e.prototype.getDb=function(){var e=this;return this.dbPromise||(this.dbPromise=new Promise((function(t,n){var o=indexedDB.open(e.dbName,e.dbVersion);o.onsuccess=function(){t(o.result)},o.onerror=function(){e.dbPromise=null,n(o.error)},o.onupgradeneeded=function(t){return e.onDbUpgrade(o,t)}}))),this.dbPromise},e}();function M(e){return new Promise((function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}}))}
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * 2020.1.15-Changed Modified some methods.
     *                                         Huawei Technologies Co., Ltd.
     */var D=function(e){function n(t){var n=e.call(this)||this;return n.app=t,n.dbName="push_token_details_db",n.dbVersion=1,n.objectStoreName="push_token_object_Store",n}return t(n,e),n.prototype.onDbUpgrade=function(e,t){var n=e.result;switch(t.oldVersion){case 0:n.createObjectStore(this.objectStoreName,{keyPath:"swScope"}).createIndex("pushToken","pushToken",{unique:!0})}},n.prototype.getTokenDetailsFromToken=function(e){return o(this,void 0,void 0,(function(){return r(this,(function(t){if(!e)throw b("bad-token");return P({pushToken:e}),[2,this.getIndex("pushToken",e)]}))}))},n.prototype.getTokenDetailsFromSWScope=function(e){return o(this,void 0,void 0,(function(){return r(this,(function(t){if(!e)throw b("bad-scope");return P({swScope:e}),[2,this.get(e)]}))}))},n.prototype.saveTokenDetails=function(e){return o(this,void 0,void 0,(function(){return r(this,(function(t){if(!e.swScope)throw b("bad-scope");if(!e.vapidKey)throw b("bad-vapid-key");if(!e.endpoint||!e.auth||!e.p256dh)throw b("bad-subscription");if(!e.pushToken)throw b("bad-token");return P(e),[2,this.put(e)]}))}))},n.prototype.deleteToken=function(e){return o(this,void 0,void 0,(function(){var t;return r(this,(function(n){switch(n.label){case 0:return"string"!=typeof e||0===e.length?[2,Promise.reject(b("invalid-delete-token"))]:[4,this.getTokenDetailsFromToken(e)];case 1:if(!(t=n.sent()))throw b("delete-token-not-found");return[4,this.delete(t.swScope)];case 2:return n.sent(),[2,t]}}))}))},n}(I);function P(e){if(e.pushToken&&("string"!=typeof e.pushToken||0===e.pushToken.length))throw b("bad-token");if(e.swScope&&("string"!=typeof e.swScope||0===e.swScope.length))throw b("bad-scope");if(e.vapidKey&&(!(e.vapidKey instanceof Uint8Array)||65!==e.vapidKey.length))throw b("bad-vapid-key");if(e.endpoint&&("string"!=typeof e.endpoint||0===e.endpoint.length))throw b("bad-subscription");if(e.auth&&!(e.auth instanceof ArrayBuffer))throw b("bad-subscription");if(e.p256dh&&!(e.p256dh instanceof ArrayBuffer))throw b("bad-subscription")}
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */var O=function(e){function n(){var t=null!==e&&e.apply(this,arguments)||this;return t.dbName="push_vapid_details_db",t.dbVersion=1,t.objectStoreName="push_vapid_object_Store",t}return t(n,e),n.prototype.onDbUpgrade=function(e){e.result.createObjectStore(this.objectStoreName,{keyPath:"swScope"})},n.prototype.getVapidFromSWScope=function(e){return o(this,void 0,void 0,(function(){var t;return r(this,(function(n){switch(n.label){case 0:if("string"!=typeof e||0===e.length)throw b("bad-scope");return[4,this.get(e)];case 1:return[2,(t=n.sent())?t.vapidKey:void 0]}}))}))},n.prototype.saveVapidDetails=function(e,t){return o(this,void 0,void 0,(function(){var n;return r(this,(function(o){if("string"!=typeof e||0===e.length)throw b("bad-scope");if(null===t||65!==t.length)throw b("bad-vapid-key");return n={swScope:e,vapidKey:t},[2,this.put(n)]}))}))},n.prototype.deleteVapidDetails=function(e){return o(this,void 0,void 0,(function(){var t;return r(this,(function(n){switch(n.label){case 0:return[4,this.getVapidFromSWScope(e)];case 1:if(!(t=n.sent()))throw b("delete-scope-not-found");return[4,this.delete(e)];case 2:return n.sent(),[2,t]}}))}))},n}(I),E=function(){function e(e){this.app=e,this.vapidDetailsModel=new O,this.subscriptionManager=new S,this.tokenDetailsModel=new D(e)}return e.prototype.getToken=function(){return o(this,void 0,void 0,(function(){var e,t,n,o,i;return r(this,(function(r){switch(r.label){case 0:if("denied"===(e=this.getNotificationPermission_()))throw b("notifications-blocked");return"granted"!==e?[2,null]:[4,this.getSWRegistration_()];case 1:return t=r.sent(),[4,this.getPublicVapidKey_()];case 2:return n=r.sent(),[4,this.getPushSubscription(t,n)];case 3:return o=r.sent(),[4,this.tokenDetailsModel.getTokenDetailsFromSWScope(t.scope)];case 4:return(i=r.sent())?[2,this.manageExistingToken(t,o,n,i)]:[2,this.getNewToken(t,o,n)]}}))}))},e.prototype.manageExistingToken=function(e,t,n,i){return o(this,void 0,void 0,(function(){return r(this,(function(o){switch(o.label){case 0:return function(e,t,n){if(!n.vapidKey||!k(t.buffer,n.vapidKey.buffer))return!1;var o=e.endpoint===n.endpoint,r=k(e.getKey("auth"),n.auth),i=k(e.getKey("p256dh"),n.p256dh);return o&&r&&i}
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * 2020.1.15-Changed Modified some methods.
     *                                      Huawei Technologies Co., Ltd.
     */(t,n,i)&&+new Date<i.createTime+6048e5?[2,i.pushToken]:[4,this.deleteTokenFromDB(i.pushToken)];case 1:return o.sent(),[2,this.getNewToken(e,t,n)]}}))}))},e.prototype.getNewToken=function(e,t,n){return o(this,void 0,void 0,(function(){var o,i;return r(this,(function(r){switch(r.label){case 0:return[4,this.subscriptionManager.getToken(this.app,t,n)];case 1:return o=r.sent(),i={swScope:e.scope,vapidKey:n,pushToken:o,createTime:Date.now(),endpoint:t.endpoint,auth:t.getKey("auth"),p256dh:t.getKey("p256dh")},[4,this.tokenDetailsModel.saveTokenDetails(i)];case 2:return r.sent(),[4,this.vapidDetailsModel.saveVapidDetails(e.scope,n)];case 3:return r.sent(),[2,o]}}))}))},e.prototype.deleteToken=function(e){return o(this,void 0,void 0,(function(){var t,n;return r(this,(function(o){switch(o.label){case 0:return[4,this.deleteTokenFromDB(e)];case 1:return o.sent(),[4,this.getSWRegistration_()];case 2:return(t=o.sent())?[4,t.pushManager.getSubscription()]:[3,4];case 3:if(n=o.sent())return[2,n.unsubscribe()];o.label=4;case 4:return[2,!0]}}))}))},e.prototype.deleteTokenFromDB=function(e){return o(this,void 0,void 0,(function(){var t;return r(this,(function(n){switch(n.label){case 0:return[4,this.tokenDetailsModel.deleteToken(e)];case 1:return t=n.sent(),[4,this.subscriptionManager.deleteToken(this.app,t)];case 2:return n.sent(),[2]}}))}))},e.prototype.getPushSubscription=function(e,t){return o(this,void 0,void 0,(function(){var n;return r(this,(function(o){switch(o.label){case 0:return[4,e.pushManager.getSubscription()];case 1:return(n=o.sent())?[2,n]:[2,e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:t})]}}))}))},e.prototype.useServiceWorker=function(e){throw b("only-available-in-window")},e.prototype.usePublicVapidKey=function(e){throw b("only-available-in-window")},e.prototype.onMessage=function(e,t,n){throw b("only-available-in-window")},e.prototype.setBackgroundMessageHandler=function(e){throw b("only-available-in-sw")},e.prototype.delete=function(){return o(this,void 0,void 0,(function(){return r(this,(function(e){switch(e.label){case 0:return[4,Promise.all([this.tokenDetailsModel.closeDatabase(),this.vapidDetailsModel.closeDatabase()])];case 1:return e.sent(),[2]}}))}))},e.prototype.getNotificationPermission_=function(){return Notification.permission},e.prototype.getTokenDetailsModel=function(){return this.tokenDetailsModel},e.prototype.getVapidDetailsModel=function(){return this.vapidDetailsModel},e.prototype.getSubscriptionManager=function(){return this.subscriptionManager},e}();var N=function(e){function i(t){var n=e.call(this,t)||this;return n.bgMessageHandler=null,self.addEventListener("push",(function(e){n.onPush(e)})),self.addEventListener("pushsubscriptionchange",(function(e){n.onSubChange(e)})),self.addEventListener("notificationclick",(function(e){n.onNotificationClick(e)})),n}return t(i,e),i.prototype.onPush=function(e){e.waitUntil(this.onPush_(e))},i.prototype.onSubChange=function(e){e.waitUntil(this.onSubChange_(e))},i.prototype.onNotificationClick=function(e){e.waitUntil(this.onNotificationClick_(e))},i.prototype.onPush_=function(e){return o(this,void 0,void 0,(function(){var t,n,o,i,s,a;return r(this,(function(r){switch(r.label){case 0:if(!e.data)return[2];try{t=e.data.json()}catch(e){return[2]}return[4,this.hasVisibleClients_()];case 1:return r.sent()?[2,this.sendMessageToWindowClients_(t)]:(n=this.getNotificationData_(t))?(o=n.title||"",[4,this.getSWRegistration_()]):[3,3];case 2:return i=r.sent(),s=n.actions,a=Notification.maxActions,s&&a&&s.length>a&&console.warn("This browser only supports "+a+" actions.The remaining actions will not be displayed."),[2,i.showNotification(o,n)];case 3:return this.bgMessageHandler?[4,this.bgMessageHandler(t)]:[3,5];case 4:return r.sent(),[2];case 5:return[2]}}))}))},i.prototype.onSubChange_=function(e){return o(this,void 0,void 0,(function(){var e,t,n;return r(this,(function(o){switch(o.label){case 0:return o.trys.push([0,2,,3]),[4,this.getSWRegistration_()];case 1:return e=o.sent(),[3,3];case 2:throw b("unable-to-resubscribe",{errorInfo:o.sent()});case 3:return o.trys.push([3,5,,8]),[4,e.pushManager.getSubscription()];case 4:return o.sent(),[3,8];case 5:return t=o.sent(),[4,this.getTokenDetailsModel().getTokenDetailsFromSWScope(e.scope)];case 6:if(!(n=o.sent()))throw t;return[4,this.deleteToken(n.pushToken)];case 7:throw o.sent(),t;case 8:return[2]}}))}))},i.prototype.onNotificationClick_=function(e){return o(this,void 0,void 0,(function(){var t,n,o,i;return r(this,(function(r){switch(r.label){case 0:if(!(e.notification&&e.notification.data&&e.notification.data.HMS_MSG))return[2];if(e.action)return[2];if(e.stopImmediatePropagation(),e.notification.close(),!(t=e.notification.data.HMS_MSG).notification)return[2];if(!(n=t.hmsOptions&&t.hmsOptions.link||t.notification.click_action)){if(!t.data||!("huawei.h.m.s_id"in t.data))return[2];n=self.location.origin}return[4,this.getWindowClient_(n)];case 1:return(o=r.sent())?[3,4]:[4,self.clients.openWindow(n)];case 2:return o=r.sent(),[4,(s=3e3,new Promise((function(e){setTimeout(e,s)})))];case 3:return r.sent(),[3,6];case 4:return[4,o.focus()];case 5:o=r.sent(),r.label=6;case 6:return o?(delete t.notification,delete t.hmsOptions,i=W(v.NOTIFICATION_CLICKED,t),[2,this.sendMessageClient_(o,i)]):[2]}var s;
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */}))}))},i.prototype.getNotificationData_=function(e){var t;if(e&&"object"==typeof e.notification){var o=n({},e.notification);return o.data=n(n({},e.notification.data),((t={}).HMS_MSG=e,t)),o}},i.prototype.setBackgroundMessageHandler=function(e){if(!e||"function"!=typeof e)throw b("bg-handler-function-expected");this.bgMessageHandler=e},i.prototype.getWindowClient_=function(e){return o(this,void 0,void 0,(function(){var t,n,o,i;return r(this,(function(r){switch(r.label){case 0:return t=new URL(e,self.location.href).href,[4,x()];case 1:for(n=r.sent(),o=null,i=0;i<n.length;i++)if(new URL(n[i].url,self.location.href).href===t){o=n[i];break}return[2,o]}}))}))},i.prototype.sendMessageClient_=function(e,t){return o(this,void 0,void 0,(function(){return r(this,(function(n){if(!e)throw b("no-window-client-to-msg");return e.postMessage(t),[2]}))}))},i.prototype.hasVisibleClients_=function(){return o(this,void 0,void 0,(function(){return r(this,(function(e){switch(e.label){case 0:return[4,x()];case 1:return[2,e.sent().some((function(e){return"visible"===e.visibilityState&&!e.url.startsWith("chrome-extension://")}))]}}))}))},i.prototype.sendMessageToWindowClients_=function(e){return o(this,void 0,void 0,(function(){var t,n,o=this;return r(this,(function(r){switch(r.label){case 0:return[4,x()];case 1:return t=r.sent(),n=W(v.PUSH_MSG_RECEIVED,e),[4,Promise.all(t.map((function(e){return o.sendMessageClient_(e,n)})))];case 2:return r.sent(),[2]}}))}))},i.prototype.getSWRegistration_=function(){return o(this,void 0,void 0,(function(){return r(this,(function(e){return[2,self.registration]}))}))},i.prototype.getPublicVapidKey_=function(){return o(this,void 0,void 0,(function(){var e,t;return r(this,(function(n){switch(n.label){case 0:return[4,this.getSWRegistration_()];case 1:if(!(e=n.sent()))throw b("sw-registration-expected");return[4,this.getVapidDetailsModel().getVapidFromSWScope(e.scope)];case 2:return(t=n.sent())?[2,t]:[2,w]}}))}))},i}(E);function x(){return self.clients.matchAll({type:"window",includeUncontrolled:!0})}function W(e,t){return{hmsMessagingData:t,hmsMessagingType:e}}
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * 2020.1.15-Changed Modify path name.
     *                                      Huawei Technologies Co., Ltd.
     */
var C=function(e){function n(t){var n,o,r=e.call(this,t)||this;return r.registrationToUse=null,r.publicVapidKeyToUse=null,r.messageObserver=null,r.onMessageInternal=(o=new u((function(e){r.messageObserver=e}),n)).subscribe.bind(o),r.setupSWMessageListener_(),r}return t(n,e),n.prototype.useServiceWorker=function(e){if(!(e instanceof ServiceWorkerRegistration))throw b("sw-registration-expected");if(null!==this.registrationToUse)throw b("use-sw-before-get-token");this.registrationToUse=e},n.prototype.usePublicVapidKey=function(e){if("string"!=typeof e)throw b("invalid-public-vapid-key");if(null!==this.publicVapidKeyToUse)throw b("use-public-key-before-get-token");var t=function(e){for(var t=(e+"=".repeat((4-e.length%4)%4)).replace(/\-/g,"+").replace(/_/g,"/"),n=atob(t),o=new Uint8Array(n.length),r=0;r<n.length;++r)o[r]=n.charCodeAt(r);return o}(e);if(65!==t.length)throw b("public-vapid-key-decryption-failed");this.publicVapidKeyToUse=t},n.prototype.onMessage=function(e,t,n){return"function"==typeof e?this.onMessageInternal(e,t,n):this.onMessageInternal(e)},n.prototype.waitForRegistrationToActivate_=function(e){var t=e.installing||e.waiting||e.active;return new Promise((function(n,o){if(t)if("activated"!==t.state)if("redundant"!==t.state){var r=function(){if("activated"===t.state)n(e);else{if("redundant"!==t.state)return;o(b("sw-reg-redundant"))}t.removeEventListener("statechange",r)};t.addEventListener("statechange",r)}else o(b("sw-reg-redundant"));else n(e);else o(b("no-sw-in-reg"))}))},n.prototype.getSWRegistration_=function(){var e=this;return this.registrationToUse?this.waitForRegistrationToActivate_(this.registrationToUse):(this.registrationToUse=null,navigator.serviceWorker.register("/hms-messaging-sw.js",{scope:"/hms-cloud-messaging-push-scope"}).catch((function(e){throw b("failed-serviceworker-registration",{browserErrorMessage:e.message})})).then((function(t){return e.waitForRegistrationToActivate_(t).then((function(){return e.registrationToUse=t,t.update(),t}))})))},n.prototype.getPublicVapidKey_=function(){return o(this,void 0,void 0,(function(){return r(this,(function(e){return this.publicVapidKeyToUse?[2,this.publicVapidKeyToUse]:[2,w]}))}))},n.prototype.setupSWMessageListener_=function(){var e=this;navigator.serviceWorker.addEventListener("message",(function(t){if(t.data&&t.data.hmsMessagingType&&t.data.hmsMessagingData){var n=t.data.hmsMessagingData;e.messageObserver&&e.messageObserver.next(n)}}),!1)},n}(E);
/**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * 2020.1.15-Changed Modified registerMessaging method.
     *                                      Huawei Technologies Co., Ltd.
     */
function K(e){if(!(self&&"ServiceWorkerGlobalScope"in self?"PushManager"in self&&"Notification"in self&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey"):navigator.cookieEnabled&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")))throw b("unsupported-browser");return self&&"ServiceWorkerGlobalScope"in self?new N(e):new C(e)}function A(e){if(!e.appId||"string"!=typeof e.appId||0===e.appId.length)throw b("bad-app-id",{appId:e.appId});if(!e.projectId||"string"!=typeof e.projectId||0===e.projectId.length)throw b("bad-project-id",{projectId:e.projectId});if(!e.apiKey||"string"!=typeof e.apiKey||0===e.apiKey.length)throw b("bad-api-key",{apiKey:e.apiKey});if(!e.countryCode||"string"!=typeof e.countryCode||0===e.countryCode.length)throw b("bad-country-code",{countryCode:e.countryCode})}var V=new(function(){function e(){this.SDK_VERSION="1.0.0",this.app={}}return e.prototype.initializeApp=function(e,t){if("string"!=typeof(t=t||"[DEFAULT]")||!t)throw b("bad-app-name",{appName:t});if(!e)throw b("bad-options");A(e),this.app={name:t,options:e},this.getBrowserInfo(e)},e.prototype.messaging=function(){return this.checkInit(),K(this.app)},e.prototype.getBrowserInfo=function(e){var t=navigator.userAgent.toLowerCase(),n=t.match(/(firefox|chrome|edge).*?([\d.]+)/),o=t.match(/(edge).*?([\d.]+)/);if(null!=n&&(e.hardware=n[1].replace(/version/,"'safari"),e.model=n[2]),null!=o&&(e.hardware=o[1].replace(/version/,"'safari"),e.model=o[2]),!e.hardware)throw new Error("Use the Edge, Chrome, or Firefox browser!")},e.prototype.checkInit=function(){if(!this.app||!this.app.name||!this.app.options)throw new Error("App not initialized, please init app first!");switch(this.app.options.hardware){case"firefox":this.app.options.hardware="17";break;case"chrome":this.app.options.hardware="18";break;case"edge":this.app.options.hardware="19"}return A(this.app.options),!0},e}());return"object"==typeof self&&self.self===self&&void 0!==self.hms&&d.warn("\n    Warning: You are trying to load Webpush while using Webpush Performance standalone script.\n    You should load Webpush Performance with this instance of Webpush to avoid loading duplicate code.\n    "),V}));
