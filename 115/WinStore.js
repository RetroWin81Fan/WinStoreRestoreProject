/* Copyright (C) Microsoft. All rights reserved. */

function InitWinStoreFlowLayout()
{
var b=WinJS.Utilities,
a=WinJS.Promise,
c=WinJS.UI._ListViewAnimationHelper;
WinJS.Namespace.define("WinStore",{FlowLayout:WinJS.Class.derive(WinJS.UI._LayoutCommon,function()
{
this.init()
},{horizontal:{enumerable:true,"get":function()
{
return false
}},getKeyboardNavigatedItem:function(c,e,b)
{
b=this._adjustDirection(b);
var d;
switch(b)
{
case WinJS.Utilities.Key.upArrow:
case WinJS.Utilities.Key.leftArrow:
d=c-1;
break;
case WinJS.Utilities.Key.downArrow:
case WinJS.Utilities.Key.rightArrow:
d=c+1;
break;
default:
return WinJS.UI._LayoutCommon.prototype.getKeyboardNavigatedItem.call(this,c,e,b)
}
return a.wrap(d)
},setSite:function(a)
{
this._site=a
},startLayout:function(d,c,e)
{
this.to=c;
var b;
if(this.average)
b=Math.ceil((c-d)/this.average);
else
b=10;
this.lastIndex=null;
this.lastItem=null;
return a.wrap({beginIndex:0,endIndex:Math.min(e,b)})
},prepareItem:function(a)
{
a.style.position="relative"
},prepareHeader:function()
{
},layoutItem:function(c,b)
{
var a=this._getItemInfo(c);
if(b!==a.element||a.width!==this._width)
{
a.element=b;
a.width=this._width;
b.style.width=this._width+"px"
}
this.lastIndex=c;
this.lastItem=b
},layoutHeader:function()
{
},endLayout:function()
{
var e,
f;
if(this._animateEndLayout)
{
f=new a(function(a)
{
e=a
});
this._animateEndLayout=false;
for(var g={},
d=0,
m=this._cachedInserted.length;d<m;d++)
{
var j=this._cachedInserted[d];
g[j.uniqueID]={element:j}
}
this._cachedInserted=[];
this._trackedAnimation=c.animateListReflow(this._trackedAnimation,this._site.surface,{},g,{});
var l=this;
function h()
{
l._trackedAnimation=null;
e()
}
this._trackedAnimation.getCompletionPromise().done(h,h)
}
var i=this._site.scrollbarPos+this.to,
b=this.lastItem.offsetTop+this.lastItem.offsetHeight,
k;
this.average=b/(this.lastIndex+1);
if(b<i)
k=this.lastIndex+Math.ceil((i-b)/this.average)+1;
return {animationPromise:f,newEndIndex:k}
},calculateFirstVisible:function(d,i)
{
for(var h=this._site.surface.childNodes,
g=0,
c=0,
k=h.length;c<k;c++)
{
var f=h[c],
e=f.offsetTop,
j=e+f.offsetHeight;
if(!b.hasClass(f,WinJS.UI._wrapperClass))
g++;
if(d>=e&&d<j)
{
var l=i&&d>e?c+1:c;
return a.wrap(l-g)
}
}
return a.wrap(-1)
},calculateLastVisible:function(j,k)
{
for(var d=j+1,
e=this._site.surface.childNodes,
g=0,
c=0,
l=e.length;c<l;c++)
{
var f=e[c],
h=f.offsetTop,
i=h+f.offsetHeight;
if(!b.hasClass(f,WinJS.UI._wrapperClass))
g++;
if(d>h&&d<=i)
{
var m=k&&d<i?c-1:c;
return a.wrap(m-g)
}
}
return a.wrap(e.length)
},getItemPosition:function(d)
{
var e=this._getItemInfo(d),
c=e.element;
return a.wrap(c?{left:c.offsetLeft,offset:c.offsetLeft,top:c.offsetTop,contentWidth:b.getContentWidth(c),contentHeight:b.getContentHeight(c),totalWidth:b.getTotalWidth(c),totalHeight:b.getTotalHeight(c)}:{})
},getItemOffset:function(d)
{
var e=this._getItemInfo(d),
c=e.element;
return a.wrap({begin:c.offsetTop,end:c.offsetTop+b.getTotalHeight(c)})
},getScrollbarRange:function()
{
return a.wrap({beginScrollPosition:0,endScrollPosition:this.lastItem!=null?this.lastItem.offsetTop+this.lastItem.offsetHeight:0})
},itemsAdded:function(a)
{
return this._dataModified(a,[])
},itemsRemoved:function(a)
{
return this._dataModified([],a)
},_dataModified:function(b,c)
{
if(b&&b.length>0)
{
this._animateEndLayout=true;
this._cachedInserted=b
}
for(var a=0,
d=c.length;a<d;a++)
c[a].parentNode.removeChild(c[a])
}})})
}
function onSystemSettingsChanged(b)
{
if(b.animationsEnabled)
WinJS.UI.enableAnimations();
else
WinJS.UI.disableAnimations();
if(b.bi)
{
var a=b.bi.StoreFlightId;
if(a===undefined||a===null)
a="0";
om.flightId=a;
WinStore.BI.init(b.bi)
}
}
function Callback(d,b,c,a)
{
this.fn=d;
this.context=b!==undefined?b:null;
this.seqNum=c;
this.invoke=function(a)
{
this.fn&&
this.fn(a,this.context)
};
this.acrossPages=a!==undefined?a:false
}
function OMProxy()
{
this.rgCallbacks=[];
this.nextCallbackSeqNum=1;
this.namespace=null;
this.loggingLevel=4;
this.flightId="0";
this.setCallback=function(b,d,c)
{
var a=-1;
if(b)
{
for(a=0;a<this.rgCallbacks.length;a++)
if(!this.rgCallbacks[a])
break;
if(this.nextCallbackSeqNum<2147483647)
this.nextCallbackSeqNum++;
else
this.nextCallbackSeqNum=1;
this.rgCallbacks[a]=new Callback(b,d,this.nextCallbackSeqNum,c)
}
return {callbackIndex:a,callbackSeqNum:this.nextCallbackSeqNum}
};
this.clearCallback=function(b)
{
if(b)
{
var a=b.callbackIndex;
if(a!==undefined&&a>=0&&a<this.rgCallbacks.length)
{
var c=this.rgCallbacks[a];
if(c&&b.callbackSeqNum===c.seqNum)
this.rgCallbacks[a]=null
}
}
};
this.invalidateCallbacks=function()
{
om.logInfoMessage("om.invalidateCallbacks: invalidating callbacks");
for(var c=this.rgCallbacks.length,
a=0;a<c;a++)
{
var b=this.rgCallbacks[a];
if(b&&!b.acrossPages)
this.rgCallbacks[a]=null
}
};
this.invokeCallback=function(a)
{
var f=true,
b,
c,
d=a.callbackId;
if(d)
{
b=d.callbackIndex;
c=d.callbackSeqNum
}
if(b!==undefined&&b>=0&&b<this.rgCallbacks.length)
{
var e=this.rgCallbacks[b];
if(e&&c===e.seqNum)
{
this.rgCallbacks[b]=null;
e.invoke(a.returnValue)
}
else
this.logWarningMessage("Late invokeCallback for method "+a.method+" at index "+b+" with seqNum "+c)
}
else
if(a.method==="installProgressEvent")
{
WinStore.Installer.onInstallProgress(a.progressData);
WinStore.UpdatesPage.onInstallProgress(a.progressData)
}
else
if(a.method==="downloadManagerEvent")
{
WinStore.InstallsPage.onInstallProgress(a.progressData);
WinStore.PDP.onInstallProgress(a.progressData);
WinStore.Navigation.onInstallProgress(a.progressData)
}
else
if(a.method==="licensedAppsEvent")
{
WinStore.Utilities._licensedAppsRefreshRequested=false;
if(a.licensedApps.length)
{
WinStore.Utilities._licensedAppsLastRefresh=Date.now();
WinStore.Utilities.makePFNKeyedLicensedAppsMap(a.licensedApps);
WinStore.Navigation.invalidateHomePage()
}
WinStore.PDP.onLicenseInstallData();
WinStore.ReviewPage.onLicenseInstallData()
}
else
if(a.method==="purchaseProgressEvent")
{
WinStore.PDP.onPurchaseProgress(a.progressData);
WinStore.TopicPage.onPurchaseProgress(a.progressData);
onUpgradePurchaseProgress(a.progressData)
}
else
if(a.method==="navigateAjax")
WinStore.Navigation.onAjaxPageLoaded(a);
else
if(a.method==="resumeEvent")
WinStore.Navigation.onResumeEvent(a);
else
if(a.method==="suspendEvent")
WinStore.Navigation.onSuspendEvent(a);
else
if(a.method==="systemSettingsChanged")
onSystemSettingsChanged(a);
else
if(a.method==="navBackKeyClicked")
navBackKeyClicked();
else
if(a.method==="updateCountEvent")
WinStore.Installer.onUpdateCountEvent(a.updateCount);
else
if(a.method==="sharingEvent")
WinStore.Frame.onSharingCallback();
else
if(a.method==="focusSearchBox")
focusSearchBox();
else
if(a.method==="redeemStoredValueTokenResponse")
WinStore.Settings.onRedeemStoredValueResponse(a.redeemResponse);
else
{
f=false;
this.logWarningMessage("Late/invalid invokeCallback for method "+a.method+" at index "+b+" with seqNum "+c)
}
return f
};
this.invokeWithPromise=function(a)
{
var b=this;
return new WinJS.Promise(function(c)
{
a.callbackId=b.setCallback(c);
top.postMessage(a,wsOrigin)
},function()
{
b.clearCallback(a.callbackId)
})
},this.invokeProperty=function(c,a,b)
{
var d={method:c,callbackId:this.setCallback(a,b)};
top.postMessage(d,wsOrigin)
};
this.invokeSimpleMethod=function(a)
{
var b={method:a};
top.postMessage(b,wsOrigin)
};
this.invoke3REtwMethod=function(b,d,c,a)
{
var e={start:d,method:b,appId:c,context:a};
top.postMessage(e,wsOrigin)
};
this.invoke3REtwSimpleMethod=function(a,c,b)
{
this.invoke3REtwMethod(a,c,b,"")
};
this.getNamespace=function(a,b)
{
this.invokeProperty("getNamespace",a,b)
};
this.getBI=function(a,b)
{
this.invokeProperty("getBI",a,b)
};
this.setSessionId=function(a)
{
var b={method:"setSessionId",sessionId:a};
top.postMessage(b,wsOrigin)
};
this.setMuid=function(b)
{
var a={method:"setMuid",muid:b};
top.postMessage(a,wsOrigin)
};
this.sendBingLoggingRequest=function(d)
{
for(var b="",
c=d.headers,
g=c.length,
a=0;a<g;a++)
{
var e=c[a];
b+=e.name+":"+e.value+"\r\n"
}
var f={method:"sendBingLoggingRequest",headers:b.trim(),body:JSON.stringify(d.body)};
top.postMessage(f,wsOrigin)
};
this.canGoBack=function(a,b)
{
this.invokeProperty("canGoBack",a,b)
};
this.getShowPicksForYou=function()
{
return this.invokeWithPromise({method:"showPicksForYou"})
};
this.getActiveInstallSummary=function(a,b)
{
this.invokeProperty("getActiveInstallSummary",a,b)
};
this.getActiveInstalls=function(a,b)
{
this.invokeProperty("getActiveInstalls",a,b)
};
this.getImageData=function()
{
return this.invokeWithPromise({method:"getImageUrlRoot"})
};
this._homePageData=null;
this.getHomePageData=function(a,b)
{
var c={method:"getHomePageData",callbackId:this.setCallback(function(c)
{
var d=JSON.stringify(c).toLowerCase();
om._homePageData&&om._homePageData!==d&&
WinStore.Category.loadFeatureData(c).then(WinStore.Navigation.invalidateHomePage());
om._homePageData=d;
a(c,b)
})};
top.postMessage(c,wsOrigin)
};
this.getUserReview=function(a)
{
var b={method:"getUserReview",appId:a};
return this.invokeWithPromise(b)
};
this.getRatings=function(b,a)
{
var c={method:"getRatings",appId:b,releaseId:a};
return this.invokeWithPromise(c)
};
this.getAppInfo=function(a)
{
var b={method:"getAppInfo",appId:a};
return this.invokeWithPromise(b)
};
this.getAppInfoByRelease=function(b,a)
{
var c={method:"getAppInfoByRelease",appId:b,releaseId:a};
return this.invokeWithPromise(c)
};
this.getInAppInfo=function(c,a,b)
{
var d={method:"getInAppInfo",appId:c,callbackId:this.setCallback(a,b)};
top.postMessage(d,wsOrigin)
};
this.getFeaturedAppList=function(c,a,b)
{
var d={method:"getFeaturedAppList",listId:c,callbackId:this.setCallback(a,b)};
top.postMessage(d,wsOrigin)
};
this.onSearchQueryChanged=function(b,a,c,d,e)
{
var f={method:"onSearchQueryChanged",queryText:b,inputLanguage:a,requestId:c,callbackId:this.setCallback(d,e)};
top.postMessage(f,wsOrigin)
};
this.onResultSuggestionChosen=function(a)
{
var b={method:"onResultSuggestionChosen",appID:a};
top.postMessage(b,wsOrigin)
};
this.onSearchQuerySubmitted=function(b,a)
{
var c={method:"onSearchQuerySubmitted",queryText:b,inputLanguage:a};
top.postMessage(c,wsOrigin)
};
this.getSearchImage=function(a,d,h,b,i,f,c,e)
{
var g={method:"getSearchImage",relativeImage:a,imageUrl:d,bkgd:h,largeImage:b,guid:i,index:f,callbackId:this.setCallback(c,e,true)};
top.postMessage(g,wsOrigin)
};
this.showMessageDialog=function(e,f,c,a,b,d)
{
var g={method:"showMessageDialog",message:e,title:f,buttons:c,cancelCommandIndex:a,callbackId:this.setCallback(b,d)};
top.postMessage(g,wsOrigin)
};
this.launchPcsFlow=function(a)
{
var b={method:"launchPcsFlow",pcsUrl:a};
top.postMessage(b,wsOrigin)
};
this.getAppList=function(b,g,c,d,e,f)
{
var a={method:"getAppList",controlType:b,listId:g,queryString:c,pageIndex:d,callbackId:this.setCallback(e,f)};
top.postMessage(a,wsOrigin);
return a.callbackId
};
this.getDataGeneratedLists=function(e,a,d,b,c)
{
var f={method:"getDataGeneratedLists",listId:e,categoryId:a,maxApps:d,callbackId:this.setCallback(b,c)};
top.postMessage(f,wsOrigin)
};
this.getPicksForYou=function(a,d,b,c)
{
var e={method:"getPicksForYou",categoryId:a,maxApps:d,callbackId:this.setCallback(b,c)};
top.postMessage(e,wsOrigin)
};
this.getSimilarApps=function(d,c,a,b)
{
var e={method:"getSimilarApps",appId:d,maxApps:c,callbackId:this.setCallback(a,b)};
top.postMessage(e,wsOrigin)
};
this.getAppsByDeveloper=function(a,d,b,c)
{
var e={method:"getAppsByDeveloper",developerName:a,maxApps:d,callbackId:this.setCallback(b,c)};
top.postMessage(e,wsOrigin)
};
this.getTopicList=function(d,c,a,b)
{
var e={method:"getTopicList",topicId:d,maxApps:c,callbackId:this.setCallback(a,b)};
top.postMessage(e,wsOrigin)
};
this.getCategoryList=function(a,d,b,c)
{
var e={method:"getCategoryList",categoryId:a,maxApps:d,callbackId:this.setCallback(b,c)};
top.postMessage(e,wsOrigin)
};
this.invalidateCachedUserReview=function(a)
{
var b={method:"invalidateCachedUserReview",appId:a};
top.postMessage(b,wsOrigin)
};
this.getAppReviewList=function(g,d,b,a,e,c,f)
{
var h={method:"getAppReviewList",appId:g,releaseId:d,ratingFilter:b,versionFilter:a,sortOrder:e,startIndex:c,cReviews:f};
return this.invokeWithPromise(h)
};
this.getSettings=function(a,b)
{
var c={method:"getSettings",callbackId:this.setCallback(a,b)};
top.postMessage(c,wsOrigin)
};
this.saveSettings=function(a,b,c)
{
var d={method:"saveSettings",settings:a,callbackId:this.setCallback(b,c)};
top.postMessage(d,wsOrigin)
};
this.goBack=function()
{
this.invokeSimpleMethod("goBack")
};
this.showHomePage=function()
{
this.invokeSimpleMethod("showHomePage")
};
this.showReacquirePage=function()
{
this.invokeSimpleMethod("showReacquirePage")
};
this.showUpdatesPage=function(a)
{
var b={method:"showUpdatesPage",rescan:a};
top.postMessage(b,wsOrigin)
};
this.showInstallsPage=function(a)
{
var b={method:"showInstallsPage",writeTravelLog:a};
top.postMessage(b,wsOrigin)
};
this.showSettingsPage=function(a,c)
{
var b={method:"showSettingsPage",page:a,url:c};
top.postMessage(b,wsOrigin)
};
this.navigateToErrorPage=function(a)
{
var b={method:"navigateToErrorPage",message:a};
top.postMessage(b,wsOrigin)
};
this.showResultsView=function(a)
{
var b={method:"showResultsView",params:a};
top.postMessage(b,wsOrigin)
};
this.showCategoryHub=function(a)
{
var b={method:"showCategoryHub",params:a};
top.postMessage(b,wsOrigin)
};
this.showTopicPage=function(a)
{
var b={method:"showTopicPage",params:a};
top.postMessage(b,wsOrigin)
};
this.showPDP=function(a)
{
var b={method:"showPDP",appId:a};
top.postMessage(b,wsOrigin)
};
this.showReviewPage=function(a)
{
var b={method:"showReviewPage",appId:a};
top.postMessage(b,wsOrigin)
};
this.showReviewListPage=function(a)
{
var b={method:"showReviewListPage",appId:a};
top.postMessage(b,wsOrigin)
};
this.showReportProblemPage=function(b)
{
var a={method:"showReportProblemPage",url:b};
top.postMessage(a,wsOrigin)
};
this.setHelpfulnessVote=function(e,a,c,b,d)
{
var f={method:"setHelpfulnessVote",appId:e,reviewId:a,helpful:c,callbackId:this.setCallback(b,d)};
top.postMessage(f,wsOrigin)
};
this.submitRating=function(g,a,f,c,d,e,b,h)
{
var i={method:"submitRating",appId:g,packageFamilyName:a,title:f,comment:c,rating:d,version:e,osVersion:b,trial:h};
top.postMessage(i,wsOrigin)
};
this.submitReview=function(h,a,i,d,f,g,b,j,c,e)
{
var k={method:"submitReview",appId:h,packageFamilyName:a,title:i,comment:d,rating:f,version:g,osVersion:b,trial:j,callbackId:this.setCallback(c,e)};
top.postMessage(k,wsOrigin)
};
this.submitAppProblem=function(e,a,c,b,d)
{
var f={method:"submitAppProblem",appId:e,category:a,details:c,callbackId:this.setCallback(b,d)};
top.postMessage(f,wsOrigin)
};
this.submitReviewProblem=function(f,b,a,d,c,e)
{
var g={method:"submitReviewProblem",appId:f,reviewId:b,category:a,details:d,callbackId:this.setCallback(c,e)};
top.postMessage(g,wsOrigin)
};
this.redeemToken=function(f,g,e,a,d,b,c)
{
var h={method:"redeemToken",tokenId:f,appId:g,appName:e,inAppOfferToken:a,updateId:d,appLanguage:b,appPrice:c};
top.postMessage(h,wsOrigin)
};
this.purchase=function(d,g,f,a,c,e,b)
{
om.logInfoMessage("om.purchase(ID = "+String(d)+", lang = "+String(a)+", price = "+String(c)+", type = "+String(e)+", remediation = "+String(b)+")");
var h={method:"purchase",appId:d,appName:g,updateId:f,appLanguage:a,appPrice:c,type:e,remediation:b};
top.postMessage(h,wsOrigin)
};
this.resumePurchase=function(d,g,f,a,c,e,b)
{
om.logInfoMessage("om.resumePurchase(ID = "+String(d)+", lang = "+String(a)+", price = "+String(c)+", type = "+String(e)+", response3ds = "+String(b)+")");
var h={method:"resumePurchase",appId:d,appName:g,updateId:f,appLanguage:a,appPrice:c,type:e,response3ds:b};
top.postMessage(h,wsOrigin)
};
this.resumeAsyncPurchase=function(c,f,e,a,b,d,h)
{
om.logInfoMessage("om.resumeAsyncPurchase(ID = "+String(c)+", lang = "+String(a)+", price = "+String(b)+")");
var g={method:"resumeAsyncPurchase",appId:c,appName:f,updateId:e,appLanguage:a,appPrice:b,transactionId:d,pfn:h};
top.postMessage(g,wsOrigin)
};
this.getMachineList=function(a,b)
{
var c={method:"getMachineList",callbackId:this.setCallback(a,b)};
top.postMessage(c,wsOrigin)
};
this.removeMachine=function(a,b,c)
{
var d={method:"removeMachine",machineId:a,callbackId:this.setCallback(b,c)};
top.postMessage(d,wsOrigin)
};
this.getYourAppsList=function(a,d,b,c)
{
var e={method:"getYourAppsList",machineId:a,sortBy:d,callbackId:this.setCallback(b,c)};
top.postMessage(e,wsOrigin)
};
this.syncLicenses=function(c,a,b)
{
var d={method:"syncLicenses",bSyncAll:c,callbackId:this.setCallback(a,b)};
top.postMessage(d,wsOrigin)
};
this.installApps=function(b,c,a)
{
var d={method:"installApps",topicId:c,isUpdates:a,ItemIds:b};
top.postMessage(d,wsOrigin)
};
this.refreshLicensedAppList=function()
{
var a={method:"refreshLicensedAppList"};
top.postMessage(a,wsOrigin)
};
this.getUpdatesList=function(c,a,b)
{
var d={method:"getUpdatesList",rescan:c,callbackId:this.setCallback(a,b)};
top.postMessage(d,wsOrigin)
};
this.retryInstallation=function(a)
{
var b={method:"retryInstallation",appId:a};
top.postMessage(b,wsOrigin)
};
this.cancelInstallation=function(a)
{
var b={method:"cancelInstallation",appId:a};
top.postMessage(b,wsOrigin)
};
this.pauseInstallation=function(a)
{
var b={method:"pauseInstallation",appId:a};
top.postMessage(b,wsOrigin)
};
this.resumeInstallation=function(a)
{
var b={method:"resumeInstallation",appId:a};
top.postMessage(b,wsOrigin)
};
this.setSharingData=function(a)
{
var b={method:"setSharingData",sharingData:a};
top.postMessage(b,wsOrigin)
};
this.logVerboseMessage=function(b)
{
if(om.loggingLevel>=4)
{
var a={method:"logMessage",type:4,message:b};
top.postMessage(a,wsOrigin)
}
};
this.logInfoMessage=function(b)
{
if(om.loggingLevel>=3)
{
var a={method:"logMessage",type:3,message:b};
top.postMessage(a,wsOrigin)
}
};
this.logWarningMessage=function(b)
{
if(om.loggingLevel>=2)
{
var a={method:"logMessage",type:2,message:b};
top.postMessage(a,wsOrigin)
}
};
this.logErrorMessage=function(b)
{
if(om.loggingLevel>=1)
{
var a={method:"logMessage",type:1,message:b};
top.postMessage(a,wsOrigin)
}
};
this.etwListInit=function(d,b,c,a)
{
var e={method:"etwListInit",start:d,interactive:false,listType:b,listId:c,categoryId:a,appCount:0};
top.postMessage(e,wsOrigin)
};
this.etwListInitInteractive=function(b,a)
{
var c={method:"etwListInit",start:false,interactive:true,listType:b,listId:"",categoryId:a,appCount:0};
top.postMessage(c,wsOrigin)
};
this.etwSearchResultsInteractive=function(b,a)
{
var c={method:"etwListInit",start:false,interactive:true,listType:b,listId:"",categoryId:"",appCount:a};
top.postMessage(c,wsOrigin)
};
this.etwResultsListRestored=function()
{
this.invokeSimpleMethod("etwResultsListRestored")
};
this.etwHomeListInit=function(a)
{
var b={method:"etwListInit",start:a,interactive:false,listType:"home",listId:"",categoryId:"",appCount:0};
top.postMessage(b,wsOrigin)
};
this.etwHomeListInitInteractive=function()
{
var a={method:"etwListInit",start:false,interactive:true,listType:"home",listId:"",categoryId:"",appCount:0};
top.postMessage(a,wsOrigin)
};
this.etwHomeListRestored=function()
{
this.invokeSimpleMethod("etwHomeListRestored")
};
this.etwTileClicked=function(a,c)
{
var b={method:"etwTileClicked",tileType:a,id:c};
top.postMessage(b,wsOrigin)
};
this.etwGroupTitleClicked=function(a)
{
var b={method:"etwGroupTitleClicked",categoryId:a};
top.postMessage(b,wsOrigin)
};
this.etwFilterSortSelected=function(b,a,c)
{
var d={method:"etwFilterSortSelected",controlId:b,optionText:a,optionVal:c};
top.postMessage(d,wsOrigin)
};
this.etwPDPOpenStart=function(a)
{
var b={method:"etwPDPOpenStart",appId:a};
top.postMessage(b,wsOrigin)
};
this.etwPDPAcquisitionInitiationStart=function(d,c,b,a)
{
var e={method:"etwPDPAcquisitionInitiationStart",appId:d,action:c,appType:b,appVersion:a};
top.postMessage(e,wsOrigin)
};
this.etwPDPAcquisitionProgressStart=function(d,c,b,a)
{
var e={method:"etwPDPAcquisitionProgressStart",appId:d,action:c,appType:b,appVersion:a};
top.postMessage(e,wsOrigin)
};
this.etwPDPTabClicked=function(a,c)
{
var b={method:"etwPDPTabClicked",appId:a,tab:c};
top.postMessage(b,wsOrigin)
};
this.etwPDPScreenShot=function(b,a)
{
var c={method:"etwPDPScreenShot",appId:b,screenshot:a};
top.postMessage(c,wsOrigin)
};
this.etwPDPOpenStop=function()
{
this.invokeSimpleMethod("etwPDPOpenStop")
};
this.etwPDPAcquisitionInitiationStop=function()
{
this.invokeSimpleMethod("etwPDPAcquisitionInitiationStop")
};
this.etwPDPMetadataStop=function()
{
this.invokeSimpleMethod("etwPDPMetadataStop")
};
this.etwPDPLicenseInstallStop=function()
{
this.invokeSimpleMethod("etwPDPLicenseInstallStop")
};
this.etwUpdateListInit=function()
{
this.invokeSimpleMethod("etwUpdateListInit")
};
this.etwSettingsPageLoadComplete=function()
{
this.invokeSimpleMethod("etwSettingsPageLoadComplete")
};
this.etwRrrDisplaySubmitReviewPageStart=function(b,a)
{
this.invoke3REtwMethod("etwRrrDisplaySubmitReviewPage",true,b,a)
};
this.etwRrrDisplaySubmitReviewPageStop=function(a)
{
this.invoke3REtwSimpleMethod("etwRrrDisplaySubmitReviewPage",false,a)
};
this.etwRrrDisplaySubmitAppProblemPageStart=function(a)
{
this.invoke3REtwSimpleMethod("etwRrrDisplaySubmitAppProblemPage",true,a)
};
this.etwRrrDisplaySubmitAppProblemPageStop=function(a)
{
this.invoke3REtwSimpleMethod("etwRrrDisplaySubmitAppProblemPage",false,a)
};
this.etwRrrSubmitHelpfulnessVoteStart=function(b,a)
{
this.invoke3REtwMethod("etwRrrSubmitHelpfulnessVote",true,b,a)
};
this.etwRrrSubmitHelpfulnessVoteStop=function(b,a)
{
this.invoke3REtwMethod("etwRrrSubmitHelpfulnessVote",false,b,a)
};
this.etwRrrSubmitReportReviewStart=function(b,a)
{
this.invoke3REtwMethod("etwRrrSubmitReportReview",true,b,a)
};
this.etwRrrSubmitReportReviewStop=function(b,a)
{
this.invoke3REtwMethod("etwRrrSubmitReportReview",false,b,a)
};
this.etwRrrSubmitReviewStart=function(a)
{
this.invoke3REtwSimpleMethod("etwRrrSubmitReview",true,a)
};
this.etwRrrSubmitReviewStop=function(a)
{
this.invoke3REtwSimpleMethod("etwRrrSubmitReview",false,a)
};
this.etwRrrSubmitAppProblemStart=function(a)
{
this.invoke3REtwSimpleMethod("etwRrrSubmitAppProblem",true,a)
};
this.etwRrrSubmitAppProblemStop=function(a)
{
this.invoke3REtwSimpleMethod("etwRrrSubmitAppProblem",false,a)
};
this.etwRrrReviewListSortStart=function(b,a)
{
this.invoke3REtwMethod("etwRrrReviewListSort",true,b,a)
};
this.etwRrrReviewListSortStop=function(a)
{
this.invoke3REtwSimpleMethod("etwRrrReviewListSort",false,a)
};
this.etwRrrReviewListLoadPageStart=function(b,a)
{
this.invoke3REtwMethod("etwRrrReviewListLoadPage",true,b,a)
};
this.etwRrrReviewListLoadPageStop=function(b,a)
{
this.invoke3REtwMethod("etwRrrReviewListLoadPage",false,b,a)
};
this.etwRrrReviewTabClickStart=function(a)
{
this.invoke3REtwSimpleMethod("etwRrrReviewTabClick",true,a)
};
this.etwRrrReviewTabClickStop=function(a)
{
this.invoke3REtwSimpleMethod("etwRrrReviewTabClick",false,a)
};
this.etwReacquireListInit=function(a)
{
var b={method:"etwReacquireListInit",cItems:a};
top.postMessage(b,wsOrigin)
};
this.etwPCSFrameOpen=function(a)
{
var b={fStart:a,method:"etwPCSFrameOpen"};
top.postMessage(b,wsOrigin)
};
this.etwEvent=function(a,c)
{
var b={fStart:a,str:c,method:"etwEvent"};
top.postMessage(b,wsOrigin)
};
this.etwPageLoaded=function(b)
{
var a={str:b,method:"etwPageLoaded"};
top.postMessage(a,wsOrigin)
};
this.onAjaxPageLoadComplete=function()
{
var a={method:"onAjaxPageLoadComplete"};
top.postMessage(a,wsOrigin)
};
this.onAjaxPageUnloadComplete=function(a,b)
{
var c={method:"onAjaxPageUnloadComplete",idToHide:a,idToShow:b};
top.postMessage(c,wsOrigin)
};
this.authenticateUser=function(a,b,c)
{
var d={method:"authenticateUser",authType:a,callbackId:this.setCallback(b,c)};
top.postMessage(d,wsOrigin)
};
this.getStoreAccountDetails=function(a,b)
{
var c={method:"getStoreAccountDetails",callbackId:this.setCallback(a,b)};
top.postMessage(c,wsOrigin)
};
this.getConnectedAccountDetails=function(a,b)
{
var c={method:"getConnectedAccountDetails",callbackId:this.setCallback(a,b)};
top.postMessage(c,wsOrigin)
};
this.signout=function()
{
WinStore.BI.setClientAnid("");
this.invokeSimpleMethod("signout")
};
this.getPCSDetails=function(a,b)
{
var c={method:"getPCSDetails",callbackId:this.setCallback(a,b)};
top.postMessage(c,wsOrigin)
};
this.redeemStoredValueToken=function(a,b)
{
var c={method:"redeemStoredValueToken",callbackId:this.setCallback(a),csvToken:b};
top.postMessage(c,wsOrigin)
};
this.startPIAttach=function(a)
{
var b={method:"startPIAttach",callbackId:this.setCallback(a)};
top.postMessage(b,wsOrigin)
};
this.continuePIAttachFromPCS=function(b,a,d)
{
var c={method:"continuePIAttachFromPCS",callbackId:this.setCallback(b),accountId:a,piid:d};
top.postMessage(c,wsOrigin)
};
this.lookupToken=function(a,b)
{
var c={method:"lookupToken",callbackId:this.setCallback(a),token:b};
top.postMessage(c,wsOrigin)
};
this.getAVVendorName=function(a,b)
{
var c={method:"getAVVendorName",callbackId:this.setCallback(a,b)};
top.postMessage(c,wsOrigin)
};
this.showPCS=function(a)
{
var b={method:"showPCS",strPiContextParam:a};
top.postMessage(b,wsOrigin)
};
this.showPurchasePDP=function(a)
{
var b={method:"showPurchasePDP",purchaseQuery:a};
top.postMessage(b,wsOrigin)
};
this.setupPaymentAccount=function(a,e,b,c,d)
{
var f={method:"setupPaymentAccount",accountid:a,piid:e,biSource:b,callbackId:this.setCallback(c,d)};
top.postMessage(f,wsOrigin)
};
this.getPaymentSettings=function(a,b)
{
var c={method:"getPaymentSettings",callbackId:this.setCallback(a,b)};
top.postMessage(c,wsOrigin)
};
this.updateTravelLogCurrentPageParams=function(a)
{
var b={method:"updateTravelLogCurrentPageParams",params:encodeURIComponent(a)};
top.postMessage(b,wsOrigin)
};
this.updateTravelLogPreviousPageParams=function(a)
{
var b={method:"updateTravelLogPreviousPageParams",params:encodeURIComponent(a)};
top.postMessage(b,wsOrigin)
};
this.updateTravelLogCurrentPageData=function(c,a)
{
var b={method:"updateTravelLogCurrentPageData",url:c,pageData:a};
top.postMessage(b,wsOrigin)
};
this.getTravelLogCurrentPageData=function()
{
return this.invokeWithPromise({method:"getTravelLogCurrentPageData"})
};
this.removeCurrentPageFromTravelLog=function()
{
this.invokeSimpleMethod("removeCurrentPageFromTravelLog")
};
this.suspendComplete=function()
{
this.invokeSimpleMethod("suspendComplete")
};
this.clearAuthenticatedAppId=function()
{
this.invokeSimpleMethod("clearAuthenticatedAppId")
};
this._splashScreenVisible=true;
this.hideSplashScreen=function()
{
if(this._splashScreenVisible)
{
this.invokeSimpleMethod("hideSplashScreen");
this._splashScreenVisible=false
}
};
this.isUserLoggedIn=function(a,b)
{
this.invokeProperty("isUserLoggedIn",a,b)
};
this.getUserCID=function()
{
return this.invokeWithPromise({method:"getUserCID"})
};
this.showOSUpgradePage=function(a)
{
var b={method:"showOSUpgradePage",referrer:a};
top.postMessage(b,wsOrigin)
};
this.getOSUpgradeInfo=function(a,b)
{
var c={method:"getOSUpgradeInfo",callbackId:this.setCallback(a,b)};
top.postMessage(c,wsOrigin)
};
this.onUpgradeInstallUserActionClick=function(b,c)
{
var a={method:"onUpgradeInstallUserActionClick",hwnd:b,uMsg:c};
top.postMessage(a,wsOrigin)
};
this.isOSUpgradeRebootPending=function(a,b)
{
this.invokeProperty("isOSUpgradeRebootPending",a,b)
};
this.getLoggingLevel=function(a,b)
{
var c={method:"getLoggingLevel",callbackId:this.setCallback(a,b)};
top.postMessage(c,wsOrigin)
};
this.unhandledException=function(b,c,a)
{
var d={method:"unhandledException",errMsg:b,errUrl:c,errLine:a};
top.postMessage(d,wsOrigin)
};
this.submitTuningRecs=function(b,a)
{
var c={method:"submitTuningRecs",entityIds:b,impressionGuid:a};
top.postMessage(c,wsOrigin)
};
this.formatNumber=function(d,a,b)
{
var c={method:"formatNumber",number:d,callbackId:this.setCallback(a,b)};
top.postMessage(c,wsOrigin)
};
this.qosScenarioFailWithInit=function(a,c,b)
{
var d={method:"qosScenarioFailWithInit",qsid:a,hrError:c,failedApi:b};
top.postMessage(d,wsOrigin)
};
this.showInWebBrowser=function(b)
{
var a={method:"showInWebBrowser",url:b};
top.postMessage(a,wsOrigin)
};
this.logUserClickAction=function(a)
{
var c=a;
if(a.id!==undefined)
c=a.id;
var d=null;
if(typeof a!=="string")
d=a.getAttribute("appID");
var b="";
while(a)
{
a=a.parentNode;
if(a&&a.id!==undefined)
b=a.id+" : "+b
}
var e={method:"logUserClickAction",controlId:c,parentPath:b,appId:d};
top.postMessage(e,wsOrigin)
}
}
function navBackKeyClicked()
{
om&&
WinStore.Navigation.onBackClicked(true)
}
function focusSearchBox()
{
if(!WinStore.Search.IsSearchBoxActive())
{
WinStore.Search.ShowSearchControl();
return false
}
}
function onKeyDownFrame(a)
{
if("Enter"===a.key&&isSearchBoxActive())
{
WinStore.Search.IsSearching=true;
a.preventDefault()
}
else
a.key==="e"&&a.ctrlKey&&
focusSearchBox()
}
function isSearchBoxActive()
{
return WinStore.Search.IsSearchBoxActive()
}
function isRedeemTokenBoxActive()
{
return document.activeElement&&document.activeElement.id==="settingsRedeemTokenTextBox"
}
function onKeyUpFrame(b)
{
if("Enter"===b.key||"Spacebar"===b.key)
{
if(WinStore.Search.IsSearching!==true)
{
var a=document.activeElement;
if(a&&a.tagName&&a.tagName.toLowerCase()!=="button"&&!WinJS.Utilities.hasClass(a,"groupHeader")&&!WinJS.Utilities.hasClass(a,"appUpdReacqTile")&&(!a.id||(a.id.indexOf("tile_")===-1||WinJS.Utilities.hasClass(a.parentNode,"hubPageSectionTileContainer"))||"Spacebar"===b.key&&!a.getAttribute("aria-selected")))
{
var c=document.createEvent("Event");
c.initEvent("click",true,true);
a.dispatchEvent(c)
}
}
WinStore.Search.IsSearching=false
}
else
(b.key==="Left"&&b.altKey||b.key==="BrowserBack")&&
navBackKeyClicked()
}
function onKeyPressFrame(a)
{
"Backspace"===a.key&&!isSearchBoxActive()&&!WinStore.Frame.isOnPage("reviewFrame")&&!isRedeemTokenBoxActive()&&
navBackKeyClicked()
}
function onMSPointerUpFrame(a)
{
a.button===3&&
navBackKeyClicked()
}
window.addEventListener("keydown",onKeyDownFrame,false);
window.addEventListener("keyup",onKeyUpFrame,false);
window.addEventListener("keypress",onKeyPressFrame,false);
window.addEventListener("MSPointerUp",onMSPointerUpFrame,false);
var om=null,
wsOrigin="ms-appx://winstore",
TileType={featuredTopic:"featuredTopic",featuredApp:"featuredApp",featuredQuery:"featuredQuery",list:"list",category:"category",app:"app"},
PageBackgroundColor={winBlue:"rgb(238, 238, 238)",win8:"rgb(242, 242, 242)",white:"rgb(255, 255, 255)"},
ViewStateMode={landscape:"landscape",portrait:"portrait"},
CurrentOrientation=window.matchMedia("(orientation:landscape)").matches?ViewStateMode.landscape:ViewStateMode.portrait,
CurrentResolution={width:window.innerWidth,height:window.innerHeight};
window.addEventListener("resize",function()
{
var c=CurrentOrientation,
a=CurrentResolution;
WinStore.Utilities.currentScalingFactor=null;
if(window.matchMedia("(orientation:landscape)").matches)
CurrentOrientation=ViewStateMode.landscape;
else
if(window.matchMedia("(orientation:portrait)").matches)
CurrentOrientation=ViewStateMode.portrait;
else
{
om.logWarningMessage("Frame.onResize: view state doesn't match known value. Not changing from current "+CurrentOrientation+" value");
return
}
CurrentResolution={width:window.innerWidth,height:window.innerHeight};
var b=a.height!==CurrentResolution.height;
om.logInfoMessage("Frame.onResize: CurrentOrientation: "+CurrentOrientation+"; CurrentResolution: "+CurrentResolution.width+"x"+CurrentResolution.height);
if(b||CurrentOrientation!==c)
if(WinStore.Frame.isOnPage("homeFrame"))
{
om.logInfoMessage("WinStore.Frame.onResize: reloading Home page");
WinStore.BlueHomePage.reload()
}
else
if(WinStore.Frame.isOnPage("categoryHubFrame"))
{
om.logInfoMessage("WinStore.Frame.onResize: reloading CategoryHub page");
WinStore.CategoryHub.reload()
}
if(a.width!==CurrentResolution.width)
{
WinStore.Frame.autoTooltip(document.getElementById("pageTitle"));
WinStore.Frame.autoTooltip(document.getElementById("appCount"))
}
WinStore.Frame.isOnPage("pdpFrame")&&
WinStore.PDP.resize();
if(isSearchBoxActive())
{
WinStore.Search.BlurSearchControl();
WinStore.Search.ShowSearchControl()
}
});
var showPicksForYouPromise=null;
window.addEventListener("DOMContentLoaded",function()
{
om=new OMProxy;
if(om)
{
WinStore.Frame.patchPromiseErrorHandlers();
window.addEventListener("message",function(a)
{
if(a.origin.toLowerCase()===wsOrigin)
!om.invokeCallback(a.data)&&
om.logWarningMessage("Unknown web message: "+JSON.stringify(a.data));
else
pcsMessageHandler(a)
},false);
top.postMessage({method:"WS",event:"open"},wsOrigin);
WinStore.Installer.initialize();
showPicksForYouPromise=om.getShowPicksForYou();
om.getLoggingLevel(function(a)
{
om.loggingLevel=a
})
}
},false);
window.onerror=function(b,c,a)
{
om&&
om.unhandledException(b,c,a)
};
window.addEventListener("unload",function()
{
WinStore.Installer.unInitialize();
om=null;
top.postMessage({method:"WS",event:"close"},wsOrigin)
},false);
WinJS.Namespace.define("WinStore.Frame",{_isPdpVisible:{value:false,writable:true},_resultsHeader:{value:null,writable:true},_progressTimeout:{value:0,writable:true},_navBar:{value:null,writable:true},_toggleableSettingsCommandData:{value:{},writable:true},_navBarDisabled:{value:false,writable:true},toggleNavigationUI:function(b)
{
if(WinStore.Frame._navBarDisabled!==b)
{
var a=document.getElementById("navBarContainer");
if(a)
{
WinStore.Frame._navBarDisabled=b;
if(b)
WinJS.Utilities.addClass(a,"disabled");
else
WinJS.Utilities.removeClass(a,"disabled");
var c=a.querySelector(".win-searchbox-input");
if(c)
c.disabled=b
}
}
},showNavBarFlyout:function(a,b)
{
if(b)
{
var e=document.getElementById(a);
if(e&&e.winControl)
{
om.etwEvent(true,"WinStore.Frame.showNavBarFlyout:id="+a);
var d=e.winControl;
WinStore.Search.SetEnableTypeToSearch(false);
d.show(b);
om.etwEvent(false,"WinStore.Frame.showNavBarFlyout:id="+a);
var c=d.element.querySelector(".win-navbarcontainer");
if(c)
{
WinJS.Utilities.addClass(b,"expandedFlyout");
c.winControl.forceLayout();
c.currentIndex=0;
d.addEventListener("beforehide",function()
{
WinJS.Utilities.removeClass(b,"expandedFlyout");
WinStore.Search.SetEnableTypeToSearch(true)
})
}
}
}
else
om.logWarningMessage("WinStore.Frame.showNavBarFlyout: missing hostNode parameter when attempting to show flyout with id "+a)
},showCategoryFlyout:function()
{
for(var a=document.querySelectorAll("#navBarMainContainer .win-navbarcommand"),
c=false,
b=0;b<a.length;++b)
if(a[b].title==="Categories")
{
c=true;
WinStore.Frame.showNavBarFlyout("navBarCategoriesFlyout",a[b]);
break
}
!c&&a.length>0&&
WinStore.Frame.showNavBarFlyout("navBarCategoriesFlyout",a[0])
},onNavBarMainItemInvoked:function(a)
{
if(a.detail.data&&a.detail.data.navFunction&&!WinStore.Frame._navBarDisabled)
{
var b=a.detail.navbarCommand.element;
switch(a.detail.data.navFunction)
{
case "showTopAppsFlyout":
WinStore.BI.fireClickEvent("NavTopApps");
WinStore.Frame.showNavBarFlyout("navBarTopAppsFlyout",b);
break;
case "showCategoryFlyout":
WinStore.BI.fireClickEvent("NavCategories");
WinStore.Frame.showNavBarFlyout("navBarCategoriesFlyout",b);
break;
case "showCollectionsPage":
WinStore.BI.fireClickEvent("NavCollections");
om.showTopicPage("?id=10&cid=0&formcode="+WinStore.BI.biFormCodes.CollectionsFromNavBar);
break;
case "showAccountFlyout":
WinStore.BI.fireClickEvent("NavAccount");
WinStore.Frame.showNavBarFlyout("navBarAccountFlyout",b)
}
}
},onNavBarTopAppItemInvoked:function(a)
{
if(a.detail.data&&a.detail.data.id&&!WinStore.Frame._navBarDisabled)
{
var b=a.detail.data.href;
WinStore.BI.fireClickEvent("NavDListTitle",{"DList.ID":a.detail.data.id});
om.showTopicPage(b)
}
else
om.logWarningMessage("WinStore.Frame.onNavBarTopAppItemInvoked: event data missing target id. Unable to navigate to target.")
},onNavBarCategoryItemInvoked:function(b)
{
if(b.detail.data&&b.detail.data.id&&!WinStore.Frame._navBarDisabled)
{
var a=b.detail.data.id,
c="?cid="+b.detail.data.id;
om.etwGroupTitleClicked(a);
om.etwEvent(true,"WinStore.NavigateToCategoryHub (catId: "+a+")");
WinStore.BI.fireClickEvent("NavCategory",{"Cat.ID":a});
if(WinStore.Category.UpgradeCategoryId===a)
om.showOSUpgradePage("navbar");
else
om.showCategoryHub(c)
}
else
om.logWarningMessage("WinStore.Frame.onNavBarCategoryItemInvoked: event data missing target id. Unable to navigate to target.")
},onNavBarAccountItemInvoked:function(a)
{
if(a.detail.data&&a.detail.data.id&&!WinStore.Frame._navBarDisabled)
if(a.detail.data.id==="yourApps")
{
WinStore.BI.fireClickEvent("NavYourApps");
if(WinStore.Settings.signedIn)
om.showReacquirePage();
else
om.showSettingsPage("yourapps_redirect")
}
else
if(a.detail.data.id==="yourAccount")
{
WinStore.BI.fireClickEvent("NavYourAccount");
om.showSettingsPage("preferences")
}
else
om.logWarningMessage("WinStore.Frame.onNavBarAccountItemInvoked: unknown command id "+a.detail.data.id+", unable to navigate")
},initNavBar:function(m,I)
{
msWriteProfilerMark("WinStore.Frame.initNavbar,StartTM");
om.etwEvent(true,"WinStore.Frame.initNavbar");
var D=m?"":"not ";
om.logInfoMessage("WinStore.Frame.initNavbar: "+D+"adding Picks for You link based on personalization opt-out status");
var M=this,
g=document.getElementById("navBar"),
G=document.getElementById("navBarMainContainer");
showTopAppsCommand=true;
if(g)
if(I)
{
var e=document.getElementById("navBarTopAppsContainer");
if(e)
if(e.winControl)
{
var q=e.winControl.data,
f=q.getAt(0);
if(m)
{
if(f&&f.id&&f.id!=1)
{
var v=WinStore.Frame._toggleableSettingsCommandData["picksForYou"];
if(v)
{
q.unshift(v);
e.winControl.forceLayout()
}
}
}
else
if(f&&f.id&&f.id==1)
{
q.shift();
e.winControl.forceLayout()
}
}
}
else
{
g.style.display="block";
var z=document.getElementById("navBarHomeContainer");
z&&
z.addEventListener("click",function()
{
if(!WinStore.Frame._navBarDisabled&&!WinStore.Frame.isOnPage("homeFrame"))
{
WinStore.BI.fireClickEvent("NavHome");
om.showHomePage()
}
});
if(matchMedia("screen and (-ms-high-contrast)").matches)
{
var p=document.getElementById("navBarHomeIcon");
if(p)
if(matchMedia("screen and (-ms-high-contrast: black-on-white)").matches)
p.setAttribute("src","../../../../../images/2/navbar/1x/logo.contrast-white.png");
else
matchMedia("screen and (-ms-high-contrast: white-on-black)").matches&&
p.setAttribute("src","../../../../../images/2/navbar/1x/logo.contrast-black.png")
}
var u=document.getElementById("navBarTopAppsFlyout"),
e=document.getElementById("navBarTopAppsContainer");
if(u)
{
for(var n=WinStore.Category.getFilteredRecLists(),
k=[],
y=new RegExp(/cid=\d+/),
b=WinStore.Controls.Hub.getRecListOrder(),
o=false,
j=0;j<b.length;++j)
{
o=false;
for(var l=0;l<n.length;++l)
if(b[j].listTypeId===n[l].id)
{
b[j].rec=n[l];
o=true;
break
}
!o&&
b.splice(j--,1)
}
if(b.length>0)
{
for(var r=0;r<b.length;++r)
{
var i=b[r].rec,
a={label:i.name,id:i.id,type:i.type,href:i.href};
if(i.id===1)
{
WinStore.Frame._toggleableSettingsCommandData["picksForYou"]=a;
m&&
k.push(a)
}
else
{
var c={name:a.label,id:a.id,href:a.href.replace(y,"cid="+GAMES_CATEGORY_ID),type:"recListGames"},
d={name:a.label,id:a.id,href:a.href.replace(y,"cid="+APPS_NOT_GAMES_CATEGORY_ID),type:"recListApps"};
switch(a.id)
{
case 3:
c.label="Top paid games";
d.label="Top paid apps";
break;
case 4:
c.label="Top free games";
d.label="Top free apps";
break;
case 5:
c.label="New & rising games";
d.label="New & rising apps";
break;
case 11:
c.label="Top grossing games";
d.label="Top grossing apps";
break;
case 12:
c.label="Best rated games";
d.label="Best rated apps";
break;
default:
om.logWarningMessage("WinStore.Frame.initNavBar: unexpected listTypeId "+a.id+" when building recList flyout, creating concatenated string which may be incorrect for locale");
c.label="%1 games".replace("%1",a.label);
d.label="%1 apps".replace("%1",a.label)
}
k.push(c);
k.push(d)
}
}
var K=new WinJS.UI.Flyout(u,{placement:"bottom"}),
F=new WinJS.UI.NavBarContainer(e,{data:new WinJS.Binding.List(k),fixedSize:false,maxRows:5});
F.addEventListener("invoked",function(a)
{
WinStore.Frame.onNavBarTopAppItemInvoked(a)
})
}
else
showTopAppsCommand=false
}
else
showTopAppsCommand=false;
var t=document.getElementById("navBarAccountFlyout"),
B=document.getElementById("navBarAccountContainer");
if(t)
{
var x=[];
x.push({label:"My apps",type:"settings",id:"yourApps"},{label:"My account",type:"settings",id:"yourAccount"});
var J=new WinJS.UI.Flyout(t,{placement:"bottom"}),
E=new WinJS.UI.NavBarContainer(B,{data:new WinJS.Binding.List(x),fixedSize:false,maxRows:2});
E.addEventListener("invoked",function(a)
{
WinStore.Frame.onNavBarAccountItemInvoked(a)
})
}
var h=[],
L=window.getComputedStyle(g).direction==="rtl";
showTopAppsCommand&&
h.push({label:"Top charts",tooltip:"Top charts",navFunction:"showTopAppsFlyout",icon:""});
h.push({label:"Categories",tooltip:"Categories",navFunction:"showCategoryFlyout",icon:""});
h.push({label:"Collections",tooltip:"Collections",navFunction:"showCollectionsPage"});
h.push({label:"Account",tooltip:"Account",navFunction:"showAccountFlyout",icon:""});
var H=new WinJS.Binding.List(h),
C=new WinJS.UI.NavBarContainer(G,{data:H,fixedSize:true,maxRows:1});
C.addEventListener("invoked",function(a)
{
WinStore.Frame.onNavBarMainItemInvoked(a)
});
var s=document.getElementById("navBarCategoriesFlyout"),
A=document.getElementById("navBarCategoriesContainer");
if(s)
{
var w=[];
om.logInfoMessage("WinStore.Frame.initNavBar: fetching category data");
WinStore.Category.getCategoryData().then(function(c)
{
if(c&&c.length>0)
{
om.logInfoMessage("WinStore.Frame.initNavBar: initializing category flyout with "+c.length+" categories");
for(var b=0;b<c.length;++b)
{
var d=c[b];
WinStore.Category.UpgradeCategoryId!==d.id&&
w.push({label:d.name,id:d.id,type:d.type,href:d.href})
}
}
var i=new WinJS.UI.Flyout(s,{placement:"bottom"}),
h=new WinJS.UI.NavBarContainer(A,{data:new WinJS.Binding.List(w),fixedSize:false,maxRows:5});
h.addEventListener("invoked",function(a)
{
WinStore.Frame.onNavBarCategoryItemInvoked(a)
});
var f=new WinJS.UI.NavBar(g,{sticky:true});
WinStore.Frame._navBar=f;
for(var e=document.querySelectorAll(".navBarFlyout .win-navbarcommand"),
b=0;b<e.length;++b)
{
var a=e[b];
if(a.winControl&&a.winControl.id)
if(a.winControl.type==="category")
a.setAttribute("catId",a.winControl.id);
else
if(a.winControl.type==="recList")
a.setAttribute("recListId",a.winControl.id);
else
a.winControl.type==="settings"&&
a.setAttribute("settingsCmdId",a.winControl.id)
}
WinStore.Frame.initSearchControl();
g.style.display="block";
f.show();
om.etwEvent(false,"WinStore.Frame.initNavbar");
msWriteProfilerMark("WinStore.Frame.initNavbar,StopTM")
})
}
else
om.logErrorMessage("WinStore.Frame.initNavBar: unable to locate #navBarCategoryContainer element, can't add categories to nav bar.")
}
else
om.logErrorMessage("WinStore.Frame.initNavBar: unable to find navBarContainer element. Can't create NavBar")
},deferredInitNavBar:function()
{
showPicksForYouPromise&&
showPicksForYouPromise.then(function(a)
{
WinStore.Utilities.getNamespaceAsync().then(function()
{
WinStore.Frame.initNavBar(a)
});
showPicksForYouPromise=null
})
},initSearchControl:function()
{
om.logVerboseMessage("Begin: WinStore.Frame.initSearchControl");
var b=this,
a=document.getElementById("searchControl");
a.addEventListener("querychanged",WinStore.Search.QueryChanged);
a.addEventListener("querysubmitted",WinStore.Search.QuerySubmitted);
a.addEventListener("resultsuggestionchosen",WinStore.Search.ResultSuggestionChosen);
WinJS.UI.processAll(a);
WinStore.Search.WireUpSearchBox();
om.logVerboseMessage("End: WinStore.Frame.initSearchControl")
},setPageTitle:function(b)
{
if(typeof b==="string")
{
var a=document.getElementById("pageTitle");
if(a)
{
a.innerText=b;
this.autoTooltip(a)
}
}
},setPageTitleLang:function(b)
{
var a=document.getElementById("pageTitle");
if(a)
if(b)
a.setAttribute("lang",b);
else
a.removeAttribute("lang")
},autoTooltip:function(a)
{
if(a)
if(WinStore.Utilities.isOverflowed(a))
a.setAttribute("title",a.innerText);
else
a.removeAttribute("title")
},setAppCount:function(b)
{
var a=document.getElementById("appCount");
if(a)
{
a.innerText=b;
a.style.visibility="visible";
this.autoTooltip(a);
a=document.getElementById("pageTitle");
a&&
WinJS.Utilities.removeClass(a,"pageTitleNoAppCount")
}
},clearAppCount:function()
{
var a=document.getElementById("appCount");
if(a)
{
a.innerText="";
a.style.visibility="hidden";
a=document.getElementById("pageTitle");
a&&
WinJS.Utilities.addClass(a,"pageTitleNoAppCount")
}
},getHeaderAnimationElements:function()
{
var a=[],
b=document.getElementById("headerLinks");
a.push(b);
b=document.getElementById("headerContent");
a.push(b);
return a
},onClickBackButton:function()
{
WinStore.Navigation.onBackClicked(false)
},enableBackButton:function(b,c)
{
var a=document.getElementById("backButton");
if(b)
WinJS.Utilities.removeClass(a,"showDisabled");
else
c&&
WinJS.Utilities.addClass(a,"showDisabled");
a.disabled=!b
},onPdpVisible:function(b)
{
this._isPdpVisible=b;
var a=document.getElementById("pageTitle");
if(a)
if(b)
a.setAttribute("setLang","1");
else
{
a.removeAttribute("setLang");
a.removeAttribute("lang")
}
!b&&
this.showPurchaseProgress(false)
},isPdpActive:function()
{
return this._isPdpVisible
},showPurchaseProgress:function(b)
{
var a=document.getElementById("pdpPurchaseProgressControl");
if(a)
a.style.display=b?"block":"none"
},isPurchaseProgressVisible:function()
{
var a=document.getElementById("pdpPurchaseProgressControl");
return a&&a.style.display==="block"
},showHeader:function(b)
{
var a=document.getElementById("frameHeader");
if(a)
a.style.display=b?"-ms-grid":"none"
},setHeaderHomePageZIndex:function(b)
{
var a=document.getElementById("frameHeader");
if(a)
a.style.zIndex=b?"1":"2"
},onSharingCallback:function()
{
var a=null;
if(WinStore.Frame._isPdpVisible)
a=WinStore.PDP.getSharingData();
if(!a)
a={error:"To share an app from the Windows Store, go to the app’s description page, and then try to share."};
om.setSharingData(a)
},saveResultsHeader:function()
{
var b=document.getElementById("pageTitle"),
a=document.getElementById("appCount");
if(a.style.visibility!=="visible")
a=null;
this._resultsHeader={title:b.innerHTML,appCount:a?a.innerText:null}
},restoreResultsHeader:function()
{
if(this._resultsHeader)
{
var a=document.getElementById("pageTitle");
a.innerHTML=this._resultsHeader.title;
this.autoTooltip(a);
this._resultsHeader.appCount&&
this.setAppCount(this._resultsHeader.appCount,false);
this._resultsHeader=null
}
},showProgressRing:function(c)
{
var a=document.getElementById("frameProgress");
if(a)
if(c)
{
function b()
{
WinStore.Frame._progressTimeout=0;
a.style.opacity=0;
a.style.display="block";
WinJS.UI.Animation.fadeIn(a)
}
this._progressTimeout!==0&&
window.clearTimeout(this._progressTimeout);
this._progressTimeout=window.setTimeout(b,1e3)
}
else
{
window.clearTimeout(this._progressTimeout);
this._progressTimeout=0;
a.style.display="none"
}
},showUpdatesLink:function(a)
{
this._showLink("headerLinkUpdates",a)
},showInstallingLink:function(a)
{
this._showLink("headerLinkInstalling",a)
},onNavBarCategoryLinkClicked:function(b)
{
if(b.currentTarget.attributes["catId"])
{
var a=b.currentTarget.attributes["catId"].value,
c="?cid="+a;
WinStore.BI.fireClickEvent("CategoryLink",{"Cat.ID":a});
om.showCategoryHub(c)
}
else
om.logErrorMessage("WinStore.Frame.onNavBarCategoryLinkClicked: event target missing [@catId] attribute. Unable to navigate to category hub.")
},onClickedUpdatesLink:function()
{
if(WinStore.Navigation.navInProgressCount>0)
om.logInfoMessage("Updates link click ignored since a page navigation is already in progress.");
else
{
om.logInfoMessage("Updates link clicked.");
om.showUpdatesPage(false)
}
},onClickedInstallingLink:function()
{
if(WinStore.Navigation.navInProgressCount>0)
om.logInfoMessage("Installing link click ignored since a page navigation is already in progress.");
else
{
om.logInfoMessage("Installing link clicked.");
om.showInstallsPage(true)
}
},isOnPage:function(c)
{
var b=false,
a;
if("homeFrame"===c)
{
a=document.getElementById("wsHomeFrame");
if(a&&a.style.visibility==="visible")
b=true
}
else
if("resultsFrame"===c)
{
a=document.getElementById("wsResultsFrame");
if(a&&a.style.visibility==="visible")
b=true
}
else
{
a=document.getElementById("wsFrame");
if(a)
{
var d=a.querySelector("div[frag]");
if(d)
{
var e=d.getAttribute("id");
if(e===c)
b=true
}
}
}
return b
},isShowingYourAccount:function()
{
var b=false,
a=document.getElementById("settingsPageYourAccount");
if(a)
if(a.style.display&&a.style.display==="block")
b=true;
return b
},_showLink:function(c,b)
{
var a=document.getElementById(c);
if(a)
{
a.setAttribute("blocked",b?"0":"1");
if(b)
WinStore.Installer.onProgressAwarePageLoad();
else
{
a.style.display="none";
a=document.getElementById("headerLinksSeparator");
if(a)
a.style.display="none";
WinStore.Installer.setLinksMaxWidth(false)
}
}
},patchPromiseErrorHandlers:function()
{
var b=WinJS.Promise.wrapError(),
d=Object.getPrototypeOf(b).done;
Object.getPrototypeOf(b).done=function(b,a,c)
{
a=a||function(a)
{
var b;
if(!(a instanceof Error))
try
{
b=JSON.stringify(a)
}
catch(c)
{
b="[unknown (failed to stringify error)]"
}
else
if(a.name==="Canceled")
return;
else
b=a.stack?a.stack:a.name+": "+a.message+"[stack unavailable]";
om.unhandledException(b,"[unknown (error in promise)]","[unknown]")
};
d.call(this,b,a,c)
};
var a=WinJS.Promise.wrap(),
c=Object.getPrototypeOf(a).done;
Object.getPrototypeOf(a).done=function(a)
{
this.then(a).then(null,function(b)
{
var d;
if(!(b instanceof Error))
try
{
d=JSON.stringify(b)
}
catch(e)
{
d="[unknown (failed to stringify error)]"
}
else
{
if(b.name==="Canceled")
return;
d=b.stack?b.stack:b.name+": "+b.message+"[stack unavailable]"
}
om.unhandledException(d,"[unknown (error in promise .done handler)]","[unknown]");
c.call(this,a)
})
}
}});
(function(a,c,b)
{
a.strings=a.strings||{};
Object.keys(b).forEach(function(d)
{
c.forEach(function(c)
{
a.strings[c+d]=b[d]
})
})
})(window,["ms-resource://Microsoft.WinJS.2.0/ui/"],{appBarAriaLabel:"App Bar",navBarAriaLabel:"Nav Bar",averageRating:"Average Rating",closeOverlay:"Close",flipViewPanningContainerAriaLabel:"Scrolling Container",flyoutAriaLabel:"Flyout",hubViewportAriaLabel:"Scrolling Container",listViewViewportAriaLabel:"Scrolling Container",navBarContainerViewportAriaLabel:"Scrolling Container",off:"Off",on:"On",searchBoxAriaLabel:"Searchbox",searchBoxAriaLabelButton:"Click to submit query",searchBoxAriaLabelInputNoPlaceHolder:"Searchbox, enter to submit query, esc to clear text",searchBoxAriaLabelInputPlaceHolder:"Searchbox, {0}, enter to submit query, esc to clear text",searchBoxAriaLabelResult:"{0} link",searchBoxAriaLabelQuery:"Search for {0} link",searchBoxAriaLabelSeparator:"",tentativeRating:"Tentative Rating",unrated:"Unrated",userRating:"User Rating"});
(function()
{
var a=function(b,d,c)
{
var a=parseFloat(b);
if(isNaN(a))
if(c!==null)
return c;
else
return b;
var e=b.substring(a.toString(10).length);
a=a*d;
return a+e
},
b=function(g,f,d,e,h)
{
var c=g.style,
b=f.style;
if(h==="rtl")
{
c.backgroundPosition="right";
c.paddingRight="0px";
c.borderRight="0px";
b.paddingRight="0px";
b.borderRight="0px";
b.direction="ltr"
}
else
{
c.backgroundPosition="left";
b.backgroundPosition="right";
c.paddingLeft="0px";
c.borderLeft="0px";
b.paddingLeft="0px";
b.borderLeft="0px";
b.direction="rtl"
}
c.width=a(e,d,c.width);
c.msFlexPositive=d;
c.msFlexNegative=d;
c.backgroundSize=100/d+"% 100%";
c.display="block";
b.display="block";
b.msFlexPositive=1-d;
b.msFlexNegative=1-d;
b.width=a(e,1-d,b.width);
b.backgroundSize=100/(1-d)+"% 100%"
};
WinJS.Namespace.define("WinStore.Controls",{Rating:WinJS.Class.define(function(a,h)
{
h=h||{};
this.element=a||document.createElement("div");
this.element.classList.add("win-rating");
this.element.classList.add("win-small");
var j=h.maxRating||5,
i=h.averageRating||0,
k=i|0,
m=i%1,
l=window.getComputedStyle(document.body).direction;
a=this.element;
a.setAttribute("role","slider");
a.setAttribute("aria-readonly","true");
a.setAttribute("aria-valuenow",i.toString());
a.setAttribute("aria-valuemin","0");
a.setAttribute("aria-valuemax",j.toString());
a.setAttribute("aria-valuetext",i.toString());
a.setAttribute("aria-label","User Rating");
for(var f=[],
e,
d,
c=0;c<j;c++)
if(c===k)
{
e=document.createElement("div");
e.classList.add("win-star");
e.classList.add("win-full");
f.push(e);
d=document.createElement("div");
d.classList.add("win-star");
d.classList.add("win-empty");
f.push(d)
}
else
if(c>=k)
{
var g=document.createElement("div");
g.classList.add("win-star");
g.classList.add("win-empty");
f.push(g)
}
else
{
var g=document.createElement("div");
g.classList.add("win-star");
g.classList.add("win-full");
f.push(g)
}
for(var c=0;c<f.length;++c)
a.appendChild(f[c]);
e&&d&&
b(e,d,m,"12px",l)
},{})})
})();
(function()
{
var b=WinJS.Class.define(function(b,a)
{
this.hubContainer=b||document.getElementById("mainContentHome");
this.options=a||{};
if(this.options.showSpotlight)
this.showSpotlight=true;
if(this.options.showPicksForYou)
this.showPicksForYou=true;
if(this.options.showSeeAll)
this.showSeeAll=true;
if(this.options.categoryId)
this.categoryId=a.categoryId;
if(a.headerMargin)
this.headerMargin=a.headerMargin;
if(a.footerMargin)
this.footerMargin=a.footerMargin;
if(a.showCategories)
this.showCategories=a.showCategories;
if(a.showCollections)
this.showCollections=a.showCollections;
if(a.showGangOfThree)
this.showGangOfThree=a.showGangOfThree
},{categoryId:{value:0,writable:true},categoryName:{value:null,writable:true},showSpotlight:{value:false,writable:true},showSeeAll:{value:false,writable:true},showPicksForYou:{value:false,writable:true},showCategories:{value:false,writable:true},showCollections:{value:false,writable:true},showGangOfThree:{value:false,writable:true},maxAppsPerList:{value:20},urlParams:{value:null,writable:true},scrollPosition:{value:0,writable:true},onDataLoaded:{value:null,writable:true},sectionDefinitions:{value:null,writable:true},imageUrlRoot:{value:null,writable:true},maxHosts:{value:null,writable:true},hubContainer:{value:null,writable:true},sectionContainer:{value:null,writable:true},displayedSectionIndex:{value:0,writable:true},headerMargin:{value:180,writable:true},spotlightTopMargin:{value:140},collectionsHeaderHeight:{value:50},sectionDataLoadPromises:{value:[],writable:true},flightInfo:{value:[],writable:true},appData:{value:{},writable:true},firstSectionPopulated:{value:false,writable:true},spotlightLanguage:{value:null,writable:true},isRtl:{value:false,writable:true},tileContainerHeight:{value:-1,writable:true},_hubControl:{value:null,writable:true},_flipViewControl:{value:null,writable:true},_featureDataInitMap:{value:{},writable:true},_lastRefreshedTimestamp:{value:null,writable:true},control:{"get":function()
{
return this._hubControl
}},getSectionDefinitions:function(m,l,k)
{
if(!this.sectionDefinitions||m)
{
var f=om.namespace.recLists,
e=null,
j=null;
if(f)
{
var a=[],
i=this.getSectionItemByListType(0);
i.title="";
i.href="?hubId=0";
a[0]=i;
if(this.categoryId===0)
{
appHighlightsSectionItem=this.getSectionItemByListType(WinStore.Controls.Hub.APP_HIGHLIGHTS_SECTION_ID);
if(appHighlightsSectionItem)
if(WinStore.Controls.Hub.appHighlightsTopicId)
{
appHighlightsSectionItem.topicId=WinStore.Controls.Hub.appHighlightsTopicId;
a.push(appHighlightsSectionItem)
}
if(WinStore.Controls.Hub.brandingTopicId)
{
oemSectionItem=this.getSectionItemByListType(WinStore.Controls.Hub.CHANNEL_RECS_SECTION_ID);
if(oemSectionItem)
{
if(WinStore.Controls.Hub.channelPartnerName&&WinStore.Controls.Hub.channelPartnerName!=="")
oemSectionItem.title="%1 picks".replace("%1",WinStore.Controls.Hub.channelPartnerName);
else
oemSectionItem.title="Picks";
oemSectionItem.listTypeId=WinStore.Controls.Hub.CHANNEL_RECS_SECTION_ID;
oemSectionItem.href="?id="+WinStore.Controls.Hub.brandingTopicId+"&branding=1";
oemSectionItem.topicId=WinStore.Controls.Hub.brandingTopicId;
e=oemSectionItem;
a.push(oemSectionItem)
}
}
}
if(this.showCategories)
{
var c=this.getSectionItemByListType(WinStore.Controls.Hub.CATEGORY_LIST_TYPE_ID);
c.categoryId=this.categoryId;
a.push(c)
}
for(var h=0;h<f.length;++h)
{
if(!k&&f[h].id===WinStore.Controls.Hub.PICKS_FOR_YOU_LIST_TYPE_ID)
continue;
var g=f[h],
b=this.getSectionItemByListType(g.id);
if(b)
{
b.title=g.name;
b.listTypeId=g.id;
b.href="?hubId="+g.id;
a.push(b)
}
}
var d=this.getSectionItemByListType(WinStore.BI.biDataPoint.listId.seeAll);
if(d)
{
d.title="See more";
d.href="?hubId=0";
a.push(d)
}
if(!l&&e)
if(j)
{
var n=j.sectionIndex;
j.sectionIndex=e.sectionIndex;
e.sectionIndex=n
}
if(!this.showCategories)
{
var c=this.getSectionItemByListType(WinStore.Controls.Hub.SUBCATEGORY_LIST_TYPE_ID);
c.categoryId=this.categoryId;
if(this.categoryId===GAMES_CATEGORY_ID)
c.columns=2;
a.push(c)
}
this.sectionDefinitions=a
}
else
om.logErrorMessage("WinStore.Hub.getRecLists: om.namespace.recLists doesn't exist. Unable to generate section list")
}
return this.sectionDefinitions
},getSectionItemByListType:function(c)
{
for(var b=null,
a=0;a<WinStore.Controls.Hub.sectionTypeList.length;++a)
if(WinStore.Controls.Hub.sectionTypeList[a].listTypeId===c)
{
b=WinStore.Controls.Hub.sectionTypeList[a];
break
}
return b
},getSectionDefinitionsByFetchType:function(e)
{
for(var d=[],
c=[],
b=0;b<e.length;++b)
{
var a=e[b];
if(a.batchRequests)
d.push(a);
else
if(a.listTypeId!==0)
(this.categoryId===0||a.listTypeId!==WinStore.Controls.Hub.CHANNEL_RECS_SECTION_ID)&&
c.push(a)
}
return {batched:d,nonBatched:c}
},getNamespaceData:function()
{
return new WinJS.Promise(function(a,b)
{
msWriteProfilerMark("WinStore.Hub.getNamespaceData,StartTM");
WinStore.Utilities.getNamespace(function()
{
msWriteProfilerMark("WinStore.Hub.getNamespaceData,StopTM");
if(om.namespace)
a(om.namespace);
else
{
om.logErrorMessage("WinStore.Hub.getNamespaceData: missing namespace data after WinStore.Utilities.getNamespace call. Calling error function from promise");
b()
}
})
})
},getHomePageData:function()
{
return new WinJS.Promise(function(a,b)
{
msWriteProfilerMark("WinStore.Hub.getHomePageData,StartTM");
om.getHomePageData(function(c)
{
msWriteProfilerMark("WinStore.Hub.getHomePageData,StopTM");
if(c)
{
if(c.branding)
{
WinStore.Controls.Hub.brandingTopicId=c.branding;
WinStore.Controls.Hub.channelPartnerName=c.cpName
}
WinStore.Controls.Hub.spotlightLanguage=c.msFeatures?WinStore.Utilities.getSpotlightLanguageFromUrl(c.msFeatures):null;
a(c)
}
else
{
om.logErrorMessage("WinStore.Hub.getNamespaceData: missing homepage data after om.getHomePageData call. Calling error function from promise");
b()
}
})
})
},dispose:function()
{
WinStore.Controls.Hub.stopRefreshTimer();
if(this._hubControl)
{
this._hubControl.dispose();
this._hubControl=null
}
},registerSectionComplete:function(a)
{
if(!a.firstSectionPopulated)
{
om.etwEvent(false,"WinStore.Hub:initHub");
msWriteProfilerMark("WinStore.Hub.initHub,StopTM")
}
a.firstSectionPopulated=true
},init:function(j,i,k)
{
msWriteProfilerMark("WinStore.Hub.init,StartTM");
this.urlParams=j;
this.onDataLoaded=i;
this.firstSectionPopulated=false;
WinStore.Controls.Hub.initSectionTypeList();
var b=parseInt(om.flightId);
if(!isNaN(b)&&b>2&&b<9)
{
var h={3:["newReleases","picksForYou","topFree","topPaid","topGrossing","bestRated"],4:["newReleases","topGrossing","topPaid","topFree","bestRated","picksForYou"],5:["topFree","bestRated","topPaid","topGrossing","newReleases","picksForYou"],6:["topGrossing","topPaid","topFree","bestRated","newReleases","picksForYou"],7:["topFree","newReleases","topPaid","topGrossing","bestRated","picksForYou"],8:["newReleases","topGrossing","topFree","bestRated","topPaid","picksForYou"]};
om.logVerboseMessage("Reordering hub sections for flight"+om.flightId);
for(var g=WinStore.Controls.Hub.sectionTypeList.length-3,
e=h[b],
c=0;c<e.length;++c)
for(var d=3;d<g;++d)
if(e[c]===WinStore.Controls.Hub.sectionTypeList[d].name)
{
WinStore.Controls.Hub.sectionTypeList[d].sectionIndex=c+3;
break
}
}
this.isRtl=window.getComputedStyle(this.hubContainer).direction==="rtl";
var f=WinStore.Utilities.generateGuid();
this.hubContainer.setAttribute("pageIg",f);
this.hubContainer.removeAttribute("pageDataLoaded");
WinStore.BI.addMetaToHead("MS.PageIg",f);
this.tileContainerHeight=window.innerHeight-this.headerMargin;
this.categoryName=WinStore.Category.getCategoryName(this.categoryId);
WinJS.Utilities.addClass(this.hubContainer,"storeHubContainer");
var a=this;
om.etwEvent(true,"WinStore.Hub:hubLoadPrereqs");
WinStore.Controls.Hub.SpotlightTemplateLayouts=[];
WinStore.Controls.Hub.VisibleSpotlightTemplateIds=[];
WinStore.Controls.Hub.HubAnimationsDisabled=false;
WinStore.Controls.Hub.SpotlightData[this.categoryId]=[];
WinStore.Controls.Hub.RecListMap={};
this._featureDataInitMap[a.categoryId]=false;
WinJS.Promise.join({namespaceData:this.getNamespaceData(),homePageData:this.getHomePageData(),imageData:om.getImageData(),showPicksForYouSetting:om.getShowPicksForYou()}).then(function(b)
{
a.imageUrlRoot=b.imageData.imageUrlRoot;
a.maxHosts=b.imageData.maxHosts;
a.homePageTopicData=b.homePageData.Topics;
if(a.showPicksForYou)
{
a.showPicksForYou=b.showPicksForYouSetting;
om.logInfoMessage("WinStore.Controls.Hub.init: showPicksForYou setting = "+a.showPicksForYou)
}
for(var d=b.namespaceData.categories,
e=false,
c=0;c<d.length;++c)
if(d[c].id==GAMES_CATEGORY_ID)
{
WinStore.Controls.Hub.gamesCategoryName=d[c].name;
e=true;
break
}
!e&&
om.logWarningMessage("WinStore.Control.Hub.init: Unable to get Games category localized name from namespace for header links.");
var f=b.namespaceData.recLists;
f&&
f.forEach(function(a)
{
WinStore.Controls.Hub.RecListMap[a.id]=a.name
});
WinStore.Category.getCategoryFeatures(b.homePageData,a.categoryId,a.imageUrlRoot,k).then(function(c)
{
om.etwEvent(false,"WinStore.Hub:hubLoadPrereqs");
if(c&&!a._featureDataInitMap[a.categoryId])
{
for(var d=0;d<c.panes.length;++d)
{
var b=c.panes[d];
if(b.layout===WinStore.Controls.Hub.GANG_OF_THREE_LAYOUT)
b.tiles&&Array.isArray(b.tiles)&&
b.tiles.forEach(function(a)
{
WinStore.Controls.Hub.GangOfThreeData.push(a)
});
else
if(b.layout===WinStore.Controls.Hub.APP_HIGHLIGHTS_LAYOUT)
{
if(b.tiles&&Array.isArray(b.tiles)&&b.tiles[0])
WinStore.Controls.Hub.appHighlightsTopicId=b.tiles[0].id
}
else
if(WinStore.Controls.Hub.TemplateMap[b.layout])
{
WinStore.Controls.Hub.SpotlightData[a.categoryId].push(c.panes[d]);
WinStore.Controls.Hub.SpotlightTemplateLayouts.push(c.panes[d].layout)
}
else
{
om.logWarningMessage("WinStore.Controls.Hub.init: features.json references unsupported template layout "+b.layout+", unable to create pane");
c.panes.splice(d--,1)
}
}
a._featureDataInitMap[a.categoryId]=true
}
a.initHub()
})
});
msWriteProfilerMark("WinStore.Hub.init,StopTM")
},initHub:function()
{
om.etwEvent(true,"WinStore.Hub:initHub");
msWriteProfilerMark("WinStore.Hub.initHub,StartTM");
var a=this,
d=[],
o=this.showSpotlight&&WinStore.Controls.Hub.SpotlightData[this.categoryId]&&WinStore.Controls.Hub.SpotlightData[this.categoryId].length>0,
p=false,
i=false,
h=false,
m=[],
k=[],
b=this.getSectionDefinitions(true,o,this.showPicksForYou),
e=this.getSectionDefinitionsByFetchType(b);
if(e)
{
m=e.batched;
k=e.nonBatched
}
var q=WinStore.BI.getPageId();
q&&
WinStore.BI.addMetaToHead("MS.PageId",q);
om.etwEvent(true,"WinStore.Hub.DataLoad");
a.collections=WinStore.Category.getFeaturedCollections();
k.forEach(function(b)
{
if((b.listTypeId!==WinStore.BI.biDataPoint.listId.seeAll||a.categoryId!=0)&&(b.listTypeId!==WinStore.Controls.Hub.CHANNEL_RECS_SECTION_ID||b.topicId)&&(b.listTypeId!==WinStore.Controls.Hub.APP_HIGHLIGHTS_SECTION_ID||a.categoryId==0))
if(b.listTypeId===WinStore.Controls.Hub.CATEGORY_LIST_TYPE_ID||b.listTypeId===WinStore.Controls.Hub.SUBCATEGORY_LIST_TYPE_ID)
a.sectionDataLoadPromises.push(WinStore.Category.getListOfCategories(a.categoryId).then(function(e)
{
var c={};
c.appInfo=e;
c.appNS=b.listTypeId;
var d=a.getTilesForSection(c,b);
d&&d.length>0&&
d.push({type:b.listTypeId,name:"See all",seeMoreLink:true});
b.appTiles=d;
b.appList=c;
b.dataRequestComplete=true;
if(b.dataReceivedCallback)
{
b.dataReceivedCallback(e);
b.dataReceivedCallback=null
}
}));
else
a.sectionDataLoadPromises.push(a.getAppListAsync(a,b).then(function(a)
{
b.dataRequestComplete=true;
if(b.dataReceivedCallback)
{
b.dataReceivedCallback(a);
b.dataReceivedCallback=null
}
}))
});
this.sectionDataLoadPromises.push(this.getBatchedAppLists(a,m).then(function(a)
{
a.forEach(function(b)
{
var a=b.sectionData;
a.dataRequestComplete=true;
if(a.dataReceivedCallback)
{
a.dataReceivedCallback(b);
a.dataReceivedCallback=null
}
})
}));
function s(b)
{
if(b.detail&&b.detail.loadingState==="complete")
{
WinStore.Controls.Hub.HubAnimationsDisabled&&
om.logInfoMessage("WinStore.Hub.onLoadingStateChange: Loading state complete. Enabling Hub animations.");
WinStore.Controls.Hub.HubAnimationsDisabled=false;
if(!i&&h)
{
if(WinStore.Controls.Hub.ScrollPositionMap[a.categoryId])
a.control.scrollPosition=WinStore.Controls.Hub.ScrollPositionMap[a.categoryId];
i=true;
om.etwEvent(false,"WinStore.Hub:winJSHubControlLoad");
WinJS.Promise.join(a.sectionDataLoadPromises).done(function()
{
a.firePageViewEvent();
om.etwEvent(false,"WinStore.Hub.DataLoad");
a.hubContainer.setAttribute("pageDataLoaded","true")
});
a.sectionDataLoadPromises=[]
}
}
}
function r(a)
{
if(WinStore.Controls.Hub.HubAnimationsDisabled)
{
om.logInfoMessage("WinStore.Hub.onHubContentAnimating: Animation disabled while Hub responds to section removal.");
a.preventDefault();
a.stopImmediatePropagation()
}
}
om.etwEvent(true,"WinStore.Hub:winJSHubControlLoad");
if(a.categoryId&&a.categoryId!==0)
{
om.etwListInitInteractive("categoryResults",a.categoryId);
om.etwEvent(false,"WinStore.NavigateToCategoryHub (catId: "+a.categoryId+")")
}
if(!this._hubControl)
{
this._hubControl=new WinJS.UI.Hub(this.hubContainer);
this._hubControl.addEventListener("headerinvoked",this.onHeaderInvoked);
this._hubControl.addEventListener("loadingstatechanged",s);
this._hubControl.addEventListener("contentanimating",r)
}
var n=this.onDataLoaded.bind(this);
om.etwEvent(true,"WinStore.Hub:createHubSections");
b.sort(function(a,b)
{
return a.sectionIndex-b.sectionIndex
});
var c=1;
if(o)
var u=this.createSpotlightSection(a,b[0]).then(function(d)
{
var c=new WinJS.UI.HubSection(d,{header:"",isHeaderStatic:true});
c.listTypeId=WinStore.Controls.Hub.SPOTLIGHT_LIST_TYPE_ID;
a.addOrUpdateHubSection(b[0],c);
a.registerSectionComplete(a);
n();
setImmediate(g)
});
else
{
var j=document.createElement("div");
WinJS.Utilities.addClass(j,"spotlightEmptySection");
var f=new WinJS.UI.HubSection(j,{header:"",isHeaderStatic:true});
f.listTypeId=WinStore.Controls.Hub.SPOTLIGHT_LIST_TYPE_ID;
a.addOrUpdateHubSection(b[0],f);
t()
}
function l(c)
{
var b=c.name;
msWriteProfilerMark("WinStore.Hub.createAndAddSection("+b+"),StartTM");
return a.createSection(a,c).then(function(c)
{
msWriteProfilerMark("WinStore.Hub.createSection ("+b+"),StopTM");
var m=c.sectionNode;
if(m)
{
var k={header:c.title},
h=c.listTypeId===WinStore.Controls.Hub.CATEGORY_LIST_TYPE_ID||c.listTypeId===WinStore.Controls.Hub.SUBCATEGORY_LIST_TYPE_ID;
if(h)
k.isHeaderStatic=true;
var i=new WinJS.UI.HubSection(c.sectionNode,k);
i.listTypeId=c.listTypeId;
function g(b)
{
WinJS.Utilities.addClass(b,"hubPageSectionHeaderLink");
WinJS.Utilities.addClass(b,"hubPageSectionHeaderGamesLink");
WinJS.Utilities.addClass(b,"win-type-small");
b.setAttribute("role","link");
b.setAttribute("catId",a.categoryId);
b.setAttribute("listTypeId",c.listTypeId);
b.setAttribute("tabindex","0");
b.addEventListener("click",a.onHeaderLinkInvoked)
}
function l()
{
var a=document.createElement("span");
WinJS.Utilities.addClass(a,"hubPageSectionHeaderSeparator");
WinJS.Utilities.addClass(a,"win-type-small");
a.innerText="|";
return a
}
function j()
{
var a=document.createElement("a");
g(a);
a.innerText="See all";
a.title="See all";
a.setAttribute("linkType",WinStore.Controls.Hub.HEADER_LINK_TYPE_ALL);
return a
}
var d=i.element.querySelector(".win-hub-section-header");
if(d&&(!c.hideHeaderLinks||c.columns==1))
if(a.categoryId===0)
{
var e=document.createElement("a"),
f=document.createElement("a");
if(c.addExtraHeaderLinks)
{
g(e);
e.innerText=WinStore.Controls.Hub.gamesCategoryName;
e.title=WinStore.Controls.Hub.gamesCategoryName;
e.setAttribute("linkType",WinStore.Controls.Hub.HEADER_LINK_TYPE_GAMES);
d.appendChild(e);
d.appendChild(l());
g(f);
f.innerText="Apps";
f.title="Apps";
f.setAttribute("linkType",WinStore.Controls.Hub.HEADER_LINK_TYPE_APPS);
d.appendChild(f)
}
else
!h&&
d.appendChild(j())
}
else
!h&&c.listTypeId!==WinStore.BI.biDataPoint.listId.seeAll&&
d.appendChild(j());
a.addOrUpdateHubSection(c,i)
}
else
om.logInfoMessage("WinStore.Controls.Hub.initHub.createAndAddSection: null sectionElement from createSection. Not displaying "+b);
msWriteProfilerMark("WinStore.Hub.createAndAddSection("+b+"),StopTM")
})
}
function g()
{
msWriteProfilerMark("WinStore.Hub.createRemainingSections,StartTM");
for(;c<b.length;c++)
{
var e=b[c];
e&&
d.push(l(e))
}
msWriteProfilerMark("WinStore.Hub.createRemainingSections,StopTM");
WinJS.Promise.join(d).done(function()
{
h=true;
a.categoryId!=0&&
WinStore.BI.addMetaToHead("MS.Cat.Id",a.categoryId);
om.etwEvent(false,"WinStore.Hub:createHubSections")
})
}
function t()
{
msWriteProfilerMark("WinStore.Hub.createFirstSection,StartTM");
for(var e=false;!e&&c<b.length;c++)
{
var a=b[c];
if(a)
{
d.push(l(a));
if(a.shown)
e=true
}
}
WinJS.Promise.join(d).then(function()
{
if(!p)
{
n();
p=true
}
d=[];
msWriteProfilerMark("WinStore.Hub.createFirstSection,StopTM");
setImmediate(g)
})
}
this._lastRefreshedTimestamp=Date.now();
if(this.categoryId===0)
WinStore.Controls.Hub.PageRefreshTimer=setInterval(this.ttlRefresh.bind(this),WinStore.Controls.Hub.PageRefreshTTL)
},ttlRefresh:function()
{
if(this._lastRefreshedTimestamp)
{
var a=Date.now();
if(this._lastRefreshedTimestamp+WinStore.Controls.Hub.PageRefreshTTL<a)
if(WinStore.Controls.Hub.ShowingHomePage)
{
this.reload();
this._lastRefreshedTimestamp=a
}
else
WinStore.Navigation.invalidateHomePage()
}
},reload:function()
{
var a=this;
a.hubContainer.style.opacity=0;
WinStore.Controls.Hub.stopFlipViewTimer();
WinStore.Controls.Hub.stopRefreshTimer();
window.setImmediate(function()
{
var b=function(c)
{
if("complete"===c.detail.loadingState)
{
a._hubControl&&
a._hubControl.removeEventListener("loadingstatechanged",b);
a.hubContainer.style.opacity=1;
a.init(a.urlParams,function()
{
},false)
}
};
if(a._hubControl)
{
a._hubControl.addEventListener("loadingstatechanged",b,false);
a._hubControl.sections.splice(0,a._hubControl.sections.length)
}
else
om.logWarningMessage("WinStore.Controls.Hub.reload: undefined _hubControl so not reloading.")
})
},firePageViewEvent:function()
{
var g=this.hubContainer.getAttribute("pageIg"),
e=this.hubContainer.getAttribute("lastIgSent");
if(!e||g!==e)
{
this.hubContainer.setAttribute("lastIgSent",g);
var d=this;
function a(b,h)
{
var j=d._hubControl.sections.getAt(b),
f=null,
e=null,
i=null;
if(j)
{
var c=j.element,
g=c.getElementsByClassName("appTile"),
k=g?g.length:0;
if(k===0)
return a(h?b-1:b+1,h);
else
{
var l=h?k-1:0;
i=g[l].getAttribute("MS.K")
}
f=c.getAttribute("MS.AppNS");
e=c.getAttribute("MS.R")
}
else
om.logWarningMessage("WinStore.Controls.Hub.initHub.onLoadingStateChange.getVisibleItemBI: no Hub section at "+b+", unable to determine BI data.");
return {k:i?i:"-1",appNS:f?f:"none",region:e?e:"none"}
}
var b=a(this._hubControl.indexOfFirstVisible,false),
c=a(this._hubControl.indexOfLastVisible,true),
f={FirstVisibleItemKValue:b.k,FirstVisibleItemAppNSValue:b.appNS,FirstVisibleItemRValue:b.region,LastVisibleItemKValue:c.k,LastVisibleItemAppNSValue:c.appNS,LastVisibleItemRValue:c.region,FltInfo:d.flightInfo.join()};
if(WinStore.Controls.Hub.VisibleSpotlightTemplateIds.length)
f["spTemplate.IDs"]=WinStore.Controls.Hub.VisibleSpotlightTemplateIds.join(",");
WinStore.BI.firePageViewEvent(f)
}
},autoFlip:function()
{
if(this._hubControl&&this._hubControl.indexOfFirstVisible===0)
if(WinStore.Controls.Hub.autoFlipSpotlight&&this._flipViewControl)
{
var b=this._flipViewControl.next();
if(!b)
{
var a=this;
this._flipViewControl.count().then(function(b)
{
if(a._flipViewControl.currentPage===b-1)
a._flipViewControl.currentPage=0
})
}
}
},spotlightTemplateRenderer:function(a)
{
return a.then(function(a)
{
a.data.paneId=a.index;
var b=WinStore.Controls.Hub.createSpotlightPane(a.data);
if(a.data.layout==="tokyo-1-topic"&&!a.data.topicData)
{
om.logInfoMessage("WinStore.Controls.Hub.spotlightTemplateRenderer: no topic data available for "+a.data.title+". Showing progress ring until it is available.");
a.data.paneNode=b
}
return b
})
},createSpotlightSection:function(a,b)
{
return new WinJS.Promise(function(E)
{
msWriteProfilerMark("WinStore.Hub.createSpotlightSection","StartTM");
om.etwEvent(true,"WinStore.Hub:createSpotlightSection");
om.logInfoMessage("WinStore.Controls.Hub.createSpotlightSection: creating section");
var D="hubPageSection_"+b.name,
c=WinStore.Utilities.createElementWithClass("hubPageSection",D);
WinJS.Utilities.addClass(c,"hubPageSectionSpotlight");
c.setAttribute("catId",a.categoryId);
c.setAttribute("listTypeId",b.listTypeId);
c.setAttribute("MS.R",b.name);
c.setAttribute("MS.LayoutType","Grid");
c.setAttribute("aria-hidden","true");
c.style.msFlexOrder=b.sectionIndex;
var q=document.getElementById("spotlightTemplate");
if(q)
{
var t=q.querySelector("#spotlightSectionContainer");
if(t)
{
var g=t.cloneNode(true),
i=g.querySelector(".spotlightFlipViewContainer"),
w=g.querySelector(".spotlightContextControl");
c.appendChild(g);
c.style.display="block";
if(WinStore.Controls.Hub.spotlightLanguage)
i.setAttribute("lang",WinStore.Controls.Hub.spotlightLanguage);
else
i.removeAttribute("lang");
var s=null;
if(WinStore.Controls.Hub.SpotlightData[a.categoryId]&&Array.isArray(WinStore.Controls.Hub.SpotlightData[a.categoryId]))
s=WinStore.Controls.Hub.SpotlightData[a.categoryId].slice(0,WinStore.Controls.Hub.MaxSpotlightPanes);
a._flipViewControl=new WinJS.UI.FlipView(i,{itemDataSource:(new WinJS.Binding.List(s)).dataSource,itemTemplate:a.spotlightTemplateRenderer,orientation:"vertical"});
a._flipViewControl.setCustomAnimations({jump:function(e,a)
{
var b={};
a.style.left="0px";
a.style.top="0px";
a.style.opacity=0;
b.left=0+"px";
b.top="40px";
var d=WinJS.UI.Animation.fadeOut(e),
c=WinJS.UI.Animation.enterContent(a,[b],{mechanism:"transition"});
return WinJS.Promise.join([d,c])
}});
function l()
{
WinStore.Controls.Hub.stopFlipViewTimer();
a._flipViewControl.setCustomAnimations({jump:null})
}
function j(a)
{
a.stopPropagation();
l()
}
function r(h)
{
var g=a._flipViewControl.currentPage,
d=WinStore.Controls.Hub.SpotlightData[a.categoryId],
b=d&&d[g],
c=b&&b.categoryId,
f=b&&b.layout,
e=WinStore.Controls.Hub.getTemplateInfo(f),
i={"Cat.ID":c?c:0,"spTemplate.ID":e.biIdentifier,"spTemplate.IDs":WinStore.Controls.Hub.VisibleSpotlightTemplateIds.join(","),NavType:"Click",NavDir:h};
WinStore.BI.fireClickEvent("SpNavClick",i)
}
function y(a)
{
j(a);
r("UP")
}
function C(a)
{
j(a);
r("DW")
}
function x(f)
{
var k=a._flipViewControl.currentPage,
e=WinStore.Controls.Hub.SpotlightData[a.categoryId],
c=e&&e[k],
b=c&&c.tiles&&c.tiles[0],
j=c&&c.categoryId,
i=c&&c.layout,
h=WinStore.Controls.Hub.getTemplateInfo(i);
if(b)
{
WinStore.Controls.Hub.stopFlipViewTimer();
var d=WinStore.Controls.Hub.extractBIData(b,j,h);
d&&
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.appTile,d);
if(b.type==="app")
{
f.stopImmediatePropagation();
var g=document.getElementById("hubPageSection_spotlight").getAttribute("catId")!=="0";
WinStore.Utilities.displayPDP(b.id,{formCode:g?WinStore.BI.biFormCodes.CategoryPage:WinStore.BI.biFormCodes.HomePage})
}
else
if(b.type==="topic")
{
f.stopImmediatePropagation();
om.showTopicPage("?id="+b.id)
}
else
om.logWarningMessage("WinStore.Controls.Hub.onSpotlightClick: click event for unknown template target type "+b.type+", not navigating")
}
}
function B(b)
{
if(b.detail.visible===true)
if(b.srcElement)
{
var c=document.activeElement;
c&&WinStore.Utilities.isDescendantOfNode(c,a._flipViewControl._flipviewDiv)&&
WinStore.Controls.Hub.ReadSpotlightAriaMessage(b.srcElement)
}
}
a._flipViewControl._prevButton.addEventListener("click",y,false);
a._flipViewControl._nextButton.addEventListener("click",C,false);
a._flipViewControl._flipviewDiv.addEventListener("MSPointerDown",function(a)
{
a.pointerType==="touch"&&
l()
},false);
a._flipViewControl._flipviewDiv.addEventListener("focusin",j,false);
a._flipViewControl._flipviewDiv.addEventListener("wheel",l,false);
a._flipViewControl._flipviewDiv.addEventListener("click",x,false);
a._flipViewControl.addEventListener("pagevisibilitychanged",B);
WinStore.Controls.Hub.startFlipViewTimer(a);
var G=new WinStore.Controls.HubContextControl(a._flipViewControl,w,WinStore.Controls.Hub.SpotlightData[a.categoryId].length,a.categoryId);
if(a.showCollections&&a.collections&&a.collections.length>0)
{
var p=g.querySelector("#spotlightCollectionsContainer"),
k=WinStore.Utilities.firstChildByClassOrDefault(p,"collectionContainer");
if(k)
{
var A=0,
h=1,
n=1,
F=Math.floor((document.body.clientHeight-(a.spotlightTopMargin+a.collectionsHeaderHeight+WinStore.Controls.Hub.getSpotlightHeight()))/TileLayout.collectionTileTemplate.tileHeightpx);
function v(f,a,c)
{
var d=null;
if(WinStore.Category._msFeatureData&&a&&a.length>0)
{
var e=WinStore.Category._msFeatureData.collections;
if(e.length>0)
{
var g=e[0].panes;
if(f<g.length)
for(var h=g[f].tiles[0].id,
b=0;b<a.length;++b)
if(a[b].Id===h)
{
d=a[b];
if(c&&c.title)
d.Title=c.title;
break
}
}
}
return d
}
for(var e=0;e<a.collections.length;e++)
{
var m=a.collections[e];
if(m)
{
var z=m.tiles[0];
topic=v(e,a.homePageTopicData,z);
if(topic)
{
m.tilePositionBI=A++;
p.style.display="block";
var d=WinStore.Utilities.createCollectionTile(topic);
if(d)
{
d.style.msGridColumn=displayedColumns=h;
d.style.msGridRow=displayedRows=n;
d.addEventListener("click",a.onTileClick,false);
k.appendChild(d);
h++;
if(h>2)
{
h=1;
n++
}
}
}
if(n>F)
break
}
}
WinJS.UI.processAll(k)
}
}
var o=g.querySelector("#spotlightGangOfThreeContainer");
if(o)
if(a.showGangOfThree)
if(WinStore.Controls.Hub.GangOfThreeData.length>2)
{
for(var u=WinStore.Controls.Hub.GangOfThreeData.slice(0,3),
e=0;e<u.length;++e)
{
var f=u[e];
if(f.tileId)
f.tileId="got-"+f.tileId;
f.tilePositionBI=e+1;
f.pageIndex=1;
var d=WinStore.Utilities.createTile("tallAppTileTemplate",f,true,false);
WinJS.Utilities.addClass(d,"gangOfThreeTile");
d.style.msGridColumn=e+1;
d.addEventListener("click",a.onTileClick,false);
o.appendChild(d)
}
o.style.display="-ms-grid"
}
}
}
om.etwEvent(false,"WinStore.Hub:createSpotlightSection");
msWriteProfilerMark("WinStore.Hub.createSpotlightSection","StopTM");
om.logInfoMessage("WinStore.Controls.Hub.createSpotlightSection: section created");
E(c)
})
},createSection:function(b,a)
{
msWriteProfilerMark("WinStore.Hub.createSection ("+a.name+"),StartTM");
om.etwEvent(true,"WinStore.Hub.createSection ("+a.name+")");
return new WinJS.Promise(function(z)
{
var c=null;
if(a.name==="picksForYou"&&!b.showPicksForYou)
b.categoryId===0&&
om.logInfoMessage("WinStore.Controls.Hub.createSection: Not displaying Picks for You based on personalization opt-out setting");
else
if(a.dataRequestComplete&&(!a.appTiles||a.appTiles.length===0)||a.name==="seeAll"&&!b.showSeeAll)
a.sectionNode=c;
else
{
var y="hubPageSection_"+a.name,
k=WinStore.Utilities.createElementWithClass("hubPageSectionTileContainer");
c=WinStore.Utilities.createElementWithClass("hubPageSection",y);
if(c)
{
c.setAttribute("catId",b.categoryId);
c.setAttribute("listTypeId",a.listTypeId);
c.setAttribute("MS.R",a.name);
c.setAttribute("MS.LayoutType","Grid");
if(a.appList)
{
if(a.appList.impressionGuid===undefined)
a.appList.impressionGuid=WinStore.Utilities.generateGuid();
if(a.listTypeId===WinStore.BI.biDataPoint.listId.seeAll&&a.appList.appNS==="")
a.appList.appNS=a.name;
c.setAttribute("MS.AppNS",a.appList.appNS);
c.setAttribute("MS.IG",a.appList.impressionId);
c.setAttribute("MS.Scn",a.appList.scn)
}
c.appendChild(k);
var i=a.dataRequestComplete;
if(i)
{
om.logInfoMessage("WinStore.Controls.Hub.createSection: have app data for "+a.name+", creating full tiles");
a.tilesPopulated=true
}
else
{
WinJS.Utilities.addClass(c,"placeholderSection");
om.logInfoMessage("WinStore.Controls.Hub.createSection: no app data yet for section "+a.name+", creating placeholder tiles")
}
a.shown=true;
msWriteProfilerMark("WinStore.Hub.createSection.sectionLayout ("+a.name+"),StartTM");
WinJS.Utilities.addClass(c,a.cssClass);
var r=WinStore.Utilities.firstChildByClassOrDefault(c,"hubPageSectionTitle"),
t=a.maxListItems?a.maxListItems:25,
m=1,
p=1,
o=0,
u=0,
q=null;
if(r)
r.innerText=a.title;
c.style.msFlexOrder=a.sectionIndex;
var e,
v=WinStore.Utilities.isLargeScreen(),
f=v&&a.tileLayoutLargeScreen?a.tileLayoutLargeScreen:a.tileLayout;
if(f.name==="tall")
e="tallAppTileTemplate";
else
if(f.name==="medium")
e="mediumAppTileTemplate";
else
if(f.name==="picksForYou")
e="picksForYouAppTileTemplate";
else
if(f.name==="small")
e="smallAppTileTemplate";
else
if(f.name==="text")
e="textTileTemplate";
else
{
om.logErrorMessage("WinStore.Controls.Hub.createSection: Unknown tileLayout "+f.name+" specified for section "+a.name+", skipping section.");
msWriteProfilerMark("WinStore.Hub.createSection.sectionLayout ("+a.name+"),StopTM");
return
}
k.setAttribute("role","listbox");
var g=Math.floor((b.tileContainerHeight-a.footerMargin)/(f.tileHeightPx+f.bottomMarginPx)),
n=a.columns;
if(CurrentOrientation===ViewStateMode.portrait&&a.portraitColumns)
{
n=a.portraitColumns;
WinJS.Utilities.addClass(c,"hubPageSectionPortrait")
}
var x=Math.min(t,g*n);
if(a.listTypeId===WinStore.Controls.Hub.CATEGORY_LIST_TYPE_ID||a.listTypeId===WinStore.Controls.Hub.SUBCATEGORY_LIST_TYPE_ID)
if(a.appTiles&&Array.isArray(a.appTiles))
{
var w=a.appTiles.pop();
if(a.listTypeId===WinStore.Controls.Hub.CATEGORY_LIST_TYPE_ID)
if(a.appTiles.length>g)
a.appTiles[g-1]=w
}
for(var h=0;h<t;++h)
{
if(m>g)
{
++p;
m=1;
if(p>n)
break
}
var d=null;
if(i)
{
tileData=a.appTiles[h];
if(tileData)
{
if(WinStore.Controls.Hub.PICKS_FOR_YOU_LIST_TYPE_ID===a.listTypeId)
{
while(tileData&&WinStore.Utilities.appHasBeenTunedOut(tileData.Id))
a.appTiles.splice(h,1);
if(a.appTiles.length===0)
{
c=null;
a.sectionNode=c
}
}
d=WinStore.Utilities.createTile(e,tileData,!b.categoryId,false);
if(tileData.seeMoreLink)
{
var l=WinStore.Utilities.firstChildByClassOrDefault(d,"tileTitle");
if(l)
{
WinJS.Utilities.addClass(l,"seeMoreLink");
WinJS.Utilities.removeClass(l,"win-type-x-large");
WinJS.Utilities.addClass(l,"win-type-medium")
}
}
b.patchTileBIData(d,a);
b.patchClickHandlers(d,a,tileData)
}
}
else
d=WinStore.Utilities.createPlaceholderTile(e);
if(d)
{
q=d;
d.style.msGridColumn=o=p;
d.style.msGridRow=u=m;
d.setAttribute("role","option");
d.setAttribute("aria-posinset",h+1);
d.setAttribute("aria-setsize",x);
k.appendChild(d)
}
++m
}
if(i&&o<n)
{
om.logInfoMessage("WinStore.Controls.Hub.createSection: reducing section width for "+a.name+" section due to fewer app tiles than needed to fill the section");
var s=b.calculateReducedSectionWidth(a,q,o);
if(s>0)
{
c.style.width=s+"px";
a.hideHeaderLinks=true
}
}
if(c)
{
var j=new WinJS.UI._KeyboardBehavior(k,{fixedDirection:WinJS.UI._KeyboardBehavior.FixedDirection.height,fixedSize:g});
j._focus=function(a)
{
a=+a===a?a:j.currentIndex;
var b=j._element.children[a];
j.currentIndex=a;
b&&
b.focus()
};
c.style.display="block";
a.tileTemplateName=e;
a.sectionNode=c;
if(i)
b.registerSectionComplete(b);
else
a.dataReceivedCallback=function(d)
{
if(a.dataRequestComplete&&d.sectionData.appList)
{
om.logInfoMessage("WinStore.Controls.Hub.createSection: app data callback received for "+a.name+", replacing placeholder tiles");
b.populatePlaceholderSection(d.sectionData.appList,d.sectionData.appTiles,c,a,e,!b.categoryId)
}
else
{
om.logInfoMessage("WinStore.Controls.Hub.createSection: app data callback received for "+a.name+", with no data. Removing section from Hub");
b.removeHubSection(a,b)
}
}
}
}
}
z(a);
om.etwEvent(false,"WinStore.Hub.createSection ("+a.name+")");
msWriteProfilerMark("WinStore.Hub.createSection ("+a.name+"),StopTM")
})
},populatePlaceholderSection:function(i,f,c,a,v,w)
{
msWriteProfilerMark("WinStore.Hub.populatePlaceholderSection ("+a.name+"),StartTM");
om.etwEvent(true,"WinStore.Hub.populatePlaceholderSection ("+a.name+")");
if(!a.tilesPopulated)
{
WinJS.Utilities.removeClass(c,"placeholderSection");
c.setAttribute("MS.IG",i.impressionId);
c.setAttribute("MS.AppNS",i.appNS);
c.setAttribute("MS.Scn",i.scn);
c.setAttribute("FlightInfo",i.flightInfo.join());
this.flightInfo=this.flightInfo.concat(i.flightInfo);
var p=c.getElementsByClassName("appTile"),
y=WinStore.Utilities.firstChildByClassOrDefault(c,"hubPageSectionTileContainer"),
z=p.length,
x=0,
g=0,
k=[];
if(!f||f.length===0)
this.removeHubSection(a,this);
else
{
for(var b=0;b<z;++b)
{
var e=p[b];
if(WinStore.Controls.Hub.PICKS_FOR_YOU_LIST_TYPE_ID===a.listTypeId)
while(f[b]&&WinStore.Utilities.appHasBeenTunedOut(f[b].Id))
f.splice(b,1);
var h=f[b];
if(!h)
e&&
k.push(e);
else
{
var n=WinStore.Utilities.firstChildByClassOrDefault(e,"appIconContainer");
n&&
WinJS.Utilities.removeClass(n,"placeholder");
var s=WinStore.Utilities.firstChildByClassOrDefault(e,"placeholderGlyph");
s&&
s.removeNode(true);
var u=WinStore.Utilities.firstChildByClassOrDefault(e,"appIcon");
if(u)
u.style.display="block";
var d=WinStore.Utilities.populateTileTemplate(e.outerHTML,h,true);
WinStore.Utilities.postProcessTileTemplate(v,d,h,w);
var l=WinStore.Utilities.firstChildByClassOrDefault(d,"appContentContainer");
if(l)
l.style.display="block";
var m=WinStore.Utilities.firstChildByClassOrDefault(d,"appRecommendation");
if(m)
m.style.display="-ms-flexbox";
h.seeMoreLink&&
WinJS.Utilities.addClass(d,"seeMoreLink");
this.patchTileBIData(d,a);
this.patchClickHandlers(d,a,h);
k.push(e);
y.appendChild(d);
WinJS.UI.Animation.fadeIn(d);
g=d.style.msGridColumn;
x=d.style.msGridRow
}
}
for(var b=0;b<k.length;++b)
k[b].removeNode(true);
if(g==1&&g!=a.columns)
this.removeHubSection(a,this);
else
if(g<a.columns)
{
om.logInfoMessage("WinStore.Controls.Hub.populatePlaceholderSection: reducing section width for "+a.name+" section due to fewer app tiles than needed to fill the section");
var o=this.calculateReducedSectionWidth(a,d,g);
if(o>0)
c.style.width=o+"px";
var j=this.getHubSectionByListTypeId(a.listTypeId,this);
if(j&&j._headerElement)
{
var q=j._headerElement;
if(q)
for(var t=q.getElementsByTagName("a"),
b=0;b<t.length;++b)
t[b].style.display="none"
}
}
WinJS.UI.processAll(c);
this.registerSectionComplete(this);
var j=this.getHubSectionByListTypeId(a.listTypeId,this);
if(j)
j.element=c;
else
if(!c.winControl)
{
om.logWarningMessage("WinStore.Hub.populatePlaceholderSection: section "+a.name+" not a winControl. Constructing a new HubSection for it");
var r=new WinJS.UI.HubSection(c,{header:a.title});
r.listTypeId=a.listTypeId;
this._hubControl.sections.splice(a.sectionIndex,0,r)
}
}
WinStore.Controls.Hub.PICKS_FOR_YOU_LIST_TYPE_ID===a.listTypeId&&f.length===0&&
this.removeHubSection(a,this)
}
om.etwEvent(false,"WinStore.Hub.populatePlaceholderSection ("+a.name+")");
msWriteProfilerMark("WinStore.Hub.populatePlaceholderSection ("+a.name+"),StopTM")
},calculateReducedSectionWidth:function(h,f,e)
{
var g=-1;
if(h&&f&&e)
try
{
var d=window.getComputedStyle(f).marginLeft,
c=window.getComputedStyle(f).marginRight,
b=10,
a=10;
if(d&&d!=="0px"&&(c&&c!=="0px"))
{
b=d.replace("px","");
b=!isNaN(b)?Math.abs(b):0;
a=c.replace("px","");
a=!isNaN(a)?Math.abs(a):0
}
g=h.tileLayout.tileWidthPx*e+(b+a)*(e-1)
}
catch(i)
{
om.logWarningMessage("WinStore.Controls.Hub.calculateReducedSectionWidth: caught error "+i+" retaining original section width")
}
else
om.logWarningMessage("WinStore.Controls.Hub.calculateReducedSectionWidth: missing parameter so retaining original section width");
return g
},getTilesForSection:function(d,b)
{
msWriteProfilerMark("WinStore.Hub.getTilesForSection ("+b.name+"),StartTM");
var e=[];
if(d&&d.appInfo)
for(var g=d.appInfo.length,
c=0;c<g;++c)
{
var a=d.appInfo[c];
if(a)
{
var f=b.sectionIndex*100+(c+1);
WinStore.Utilities.prepareAppInfoData(a,f);
a.tileId=f;
a.tileLayout=b.tileLayout;
a.tilePositionBI=c+1;
a.sectionId=b.listTypeId;
a.sectionIndex=b.sectionIndex;
e.push(a)
}
}
msWriteProfilerMark("WinStore.Hub.getTilesForSection ("+b.name+"),StopTM");
return e
},getBatchedAppLists:function(b,a)
{
return new WinJS.Promise(function(f)
{
om.etwEvent(true,"WinStore.Hub.getBatchedAppLists");
msWriteProfilerMark("WinStore.Hub.getBatchedAppLists,StartTM");
if(a&&a.length>0)
{
for(var c="",
d=0;d<a.length;++d)
{
if(d>0)
c=c+".";
c=c+a[d].listTypeId
}
function e(d)
{
var c=[];
a.forEach(function(a)
{
var i=a.listTypeId,
e=WinStore.Controls.Hub.ListTypeNameMap[i],
j=null,
f=null;
if(e)
for(var h=0;h<d.length;++h)
{
var g=d[h];
if(g.scn&&g.scn===e)
{
f=g;
j=b.getTilesForSection(f,a);
a.dataRequestComplete=true;
break
}
}
else
om.logWarningMessage("WinStore.Controls.Hub.getBatchedAppLists.onResults: no listTypeId mapped to SQR list name "+e+", skipping");
if(!f)
{
om.logWarningMessage("WinStore.Controls.Hub.getBatchedAppLists.onResults: no data in SQR response for "+a.name+", Hub section will be removed.");
var l="CategoryId="+b.categoryId+" ,ListName="+e;
om.qosScenarioFailWithInit(WinStore.Utilities.QosScenario.DGListMissing,WinStore.Utilities.ErrorCodes.HTTP_STATUS_NO_CONTENT,l)
}
a.appTiles=j;
a.appList=f;
var k={listTypeId:i,sectionData:a};
c.push(k)
});
om.etwEvent(false,"WinStore.Hub.getBatchedAppLists");
msWriteProfilerMark("WinStore.Hub.getBatchedAppLists,StopTM");
f(c)
}
om.getDataGeneratedLists(c,b.categoryId,b.maxAppsPerList,e)
}
})
},getAppListAsync:function(b,a)
{
return new WinJS.Promise(function(g)
{
msWriteProfilerMark("WinStore.Hub.getAppListAsync (section: "+a.name+"),StartTM");
om.etwEvent(true,"WinStore.Hub.getAppListAsync (section: "+a.name+")");
var c=a.listTypeId;
om.logInfoMessage("WinStore.Hub.getAppListAsync: Loading app list '"+c+"' for section "+a.name);
var e=a.listTypeId&&a.listTypeId===WinStore.Controls.Hub.CHANNEL_RECS_SECTION_ID,
f=e||a.listTypeId&&a.listTypeId===WinStore.Controls.Hub.APP_HIGHLIGHTS_SECTION_ID;
function d(d)
{
if(d.appInfo&&Array.isArray(d.appInfo)&&d.appInfo.length>0)
{
om.logInfoMessage("WinStore.Hub.getAppListAsync: "+d.appInfo.length+" apps returned for list '"+c+"' for section "+a.name);
if(e)
if(WinStore.Controls.Hub.channelPartnerName)
a.title=WinStore.Controls.Hub.channelPartnerName
}
else
{
om.logInfoMessage("WinStore.Hub.getAppListAsync: No appInfo array returned for list '"+c+"' for section "+a.name);
var f="ListName="+a.name;
om.qosScenarioFailWithInit(WinStore.Utilities.QosScenario.DGListMissing,WinStore.Utilities.ErrorCodes.HTTP_STATUS_NO_CONTENT,f)
}
om.etwEvent(false,"WinStore.Hub.getAppListAsync (section: "+a.name+")");
msWriteProfilerMark("WinStore.Hub.getAppListAsync (section: "+a.name+"),StopTM");
var h=b.getTilesForSection(d,a);
if(!b.showPicksForYou&&d.ANID&&d.ANID.length>0)
d.ANID="";
a.appList=d;
a.appTiles=h;
g({sectionData:a})
}
if(f&&a.topicId)
om.getTopicList(a.topicId,b.maxAppsPerList,d);
else
if(c===WinStore.BI.biDataPoint.listId.seeAll)
om.getCategoryList(b.categoryId,b.maxAppsPerList,d);
else
if(c===1)
om.getPicksForYou(b.categoryId,b.maxAppsPerList,d);
else
om.logWarningMessage("WinStore.Controls.Hub.getAppListAsync: invalid listType "+c+", not fetching data")
})
},onTileClick:function(e)
{
var a=e.currentTarget;
if(a)
if(a.attributes)
if(a.attributes["appId"])
{
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.appTile,null,a);
var f=a.attributes["appId"].value,
b=WinStore.BI.biFormCodes.NonBingData,
c=a.getAttribute("MS.DList.Id");
if(c)
{
b=WinStore.BI.biFormCodes.DGList;
if(c==="1")
b=WinStore.BI.biFormCodes.PicksForYou
}
om.etwTileClicked(TileType.app,a.id);
WinStore.Utilities.displayPDP(f,{srcElement:a,formCode:b,origIg:a.getAttribute("IG")})
}
else
if(a.attributes["topicId"])
{
var d=a.attributes["topicId"].value;
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.collectionTile,{"Topic.ID":d});
om.showTopicPage("?id="+d)
}
else
om.logWarningMessage("WinStore.Controls.Hub.onTileClick: No appId or topicId attribute on current target "+e.currentTarget.id+", unable to navigate")
},onCategoryTileClick:function(e)
{
var a=e.currentTarget;
if(a)
{
var b,
c;
if(a.attributes["seeMoreTile"])
{
WinStore.Frame.showCategoryFlyout();
WinStore.BI.fireClickEvent("SeeMoreCategory",{})
}
else
if(a.attributes["queryString"])
{
var d=null;
c=a.attributes["queryString"].value;
if(c.indexOf("scid")===-1)
om.showCategoryHub(c);
else
om.showResultsView(c);
if(a.attributes["scid"])
{
b=a.attributes["scid"].value;
d={"cav.subcat.id":b}
}
else
if(a.attributes["cid"])
{
b=a.attributes["cid"].value;
d={"cav.cat.id":b}
}
b&&
WinStore.BI.fireClickEvent("CanvasCategory",d)
}
else
om.logWarningMessage("WinStore.Controls.Hub.onCategoryTileClick: No queryString attribute on current target "+e.currentTarget.id+", unable to navigate")
}
},onHeaderLinkInvoked:function(e)
{
var a=e.currentTarget;
if(a)
{
var d=WinStore.Utilities.getAttributeValueOrDefault(a,"catId"),
b=WinStore.Utilities.getAttributeValueOrDefault(a,"listTypeId"),
c=WinStore.Utilities.getAttributeValueOrDefault(a,"linkType");
WinStore.Controls.Hub.onHeaderItemInvoked(d,b,c)
}
else
om.logWarningMessage("WinStore.Controls.Hub.onHeaderLinkInvoked: no element in event, unable to process event")
},onHeaderInvoked:function(a)
{
if(a.detail.section._element)
{
var c=WinStore.Utilities.getAttributeValueOrDefault(a.detail.section._element,"catId"),
b=WinStore.Utilities.getAttributeValueOrDefault(a.detail.section._element,"listTypeId");
WinStore.Controls.Hub.onHeaderItemInvoked(c,b)
}
else
om.logWarningMessage("WinStore.Controls.Hub.onHeaderInvoked: no element in event, unable to process event")
},addOrUpdateHubSection:function(b,c)
{
if(this._hubControl&&b.sectionIndex>=0)
{
for(var a=0,
f=this._hubControl.sections.length,
g=-1,
e=false;a<f;++a)
{
var d=this._hubControl.sections.getAt(a).element.style.order;
if(d>=b.sectionIndex)
{
e=d==b.sectionIndex;
break
}
}
if(e)
this._hubControl.sections.setAt(a,c);
else
this._hubControl.sections.splice(a,0,c)
}
else
this._hubControl.sections.push(c)
},removeHubSection:function(c,a)
{
om.logInfoMessage("WinStore.Hub.removeHubSection: removing "+c.name+" section");
msWriteProfilerMark("WinStore.Hub.removeHubSection ("+c.name+"),StartTM");
if(a._hubControl)
for(var f=c.listTypeId,
b=0;b<a._hubControl.sections.length;++b)
{
var e=a._hubControl.sections.getAt(b);
if(e)
{
var d=e._element.getAttribute("listTypeId");
if(d)
if(d==f)
{
if(a._hubControl.indexOfFirstVisible>=b&&a._hubControl.indexOfLastVisible<=b)
WinStore.Controls.Hub.HubAnimationsDisabled=true;
a._hubControl.sections.splice(b,1);
break
}
}
}
msWriteProfilerMark("WinStore.Hub.removeHubSection ("+c.name+"),StopTM")
},getHubSectionByListTypeId:function(e,c)
{
for(var d=null,
b=0;b<c._hubControl.sections.length;++b)
{
var a=c._hubControl.sections.getAt(b);
if(a.listTypeId&&a.listTypeId==e)
{
d=a;
break
}
}
return d
},patchTileBIData:function(b,a)
{
a.appList&&
b.setAttribute("IG",a.appList.impressionId);
if(a.listTypeId===WinStore.BI.biDataPoint.listId.seeAll)
b.setAttribute("MS.CList.Id",a.listTypeId);
else
b.setAttribute("MS.DList.Id",a.listTypeId)
},patchClickHandlers:function(a,b,c)
{
if(b.listTypeId===WinStore.Controls.Hub.CATEGORY_LIST_TYPE_ID||b.listTypeId===WinStore.Controls.Hub.SUBCATEGORY_LIST_TYPE_ID)
{
if(b.listTypeId===WinStore.Controls.Hub.CATEGORY_LIST_TYPE_ID)
a.setAttribute("cid",c.id);
else
if(b.listTypeId===WinStore.Controls.Hub.SUBCATEGORY_LIST_TYPE_ID)
{
a.setAttribute("cid",b.categoryId);
a.setAttribute("scid",c.id)
}
if(c.seeMoreLink)
a.setAttribute("seeMoreTile","true");
else
a.setAttribute("queryString",c.href);
a.addEventListener("click",this.onCategoryTileClick,false)
}
else
a.addEventListener("click",this.onTileClick,false);
var d=WinStore.Utilities.firstChildByClassOrDefault(a,"appTuningLink");
if(d)
{
d.setAttribute("appId",c.Id);
d.setAttribute(b.listTypeId===WinStore.BI.biDataPoint.listId.seeAll?"MS.CList.Id":"MS.DList.Id",b.listTypeId);
d.addEventListener("click",WinStore.Controls.Hub.onTuningClick,false)
}
}},{sectionTypeList:{value:null,writable:true},TemplateMap:{"dublin-1-app":{name:"dublin-1-appTemplate",biIdentifier:1},"tokyo-1-topic":{name:"tokyo-1-topicTemplate",biIdentifier:3},"miami-1-app":{name:"miami-1-appTemplate",biIdentifier:9},"miami-1-topic":{name:"miami-1-topicTemplate",biIdentifier:9}},TokyoTemplatePositionMap:{0:{row:1,column:1,topMargin:"50px"},1:{row:1,column:3,topMargin:"25px"},2:{row:1,column:5,topMargin:"0px"},3:{row:2,column:3,topMargin:"-40px"},4:{row:2,column:5,topMargin:"-65px"},5:{row:1,column:7,topMargin:"70px"}},ScrollPositionMap:{0:0},SpotlightPaneMap:{},MaxSpotlightPanes:{value:10,writable:false},SpotlightTemplateLayouts:{value:[],writable:true},GangOfThreeData:{value:[],writable:true},SpotlightData:{value:{},writable:true},RecListMap:{value:{},writable:true},ListTypeNameMap:{1:"PicksForYou",3:"MostAcquiredPaid",4:"MostAcquiredFree",5:"NewlyReleased",6:"BiggestGainer",10:"Collection",11:"TopGrossing",12:"BestRated"},HubAnimationsDisabled:{value:false,writable:true},VisibleSpotlightTemplateIds:{value:[],writable:true},SpotlightAriaMessages:{value:{},writable:true},ShowingHomePage:{value:false,writable:true},PageRefreshTTL:{value:3.6e6},PageRefreshTimer:{value:null,writable:true},stopRefreshTimer:function()
{
if(WinStore.Controls.Hub.PageRefreshTimer)
{
clearInterval(WinStore.Controls.Hub.PageRefreshTimer);
WinStore.Controls.Hub.PageRefreshTimer=null
}
},ReadSpotlightAriaMessage:function(b)
{
if(b.id&&b.children.length>0)
{
var c="pane:"+b.id,
a=WinStore.Controls.Hub.SpotlightAriaMessages[c];
if(!a)
{
a="";
WinJS.Utilities.query(".spotlightDescriptionContainer",b).forEach(function(b)
{
var e=WinStore.Utilities.firstChildByClassOrDefault(b,"spotlightTitle"),
d=WinStore.Utilities.firstChildByClassOrDefault(b,"spotlightLabel"),
c=WinStore.Utilities.firstChildByClassOrDefault(b,"spotlightDescription");
ratingsNode=WinStore.Utilities.firstChildByClassOrDefault(b,"spotlightRatingsContainer");
if(a!="")
a=a+" ";
if(e)
a=a+e.innerText;
if(d)
a=a+" "+d.innerText;
if(c&&getComputedStyle(c).display!=="none")
a=a+" "+c.innerText;
else
if(ratingsNode&&getComputedStyle(ratingsNode).display!=="none")
a=a+""+ratingsNode.innerText
});
if(a!=="")
WinStore.Controls.Hub.SpotlightAriaMessages[c]=a;
WinStore.Utilities.readAloudAssertive(a)
}
}
},CHANNEL_RECS_SECTION_ID:{value:"channel"},APP_HIGHLIGHTS_SECTION_ID:{value:"appHighlights"},SPOTLIGHT_LIST_TYPE_ID:{value:0},PICKS_FOR_YOU_LIST_TYPE_ID:{value:1},TOP_PAID_LIST_TYPE_ID:{value:3},TOP_FREE_LIST_TYPE_ID:{value:4},NEW_RELEASES_LIST_TYPE_ID:{value:5},TOP_GROSSING_LIST_TYPE_ID:{value:11},BEST_RATED_LIST_TYPE_ID:{value:12},CATEGORY_LIST_TYPE_ID:{value:"category"},SUBCATEGORY_LIST_TYPE_ID:{value:"subcategory"},brandingTopicId:{value:null,writable:true},appHighlightsTopicId:{value:null,writable:true},channelPartnerName:{value:null,writable:true},gamesCategoryName:{value:"",writable:true},GANG_OF_THREE_LAYOUT:{value:"gang-of-three"},APP_HIGHLIGHTS_LAYOUT:{value:"apphighlights"},HEADER_LINK_TYPE_GAMES:{value:"games"},HEADER_LINK_TYPE_APPS:{value:"apps"},HEADER_LINK_TYPE_ALL:{value:"all"},getTemplateInfo:function(b)
{
var a=null;
if(b)
a=WinStore.Controls.Hub.TemplateMap[b];
!a&&
om.logWarningMessage("WinStore.Controls.Hub.getTemplateInfo: no matching template for "+b);
return a
},onHeaderItemInvoked:function(b,a,e)
{
if(b!==undefined&&a)
{
var c=null,
d=WinStore.BI.biDataPoint.objectName.dListTitle;
if(a===WinStore.BI.biDataPoint.listId.seeAll)
{
c={"CList.ID":a};
d=WinStore.BI.biDataPoint.objectName.clientListTitle
}
else
c={"DList.ID":a};
WinStore.BI.fireClickEvent(d,c);
WinStore.Controls.Hub.navigateToHeaderTarget(b,a,e)
}
else
{
!b&&
om.logErrorMessage("WinStore.Controls.Hub.onHeaderInvoked: no @catId on event element. Unable to navigate");
!a&&
om.logErrorMessage("WinStore.Controls.Hub.onHeaderInvoked: no @listTypeId on event element. Unable to navigate")
}
},navigateToHeaderTarget:function(a,b,c)
{
if(b===WinStore.Controls.Hub.CHANNEL_RECS_SECTION_ID)
om.showTopicPage("?id="+WinStore.Controls.Hub.brandingTopicId+"&branding=1");
else
if(b===WinStore.BI.biDataPoint.listId.seeAll)
{
om.showResultsView("?cid="+a+"&"+om.namespace.defBrowseParams);
om.etwEvent(true,"WinStore.NavigateToCategoryResults (catId "+a+")");
om.etwGroupTitleClicked(a)
}
else
if(b===WinStore.Controls.Hub.APP_HIGHLIGHTS_SECTION_ID)
om.showTopicPage("?id="+WinStore.Controls.Hub.appHighlightsTopicId+"&appHighlights=true");
else
if(a!==undefined&&b)
{
if(c)
if(c===WinStore.Controls.Hub.HEADER_LINK_TYPE_GAMES)
a=GAMES_CATEGORY_ID;
else
if(c===WinStore.Controls.Hub.HEADER_LINK_TYPE_APPS)
a=APPS_NOT_GAMES_CATEGORY_ID;
om.etwEvent(true,"WinStore.NavigateToDataGeneratedList (catId "+a+")");
om.showTopicPage("?id="+b+"&cid="+a);
om.etwGroupTitleClicked(a)
}
else
om.logWarningMessage("WinStore.Controls.Hub.navigateToHeaderTarget: no action defined for catId: "+a+", listTypeId: "+b)
},createSpotlightPane:function(a)
{
var c=null,
q=true,
m=a.paneId;
if(WinStore.Controls.Hub.SpotlightPaneMap[m])
c=WinStore.Controls.Hub.SpotlightPaneMap[m];
else
{
var g=a.layout,
A=a.tiles,
z=a.categoryId,
o=WinStore.Controls.Hub.getTemplateInfo(g),
k=null;
if(o)
{
k=document.getElementById(o.name);
if(0===WinStore.Controls.Hub.VisibleSpotlightTemplateIds.length)
for(var b=0;b<WinStore.Controls.Hub.SpotlightTemplateLayouts.length;++b)
{
var n=WinStore.Controls.Hub.getTemplateInfo(WinStore.Controls.Hub.SpotlightTemplateLayouts[b].toLowerCase());
n&&WinStore.Controls.Hub.VisibleSpotlightTemplateIds.indexOf(n.biIdentifier)===-1&&
WinStore.Controls.Hub.VisibleSpotlightTemplateIds.push(n.biIdentifier)
}
if(a.tiles&&a.tiles.length>0)
{
var x=a.tiles[0];
x.paneId=m.toString();
if(k)
{
var r=WinStore.Utilities.firstChildByClassOrDefault(k,"spotlightPane");
if(r)
{
for(var b=0;b<a.tiles.length;++b)
{
var e=a.tiles[b];
if(e.curatedImage)
{
e.largeImage=e.curatedImage;
if(g==="dublin-1-app")
e.largeImage=e.largeImage.replace(/\/1.*x\//,"/1.8x/")
}
if(e.curatedTileImage)
e.squareImage=e.curatedTileImage
}
a.listType==="app"&&
WinStore.Utilities.substituteAppInfoPriceAsAppropriate(a.tiles[0]);
c=WinStore.Utilities.populateTileTemplate(r.outerHTML,a.tiles[0]);
WinStore.Utilities.populateRatingsControl(c,a.tiles[0]);
var s=WinStore.Utilities.firstChildByClassOrDefault(c,"spotlightTitle");
if(s)
s.style.color=a.tiles[0].titleColor;
function v(d,c)
{
var a=WinStore.Utilities.firstChildByClassOrDefault(c,"spotlightDescription"),
b=WinStore.Utilities.firstChildByClassOrDefault(c,"spotlightRatingsContainer");
if(d.description&&g==="tokyo-1-topic")
{
if(a)
{
a.style.display="block";
a.setAttribute("aria-hidden","false")
}
}
else
if(b)
{
b.style.display="block";
b.setAttribute("aria-hidden","false");
a&&
a.setAttribute("aria-hidden","true")
}
}
v(a.tiles[0],c);
function p(c,a)
{
if(a.BackgroundColor)
{
var b=WinStore.Utilities.firstChildByClassOrDefault(c,"spotlightAppTileImage");
if(b)
b.style.backgroundColor=a.BackgroundColor
}
}
if(g==="tokyo-1-topic")
{
var f=document.createElement("progress"),
j=c.querySelector("#spotlightTileContainer");
if(f&&j)
{
WinJS.Utilities.addClass(f,"win-ring");
WinJS.Utilities.addClass(f,"spotlightPaneTopicProgress");
f.style.display="none";
j.appendChild(f)
}
if(j)
if(a.topicData)
for(var t=a.topicData.appInfo,
w=Math.min(6,t.length),
b=0;b<w;++b)
{
var d=document.createElement("img"),
u=t[b];
WinJS.Utilities.addClass(d,"spotlightAppTileImage");
var i=WinStore.Controls.Hub.TokyoTemplatePositionMap[b];
if(i)
{
WinJS.Utilities.addClass(d,"spotlightImage");
d.style.backgroundColor=u.BackgroundColor;
d.style.msGridRow=i.row;
d.style.msGridColumn=i.column;
d.setAttribute("src",u.squareImage);
if(i.topMargin)
d.style.marginTop=i.topMargin
}
j.appendChild(d)
}
else
{
if(f)
f.style.display="block";
q=false
}
}
if(a.tiles.length>1)
{
var l=WinStore.Utilities.firstChildByClassOrDefault(k,"spotlightTileTemplate");
if(l)
{
l=l.outerHTML;
for(var b=0;b<a.tiles.length;++b)
{
var h=WinStore.Utilities.populateTileTemplate(l,a.tiles[b]);
if(h)
{
WinStore.Utilities.patchImageSource(h,a.tiles[b]);
p(h,a.tiles[b]);
WinStore.Utilities.populateRatingsControl(h,a.tiles[b]);
c.appendChild(h)
}
}
}
}
else
p(c,a.tiles[0]);
WinStore.Utilities.patchImageSources(c)
}
}
else
c=document.createElement("div")
}
if(q)
WinStore.Controls.Hub.SpotlightPaneMap[m]=c
}
else
om.logWarningMessage("WinStore.Controls.Hub.createSpotlightPane: unknown/unsupported template "+g+", unable to create pane")
}
return c
},extractBIData:function(a,c,d)
{
var b=null;
if(a.type==="app")
{
b={"App.AvgRating":WinStore.Utilities.getBIRating(a.Rating),"App.Id":a.id,"App.ReleaseGUID":a.ReleaseId,"App.Pos":a.positionBI,"spTemplate.ID":d.biIdentifier,"spTemplate.IDs":WinStore.Controls.Hub.VisibleSpotlightTemplateIds.join(",")};
if(a.PromoEndDate)
b[WinStore.BI.biFieldNames.AppIsPromotion]=1;
if(c)
b["Cat.ID"]=c;
else
b["Cat.ID"]="0"
}
else
if(a.type==="topic")
b={"Cat.ID":c?c:0,"Topic.ID":a.id,"spTemplate.ID":d.biIdentifier,"spTemplate.IDs":WinStore.Controls.Hub.VisibleSpotlightTemplateIds.join(",")};
else
om.logWarningMessage("WinStore.Controls.Hub.extractBIData: unknown template target type "+a.type+", not processing BI data");
return b
},autoFlipSpotlight:{value:true,writable:true},flipViewTimer:{value:null,writable:true},stopFlipViewTimer:function()
{
WinStore.Controls.Hub.flipViewTimer&&
clearInterval(WinStore.Controls.Hub.flipViewTimer);
WinStore.Controls.Hub.autoFlipSpotlight=false
},startFlipViewTimer:function(a)
{
WinStore.Controls.Hub.flipViewTimer&&
clearInterval(WinStore.Controls.Hub.flipViewTimer);
WinStore.Controls.Hub.flipViewTimer=setInterval(a.autoFlip.bind(a),5500);
WinStore.Controls.Hub.autoFlipSpotlight=true
},impressionGuid:{value:null,writable:true},onTuningClick:function(c)
{
var a=c.currentTarget;
if(a)
{
if(!WinStore.Controls.Hub.impressionGuid)
{
var b=document.getElementById("hubPageSection_picksForYou");
if(b)
WinStore.Controls.Hub.impressionGuid=b.getAttribute("MS.IG")
}
WinStore.Utilities.onTuningClick(a,WinStore.Controls.Hub.impressionGuid)
}
},onPageUnload:function()
{
WinStore.Controls.Hub.SpotlightPaneMap={};
WinStore.BI.removeMetaFromHead("MS.Cat.Id");
WinStore.BI.removeMetaFromHead("MS.PageId");
WinStore.BI.removeMetaFromHead("MS.PageIg");
WinStore.Controls.Hub.stopFlipViewTimer();
WinStore.Utilities.submitTuningRecs();
WinStore.Controls.Hub.SpotlightTemplateLayouts=[];
WinStore.Controls.Hub.VisibleSpotlightTemplateIds=[];
WinStore.Controls.Hub.GangOfThreeData=[]
},focusHandler:function(b)
{
var a=b.srcElement;
while(a&&WinJS.Utilities.hasClass(a,"hubPageSectionTileContainer"))
a=a.parentNode;
a&&
a.focus()
},initSectionTypeList:function()
{
sectionTypeList=[];
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.SPOTLIGHT_LIST_TYPE_ID,columns:1,name:"spotlight",cssClass:"hubPageSectionSpotlight",sectionIndex:0,spotlightHeight:345,footerMargin:40});
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.CHANNEL_RECS_SECTION_ID,tileLayout:TileLayout.smallAppTileTemplate,columns:1,name:"channelRecs",cssClass:"hubPageSectionChannelList",sectionIndex:1,maxItems:6,footerMargin:40});
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.APP_HIGHLIGHTS_SECTION_ID,tileLayout:TileLayout.tallAppTileTemplate,columns:3,title:"Featured",name:"appHighlights",cssClass:"hubPageSectionTallTiles",sectionIndex:2,footerMargin:20});
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.TOP_FREE_LIST_TYPE_ID,batchRequests:true,isDGList:true,tileLayout:TileLayout.tallAppTileTemplate,columns:3,name:"topFree",cssClass:"hubPageSectionTallTiles",sectionIndex:3,footerMargin:20,addExtraHeaderLinks:true});
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.NEW_RELEASES_LIST_TYPE_ID,batchRequests:true,isDGList:true,tileLayout:TileLayout.tallAppTileTemplate,columns:3,name:"newReleases",cssClass:"hubPageSectionTallTiles",sectionIndex:4,footerMargin:20,addExtraHeaderLinks:true});
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.TOP_GROSSING_LIST_TYPE_ID,batchRequests:true,isDGList:true,tileLayout:TileLayout.tallAppTileTemplate,columns:3,name:"topGrossing",cssClass:"hubPageSectionTallTiles",sectionIndex:5,footerMargin:20,addExtraHeaderLinks:true});
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.TOP_PAID_LIST_TYPE_ID,batchRequests:true,isDGList:true,tileLayout:TileLayout.tallAppTileTemplate,columns:3,name:"topPaid",cssClass:"hubPageSectionTallTiles",sectionIndex:6,footerMargin:20,addExtraHeaderLinks:true});
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.BEST_RATED_LIST_TYPE_ID,batchRequests:true,isDGList:true,tileLayout:TileLayout.tallAppTileTemplate,columns:3,name:"bestRated",cssClass:"hubPageSectionTallTiles",sectionIndex:7,footerMargin:20,addExtraHeaderLinks:true});
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.PICKS_FOR_YOU_LIST_TYPE_ID,isDGList:true,tileLayout:TileLayout.picksForYouAppTileTemplate,columns:3,name:"picksForYou",cssClass:"hubPageSectionPicksForYouTiles",sectionIndex:8,footerMargin:20});
sectionTypeList.push({listTypeId:WinStore.BI.biDataPoint.listId.seeAll,tileLayout:TileLayout.smallAppTileTemplate,columns:1,name:"seeAll",cssClass:"hubPageSectionSmallTiles",sectionIndex:9,footerMargin:40});
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.SUBCATEGORY_LIST_TYPE_ID,tileLayout:TileLayout.textTile,columns:1,name:"subcategories",title:"Subcategories",cssClass:"hubPageSectionCategoryList",sectionIndex:10,footerMargin:40});
sectionTypeList.push({listTypeId:WinStore.Controls.Hub.CATEGORY_LIST_TYPE_ID,tileLayout:TileLayout.textTile,columns:1,name:"categories",title:"Categories",cssClass:"hubPageSectionCategoryList",sectionIndex:11,footerMargin:40});
WinStore.Controls.Hub.sectionTypeList=sectionTypeList
},getRecListOrder:function()
{
!WinStore.Controls.Hub.sectionTypeList&&
WinStore.Controls.Hub.initSectionTypeList();
return WinStore.Controls.Hub.sectionTypeList.filter(function(a)
{
return a.isDGList
}).sort(function(a,b)
{
if(a.sectionIndex>b.sectionIndex)
return 1;
else
if(a.sectionIndex<b.sectionIndex)
return -1;
else
return 0
}).map(function(a)
{
return {listTypeId:a.listTypeId,index:a.sectionIndex}
})
},navigateToCollectionsPage:function()
{
om.showTopicPage("?id=10&cid=0&formcode="+WinStore.BI.biFormCodes.CollectionsFromNavBar)
},getSpotlightHeight:function()
{
var a=345;
if(matchMedia("(min-resolution: 174dpi)").matches&&matchMedia("(min-height: 1080px) and (max-height: 1439px)").matches&&matchMedia("(min-width: 1920px) and (max-width: 2659px)").matches)
a=483;
else
if(matchMedia("(min-resolution: 240dpi)").matches&&matchMedia("(min-height: 1440px)").matches&&matchMedia("(min-width: 2560px)").matches)
a=621;
return a
}}),
a=WinJS.Class.define(function(b,a,d,c)
{
WinStore.Controls.HubContextControl.flipView=b;
WinStore.Controls.HubContextControl.contextContainer=a;
this.initControl(d,c)
},{initControl:function(b,a)
{
this.categoryId=a;
this.update(b)
},categoryId:{value:null,writable:true},update:function(h)
{
var d=WinStore.Controls.HubContextControl.flipView,
c=WinStore.Controls.HubContextControl.buttons,
l=WinStore.Controls.HubContextControl.contextContainer,
j=WinStore.Controls.Hub.SpotlightData[this.categoryId];
function k(b)
{
b.stopPropagation();
var a=b.currentTarget;
if(a&&a.value)
if(d)
{
om.logInfoMessage("onSpotlightThumbnailClick: user clicked spotlight thumbnail "+a.value);
WinStore.Controls.Hub.stopFlipViewTimer();
d.currentPage=a.value
}
}
c=[];
for(var g=0;g<h;++g)
{
var b=document.createElement("div"),
a=document.createElement("input"),
e=document.createElement("img"),
i=j&&j[g],
f=i&&i.tiles&&i.tiles[0];
WinJS.Utilities.addClass(b,"spotlightContextControlButtonContainer");
b.setAttribute("aria-hidden","true");
b.setAttribute("tabindex","-1");
if(f)
{
b.style.backgroundColor=f.BackgroundColor;
if(f.LogoURL)
e.src=f.LogoURL
}
if(e.src==="")
e.src="../../../../../images/2/icons/1.8x/collections.png";
b.appendChild(e);
a.setAttribute("type","radio");
a.setAttribute("name","spotlightContextGroup");
a.setAttribute("value",g);
a.setAttribute("aria-hidden","true");
a.setAttribute("tabindex","-1");
a.disabled=false;
a.addEventListener("click",k);
b.hasChildNodes()&&
WinJS.Utilities.addClass(a,"spotlightContextControlButtonOverlay");
c.push(a);
b.appendChild(a);
l.appendChild(b);
e.setAttribute("noBrokenImageReplacement",true);
e.addEventListener("error",WinStore.Utilities.onBrokenImageError)
}
if(h>0&&d.currentPage)
c[d.currentPage].checked=true;
else
if(h>0)
c[0].checked=true;
d.addEventListener("pageselected",function()
{
var b=d.currentPage;
c[b].checked=true;
for(var a=0;a<c.length;a++)
a!=b&&
WinJS.Utilities.removeClass(c[a],"spotlightContextControlSelectedButton");
WinJS.Utilities.addClass(c[b],"spotlightContextControlSelectedButton")
},false)
}},{contextContainer:{value:null,writable:true},flipView:{value:null,writable:true},buttons:{value:[],writable:true}});
WinJS.Namespace.define("WinStore.Controls",{Hub:b,HubContextControl:a})
})();
WinJS.Namespace.define("WinStore.Navigation",{_wsFrame:{value:null,writable:true},_wsHomeFrame:{value:null,writable:true},_wsHomeFrameInit:{value:false,writable:true},_wsResultsFrame:{value:null,writable:true},_wsFrameHeight:{value:0,writable:true},_multipleNavs:{value:false,writable:true},_isNavBackInProgress:{value:false,writable:true},navInProgressCount:{value:0,writable:true},isSuspended:{value:false,writable:true},onAjaxPageLoaded:function(b)
{
this.navInProgressCount++;
if(this.navInProgressCount>1)
{
om.logWarningMessage("onAjaxPageLoaded: Navigating to new page while a page navigation is already in progress");
this._multipleNavs=true
}
if(!this._wsFrame)
{
this._wsFrame=document.getElementById("wsFrame");
this._wsHomeFrame=document.getElementById("wsHomeFrame");
this._wsResultsFrame=document.getElementById("wsResultsFrame")
}
if(this._wsFrame)
{
var a;
if(this._wsHomeFrame.style.visibility==="visible")
a=this._wsHomeFrame;
else
if(this._wsResultsFrame.style.visibility==="visible")
a=this._wsResultsFrame;
else
a=this._wsFrame;
if(a.innerHTML==="")
{
b.html!=="errorPage"&&
WinStore.Utilities.refreshLicensedAppListIfNeeded();
this._loadPage(b,true)
}
else
{
om.invalidateCallbacks();
WinStore.Utilities.refreshLicensedAppListIfNeeded();
var h=false,
g=this,
f=false;
function c()
{
if(!f)
{
f=true;
msWriteProfilerMark("WinStore.Navigation.onAjaxPageLoaded.exitPage,StopTM");
a.removeEventListener("transitionend",c,false);
b.html!=="errorPage"&&
WinStore.Frame.showProgressRing(true);
g._unloadPage(a,b);
document.body.focus();
g._loadPage(b,false)
}
}
var e;
if(document.getElementById("reacquireFrame")||document.getElementById("updatesFrame"))
e=document.getElementById("appBarContainer");
else
if(document.getElementById("appInstallsFrame"))
e=document.getElementById("appInstallsAppBarContainer");
if(e)
e.style.display="none";
if(b.html!=="errorPage")
{
var d=[];
d=d.concat(WinStore.Frame.getHeaderAnimationElements());
a.addEventListener("transitionend",c,false);
d.push(a);
msWriteProfilerMark("WinStore.Navigation.onAjaxPageLoaded.exitPage,StartTM");
d.forEach(function(a)
{
a.style.opacity=0
});
window.setTimeout(function()
{
c()
},3e3)
}
else
c()
}
}
else
om.logErrorMessage("onAjaxPageLoaded: Cannot find element 'wsFrame'")
},onResumeEvent:function()
{
this.isSuspended=false;
om.logInfoMessage("WinStore.Navigation received a resume event.");
this._wsHomeFrameInit=false;
this.refreshHomePageData();
WinStore.Installer.onProgressAwarePageLoad();
var c=WinStore.BI.getPageFrag();
if(c)
{
var a=c.getElementsByClassName("appTile");
if(a)
for(var b=0;b<a.length;b++)
WinStore.Utilities.patchImageSources(a[b])
}
},onSuspendEvent:function()
{
this.isSuspended=true;
om.logInfoMessage("WinStore.Navigation received a suspend event.");
if(this._wsFrame)
{
var b=this._wsFrame.querySelector("div[frag]");
if(b)
{
var a=b.getAttribute("id");
if(a==="reviewFrame")
WinStore.ReviewPage.onStoreSuspend();
else
if(a==="reportProblemFrame")
WinStore.ReportProblemPage.onStoreSuspend();
else
a==="reviewListFrame"&&
WinStore.ReviewListPage.onStoreSuspend()
}
}
om.suspendComplete()
},onBackClicked:function(b)
{
var a=b?"Navigate back key":"Back button";
if(!WinStore.Frame._isPdpVisible||!WinStore.PDP.blockNavigation())
if(WinStore.Navigation.navInProgressCount>0)
om.logInfoMessage(a+" click ignored since a page navigation is already in progress.");
else
if(WinStore.Navigation._isNavBackInProgress)
om.logInfoMessage(a+" click ignored since navigation back is already in progress.");
else
{
WinStore.Navigation._isNavBackInProgress=true;
om.logInfoMessage(a+" clicked; navigating back.");
WinStore.BI.fireClickEvent("BackButton",{Src:"BackButton"});
om.goBack()
}
else
om.logInfoMessage(a+" click ignored since acquisition is in progress.")
},onLangFilterChanged:function()
{
this.invalidateHomePage();
if(this._wsResultsFrame!==null&&this._wsResultsFrame.innerHTML!=="")
this._wsResultsFrame.innerHTML=""
},invalidateHomePage:function()
{
this._wsHomeFrameInit=false
},refreshHomePageData:function()
{
om.getHomePageData(function()
{
})
},onInstallProgress:function(b)
{
for(var c=false,
a=0;a<b.length;++a)
if(b[a].installState.toLowerCase()==="complete")
{
c=true;
WinStore.Utilities.setInstalledInLicensedAppList(b[a].packageFamilyName)
}
c&&
this.invalidateHomePage()
},_unloadPage:function(c,a)
{
var b=true,
e=c.querySelector("div[frag]");
if(e)
{
var d=e.getAttribute("id");
switch(d)
{
case "homeFrame":
b=false;
WinStore.BlueHomePage.onUnload();
break;
case "pdpFrame":
WinStore.PDP.onUnload();
break;
case "upgradeFrame":
onUpgradeUnload();
break;
case "settingsFrame":
WinStore.Settings.onPageUnload();
break;
case "topicFrame":
WinStore.TopicPage.onPageUnload();
break;
case "resultsFrame":
b=WinStore.ResultsPage.onPageUnload(a.isNavBack);
break;
case "reportProblemFrame":
WinStore.ReportProblemPage.onPageUnload(a.isNavBack);
WinStore.Frame.showHeader(true);
break;
case "reviewFrame":
WinStore.ReviewPage.onPageUnload(a.isNavBack);
WinStore.Frame.showHeader(true);
break;
case "reviewListFrame":
WinStore.ReviewListPage.onPageUnload();
break;
case "reacquireFrame":
WinStore.ReacquirePage.onPageUnload();
break;
case "updatesFrame":
WinStore.UpdatesPage.onPageUnload();
break;
case "appInstallsFrame":
WinStore.InstallsPage.onInstallsPageUnload();
break;
case "pcsFrame":
onPCSFrameUnload(a.isNavBack);
break;
case "categoryHubFrame":
WinStore.CategoryHub.onUnload();
break;
default:
om.logErrorMessage("WinStore.Navigation._unloadPage: Unknown page ID: "+String(d))
}
WinStore.BI.onPageUnloaded()
}
if(b)
c.innerHTML="";
this._hideFrame(c);
WinStore.Frame.clearAppCount()
},_frameHasSearchBox:function(a)
{
return a.indexOf("homeFrame")!==-1||a.indexOf("topicFrame")!==-1||a.indexOf("resultsFrame")!==-1||a.indexOf("categoryHubFrame")!==-1||a.indexOf("pdpFrame")!==-1
},_hideFrame:function(a)
{
a.style.visibility="hidden";
a.style.zIndex=null;
a.setAttribute("aria-hidden","true");
a.style.display="none"
},_loadPage:function(a,u)
{
var i=this._wsHomeFrame,
g=this._wsResultsFrame,
k=this._wsFrame,
b=k,
l=[i,g];
if(a.html!=="errorPage")
{
var f=true;
function t()
{
var b=f?PageBackgroundColor.winBlue:PageBackgroundColor.white;
if(a.pageId&&a.pageId==="settingsFrame"&&a.params&&a.params.indexOf("display=preferences")!==-1)
b=PageBackgroundColor.win8;
if(document.body.style.backgroundColor!==b)
document.body.style.backgroundColor=b
}
var e=document.getElementById("backButton"),
v=document.getElementById("headerContainer"),
h=null,
n=null,
d=this;
function r(k)
{
om.etwEvent(true,"WinStore.Frame:_loadPage.onEntranceAnimation");
var c=[];
if(k)
{
e.style.opacity=0;
e.style.visibility="visible";
c.push(e)
}
var i=WinStore.Frame.getHeaderAnimationElements();
i.forEach(function(a)
{
if(!a.style||!a.style.visibility||a.style.visibility!=="visible")
a.style.visibility="visible"
});
c.push(i);
if(h&&Array.isArray(h)&&h.length===2)
{
b.style.opacity=1;
c.push(h[0]);
c.push(h[1])
}
else
c.push(b);
WinStore.Frame.showProgressRing(false);
var m=window.getComputedStyle(b,null).overflow;
b.style.overflow="hidden";
var f=null,
j,
g=b.getElementsByClassName("win-listview");
if(g&&g.length>0)
{
f=g[0].getElementsByClassName("win-viewport")[0];
if(f)
{
j=window.getComputedStyle(f,null).overflowX;
f.style.overflowX="hidden"
}
}
d.navInProgressCount--;
om.onAjaxPageLoadComplete();
if(d._multipleNavs&&d.navInProgressCount===0)
{
d._multipleNavs=false;
d._hideFrame(l[0]);
d._hideFrame(l[1])
}
if(a.isNavBack)
{
om.logInfoMessage("Navigation back completed; enabling Back button clicks.");
d._isNavBackInProgress=false
}
WinJS.UI.Animation.enterPage(c,null).done(function()
{
b.style.overflow=m;
if(f)
f.style.overflowX=j;
n&&
n();
u&&
WinStore.Installer.onProgressAwarePageLoad();
om.etwEvent(false,"WinStore.Frame:_loadPage.onEntranceAnimation")
})
}
var d=this;
function c(c,a,b)
{
if(c)
{
d.navInProgressCount--;
om.onAjaxPageLoadComplete();
if(d._multipleNavs&&d.navInProgressCount===0)
d._multipleNavs=false
}
else
{
h=a;
t();
n=b;
om.hideSplashScreen();
r(e.style.visibility!=="visible"&&!e.disabled);
om.etwPageLoaded("");
WinStore.Frame.deferredInitNavBar()
}
}
function o()
{
b.style.opacity=0;
b.style.visibility="visible";
b.style.zIndex=1;
b.removeAttribute("aria-hidden");
b.style.display=""
}
WinStore.Frame.enableBackButton(true);
var p=true;
if(a.html.indexOf("homeFrame")!==-1)
{
WinStore.Search.SetSearchBoxText("");
WinStore.Search.BlurSearchControl();
b=i;
l=[g,k];
o();
om.canGoBack(function(b)
{
WinStore.Frame.enableBackButton(b);
if(!b&&e.style.visibility==="visible")
{
function a()
{
e.style.visibility="hidden"
}
WinJS.UI.Animation.exitPage([e],null).done(a,a)
}
});
if(WinStore.Utilities.getUrlParam(a.params,"refresh")==="1")
{
this._wsHomeFrameInit=false;
WinStore.Utilities.getNamespace(function()
{
WinStore.Settings.refreshNavBar()
},null,true)
}
if(this._wsHomeFrameInit&&this._wsFrameHeight===window.outerHeight)
{
WinStore.BlueHomePage.onNavigateReturn(a.isNavBack,a.params);
c();
this.refreshHomePageData()
}
else
{
WinStore.BlueHomePage.dispose();
this._wsFrameHeight=window.outerHeight;
i.innerHTML=a.html;
this._wsHomeFrameInit=true;
WinStore.BlueHomePage.initControls(a.params,c)
}
p=false
}
else
if(a.html.indexOf("resultsFrame")!==-1)
{
b=g;
l=[i,k];
o();
var s=WinStore.Utilities.getUrlParam(a.params,"searchService");
s==65537&&
WinStore.Search.SetSearchBoxText(decodeURIComponent(WinStore.Utilities.getUrlParam(a.params,"search")));
if(a.isNavBack&&g.innerHTML!=="")
{
WinStore.ResultsPage.onPageNavBackFromPDP();
c()
}
else
{
g.innerHTML=a.html;
WinStore.ResultsPage.initControls(a.params,c)
}
p=false
}
else
{
WinStore.Search.SetSearchBoxText("");
o();
k.innerHTML=a.html
}
if(p)
{
var q=k.querySelector("div[frag]");
if(q)
{
var j=true,
m=q.getAttribute("id");
WinStore.BI.setupSessionId(m==="pdpFrame");
a.pageId=m;
switch(m)
{
case "topicFrame":
WinStore.TopicPage.initControls(a.params,c);
break;
case "pdpFrame":
WinStore.PDP.onLoad(a.params,c);
break;
case "upgradeFrame":
onUpgradeLoad(a.params,c);
break;
case "reviewFrame":
WinStore.ReviewPage.onReviewLoad(a.params);
WinStore.Frame.showHeader(false);
j=false;
f=true;
break;
case "reviewListFrame":
WinStore.ReviewListPage.onPageLoad(a.params,c);
f=true;
break;
case "reportProblemFrame":
WinStore.ReportProblemPage.onReportProblemLoad(a.params);
WinStore.Frame.showHeader(false);
j=false;
f=true;
break;
case "settingsFrame":
WinStore.Settings.onPageLoad(a.params);
j=false;
f=false;
break;
case "reacquireFrame":
WinStore.ReacquirePage.initControls(c);
break;
case "updatesFrame":
WinStore.UpdatesPage.initControls(a.params,c);
break;
case "appInstallsFrame":
WinStore.InstallsPage.initControls(c);
break;
case "pcsFrame":
onPCSFrameLoad(a.params);
j=false;
f=false;
break;
case "categoryHubFrame":
WinStore.CategoryHub.initControls(a.params,c);
f=true;
break;
default:
om.logErrorMessage("onAjaxPageLoaded: Unknown page ID: "+String(m))
}
!j&&
c()
}
else
om.logWarningMessage("onAjaxPageLoaded: No 'frag' attribute found for page "+String(a.html))
}
this.disableTypeToSearchForInputControls(b)
}
else
{
this._wsHomeFrameInit=false;
if(i.innerHTML!=="")
{
i.innerHTML="";
WinStore.BlueHomePage.dispose()
}
if(g.innerHTML!=="")
g.innerHTML="";
om.onAjaxPageUnloadComplete(a.idToHide,a.idToShow);
this.navInProgressCount=0;
this._multipleNavs=false;
this._isNavBackInProgress=false
}
},disableTypeToSearchForInputControls:function(c)
{
if(c)
for(var b=c.querySelectorAll('input[type="text"], textarea, select'),
a=0;a<b.length;a++)
WinStore.Search.AutoDisableTypeToSearchForElement(b[a])
}});
WinJS.Namespace.define("WinStore.BI",{BrandingCategoryId:"1000",PdpSamplingId:"scpdp",InstallPageSamplingId:"scip",WinStoreClientName:"WinAppStore",WinStoreClientId:"F04A632E45563E2AA712F4291923D8400F51082F",EntityTypeName:"WindowsStoreProductGuid",_initialized:{value:false,writable:true},_enabled:{value:true,writable:true},_logObj:{value:null,writable:true},_cid:{value:null,writable:true},_anid:{value:null,writable:true},_lrr:{value:null,writable:true},_languageOrientation:{value:null,writable:true},_pageViewLogged:{value:false,writable:true},_selfHostUser:{value:null,writable:true},biDataPoint:{value:{listId:{seeAll:"SeeAll",similarApps:"SimilarApps",similarAppsPostInstall:"SimilarApps.PostAcq",developerApps:"AppsByDev",developerAppsPostInstall:"AppsByDev.PostAcq",ratingsAndReview:"RatingsAndReview"},objectName:{clientListTitle:"CListTitle",appTile:"AppTile",clientListSmallTitle:"CListSmallTitle",dListTitle:"DListTitle",collectionTile:"CollectionTile"}},writable:false},biFieldNames:{AppIsPromotion:"App.IsPromo",AppIsUniversal:"App.IsUniversal",DeepLink:"DeepLink"},biFormCodes:{SearchPage:"SSPPDP",PicksForYou:"PFUPDP",AutoSuggest:"ASPPDP",Similar:"SRPPDP",Developer:"SDPPDP",Coupon:"ASCPDP",PostAcq:"PAQPDP",HomePage:"HOMPDP",CategoryPage:"CATPDP",DGList:"DGLPDP",TopicPage:"TPCPDP",YourAppsPage:"YAPPDP",UpdatesPage:"UPPPDP",ReviewPage:"REVPDP",NonBingData:"NOBPDP",CollectionsFromNavBar:"CLHCLP",CollectionsToTopic:"CLPCDP"},init:function(a)
{
if(this._enabled)
if(a)
this._initBI(a);
else
om.getBI(this._initBI)
},enabled:function()
{
var a=WinStore.BI;
return a._enabled&&a._initialized
},hasLoggedPageViews:function()
{
return WinStore.BI._pageViewLogged
},formatFieldNameAsAttribute:function(a)
{
if(a)
return "MS."+a;
return a
},addMetaToHead:function(c,a)
{
WinStore.BI.removeMetaFromHead(c);
if(a!==undefined&&a!=="")
{
var b=document.createElement("META");
b.name=c;
b.content=a;
document.head.appendChild(b)
}
},removeMetaFromHead:function(d)
{
if(document.head)
for(var c=document.head.getElementsByTagName("META"),
b=0;b<c.length;b++)
{
var a=c(b);
if(a&&a.name===d)
{
document.head.removeChild(a);
break
}
}
},_initBIForNewPage:function(b)
{
var a=WinStore.BI;
a._initialized&&
a._refreshUserInfo(b)
},getPageFrag:function()
{
for(var c=null,
b=document.querySelectorAll("#wsFrame, #wsHomeFrame, #wsResultsFrame"),
a=0;a<b.length;a++)
if(b[a].style.visibility==="visible")
{
c=b[a];
break
}
var d=c?c.querySelector("div[frag]"):null;
return d
},getPageId:function()
{
var c=WinStore.BI,
b=c.getPageFrag(),
a;
if(b)
a=b.getAttribute("id");
return a
},onPageLoaded:function(c)
{
var a=WinStore.BI,
d=a.getPageFrag(),
b=a.getPageId();
if(b)
{
if(a._initialized)
{
a.addMetaToHead("MS.PageId",b);
a._logObj.FirePageViewEvent(null,d,a._getSampling(c));
a._pageViewLogged=true
}
}
else
om.logErrorMessage("WinStore.BI.onPageLoaded: Cannot find page fragment root element to get the page ID")
},onPageUnloaded:function()
{
var a=WinStore.BI;
a.removeMetaFromHead("MS.PageId");
a._enabled&&
om.getBI(a._initBIForNewPage)
},logCustomBI:function(d,b,e,c)
{
var a=WinStore.BI;
a._initialized&&
a._logObj.LogCustomBI(d,b,e,a._getSampling(c))
},logImpressions:function(e,c,b,d)
{
var a=WinStore.BI;
a._initialized&&
a._logObj.LogImpressions(e,c,b,a._getSampling(d))
},firePageViewEvent:function(c,d,b)
{
var a=WinStore.BI;
if(a._initialized)
{
a._logObj.FirePageViewEvent(c,a.getPageFrag(),a._getSampling(d),b);
a._pageViewLogged=true
}
},fireClickEvent:function(c,d,a,f,g,e)
{
var b=WinStore.BI;
om.logUserClickAction(a?a:c);
b._initialized&&
b._logObj.FireClickEvent(d,a,f,c,g,b._getSampling(e))
},refreshSigninState:function()
{
var a=WinStore.BI;
om.getBI(a._refreshUserInfo)
},setupSessionId:function(b)
{
var a=WinStore.BI;
om.logInfoMessage("setupSessionId: isPdpEntryPoint = "+b);
if(a._enabled&&!a._logObj.onInitComplete)
if(b===true)
om.getBI(a._setSessionCookie);
else
om.getBI(a._setClientSessionId)
},_setSessionCookie:function(d)
{
var b=WinStore.BI;
if(b._initialized)
{
var a=d.SessionId,
c=b._logObj.GetSessionID();
if(a&&a!==""&&a!=="null"&&a!==c)
{
b._logObj.SetSessionID(a);
om.logInfoMessage("setupSessionId: setting server sid to client sid - "+a)
}
}
},_setClientSessionId:function(d)
{
var b=WinStore.BI;
if(b._initialized)
{
var c=d.SessionId,
a=b._logObj.GetSessionID();
if(a&&a!==""&&a!==c)
{
om.logInfoMessage("setupSessionId: setting client session id to server id "+a);
om.setSessionId(a)
}
}
},_setClientMuid:function()
{
var b=WinStore.BI;
if(b._initialized)
{
var a=b._logObj.GetMuid();
if(a&&a!=="")
{
om.logInfoMessage("setupMuid: setting client muid to  "+a);
om.setMuid(a)
}
}
},setClientAnid:function(b)
{
var a=WinStore.BI;
if(a._initialized)
{
var c={UserANID:b&&b!="-1"?b:"",UserCID:a._cid,UserLRR:a._lrr};
a._refreshUserInfo(c)
}
},_refreshUserInfo:function(a)
{
var b=WinStore.BI,
e=a.UserCID&&a.UserCID!="-1"?a.UserCID:"",
d=a.UserANID?a.UserANID==="-1"?b._anid:a.UserANID.toLowerCase():"",
c=a.UserLRR!==null&&typeof a.UserLRR==="number"?a.UserLRR:"-1";
if(e!==b._cid||d!==b._anid||c!==b._lrr)
{
b._cid=e;
b._anid=d;
b._lrr=c;
b._selfHostUser=a.SelfhostUser!==undefined&&a.SelfhostUser!==null?a.SelfhostUser:null;
b.addMetaToHead("MS.LRR",c);
var f={ANID:d,LRR:c};
b._logObj.SetUserInfo(e,f)
}
b.addMetaToHead("MS.OCID",a.CampaignId)
},_getSampling:function(b)
{
var a=Wol.ContentInstrumentation.BiSettings;
return a&&a.Sampling?a.Sampling[b]:null
},_sendBingLoggingRequest:function(a)
{
var b=WinStore.BI;
if(b._initialized)
a!==null&&typeof a!=="undefined"&&
om.sendBingLoggingRequest(a)
},_initBI:function(b)
{
var a=WinStore.BI;
a._logObj=Wol.ContentInstrumentation.Logging;
if(b)
{
a._initialized=true;
if(b.Enabled)
{
a._enabled=true;
var h=["EntityId","EntityType","K"];
a.addMetaToHead("MS.Culture",b.Language);
a.addMetaToHead("MS.Channel.PId",b.ChannelPartnerId);
a.addMetaToHead("MS.CTPCode",b.Location);
a.addMetaToHead("MS.OOBE.Delta",b.DaysSinceOobe);
a.addMetaToHead("MS.OAOptInfoId",b.OAId);
a.addMetaToHead("MS.OEM.Id",b.OEMId);
a.addMetaToHead("MS.Filters",b.Filters);
a.addMetaToHead("BI.Log","1");
a.addMetaToHead("MS.ClientVer",b.StoreClientVersion);
a.addMetaToHead("MS.PagesVer",b.StorePagesVersion);
a.addMetaToHead("MS.FlightId",b.StoreFlightId);
a.addMetaToHead("MS.Architecture",b.Architecture);
a.addMetaToHead("MS.HardwareFlags",b.HardwareCapabilityMask);
a._refreshUserInfo(b);
var e={Client:{Id:a.WinStoreClientId,Name:a.WinStoreClientName,Ver:b.StoreClientVersion},OS:{MajorVer:b.OsMajorVer,MinorVer:b.OsMinorVer,BuildVer:b.OsBuildVer,QfeNum:b.OsQfeNum,AppModel:b.OsAppModel}},
g={UILanguage:b.Language,Market:b.Location},
d=window.getComputedStyle(document.body).direction,
c="";
switch(d)
{
case "ltr":
c="TBLR";
break;
case "rtl":
c="TBRL";
break;
default:
c=""
}
var f={Device:{Architecture:b.Architecture},Oem:{Name:b.OemName,Model:b.OemModel},Screen:{Dpi:b.ScreenDpi,ResOrnt:"TBLR",LangOrnt:c}};
a._logObj.SetEntityType(a.EntityTypeName);
a._logObj.SetLoggingCallback(a._sendBingLoggingRequest);
a._logObj.onInitComplete=function()
{
a._logObj.onInitComplete=null;
if(b.SessionId)
a._setSessionCookie(b);
else
a._setClientSessionId(b);
a._setClientMuid()
};
a._logObj.SetTagConfig("MS","RequestId",h);
a._logObj.SetEnvironment(b.Server,false);
a._logObj.Init(false,true,g,e,f,true)
}
else
a._enabled=false
}
}});
var APPS_NOT_GAMES_CATEGORY_ID=1,
GAMES_CATEGORY_ID=3;
WinJS.Namespace.define("WinStore.Category",{_categoryData:{value:null,writable:true},_filteredRecLists:{value:[],writable:true},_msFeatureData:{value:null,writable:true},_partnerFeatureData:{value:null,writable:true},_osUpgradeFeatureData:{value:null,writable:true},_featureDataLoaded:{value:false,writable:true},imageUrlRoot:{value:null,writable:true},FeatureDataType:{value:{partner:"partner",microsoft:"microsoft",osUpgrade:"osUpgrade"}},FeatureListType:{value:{app:"app",topic:"topic"}},SubcategoryLists:{value:{},writable:true},UpgradeCategoryId:5e3,MaxAppsPerTopic:{value:10,writable:false},getNamespaceAsync:function()
{
return new WinJS.Promise(function(b,a)
{
WinStore.Utilities.getNamespace(function()
{
if(om.namespace)
if(om.namespace.categories&&Array.isArray(om.namespace.categories)&&om.namespace.categories.length>0)
b(om.namespace.categories);
else
{
var c="WinStore.Category.getNamespaceAsync: om.namespace set, but has no categories in callback function.";
om.logErrorMessage(c);
a(c)
}
else
{
var c="WinStore.Category.getNamespaceAsync: om.namespace not set in callback function.";
om.logErrorMessage(c);
a(c)
}
})
})
},getFilteredRecLists:function()
{
if(WinStore.Category._filteredRecLists.length===0)
for(var a=0;a<om.namespace.recLists.length;++a)
if(om.namespace.recLists[a].id!==2&&om.namespace.recLists[a].id!==6)
{
var b=om.namespace.recLists[a];
WinStore.Category._filteredRecLists.push({name:b.name,label:b.name,id:b.id,href:"?id="+b.id+"&cid=0",type:"recList"})
}
return WinStore.Category._filteredRecLists
},getCategoryData:function(a)
{
return new WinJS.Promise(function(b,c)
{
if(!WinStore.Category._categoryData||a||WinStore.Category._categoryData.length===0)
WinStore.Category.getNamespaceAsync().then(function(d)
{
var a=[],
c=om.namespace.defBrowseParams;
d.forEach(function(b)
{
if(isNaN(b.id))
om.logErrorMessage("WinStore.Category.getCategoryData: Namespace response contains category id '"+d.id+"' which is not a number");
else
{
var d={name:b.name,id:b.id,href:"?cid="+b.id,type:"category"};
if(b.subcategories&&Array.isArray(b.subcategories))
{
d.subcategories=[];
b.subcategories.forEach(function(a)
{
a.href=d.href+"&scid="+a.id+"&"+c;
a.type="subcategory";
d.subcategories.push(a)
})
}
d.href+="&"+c;
a.push(d)
}
});
om.logInfoMessage("WinStore.Category.getCategoryData: retrieved "+a.length+" categories from namespace data");
WinStore.Category._categoryData=a;
b(a)
},function(a)
{
om.logErrorMessage(a);
c(a);
return null
});
else
b(WinStore.Category._categoryData)
})
},getListOfCategories:function(a,b)
{
return new WinJS.Promise(function(c)
{
WinStore.Category.getCategoryData().then(function(e)
{
if(!b)
for(var d=0;d<e.length;++d)
if(e[d].id===WinStore.Category.UpgradeCategoryId)
{
e.splice(d,1);
break
}
if(a==0)
c(e);
else
if(WinStore.Category.SubcategoryLists&&WinStore.Category.SubcategoryLists[a])
c(WinStore.Category.SubcategoryLists[a]);
else
for(var d=0;d<e.length;++d)
if(e[d].id==a)
{
WinStore.Category.SubcategoryLists[a]=e[d].subcategories;
c(e[d].subcategories)
}
})
})
},getCategoryName:function(c)
{
var a="",
b=parseInt(c);
if(isNaN(b))
om.logErrorMessage("WinStore.Category.getCategoryName: categoryId "+c+" is not a number, unable to lookup name");
else
{
function d(b,d)
{
var c=null;
if(d!==0)
{
for(var a=0;a<b.length;++a)
if(b[a].id===d)
{
c=b[a].name;
break
}
!c&&
om.logWarningMessage("WinStore.Category.getCategoryName: no name found for categoryId "+d)
}
return c
}
if(!WinStore.Category._categoryData)
WinStore.Category.getCategoryData().then(function(c)
{
a=d(c,b)
});
else
a=d(WinStore.Category._categoryData,b)
}
return a
},onFeatureDataLoaded:function(a)
{
return new WinJS.Promise(function(d,e)
{
try
{
var c=JSON.parse(a.responseText);
d(c)
}
catch(b)
{
om.logErrorMessage("WinStore.Category.onFeatureDataLoaded: Error parsing JSON file: "+b.name+": "+b.message);
e(null)
}
})
},onFeatureDataLoadFailed:function(a)
{
return new WinJS.Promise(function(c,b)
{
b(a.status)
})
},loadFeatureDataAsync:function(b,a)
{
return new WinJS.Promise(function(e)
{
var h=om.namespace.winStoreUserAge,
g=h&&h<12,
c,
d;
if(WinStore.Category.FeatureDataType.partner===a)
{
c=g?null:b.cpFeatures;
d="Channel partner features.json"
}
else
if(WinStore.Category.FeatureDataType.microsoft===a)
{
c=g?null:b.msFeatures;
d="Microsoft features.json"
}
else
if(WinStore.Category.FeatureDataType.osUpgrade===a)
{
if(b.showOSUpgrade)
c="osUpgrade.json";
d="Microsoft OS Upgrade.json"
}
else
{
om.logWarningMessage("WinStore.Category.loadFeatureDataAsync: unknown feature dataType"+a+", not processing");
e(false);
return
}
if(c)
{
var f;
if(WinStore.Category.FeatureDataType.osUpgrade!==a)
{
var i=c.split("/");
if(i.length<7)
om.logErrorMessage("WinStore.Category.loadFeatureDataAsync: JSON file path for "+a+" should be at least 7 folders deep");
else
{
f=i[3];
c="../../../../../../../"+c
}
}
om.logInfoMessage("WinStore.Category.loadFeatureDataAsync: "+d+" loading from "+c);
WinJS.xhr({url:c}).then(WinStore.Category.onFeatureDataLoaded,WinStore.Category.onFeatureDataLoadFailed).then(function(b)
{
om.logInfoMessage("WinStore.Category.loadFeatureDataAsync: "+d+" file loaded.");
if(WinStore.Category.FeatureDataType.partner===a)
{
WinStore.Category._partnerFeatureData=b;
WinStore.Category._partnerFeatureData.type=WinStore.Category.FeatureDataType.partner;
WinStore.Category._partnerFeatureData.locale=f
}
else
if(WinStore.Category.FeatureDataType.microsoft===a)
{
WinStore.Category._msFeatureData=b;
WinStore.Category._msFeatureData.type=WinStore.Category.FeatureDataType.microsoft;
WinStore.Category._msFeatureData.locale=f
}
else
if(WinStore.Category.FeatureDataType.osUpgrade===a)
{
WinStore.Category._osUpgradeFeatureData=b;
WinStore.Category._osUpgradeFeatureData.type=WinStore.Category.FeatureDataType.osUpgrade;
WinStore.Category._osUpgradeFeatureData.locale=f
}
e(true)
},function(b)
{
if(b!==null)
{
var c="WinStore.Category.loadFeatureDataAsync: "+d+" file not downloaded; http status = "+b;
(WinStore.Category.FeatureDataType.partner===a||WinStore.Category.FeatureDataType.microsoft===a||WinStore.Category.FeatureDataType.osUpgrade===a)&&
om.logInfoMessage(c)
}
e(false)
})
}
else
{
if(g)
om.logInfoMessage("WinStore.Category.loadFeatureDataAsync: "+a+" features.json not used; winstore user age "+h+" is hiding editorial content");
else
om.logInfoMessage("WinStore.Category.loadFeatureDataAsync: "+a+" features.json file not specified in HomePageData");
e(false)
}
})
},loadFeaturedAppsAsync:function(a)
{
return new WinJS.Promise(function(b)
{
if(a&&a.featuredAppListId&&a.featuredAppListId!=="0")
om.getFeaturedAppList(a.featuredAppListId,function(c)
{
!c&&
om.logErrorMessage("WinStore.Category.loadFeaturedAppsAsync: failed to retrieve featured apps for list ID '"+String(a.featuredAppListId)+"'");
b(c)
});
else
b(null)
})
},loadFeatureData:function(a)
{
return new WinJS.Promise(function(b)
{
WinJS.Promise.join({partnerLoaded:WinStore.Category.loadFeatureDataAsync(a,WinStore.Category.FeatureDataType.partner),microsoftLoaded:WinStore.Category.loadFeatureDataAsync(a,WinStore.Category.FeatureDataType.microsoft),osUpgradeLoaded:WinStore.Category.loadFeatureDataAsync(a,WinStore.Category.FeatureDataType.osUpgrade)}).then(function(a)
{
if(a.osUpgradeLoaded&&WinStore.Category._osUpgradeFeatureData.catPages.length>0)
if(a.microsoftLoaded)
WinStore.Category._msFeatureData.catPages=WinStore.Category._msFeatureData.catPages.concat(WinStore.Category._osUpgradeFeatureData.catPages);
else
om.logWarningMessage("WinStore.Category.loadFeatureData: microsoft feature data not loaded. Unable to append osUpgrade feature data.");
WinJS.Promise.join({partner:WinStore.Category.loadFeaturedAppsAsync(WinStore.Category._partnerFeatureData),microsoft:WinStore.Category.loadFeaturedAppsAsync(WinStore.Category._msFeatureData)}).then(function(a)
{
if(a.partner&&Array.isArray(a.partner.appInfo))
WinStore.Category._partnerFeatureData.featuredApps=a.partner.appInfo;
if(a.microsoft&&Array.isArray(a.microsoft.appInfo))
WinStore.Category._msFeatureData.featuredApps=a.microsoft.appInfo;
WinStore.Category._featureDataLoaded=true;
b(true)
})
})
})
},getFeaturedCollections:function()
{
var a=null;
if(WinStore.Category._msFeatureData&&WinStore.Category._msFeatureData.collections&&WinStore.Category._msFeatureData.collections.length>0&&WinStore.Category._msFeatureData.collections[0].panes)
a=WinStore.Category._msFeatureData.collections[0].panes;
return a
},getCategoryFeatures:function(c,b,a,d)
{
return new WinJS.Promise(function(f)
{
if(!WinStore.Category.imageUrlRoot)
if(a)
WinStore.Category.imageUrlRoot=a;
else
om.getImageData().done(function(a)
{
WinStore.Category.imageUrlRoot=a.imageUrlRoot
});
var e=null;
if(!WinStore.Category._featureDataLoaded||d)
WinStore.Category.loadFeatureData(c).then(function()
{
e=WinStore.Category._getCategoryFeatureDataWithFallback(b);
f(e)
},function(a)
{
om.logErrorMessage(a)
});
else
{
e=WinStore.Category._getCategoryFeatureDataWithFallback(b);
f(e)
}
})
},_getCategoryFeatureDataWithFallback:function(d)
{
var c=null,
a=null;
if(WinStore.Category._partnerFeatureData)
a=WinStore.Category._partnerFeatureData;
else
a=WinStore.Category._msFeatureData;
if(a)
{
!a.merged&&
WinStore.Category._mergeFeaturedApps(a);
for(var b=0;b<a.catPages.length;++b)
if(a.catPages[b].categoryId===d)
{
c=a.catPages[b];
break
}
}
else
om.logErrorMessage("WinStore.Category._getCategoryFeatureDataWithFallback: No feature data available (partner and MS features data null).");
return c
},_mergeFeaturedApps:function(d)
{
if(d.featuredApps)
for(var l=0,
j=0;j<d.catPages.length;++j)
{
var e=d.catPages[j].panes;
if(e&&Array.isArray(e))
for(var h=0;h<e.length;++h)
{
var c=e[h],
f=e[h].tiles;
c.categoryId=d.catPages[j].categoryId;
if(c.layout)
{
c.layout=c.layout.toLowerCase();
if(c.layout==="miami-1")
if(c.tiles&&c.tiles[0]&&c.tiles[0].type)
c.layout=c.layout+"-"+c.tiles[0].type;
else
{
om.logWarningMessage("WinStore.Category._mergeFeaturedApps: miami-1 layout specified without type for "+c.title+". Removing pane (it won't be displayed)");
e.splice(h,1)
}
}
if(f&&Array.isArray(f))
for(var g=0;g<f.length;++g)
{
++l;
if(g===0)
c.title=f[g].title;
var a=f[g];
a.positionBI=l;
if(!c.listType)
c.listType=a.type;
else
c.listType!==a.type&&
om.logWarningMessage("WinStore.Category._mergeFeaturedApps: pane "+c.title+" has both app and topic tiles defined.");
if(a.image)
a.curatedImage=WinStore.Category.imageUrlRoot+a.image;
if(a.tile)
a.curatedTileImage=WinStore.Category.imageUrlRoot+a.tile;
if(a.type===WinStore.Category.FeatureListType.app)
{
for(var k=false,
i=0;i<d.featuredApps.length;++i)
if(d.featuredApps[i].Id===a.id)
{
var b=d.featuredApps[i];
WinStore.Utilities.prepareAppInfoData(b,i);
a.Id=b.Id;
a.mediumImage=b.mediumImage;
a.largeImage=b.largeImage;
a.squareImage=b.squareImage;
a.Rating=b.Rating;
a.RatingCount=b.RatingCount;
a.RatingCountText=b.RatingCountText;
a.Price=b.Price;
a.Name=b.Name;
a.BackgroundColor=b.BackgroundColor;
a.PackageFamilyName=b.PackageFamilyName;
a.LogoURL=b.LogoURL;
a.Accessible=b.Accessible;
a.KValue=b.KValue;
a.PercentageOff=b.PercentageOff;
a.PromoEndDate=b.PromoEndDate;
a.PromoPrice=b.PromoPrice;
a.FreeTrialText=b.FreeTrialText;
a.tileId="feature-"+g+"."+i;
a.Category=b.Category;
a.CategoryId=b.CategoryId;
a.AppLanguage=b.AppLanguage;
a.ReleaseId=b.ReleaseId;
a.ratingBI=WinStore.Utilities.getBIRating(b.Rating);
k=true;
break
}
if(!k)
{
f.splice(g--,1);
f.length===0&&
e.splice(h--,1);
var n="CategoryId="+c.categoryId+", Template="+c.layout+", TileId="+a.id;
om.qosScenarioFailWithInit(WinStore.Utilities.QosScenario.SpotLightMissing,WinStore.Utilities.ErrorCodes.HTTP_STATUS_NO_CONTENT,n)
}
}
else
if(a.type===WinStore.Category.FeatureListType.topic)
{
function m(e,a)
{
if(!a.topicData)
{
a.topicData=e;
for(var b=0;b<a.topicData.appInfo.length;++b)
WinStore.Utilities.prepareAppInfoData(a.topicData.appInfo[b],b);
if(a.paneNode)
{
var d=a.paneNode.parentNode;
if(d)
{
var c=WinStore.Controls.Hub.createSpotlightPane(a);
if(c)
{
om.logInfoMessage("WinStore.Category._mergeFeaturedApps.onTopicResults: got "+a.title+" topic data; replacing pane in DOM with full data");
d.replaceChild(c,a.paneNode)
}
else
om.logWarningMessage("WinStore.Category._mergeFeaturedApps.onTopicResults: got "+a.title+" topic data, but createSpotlightPane returned null node so not replacing in DOM")
}
else
om.logWarningMessage("WinStore.Category._mergeFeaturedApps.onTopicResults: got "+a.title+" topic data, but unable to find parent node to replace pane in DOM");
a.paneNode=null
}
}
else
om.logInfoMessage("WinStore.Category._mergeFeaturedApps: multiple topic tiles in pane "+a.title+" specify topic Id")
}
om.getTopicList(a.id,WinStore.Category.MaxAppsPerTopic,m,c)
}
}
}
}
else
om.logWarningMessage("WinStore.Category._mergeFeaturedApps: featureData for "+d.type+" doesn't contain a featuredApps list. Skipping merge");
d.merged=true
}});
WinJS.Namespace.define("WinStore.BlueHomePage",{_hub:{value:null,writable:true},initControls:function(a,d)
{
var c=WinStore.Utilities.getUrlParam(a,"refresh")==="1";
if(c)
{
a=a.replace("refresh=1","refresh=0");
om.updateTravelLogCurrentPageParams(a)
}
WinStore.Controls.Hub.ScrollPositionMap[0]=0;
document.documentElement.setAttribute("allowVScroll","1");
if(WinStore.BI._initialized&&WinStore.BI._selfHostUser)
WinStore.Frame.setPageTitle("Store (self-host)",false);
else
{
WinStore.Frame.setPageTitle("Store",false);
!WinStore.BI._initialized&&
om.getBI(WinStore.BlueHomePage.checkSelfHost)
}
var e={showSpotlight:true,showPicksForYou:true,showCategories:true,showCollections:true},
b=document.getElementById("mainContentHome");
if(b)
{
this._hub=new WinStore.Controls.Hub(b,e);
this._hub.init(a,d,c);
WinStore.Controls.Hub.ShowingHomePage=true
}
else
{
om.logErrorMessage("WinStore.BlueHomePage.initControls: unable to locate mainContentHome container, can't initialize hub control");
om.navigateToErrorPage("Blue Home Page unable to initialize custom hub control")
}
},checkSelfHost:function(a)
{
a&&a.SelfhostUser&&
WinStore.Frame.setPageTitle("Store (self-host)",false)
},dispose:function()
{
this._hub&&
this._hub.dispose()
},onUnload:function()
{
WinStore.Controls.Hub.onPageUnload();
WinStore.Controls.Hub.ShowingHomePage=false;
if(this._hub&&this._hub.control)
{
WinStore.Controls.Hub.ScrollPositionMap[0]=this._hub.control.scrollPosition;
this._hub.control._element&&
this._hub.control._element.setAttribute("lastIgsent",null)
}
var a=WinStore.Controls.Hub.containerElement;
a&&a.getAttribute("pageDataLoaded")&&
WinStore.Navigation.invalidateHomePage()
},reload:function()
{
this._hub.reload(this._hub.urlParams,this._hub.onDataLoaded,true)
},onNavigateReturn:function(c)
{
if(WinStore.BI._initialized&&WinStore.BI._selfHostUser)
WinStore.Frame.setPageTitle("Store (self-host)",false);
else
WinStore.Frame.setPageTitle("Store",false);
if(this._hub.control)
this._hub.control.scrollPosition=c?WinStore.Controls.Hub.ScrollPositionMap[0]:0;
WinStore.Controls.Hub.ShowingHomePage=true;
WinStore.Controls.Hub.startFlipViewTimer(this._hub);
var a=document.getElementById("mainContentHome");
if(a)
{
var b=a.parentNode.getAttribute("id");
b&&
WinStore.BI.addMetaToHead("MS.PageId",b);
WinStore.BI.addMetaToHead("MS.PageIg",WinStore.Utilities.generateGuid());
this._hub.firePageViewEvent()
}
}});
WinJS.Namespace.define("WinStore.ResultsPage",{_listType:{value:null,writable:true},_showFilters:{value:true,writable:true},_categoryId:{value:null,writable:true},_categoryIndex:{value:-1,writable:true},_urlParams:{value:null,writable:true},_listView:{value:null,writable:true},_onDataLoaded:{value:null,writable:true},_savedScrollPosition:{value:0,writable:true},_noResultsMessage:{value:null,writable:true},_headerHeightpx:{value:240,writable:false},_footerHeightpx:{value:40,writable:false},_collectionTileHeightpx:{value:140,writable:false},_biMetadata:{value:null,writable:true},showNoResultsMessage:function(b,a)
{
WinStore.Utilities.createNoResultsSection(b,a,_noResultsMessage,null)
},initControls:function(c,h)
{
this._urlParams=c;
for(var f=[{param:"similarapps",type:WinStore.List.ListType.similarApps,filters:false,showCategoryOnTile:true,saveScrollPosition:true,includeCategory:true,noResultsMessage:"We can’t find any related apps."},{param:"dname",type:WinStore.List.ListType.developerResults,filters:false,showCategoryOnTile:true,saveScrollPosition:false,includeCategory:true,noResultsMessage:"We can’t find any apps by this publisher."},{param:"search",type:WinStore.List.ListType.searchResults,filters:true,showCategoryOnTile:true,saveScrollPosition:false,includeCategory:true,noResultsMessage:"We can’t find any apps that match your search. Enter a different word or phrase, and then search again."},{param:"cid",type:WinStore.List.ListType.categoryResults,filters:true,showCategoryOnTile:false,saveScrollPosition:false,includeCategory:false,noResultsMessage:"We can’t find any apps for this category.",isLast:true}],
i=WinStore.Utilities.getUrlParam,
e=document.getElementById("mainContentResults"),
d=0;d<f.length;d++)
{
var a=f[d];
if(""!==i(c,a.param)||a.isLast===true)
{
this._listType=a.type;
this._showFilters=a.filters;
var b=new WinStore.List.StoreListOptions(e,a.type,"mediumAppTileTemplate",this.showNoResultsMessage);
b.onDataLoaded=h;
b.queryString=c;
b.saveScrollPosition=a.saveScrollPosition;
b.showCategoryOnTile=a.showCategoryOnTile;
b.includeCategory=a.includeCategory;
_noResultsMessage=a.noResultsMessage;
this._listOptions=b;
break
}
}
if(!this._listOptions)
debugger;
if(!this._showFilters)
{
var g=document.getElementById("headerBottomResults");
if(g)
g.style.display="none"
}
this._categoryId=WinStore.Utilities.getUrlParam(c,"cid");
this._categoryIndex=-1;
this._listView=null;
this._savedScrollPosition=0;
this._biMetadata=[{queryParam:"priceFilter",name:"RequestQueryFilter",listType:WinStore.List.ListType.searchResults,allowBlank:true},{queryParam:"priceFilter",name:"RequestQueryFilter",listType:WinStore.List.ListType.categoryResults,allowBlank:true},{queryParam:"priceFilter",name:"MS.Search.priceFilter",listType:WinStore.List.ListType.searchResults},{queryParam:"priceFilter",name:"MS.Cat.priceFilter",listType:WinStore.List.ListType.categoryResults},{queryParam:"sortBy",name:"MS.Search.Sort",listType:WinStore.List.ListType.searchResults,sorting:true},{queryParam:"sortBy",name:"MS.Cat.Sort",listType:WinStore.List.ListType.categoryResults,sorting:true},{queryParam:"sortBy",name:"RequestQuerySort",listType:WinStore.List.ListType.searchResults,sorting:true,allowBlank:true},{queryParam:"sortBy",name:"RequestQuerySort",listType:WinStore.List.ListType.categoryResults,sorting:true,allowBlank:true},{queryParam:"scid",name:"MS.Cat.SubCatFilter",listType:WinStore.List.ListType.categoryResults},{queryParam:"similarapps",name:"CList.App.Id",listType:WinStore.List.ListType.similarApps},{queryParam:"dname",name:"CList.Dev.Name",listType:WinStore.List.ListType.developerResults},{queryParam:"queryId",name:"MS.Search.QueryId",listType:WinStore.List.ListType.categoryResults},{queryParam:"queryId",name:"MS.Search.QueryId",listType:WinStore.List.ListType.searchResults},{queryParam:"search",name:"MS.Search.Query",listType:WinStore.List.ListType.searchResults,query:true},{queryParam:"search",name:"RequestQueryTerm",listType:WinStore.List.ListType.searchResults,query:true,allowBlank:true},{queryParam:"cid",name:"MS.Search.CatFilter",listType:WinStore.List.ListType.searchResults,notZero:true}];
WinStore.Utilities.updateElementAttributes(e,this._biMetadata,c,this._listType);
WinStore.Utilities.getNamespace(this._initControls,this)
},onPageUnload:function(c)
{
WinStore.BI.removeMetaFromHead("MS.Cat.Id");
WinStore.BI.removeMetaFromHead("MS.SubCat.Id");
WinStore.BI.removeMetaFromHead("MS.PageId");
WinStore.BI.removeMetaFromHead("MS.PageIg");
WinStore.BI.removeMetaFromHead("MS.pNum");
var b=true,
a=this._clearOnDataLoaded();
if(!c&&a&&!a._callbacksPending)
{
b=false;
WinStore.Frame.saveResultsHeader();
this._savedScrollPosition=a.scrollPosition
}
return b
},_clearOnDataLoaded:function()
{
var a=null,
b=document.getElementById("mainContentResults");
if(b)
{
a=b.winControl;
if(this._onDataLoaded&&a&&a._onDataLoaded!==undefined&&typeof a._onDataLoaded==="function")
{
this._onDataLoaded(true);
this._onDataLoaded=null;
delete a._onDataLoaded;
a=null
}
}
return a
},_addBIValuestoMetaToHead:function(d,c)
{
var b=WinStore.Utilities.getUrlParam(d,"cid");
b!==""&&b!=="0"&&
WinStore.BI.addMetaToHead("MS.Cat.Id",b);
var a=WinStore.Utilities.getUrlParam(d,"scid");
a!==""&&a!=="0"&&
WinStore.BI.addMetaToHead("MS.SubCat.Id",a);
var e=WinStore.BI.getPageId();
e&&
WinStore.BI.addMetaToHead("MS.PageId",e);
if(c)
{
var f=c.getAttribute("pageIg");
f&&
WinStore.BI.addMetaToHead("MS.PageIg",f)
}
},onPageNavBackFromPDP:function()
{
om.etwResultsListRestored();
WinStore.Frame.restoreResultsHeader();
var b=document.getElementById("mainContentResults"),
c=document.getElementById("collectionsContainer");
if(b)
{
var a=b.winControl;
if(a)
{
WinStore.ResultsPage._addBIValuestoMetaToHead(WinStore.ResultsPage._urlParams,b);
WinStore.BI.addMetaToHead("MS.PageIg",WinStore.Utilities.generateGuid());
delete a._hasClicked;
delete a._doneLogEtw;
a._element.setAttribute("lastIgSent",null);
a.scrollPosition=this._savedScrollPosition
}
b.setActive()
}
if(c)
{
var a=c.winControl;
if(a)
{
delete a._hasClicked;
delete a._doneLogEtw;
a._element.setAttribute("lastIgSent",null)
}
}
},_setSearchTitle:function(d)
{
var c=decodeURIComponent(WinStore.Utilities.getUrlParam(this._urlParams,"search")),
b=WinStore.Utilities.getUrlParam(this._urlParams,"inputLanguage");
if(b&&b.length)
{
var a=document.getElementById("pageTitle");
a.innerHTML=d.replace("%1","<span lang='"+b+"'></span>");
a.firstElementChild.innerText=c;
if(WinStore.Utilities.isOverflowed(a))
a.setAttribute("title",a.innerText);
else
a.removeAttribute("title")
}
else
WinStore.Frame.setPageTitle(c)
},_initControls:function(a)
{
function c(a,b)
{
a.setAttribute("MS.Search.Count",b.toString());
WinStore.BI.logCustomBI("SearchResults",null,a)
}
function b(b)
{
om.etwListInitInteractive(b,a._catId)
}
if(a._listType===WinStore.List.ListType.categoryResults)
{
WinStore.Frame.setPageTitle(a._getCategoryName(),true);
a._listOptions.onTotalAppCountChanged=[{callback:c,context:a._listOptions.parentElement}];
function h(a)
{
a!==undefined&&
om.etwEvent(false,"WinStore.NavigateToCategoryResults (catId "+a+")")
}
a._listOptions.onPageWithListViewReady=[{callback:b,context:a._listType},{callback:h,context:a._catId}];
function l(a)
{
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.appTile,null,a.tile);
WinStore.Utilities.displayPDP(a.appId,{srcElement:a.parent,formCode:WinStore.BI.biFormCodes.CategoryPage,origIg:a.dataObject.impressionId})
}
a._listOptions.onTileClicked=l
}
else
if(a._listType===WinStore.List.ListType.similarApps)
{
WinStore.Frame.setPageTitle("Related apps",true);
function n(b,d)
{
var c={"App.Count":d.toString()},
a=b.getAttribute("CList.App.Id");
if(a)
c["CList.App.Id"]=a;
WinStore.BI.logCustomBI(WinStore.BI.biDataPoint.listId.similarApps,c,b)
}
var f=a._listOptions.parentElement;
a._listOptions.onTotalAppCountChanged=[{callback:c,context:f},{callback:n,context:f}];
a._listOptions.onPageWithListViewReady=[{callback:b,context:a._listType}];
function j(a)
{
var c={"Clist.Id":WinStore.BI.biDataPoint.listId.similarApps},
b=a.parent.getAttribute("CList.App.Id");
if(b)
c["CList.App.Id"]=b;
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.appTile,c,a.tile);
WinStore.Utilities.displayPDP(a.appId,{srcElement:a.parent,formCode:WinStore.BI.biFormCodes.Similar,origIg:a.dataObject.impressionId})
}
a._listOptions.onTileClicked=j
}
else
if(a._listType===WinStore.List.ListType.developerResults)
{
WinStore.Frame.setPageTitle(decodeURIComponent(WinStore.Utilities.getUrlParam(a._urlParams,"dname")),true);
function p(b,d)
{
var c={"App.Count":d.toString()},
a=b.getAttribute("CList.Dev.Name");
if(a)
c["CList.Dev.Name"]=a;
WinStore.BI.logCustomBI(WinStore.BI.biDataPoint.listId.developerApps,c,b)
}
a._listOptions.onTotalAppCountChanged=[{callback:p,context:a._listOptions.parentElement}];
a._listOptions.onPageWithListViewReady=[{callback:b,context:a._listType}];
function k(a)
{
var c={"Clist.Id":WinStore.BI.biDataPoint.listId.developerApps},
b=a.parent.getAttribute("CList.Dev.Name");
if(b)
c["CList.Dev.Name"]=b;
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.appTile,c,a.tile);
WinStore.Utilities.displayPDP(a.appId,{srcElement:a.parent,formCode:WinStore.BI.biFormCodes.Developer,origIg:a.dataObject.impressionId})
}
a._listOptions.onTileClicked=k
}
else
{
var d=WinStore.Utilities.getUrlParam(a._urlParams,"searchService");
if(d==65539||d==65540)
a._setSearchTitle("These apps support “%1”");
else
a._setSearchTitle("Results for “%1”");
a._listOptions.onTotalAppCountChanged=[{callback:c,context:a._listOptions.parentElement}];
function g(b,a)
{
om.etwSearchResultsInteractive(b,a)
}
a._listOptions.onPageWithListViewReady=[{callback:g,context:a._listType}];
function i(a)
{
a.tile.setAttribute("MS.Search.Pos",a.dataObject.itemIndex+1);
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.appTile,{AppNS:a.dataObject.appNS},a.tile);
WinStore.Utilities.displayPDP(a.appId,{srcElement:a.parent,formCode:WinStore.BI.biFormCodes.SearchPage,origIg:a.dataObject.impressionId})
}
a._listOptions.onTileClicked=i;
function m(a)
{
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.collectionTile,{AppNS:a.dataObject.appNS},a.tile);
om.showTopicPage("?id="+a.appId)
}
var e=true;
function o(j,a)
{
if(e)
{
e=false;
WinStore.BI.addMetaToHead("MS.PageIg",a.impressionId);
if(a.collectionTiles&&a.collectionTiles.length>0)
{
var g=document.getElementById("collectionsList");
g.style.display="-ms-grid";
var c=j._listOptions.parentElement;
c.setAttribute("MS.Search.DisplayCollections","1");
c.setAttribute("MS.Search.CollectionTileCount",a.collectionTiles.length);
c.setAttribute("MS.PageIg",a.impressionId);
var h=WinStore.Utilities.firstChildByClassOrDefault(g,"collectionsContainer");
if(h)
{
var d=0,
k=Math.floor((window.innerHeight-WinStore.ResultsPage._headerHeightpx-WinStore.ResultsPage._footerHeightpx)/WinStore.ResultsPage._collectionTileHeightpx),
i=a.collectionTiles.slice(0,k);
i.forEach(function(b)
{
b.itemIndex=d;
b.tilePositionBI=d+1;
b.appNS=a.appNS;
b.pageIndex=a.pageIndex;
b.impressionId=a.impressionId;
d++
});
var b=new WinStore.List.StoreListOptions(h,j._listType,"collectionTileTemplate",null);
b.renderAsCollectionTiles=true;
b.itemDataSource=(new WinJS.Binding.List(i)).dataSource;
b.onTileClicked=m;
var l=new WinStore.List.StoreList(b),
f=document.getElementById("mainContentResults");
f&&
WinJS.Utilities.removeClass(f,"mainContentResultsPadding")
}
}
}
}
a._listOptions.onQueryResult=[{callback:o,context:a}]
}
a._addBIValuestoMetaToHead(a._urlParams);
if(a._showFilters)
{
a._initCategoryFilter();
a._initPriceFilter();
a._initSortControl()
}
a._listView=new WinStore.List.StoreList(a._listOptions);
a._listOptions.onDataLoaded=null
},_getCategoryName:function()
{
var c=null,
d=parseInt(this._categoryId);
if(isNaN(d))
om.logErrorMessage("ResultsPage::_getCategoryName: Category ID '"+this._categoryId+"' is not a number");
else
for(var b=0;b<om.namespace.categories.length&&!c;b++)
{
var a=om.namespace.categories[b];
if(a.id===d)
{
this._categoryIndex=b;
c=a.name
}
else
if(Array.isArray(a.subcategories))
for(var e=0;e<a.subcategories.length;e++)
{
var f=a.subcategories[e];
if(f.id===d)
{
this._categoryIndex=b;
c=f.name;
break
}
}
}
return c
},_initCategoryFilter:function()
{
var a=null;
if(this._listType===WinStore.List.ListType.categoryResults)
if(0>this._categoryIndex)
om.logErrorMessage("ResultsPage::_initCategoryFilter: Category ID '"+this._categoryId+"' is not in the Namespace response");
else
{
var b=om.namespace.categories[this._categoryIndex].subcategories;
if(!Array.isArray(b)||0===b.length)
om.logInfoMessage("ResultsPage::_initCategoryFilter: Category '"+this._categoryId+"' has no subcategories so the subcategory filter is not shown");
else
{
var e=new Array({name:"All subcategories",id:"0"});
a=e.concat(b)
}
}
else
{
var c=om.namespace.categories;
if(Array.isArray(c)&&c.length>0)
{
var f=new Array({name:"All categories",id:"0"});
a=f.concat(c)
}
}
if(a)
{
var g={name:this._listType===WinStore.List.ListType.categoryResults?"scid":"cid",optionField:"id",defaultVal:"0"};
a[a.length-1].id===WinStore.Category.UpgradeCategoryId&&
a.pop();
this._initSelectControl("categoryFilterSelect",g,null,a)
}
else
{
var d=document.getElementById("categoryFilterSelect");
if(d)
d.style.display="none"
}
},_initPriceFilter:function()
{
var a=om.namespace.priceOptions,
b={name:om.namespace.priceParamName,optionField:"id",defaultVal:String(om.namespace.priceDefault)};
this._initSelectControl("priceFilterSelect",b,null,a)
},_initSortControl:function()
{
var d="",
e="",
a=this._listType===WinStore.List.ListType.categoryResults,
b=a?om.namespace.browseSortOptions:om.namespace.searchSortOptions;
if(Array.isArray(b)&&b.length>0)
{
var h=a?om.namespace.browseSortDefault:om.namespace.searchSortDefault,
c=b[h];
if(c)
{
d=String(c.sortOrder);
e=String(c.sortBy)
}
}
var f={name:a?om.namespace.browseSortByParamName:om.namespace.searchSortByParamName,optionField:"sortBy",defaultVal:e},
g={name:a?om.namespace.browseSortOrderParamName:om.namespace.searchSortOrderParamName,optionField:"sortOrder",defaultVal:d};
this._initSelectControl("sortSelect",f,g,b)
},_initSelectControl:function(j,d,b,g)
{
var a=document.getElementById(j);
if(a)
{
var h=WinStore.Utilities.getUrlParam(this._urlParams,d.name);
if(""===h)
h=d.defaultVal;
var c=null;
if(b)
{
c=WinStore.Utilities.getUrlParam(this._urlParams,b.name);
if(""===c)
c=b.defaultVal
}
for(var i=0,
f=0;f<g.length;f++)
{
var e=document.createElement("option");
e.text=g[f].name;
e.value=g[f].id;
e[d.optionField]=String(g[f][d.optionField]);
if(c)
e[b.optionField]=String(g[f][b.optionField]);
if(e[d.optionField]===h&&(!c||e[b.optionField]===c))
i=f;
a.appendChild(e)
}
a.paramName1=d.name;
a.paramField1=d.optionField;
if(c)
{
a.paramName2=b.name;
a.paramField2=b.optionField
}
a.selectedIndex=i;
var k=this;
a.addEventListener("change",function()
{
k._onSelectChange(a)
},false)
}
},_onSelectChange:function(b)
{
var d=b.options(b.selectedIndex);
om.logInfoMessage('Selection changed in results page control "'+b.id+'" to "'+d.text+'" (value = '+d.value+")");
om.etwFilterSortSelected(b.id,d.text,d.value);
(b.id==="categoryFilterSelect"||b.id==="priceFilterSelect")&&
WinStore.Frame.clearAppCount();
var i=false,
e=document.getElementById("noResults");
if(e)
{
var f=document.createElement("div");
f.id="mainContentResults";
e.getAttribute("keepFocus")&&
f.setAttribute("keepFocus","1");
var l=e.parentNode;
l.replaceChild(f,e);
i=true
}
var j=this._getSelectedParams("priceFilterSelect"),
k=this._getSelectedParams("sortSelect"),
a="?"+j+"&"+k;
if(this._listType===WinStore.List.ListType.categoryResults)
a+="&cid="+String(this._categoryId);
var c=document.getElementById("categoryFilterSelect");
if(c&&c.style.display!=="none")
{
var d=c.options(c.selectedIndex);
if("0"!==d[c.paramField1])
a+="&"+this._getSelectedParams("categoryFilterSelect")
}
if(this._listType===WinStore.List.ListType.searchResults)
{
a+="&search="+WinStore.Utilities.getUrlParam(this._urlParams,"search");
var h=WinStore.Utilities.getUrlParam(this._urlParams,"searchService");
if(h)
a+="&searchService="+h;
var g=WinStore.Utilities.getUrlParam(this._urlParams,"inputLanguage");
if(g)
a+="&inputLanguage="+g
}
this._urlParams=a;
om.updateTravelLogCurrentPageParams(a);
WinStore.Utilities.updateElementAttributes(this._listOptions.parentElement,this._biMetadata,this._urlParams,this._listType);
this._listOptions.queryString=a;
if(i)
this._listView=new WinStore.List.StoreList(this._listOptions);
else
this._listView.update(this._listOptions)
},_getSelectedParams:function(d)
{
var b="",
a=document.getElementById(d);
if(a)
{
var c=a.options(a.selectedIndex);
b=a.paramName1+"="+c[a.paramField1];
if(a.paramName2!==undefined)
b+="&"+a.paramName2+"="+c[a.paramField2]
}
return b
}});
WinJS.Namespace.define("WinStore.List",{ListType:{value:{categoryResults:"categoryResults",developerResults:"developerResults",searchResults:"searchResults",topic:"topic",dataDriven:"dataDriven",similarApps:"similarApps"},writable:false},SQR_LIST_PAGE_COUNT:{value:40,writeable:false},StoreListOptions:WinJS.Class.define(function(b,c,a,d)
{
if(!a)
debugger;
if(!b)
debugger;
this._tileTemplateName=a;
this._parentElement=b;
this._listType=c;
this._RValue=c;
this._queryString=null;
this._saveScrollPosition=false;
this._onDataLoaded=null;
this._showCategoryOnTile=false;
this._catId=null;
this._listId="0";
this._isChannelFeatured=false;
this._onQueryResult=[];
this._onTotalAppCountChanged=null;
this._onPageWithListViewReady=null;
this._onNoResults=d;
this._onTileClicked=null;
this._includeCategory=false;
this._animationElements=null;
this._updateFrameTileCount=true;
this._renderAsCollectionTiles=false;
this._dataSource=null
},{tileTemplateName:{"get":function()
{
return this._tileTemplateName
}},listType:{"get":function()
{
return this._listType
}},RValue:{"get":function()
{
return this._RValue
},"set":function(a)
{
this._RValue=a
}},parentElement:{"get":function()
{
return this._parentElement
}},queryString:{"get":function()
{
return this._queryString
},"set":function(a)
{
if(a[0]!="?")
debugger;
this._queryString=a;
this._catId=WinStore.Utilities.getUrlParam(a,"cid");
if(this._catId==="")
this._catId="0";
this._listId=WinStore.Utilities.getUrlParam(a,"id");
if(this._listType==WinStore.List.ListType.featuredQuery)
this._listId=WinStore.Utilities.getUrlParam(a,"search");
if(this._listId==="")
this._listId="0";
if(this._catId==="0")
this._showCategoryOnTile=true;
if(this._listType===WinStore.List.ListType.developerResults)
this._queryString="?"+WinStore.Utilities.getUrlParam(a,"dname");
else
if(this._listType===WinStore.List.ListType.similarApps)
this._queryString="?"+WinStore.Utilities.getUrlParam(a,"similarapps")
}},saveScrollPosition:{"get":function()
{
return this._saveScrollPosition
},"set":function(a)
{
this._saveScrollPosition=a
}},onDataLoaded:{"get":function()
{
return this._onDataLoaded
},"set":function(a)
{
this._onDataLoaded=a
}},showCategoryOnTile:{"get":function()
{
return this._showCategoryOnTile
},"set":function(a)
{
this._showCategoryOnTile=a
}},catId:{"get":function()
{
return this._catId
}},listId:{"get":function()
{
return this._listId
}},isChannelFeatured:{"get":function()
{
return this._isChannelFeatured
},"set":function(a)
{
this._isChannelFeatured=a
}},onQueryResult:{"get":function()
{
return this._onQueryResult
},"set":function(a)
{
if(!Array.isArray(a))
debugger;
this._onQueryResult=a
}},onTotalAppCountChanged:{"get":function()
{
return this._onTotalAppCountChanged
},"set":function(a)
{
if(!Array.isArray(a))
debugger;
this._onTotalAppCountChanged=a
}},onPageWithListViewReady:{"get":function()
{
return this._onPageWithListViewReady
},"set":function(a)
{
if(!Array.isArray(a))
debugger;
this._onPageWithListViewReady=a
}},onNoResults:{"get":function()
{
return this._onNoResults
},"set":function(a)
{
this._onNoResults=a
}},onTileClicked:{"get":function()
{
return this._onTileClicked
},"set":function(a)
{
this._onTileClicked=a
}},includeCategory:{"get":function()
{
return this._includeCategory
},"set":function(a)
{
this._includeCategory=a
}},animationElements:{"get":function()
{
return this._animationElements
},"set":function(a)
{
this._animationElements=a
}},updateFrameTileCount:{"get":function()
{
return this._updateFrameTileCount
},"set":function(a)
{
this._updateFrameTileCount=a
}},renderAsCollectionTiles:{"get":function()
{
return this._renderAsCollectionTiles
},"set":function(a)
{
this._renderAsCollectionTiles=a
}},itemDataSource:{"get":function()
{
return this._itemDataSource
},"set":function(a)
{
this._itemDataSource=a
}}}),StoreList:WinJS.Class.define(function(b)
{
this.copyListOptions(b);
this._parentElement.setAttribute("MS.LayoutType","List");
var a=new WinJS.UI.ListView(this._parentElement,{selectionMode:WinJS.UI.SelectionMode.none,swipeBehavior:WinJS.UI.SwipeBehavior.none,itemDataSource:this._itemDataSource?this._itemDataSource:this.createListDataSource(),itemTemplate:this.createTileRenderer()});
if(a)
{
this._listView=a;
a._onDataLoaded=b.onDataLoaded;
a.deferImpressionLogging=true;
var c=!this._parentElement.getAttribute("keepFocus");
if(!this._doNotSaveScrollPosition)
WinStore.Utilities.restoreScrollPosition(a,this._queryString,false,c);
else
if(c)
a.currentItem={index:0,hasFocus:true};
var d=this;
a.addEventListener("iteminvoked",function(a)
{
d.onTileClicked(a)
},false);
a.addEventListener("contentanimating",WinStore.Utilities.cancelListViewEntranceAnimation,false);
a.addEventListener("loadingstatechanged",function()
{
d.onLoadingStateChanged()
},false);
a.addEventListener("loadingstatechanged",WinStore.Utilities.addTooltipsToOverflowedTiles(a,true),false)
}
else
on.logErrorMessage("Could not create ListView for list "+this._listId)
},{copyListOptions:function(a)
{
this._listType=a.listType;
this._listId=a.listId;
this._catId=a.catId;
om.etwListInit(true,this._listType,this._listId,this._catId);
this._RValue=a._RValue;
this._listViewportInitialized=false;
this._queryString=a.queryString;
this._showCategoryOnTile=a.showCategoryOnTile;
this._doNotSaveScrollPosition=!a.saveScrollPosition;
this._isChannelFeatured=false;
this._tileTemplateName=a.tileTemplateName;
this._totalTilesReported=1e3;
this._parentElement=a.parentElement;
this._isChannelFeatured=a._isChannelFeatured;
this._totalTiles=1;
this._onQueryResult=a.onQueryResult;
this._onTotalAppCountChanged=a.onTotalAppCountChanged;
this._onPageWithListViewReady=a.onPageWithListViewReady;
this._onNoResults=a.onNoResults;
this._onTileClicked=a.onTileClicked;
this._includeCategory=a.includeCategory;
this._animationElements=a.animationElements;
this._updateFrameTileCount=a.updateFrameTileCount;
this._renderAsCollectionTiles=a.renderAsCollectionTiles;
this._itemDataSource=a.itemDataSource;
if(!this._onTileClicked)
debugger;
if(!this._parentElement)
debugger;
if(!this._tileTemplateName)
debugger
},update:function(b)
{
this._parentElement.setAttribute("keepFocus","1");
var a=this._listView;
delete a._doneLogEtw;
this.copyListOptions(b);
a.itemDataSource=this.createListDataSource()
},getElementAttr:function(b,d,e)
{
var a=e;
if(b)
{
var c=b.getAttribute(d);
if(c)
a=c
}
return a
},onTileClicked:function(e)
{
var c=this._listView;
if(c._hasClicked===undefined)
{
c._hasClicked=true;
var d=e.detail.itemIndex,
a=c.elementFromIndex(d);
if(a)
if(!a.attributes["appid"]&&!a.attributes["topicid"])
if(0!=a.children.length)
a=a.children[0];
var b=this;
e.detail.itemPromise.done(function(f)
{
var c=f.data,
e=c.Id;
!b._renderAsCollectionTiles&&
om.etwTileClicked(TileType.app,e);
!b._doNotSaveScrollPosition&&
WinStore.Utilities.saveScrollPosition(b._listView,d,b._queryString,false);
b._onTileClicked({parent:b._parentElement,appId:e,tile:a,dataObject:c})
})
}
},createTileRenderer:function()
{
var a=this;
function b(f)
{
var b,
d,
c,
e;
return {element:new WinJS.Promise(function(a)
{
e=a
}),renderComplete:f.then(function(h)
{
var f=h.data;
if(!f.tileId)
f.tileId=h.key;
if(a._renderAsCollectionTiles)
c=WinStore.Utilities.createCollectionTile(f);
else
{
c=WinStore.Utilities.createTile(a._tileTemplateName,f,a._includeCategory,true);
c.setAttribute("ChannelFeature",f.channelFeatured);
b=c.getElementsByClassName("appIcon")[0];
d=b.getAttribute("source");
if(h.isImageCached(d))
{
b.src=d;
b.style.opacity=1;
b.removeAttribute("source")
}
else
b.style.display="none";
f.MediumImageIs1x1&&
WinJS.Utilities.addClass(b,"mediumAppTileSquare");
var g=WinStore.Utilities.firstChildByClassOrDefault(c,"appTuningLink");
if(g)
{
g.setAttribute("appId",f.Id);
g.setAttribute("MS.DList.Id",WinStore.Controls.Hub.PICKS_FOR_YOU_LIST_TYPE_ID);
g.addEventListener("click",WinStore.TopicPage.onTuningClick,false)
}
}
e&&
e(c);
return h.ready
}).then(function(e)
{
if(!a._renderAsCollectionTiles)
{
WinStore.Utilities.populateRatingsControl(c,e.data);
if(b.src==="")
return e.loadImage(d,b).then(function()
{
b.style.display="inline";
return e.isOnScreen().then(function(a)
{
if(a)
return WinJS.UI.Animation.fadeIn(b);
else
b.style.opacity=1
})
},function()
{
om.logErrorMessage("List.js: createTileRenderer: failed to download app icon image for '"+e.data.Name+"' from "+d);
return e
})
}
return e
})}
}
return b
},createListDataSource:function()
{
var b=[],
e=0,
c=[],
f=this._queryString.substring(1),
a=this;
function g(h)
{
c.push(h);
if(c.length===1)
{
var d=a._listView,
g=a.onAppListReceived;
if(a._renderAsCollectionTiles)
g=a.onCollectionTilesReceived;
if(d)
d._callbacksPending=true;
om.getAppList(a._listType,a._listId,f,e,function(e)
{
if(d)
d._callbacksPending=false;
Array.isArray(a._onQueryResult)&&
a._onQueryResult.forEach(function(a)
{
a.callback(a.context,e)
});
g(a,e,b,f);
var h=c;
c=[];
h.forEach(function(a)
{
a()
})
});
++e
}
}
function d(e,c,f)
{
if(c<b.length||b.length===a._totalTiles)
f(b.slice(e,c+1));
else
g(function()
{
d(e,c,f)
})
}
var h={itemsFromIndex:function(e,f,g)
{
return new WinJS.Promise(function(j)
{
var h=Math.max(e-f,0),
i=Math.min(e+g,a._totalTiles-1);
d(h,i,function(f)
{
j({items:f,offset:e-h,totalCount:a._totalTilesReported,absoluteIndex:e});
if(a._listViewportInitialized&&b.length<a._totalTilesReported&&c.length===0&&i>b.length-WinStore.List.SQR_LIST_PAGE_COUNT)
{
om.logVerboseMessage("List.dataAdapter.itemsFromIndex: prefetching items at index "+b.length);
d(b.length,b.length,function()
{
})
}
})
})
},getCount:function()
{
return new WinJS.Promise(function(b)
{
d(0,0,function()
{
b(a._totalTilesReported)
})
})
}},
i=WinJS.Class.derive(WinJS.UI.VirtualizedDataSource,function(a)
{
this._baseDataSourceConstructor(a)
});
return new i(h)
},onAppListReceived:function(a,b,d,l)
{
var e=false,
g=[],
f=a._parentElement,
c=a._listView;
if(0===b.pageIndex)
{
a._totalTiles=b.totalApps;
e=true;
if(b.pagiCode&&b.pagiCode.length>0)
l+="&pgc="+b.pagiCode;
f.setAttribute("MS.IG",b.impressionId);
f.setAttribute("MS.Scn",b.scn);
f.setAttribute("FlightInfo",b.flightInfo.join())
}
if(0<a._totalTiles)
{
var j=b.appInfo.length,
h=Math.min(b.pageApps,a._totalTiles-d.length);
if(0===j)
{
om.logWarningMessage("onAppListReceived: Changing totalApps from "+a._totalTiles+" to "+d.length+" since "+h+" apps were expected and 0 apps were received for page "+b.pageIndex);
a._totalTiles=d.length;
if(a._totalTiles<a._totalTilesReported)
e=true
}
else
{
var i=h-j;
if(i>0)
{
om.logWarningMessage("onAppListReceived: Changing totalApps from "+a._totalTiles+" to "+(a._totalTiles-i)+" since "+h+" apps were expected and "+j+" apps were received for page "+b.pageIndex);
a._totalTiles-=i;
if(a._totalTiles<a._totalTilesReported)
e=true
}
}
var k=document.getElementById(a._tileTemplateName);
b.appInfo.forEach(function(c)
{
var e=d.length;
function f(e,b,c)
{
var d=e.querySelectorAll("["+b.replace(".","\\.")+"]")[0];
return a.getElementAttr(d,b,c)
}
WinStore.Utilities.prepareAppInfoData(c,e);
if(!a._showCategoryOnTile)
{
c.Category="";
c.Subcategory=""
}
c.channelFeatured=a._isChannelFeatured?1:0;
c.itemIndex=e;
c.tilePositionBI=e+1;
c.appNS=b.appNS;
c.pageIndex=b.pageIndex;
c.impressionId=b.impressionId;
d.push({key:e.toString(),data:c});
g.push({scn:b.scn,AppNS:b.appNS,K:c.KValue,IG:b.impressionId,"Entity.Id":c.Id,R:a._RValue,Ornt:f(k,"MS.Ornt","P"),S:f(k,"MS.S","M")})
});
if(c)
{
if(c.deferImpressionLogging===false)
{
WinStore.BI.addMetaToHead("MS.pNum",b.pageIndex);
WinStore.BI.logImpressions(document.getElementById("biImpressionElement"),[],g)
}
if(c.biImpressionHistory===undefined)
c.biImpressionHistory=[];
c.biImpressionHistory[b.pageIndex]=g
}
}
else
a._onNoResults(f,c);
if(e&&a._updateFrameTileCount)
{
a._totalTilesReported=Math.min(a._totalTiles,1e3);
WinStore.Utilities.updateFrameCount(a._totalTilesReported,"1 app","%1 apps")
}
},onCollectionTilesReceived:function(a,b,d)
{
var e=false,
f=[],
k=a._parentElement,
c=a._listView;
if(0===b.pageIndex)
{
a._totalTiles=b.collectionTiles.length;
k.setAttribute("MS.IG",b.impressionId);
e=true
}
if(0<a._totalTiles)
{
var i=b.collectionTiles.length,
g=Math.min(b.pageApps,a._totalTiles-d.length);
if(0===i)
{
om.logWarningMessage("onCollectionTilesReceived: Changing total from "+a._totalTiles+" to "+d.length+" since "+g+" tiles were expected and 0 tiles were received for page "+appList.pageIndex);
a._totalTiles=d.length;
if(a._totalTiles<a._totalTilesReported)
e=true
}
else
{
var h=g-i;
if(h>0)
{
om.logWarningMessage("onResults: Changing total from "+a._totalTiles+" to "+(a._totalTiles-h)+" since "+g+" tiles were expected and "+i+" tiles were received for page "+appList.pageIndex);
a._totalTiles-=h;
if(a._totalTiles<a._totalTilesReported)
e=true
}
}
var j=document.getElementById(a._tileTemplateName);
b.collectionTiles.forEach(function(c)
{
var e=d.length;
c.itemIndex=e;
c.tilePositionBI=e+1;
c.pageIndex=b.pageIndex;
c.appNS=b.appNS;
d.push({key:e.toString(),data:c});
function g(e,b,c)
{
var d=e.querySelectorAll("["+b.replace(".","\\.")+"]")[0];
return a.getElementAttr(d,b,c)
}
f.push({scn:b.scn,AppNS:b.appNS,K:c.KValue,IG:b.impressionId,"Entity.Id":c.Id,"Entity.Type":"Collection",R:a._RValue,Ornt:g(j,"MS.Ornt","P"),S:g(j,"MS.S","C")})
});
if(c)
{
if(c.deferImpressionLogging===false)
{
WinStore.BI.addMetaToHead("MS.pNum",b.pageIndex);
WinStore.BI.logImpressions(document.getElementById("biImpressionElement"),[],f)
}
if(c.biImpressionHistory===undefined)
c.biImpressionHistory=[];
c.biImpressionHistory[b.pageIndex]=f
}
}
else
a._onNoResults(k,c);
if(e&&a._updateFrameTileCount)
{
a._totalTilesReported=Math.min(a._totalTiles,1e3);
WinStore.Utilities.updateFrameCount(a._totalTilesReported,"1 collection","%1 collections")
}
},onPageWithListViewReady:function()
{
this._listViewportInitialized=true;
Array.isArray(this._onPageWithListViewReady)&&
this._onPageWithListViewReady.forEach(function(a)
{
a.callback(a.context,this._totalTiles)
})
},onLoadingStateChanged:function()
{
var a=this,
b=a._listView,
c=a._parentElement;
if(b.loadingState==="viewPortLoaded")
{
if(b._onDataLoaded!==undefined&&typeof b._onDataLoaded==="function")
{
a.onPageWithListViewReady();
b._onDataLoaded(false,a._animationElements);
delete b._onDataLoaded
}
}
else
if(b.loadingState==="complete"&&b._doneLogEtw===undefined)
{
b._doneLogEtw=true;
om.etwListInit(false,a._listType,a._listId,a._catId);
var l=c.getAttribute("pageIg"),
j=c.getAttribute("lastIgSent");
if(!j||l!==j)
{
c.setAttribute("lastIgSent",l);
function g(a)
{
return b.elementFromIndex(a)
}
var d=g(b.indexOfFirstVisible),
i=g(b.indexOfLastVisible),
m=document.getElementById("biImpressionElement"),
h=a.getElementAttr(d,"pageIndex",0),
k=a.getElementAttr(c,"MS.AppNS",""),
f={FirstVisibleItemKValue:a.getElementAttr(d,"MS.K","-1"),FirstVisibleItemAppNSValue:a.getElementAttr(d,"AppNS",k),FirstVisibleItemRValue:a._RValue,LastVisibleItemKValue:a.getElementAttr(i,"MS.K","-1"),LastVisibleItemAppNSValue:a.getElementAttr(i,"AppNS",k),LastVisibleItemRValue:a._RValue,FltInfo:c.getAttribute("FlightInfo")},
n=["RequestQueryTerm","RequestQueryForm","RequestQueryFilter","RequestQuerySort"];
n.forEach(function(a)
{
var b=c.getAttribute(a);
if(b)
f[a]=b
});
WinStore.BI.addMetaToHead("MS.pNum",h);
WinStore.BI.firePageViewEvent(f,null,true);
if(b.biImpressionHistory!==undefined)
{
var o=Object.keys(b.biImpressionHistory).sort(function(b,a)
{
return b-a
});
for(var e in o)
{
WinStore.BI.addMetaToHead("MS.pNum",e);
WinStore.BI.logImpressions(m,e==h?f:[],b.biImpressionHistory[e])
}
}
b.deferImpressionLogging=false
}
Array.isArray(a._onTotalAppCountChanged)&&
a._onTotalAppCountChanged.forEach(function(b)
{
b.callback(b.context,a._totalTiles)
})
}
}})});
WinJS.Namespace.define("WinStore.TopicPage",{_listType:{value:null,writable:true},_urlParams:{value:null,writable:true},_onDataLoaded:{value:null,writable:true},_hasTopicContent:{value:false,writable:true},_locale:{value:null,writable:true},_imageArgs:{value:null,writable:true},_topicInfo:{value:null,writable:true},_expandedDescription:{value:false,writable:true},_inAcquisition:{value:false,writable:true},_isAppHighlights:{value:false,writable:true},COLLECTIONS_LIST_TYPE_ID:{value:"10",writable:false},initControls:function(a,d)
{
this._urlParams=a;
this._onDataLoaded=d;
this._hasTopicContent=false;
this._imageArgs=null;
var c=this._initControls;
if(""!==WinStore.Utilities.getUrlParam(a,"cid"))
this._listType=WinStore.List.ListType.dataDriven;
else
{
this._listType=WinStore.List.ListType.topic;
c=this._getImageArgs
}
if(WinStore.Utilities.getUrlParam(a,"appHighlights"))
{
this._isAppHighlights=true;
WinStore.Frame.setPageTitle("Featured")
}
else
this._isAppHighlights=false;
var b=WinStore.Utilities.getUrlParam(a,"loc");
if(""!==b)
{
this._locale=b;
this._listType!==WinStore.List.ListType.dataDriven&&
WinStore.Frame.setPageTitleLang(b)
}
WinStore.Utilities.getNamespace(c,this)
},onPageUnload:function()
{
this._listType!==WinStore.List.ListType.dataDriven&&
WinStore.Frame.setPageTitleLang(null);
WinStore.BI.removeMetaFromHead("MS.Topic.Id");
WinStore.BI.removeMetaFromHead("MS.DList.Id");
WinStore.BI.removeMetaFromHead("MS.Cat.Id");
WinStore.BI.removeMetaFromHead("MS.PageId");
WinStore.BI.removeMetaFromHead("MS.PFSQ.Title");
WinStore.BI.removeMetaFromHead("MS.pNum");
WinStore.Utilities.submitTuningRecs();
window.removeEventListener("resize",this._onResize);
if(this._onDataLoaded)
{
var b=document.getElementById("mainContent");
if(b)
{
var a=b.winControl;
if(a&&a._onDataLoaded!==undefined&&typeof a._onDataLoaded==="function")
{
this._onDataLoaded(true);
this._onDataLoaded=null;
delete a._onDataLoaded
}
}
}
this._topicInfo=null;
this._expandedDescription=false;
this._inAcquisition=false
},animationElements:function()
{
var c=null;
if(this._hasTopicContent)
{
var a=document.getElementById("topicContent");
a.style.opacity=0;
var b=document.getElementById("mainContent");
b.style.opacity=0;
c=[a,b]
}
return c
},_getImageArgs:function(b)
{
var a=b;
om.getImageData().done(function(b)
{
if(b)
{
a._imageArgs=b;
a._initControls(a)
}
else
om.logErrorMessage("WinStore.TopicPage._getImageArgs: Failed to retrieve imageArgs")
})
},noResultsForTopic:function(a)
{
WinStore.Utilities.createNoResultsSection(a,listView,"You might not see any apps if the apps aren’t available in your region, or if you set preferences to only show apps that support your preferred languages or meet accessibility requirements.","noResultsTopic")
},noResultsForDataDriven:function(b,a)
{
WinStore.Utilities.createNoResultsSection(b,a,"You might not see any apps if the apps aren’t available in your region, or if you set preferences to only show apps that support your preferred languages or meet accessibility requirements.","noResultsRecListOrQuery")
},_initControls:function(a)
{
var c=WinStore.Utilities.getUrlParam(a._urlParams,"id"),
f="mediumAppTileTemplate",
d=document.getElementById("mainContent"),
g=WinStore.TopicPage.noResultsForTopic,
h=WinStore.Utilities.getUrlParam(a._urlParams,"formcode");
h&&
d.setAttribute("RequestQueryForm",h);
if(WinStore.List.ListType.topic!==a._listType)
{
a._hideTopicInfo();
a._initPageTitle(c)
}
if(a._listType===WinStore.List.ListType.dataDriven)
{
g=WinStore.TopicPage.noResultsForDataDriven;
if(c===WinStore.Controls.Hub.PICKS_FOR_YOU_LIST_TYPE_ID)
f="picksForYouAppTileTemplate";
else
if(c===WinStore.TopicPage.COLLECTIONS_LIST_TYPE_ID)
{
f="collectionTileTemplate";
WinJS.Utilities.addClass(d,"collectionList")
}
}
var b=new WinStore.List.StoreListOptions(d,a._listType,f,g);
b.queryString=a._urlParams;
b.onDataLoaded=a._onDataLoaded;
b.showCategoryOnTile=true;
if(WinStore.List.ListType.dataDriven===a._listType)
{
b.saveScrollPosition=true;
d.setAttribute("MS.R",WinStore.Controls.Hub.ListTypeNameMap[c]);
WinStore.BI.addMetaToHead("MS.DList.Id",c);
var e=WinStore.Utilities.getUrlParam(a._urlParams,"cid");
if(e!="0")
{
WinStore.BI.addMetaToHead("MS.Cat.Id",e);
b.showCategoryOnTile=false
}
function j(a)
{
om.etwListInitInteractive(a,e);
om.etwEvent(false,"WinStore.NavigateToDataGeneratedList (catId "+e+")")
}
b.RValue=WinStore.Controls.Hub.ListTypeNameMap[c];
b.onPageWithListViewReady=[{callback:j,context:a._listType}];
function o(e,b)
{
for(var d=b.appInfo.length,
a=0;a<d;++a)
{
var c=b.appInfo[a];
if(c&&WinStore.Utilities.appHasBeenTunedOut(c.Id))
{
b.appInfo.splice(a,1);
--a
}
}
}
if(c==WinStore.Controls.Hub.PICKS_FOR_YOU_LIST_TYPE_ID)
b.onQueryResult=[{callback:o,context:a}];
if(c===WinStore.TopicPage.COLLECTIONS_LIST_TYPE_ID)
{
b.renderAsCollectionTiles=true;
function k(a)
{
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.collectionTile,{AppNS:a.dataObject.appNS},a.tile);
om.showTopicPage("?id="+a.appId+"&formcode="+WinStore.BI.biFormCodes.CollectionsToTopic)
}
b.onTileClicked=k
}
else
{
function l(a)
{
var b=WinStore.BI.biFormCodes.DGList;
if(c===WinStore.Controls.Hub.PICKS_FOR_YOU_LIST_TYPE_ID)
b=WinStore.BI.biFormCodes.PicksForYou;
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.appTile,null,a.tile);
WinStore.Utilities.displayPDP(a.appId,{srcElement:a.parent,formCode:b,origIg:a.dataObject.impressionId})
}
b.onTileClicked=l
}
}
else
{
d.setAttribute("MS.R",a._listType);
WinStore.BI.addMetaToHead("MS.Topic.Id",c);
if(""!==WinStore.Utilities.getUrlParam(a._urlParams,"branding"))
{
WinStore.BI.addMetaToHead("MS.Cat.Id",WinStore.BI["BrandingCategoryId"]);
b._isChannelFeatured=true
}
function p(b,a)
{
WinStore.TopicPage.updateTopic(a)
}
b.onQueryResult=[{callback:p,context:a}];
function m(b)
{
var a=d.firstElementChild;
d.style.width=a.style.width=a.scrollWidth+"px";
window.addEventListener("resize",WinStore.TopicPage._onResize);
a.addEventListener("focus",WinStore.TopicPage._onListItemFocus,true);
document.getElementById("topicContent").addEventListener("focus",WinStore.TopicPage._onTopicContentFocus,true);
om.etwListInitInteractive(b,"0")
}
b.onPageWithListViewReady=[{callback:m,context:a._listType}];
function n(b)
{
if(!a._inAcquisition)
{
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.appTile,null,b.tile);
WinStore.Utilities.displayPDP(b.appId,{srcElement:b.parent,formCode:WinStore.BI.biFormCodes.TopicPage,origIg:b.dataObject.impressionId})
}
}
b.onTileClicked=n;
b.animationElements=WinStore.TopicPage.animationElements
}
var i=WinStore.BI.getPageId();
i&&
WinStore.BI.addMetaToHead("MS.PageId",i);
var q=new WinStore.List.StoreList(b)
},_onResize:function()
{
var b=document.getElementById("mainContent"),
a=b.firstElementChild;
a.style.width=b.style.width="";
b.style.width=a.style.width=a.scrollWidth+"px"
},_onListItemFocus:function(d)
{
if(WinJS.Utilities.hasClass(d.srcElement,"appTile"))
{
var c=document.getElementById("topicFrame"),
b=d.srcElement.getBoundingClientRect(),
a=b.left;
if(a<0)
a-=10;
else
{
a=b.right-c.clientWidth;
if(a>0)
{
a+=10;
if(a>b.left)
a=b.left
}
else
a=0
}
c.scrollLeft+=a
}
},_onTopicContentFocus:function(a)
{
if(a.srcElement.id!=="topicLeftPaneScrolling")
document.getElementById("topicFrame").scrollLeft=0
},_initPageTitle:function(e)
{
var a=null;
if(WinStore.List.ListType.dataDriven===this._listType)
if(e.length>0)
{
var c=parseInt(e);
if(isNaN(c))
om.logErrorMessage("TopicPage::_initPageTitle: '"+c+"' recommendation list ID is not a valid number");
else
{
var b=WinStore.Utilities.nameFromId(om.namespace.recLists,c);
if(!b&&e===WinStore.TopicPage.COLLECTIONS_LIST_TYPE_ID)
b="Collections";
if(!b)
{
om.logErrorMessage("TopicPage::_initPageTitle: '"+c+"' recommendation list ID is not found in the Namespace response");
b=""
}
var d=WinStore.Utilities.getUrlParam(this._urlParams,"cid");
if(d.length>0)
if("0"===d)
a=b;
else
if("1"===d)
switch(c)
{
case 3:
a="Top paid apps";
break;
case 4:
a="Top free apps";
break;
case 5:
a="New & rising apps";
break;
case 11:
a="Top grossing apps";
break;
case 12:
a="Best rated apps";
break;
default:
om.logWarningMessage("TopicPage: unexpected listTypeId "+c+" for recList apps page, creating concatenated string which may be incorrect for locale");
a="%1 apps".replace("%1",b)
}
else
{
var f=WinStore.Category.getCategoryName(d);
if(f)
a="%1 in %2".replace("%1",b).replace("%2",f);
else
om.logErrorMessage("TopicPage::_initPageTitle: Could not get category name for id='"+d+"' from namespace")
}
else
om.logErrorMessage("TopicPage::_initPageTitle: URL is missing required parameter 'cid'")
}
}
else
om.logErrorMessage("TopicPage::_initPageTitle: URL is missing required parameter 'id'");
a&&
WinStore.Frame.setPageTitle(a,true)
},updateTopic:function(a)
{
if(a)
{
this._topicInfo=a;
var r=a.Title;
if(r!==null)
{
!this._isAppHighlights&&
WinStore.Frame.setPageTitle(r,true);
var b=WinStore.TopicPage,
c=true,
n=a.Description;
if(n!=="")
{
c=false;
var e=document.getElementById("topicDescription");
if(e)
{
e.innerText=n;
e.style.display="block";
b._locale&&
e.setAttribute("lang",b._locale)
}
var q=a.ImageUrl;
if(q!=="")
{
var k=document.getElementById("topicImage");
if(k)
if(b._imageArgs.imageUrlRoot!==null)
{
var o=["/1x/","/1.4x/","/1.8x/"],
j=0,
d=b._imageArgs.imageUrlRoot;
if(d)
{
var h=/[\/][\d\.]+x[\/]$/.exec(d);
if(h&&h.length>0)
{
j=o.indexOf(h[0]);
if(j>=0)
{
var g=0;
if(matchMedia("(min-height: 1080px) and (max-height: 1439px)").matches)
g=1;
else
if(matchMedia("(min-height: 1440px)").matches)
g=2;
if(g>j)
d=d.replace(h[0],o[g])
}
}
}
k.src=WinStore.Utilities.getImageUrl(d,q,b._imageArgs.maxHosts);
k.style.display="block"
}
else
om.logErrorMessage("TopicPage::updateTopic: om.getImageUrlRoot failed to return a URL")
}
}
var p=a.Author;
if(p!=="")
{
c=false;
var f=document.getElementById("topicAuthor");
if(f)
{
f.innerText=p;
f.style.display="block";
b._locale&&
f.setAttribute("lang",b._locale)
}
}
a.appInfo=a.appInfo.filter(function(a)
{
return a.Applicable
});
var l=a.InstallAll&&a.appInfo.length;
if(l)
c=false;
if(!c)
{
WinStore.Utilities.showElement("topicInstallArea",l);
if(l)
{
WinStore.Utilities.showElement("topicDownloadWarning",a.networkCost);
if(this.anyAppUsesCapability(a.appInfo,["location","bfa794e4-f964-4fdb-90f6-51056bfe4b44"]))
document.getElementById("topicTermsOfUse2").innerText="View each app for age and game ratings, additional terms, privacy policies, and permissions the apps have to use features of your PC that might affect your privacy. One or more apps in this collection have permission to use your location.";
var i=document.getElementById("topicTermsOfUseLink");
if(i)
{
i.tabIndex=0;
i.onclick=function()
{
om.showSettingsPage("termsofuse")
};
i.onkeydown=function()
{
if(event.keyCode==13)
return false
}
}
WinStore.TopicPage._setLegalMessages(a.appInfo);
var s=this.highestGameRating(a.appInfo);
WinStore.Utilities.showRatingSystem(s,"topic")
}
var m=document.getElementById("topicLeftPaneScrolling");
if(m)
m.style.height=document.documentElement.clientHeight-m.offsetTop-80+"px";
this.setReadMore()
}
if(c)
b._hideTopicInfo();
else
b._hasTopicContent=true
}
else
om.logErrorMessage("TopicPage::updateTopic: topicInfo.Title is null")
}
else
om.logErrorMessage("TopicPage::updateTopic: topicInfo is null")
},_setLegalMessages:function(b)
{
if(Array.isArray(b)&&om.namespace&&om.namespace.legalCodes&&Array.isArray(om.namespace.legalCodes))
{
var a=document.getElementById("topicLegalMessages");
if(a)
{
while(a.hasChildNodes())
a.removeChild(a.firstChild);
var c=new Set;
b.forEach(function(a)
{
a&&a.LegalCodes&&Array.isArray(a.LegalCodes)&&
a.LegalCodes.forEach(function(a)
{
c.add(a)
})
});
c.forEach(function(d)
{
for(var b=null,
c=0;c<om.namespace.legalCodes.length;c++)
if(Number(d)===Number(om.namespace.legalCodes[c].id))
{
b=om.namespace.legalCodes[c].name;
break
}
if(b)
{
om.logInfoMessage("Topic: _setLegalMessages adding legal message "+d+" = '"+(b.length>40?b.substring(0,40)+"...":b)+"'");
var e=document.createElement("div");
e.innerText=b;
a.appendChild(e)
}
else
om.logWarningMessage("Topic: _setLegalMessages could not find corresponding legal message for ID = "+d)
});
WinStore.Utilities.showElement(a,a.hasChildNodes())
}
}
},_hideTopicInfo:function()
{
var a=document.getElementById("topicContent");
if(a)
a.className="topicContentEmpty";
var b=document.getElementById("mainContent");
b&&
WinJS.Utilities.addClass(b,"noTopicContent")
},impressionGuid:{value:null,writable:true},onTuningClick:function(c)
{
var a=c.currentTarget;
if(a)
{
if(!WinStore.TopicPage.impressionGuid)
{
var b=document.getElementById("mainContent");
if(b)
WinStore.TopicPage.impressionGuid=b.getAttribute("MS.IG")
}
WinStore.Utilities.onTuningClick(a,WinStore.TopicPage.impressionGuid)
}
},enableElement:function(a,c)
{
var b=a;
if(typeof a==="string")
b=document.getElementById(a);
if(b)
b.disabled=!c
},highestGameRating:function(d)
{
var b=null;
if(Array.isArray(d))
{
var a=null;
if(om.namespace)
{
a=om.namespace.parentalControlsPreferredSystemId;
if(!a||!om.namespace.parentalControlsSystemRequired)
{
var h=om.namespace.parentalControlsSystemId;
if(h)
a=h
}
}
if(a)
for(var f=0;f<d.length;++f)
{
var c=d[f].GameRatings;
if(c&&c.length>0)
for(var g=0;g<c.length;g++)
{
var e=c[g];
if(e.systemId===a)
{
if(!b||e.ratingLevel>b.ratingLevel)
b=e;
break
}
}
}
}
return b
},anyAppUsesCapability:function(a,c)
{
if(Array.isArray(a))
for(var b=0;b<a.length;++b)
if(this.appUsesCapability(a[b],c))
return true;
return false
},appUsesCapability:function(d,c)
{
var a=d.DeviceCapabilities;
if(Array.isArray(a)&&Array.isArray(c))
for(var b=0;b<a.length;++b)
{
var e=a[b].label.toLowerCase().replace("{","").replace("}","");
if(c.indexOf(e)!==-1)
return true
}
return false
},setReadMore:function()
{
var b=document.getElementById("topicImage"),
f=b&&b.src&&b.src!=="",
c=false,
a=document.getElementById("topicDescription");
if(a)
if(this._expandedDescription)
{
a.style.height="";
a.innerText=this._topicInfo.Description;
c=true
}
else
{
var h=document.getElementById("topicLeftPaneScrolling"),
d=h.scrollHeight-h.clientHeight;
if(d>0)
{
var e=20,
g=a.clientHeight-e*3;
if(g<d)
if(f)
{
f=false;
d-=b.clientHeight;
c=true
}
if(d>0&&g>0)
{
var j=a.clientHeight-d;
a.style.height=Math.max(Math.floor(j/e),3)*e+"px";
WinStore.Utilities.truncateElement(a);
c=true
}
}
}
WinStore.Utilities.showElement(b,f);
WinStore.Utilities.showElement("topicReadMore",c);
if(c)
{
var i=document.getElementById("topicReadMoreLink");
if(i)
i.innerText=this._expandedDescription?"Show less":"Show more"
}
},onReadMoreClick:function()
{
this._expandedDescription=!this._expandedDescription;
this.setReadMore();
this._expandedDescription&&
WinStore.Utilities.setActive(document.getElementById("topicLeftPaneScrolling"))
},onPurchaseProgress:function(a)
{
if(!WinStore.Frame.isOnPage("topicFrame")||!WinStore.TopicPage._inAcquisition)
return;
if(!a||a.ps===null||a.code===null)
{
om.logErrorMessage("Topic: onPurchaseProgress called with invalid arguments");
return
}
om.logInfoMessage("Topic: onPurchaseProgress args = "+a.ps+" ("+WinStore.Utilities.enumToString(PDPPurchaseProgress,a.ps)+") - 0x"+a.code.toString(16));
switch(a.ps)
{
case PDPPurchaseProgress.PS_PURCHASE_COMPLETE:
WinStore.TopicPage.showAcquisitionUI(false);
WinStore.Utilities.showElement("topicInstallArea",false);
this.setReadMore();
break;
case PDPPurchaseProgress.PS_ERROR:
var b=a.code&65535;
WinStore.TopicPage.showAcquisitionUI(false);
b!=ErrorCodes.ERROR_CANCELLED&&
WinStore.TopicPage.onPurchaseErrors(a)
}
},onPurchaseErrors:function(d)
{
var e=d.failedApps!==undefined,
f=e?"Some apps couldn’t be installed":"Apps couldn’t be installed",
b=null,
c=null,
a={close:0,retry:1,pref:2};
om.logInfoMessage("Topic: onPurchaseErrors args.code = 0x"+d.code.toString(16)+" ("+WinStore.Utilities.enumToString(ErrorCodes,d.code)+")");
switch(d.code)
{
case ErrorCodes.E_ALLOWED_MACHINE_LIMIT_REACHED:
f="You’ve reached the PC limit for your account";
b="You need to remove a PC from your Windows Store account before you can install apps on this PC.";
c=[{id:a.pref,text:"Choose a PC to remove"},{id:a.close,text:"Cancel"}];
break;
case ErrorCodes.ERROR_ACCESS_DENIED:
default:
b="Sorry, these apps couldn’t be installed right now. Please try again.";
if(e)
{
c=[{id:a.close,text:"Close"}];
b+=WinStore.TopicPage.getFailedAppsAsBullettedList(d.failedApps)
}
else
c=[{id:a.retry,text:"Try again"},{id:a.close,text:"Cancel"}];
break;
case ErrorCodes.ERROR_WINHTTP_TIMEOUT_HR:
case ErrorCodes.ERROR_WINHTTP_TIMEOUT:
case ErrorCodes.ERROR_TIMEOUT:
b="Sorry, these apps couldn’t be installed because the connection to the Store was lost. Please try again.";
c=[{id:a.retry,text:"Try again"},{id:a.close,text:"Cancel"}];
break;
case ErrorCodes.COMMERCE_E_AGE_GATED:
b="Sorry, you’re not old enough to install these apps based on the age rating.";
c=[{id:a.close,text:"Close"}];
if(e)
b+=WinStore.TopicPage.getFailedAppsAsBullettedList(d.failedApps)
}
if(b)
{
om.showMessageDialog(b,f,c,c.length-1,function(b)
{
switch(b)
{
case a.retry:
WinStore.TopicPage.onInstallButton();
break;
case a.pref:
om.showSettingsPage("preferences")
}
});
if(e&&!WinStore.TopicPage._inAcquisition)
{
WinStore.Utilities.showElement("topicInstallArea",false);
this.setReadMore()
}
}
},getFailedAppsAsBullettedList:function(b)
{
var c="",
a=b.length;
if(a>8)
a=7;
for(var d=0;d<a;d++)
c+="\n• "+b[d];
if(a<b.length)
c+="\n…";
return c
},showAcquisitionUI:function(a)
{
this._inAcquisition=a;
var d=true;
if(this._onDataLoaded)
{
var c=document.getElementById("mainContent");
if(c)
{
var b=c.winControl;
if(b&&b._onDataLoaded!==undefined&&typeof b._onDataLoaded==="function")
d=false
}
}
d&&
WinStore.Frame.enableBackButton(!a,true);
WinStore.Frame.showPurchaseProgress(a);
this.enableElement("topicInstallButton",!a);
this.enableElement("topicTermsOfUseLink",!a);
WinStore.Frame.toggleNavigationUI(a)
},onInstallButton:function()
{
this.showAcquisitionUI(true);
var a=[];
this._topicInfo.appInfo.forEach(function(b)
{
b.FreeApp&&!WinStore.Utilities.isAppInstalled(b.PackageFamilyName)&&
a.push(b.Id)
});
if(a.length)
{
WinStore.BI.logCustomBI("AppInstallAll");
om.installApps(a,this._topicInfo.Id,false)
}
else
this.showAcquisitionUI(false)
}});
var PT={paid:0,trial:1,free:2},
FACILITY_WINDOWS_STORE=63,
ErrorCodes={NOERROR:0,E_ALLOWED_MACHINE_LIMIT_REACHED:3225366544,E_WS_SECOND_TRIAL_DENIED:3225366546,COMMERCE_E_PRICE_MISMATCH:3225371214,COMMERCE_E_INVALID_PI_TYPE:3225370734,COMMERCE_E_INVALID_PI_STATUS:3225370924,COMMERCE_E_INVALID_PI_DETAILS:3225370934,COMMERCE_E_EXPIRED_PI:3225370944,COMMERCE_E_NO_CTP_ACCOUNT:3225371024,COMMERCE_E_NO_DEFAULT_PI:3225370964,COMMERCE_E_INVALID_ACCOUNT_STATE:3225371224,WU_E_NO_UPDATE:2149842980,WU_E_UNEXPECTED:2149847039,WU_E_INSTALL_NOT_ALLOWED:2149842966,WU_E_DM_DOWNLOADLIMITEDBYUPDATESIZE:2149867532,WU_E_NOT_APPLICABLE:2149842967,BG_E_BLOCKED_BY_COST_TRANSFER_POLICY:2149580889,ERROR_INSTALL_OUT_OF_DISK_SPACE:2147958004,ERROR_DISK_FULL:2147942512,ERROR_TIMEOUT:2147943860,ERROR_PACKAGES_IN_USE:2147958018,HR_DISK_FULL:3355445008,ERROR_ACCESS_DENIED:5,ERROR_IO_PENDING:997,ERROR_WINHTTP_TIMEOUT:12002,ERROR_WINHTTP_TIMEOUT_HR:2147954402,ERROR_CANCELLED:1223,COMMERCE_E_APP_NOT_AVAILABLE:3225371365,COMMERCE_E_AGE_GATED:3225371366,COMMERCE_E_FREE_ONLY:3225371367,COMMERCE_E_INVALID_TOKEN:3225371215,COMMERCE_E_ALREADY_PURCHASED:3225371334,COMMERCE_E_NO_LICENSE:3225371454,COMMERCE_INAPP_TOKEN_REDEEMED:3225370625,COMMERCE_E_ASYNC_PAYMENT_REDIRECT:3225371355,COMMERCE_E_IN_PROGRESS_ASYNC_PURCHASE:3225371356,COMMERCE_E_ASYNC_PURCHASE_CANCELED:3225371357,COMMERCE_E_INSUFFICIENT_BALANCE:3225371069,COMMERCE_E_STORED_VALUE_EXCEEDED_CHARGE_LIMIT:3225371071,WININET_E_CANNOT_CONNECT:2147954429,WININET_E_NAME_NOT_RESOLVED:2147954407,ERROR_NETWORK_UNREACHABLE:2147943631,HTTP_E_STATUS_BAD_REQUEST:2149122448,WININET_E_CONNECTION_ABORTED:2147954430},
PackageState={PACKAGESTATE_TAMPERED:3},
RemediationCodes={WS_REMEDIATION_UNKNOWN:0,WS_REMEDIATION_UNSIGNED:1,WS_REMEDIATION_DEV_LICENSE_EXPIRED:2,WS_REMEDIATION_LOB_REINSTALL:3,WS_REMEDIATION_LOB_LICENSE:4,WS_REMEDIATION_INBOX:5,WS_REMEDIATION_APPSTORE_PURCHASE_FULL:6,WS_REMEDIATION_APPSTORE_SYNC_LICENSE_INCR:7,WS_REMEDIATION_APPSTORE_SYNC_LICENSE_FULL:8,WS_REMEDIATION_APPSTORE_BANNED:9,WS_REMEDIATION_APPSTORE_REINSTALL:10,WS_REMEDIATION_DEV_APP_UNSIGNED:11},
PDPAppState={Unknown:0,AcquirablePaid:1,AcquirableFree:2,AcquirableTrialAvailable:3,AcquirableTrialInstalled:4,AcquirableTrialExpired:5,AcquirableTrialAcquiredAppUninstalled:6,OwnedUninstalled:7,OwnedInstalled:8,StartingInstall:9,Desktop:11},
PDPPurchaseProgress={PS_NOT_STARTED:0,PS_IN_CREATE_TRANSACTION:1,PS_IN_CONFIRM_PURCHASE:2,PS_IN_ACQUIRE_LICENSE:3,PS_PURCHASE_COMPLETE:4,PS_ERROR:5,PS_IN_DOWNLOAD_IMAGES:7,PS_IN_GET_PACKAGEDATA:8,PS_IN_RESUME_PURCHASE:9,PS_SETUP_PAYMENT:10},
PDPDataSource={ExtendedMetadata:1,LicenseInstall:2,SimilarApps:3,DeveloperApps:4,UserReview:5,Ratings:6,ReviewList:7},
PDPAcquisitionState={PreAcquisition:0,PostAcquisition:1},
HWAction={invalid:0,none:1,warn:2,block:3};
WinJS.Namespace.define("WinStore.PDP",{_debugVerbose:{value:false,writable:false},_extendedMetadata:{value:null,writable:true},_licenseInstallData:{value:null,writable:true},_similarAppsData:{value:null,writable:true},_developerAppsData:{value:null,writable:true},_categoryAppsData:{value:null,writable:true},_categoryAppsDataReturned:{value:false,writable:true},_userReviewData:{value:null,writable:true},_ratingData:{value:null,writable:true},_reviewData:{value:null,writable:true},_pendingData:{value:[],writable:true},_waitingForAllData:{value:null,writable:true},_pendingSecondStageRefresh:{value:false,writable:true},_onDataLoaded:{value:null,writable:true},_urlParams:{value:null,writable:true},_defaultTabName:{value:null,writable:true},_disableAcquire:{value:null,writable:true},_inAcquisition:{value:null,writable:true},_blockNavigate:{value:null,writable:true},_navigating:{value:null,writable:true},_acquiringTrial:{value:null,writable:true},_parentalControlsOK:{value:true,writable:true},_promoEndDate:{value:null,writable:true},_promoTimerId:{value:null,writable:true},_fullScreenFlipper:{value:null,writable:true},_fullScreenFlyout:{value:null,writable:true},_inRemediation:{value:null,writable:true},_remediationData:{remediationState:RemediationCodes.WS_REMEDIATION_UNKNOWN,appxState:0,packageFullName:null},_isToken:{value:null,writable:true},_tokenData:{tokenId:null,appGuid:null,inAppOfferToken:null,inAppTitle:null,loadedInAppData:false},_inAppData:{value:null,writable:true},_biData:{value:[],writable:true},_waitingForEtwStop:{value:false,writable:true},_waitingForEtwAllData:{value:false,writable:true},_parameters:{_pid:{value:null,writable:true},_formCode:{value:null,writable:true},_formCodeIG:{value:null,writable:true},_deeplink:{value:null,writable:true},_resumePurchase:{value:null,writable:true},_mode:{value:null,writable:true}},_isResumeAsyncPurchase:{value:null,writable:true},_purchaseTransactionId:{value:null,writable:true},_isPIAttach:false,_piAttachData:{accountId:null,piid:null},onLoad:function(a,r)
{
om.logInfoMessage("PDP: ---- onLoad params = '"+a+"' ----");
var o=WinStore.BI.getPageId();
o&&
WinStore.BI.addMetaToHead("MS.PageId",o);
var f=WinStore.Utilities.getUrlParam(a,"ig");
if(!f)
f=WinStore.Utilities.generateGuid();
WinStore.BI.addMetaToHead("MS.PageIg",f);
WinStore.PDP.reset();
WinStore.PDP._urlParams=a;
WinStore.PDP._onDataLoaded=r;
WinStore.Frame.onPdpVisible(true);
WinStore.Utilities.getNamespace();
WinStore.PDP._parameters._pid=WinStore.Utilities.getUrlParam(a,"pid");
WinStore.PDP._parameters._deeplink=WinStore.Utilities.getUrlParam(a,"dpl");
WinStore.PDP._parameters._mode=WinStore.Utilities.getUrlParam(a,"mode");
WinStore.PDP._parameters._resumePurchase=WinStore.Utilities.getUrlParam(a,"resumePurchaseFlag");
WinStore.PDP._parameters._formCode=WinStore.Utilities.getUrlParam(a,"formCode");
WinStore.PDP._parameters._formCodeIG=WinStore.Utilities.getUrlParam(a,"formCodeIG");
WinStore.PDP._biData={"App.Id":0,"App.ReleaseGUID":0,"App.Ver":0,"App.PurchaseStatus":0,flightInfo:WinStore.Utilities.getUrlParam(a,"flt").split(",")};
var l=document.getElementById("pdpFrame"),
b=document.createElement("div");
b.setAttribute("MS.Entity.Id",WinStore.PDP._parameters._pid);
b.setAttribute("MS.K","1");
b.setAttribute("MS.AppNS","PDPApp");
b.setAttribute("MS.Scn","PDPApp");
l.insertBefore(b,l.firstChild);
if(WinStore.PDP._parameters._deeplink&&WinStore.PDP._parameters._deeplink==="1")
WinStore.PDP._biData[WinStore.BI.biFieldNames.DeepLink]=1;
if(WinStore.PDP._parameters._formCode)
WinStore.PDP._biData["FormCode"]=WinStore.PDP._parameters._formCode;
if(WinStore.PDP._parameters._formCodeIG)
WinStore.PDP._biData["FormCodeIG"]=WinStore.PDP._parameters._formCodeIG;
WinStore.PDP._inRemediation=false;
if(WinStore.PDP._parameters._mode==="remediation")
{
var h=WinStore.Utilities.getUrlParam(a,"PN"),
g=WinStore.Utilities.getUrlParam(a,"remediationState"),
k=WinStore.Utilities.getUrlParam(a,"appxState");
if(h!==""&&g!==""&&k!=="")
{
WinStore.PDP._remediationData.appxState=k;
WinStore.PDP._remediationData.packageFullName=h;
WinStore.PDP._remediationData.remediationState=parseInt(g);
WinStore.PDP._inRemediation=true
}
om.updateTravelLogCurrentPageParams("?pid="+WinStore.PDP._parameters._pid+"&formCode="+WinStore.PDP._parameters._formCode+"&formCodeIG="+WinStore.PDP._parameters._formCodeIG)
}
WinStore.PDP._isToken=false;
if(WinStore.PDP._parameters._mode=="token")
{
var n=WinStore.Utilities.getUrlParam(a,"tokenid"),
m=WinStore.Utilities.getUrlParam(a,"pid"),
q=WinStore.Utilities.getUrlParam(a,"inappoffer");
if(n!=""&&m!="")
{
WinStore.PDP._tokenData.tokenId=n;
WinStore.PDP._tokenData.appGuid=m;
WinStore.PDP._tokenData.inAppOfferToken=q;
WinStore.PDP._tokenData.inAppTitle="";
WinStore.PDP._tokenData.loadedInAppData=false;
WinStore.PDP._isToken=true
}
}
WinStore.PDP._isPIAttach=false;
if(WinStore.PDP._parameters._mode=="piattach")
{
var j=WinStore.Utilities.getUrlParam(WinStore.PDP._urlParams,"accountid"),
p=WinStore.Utilities.getUrlParam(WinStore.PDP._urlParams,"piid");
WinStore.PDP._piAttachData.accountId=j;
WinStore.PDP._piAttachData.piid=p;
WinStore.PDP._isPIAttach=true;
om.logInfoMessage("PIAttach: PDP.onLoad loaded with piattach data: accountId: "+j+" piid: "+p)
}
WinStore.PDP._isResumeAsyncPurchase=false;
if(WinStore.PDP._parameters._mode=="resumeasyncpurchase")
{
var i=WinStore.Utilities.getUrlParam(a,"tid");
if(i!="")
{
WinStore.PDP._isResumeAsyncPurchase=true;
WinStore.PDP._purchaseTransactionId=i
}
}
var c=WinStore.PDP.getPDPElementById("pdpTaxonomy","onLoad");
if(c)
for(var d=0;d<c.childNodes.length;d++)
{
var e=c.childNodes[d];
if(e.nodeType===Node.TEXT_NODE&&!e.innerText)
{
c.removeChild(e);
d--
}
}
WinStore.PDP._defaultTabName=WinStore.Utilities.getUrlParam(WinStore.PDP._urlParams,"anchor");
if(WinStore.PDP._defaultTabName)
{
WinStore.PDP._urlParams.replace("anchor="+WinStore.PDP._defaultTabName,"");
om.updateTravelLogCurrentPageParams(WinStore.PDP._urlParams);
WinStore.PDP._defaultTabName=WinStore.PDP._defaultTabName.toLowerCase()
}
msWriteProfilerMark("WinStore.PDP.loadPDP,StartTM");
!WinStore.PDP.getSavedScrollPosition()&&
om.etwPDPOpenStart(WinStore.PDP._parameters._pid);
om.etwEvent(true,"WinStore.PDP:retrieveAllPDPData");
WinStore.PDP._waitingForEtwStop=true;
WinStore.PDP._waitingForEtwAllData=true;
WinStore.PDP.refresh()
},stopPromoTimer:function()
{
if(WinStore.PDP._promoTimerId)
{
window.clearTimeout(WinStore.PDP._promoTimerId);
WinStore.PDP._promoTimerId=null
}
},onUnload:function()
{
try
{
if(WinStore.PDP._onDataLoaded)
{
WinStore.PDP._onDataLoaded(true);
WinStore.PDP._onDataLoaded=null
}
WinStore.PDP.stopPromoTimer();
WinStore.PDP.hideFullScreenScreenshots();
WinStore.Frame.onPdpVisible(false);
WinStore.PDP._reviewJustPosted=false;
WinStore.PDP._ratingJustPosted=false;
WinStore.PDP._appProblemJustReported=false;
WinStore.BI.removeMetaFromHead("MS.PageId");
WinStore.BI.removeMetaFromHead("MS.PageIg");
WinStore.PDP._defaultTabName=null;
WinStore.PDP._disableAcquire=null;
WinStore.PDP._blockNavigate=false;
WinStore.Frame.toggleNavigationUI(false)
}
catch(a)
{
om.logErrorMessage("PDP: onPDPUnload exception "+a.name+": "+a.message)
}
},setDefaultTab:function(a)
{
if(a&&typeof a==="string")
WinStore.PDP._defaultTabName=a.toLowerCase();
else
WinStore.PDP._defaultTabName=a
},disableAcquisition:function()
{
WinStore.PDP._disableAcquire=true
},reset:function()
{
om.logVerboseMessage("PDP: reset restoring all members to default values");
WinStore.PDP._extendedMetadata=null;
WinStore.PDP._licenseInstallData=null;
WinStore.PDP._similarAppsData=null;
WinStore.PDP._categoryAppsData=null;
WinStore.PDP._categoryAppsDataReturned=false;
WinStore.PDP._developerAppsData=null;
WinStore.PDP._userReviewData=null;
WinStore.PDP._waitingForAllData=null;
WinStore.PDP._pendingSecondStageRefresh=false;
WinStore.PDP._onDataLoaded=null;
WinStore.PDP._urlParams=null;
WinStore.PDP._appState=null;
WinStore.PDP._inAcquisition=false;
WinStore.PDP._blockNavigate=false;
WinStore.PDP._navigating=false;
WinStore.PDP._acquiringTrial=false;
WinStore.PDP._parentalControlsOK=true;
WinStore.PDP._winJSHub=null;
WinStore.PDP._parameters._pid=null;
WinStore.PDP._parameters._deeplink=false;
WinStore.PDP._parameters._mode=null;
WinStore.PDP._parameters._resumePurchase=false;
WinStore.PDP._inRemediation=false;
WinStore.PDP._remediationData.appxState=null;
WinStore.PDP._remediationData.packageFullName=null;
WinStore.PDP._remediationData.remediationState=null;
WinStore.PDP._isToken=false;
WinStore.PDP._isPIAttach=false;
WinStore.PDP._tokenData.tokenId=null;
WinStore.PDP._tokenData.appGuid=null;
WinStore.PDP._tokenData.inAppOfferToken=null;
WinStore.PDP._tokenData.inAppTitle=null;
WinStore.PDP._tokenData.loadedInAppData=false;
WinStore.PDP._inAppData=null;
WinStore.PDP._isResumeAsyncPurchase=false;
WinStore.PDP._purchaseTransactionId=null;
WinStore.PDP._lastKnownUserCID="";
WinStore.PDP._pendingData=[];
WinStore.PDP._showingExpandedDescriptions=false;
WinStore.PDP._fullScreenFlipper=null;
WinStore.PDP._fullScreenFlyout=null;
for(var a=0;a<pdpHubSections.length;a++)
if(pdpHubSections[a].reset)
{
pdpHubSections[a].reset();
pdpHubSections[a].displayed=false
}
},refresh:function(a)
{
om.logInfoMessage("PDP: refresh for app ID = "+WinStore.PDP._parameters._pid+(a&&typeof a==="string"?" release ID = '"+a+"'":""));
WinStore.PDP._waitingForAllData=true;
WinStore.PDP._pendingSecondStageRefresh=true;
WinStore.PDP._pendingData=[PDPDataSource.ExtendedMetadata,PDPDataSource.LicenseInstall,PDPDataSource.SimilarApps,PDPDataSource.DeveloperApps,PDPDataSource.UserReview,PDPDataSource.Ratings,PDPDataSource.ReviewList];
msWriteProfilerMark("WinStore.PDP.getAppInfo,StartTM");
if(a&&typeof a==="string")
om.getAppInfoByRelease(WinStore.PDP._parameters._pid,a).done(WinStore.PDP.onExtendedMetadata);
else
om.getAppInfo(WinStore.PDP._parameters._pid).done(WinStore.PDP.onExtendedMetadata)
},refreshPostDisplay:function()
{
if(WinStore.PDP._pendingSecondStageRefresh)
{
WinStore.PDP._pendingSecondStageRefresh=false;
if(WinStore.Frame.isPdpActive()&&WinStore.PDP._extendedMetadata)
{
om.logInfoMessage("PDP: refreshPostDisplay retrieving additional data");
msWriteProfilerMark("WinStore.PDP.getRatings,StartTM");
om.getRatings(WinStore.PDP._parameters._pid,WinStore.PDP._extendedMetadata.ReleaseId).done(WinStore.PDP.onRatingData);
msWriteProfilerMark("WinStore.PDP.getSimilarApps,StartTM");
om.getSimilarApps(WinStore.PDP._parameters._pid,20,WinStore.PDP.onSimilarAppsData);
msWriteProfilerMark("WinStore.PDP.getUserCID,StartTM");
om.getUserCID().done(function(a)
{
msWriteProfilerMark("WinStore.PDP.getUserCID,StopTM");
if(WinStore.Frame.isPdpActive())
{
if(WinStore.PDP._lastKnownUserCID!=a)
{
WinStore.PDP._lastKnownUserCID=a;
om.invalidateCachedUserReview(WinStore.PDP._parameters._pid)
}
msWriteProfilerMark("WinStore.PDP.getUserReview,StartTM");
om.getUserReview(WinStore.PDP._parameters._pid).done(WinStore.PDP.onUserReviewData)
}
});
WinStore.PDP.getReviewListData();
var a=WinStore.PDP._extendedMetadata;
if(a&&a.Developer&&a.Developer!=="")
{
var d=encodeURIComponent(a.Developer);
msWriteProfilerMark("WinStore.PDP.getDeveloperApps,StartTM");
om.getAppsByDeveloper(d,20,WinStore.PDP.onDeveloperAppsData);
if(a.CategoryId)
{
WinStore.PDP._categoryAppsDataReturned=false;
var c="";
if(om.namespace&&om.namespace.categories)
for(var b=0;b<om.namespace.categories.length;b++)
if(om.namespace.categories[b].id===a.CategoryId)
{
c=om.namespace.categories[b].name;
break
}
if(a.FreeApp)
{
WinStore.PDP.setDivContent("pdpPostAcquisitionCategoryAppsCaptionText","Top free in %1".replace("%1",c));
om.getDataGeneratedLists(4,a.CategoryId,20,WinStore.PDP.onCategoryAppsData)
}
else
{
WinStore.PDP.setDivContent("pdpPostAcquisitionCategoryAppsCaptionText","Top paid in %1".replace("%1",c));
om.getDataGeneratedLists(3,a.CategoryId,20,WinStore.PDP.onCategoryAppsData)
}
}
}
}
}
},resize:function(b)
{
om.logInfoMessage("PDP: received resize/rotation notification from frame; sending to hub sections (current store view state = "+b+")");
for(var a=0;a<pdpHubSections.length;a++)
pdpHubSections[a]&&pdpHubSections[a].resize&&
pdpHubSections[a].resize(b)
},onExtendedMetadata:function(a)
{
if(!a)
{
om.logErrorMessage("PDP: onExtendedMetadata called with null app data");
WinStore.PDP.fatalError();
return
}
msWriteProfilerMark("WinStore.PDP.getAppInfo,StopTM");
var b=function(d)
{
for(var b="",
c=0;c<d.length;c++)
{
if(b!=="")
b+=", ";
b+=d[c]+" = "+String(a[d[c]])
}
return b
};
om.logInfoMessage("PDP: onExtendedMetadata: "+b(["Name"]));
om.logInfoMessage("PDP: onExtendedMetadata: "+b(["PackageFamilyName"]));
om.logInfoMessage("PDP: onExtendedMetadata: "+b(["AppTypeId","ApplicationStatus","ApplicationInstalling","ChannelExclusive"]));
om.logInfoMessage("PDP: onExtendedMetadata: "+b(["IsInstallable","AppLanguage","DownloadState"]));
if(a.Id!==WinStore.PDP._parameters._pid)
{
om.logWarningMessage("PDP: onExtendedMetadata app data app ID ("+a.Id+") doesn't match current PDP app ID");
WinStore.PDP.fatalError();
return
}
if(!a.Name||a.Name==="")
{
om.logWarningMessage("PDP: onExtendedMetadata app data incomplete (doesn't contain an app name)");
WinStore.PDP.fatalError();
return
}
if(WinStore.PDP._debugVerbose)
for(var c in a)
a.hasOwnProperty(c)&&
om.logInfoMessage("PDP:     onExtendedMetadata ["+c+"] ("+typeof a[c]+") = "+a[c]);
WinStore.PDP._biData["App.Id"]=a.Id.replace("{","").replace("}","");
WinStore.PDP._biData["App.ReleaseGUID"]=a.ReleaseId.replace("{","").replace("}","");
WinStore.PDP._biData["App.Ver"]=a.Version;
if(WinStore.PDP._biData["App.Ver"]==="")
delete WinStore.PDP._biData["App.Ver"];
om.etwPDPMetadataStop();
WinStore.PDP._extendedMetadata=a;
WinStore.PDP.updateParentalControlsSetting(a);
var d=document.getElementById("pageTitle");
d&&d.innerText===WinStore.PDP._extendedMetadata.Name&&
WinStore.Utilities.readAloud(WinStore.PDP._extendedMetadata.Name+(WinStore.PDP._appProblemJustReported?"\r\nThanks for reporting this app to us.":""));
WinStore.Frame.setPageTitle(WinStore.PDP._extendedMetadata.Name,true);
WinStore.PDP.getAppState(true);
WinStore.PDP.updateAllHubSections(PDPDataSource.ExtendedMetadata);
WinStore.PDP.onLicenseInstallData()
},onLicenseInstallData:function()
{
if(WinStore.PDP._parameters._pid&&WinStore.Frame.isPdpActive())
{
var a=WinStore.Utilities.getLicenseInstallData(WinStore.PDP._parameters._pid,true);
if(WinStore.PDP._debugVerbose)
for(var c in a)
a.hasOwnProperty(c)&&
om.logInfoMessage("PDP: onLicenseInstallData ["+c+"] ("+typeof a[c]+") = "+a[c]);
else
{
var d=a.isInstalled?"installed":"not installed";
if(a.UserLicense)
d+=", "+a.UserLicense;
om.logInfoMessage("PDP: onLicenseInstallData ("+d+")")
}
WinStore.PDP._licenseInstallData=a;
var b=String(a.Installed)==="true"?"0":"1";
if(a.UserLicense)
if(String(a.UserLicense)==="FULL")
b+="1";
else
if(String(a.UserLicense)!=="NONE")
b+="2";
else
b+="0";
else
b+="0";
WinStore.PDP._biData["App.PurchaseStatus"]=b;
om.etwPDPLicenseInstallStop();
WinStore.PDP.getAppState(true);
WinStore.PDP.updateAllHubSections(PDPDataSource.LicenseInstall)
}
},onSimilarAppsData:function(a)
{
if(!a)
{
om.logWarningMessage("PDP: onSimilarAppsData called with null similar apps");
return
}
msWriteProfilerMark("WinStore.PDP.getSimilarApps,StopTM");
if(WinStore.Frame.isPdpActive())
{
if(WinStore.PDP._extendedMetadata)
om.logInfoMessage("PDP: onSimilarAppsData for "+WinStore.PDP._extendedMetadata.Id+" = '"+WinStore.PDP._extendedMetadata.Name+"'");
else
om.logInfoMessage("PDP: onSimilarAppsData for "+WinStore.PDP._parameters._pid);
var b=WinStore.PDP.getPDPElementById("pdpSimilarApps","setBIAttributes");
if(b)
{
b.setAttribute("MS.IG",a.impressionId);
b.setAttribute("MS.AppNS",a.appNS);
b.setAttribute("MS.Scn",a.scn);
b.setAttribute("FlightInfo",a.flightInfo.join())
}
WinStore.PDP._biData.flightInfo=WinStore.PDP._biData.flightInfo.concat(a.flightInfo);
WinStore.PDP._similarAppsData=a;
WinStore.PDP.updateAllHubSections(PDPDataSource.SimilarApps)
}
},onDeveloperAppsData:function(a)
{
if(!a)
{
om.logWarningMessage("PDP: onDeveloperAppsData called with null apps");
return
}
msWriteProfilerMark("WinStore.PDP.getDeveloperApps,StopTM");
if(WinStore.Frame.isPdpActive())
{
if(WinStore.PDP._extendedMetadata)
om.logInfoMessage("PDP: onDeveloperAppsData for "+WinStore.PDP._extendedMetadata.Id+" = '"+WinStore.PDP._extendedMetadata.Name+"'");
else
om.logInfoMessage("PDP: onDeveloperAppsData for "+WinStore.PDP._parameters._pid);
var b=WinStore.PDP.getPDPElementById("pdpAppsByDeveloper","setBIAttributes");
if(b)
{
b.setAttribute("MS.IG",a.impressionId);
b.setAttribute("MS.AppNS",a.appNS);
b.setAttribute("MS.Scn",a.scn);
b.setAttribute("FlightInfo",a.flightInfo.join())
}
WinStore.PDP._biData.flightInfo=WinStore.PDP._biData.flightInfo.concat(a.flightInfo);
WinStore.PDP._developerAppsData=null;
if(a.appInfo&&Array.isArray(a.appInfo))
{
for(var f=a.appInfo.length,
e=WinStore.PDP._parameters._pid,
c=0;c<f;c++)
{
var d=a.appInfo[c];
if(d&&e===d.Id)
{
a.appInfo.splice(c,1);
break
}
}
if(a.appInfo.length>0)
WinStore.PDP._developerAppsData=a;
else
om.logInfoMessage("PDP: onDeveloperAppsData only returned the current PDP's item. Hiding the developer apps data list.")
}
WinStore.PDP.updateAllHubSections(PDPDataSource.DeveloperApps)
}
},onCategoryAppsData:function(b)
{
if(!b)
{
om.logWarningMessage("PDP: onCategoryAppsData called with null apps");
return
}
if(WinStore.Frame.isPdpActive())
{
om.logInfoMessage("PDP: onCategoryAppsData for "+WinStore.PDP._parameters._pid);
WinStore.PDP._categoryAppsData=null;
if(Array.isArray(b)&&b.length>0)
{
var a=b[0];
if(a.appInfo&&Array.isArray(a.appInfo))
{
for(var g=a.appInfo.length,
f=WinStore.PDP._parameters._pid,
c=0;c<g;c++)
{
var e=a.appInfo[c];
if(e&&f===e.Id)
{
a.appInfo.splice(c,1);
break
}
}
if(a.appInfo.length>0)
WinStore.PDP._categoryAppsData=a;
else
om.logInfoMessage("PDP: onCategoryAppsData only returned the current PDP's item.")
}
}
WinStore.PDP._categoryAppsDataReturned=true;
var d=WinStore.PDP.getHubSection("pdpHubSectionMain"),
h=d&&d.displayed;
WinStore.PDP.setPostAcquisitionAppTiles(h)
}
},onUserReviewData:function(a)
{
if(a)
{
msWriteProfilerMark("WinStore.PDP.getUserReview,StopTM");
om.logInfoMessage("PDP: onUserReviewData for "+WinStore.PDP._parameters._pid);
WinStore.PDP._userReviewData=a;
WinStore.PDP.refreshRatingReviewAreaInMainHub()
}
else
om.logWarningMessage("PDP: onUserReviewData called with null data");
WinStore.PDP.updateAllHubSections(PDPDataSource.UserReview)
},onRatingData:function(a)
{
msWriteProfilerMark("WinStore.PDP.getRatings,StopTM");
if(WinStore.Frame.isPdpActive())
{
if(a)
{
if(a.TotalRatingCount>0)
{
WinStore.PDP._ratingData=a;
WinStore.PDP.refreshRatingReviewSection()
}
}
else
om.logWarningMessage("PDP: ratingData called with null data");
WinStore.PDP.updateAllHubSections(PDPDataSource.Ratings)
}
},isAllDataReturned:function()
{
return WinStore.PDP._pendingData&&WinStore.PDP._pendingData.length===0
},isDataReturned:function(a)
{
return WinStore.PDP._pendingData&&WinStore.PDP._pendingData.indexOf(a)===-1
},getReviewListData:function()
{
msWriteProfilerMark("WinStore.PDP.getReviewListData,StartTM");
om.getAppReviewList(WinStore.PDP._parameters._pid,WinStore.PDP._extendedMetadata.ReleaseId,"all","mix","helpful",1,1).done(function(a)
{
msWriteProfilerMark("WinStore.PDP.getReviewListData,StopTM");
WinStore.PDP._reviewData=a;
WinStore.PDP.updateAllHubSections(PDPDataSource.ReviewList)
})
},refreshRatingReviewAreaInMainHub:function()
{
if(!WinStore.PDP._userRatingControl)
{
var e=WinStore.PDP.getPDPElementById("pdpRateThisAppContent","setMainSectionContent");
if(e)
{
WinStore.PDP._userRatingControl=new WinJS.UI.Rating(e,{enableClear:false});
WinStore.PDP._userRatingControl.addEventListener("change",WinStore.PDP.onUserRatingChanged,false);
WinStore.Search.AutoDisableTypeToSearchForElement(e)
}
}
var a=WinStore.PDP._userReviewData,
c=document.getElementById("pdpReviewThisAppContent"),
g=document.getElementById("pdpReviewThisAppCaption"),
b=document.getElementById("pdpRateThisAppMessage"),
h=document.getElementById("pdpRateThisAppCaption");
if(a)
{
if(g&&a.UserReviewTitle&&a.UserReviewTitle!=="")
g.innerText="Update your review";
if(a.UserRating!=="")
{
if(h)
h.innerText="Your rating";
if(b)
if(WinStore.PDP._ratingJustPosted)
{
b.innerText="Thank you for rating this app.";
WinStore.Utilities.readAloud("Thank you for rating this app.")
}
else
b.innerText=""
}
WinStore.PDP._userRatingControl.userRating=WinStore.RRR.normalizeRatingValue(a.UserRating);
var i=a.UserReviewTitle&&a.UserReviewTitle!=="";
if(c)
{
WinJS.Utilities.removeClass(c,"reviewErrorText");
if(WinStore.PDP._reviewJustPosted)
if(i)
{
c.innerText="Thank you. Your review will be posted soon.";
WinStore.Utilities.readAloud("Thank you. Your review will be posted soon.")
}
else
{
if(b)
b.innerText="Thank you for rating this app.";
WinStore.Utilities.readAloud("Thank you for rating this app.")
}
else
{
var d="";
if(i)
if(a.ReviewStatus)
{
var f=parseInt(a.ReviewStatus);
if(f===WinStore.RRR.ReviewStatusValues.autoRejected||f===WinStore.RRR.ReviewStatusValues.manualRejected)
{
WinJS.Utilities.addClass(c,"reviewErrorText");
d="Your review was removed for violating the Windows Store Terms of Use.  Please update your review and submit it again."
}
else
if(f===WinStore.RRR.ReviewStatusValues.pending)
d="Your review is being processed. Please check back later."
}
else
d="Your review is being processed. Please check back later.";
else
d="Share your opinion about this app.";
c.innerText=d
}
}
om.getUserCID().done(function(k)
{
if(WinStore.Frame.isPdpActive())
{
var l=k!=="",
f=WinStore.Utilities.isDesktopApp(WinStore.PDP._extendedMetadata),
i=WinStore.PDP._licenseInstallData,
h=f&&l||!!i&&i.UserLicense!=="NONE",
e=document.getElementById("pdpRateAndReview"),
g=document.getElementById("pdpDesktopAppRateAndReview"),
a=e;
if(f&&g)
{
a=g;
while(e.childNodes.length>0)
a.appendChild(e.firstChild)
}
if(a)
{
var j=a.style.display;
a.style.display=h?"block":"none";
if(h)
{
if(WinStore.PDP._extendedMetadata.MissingHardwareMask)
{
var b=document.getElementById("pdpReviewThisAppCaption"),
d=document.getElementById("pdpRateThisAppCaption"),
c=document.getElementById("pdpReviewThisAppContent");
if(d)
{
d.innerText="Rate this app";
d.disabled=true
}
if(b)
{
b.innerText="Write a review";
b.disabled=true
}
if(c)
{
c.innerText="You can’t write a review for this app because your PC doesn’t have the required hardware.";
WinJS.Utilities.removeClass(c,"reviewErrorText")
}
if(WinStore.PDP._userRatingControl)
{
WinStore.PDP._userRatingControl.userRating=0;
WinStore.PDP._userRatingControl.disabled=true
}
}
if(j==="none")
{
WinJS.UI.Animation.fadeIn(a);
f&&
WinStore.PDP.setDescriptionFeatures("user CID handler")
}
}
}
}
})
}
},readyToDisplay:function()
{
return !!(WinStore.PDP._extendedMetadata&&WinStore.PDP._licenseInstallData)
},advancePromoTimerBoundary:function(a)
{
a!==true&&
WinStore.PDP.updatePriceAndPromoInformation(WinStore.PDP._extendedMetadata);
if(WinStore.PDP._promoEndDate)
{
var b=WinStore.Utilities.getPromoBoundaryInMS(WinStore.PDP._promoEndDate);
if(b!==null)
{
WinStore.PDP._promoTimerId=setTimeout(WinStore.PDP.advancePromoTimerBoundary,b);
return
}
}
a!==true&&
WinStore.PDP.refresh()
},showPDP:function()
{
if(WinStore.PDP._extendedMetadata&&WinStore.PDP._licenseInstallData&&WinStore.PDP._onDataLoaded)
{
if(WinStore.PDP._extendedMetadata.AppLanguage&&WinStore.PDP._extendedMetadata.AppLanguage!=="")
{
var a=document.querySelectorAll("[setLang]");
om.logInfoMessage("PDP: showPDP setting "+a.length+" content elements to language '"+WinStore.PDP._extendedMetadata.AppLanguage+"'");
for(var b=0;b<a.length;b++)
{
WinStore.PDP.logPDPDebugMessage("showPDP updating lang for element '"+a[b].id+"'");
a[b].setAttribute("lang",WinStore.PDP._extendedMetadata.AppLanguage)
}
}
WinStore.PDP._inRemediation&&
WinStore.PDP.showRemediationDialog();
WinStore.PDP._isToken&&
WinStore.PDP.showTokenDialog();
WinStore.PDP._isPIAttach&&
WinStore.PDP.continuePIAttach();
WinStore.PDP._isResumeAsyncPurchase&&
WinStore.PDP.handleResumeAsyncPurchase();
WinStore.PDP._parameters._resumePurchase&&WinStore.PDP._parameters._resumePurchase!==""&&
WinStore.PDP.handleResumePurchase();
WinStore.PDP.initHub();
WinStore.PDP.updateParentalControlsElements();
om.logInfoMessage("PDP: showPDP data returned and set; showing page");
if(WinStore.PDP._onDataLoaded)
{
if(WinStore.PDP._waitingForEtwStop)
{
WinStore.PDP._waitingForEtwStop=false;
!WinStore.PDP.getSavedScrollPosition()&&
om.etwPDPOpenStop();
msWriteProfilerMark("WinStore.PDP.loadPDP,StopTM")
}
msWriteProfilerMark("WinStore.PDP.onDataLoadedCall,StartTM");
WinStore.PDP._onDataLoaded(null,null,WinStore.PDP.onPDPDisplayed);
WinStore.PDP._onDataLoaded=null;
WinStore.PDP.advancePromoTimerBoundary(true)
}
}
else
if(!WinStore.PDP._onDataLoaded)
WinStore.PDP.logPDPDebugMessage("showPDP not showing page (page already showing)");
else
WinStore.PDP.logPDPDebugMessage("showPDP not showing page (not all data available)")
},onPDPDisplayed:function()
{
msWriteProfilerMark("WinStore.PDP.onDataLoadedCall,StopTM");
om.logInfoMessage("PDP: onPDPDisplayed entrance animation done");
for(var b=0;b<pdpHubSections.length;b++)
{
var c=pdpHubSections[b];
if(c)
{
var a=WinStore.PDP.getPDPElementById(c.sectionID,"onPDPDisplayed");
if(a&&a.style.display!=="none")
a.style.opacity=1
}
}
WinStore.PDP.refreshPostDisplay();
WinStore.PDP.restoreHubPosition()
},isPDPVisible:function()
{
return WinStore.PDP._onDataLoaded===null
},fatalError:function()
{
WinStore.PDP.showElement("mainContent",false);
if(WinStore.PDP._onDataLoaded)
{
WinStore.PDP._onDataLoaded();
WinStore.PDP._onDataLoaded=null
}
om.showMessageDialog("Sorry, this app is no longer available.","",[{id:0,text:"Close"}],0,WinStore.PDP.goBack(),null)
},goBack:function()
{
if(!WinStore.PDP.blockNavigation())
{
if(WinStore.PDP._waitingForEtwStop)
{
WinStore.PDP._waitingForEtwStop=false;
!WinStore.PDP.getSavedScrollPosition()&&
om.etwPDPOpenStop()
}
if(WinStore.PDP._waitingForEtwAllData)
{
WinStore.PDP._waitingForEtwAllData=false;
om.etwEvent(false,"WinStore.PDP:retrieveAllPDPData")
}
if(WinStore.PDP._parameters._deeplink&&WinStore.PDP._parameters._deeplink==="1")
{
WinStore.PDP._parameters._deeplink=null;
om.showHomePage()
}
else
om.goBack()
}
},logPDPLoadBI:function()
{
if(WinStore.PDP._extendedMetadata&&WinStore.PDP._licenseInstallData&&WinStore.PDP._biData)
{
om.logInfoMessage("PDP: logPDPLoadBI logging App.Id = "+WinStore.PDP._biData["App.Id"]+", App.PurchaseStatus = "+WinStore.PDP._biData["App.PurchaseStatus"]);
var a=WinStore.PDP.collectImpressionData();
if(WinStore.PDP._biData[WinStore.BI.biFieldNames.DeepLink]===1)
a[WinStore.BI.biFieldNames.DeepLink]=1;
WinStore.BI.firePageViewEvent(a,WinStore.BI.PdpSamplingId)
}
},collectImpressionData:function()
{
function b(g,h)
{
var a=WinStore.PDP.getPDPElementById(g,"firePageViewEvent"),
d=a?a.getAttribute("MS.AppNS"):null,
c=a?a.getAttribute("MS.R"):null,
b=a?a.getElementsByClassName("appTile"):null,
e=b?b.length:0,
f=e!==0?b[h?e-1:0].getAttribute("MS.K"):null;
return {k:f?f:"-1",appNS:d?d:"",region:c?c:""}
}
var a={k:"-1",appNS:"",region:""},
c=a,
d=WinStore.PDP._extendedMetadata;
if(WinStore.PDP.canDisplaySimilarApps())
if(WinStore.PDP.canDisplayDeveloperApps())
{
a=b("pdpSimilarApps",false);
c=b("pdpAppsByDeveloper",true)
}
else
{
a=b("pdpSimilarApps",false);
c=b("pdpSimilarApps",true)
}
else
if(WinStore.PDP.canDisplayDeveloperApps())
{
a=b("pdpAppsByDeveloper",false);
c=b("pdpAppsByDeveloper",true)
}
var e={"App.Id":WinStore.PDP._biData["App.Id"],"App.ReleaseGUID":WinStore.PDP._biData["App.ReleaseGUID"],"App.PurchaseStatus":WinStore.PDP._biData["App.PurchaseStatus"],RequiredHardwareMask:d.RequiredHardwareMask,MissingHardwareMask:d.MissingHardwareMask,MissingHardwareAction:d.missingHardwareAction,FltInfo:WinStore.PDP._biData.flightInfo.join(),RequestQueryForm:WinStore.PDP._biData["FormCode"],RequestQueryFormIg:WinStore.PDP._biData["FormCodeIG"],FirstVisibleItemKValue:a.k,FirstVisibleItemAppNSValue:a.appNS,FirstVisibleItemRValue:a.region,LastVisibleItemKValue:c.k,LastVisibleItemAppNSValue:c.appNS,LastVisibleItemRValue:c.region};
WinStore.PDP.addOptionalBIValues(e);
return e
},addOptionalBIValues:function(a)
{
if(WinStore.PDP._biData[WinStore.BI.biFieldNames.AppIsPromotion])
a[WinStore.BI.biFieldNames.AppIsPromotion]=WinStore.PDP._biData[WinStore.BI.biFieldNames.AppIsPromotion];
if(WinStore.PDP._biData[WinStore.BI.biFieldNames.AppIsUniversal])
a[WinStore.BI.biFieldNames.AppIsUniversal]=WinStore.PDP._biData[WinStore.BI.biFieldNames.AppIsUniversal]
},updateFormCode:function(b)
{
var a=WinStore.PDP._urlParams;
if(a)
{
var c=WinStore.Utilities.getUrlParam(a,"formCode");
if(c&&c!=="")
a=a.replace("formCode="+c,"formCode="+b);
else
a=(a?a+"&":"?")+"formCode="+b;
WinStore.PDP._urlParams=a;
om.updateTravelLogCurrentPageParams(a)
}
WinStore.PDP._parameters._formCode=b;
WinStore.PDP._biData["FormCode"]=b
},blockNavigation:function()
{
return !!WinStore.PDP._blockNavigate||!!WinStore.PDP._navigating
},startingNavigation:function()
{
WinStore.PDP._navigating=true
},cancellingNavigation:function()
{
WinStore.PDP._navigating=false
},getSharingData:function()
{
var a=null,
c=WinStore.PDP._extendedMetadata;
if(c)
if(WinStore.PDP.getAppState()===PDPAppState.Desktop)
a={error:"You can’t share desktop apps from the Windows Store."};
else
{
var e="http://apps.microsoft.com/windows/app/";
if(om.namespace&&om.namespace.pdpSharingUrl&&om.namespace.pdpSharingUrl!=="")
e=om.namespace.pdpSharingUrl;
var b=c.Name,
d=e+c.Id,
f="Link to %1 in the Windows Store".replace("%1",b),
h="%1 (%2)".replace("%1",b).replace("%2",d),
g="<a href='"+d+"'>"+b+"</a>";
a={title:b,description:f,text:h,link:d,html:g}
}
if(a)
if(a.error&&a.error!=="")
om.logInfoMessage("PDP: getSharingData returning error = '"+a.error+"'");
else
om.logInfoMessage("PDP: getSharingData returning title = '"+a.title+"', link = '"+a.link+"'");
else
om.logInfoMessage("PDP: getSharingData returning null data");
return a
},_appState:{value:null,writable:true},getAppState:function(d)
{
if(d)
WinStore.PDP._appState=null;
if(WinStore.PDP._appState===null)
{
WinStore.PDP._appState=PDPAppState.Unknown;
var c="PDP: getAppState (",
a=WinStore.PDP._extendedMetadata;
if(a)
{
if(WinStore.Utilities.isDesktopApp(a))
WinStore.PDP._appState=PDPAppState.Desktop;
else
if(WinStore.PDP._inAcquisition)
WinStore.PDP._appState=PDPAppState.StartingInstall;
else
{
c+=a.FreeApp?"free":"paid";
c+=a.FreeTrialAvailable?", can try":", no trial";
var b=WinStore.PDP._licenseInstallData;
if(b)
{
c+=", "+String(b.UserLicense);
c+=b.Installed?", installed":", not installed";
if(String(b.UserLicense)==="FULL")
if(b.Installed||a.ApplicationInstalling)
WinStore.PDP._appState=PDPAppState.OwnedInstalled;
else
WinStore.PDP._appState=PDPAppState.OwnedUninstalled;
else
if(String(b.UserLicense)==="EXPIRED_TRIAL")
WinStore.PDP._appState=PDPAppState.AcquirableTrialExpired;
else
if(String(b.UserLicense)!=="NONE"&&String(b.UserLicense)!=="")
if(b.Installed||a.ApplicationInstalling)
WinStore.PDP._appState=PDPAppState.AcquirableTrialInstalled;
else
WinStore.PDP._appState=PDPAppState.AcquirableTrialAcquiredAppUninstalled;
else
if(b.Installed||a.ApplicationInstalling)
{
om.logInfoMessage("PDP: getAppState found installed app '"+a.Name+"' with no license");
WinStore.PDP._appState=PDPAppState.OwnedInstalled
}
else
if(a.FreeApp)
WinStore.PDP._appState=PDPAppState.AcquirableFree;
else
if(a.FreeTrialAvailable)
WinStore.PDP._appState=PDPAppState.AcquirableTrialAvailable;
else
WinStore.PDP._appState=PDPAppState.AcquirablePaid
}
}
if(om.namespace&&om.namespace.isDemoMode)
WinStore.PDP._appState=PDPAppState.Unknown
}
c+=") => "+WinStore.Utilities.enumToString(PDPAppState,WinStore.PDP._appState);
om.logInfoMessage(c)
}
return WinStore.PDP._appState
},updateParentalControlsSetting:function(b)
{
WinStore.PDP._parentalControlsOK=true;
if(om.namespace&&om.namespace.parentalControlsSystemId)
{
var a=b.GameRatings;
if(a&&a.length>0)
for(var c=0;c<a.length;++c)
if(a[c].systemId===om.namespace.parentalControlsSystemId)
{
if(a[c].ratingLevel>om.namespace.parentalControlsRatingLevel)
WinStore.PDP._parentalControlsOK=false;
om.logInfoMessage("PDP: updateParentalControlsSetting systemId = "+om.namespace.parentalControlsSystemId+", ratingLevel = "+a[c].ratingLevel+", userRatingLevel = "+om.namespace.parentalControlsRatingLevel+", parentalControlsOK = "+WinStore.PDP._parentalControlsOK);
return
}
}
if(b.ContentRating&&b.ContentRating!==""&&om.namespace&&om.namespace.parentalControlsUserAge)
{
if(b.ContentRating>om.namespace.winStoreUserAge)
WinStore.PDP._parentalControlsOK=false;
om.logInfoMessage("PDP: updateParentalControlsSetting winStoreUserAge = "+om.namespace.winStoreUserAge+", appContentRating = "+b.ContentRating+", parentalControlsOK = "+WinStore.PDP._parentalControlsOK)
}
},updateParentalControlsElements:function()
{
var d=document.getElementsByClassName("pdpHideForParentalControls"),
c=document.getElementsByClassName("pdpShowForParentalControls"),
e=WinStore.PDP._parentalControlsOK;
if(!e)
{
for(var a=0;a<d.length;++a)
WinStore.PDP.showElement(d[a],false);
for(var a=0;a<c.length;++a)
if(c[a].id==="pdpSnapshotBlockedDiv")
WinStore.PDP.showElement(c[a],true,"-ms-grid");
else
WinStore.PDP.showElement(c[a],true);
var b=WinStore.PDP.getPDPElementById("pdpChangeFamilySettingsLink","updateParentalControlsElements");
if(b)
{
b.setAttribute("href","http://go.microsoft.com/fwlink/?LinkId=257564");
b.setAttribute("role","link");
b.setAttribute("target","_blank")
}
else
om.logErrorMessage("PDP: updateParentalControlsElements could not update target for link pdpChangeFamilySettingsLink")
}
},_winJSHub:{value:null,writable:true},initHub:function()
{
var d=WinStore.PDP.getPDPElementById("pdpHub","initHub");
if(d)
{
WinStore.PDP._winJSHub=new WinJS.UI.Hub(d);
if(WinStore.PDP._winJSHub)
{
om.logInfoMessage("PDP: initHub creating hub with "+pdpHubSections.length+" hub sections");
for(var b=0;b<pdpHubSections.length;b++)
{
var a=pdpHubSections[b],
c=WinStore.PDP.createHubSection(a);
if(c)
{
WinStore.PDP._winJSHub.sections.push(c);
a.displaying&&
a.displaying();
a.displayed=true
}
}
WinStore.PDP._winJSHub.addEventListener("headerinvoked",WinStore.PDP.onHubHeaderInvoked)
}
else
om.logErrorMessage("PDP: initHub failed to create WinJS.UI.Hub")
}
},addHubSection:function(e)
{
if(WinStore.PDP._winJSHub)
for(var b=0,
c=0;c<pdpHubSections.length;c++)
{
var a=pdpHubSections[c];
if(a.sectionID===e)
{
if(!a.displayed)
{
var d=WinStore.PDP.createHubSection(a);
if(d)
{
om.logInfoMessage("PDP: addHubSection adding section '"+e+"' before index "+b);
WinStore.PDP._winJSHub.sections.splice(b,0,d);
a.displaying&&
a.displaying();
a.displayed=true
}
}
break
}
else
if(a.displayed)
b+=1
}
},createHubSection:function(a)
{
var d=null;
if(a&&(!a.canDisplay||a.canDisplay()))
{
var b=WinStore.PDP.getPDPElementById(a.sectionID,"createHubSection");
if(b)
{
(!a.sectionHeader||a.isHidden)&&
WinJS.Utilities.addClass(b,"noHeaderDisplay");
var c="";
if(typeof a.sectionHeader==="function")
c=a.sectionHeader();
else
c=a.sectionHeader;
b.style.display="inline-block";
om.logInfoMessage("PDP: showing section "+a.sectionID);
d=new WinJS.UI.HubSection(b,{header:c,isHeaderStatic:!a.headerClick})
}
}
return d
},showHubSection:function(c)
{
if(WinStore.PDP._winJSHub)
for(var b=0,
d=0;d<pdpHubSections.length;d++)
{
var a=pdpHubSections[d];
if(a)
if(a.sectionID===c)
{
if(a.displayed)
{
om.logInfoMessage("PDP: showHubSection showing section '"+c+"' at index "+b);
WinStore.PDP._winJSHub.sectionOnScreen=b
}
else
om.logInfoMessage("PDP: showHubSection not showing hidden section '"+c+"'");
break
}
else
if(a.displayed)
b+=1
}
},getSavedScrollPosition:function()
{
var b=null;
if(WinStore.PDP._urlParams)
{
var a=WinStore.Utilities.getUrlParam(WinStore.PDP._urlParams,"scroll");
if(a&&a!=="")
b=a
}
return b
},updateAllHubSections:function(b)
{
om.logVerboseMessage("PDP: updateAllHubSections refreshing sections for data source = "+WinStore.Utilities.enumToString(PDPDataSource,b));
if(WinStore.PDP._pendingData&&WinStore.PDP._pendingData.length>0)
{
var c=WinStore.PDP._pendingData.indexOf(b);
c>=0&&
WinStore.PDP._pendingData.splice(c,1)
}
for(var a=0;a<pdpHubSections.length;a++)
pdpHubSections[a].refresh&&
pdpHubSections[a].refresh(pdpHubSections[a].sectionID,b,pdpHubSections[a].displayed);
if(WinStore.PDP.readyToDisplay())
{
var d=WinStore.PDP.getSavedScrollPosition();
if(d||WinStore.PDP._defaultTabName)
if(WinStore.PDP.isAllDataReturned())
WinStore.PDP.showPDP();
else
WinStore.PDP._pendingSecondStageRefresh&&
WinStore.PDP.refreshPostDisplay();
else
WinStore.PDP.showPDP()
}
if(WinStore.PDP.isAllDataReturned())
{
if(WinStore.PDP._waitingForEtwAllData)
{
WinStore.PDP._waitingForEtwAllData=false;
om.etwEvent(false,"WinStore.PDP:retrieveAllPDPData");
om.logInfoMessage("PDP: updateAllHubSections logging ETW event for all PDP data returned")
}
if(WinStore.PDP._waitingForAllData)
{
WinStore.PDP._waitingForAllData=false;
om.logVerboseMessage("PDP: updateAllHubSections all PDP data returned");
WinStore.PDP.logPDPLoadBI()
}
}
},onHubHeaderInvoked:function(b)
{
if(b.detail.section._element)
{
om.logInfoMessage("PDP: onHubHeaderInvoked for "+b.detail.section._element.id);
for(var c=0;c<pdpHubSections.length;c++)
{
var a=pdpHubSections[c];
if(a)
if(a.sectionID===b.detail.section._element.id)
{
a.headerClick&&
a.headerClick();
break
}
}
}
},saveHubPosition:function()
{
var a=WinStore.PDP._urlParams;
if(a&&WinStore.PDP._winJSHub)
{
var c=WinStore.PDP._winJSHub.scrollPosition,
b=WinStore.Utilities.getUrlParam(a,"scroll");
if(b&&b!=="")
a=a.replace("scroll="+b,"scroll="+c);
else
a=(a?a+"&":"?")+"scroll="+c;
WinStore.PDP._urlParams=a;
om.updateTravelLogCurrentPageParams(a)
}
},restoreHubPosition:function()
{
var a=WinStore.PDP._urlParams;
if(a&&WinStore.PDP._winJSHub)
if(WinStore.PDP._defaultTabName==="details")
{
WinStore.PDP.showHubSection("pdpHubSectionDetails");
WinStore.PDP._defaultTabName=null
}
else
{
var b=WinStore.PDP.getSavedScrollPosition();
if(b&&b!=="")
{
WinStore.PDP._winJSHub.scrollPosition=b;
a=a.replace("scroll="+b,"");
WinStore.PDP._urlParams=a;
om.updateTravelLogCurrentPageParams(a)
}
}
},getHubSection:function(b)
{
for(var a=0;a<pdpHubSections.length;a++)
if(pdpHubSections[a]&&pdpHubSections[a].sectionID===b)
return pdpHubSections[a];
return null
},_mainSectionWaitingForConfirm:{value:null,writable:true},_userRatingControl:{value:null,writable:true},_lastDisplayedAppState:{value:null,writable:true},_flipper:{value:null,writable:true},_screenshotsRendered:{value:false,writable:true},_lastKnownUserCID:{value:"",writable:true},resetMainSection:function()
{
WinStore.PDP._mainSectionWaitingForConfirm=false;
WinStore.PDP._showingConfirmPurchaseWarning=false;
WinStore.PDP._userRatingControl=null;
WinStore.PDP._lastDisplayedAppState=null;
WinStore.PDP._flipper=null;
WinStore.PDP._screenshotsRendered=false
},refreshMainSection:function(c,b,a)
{
WinStore.PDP.setMainSectionContent(b,a);
if(b===PDPDataSource.ExtendedMetadata)
{
om.logInfoMessage("PDP: refreshMainSection for source = ExtendedMetadata, visible = "+(a?"true":"false"));
WinStore.PDP.setScreenshots();
a&&
WinStore.PDP.setDescriptionFeatures("refreshMainSection")
}
if(b===PDPDataSource.LicenseInstall&&a)
{
om.logInfoMessage("PDP: refreshMainSection for source = LicenseInstall, visible = true");
WinStore.PDP.animateMainSectionUI(true)
}
},displayingMainSection:function()
{
WinStore.PDP.updateMainSectionUI(true,false);
WinStore.PDP.setDescriptionFeatures("displayingMainSection",true);
var a=WinStore.PDP.getPDPElementById("pdpHubSectionScreenshotsDetailsCopyright","displayingMainSection");
a&&
WinStore.PDP.updateTooltip(a)
},updatePriceAndPromoInformation:function(a)
{
om.logInfoMessage("PDP: updatePriceAndPromoInformation price = "+a.Price+", PromoPrice = "+a.PromoPrice+", PromoEndDate = "+a.PromoEndDate);
var c=document.getElementById("pdpPrice"),
e=WinStore.Utilities.getPromoBoundaryInMS(a.PromoEndDate);
WinStore.PDP.setDivContent("pdpPrice",a.Price);
if(e>0)
{
WinJS.Utilities.addClass(c,"pdpOldPrice");
WinStore.PDP.setDivContent("pdpPromoPrice",a.PromoPrice);
if(a.PromoPrice==="Free")
a.PercentageOff=100;
var b="(%1% off)".replace("%1",a.PercentageOff);
if(om.namespace&&om.namespace.market)
{
var d=om.namespace.market.toLowerCase();
switch(d)
{
case "tw":
case "cn":
b="(%1)".replace("%1",Math.round((100-a.PercentageOff)/10));
break;
case "cm":
b="(%1 off)".replace("%1",a.PriceOff)
}
}
WinStore.PDP.setDivContent("pdpPromoEnding",b+" "+WinStore.Utilities.getPromoEndDateString(a.PromoEndDate));
WinStore.PDP._promoEndDate=a.PromoEndDate;
WinStore.PDP._biData[WinStore.BI.biFieldNames.AppIsPromotion]=1
}
else
{
WinJS.Utilities.removeClass(c,"pdpOldPrice");
WinStore.PDP.showElement("pdpPromoPrice",false);
WinStore.PDP.showElement("pdpPromoEnding",false);
WinStore.PDP._promoEndDate=null
}
},setMainSectionContent:function(f,i)
{
(f===PDPDataSource.SimilarApps||f===PDPDataSource.DeveloperApps)&&
WinStore.PDP.setPostAcquisitionAppTiles(i);
if(f===PDPDataSource.LicenseInstall)
{
om.logInfoMessage("PDP: setMainSectionContent for source = LicenseInstall, visible = "+(i?"true":"false"));
var h=WinStore.PDP._licenseInstallData;
if(h&&WinStore.PDP.getAppState()===PDPAppState.OwnedInstalled)
{
var e=h.InstallDate;
if(!e||e.length===0)
e=h.LicAcqDate;
e&&e.length&&
WinStore.PDP.setDivContent(WinStore.PDP.getPDPElementById("pdpLastUpdated","lastUpdated"),"Last updated on this PC on %1".replace("%1",e))
}
WinStore.PDP.setTrialDuration();
WinStore.PDP.refreshRatingReviewAreaInMainHub()
}
if(f===PDPDataSource.ExtendedMetadata)
{
om.logInfoMessage("PDP: setMainSectionContent for source = ExtendedMetadata, visible = "+(i?"true":"false"));
var a=WinStore.PDP._extendedMetadata;
if(a)
{
var l=document.getElementById("pdpRatingCount"),
k=document.getElementById("pdpAverageRating");
if(a.RatingCount)
{
k.tabIndex=0;
var m=new WinJS.UI.Rating(k,{disabled:true,enableClear:false});
m.averageRating=WinStore.RRR.normalizeRatingValue(a.Rating);
l.innerText=a.RatingCountText
}
WinStore.PDP.updatePriceAndPromoInformation(a);
a.ChannelExclusive&&
om.getHomePageData(WinStore.PDP.updatePDPExclusivity);
var b=WinStore.PDP.getPDPElementById("pdpTermsOfUseLink","setMainSectionContent");
if(b)
{
b.tabIndex=0;
b.onclick=function()
{
om.showSettingsPage("termsofuse")
};
b.onkeydown=function()
{
if(event.keyCode==13)
return false
}
}
b=WinStore.PDP.getPDPElementById("pdpAdditionalTermsLink","setMainSectionContent");
if(b)
if(a.EULA&&a.EULA!==""||a.PrivacyPolicyLink&&a.PrivacyPolicyLink!=="")
{
b.tabIndex=0;
b.onkeydown=function()
{
if(event.keyCode==13)
return false
};
b.onclick=function()
{
WinStore.PDP.showHubSection("pdpHubSectionDetails");
for(var c=["pdpDeveloperPrivacyLink","pdpEULALink","pdpEULAReadTermsOfUse"],
b=0;b<c.length;b++)
{
var a=WinStore.PDP.getPDPElementById(c[b],"setMainSectionContent");
if(a&&a.innerText)
{
a.focus();
break
}
}
}
}
else
{
var g=document.createElement("span");
g.innerText=b.innerText;
g.id=b.id;
WinJS.Utilities.removeClass(b.parentNode,"store-linkDefault");
b.parentNode.replaceChild(g,b)
}
WinStore.PDP.setLegalMessages();
if(WinStore.PDP.getAppState()===PDPAppState.Desktop)
{
var j=false,
d=WinStore.PDP.getPDPElementById("pdpDesktopAppPurchaseHref","setMainSectionContent");
if(d)
{
if(a.SupportedArchitecturesEx&&a.SupportedArchitecturesEx.length)
if(a.CurrentArchitecture)
for(var c=0;c<a.SupportedArchitecturesEx.length;++c)
if(a.SupportedArchitecturesEx[c].name&&a.SupportedArchitecturesEx[c].name===a.CurrentArchitecture)
if(a.SupportedArchitecturesEx[c].downloadUrl)
{
if(d)
{
d.setAttribute("href",a.SupportedArchitecturesEx[c].downloadUrl);
d.title=a.SupportedArchitecturesEx[c].downloadUrl
}
j=true;
break
}
if(!j)
{
d.setAttribute("href",a.WebSite);
d.title=a.WebSite
}
}
}
WinStore.PDP.showElement("pdpPriceGrid",WinStore.PDP.getAppState()!==PDPAppState.Desktop,"-ms-grid");
WinStore.PDP.showElement("pdpDesktopAppPurchase",WinStore.PDP.getAppState()===PDPAppState.Desktop);
WinStore.PDP.refreshRatingReviewAreaInMainHub();
WinStore.PDP.setTrialDuration()
}
}
},setLegalMessages:function()
{
var a=WinStore.PDP.getPDPElementById("pdpLegalMessages","setLegalMessages");
if(a)
{
while(a.hasChildNodes())
a.removeChild(a.firstChild);
var b=WinStore.PDP._extendedMetadata;
if(b)
{
if(b.LegalCodes&&Array.isArray(b.LegalCodes)&&b.LegalCodes.length>0)
if(om.namespace&&om.namespace.legalCodes&&Array.isArray(om.namespace.legalCodes))
for(var f=0;f<b.LegalCodes.length;f++)
{
for(var e=b.LegalCodes[f],
c=null,
d=0;d<om.namespace.legalCodes.length;d++)
if(Number(e)===Number(om.namespace.legalCodes[d].id))
{
c=om.namespace.legalCodes[d].name;
break
}
if(c)
{
om.logInfoMessage("PDP: setLegalMessages adding legal message "+e+" = '"+(c.length>40?c.substring(0,40)+"...":c)+"'");
var g=document.createElement("div");
g.innerText=c;
a.appendChild(g)
}
else
om.logWarningMessage("PDP: setLegalMessages could not find corresponding legal message for ID = "+e)
}
else
om.logErrorMessage("PDP: calling setLegalMessages with no namespace legal codes")
}
else
om.logErrorMessage("PDP: calling setLegalMessages with no extended metadata");
WinStore.PDP.showElement(a,a.hasChildNodes())
}
},setPostAcquisitionAppTiles:function(o)
{
if(WinStore.PDP.isDataReturned(PDPDataSource.SimilarApps)&&WinStore.PDP.isDataReturned(PDPDataSource.DeveloperApps)&&WinStore.PDP._categoryAppsDataReturned)
{
var h=WinStore.PDP.getPDPElementById("pdpPostAcquisitionOtherApps","setPostAcquisitionAppTiles"),
e=WinStore.PDP.getPDPElementById("pdpPostAcquisitionSimilarAppsContent","setPostAcquisitionAppTiles"),
b=WinStore.PDP.getPDPElementById("pdpPostAcquisitionDeveloperAppsContent","setPostAcquisitionAppTiles"),
i=WinStore.PDP.getPDPElementById("pdpPostAcquisitionCategoryAppsContent","setPostAcquisitionAppTiles");
if(h&&e&&b&&i)
{
var l=WinStore.PDP._similarAppsData?WinStore.PDP._similarAppsData.appInfo:null,
j=WinStore.PDP._developerAppsData?WinStore.PDP._developerAppsData.appInfo:null,
k=WinStore.PDP._categoryAppsData?WinStore.PDP._categoryAppsData.appInfo:null,
f=6,
d=l&&Array.isArray(l)?l.length:0,
a=j&&Array.isArray(j)?j.length:0,
c=k&&Array.isArray(k)?k.length:0,
m=WinStore.PDP.getAcquisitionState()===PDPAcquisitionState.PostAcquisition;
if(d===0&&a===0)
c=Math.min(f,c);
else
if(d===0)
{
a=Math.min(Math.floor(f/2),a);
c=Math.min(f-a,c)
}
else
if(a===0)
{
d=Math.min(Math.floor(f/2),d);
c=Math.min(f-d,c)
}
else
{
a=Math.min(Math.floor(f/2),a);
d=Math.min(f-a,d);
c=0
}
if(d>0)
{
var g=null;
if(WinStore.PDP._similarAppsData)
{
e.setAttribute("MS.IG",WinStore.PDP._similarAppsData.impressionId);
e.setAttribute("MS.AppNS","PostAcquisition."+WinStore.PDP._similarAppsData.appNS);
e.setAttribute("MS.Scn",WinStore.PDP._similarAppsData.scn);
e.setAttribute("FlightInfo",WinStore.PDP._similarAppsData.flightInfo.join());
g=WinStore.PDP._similarAppsData.impressionId
}
WinStore.PDP.createAppTiles(e,l,d,WinStore.BI.biDataPoint.listId.similarAppsPostInstall,g);
WinStore.PDP.showElement("pdpPostAcquisitionSimilarApps",true);
if(!m)
{
WinStore.Utilities.renameAttributes(e,"MS.EntityId","pre-MS.EntityId");
WinStore.Utilities.renameAttributes(e,"MS.K","pre-MS.K")
}
}
if(a>0)
{
var g=null;
if(WinStore.PDP._developerAppsData)
{
b.setAttribute("MS.IG",WinStore.PDP._developerAppsData.impressionId);
b.setAttribute("MS.AppNS","PostAcquisition."+WinStore.PDP._developerAppsData.appNS);
b.setAttribute("MS.Scn",WinStore.PDP._developerAppsData.scn);
b.setAttribute("FlightInfo",WinStore.PDP._developerAppsData.flightInfo.join());
g=WinStore.PDP._developerAppsData.impressionId
}
WinStore.PDP.createAppTiles(b,j,a,WinStore.BI.biDataPoint.listId.developerAppsPostInstall,g);
WinStore.PDP.setDivContent("pdpPostAcquisitionDeveloperAppsCaptionText",WinStore.PDP.getDeveloperHeaderText());
WinStore.PDP.showElement("pdpPostAcquisitionDeveloperApps",true);
if(!m)
{
WinStore.Utilities.renameAttributes(b,"MS.EntityId","pre-MS.EntityId");
WinStore.Utilities.renameAttributes(b,"MS.K","pre-MS.K")
}
}
if(c>0)
{
var g=null,
n=null;
if(WinStore.PDP._categoryAppsData)
{
b.setAttribute("MS.IG",WinStore.PDP._categoryAppsData.impressionId);
b.setAttribute("MS.AppNS","PostAcquisition."+WinStore.PDP._categoryAppsData.appNS);
b.setAttribute("MS.Scn",WinStore.PDP._categoryAppsData.scn);
b.setAttribute("FlightInfo",WinStore.PDP._categoryAppsData.flightInfo.join());
g=WinStore.PDP._categoryAppsData.impressionId;
n=WinStore.PDP._extendedMetadata.FreeApp?WinStore.Controls.Hub.TOP_FREE_LIST_TYPE_ID:WinStore.Controls.Hub.TOP_PAID_LIST_TYPE_ID
}
WinStore.PDP.createAppTiles(i,k,c,n,g,true);
WinStore.PDP.showElement("pdpPostAcquisitionCategoryApps",true);
if(!m)
{
WinStore.Utilities.renameAttributes(i,"MS.EntityId","pre-MS.EntityId");
WinStore.Utilities.renameAttributes(i,"MS.K","pre-MS.K")
}
}
if(a+d+c>0)
if(o)
{
om.logInfoMessage("PDP: setPostAcquisitionAppTiles fadeIn content for "+a+" dev, "+d+" related apps and "+c+" category apps");
h.style.opacity=0;
WinStore.PDP.showElement(h,true);
WinJS.UI.Animation.fadeIn(h)
}
else
{
om.logInfoMessage("PDP: setPostAcquisitionAppTiles showing content for "+a+" dev, "+d+" related apps and "+c+" category apps");
WinStore.PDP.showElement(h,true)
}
else
WinStore.PDP.showElement(h,false)
}
}
},updatePDPExclusivity:function(d)
{
if(d)
{
function e(a,g,e)
{
var b=0,
c=e.length;
a.innerText="";
while(b<=c)
{
var d=Math.floor((c-b)/2)+b,
f=a.innerText;
a.innerText=g.replace("%1",e.substr(0,d));
if(a.clientWidth<a.scrollWidth)
{
a.innerText=f;
c=d-1
}
else
b=d+1
}
}
var b=d.cpName,
c=b?"%1 exclusive".replace("%1",b):"Exclusive",
a=document.getElementById("pdpExclusive");
a.innerText=c;
WinStore.PDP.showElement(a,true);
if(b&&a.clientWidth<a.scrollWidth)
{
e(a,"%1… exclusive",b);
a.setAttribute("title",c)
}
}
else
om.logErrorMessage("PDP: updatePDPContents failed to retrieve homePageData")
},setDescriptionFeatures:function(o,r)
{
msWriteProfilerMark("WinStore.PDP.setDescriptionFeatures,StartTM");
var e=WinStore.PDP._extendedMetadata,
j=document.documentElement.clientHeight-(r?125:0);
if(e&&WinStore.PDP.getAcquisitionState()===PDPAcquisitionState.PostAcquisition&&WinStore.PDP.getAppState(true)!==PDPAppState.Desktop)
{
var d=WinStore.PDP.getPDPElementById("pdpLeftPaneScrolling","setDescriptionFeatures");
if(d)
{
d.style.height=j-d.offsetTop-60+"px";
om.logInfoMessage("PDP: setDescriptionFeatures showing post-acquisition, scroll height = "+d.style.height+" (caller = "+o+")")
}
WinStore.PDP.setGameRatingUI("pdpPost");
WinStore.PDP.setDivContent("pdpPostDescription",e.Description,"pdpPostDescriptionCaption");
WinStore.PDP.setDivContent("pdpPostFeatureList",e.Features,"pdpPostFeaturesCaption","li");
WinStore.PDP.showElement("pdpReadMore",false);
msWriteProfilerMark("WinStore.PDP.setDescriptionFeatures,StopTM");
return
}
var b=WinStore.PDP.getPDPElementById("pdpDescription","setDescriptionFeatures"),
a=WinStore.PDP.getPDPElementById("pdpFeatures","setDescriptionFeatures"),
c=WinStore.PDP.getPDPElementById("pdpDescriptionAndFeatures","setDescriptionFeatures"),
h=WinStore.PDP.getPDPElementById("pdpDesktopAppRateAndReview","setDescriptionFeatures");
if(e&&b&&a&&c)
{
if(WinStore.PDP._showingExpandedDescriptions)
{
om.logInfoMessage("PDP: setDescriptionFeatures displaying full description and features (called by "+o+")");
c.style.setAttribute("-ms-grid-rows","auto auto auto auto auto auto");
b.style.height="";
a.style.height="";
WinStore.PDP.setDivContent(b,e.Description,"pdpDescriptionCaption");
WinStore.PDP.setDivContent("pdpFeatureList",e.Features,"pdpFeaturesCaption","li");
msWriteProfilerMark("WinStore.PDP.setDescriptionFeatures,StopTM");
return
}
var q=e.Description,
f=e.Features.slice(0),
p=j,
k=20;
WinStore.PDP.setGameRatingUI();
h&&h.style.display!=="none"&&
WinJS.Utilities.addClass(h,"pdpRateAndReviewHorizontalRule");
var d=WinStore.PDP.getPDPElementById("pdpLeftPaneScrolling","setDescriptionFeatures");
if(d)
{
d.style.height=j-d.offsetTop-80+"px";
p=j-c.offsetTop-85;
c.style.height=p+"px";
om.logInfoMessage("PDP: setDescriptionFeatures pre-acq, scroll = "+d.style.height+", available = "+c.style.height+" (caller = "+o+")")
}
c.style.setAttribute("-ms-grid-rows","auto 1fr auto auto 1fr auto");
b.style.height="";
a.style.height="";
WinStore.PDP.setDivContent("pdpDescription",q,"pdpDescriptionCaption");
WinStore.PDP.setDivContent("pdpFeatureList",f,"pdpFeaturesCaption","li");
var g="1fr";
if(b.clientHeight===b.scrollHeight)
g="auto";
var i="1fr";
if(a.clientHeight===a.scrollHeight)
i="auto";
c.style.setAttribute("-ms-grid-rows","auto "+g+" auto auto "+i+" auto");
if(b.clientHeight===b.scrollHeight)
g="auto";
if(a.clientHeight===a.scrollHeight)
i="auto";
if(!WinStore.PDP._parentalControlsOK)
{
g="auto";
i="auto"
}
c.style.setAttribute("-ms-grid-rows","auto "+g+" auto auto "+i+" auto");
WinStore.PDP.logPDPDebugMessage("setDescriptionFeatures setting grid rows to 'auto "+g+" auto auto "+i+" auto'");
var l=false;
if(b.scrollHeight>b.clientHeight)
{
b.style.height=Math.floor(b.clientHeight/k)*k+"px";
om.logInfoMessage("PDP: setDescriptionFeatures description is truncated, setting height to "+b.style.height);
l=true;
WinStore.Utilities.truncateElement(b)
}
if(a.scrollHeight>a.clientHeight)
{
a.style.height=Math.floor(a.clientHeight/k)*k+"px";
om.logInfoMessage("PDP: setDescriptionFeatures features are truncated, setting height to "+a.style.height);
l=true;
var n=null,
m=WinStore.PDP.getPDPElementById("pdpFeatureList","setDescriptionFeatures");
if(m)
{
while(f.length>0&&a.scrollHeight>a.clientHeight)
{
n=f.pop();
WinStore.PDP.setDivContent("pdpFeatureList",f,null,"li")
}
if(n)
{
WinStore.PDP.showElement("pdpFeatureList",true);
(m.clientHeight<a.clientHeight||f.length===0)&&
f.push(n);
WinStore.PDP.setDivContent("pdpFeatureList",f,null,"li")
}
WinStore.Utilities.truncateElement(m.lastChild,a,true)
}
}
WinStore.PDP.showElement("pdpReadMore",l);
h&&h.style.display!=="none"&&!l&&
WinJS.Utilities.removeClass(h,"pdpRateAndReviewHorizontalRule")
}
msWriteProfilerMark("WinStore.PDP.setDescriptionFeatures,StopTM")
},resizeMainSection:function()
{
WinStore.PDP.setDescriptionFeatures("resizeMainSection")
},setTrialDuration:function()
{
var c=WinStore.PDP._extendedMetadata,
a=WinStore.PDP._licenseInstallData;
if(c&&a)
{
om.logInfoMessage("PDP: setTrialDuration - license = '"+a.UserLicense+"', trial available = "+c.FreeTrialAvailable+", duration = "+c.TrialDuration+", hours remaining = "+a.TrialHoursRemaining);
var b=WinStore.PDP.getPDPElementById("pdpTrialRemaining","setTrialDuration");
if(b)
if(a.UserLicense&&(String(a.UserLicense)==="NONE"||String(a.UserLicense)==="")&&c.FreeTrialAvailable&&c.TrialDuration)
{
if(c.TrialDuration===1)
WinStore.PDP.setDivContent(b,"Trial period: 1 day");
else
WinStore.PDP.setDivContent(b,"Trial period: %1 days".replace("%1",c.TrialDuration.toString()));
WinStore.PDP.showElement(b,true)
}
else
if(a.UserLicense&&String(a.UserLicense)==="VALID_TRIAL"&&a.TrialHoursRemaining&&c.TrialDuration)
{
var d=Math.min(a.TrialHoursRemaining,c.TrialDuration*24);
if(d<24)
WinStore.PDP.setDivContent(b,"Less than 24 hours left in trial");
else
if(d<48)
WinStore.PDP.setDivContent(b,"1 day left in trial");
else
WinStore.PDP.setDivContent(b,"%1 days left in trial".replace("%1",Math.floor(d/24).toString()));
WinStore.PDP.showElement(b,true)
}
else
WinStore.PDP.showElement(b,false)
}
},getAcquisitionState:function(c)
{
var a=c?c:WinStore.PDP.getAppState(true),
b=PDPAcquisitionState.PostAcquisition;
if(a&&(a===PDPAppState.AcquirablePaid||a===PDPAppState.AcquirableFree||a===PDPAppState.AcquirableTrialAvailable))
b=PDPAcquisitionState.PreAcquisition;
return b
},animateMainSectionUI:function(b)
{
om.logInfoMessage("PDP: animateMainSectionUI");
var a=WinStore.PDP.getPDPElementById("pdpHubSectionLeftColumn","animateMainSectionUI");
a&&
WinJS.UI.Animation.fadeOut(a).done(function()
{
WinStore.PDP.updateMainSectionUI(!!b,false);
WinJS.UI.Animation.fadeIn(a)
})
},updateMainSectionUI:function(l,f)
{
var g=WinStore.PDP.getAppState(!!l),
a=!!l||g!==WinStore.PDP._lastDisplayedAppState,
c=WinStore.PDP._extendedMetadata,
b=false,
k=false,
d=false,
i=true,
j=true;
om.logInfoMessage("PDP: updateMainSectionUI (force = "+(l?"true":"false")+") appState = '"+WinStore.Utilities.enumToString(PDPAppState,g)+"' (last displayed = '"+WinStore.Utilities.enumToString(PDPAppState,WinStore.PDP._lastDisplayedAppState)+"')");
if(WinStore.PDP.getAcquisitionState(g)===PDPAcquisitionState.PostAcquisition&&WinStore.PDP.getAcquisitionState(WinStore.PDP._lastDisplayedAppState)===PDPAcquisitionState.PreAcquisition)
{
WinStore.PDP.setDescriptionFeatures("updateMainSectionUI");
WinStore.PDP.updateFormCode(WinStore.BI.biFormCodes.PostAcq);
var h=document.getElementById("pdpFrame");
if(h)
{
WinStore.Utilities.renameAttributes(h,"pre-MS.K","MS.K");
WinStore.Utilities.renameAttributes(h,"pre-MS.EntityId","MS.Entity.Id");
WinStore.BI.addMetaToHead("MS.PageIg",WinStore.Utilities.generateGuid());
WinStore.BI.logImpressions(h,WinStore.PDP.collectImpressionData())
}
}
WinStore.PDP._lastDisplayedAppState=g;
if(a)
{
WinStore.PDP.setElementVisibility("pdpBuyButton",true);
WinStore.PDP.setElementVisibility("pdpTryButton",true)
}
switch(g)
{
case PDPAppState.AcquirablePaid:
a&&
WinStore.PDP.setAcquisitionButtons("Buy","Buy\nWhen you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",true,"","",false,!!f);
d=true;
b=true;
break;
case PDPAppState.AcquirableFree:
a&&
WinStore.PDP.setAcquisitionButtons("Install","Install\nWhen you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",true,"","",false,!!f);
d=true;
b=true;
break;
case PDPAppState.AcquirableTrialAvailable:
a&&
WinStore.PDP.setAcquisitionButtons("Buy","Buy\nWhen you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",true,"Try","Try\nWhen you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",true,!!f);
d=true;
b=true;
break;
case PDPAppState.Desktop:
if(a)
{
WinStore.PDP.setElementVisibility("pdpBuyButton",false);
WinStore.PDP.setElementVisibility("pdpTryButton",false);
WinStore.PDP.showElement("pdpButtonGrid",false);
WinStore.PDP.showElement("pdpAppState",false);
WinStore.PDP.showElement("pdpPrice",false);
WinStore.PDP.showElement("pdpDownloadSize",false);
var m=WinStore.PDP.getPDPElementById("pdpRatingArea","updateMainSectionUI");
if(m)
m.style["padding-left"]="0px"
}
b=true;
i=false;
break;
case PDPAppState.StartingInstall:
c&&c.FreeApp&&
WinStore.PDP.setElementVisibility("pdpTryButton",false);
j=false;
i=false;
break;
case PDPAppState.AcquirableTrialExpired:
if(a)
{
WinStore.PDP.setAcquisitionButtons("Buy","Buy\nWhen you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",true,"Trial expired","",false,!!f);
WinStore.PDP.setElementVisibility("pdpTryButton",false);
WinStore.PDP.showElement("pdpTrialExpired",true,"inline")
}
d=true;
break;
case PDPAppState.AcquirableTrialInstalled:
a&&
WinStore.PDP.setAcquisitionButtons("Buy","Buy\nWhen you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",true,"","",false,!!f);
break;
case PDPAppState.AcquirableTrialAcquiredAppUninstalled:
a&&
WinStore.PDP.setAcquisitionButtons("Buy","Buy\nWhen you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",true,"Try","Try\nWhen you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",true,!!f);
d=true;
break;
case PDPAppState.OwnedUninstalled:
if(a)
{
var e=WinStore.PDP.getPDPElementById("pdpYouOwnThisApp","updateMainSectionUI");
if(e)
e.innerText="You own this app and can install it on this PC.";
WinStore.PDP.showElement("pdpLastUpdated",false);
WinStore.PDP.setAcquisitionButtons("Install","Install\nWhen you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",true,"Try","Try\nWhen you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",false,!!f);
WinStore.PDP.setElementVisibility("pdpTryButton",false)
}
d=true;
k=true;
j=false;
break;
case PDPAppState.OwnedInstalled:
if(a)
{
var e=WinStore.PDP.getPDPElementById("pdpYouOwnThisApp","updateMainSectionUI");
if(e)
if(c.ApplicationInstalling)
{
e.innerText="You own this app.";
WinStore.PDP.showElement("pdpLastUpdated",false)
}
else
{
e.innerText="This app is installed on this PC.";
WinStore.PDP.showElement("pdpLastUpdated",true)
}
WinStore.PDP.setElementVisibility("pdpBuyButton",false);
WinStore.PDP.setElementVisibility("pdpTryButton",false);
WinStore.PDP.showElement("pdpButtonGrid",false)
}
k=true;
j=false;
i=false;
break;
default:
om.logErrorMessage("PDP: updateMainSectionUI received unexpected app state");
a&&
WinStore.PDP.setAcquisitionButtons("","",false,"","",false)
}
if(a)
{
WinStore.PDP.showElement("pdpPreAcquisition",b);
WinStore.PDP.showElement("pdpPostAcquisition",!b);
WinStore.PDP.showElement("pdpYouOwnThisApp",k);
WinStore.PDP.showElement("pdpTermsOfUse",i);
WinStore.PDP.showElement("pdpPriceGrid",j,"-ms-grid");
WinStore.PDP.refreshDownloadWarning(d);
if(b&&c&&typeof c.IsInstallable==="boolean"&&!c.IsInstallable)
{
om.logInfoMessage("PDP: updateMainSectionUI IsInstallable flag is false; hiding acquisition buttons");
WinStore.PDP.setElementVisibility("pdpBuyButton",false);
WinStore.PDP.setElementVisibility("pdpTryButton",false);
WinStore.PDP.showElement("pdpButtonGrid",false)
}
}
if(c&&c.missingHardwareAction===HWAction.block)
{
om.logWarningMessage("PDP.updateMainSectionUI: Missing required hardware, hiding Buy/Try buttons");
var e=WinStore.PDP.getPDPElementById("pdpYouOwnThisApp","updateMainSectionUI");
if(e)
e.innerText="Your PC doesn’t meet the hardware requirements for this app.";
WinStore.PDP.showElement("pdpYouOwnThisApp",true);
WinStore.PDP.showElement("pdpLastUpdated",false);
WinStore.PDP.setElementVisibility("pdpBuyButton",false);
WinStore.PDP.setElementVisibility("pdpTryButton",false);
WinStore.PDP.showElement("pdpButtonGrid",false)
}
return b?PDPAcquisitionState.PreAcquisition:PDPAcquisitionState.PostAcquisition
},refreshDownloadWarning:function(d)
{
om.logInfoMessage("PDP: refreshDownloadWarning show = "+(d?"true":"false"));
var a=d,
c=WinStore.PDP._extendedMetadata,
b=WinStore.PDP.getPDPElementById("pdpDownloadWarning","refreshDownloadWarning");
if(a&&c&&b)
{
a=false;
if(c.DownloadState===1)
{
WinStore.PDP.setDivContent(b,"You can’t download this app using a mobile broadband or metered Internet connection. Use a Wi-Fi or Ethernet Internet connection to continue downloading.");
a=true
}
else
if(c.DownloadState===2)
{
WinStore.PDP.setDivContent(b,"Downloading this app might result in additional charges to your data plan, because you’re roaming or near your download limit.");
a=true
}
}
WinStore.PDP.showElement(b,a)
},setAcquisitionButtons:function(a,d,f,b,e,g,h)
{
if(h)
{
var c=WinStore.PDP.getPDPElementById("pdpButtonGrid","setAcquisitionButtons");
c&&
WinJS.UI.Animation.fadeOut(c).done(function()
{
WinStore.PDP.setAcquisitionButtonContent(a,d,f,b,e,g);
(a&&a!==""||!b&&b!=="")&&
WinJS.UI.Animation.fadeIn(c)
})
}
else
{
WinStore.PDP.setAcquisitionButtonContent(a,d,f,b,e,g);
!(a&&a!==""||!b&&b!=="")&&
WinStore.PDP.showElement("pdpButtonGrid",false)
}
},setAcquisitionButtonContent:function(e,c,g,f,d,h)
{
var a=WinStore.PDP.getPDPElementById("pdpBuyButton","setAcquisitionButtons"),
b=WinStore.PDP.getPDPElementById("pdpTryButton","setAcquisitionButtons");
if(a&&b)
{
if(c)
c=c.replace(/<[^>]*>/g,"");
if(d)
d=d.replace(/<[^>]*>/g,"");
if(e&&e!=="")
{
a.innerText=e;
if(c)
a.setAttribute("aria-label",c);
else
a.removeAttribute("aria-label");
a.style.visibility="visible"
}
else
{
a.removeAttribute("aria-label");
a.style.visibility="hidden"
}
a.disabled=!g||WinStore.PDP._inAcquisition;
if(f&&f!=="")
{
b.innerText=f;
if(d)
b.setAttribute("aria-label",d);
else
b.removeAttribute("aria-label");
b.style.visibility="visible"
}
else
{
b.removeAttribute("aria-label");
b.style.visibility="hidden"
}
b.disabled=!h||WinStore.PDP._inAcquisition
}
},_showingExpandedDescriptions:{value:false,writable:true},onReadMoreClick:function()
{
WinStore.PDP._showingExpandedDescriptions=!WinStore.PDP._showingExpandedDescriptions;
var a=WinStore.PDP.getPDPElementById("pdpReadMoreLink","onReadMoreClick");
if(a)
a.innerText=WinStore.PDP._showingExpandedDescriptions?"Show less":"Show more";
WinStore.PDP.setDescriptionFeatures("onReadMoreClick");
WinStore.PDP._showingExpandedDescriptions&&
WinStore.Utilities.setActive(WinStore.PDP.getPDPElementById("pdpLeftPaneScrolling","onReadMoreClick"))
},onBuyButton:function()
{
if(WinStore.PDP._inAcquisition)
{
om.logErrorMessage("PDP: onBuyButton click during acquisition");
return
}
var a=WinStore.PDP._extendedMetadata,
b=WinStore.PDP.getAppState(),
d=false,
f=false;
if(a&&b&&b!==PDPAppState.Unknown)
{
var c=false;
if(WinStore.PDP._mainSectionWaitingForConfirm)
{
WinStore.PDP._mainSectionWaitingForConfirm=false;
om.logInfoMessage("PDP: onBuyButton click for app '"+a.Name+"' with state '"+WinStore.Utilities.enumToString(PDPAppState,b)+"' received confirmation click");
c=true;
f=true
}
else
if(a.FreeApp)
{
om.logInfoMessage("PDP: onBuyButton click for app '"+a.Name+"' with state '"+WinStore.Utilities.enumToString(PDPAppState,b)+"' free app; no confirmation needed");
c=true;
d=true
}
else
if(WinStore.PDP._licenseInstallData&&WinStore.PDP._licenseInstallData.UserLicense.toString()==="FULL")
{
om.logInfoMessage("PDP: onBuyButton click for app '"+a.Name+"' with state '"+WinStore.Utilities.enumToString(PDPAppState,b)+"' licensed app; no confirmation needed");
c=true;
d=true
}
if(!c)
{
om.logInfoMessage("PDP: onBuyButton click for app '"+a.Name+"' with state '"+WinStore.Utilities.enumToString(PDPAppState,b)+"' showing confirm state");
om.etwPDPAcquisitionInitiationStart(a.Id,"buy",a.FreeApp?"free":"paid",1);
WinStore.PDP.setAcquisitionButtons("Confirm",["Confirm","When you install an app, you agree to the <span class='store-linkDefault'><a id='pdpTermsOfUseLink'>Terms of Use</a></span> and any <span class='store-linkDefault'><a id='pdpAdditionalTermsLink'>additional terms</a></span>.",WinStore.PDP._confirmPurchaseWarningText,WinStore.PDP._confirmPurchaseWarningCurrencyText].join("\n"),true,"Cancel","",true,true);
WinStore.PDP.showElement("pdpTrialExpired",false);
WinStore.PDP.displayConfirmPurchaseWarning(true);
WinStore.PDP._mainSectionWaitingForConfirm=true;
om.etwPDPAcquisitionInitiationStop();
var g={"App.Id":WinStore.PDP._biData["App.Id"],"App.Transaction":0,Src:"Buy","App.PurchaseStatus":WinStore.PDP._biData["App.PurchaseStatus"]};
WinStore.PDP.addOptionalBIValues(g);
WinStore.BI.logCustomBI("AppTransaction",g,null,WinStore.BI.PdpSamplingId)
}
else
if(a.missingHardwareAction<HWAction.block)
{
function e()
{
WinStore.Frame.toggleNavigationUI(true);
WinStore.PDP._inAcquisition=true;
WinStore.PDP._blockNavigate=true;
WinStore.PDP._acquiringTrial=false;
WinStore.PDP.enableElement("pdpBuyButton",false);
WinStore.PDP.enableElement("pdpTryButton",false);
WinStore.PDP.displayConfirmPurchaseWarning(false);
WinStore.PDP.getAppState(true);
WinStore.PDP.animateMainSectionUI();
location.hash="#purchase=buy";
WinStore.PDP.showAcquisitionUI(true);
om.etwPDPAcquisitionProgressStart(a.Id,"buy",a.FreeApp?"free":"paid",1);
om.purchase(WinStore.PDP._parameters._pid,a.Name,a.UpdateId,a.AppLanguage,a.RawPrice,a.FreeApp?PT.free:PT.paid,false);
var b={"App.Id":WinStore.PDP._biData["App.Id"],"App.PurchaseStatus":WinStore.PDP._biData["App.PurchaseStatus"],IG:WinStore.Utilities.getUrlParam(WinStore.PDP._urlParams,"origIg")};
WinStore.PDP.addOptionalBIValues(b);
WinStore.BI.refreshSigninState();
if(d)
{
b["Src"]="Install";
WinStore.BI.logCustomBI("AppInstall",b,null,WinStore.BI.PdpSamplingId)
}
else
if(f)
{
b["App.Transaction"]=2;
b["Src"]="Confirm";
WinStore.BI.logCustomBI("AppTransaction",b,null,WinStore.BI.PdpSamplingId)
}
}
if(a.missingHardwareAction===HWAction.warn)
om.showMessageDialog("Your PC doesn’t meet the hardware requirements for this app. For more info, see the Details section of the app’s description page. You can continue installing the app, but it might not work correctly.","This app might not work on this PC",[{id:1,text:"Continue"},{id:0,text:"Cancel"}],1,function(a)
{
if(a===1)
{
om.logWarningMessage("PDP: onBuyButton: user installing app despite missing required hardware");
e()
}
});
else
e()
}
}
else
om.logErrorMessage("PDP: onBuyButton click with indeterminate app state or info")
},onTryButton:function()
{
var a=WinStore.PDP._extendedMetadata;
if(a)
if(WinStore.PDP._mainSectionWaitingForConfirm)
{
om.logInfoMessage("PDP: onTryButton cancelling acquisition");
WinStore.PDP._mainSectionWaitingForConfirm=false;
WinStore.PDP._confirmPurchasePreviousStateMap&&
WinStore.PDP.displayConfirmPurchaseWarning(false);
WinStore.PDP.animateMainSectionUI(true)
}
else
if(a.missingHardwareAction<HWAction.block)
{
function b()
{
om.logInfoMessage("PDP: onTryButton click for app '"+a.Name+"' starting trial acquisition");
WinStore.Frame.toggleNavigationUI(true);
WinStore.PDP._inAcquisition=true;
WinStore.PDP._blockNavigate=true;
WinStore.PDP._acquiringTrial=true;
WinStore.PDP.getAppState(true);
WinStore.PDP.animateMainSectionUI();
WinStore.PDP.showAcquisitionUI(true);
WinStore.PDP.enableElement("pdpBuyButton",false);
WinStore.PDP.enableElement("pdpTryButton",false);
om.etwPDPAcquisitionProgressStart(a.Id,"try",a.FreeApp?"free":"paid",1);
om.purchase(WinStore.PDP._parameters._pid,a.Name,a.UpdateId,a.AppLanguage,a.RawPrice,PT.trial,false);
var b={"App.Id":WinStore.PDP._biData["App.Id"],"App.Transaction":1,Src:"Try","App.PurchaseStatus":WinStore.PDP._biData["App.PurchaseStatus"]};
WinStore.PDP.addOptionalBIValues(b);
WinStore.BI.refreshSigninState();
WinStore.BI.logCustomBI("AppTransaction",b,null,WinStore.BI.PdpSamplingId)
}
if(a.missingHardwareAction===HWAction.warn)
om.showMessageDialog("Your PC doesn’t meet the hardware requirements for this app. For more info, see the Details section of the app’s description page. You can continue installing the app, but it might not work correctly.","This app might not work on this PC",[{id:1,text:"Continue"},{id:0,text:"Cancel"}],1,function(a)
{
if(a===1)
{
om.logWarningMessage("PDP: onTryButton: user installing app despite missing required hardware");
b()
}
});
else
b()
}
},_confirmPurchasePreviousStateMap:{value:null,writable:true},_showingConfirmPurchaseWarning:{value:null,writable:true},_confirmPurchaseWarningText:{"get":function()
{
if(om.namespace&&om.namespace.market.toLowerCase()==="de")
if(om.namespace.lcid==="0407")
return "Once you tap or click Confirm, you won’t be able to cancel this purchase. Bei Downloads besteht kein Widerrufsrecht.";
else
return "Once you tap or click Confirm, you won’t be able to cancel this purchase. There is no revocation right in case of downloads.";
return "Once you tap or click Confirm, you won’t be able to cancel this purchase."
}},_confirmPurchaseWarningCurrencyText:{"get":function()
{
if(om.namespace&&om.namespace.market.toLowerCase()==="kr")
return "This transaction may require foreign currency conversion or may be processed in another country, for which the entity that issued your card may assess additional fees when using a credit or debit card. Please contact the entity that issued your card for details.";
else
return "This transaction may require foreign currency conversion or may be processed in another country, for which your bank may assess additional fees when using a credit or debit card. Please contact your bank for details."
}},displayConfirmPurchaseWarning:function(d)
{
om.logInfoMessage("PDP: displayConfirmPurchaseWarning('"+d+"')");
if(!!WinStore.PDP._showingConfirmPurchaseWarning===d)
return;
WinStore.PDP._showingConfirmPurchaseWarning=d;
var i=d?"block":"none",
b=document.getElementsByClassName("pdpHideForConfirmPurchaseWarning"),
e=WinStore.PDP.getPDPElementById("pdpConfirmPurchaseWarning","displayConfirmPurchaseWarning"),
h=WinStore.PDP.getPDPElementById("pdpConfirmPurchaseWarningText","displayConfirmPurchaseWarning"),
g=WinStore.PDP.getPDPElementById("pdpConfirmPurchaseWarningCurrency","displayConfirmPurchaseWarning");
h.innerText=WinStore.PDP._confirmPurchaseWarningText;
g.innerText=WinStore.PDP._confirmPurchaseWarningCurrencyText;
if(d)
{
for(var f={},
c=0;c<b.length;++c)
f[b[c].id]={display:b[c].style.display,visibility:b[c].style.visibility};
WinJS.UI.Animation.fadeOut(b).then(function()
{
for(var a=0;a<b.length;++a)
b[a].style.display="none"
}).then(function()
{
e.style.display="block";
WinJS.UI.Animation.fadeIn(e)
});
WinStore.PDP._confirmPurchasePreviousStateMap=f
}
else
{
for(var c=0;c<b.length;++c)
{
var a=b[c];
if(WinStore.PDP._confirmPurchasePreviousStateMap&&WinStore.PDP._confirmPurchasePreviousStateMap[a.id])
{
if(WinStore.PDP._confirmPurchasePreviousStateMap[a.id].display||WinStore.PDP._confirmPurchasePreviousStateMap[a.id].display=="")
a.style.display=WinStore.PDP._confirmPurchasePreviousStateMap[a.id].display;
if(WinStore.PDP._confirmPurchasePreviousStateMap[a.id].visibility||WinStore.PDP._confirmPurchasePreviousStateMap[a.id].visibility)
a.style.visibility=WinStore.PDP._confirmPurchasePreviousStateMap[a.id].visibility
}
else
{
om.logWarningMessage("PDP: displayConfirmPurchaseWarning couldn't find saved display state for "+a.id+', setting display="block"');
a.style.display="block"
}
}
WinJS.UI.Animation.fadeOut(e).then(function()
{
e.style.display="none"
}).then(function()
{
WinJS.UI.Animation.fadeIn(b)
});
WinStore.PDP._confirmPurchasePreviousStateMap=null
}
},setScreenshots:function()
{
var a=WinStore.PDP._extendedMetadata;
if(a&&a.Screenshots&&!WinStore.PDP._screenshotsRendered)
{
var m=WinStore.PDP.getPDPElementById("pdpSnapshots","setScreenshots"),
o=WinStore.PDP.getPDPElementById("pdpHubSectionScreenshotsContent","setScreenshots");
if(m)
{
var r=[],
d=a.Screenshots,
q=[],
f=WinStore.PDP.getPDPElementById("pdpHubSectionScreenshotsThumbnails","setScreenshots");
if(f)
while(f.hasChildNodes())
f.removeChild(f.firstChild);
om.logInfoMessage("PDP: setScreenshots adding "+d.length+" screenshot(s)");
for(var g=0;g<d.length;g++)
{
var e=d[g],
c=e.url,
u=WinStore.Utilities.getScalingFactor();
if(u==="1x")
if(matchMedia("(min-height: 1080px) and (max-height: 1439px)").matches)
c=c.replace("/1x/","/1.4x/");
else
if(matchMedia("(min-height: 1440px)").matches)
c=c.replace("/1x/","/1.8x/");
WinStore.PDP.logPDPDebugMessage("setScreenshots adding screenshot '"+e.caption+"' with URL = "+c);
var n=document.createElement("div");
n.className="pdpScreenSnapshot";
var k=document.createElement("img");
k.src=c;
k.alt=e.altText;
k.ondragstart=function()
{
return false
};
k.onclick=function()
{
WinStore.PDP.showFullScreenScreenshots()
};
n.appendChild(k);
q.push(n);
r.push({index:g});
if(f&&d.length>1)
{
var i=document.createElement("div");
i.className="pdpScreenSnapshotThumbnail";
i.id="pdpScreenSnapshotThumbnail"+g;
var h=document.createElement("img");
h.src=c;
h.alt=e.altText;
h.setAttribute("thumbnailId",g);
h.ondragstart=function()
{
return false
};
i.appendChild(h);
var b=document.createElement("div");
b.className="pdpScreenSnapshotThumbnailBorder";
b.setAttribute("thumbnailId",g);
b.setAttribute("role","option");
b.setAttribute("tabindex","0");
b.setAttribute("aria-label","Selected screenshot\n"+e.altText);
b.addEventListener("click",WinStore.PDP.onThumbnailClick,false);
i.appendChild(b);
f.appendChild(i)
}
}
WinStore.PDP._flipper=new WinJS.UI.FlipView(m,{itemDataSource:(new WinJS.Binding.List(r)).dataSource,itemTemplate:function(a)
{
return a.then(function(a)
{
return q[a.data.index]
})
},orientation:"vertical"});
if(f&&d.length>1)
{
o.setAttribute("aria-hidden","true");
WinStore.PDP._flipper.addEventListener("pagecompleted",function()
{
for(var a=m.querySelectorAll("[tabindex='0']"),
c=a?a.length:0,
b=0;b<c;++b)
a[b].setAttribute("tabindex",-1)
},false)
}
else
if(d.length===1)
{
o.removeAttribute("aria-hidden");
WinStore.PDP.updateScreenshotCaption(0);
var e=m.querySelector(".win-template");
e&&
e.setAttribute("aria-label","Screenshot\n"+d[0].altText)
}
var p=WinStore.PDP._extendedMetadata.ForegroundColor==="light"?"#ffffff":WinStore.Utilities.textDarkColor;
WinStore.PDP.getPDPElementById("pdpSnapshotCaption","setScreenshots").style.color=p;
WinStore.PDP.getPDPElementById("pdpSnapshotExpander","setScreenshots").style.color=p;
WinStore.PDP.getPDPElementById("pdpSnapshots","setScreenshots").style.backgroundColor=a.BackgroundColor;
WinStore.PDP.getPDPElementById("pdpSnapshotCaptionContainer","setScreenshots").style.backgroundColor=a.BackgroundColor;
function t()
{
WinStore.PDP.fireFlipViewtNavClick("pdpFlipViewNav","UP")
}
function v()
{
WinStore.PDP.fireFlipViewtNavClick("pdpFlipViewNav","DW")
}
WinStore.PDP._flipper._prevButton.addEventListener("click",t,false);
WinStore.PDP._flipper._nextButton.addEventListener("click",v,false);
WinStore.PDP.onFlipperPageSelected(false);
WinStore.PDP._flipper.addEventListener("pagevisibilitychanged",function(a)
{
!a.detail.visible&&
WinStore.PDP.onFlipperPageSelected(true)
},false)
}
WinStore.PDP.setDivContent("pdpHubSectionScreenshotsDetailsPublisherName",a.Developer);
WinStore.PDP.setDivContent("pdpHubSectionScreenshotsDetailsCopyright",a.Copyright);
WinStore.PDP.setTaxonomyLinks();
var s=WinStore.PDP.getPDPElementById("pdpDownloadSizeContent","setScreenshots");
if(s)
s.innerText=a.DownloadSize;
if(a.ContentRating&&a.ContentRating!==""&&!WinStore.PDP.getGameRating())
om.formatNumber(a.ContentRating,function(a)
{
WinStore.PDP.setDivContent("pdpAgeRatingContent","%1+".replace("%1",a))
});
else
WinStore.PDP.showElement("pdpAgeRating",false);
if(a.DeviceCapabilities&&a.DeviceCapabilities.length>0||a.ApplicationCapabilities&&a.ApplicationCapabilities.length>0)
{
var l=WinStore.PDP.getPDPElementById("pdpDeviceCapabilitiesLink","setScreenshots");
if(l)
{
l.tabIndex=0;
l.onclick=function()
{
var a=WinStore.PDP.getPDPElementById("pdpDeviceCapabilitiesLink","capabilitiesLink.onclick"),
b=WinStore.PDP.getPDPElementById("pdpDetailsTrustContent","capabilitiesLink.onclick"),
c=[];
a&&a.innerText&&
c.push(a.innerText);
b&&b.innerText&&
c.push(b.innerText);
WinStore.PDP.showHubSection("pdpHubSectionDetails");
WinStore.Utilities.readAloud(c.join("\r\n"))
};
l.onkeydown=function()
{
if(event.keyCode==13)
return false
}
}
}
else
WinStore.PDP.showElement("pdpCapabilitiesWarning",false);
var j=WinStore.PDP.getPDPElementById("pdpHubSectionScreenshotsDetails","setScreenshots");
if(j)
if(WinStore.Utilities.isUniversalApp(a))
{
WinJS.Utilities.removeClass(j,"pdpHubSectionScreenshotsDetailsTwoColumns");
WinJS.Utilities.addClass(j,"pdpHubSectionScreenshotsDetailsThreeColumns");
WinJS.Utilities.query("#pdpHubSectionScreenshotUniversalApp").setStyle("display","-ms-grid");
WinJS.Utilities.query("#pdpPriceUniversalApp").clearStyle("display");
WinJS.Utilities.query(".pdpUniversalAppBadge").setAttribute("src",WinStore.Utilities.getUniversalAppBadgeURL());
if(WinStore.Utilities.universalAppHasRequirements(a))
WinJS.Utilities.query("#pdpHubSectionScreenshotUniversalAppMessageCompatibility").clearStyle("display");
else
WinJS.Utilities.query("#pdpHubSectionScreenshotUniversalAppMessageCompatibility").setStyle("display","none");
WinStore.PDP._biData[WinStore.BI.biFieldNames.AppIsUniversal]=1
}
else
{
WinJS.Utilities.removeClass(j,"pdpHubSectionScreenshotsDetailsThreeColumns");
WinJS.Utilities.addClass(j,"pdpHubSectionScreenshotsDetailsTwoColumns");
WinJS.Utilities.query("#pdpHubSectionScreenshotUniversalApp").setStyle("display","none");
WinJS.Utilities.query("#pdpPriceUniversalApp").setStyle("display","none")
}
WinStore.PDP._screenshotsRendered=true
}
},showUniversalAppRequirements:function()
{
var c=WinStore.PDP._extendedMetadata;
if(c)
{
var d=WinStore.Utilities.getUniversalAppRequirements(c),
f="To use this app on a Windows Phone, here’s what your phone needs: "+d.join(", "),
e=WinStore.PDP.getPDPElementById("pdpHubSectionScreenshotUniversalAppMessageCompatibility","showUniversalAppRequirements"),
a=document.createElement("div");
WinJS.Utilities.addClass(a,"pdpUniversalAppRequirementsFlyout");
a.innerText=f;
var b=new WinJS.UI.Flyout(a);
if(b)
{
b.addEventListener("afterhide",WinStore.PDP.afterRequirementsFlyoutHide);
document.body.appendChild(a);
b.show(e,"bottom","center")
}
}
},afterRequirementsFlyoutHide:function()
{
WinJS.Utilities.query(".pdpUniversalAppRequirementsFlyout").forEach(function(a)
{
a&&a.parentNode&&
a.parentNode.removeChild(a)
})
},setTaxonomyLinks:function()
{
var b=WinStore.PDP._extendedMetadata;
if(b)
{
var h=null,
g=null;
if(om.namespace&&om.namespace.categories)
for(var d=0;d<om.namespace.categories.length;d++)
if(om.namespace.categories[d].id===b.CategoryId)
{
h=om.namespace.categories[d].name;
var e=om.namespace.categories[d].subcategories;
if(e)
for(var f=0;f<e.length;f++)
if(e[f].id===b.SubcategoryId)
{
g=e[f].name;
break
}
break
}
var c=WinStore.PDP.getPDPElementById("pdpTaxonomyCategory","setTaxonomyLinks"),
a=WinStore.PDP.getPDPElementById("pdpTaxonomySubcategory","setTaxonomyLinks");
if(c&&a)
if(h)
{
c.innerText=h;
c.onclick=function()
{
WinStore.PDP.onTaxonomyClick(b.CategoryId,null)
};
c.style.display="inline";
if(g)
{
a.innerText=g;
a.onclick=function()
{
WinStore.PDP.onTaxonomyClick(b.CategoryId,b.SubcategoryId)
};
a.style.display="inline";
WinStore.PDP.showElement("pdpTaxonomySubcategoryDivider",true,"inline")
}
else
{
WinStore.PDP.showElement("pdpTaxonomySubcategoryDivider",false);
a.style.display="none"
}
}
else
{
c.style.display="none";
a.style.display="none";
WinStore.PDP.showElement("pdpTaxonomySubcategoryDivider",false)
}
}
},onTaxonomyClick:function(e,b,d)
{
if(!WinStore.PDP.blockNavigation())
{
WinStore.PDP.startingNavigation();
if(om.namespace)
{
var a="?cid="+e;
if(b)
a+="&scid="+b;
a+="&"+om.namespace.defBrowseParams;
om.logInfoMessage("PDP: onTaxonomyClick showing results view for "+a);
var c={"App.Id":WinStore.PDP._biData["App.Id"],"App.Category":e};
WinStore.PDP.addOptionalBIValues(c);
if(b)
c["App.Subcategory"]=b;
if(d!==null&&d!==undefined)
{
c["DList.Id"]=d;
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.dListTitle,c);
om.etwEvent(true,"WinStore.NavigateToDataGeneratedList (catId "+e+")");
om.showTopicPage("?id="+d+"&cid="+e)
}
else
{
WinStore.BI.logCustomBI("pdpTaxonomySelection",c);
if(b)
om.showResultsView(a);
else
om.showCategoryHub(a)
}
}
else
{
WinStore.PDP.cancellingNavigation();
om.logErrorMessage("PDP: onTaxonomyClick no namespace for results view options")
}
}
},onFlipperPageSelected:function(b)
{
var a=WinStore.PDP._extendedMetadata;
if(a&&a.Screenshots&&a.Screenshots.length>1)
{
if(b)
{
var c=WinStore.PDP._flipper.currentPage.toString();
om.etwPDPScreenShot(WinStore.PDP._parameters._pid,c)
}
WinStore.PDP.updateFlipperIndicator()
}
},updateFlipperIndicator:function()
{
var a=WinStore.PDP._extendedMetadata;
if(a&&a.Screenshots&&a.Screenshots.length>1)
{
var b=WinStore.PDP._flipper.currentPage;
if(b>=0&&b<a.Screenshots.length)
{
for(var c=0;c<a.Screenshots.length;c++)
{
var d=WinStore.PDP.getPDPElementById("pdpScreenSnapshotThumbnail"+c,"updateFlipperIndicator");
if(d)
if(c===b)
WinJS.Utilities.addClass(d,"pdpSelectedThumbnail");
else
WinJS.Utilities.removeClass(d,"pdpSelectedThumbnail")
}
WinStore.PDP.updateScreenshotCaption(b)
}
}
},updateScreenshotCaption:function(c)
{
var b=WinStore.PDP._extendedMetadata;
if(b&&b.Screenshots)
{
var a=WinStore.PDP.getPDPElementById("pdpSnapshotCaption","updateScreenshotCaption");
if(WinStore.PDP._onDataLoaded)
{
a.innerText=b.Screenshots[c].caption;
WinStore.PDP.updateTooltip(a)
}
else
WinJS.UI.Animation.fadeOut(a).done(function()
{
a.innerText=b.Screenshots[c].caption;
WinJS.UI.Animation.fadeIn(a).done(function()
{
WinStore.PDP.updateTooltip(a)
})
})
}
},fireFlipViewtNavClick:function(b,c)
{
var a={"App.Id":WinStore.PDP._biData["App.Id"],"App.ReleaseGUID":WinStore.PDP._biData["App.ReleaseGUID"],NavType:"Click",NavDir:c};
WinStore.PDP.addOptionalBIValues(a);
WinStore.BI.fireClickEvent(b,a)
},onThumbnailClick:function(b)
{
if(b&&b.target)
{
var a=b.target.getAttribute("thumbnailId");
if(a!==null&&a!==undefined)
{
om.logInfoMessage("PDP: onThumbnailClick("+a+")");
if(WinStore.PDP._flipper)
{
WinStore.PDP._flipper.currentPage=a;
var c={"App.Id":WinStore.PDP._biData["App.Id"],"App.ReleaseGUID":WinStore.PDP._biData["App.ReleaseGUID"],"screenshot.Pos":a};
WinStore.PDP.addOptionalBIValues(c);
WinStore.BI.fireClickEvent("pdpFlipView",c)
}
}
}
},getGameRating:function()
{
var f=WinStore.PDP._extendedMetadata;
if(f)
{
var b=f.GameRatings;
if(b&&b.length>0)
{
var d=om.namespace.parentalControlsPreferredSystemId;
if(d&&om.namespace.parentalControlsSystemRequired)
for(var a=0;a<b.length;a++)
{
var c=b[a];
if(c.systemId===d)
return c
}
var e=om.namespace.parentalControlsSystemId;
if(e)
for(var a=0;a<b.length;a++)
{
var c=b[a];
if(c.systemId===e)
return c
}
if(d)
for(var a=0;a<b.length;a++)
{
var c=b[a];
if(c.systemId===d)
return c
}
}
}
return null
},setGameRatingUI:function(a)
{
var b=a?a:"pdp",
c=WinStore.PDP.getGameRating();
if(c)
{
WinStore.Utilities.showRatingSystem(c,b);
WinStore.PDP.showElement(b+"GameRatingsContent",true,"-ms-grid");
!a&&
WinStore.PDP.showElement("pdpPostGameRatingsContent",true)
}
else
{
WinStore.PDP.showElement(b+"GameRatingsContent",false);
!a&&
WinStore.PDP.showElement("pdpPostGameRatingsContent",false)
}
},onPostAcquisitionCategoryHeaderClick:function()
{
var a=WinStore.PDP._extendedMetadata;
a&&a.CategoryId&&
WinStore.PDP.onTaxonomyClick(a.CategoryId,null,a.FreeApp?WinStore.Controls.Hub.TOP_FREE_LIST_TYPE_ID:WinStore.Controls.Hub.TOP_PAID_LIST_TYPE_ID)
},_ratingReviewSectionRendered:{value:null,writable:true},_ratingSummaryControl:{value:null,writable:true},_reviewGridControl:{value:null,writable:true},_maxDisplayedReviews:{value:0,writable:true},resetRatingReviewSection:function()
{
WinStore.PDP._ratingReviewSectionRendered=false;
WinStore.PDP._ratingSummaryControl=null;
WinStore.PDP._reviewGridControl=null;
WinStore.PDP._ratingData=null;
WinStore.PDP._reviewData=null
},refreshRatingReviewSection:function()
{
if(WinStore.PDP._ratingData&&WinStore.PDP._reviewData&&!WinStore.PDP._ratingReviewSectionRendered&&WinStore.PDP.canDisplayRatingReviewSection)
{
if(!WinStore.PDP._ratingSummaryControl)
{
var c=WinStore.PDP.getPDPElementById("pdpHubSectionRatingReviewContentSummary","refreshRatingReviewSection");
if(c)
WinStore.PDP._ratingSummaryControl=new WinStore.UI.RatingSummary(c)
}
var d=document.getElementById("pdpHubSectionRatingReviewContentGrid");
if(d)
if(WinStore.PDP._reviewData.totalReviewCount>0&&!WinStore.PDP._reviewGridControl)
WinStore.PDP.resizeReviewSection();
else
d.style.display="none";
var b=WinStore.PDP.getPDPElementById("pdpRatingCount","refreshRatingReviewSection");
if(b)
if(WinStore.PDP._ratingData.TotalRatingCount)
om.formatNumber(WinStore.PDP._ratingData.TotalRatingCount,function(a)
{
b.innerText=a
});
else
b.innerText="";
var a=document.getElementById("pdpAverageRating","refreshRatingReviewSection");
if(a)
if(a.winControl)
a.winControl.averageRating=WinStore.RRR.normalizeRatingValue(WinStore.PDP._ratingData.AverageRating);
else
{
var e=new WinJS.UI.Rating(a,{disabled:true,enableClear:false});
e.averageRating=WinStore.RRR.normalizeRatingValue(WinStore.PDP._ratingData.AverageRating)
}
WinStore.RRR.setRatingSummaryFromRatingData(WinStore.PDP._ratingSummaryControl,WinStore.PDP._ratingData,true);
WinStore.PDP._ratingSummaryControl.showReviewDetails=true;
WinStore.PDP.isPDPVisible()&&
WinStore.PDP.addHubSection("pdpHubSectionRatingReview");
WinStore.PDP._ratingReviewSectionRendered=true
}
},resizeReviewSection:function()
{
if(WinStore.PDP._reviewData)
{
var c=WinStore.PDP._reviewData.totalReviewCount,
a=document.getElementById("pdpHubSectionRatingReviewContentGrid"),
b=parseInt((window.innerHeight-190)/280);
WinStore.PDP._maxDisplayedReviews=Math.min(b*2,c);
if(c>0&&a)
{
if(WinStore.PDP._maxDisplayedReviews>b)
b=WinStore.PDP._maxDisplayedReviews/2;
a.style.height=window.innerHeight-190+"px";
WinStore.PDP._reviewGridControl=new WinStore.UI.ReviewGrid(a,WinStore.PDP._parameters._pid,WinStore.PDP._extendedMetadata.ReleaseId,WinStore.PDP._maxDisplayedReviews,"helpful","all","mix",false);
WinStore.PDP._reviewGridControl.scrollContainerBy=WinStore.PDP.hubScrollBy
}
}
},hubScrollBy:function(a)
{
WinStore.PDP._winJSHub.scrollPosition+=a
},displayingRatingReviewSection:function()
{
for(var a=0;a<WinStore.PDP._winJSHub.sections.length;a++)
{
var b=WinStore.PDP._winJSHub.sections.getAt(a);
if(b._header==="Ratings and reviews")
b.isHeaderStatic=WinStore.PDP._reviewData.totalReviewCount==0
}
},canDisplayRatingReviewSection:function()
{
return !!WinStore.PDP._ratingData&&!!WinStore.PDP._reviewData
},_similarAppsSectionRendered:{value:null,writable:true},resetSimilarApps:function()
{
WinStore.PDP._similarAppsSectionRendered=false
},resizeSimilarApps:function()
{
WinStore.PDP._similarAppsSectionRendered=false;
WinStore.PDP.refreshSimilarApps(0,PDPDataSource.SimilarApps,true)
},refreshSimilarApps:function(f,e,d)
{
if(e===PDPDataSource.SimilarApps)
{
om.logInfoMessage("PDP: refreshSimilarApps for source = SimilarApps, visible = "+(d?"true":"false"));
if(!WinStore.PDP._similarAppsSectionRendered&&WinStore.PDP.canDisplaySimilarApps())
{
var c=WinStore.PDP.getPDPElementById("pdpHubSectionSimilarApps","refreshSimilarApps");
if(c)
{
var a=WinStore.PDP._similarAppsData?WinStore.PDP._similarAppsData.appInfo:null;
if(a&&Array.isArray(a)&&a.length>0)
{
var b=WinStore.PDP.getPDPElementById("pdpSimilarApps","refreshSimilarApps");
b&&
WinStore.PDP.createAppTiles(b,a,0,WinStore.BI.biDataPoint.listId.similarApps,WinStore.PDP._similarAppsData?WinStore.PDP._similarAppsData.impressionId:null);
WinStore.PDP.isPDPVisible()&&
WinStore.PDP.addHubSection("pdpHubSectionSimilarApps")
}
else
om.logInfoMessage("PDP: refreshSimilarApps received no apps to display")
}
WinStore.PDP._similarAppsSectionRendered=true
}
}
},canDisplaySimilarApps:function()
{
return !!WinStore.PDP._similarAppsData&&!!WinStore.PDP._similarAppsData.appInfo&&Array.isArray(WinStore.PDP._similarAppsData.appInfo)&&WinStore.PDP._similarAppsData.appInfo.length>0
},createAppTiles:function(c,i,g,k,m,p)
{
msWriteProfilerMark("WinStore.PDP.createAppTiles,StartTM");
if(c&&i&&Array.isArray(i))
{
var a=2;
if(!g)
{
var o=window.innerHeight-190,
n=WinStore.Utilities.getTileLayout("mediumAppTileTemplate").tileHeightPx;
a=Math.floor(o/n);
c.style.height=a*n+"px"
}
var e=Math.min(i.length,g?g:a*4),
j=null;
om.logVerboseMessage("PDP: createAppTiles showing "+e+" apps");
while(c.firstChild)
c.removeChild(c.firstChild);
c.setAttribute("role","listbox");
if(!g)
{
var l=null;
j={getAdjacent:function(b,f)
{
var d=null,
g=window.getComputedStyle(c).direction==="rtl",
i=g?"Right":"Left",
h=g?"Left":"Right";
if(0<=b&&b<e)
{
if(a<=b)
l=b;
if(f===i)
if(b>=0&&b<a)
d=b;
else
d=~~((b-a)/3);
else
if(f===h)
if(b>=0&&b<a)
d=Math.min(Math.max(b*3+a,l||0),(b+1)*3+a-1);
else
d=b;
else
if(f==="Up")
d=b===0||b===a?b:b-1;
else
if(f==="Down")
d=b===a-1||b===e-1?b:b+1;
else
if(f==="Home")
d=0;
else
if(f==="End")
d=e-1;
else
if(f==="PageUp"||f==="PageDown")
d=b
}
return d
}}
}
for(var d=0;d<e;d++)
{
var h=null;
if(g)
h="smallAppTileTemplate";
else
if(d<a)
h="mediumAppTileTemplate";
else
h="smallAppTileTemplate";
var f=i[d];
if(f)
{
WinStore.Utilities.prepareAppInfoData(f,d);
f.tileId=d.toString();
f.tilePositionBI=d+1;
var b=WinStore.Utilities.createTile(h,f,true);
if(b)
{
WinJS.Utilities.addClass(b,"pdpAppTile");
b.setAttribute("tabindex",0);
b.setAttribute("role","option");
b.setAttribute("aria-posinset",d+1);
b.setAttribute("aria-setsize",e);
b.addEventListener("click",WinStore.PDP.onAppTileClick);
b.addEventListener("keydown",WinStore.PDP.onAppTileKeydown);
if(k)
if(p===true)
b.setAttribute("MS.DList.ID",k);
else
b.setAttribute("MS.CList.ID",k);
m&&
b.setAttribute("origIg",m);
c.appendChild(b)
}
}
}
j&&
new WinJS.UI._KeyboardBehavior(c,j)
}
msWriteProfilerMark("WinStore.PDP.createAppTiles,StopTM")
},onAppTileKeydown:function(a)
{
a.keyCode==13&&
WinStore.PDP.onAppTileClick(a)
},onAppTileClick:function(a)
{
if(!WinStore.PDP.blockNavigation())
{
WinStore.PDP.startingNavigation();
var c=a.currentTarget.getAttribute("appID");
if(c)
{
if(WinStore.PDP._parameters._pid)
{
var e={"CList.App.Id":WinStore.PDP._parameters._pid};
WinStore.PDP.addOptionalBIValues(e);
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.appTile,e,a.currentTarget)
}
om.logInfoMessage("PDP: onAppTileClick for appID = '"+c+"', navigating to that PDP");
WinStore.PDP.saveHubPosition();
var d=a.currentTarget.getAttribute("ms.clist.id"),
b;
if(d)
switch(d)
{
case WinStore.BI.biDataPoint.listId.developerApps:
case WinStore.BI.biDataPoint.listId.developerAppsPostInstall:
b=WinStore.BI.biFormCodes.Developer;
break;
case WinStore.BI.biDataPoint.listId.similarApps:
case WinStore.BI.biDataPoint.listId.similarAppsPostInstall:
b=WinStore.BI.biFormCodes.Similar;
break;
case WinStore.Controls.Hub.TOP_FREE_LIST_TYPE_ID:
case WinStore.Controls.Hub.TOP_PAID_LIST_TYPE_ID:
b=WinStore.BI.biFormCodes.DGList
}
WinStore.Utilities.displayPDP(c,{srcElement:a.currentTarget,formCode:b,origIg:a.currentTarget.getAttribute("origIg")})
}
else
WinStore.PDP.cancellingNavigation()
}
},_similarAppsHeaderClick:function(a,b)
{
if(!WinStore.PDP.blockNavigation())
{
WinStore.PDP.startingNavigation();
if(WinStore.PDP._parameters._pid)
{
if(a&&b)
{
var c={"CList.App.Id":WinStore.PDP._parameters._pid,"CList.Id":b};
WinStore.PDP.addOptionalBIValues(c);
WinStore.BI.fireClickEvent(a,c)
}
om.logInfoMessage("PDP: user clicked similar apps header; navigating to L2 similar apps page");
WinStore.PDP.saveHubPosition();
om.showResultsView("?similarapps="+WinStore.PDP._parameters._pid)
}
else
WinStore.PDP.cancellingNavigation()
}
},onPostAcquisitionSimilarHeaderClick:function()
{
WinStore.PDP._similarAppsHeaderClick(WinStore.BI.biDataPoint.objectName.clientListSmallTitle,WinStore.BI.biDataPoint.listId.similarAppsPostInstall)
},onSimilarHeaderClick:function()
{
WinStore.PDP._similarAppsHeaderClick(WinStore.BI.biDataPoint.objectName.clientListTitle,WinStore.BI.biDataPoint.listId.similarApps)
},_developerAppsSectionRendered:{value:null,writable:true},resetDeveloperApps:function()
{
WinStore.PDP._developerAppsSectionRendered=false
},resizeDeveloperApps:function()
{
WinStore.PDP._developerAppsSectionRendered=false;
WinStore.PDP.refreshDeveloperApps(0,PDPDataSource.DeveloperApps,true)
},refreshDeveloperApps:function(f,e,d)
{
if(e===PDPDataSource.DeveloperApps)
{
om.logInfoMessage("PDP: refreshDeveloperApps for source = DeveloperApps, visible = "+(d?"true":"false"));
if(!WinStore.PDP._developerAppsSectionRendered&&WinStore.PDP.canDisplayDeveloperApps())
{
var c=WinStore.PDP.getPDPElementById("pdpHubSectionAppsByDeveloper","refreshDeveloperApps");
if(c)
{
var a=WinStore.PDP._developerAppsData?WinStore.PDP._developerAppsData.appInfo:null;
if(a&&Array.isArray(a)&&a.length>0)
{
var b=WinStore.PDP.getPDPElementById("pdpAppsByDeveloper","refreshDeveloperApps");
b&&
WinStore.PDP.createAppTiles(b,a,0,WinStore.BI.biDataPoint.listId.developerApps,WinStore.PDP._developerAppsData?WinStore.PDP._developerAppsData.impressionId:null);
WinStore.PDP.isPDPVisible()&&
WinStore.PDP.addHubSection("pdpHubSectionAppsByDeveloper")
}
else
om.logInfoMessage("PDP: refreshDeveloperApps received no apps to display")
}
WinStore.PDP._developerAppsSectionRendered=true
}
}
},canDisplayDeveloperApps:function()
{
return !!WinStore.PDP._developerAppsData&&!!WinStore.PDP._developerAppsData.appInfo&&Array.isArray(WinStore.PDP._developerAppsData.appInfo)&&WinStore.PDP._developerAppsData.appInfo.length>0
},onDeveloperLinkClick:function()
{
if(!WinStore.PDP.blockNavigation())
{
WinStore.PDP.startingNavigation();
if(WinStore.PDP._extendedMetadata)
{
var a={"App.Id":WinStore.PDP._extendedMetadata.Id,"CList.Id":WinStore.BI.biDataPoint.listId.developerApps};
WinStore.PDP.addOptionalBIValues(a);
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.clientListSmallTitle,a);
WinStore.Utilities.showAppsByDeveloper(WinStore.PDP._extendedMetadata.Developer)
}
else
WinStore.PDP.cancellingNavigation()
}
},_onDeveloperHeaderClick:function(a,b)
{
if(!WinStore.PDP.blockNavigation())
{
WinStore.PDP.startingNavigation();
if(WinStore.PDP._extendedMetadata)
{
if(a&&b)
{
var c={"CList.App.Id":WinStore.PDP._parameters._pid,"CList.Id":b};
WinStore.PDP.addOptionalBIValues(c);
WinStore.BI.fireClickEvent(a,c)
}
om.logInfoMessage("PDP: user clicked developer apps header; navigating to L2 developer apps page");
WinStore.PDP.saveHubPosition();
WinStore.Utilities.showAppsByDeveloper(WinStore.PDP._extendedMetadata.Developer)
}
else
WinStore.PDP.cancellingNavigation()
}
},onPostAcquisitionDeveloperHeaderClick:function()
{
WinStore.PDP._onDeveloperHeaderClick(WinStore.BI.biDataPoint.objectName.clientListSmallTitle,WinStore.BI.biDataPoint.listId.developerAppsPostInstall)
},onDeveloperHeaderClick:function()
{
WinStore.PDP._onDeveloperHeaderClick(WinStore.BI.biDataPoint.objectName.clientListTitle,WinStore.BI.biDataPoint.listId.developerApps)
},getDeveloperHeaderText:function()
{
var b="",
a=WinStore.PDP._extendedMetadata;
if(a&&a.Developer&&a.Developer!=="")
b="Apps by %1".replace("%1",a.Developer);
return b
},getAppNameHeaderText:function()
{
var a=WinStore.PDP._extendedMetadata;
return a&&a.Name?a.Name:""
},_detailsSectionRendered:{value:null,writable:true},resetDetailsSection:function()
{
WinStore.PDP._detailsSectionRendered=false
},makePDPList:function(e,b,g,h,f)
{
var a=e;
if(typeof e==="string")
a=WinStore.PDP.getPDPElementById(e,"makePDPList");
if(a&&b&&Array.isArray(b))
{
while(a.hasChildNodes())
a.removeChild(a.firstChild);
for(var d=0;d<b.length;d++)
{
var c=null;
if(g)
c=g(b[d]);
else
c=b[d];
if(c)
{
var i=document.createElement("li");
i.innerText=c;
a.appendChild(i)
}
}
h&&
WinStore.PDP.showElement(h,!!a.firstChild);
f&&
WinStore.PDP.showElement(f,!!a.firstChild)
}
},refreshDetailsSection:function(u,t,s)
{
if(t===PDPDataSource.ExtendedMetadata)
{
om.logInfoMessage("PDP: refreshDetailsSection for source = ExtendedMetadata, visible = "+(s?"true":"false"));
var a=WinStore.PDP._extendedMetadata;
if(a&&!WinStore.PDP._detailsSectionRendered)
{
var d=WinStore.PDP.getPDPElementById("pdpHubSectionDetailsAppTiles","refreshDetailsSection");
if(d)
{
while(d.hasChildNodes())
d.removeChild(element.firstChild);
function o(g,c,e,f,d)
{
om.logVerboseMessage("PDP: refreshDetailsSection adding app tile "+c+" = '"+e+"', url = '"+f+"', background = '"+d+"'");
var b=document.createElement("div");
b.id="pdpDetailAppTile"+c;
b.className="pdpHubSectionDetailsAppTile";
b.style.backgroundColor=d;
var a=document.createElement("img");
a.id="pdpDetailAppTile"+c;
a.src=f;
a.className="pdpHubSectionDetailsAppTileIcon";
a.alt="%1 logo".replace("%1",e);
a.ondragstart=function()
{
return false
};
b.appendChild(a);
g.appendChild(b)
}
if(a.AppTiles&&Array.isArray(a.AppTiles)&&a.AppTiles.length>1)
for(var b=0;b<a.AppTiles.length;b++)
o(d,b+1,a.AppTiles[b].name,a.AppTiles[b].imageUrl,a.AppTiles[b].background);
else
o(d,1,a.Name,a.LogoURL,a.BackgroundColor)
}
WinStore.PDP.setDivContent("pdpDetailsReleaseNotesContent",a.ReleaseNotes,"pdpDetailsReleaseNotesCaption");
var h=null;
if(a.DeviceCapabilities)
h=WinStore.PDP.translateDeviceCapabilities(a.DeviceCapabilities);
var i=null;
if(a.ApplicationCapabilities)
i=WinStore.PDP.translateAppCapabilities(a.ApplicationCapabilities);
var c=[];
if(h)
c=c.concat(h);
if(i)
c=c.concat(i);
if(c.length===0)
{
WinStore.PDP.showElement("pdpDetailsTrustCaption",false);
WinStore.PDP.showElement("pdpDetailsTrustContent",false)
}
else
{
c.sort(function(a,b)
{
if(a.sortOrder<b.sortOrder)
return -1;
else
if(a.sortOrder>b.sortOrder)
return 1;
else
return 0
});
WinStore.PDP.makePDPList("pdpDetailsTrustContentList",c,function(a)
{
if(a&&a.text)
return a.text;
return null
},"pdpDetailsTrustCaption","pdpDetailsTrustContent")
}
WinStore.PDP.showElement("pdpAccessibilityCaption",!!a.Accessible);
WinStore.PDP.showElement("pdpAccessibilityContent",!!a.Accessible);
var p=[];
a.missingHardwareAction=WinStore.Utilities.checkAppHardwareRequirements(a,p);
WinStore.PDP.makePDPList("pdpDetailsRequiredHWContentList",p,null,"pdpDetailsRequiredHWCaption","pdpDetailsRequiredHWContent");
WinStore.PDP.makePDPList("pdpDetailsRecommendedHWContentList",a.SystemRequirements,null,"pdpDetailsRecommendedHWCaption","pdpDetailsRecommendedHWContent");
var r="";
if(a.SupportedArchitecturesEx&&a.SupportedArchitecturesEx.length)
{
for(var q=[],
b=0;b<a.SupportedArchitecturesEx.length;++b)
q.push(a.SupportedArchitecturesEx[b].name);
r=q.join(", ")
}
WinStore.PDP.setDivContent("pdpDetailsProcessorsContent",r,"pdpDetailsProcessorsCaption");
if(a.Language&&a.Language.length)
if(a.Language.length<=10)
{
WinStore.PDP.setDivContent("pdpDetailsLanguagesContent",a.Language.join(", "),"pdpDetailsLanguagesCaption");
WinStore.PDP.showElement("pdpDetailsLanguagesShowAll",false)
}
else
{
var k=WinStore.PDP.getPDPElementById("pdpDetailsLanguagesShowAll","refreshDetailsSection");
if(k)
{
k.innerText="Show fewer languages";
WinStore.PDP.showElement(k,true);
WinStore.PDP.onShowAllLanguageClick(true)
}
}
else
{
WinStore.PDP.showElement("pdpDetailsLanguagesContent",false);
WinStore.PDP.showElement("pdpDetailsLanguagesCaption",false);
WinStore.PDP.showElement("pdpDetailsLanguagesShowAll",false)
}
var g=false,
m=WinStore.PDP.getPDPElementById("pdpDeveloperWebsiteLink","refreshDetailsSection");
if(m&&a.WebSite&&a.WebSite!=="")
{
m.innerText="%1 website".replace("%1",a.Name);
m.href=a.WebSite;
WinStore.PDP.createLinkTooltip("pdpDeveloperWebsiteLink",a.WebSite);
g=true
}
WinStore.PDP.showElement("pdpDeveloperWebsite",g);
var f=false,
l=WinStore.PDP.getPDPElementById("pdpDeveloperSupportSiteLink","refreshDetailsSection");
if(l&&a.SupportForum&&a.SupportForum!=="")
{
l.innerText="%1 support".replace("%1",a.Name);
l.href=a.SupportForum;
WinStore.PDP.createLinkTooltip("pdpDeveloperSupportSiteLink",a.SupportForum);
f=true
}
WinStore.PDP.showElement("pdpDeveloperSupportSite",f);
WinStore.PDP.showElement("pdpDetailsLearnMoreCaption",f||g);
WinStore.PDP.showElement("pdpDetailsLearnMoreContent",f||g);
var e=false;
if(a.PrivacyPolicyLink&&a.PrivacyPolicyLink!=="")
{
var j=WinStore.PDP.getPDPElementById("pdpDeveloperPrivacyLink","refreshDetailsSection");
if(j)
{
j.innerText="%1 privacy policy".replace("%1",a.Developer);
j.href=a.PrivacyPolicyLink;
WinStore.PDP.createLinkTooltip("pdpDeveloperPrivacyLink",a.PrivacyPolicyLink);
e=true
}
}
if(a.EULA&&a.EULA!=="")
{
document.getElementById("pdpEULAText").style.display="none";
if(a.EULA.match(/^(http|https):\/\/[-A-Za-z0-9+&@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#/%=~_()|]$/i))
{
om.logInfoMessage("PDP: refreshDetailsSection parsed '"+a.EULA+"' as a URL");
var n=WinStore.PDP.getPDPElementById("pdpEULALink","refreshDetailsSection");
if(n)
{
n.innerText="%1 license terms".replace("%1",a.Name);
n.href=a.EULA;
WinStore.PDP.createLinkTooltip("pdpEULALink",a.EULA);
WinStore.PDP.showElement("pdpEULALinkSpan",true);
WinStore.PDP.showElement("pdpEULAReadTermsOfUse",false)
}
}
else
{
om.logInfoMessage("PDP: refreshDetailsSection did not recognize the EULA as a URL");
document.getElementById("pdpEULAText").innerText=a.EULA;
document.getElementById("pdpEULAReadTermsOfUse").innerText="%1 license terms".replace("%1",a.Name);
document.getElementById("pdpEULAReadTermsOfUse").style.display="inline-block";
WinStore.PDP.showElement("pdpEULALinkSpan",false)
}
e=true
}
else
{
WinStore.PDP.showElement("pdpEULAText",false);
WinStore.PDP.showElement("pdpEULAReadTermsOfUse",false);
WinStore.PDP.showElement("pdpEULALinkSpan",false)
}
WinStore.PDP.showElement("pdpDetailsAdditionalTermsCaption",e);
WinStore.PDP.showElement("pdpDetailsAdditionalTermsContent",e);
WinStore.PDP.showElement("pdpDetailsReportToMicrosoftMessage",WinStore.PDP._appProblemJustReported);
WinStore.PDP._detailsSectionRendered=true
}
}
},onShowAllLanguageClick:function(g)
{
if(WinStore.PDP._extendedMetadata)
{
var a=WinStore.PDP._extendedMetadata.Language,
b=WinStore.PDP.getPDPElementById("pdpDetailsLanguagesShowAll","onShowAllLanguageClick");
if(a&&b&&a.length>5)
{
var e=b.innerText!=="Show fewer languages",
c=e?a.join(", "):a.slice(0,5).join(", ")+String.fromCharCode(8230),
f=e?"Show fewer languages":"Show all languages (%1)".replace("%1",a.length),
d=WinStore.PDP._winJSHub?WinStore.PDP._winJSHub.scrollPosition:null;
WinStore.PDP.setDivContent("pdpDetailsLanguagesContent",c,"pdpDetailsLanguagesCaption");
b.innerText=f;
WinStore.PDP.resizeDetails();
!g&&
WinStore.Utilities.readAloud(c);
if(d)
WinStore.PDP._winJSHub.scrollPosition=d
}
}
},translateDeviceCapabilities:function(c)
{
for(var d=[],
b=0;b<c.length;b++)
{
var a=null,
e=c[b];
if(e.translated)
a={sortOrder:99,text:e.label,longtext:e.label};
else
{
var h=c[b].label.toLowerCase().replace("{","").replace("}","");
a=translateCapabilitiesLookup[h]
}
if(a)
{
for(var g=false,
f=0;f<d.length;f++)
if(d[f].text===a.text)
{
g=true;
break
}
if(!g)
{
d.push(a);
WinStore.PDP.logPDPDebugMessage("translateDeviceCapabilities adding capability '"+a.text+"'")
}
}
else
om.logInfoMessage("PDP: translateDeviceCapabilities unknown capability = '"+c[b].label+"'")
}
return d
},translateAppCapabilities:function(d)
{
for(var b=[],
c=0;c<d.length;c++)
{
var g=d[c].toLowerCase().replace("{","").replace("}",""),
a=translateCapabilitiesLookup[g];
if(a)
{
for(var f=false,
e=0;e<b.length;e++)
if(b[e].text===a.text)
{
f=true;
break
}
if(!f)
{
b.push(a);
WinStore.PDP.logPDPDebugMessage("translateAppCapabilities adding capability '"+a.text+"'")
}
}
else
om.logInfoMessage("PDP: translateAppCapabilities: unknown capability = '"+d[c]+"'")
}
return b
},onReadTermsOfUseClick:function()
{
om.logInfoMessage("PDP: onReadTermsOfUseClick expanding terms of use in details section");
WinStore.PDP.showElement("pdpEULAText",true);
WinStore.PDP.showElement("pdpEULAReadTermsOfUse",false);
WinStore.PDP.displayingDetailsSection()
},displayingDetailsSection:function()
{
var a=WinStore.PDP.getPDPElementById("pdpHubSectionDetailsText","displayingDetailsSection");
if(a)
{
a.style.width="";
om.logInfoMessage("PDP: displayingDetailsSection setting details text section width to '"+a.offsetWidth+"px'");
a.style.width=a.offsetWidth+"px"
}
},resizeDetails:function()
{
WinStore.PDP.displayingDetailsSection()
},onPurchaseProgress:function(a)
{
if(!a||a.ps===null||a.code===null)
{
om.logErrorMessage("PDP: onPurchaseProgress called with invalid arguments");
return
}
var b=WinStore.PDP._extendedMetadata;
if(!WinStore.Frame.isOnPage("pdpFrame")||!b||a.appId.toLowerCase()!==b.Id.toLowerCase())
return;
if(!WinStore.PDP._inAcquisition)
{
om.logErrorMessage("PDP: onPurchaseProgress called when not in acquisition");
return
}
om.logInfoMessage("PDP: onPurchaseProgress args = "+a.ps+" ("+WinStore.Utilities.enumToString(PDPPurchaseProgress,a.ps)+") - 0x"+a.code.toString(16));
if(b)
{
var c=WinStore.PDP._acquiringTrial,
f=!!b.FreeApp;
switch(a.ps)
{
case PDPPurchaseProgress.PS_IN_CREATE_TRANSACTION:
case PDPPurchaseProgress.PS_IN_CONFIRM_PURCHASE:
case PDPPurchaseProgress.PS_IN_ACQUIRE_LICENSE:
if(f||WinStore.PDP.isUserLicenseValid()||c)
WinStore.PDP.setPurchaseProgressText("Starting installation…");
else
WinStore.PDP.setPurchaseProgressText("Processing payment…");
break;
case PDPPurchaseProgress.PS_PURCHASE_COMPLETE:
WinStore.PDP.setPurchaseProgressText("Starting installation…");
WinStore.PDP._blockNavigate=false;
WinStore.Frame.toggleNavigationUI(false);
WinStore.PDP.showAcquisitionUI(false);
WinStore.Utilities.addNewLicense(b,c);
WinStore.PDP.onLicenseInstallData();
WinStore.PDP.startPIAttach();
break;
case PDPPurchaseProgress.PS_SETUP_PAYMENT:
WinStore.PDP.setPurchaseProgressText("Setting up payment method…");
break;
case PDPPurchaseProgress.PS_ERROR:
var e=a.code>>16&8191;
if(e==FACILITY_WINDOWS_STORE)
WinStore.PDP.onPurchaseErrors(a);
else
{
var d=a.code&65535;
switch(d)
{
case ErrorCodes.NOERROR:
om.logInfoMessage("PDP: onPurchaseProgress error code NOERROR");
WinStore.PDP._inAcquisition=false;
WinStore.PDP._blockNavigate=false;
WinStore.Frame.toggleNavigationUI(false);
WinStore.PDP.showAcquisitionUI(false);
WinStore.PDP.updateMainSectionUI(true);
break;
case ErrorCodes.ERROR_CANCELLED:
om.logInfoMessage("PDP: onPurchaseProgress ERROR_CANCELLED");
WinStore.PDP._inAcquisition=false;
WinStore.PDP._blockNavigate=false;
WinStore.Frame.toggleNavigationUI(false);
WinStore.PDP.showAcquisitionUI(false);
WinStore.PDP.updateMainSectionUI(true);
break;
case ErrorCodes.ERROR_IO_PENDING:
om.logInfoMessage("PDP: onPurchaseProgress ERROR_IO_PENDING");
WinStore.PDP.setPurchaseProgressText(c?"Initiating trial…":"Processing payment…");
break;
case ErrorCodes.ERROR_ACCESS_DENIED:
case ErrorCodes.ERROR_WINHTTP_TIMEOUT:
case ErrorCodes.ERROR_WINHTTP_TIMEOUT_HR:
default:
WinStore.PDP._inAcquisition=false;
WinStore.PDP._blockNavigate=false;
WinStore.Frame.toggleNavigationUI(false);
WinStore.PDP.showAcquisitionUI(false);
WinStore.PDP.updateMainSectionUI(true);
WinStore.PDP.onPurchaseErrors(a)
}
}
}
}
},onInstallProgress:function(c)
{
if(!WinStore.Frame.isOnPage("pdpFrame")||!WinStore.PDP._inAcquisition)
return;
var a,
d=WinStore.PDP._extendedMetadata.PackageFamilyName;
if(d)
for(var b=0;b<c.length;++b)
if(d===c[b].packageFamilyName)
{
a=c[b];
break
}
if(a)
switch(a.installState.toLowerCase())
{
case "initiated":
WinStore.PDP.setPurchaseProgressText("Downloading...");
break;
case "cancelled":
WinStore.PDP.onPurchaseProgress({appId:WinStore.PDP._extendedMetadata.Id,ps:PDPPurchaseProgress.PS_ERROR,code:ErrorCodes.ERROR_CANCELLED});
break;
case "error":
var e=a.lastStatusCode?parseInt(a.lastStatusCode):0;
WinStore.PDP.onPurchaseProgress({appId:WinStore.PDP._extendedMetadata.Id,ps:PDPPurchaseProgress.PS_ERROR,code:e});
break;
case "complete":
WinStore.PDP._inAcquisition=false;
WinStore.Utilities.setInstalledInLicensedAppList(d);
WinStore.PDP.onLicenseInstallData()
}
},setPurchaseProgressText:function()
{
},onPurchaseErrors:function(f)
{
var e="Purchase error",
b=null,
c=null,
d=-1,
g,
a={cancel:-1,close:0,retry:1,refresh:2,pcs:3,pref:4};
om.logInfoMessage("PDP: onPurchaseErrors args.code = 0x"+f.code.toString(16)+" ("+WinStore.Utilities.enumToString(ErrorCodes,f.code)+")");
switch(f.code)
{
case ErrorCodes.E_ALLOWED_MACHINE_LIMIT_REACHED:
e="You’ve reached the PC limit for your account";
b="You need to remove a PC from your Windows Store account before you can install apps on this PC.";
c=[{id:a.pref,text:"Choose a PC to remove"},{id:a.cancel,text:"Cancel"}];
d=1;
break;
case ErrorCodes.E_WS_SECOND_TRIAL_DENIED:
e="The trial version of this app can’t be installed";
b="A trial version of this app was already installed on this PC. You need to purchase this app to use it.";
c=[{id:a.refresh,text:"Close"}];
d=0;
break;
case ErrorCodes.COMMERCE_E_PRICE_MISMATCH:
e="App information updated";
b="Information about this app has changed. Please refresh this page and try again.";
c=[{id:a.refresh,text:"Refresh"}];
g=f.info;
break;
case ErrorCodes.COMMERCE_E_INVALID_PI_TYPE:
case ErrorCodes.COMMERCE_E_INVALID_PI_STATUS:
case ErrorCodes.COMMERCE_E_INVALID_PI_DETAILS:
b="Make sure the payment info for your Windows Store account is correct.  If you continue to get this message, contact your payment provider.";
c=[{id:a.pcs,text:"Update"},{id:a.cancel,text:"Cancel"}];
d=1;
break;
case ErrorCodes.COMMERCE_E_INVALID_ACCOUNT_STATE:
e="Update payment method";
b="Your purchase couldn’t be completed because there’s a problem with the payment method for your Windows Store account. Check to make sure the info for your account is correct and try again.";
c=[{id:a.pcs,text:"Update"},{id:a.cancel,text:"Cancel"}];
d=1;
break;
case ErrorCodes.COMMERCE_E_EXPIRED_PI:
e="Your payment method has expired";
b="You need to update your payment method to continue with your purchase.";
c=[{id:a.pcs,text:"Update"},{id:a.cancel,text:"Cancel"}];
d=1;
break;
case ErrorCodes.COMMERCE_E_ASYNC_PAYMENT_REDIRECT:
e="Go to Alipay website";
b="You need to go to the Alipay website to complete your purchase.";
c=[{id:a.pcs,text:"Go to Alipay"},{id:a.cancel,text:"Cancel"}];
d=1;
break;
case ErrorCodes.COMMERCE_E_ASYNC_PURCHASE_CANCELED:
e="Purchase cancelled";
b="You either cancelled the purchase or your session timed out. If you want to purchase this app, please wait a few minutes and try again.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.COMMERCE_E_IN_PROGRESS_ASYNC_PURCHASE:
e="Pending purchase confirmation";
b="We haven’t received confirmation from Alipay for your purchase. If you’ve completed your purchase on Alipay, tap or click Try again. If you haven’t completed your purchase, go to the Alipay website to complete it.";
c=[{id:a.retry,text:"Try again"},{id:a.close,text:"Close"}];
d=1;
break;
case ErrorCodes.COMMERCE_E_INSUFFICIENT_BALANCE:
e="Your Microsoft account balance is too low";
b="In order to complete this purchase, you need to add a payment method to your Microsoft account in the Windows Store.";
c=[{id:a.pcs,text:"Add payment method"},{id:a.cancel,text:"Cancel"}];
d=1;
break;
case ErrorCodes.COMMERCE_E_STORED_VALUE_EXCEEDED_CHARGE_LIMIT:
e="Your purchase couldn’t be completed";
b="You’ve reached the maximum amount of money you can spend using your Microsoft account balance.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.ERROR_ACCESS_DENIED:
b="Access denied";
c=[{id:a.retry,text:"Try again"},{id:a.cancel,text:"Cancel"}];
d=1;
break;
case ErrorCodes.ERROR_WINHTTP_TIMEOUT_HR:
case ErrorCodes.ERROR_WINHTTP_TIMEOUT:
b="Request timed out";
c=[{id:a.retry,text:"Try again"},{id:a.cancel,text:"Cancel"}];
break;
case ErrorCodes.ERROR_PACKAGES_IN_USE:
b="Your app couldn’t be installed. Close all open apps and try again.";
c=[{id:a.retry,text:"Try again"},{id:a.cancel,text:"Cancel"}];
break;
case ErrorCodes.COMMERCE_E_NO_CTP_ACCOUNT:
case ErrorCodes.COMMERCE_E_NO_DEFAULT_PI:
WinStore.PDP.initiatePcsFlow();
break;
case ErrorCodes.WU_E_NO_UPDATE:
b="Sorry, this app can’t be installed. Your PC might not meet the minimum system requirements or might be out of date. Check Windows Update to make sure you have the latest updates installed.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.WU_E_NOT_APPLICABLE:
b="Sorry, this app can’t be installed because your PC might not meet some of the requirements. Go to the app’s description page to check for any requirements listed under Details.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.WU_E_UNEXPECTED:
b="This app isn’t available right now. Please try again later.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.WU_E_INSTALL_NOT_ALLOWED:
e="Restart your PC";
b="Windows is installing updates right now, please try again in a few minutes.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.ERROR_INSTALL_OUT_OF_DISK_SPACE:
case ErrorCodes.ERROR_DISK_FULL:
case ErrorCodes.HR_DISK_FULL:
b="Your PC doesn’t have enough space to install this app. Make more space available on your drive and try again.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.COMMERCE_E_APP_NOT_AVAILABLE:
e="This item is no longer available.";
b="Sorry, this item has been removed and is no longer available for purchase from the Windows Store.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.COMMERCE_E_AGE_GATED:
e="You’re not allowed to install this app.";
b="You’re not old enough to install this app based on the age rating.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.COMMERCE_E_FREE_ONLY:
e="Your purchase can’t be completed";
b="Sorry, you can’t buy this item because you’re in a country or region that doesn’t support purchases in the Windows Store.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.ERROR_TIMEOUT:
e="Your purchase couldn’t be completed";
b="This app can’t be purchased because your current Internet connection is slow.  Please try again using a different connection.";
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.COMMERCE_E_INVALID_TOKEN:
if(WinStore.PDP._tokenData.inAppOfferToken=="")
{
e="Unable to install app";
b="The code you’re trying to use to get this app doesn’t work. This might be because the code has already been used or is no longer valid."
}
else
{
e="Unable to install item";
b="The code you’re trying to use to get this item doesn’t work. This might be because the code has already been used or is no longer valid."
}
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.COMMERCE_E_ALREADY_PURCHASED:
if(WinStore.PDP._tokenData.inAppOfferToken=="")
{
e="You already own this app";
b="If this app isn’t installed on your PC yet, you can install it from the app’s description page or from the Your apps list."
}
else
{
e="You already own this item";
b="This item can’t be installed because you already own it."
}
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.COMMERCE_E_NO_LICENSE:
e="Install the full version of the app";
b="Before you can install any items you need to install the full version of %1".replace("%1",WinStore.PDP._extendedMetadata.Name);
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.COMMERCE_INAPP_TOKEN_REDEEMED:
e="Thank you";
b="This item will be available the next time you use %1 ".replace("%1",WinStore.PDP._extendedMetadata.Name);
c=[{id:a.close,text:"Close"}];
d=0;
break;
case ErrorCodes.WU_E_DM_DOWNLOADLIMITEDBYUPDATESIZE:
e="Install Error";
b="You can’t download this app using a mobile broadband or metered Internet connection. Use a Wi-Fi or Ethernet Internet connection to continue downloading.";
c=[{id:a.retry,text:"Try again"},{id:a.cancel,text:"Cancel"}];
d=1;
break;
case ErrorCodes.BG_E_BLOCKED_BY_COST_TRANSFER_POLICY:
e="About your Internet connection";
b="You’re using mobile broadband or a metered Internet connection to download this app. This might result in additional charges to your data plan.";
c=[{id:a.retry,text:"Continue"},{id:a.cancel,text:"Cancel"}];
d=1;
break;
case ErrorCodes.WININET_E_CANNOT_CONNECT:
case ErrorCodes.WININET_E_NAME_NOT_RESOLVED:
case ErrorCodes.ERROR_NETWORK_UNREACHABLE:
case ErrorCodes.HTTP_E_STATUS_BAD_REQUEST:
case ErrorCodes.WININET_E_CONNECTION_ABORTED:
e="Check your network connection";
b="To complete your purchase, make sure you're connected and try again. Error code: %1".replace("%1","0x"+f.code.toString(16));
c=[{id:a.retry,text:"Try again"},{id:a.cancel,text:"Cancel"}];
d=1;
break;
default:
e="Your purchase couldn’t be completed";
b="Something happened and your purchase can’t be completed.  Error code: %1".replace("%1","0x"+f.code.toString(16));
c=[{id:a.retry,text:"Try again"},{id:a.cancel,text:"Cancel"}];
d=1
}
if(b)
{
WinStore.PDP._inAcquisition=false;
WinStore.PDP._blockNavigate=false;
WinStore.Frame.toggleNavigationUI(false);
WinStore.PDP.showAcquisitionUI(false);
WinStore.PDP.updateMainSectionUI(true);
om.showMessageDialog(b,e,c,d,function(b)
{
switch(b)
{
case a.cancel:
default:
om.clearAuthenticatedAppId();
break;
case a.close:
break;
case a.retry:
WinStore.PDP.doAutoPurchase(null,false);
break;
case a.refresh:
WinStore.PDP.refresh(g);
break;
case a.pcs:
WinStore.PDP.initiatePcsFlow();
break;
case a.pref:
om.showSettingsPage("preferences")
}
})
}
},showAcquisitionUI:function(a)
{
try
{
om.logInfoMessage("PDP: showAcquisitionUI called with inAcquisition = "+(a?"true":"false"));
!WinStore.PDP._onDataLoaded&&
WinStore.Frame.enableBackButton(!a,true);
WinStore.Frame.showPurchaseProgress(a);
WinStore.PDP.enableElement("pdpTaxonomyCategory",!a);
WinStore.PDP.enableElement("pdpTermsOfUseLink",!a);
WinStore.PDP.enableElement("pdpDeveloperWebsiteLink",!a);
WinStore.PDP.enableElement("pdpDeveloperSupportSiteLink",!a);
var g=document.getElementById("pdpDeveloperPrivacyLink");
g&&
WinStore.PDP.enableElement(g,!a);
var e=document.getElementById("pdpGamesRatingsTextLink");
e&&
WinStore.PDP.enableElement(e,!a);
var f=document.getElementById("pdpPostAcquisitionDeveloperApps"),
c=document.getElementById("pdpPostAcquisitionDeveloperAppsCaption"),
h=document.getElementById("pdpPostAcquisitionSimilarApps"),
d=document.getElementById("pdpPostAcquisitionSimilarAppsCaption");
if(f&&f.style.display!=="none"&&c)
WinStore.Utilities.setActive(c);
else
h&&h.style.display!=="none"&&d&&
WinStore.Utilities.setActive(d)
}
catch(b)
{
om.logErrorMessage("PDP: showAcquisitionUI exception "+b.name+" = "+b.message)
}
},handleResumePurchase:function()
{
om.removeCurrentPageFromTravelLog();
var a=WinStore.PDP._parameters._resumePurchase,
b=function()
{
var b=WinStore.Utilities.getUrlParam(WinStore.PDP._urlParams,"accountid"),
c=WinStore.Utilities.getUrlParam(WinStore.PDP._urlParams,"piid"),
a={appId:WinStore.PDP._extendedMetadata.Id,ps:10,code:0};
WinStore.PDP.onPurchaseProgress(a);
om.setupPaymentAccount(b,c,"Paid",function(a)
{
if(a.fSuccess)
WinStore.PDP.doAutoPurchase(null,false);
else
{
om.logErrorMessage("PDP: handleResumePurchase payment account creation error: "+a.code);
var b={code:a.code};
WinStore.PDP.onPurchaseErrors(b)
}
})
};
if(a==="pisetup")
b();
else
if(a==="3dsauth")
WinStore.PDP.doAutoPurchase(WinStore.Utilities.getUrlParam(WinStore.PDP._urlParams,"3ds"),true);
else
if(a==="pisetup_redirect")
{
var c=[{id:0,text:"Confirm"},{id:1,text:"Cancel"}];
om.showMessageDialog("The payment method for your account was updated. You can now complete your purchase.","Confirm your purchase",c,1,function(a)
{
a===0&&
b()
})
}
else
om.logErrorMessage("PDP: handleResumePurchase invalid resume flag = "+a)
},handleResumeAsyncPurchase:function()
{
if(!WinStore.PDP.doesUserOwnFullLicense())
try
{
var a=WinStore.PDP._extendedMetadata,
d=WinStore.PDP._parameters._pid,
e=WinStore.PDP._purchaseTransactionId,
c=WinStore.PDP._extendedMetadata.PackageFamilyName;
if(a&&d&&e&&c)
{
WinStore.PDP.enableElement("pdpBuyButton",false);
WinStore.PDP.enableElement("pdpTryButton",false);
WinStore.PDP._blockNavigate=true;
WinStore.Frame.toggleNavigationUI(true);
WinStore.PDP._inAcquisition=true;
om.resumeAsyncPurchase(d,a.Name,a.UpdateId,a.AppLanguage,a.RawPrice,e,c)
}
else
om.logErrorMessage("PDP: handleResumeAsyncPurchase failed with null appInfo or pid or tid or pfn")
}
catch(b)
{
om.logErrorMessage("PDP: handleResumeAsyncPurchase exception "+b.name+": "+b.message)
}
},doAutoPurchase:function(d,e)
{
try
{
var a=WinStore.PDP._extendedMetadata,
b=WinStore.PDP._parameters._pid;
if(a&&b)
{
WinStore.PDP._blockNavigate=true;
WinStore.PDP._inAcquisition=true;
WinStore.Frame.toggleNavigationUI(true);
WinStore.PDP.enableElement("pdpBuyButton",false);
WinStore.PDP.enableElement("pdpTryButton",false);
WinStore.PDP.getAppState(true);
WinStore.PDP.animateMainSectionUI();
WinStore.PDP.showAcquisitionUI(true);
if(e)
om.resumePurchase(b,a.Name,a.UpdateId,a.AppLanguage,a.RawPrice,WinStore.PDP._acquiringTrial?PT.trial:a.FreeApp?PT.free:PT.paid,d);
else
if(WinStore.PDP._isToken)
om.redeemToken(WinStore.PDP._tokenData.tokenId,WinStore.PDP._tokenData.appGuid,a.Name,WinStore.PDP._tokenData.inAppOfferToken,a.UpdateId,a.AppLanguage,a.RawPrice);
else
om.purchase(b,a.Name,a.UpdateId,a.AppLanguage,a.RawPrice,WinStore.PDP._acquiringTrial?PT.trial:a.FreeApp?PT.free:PT.paid,false)
}
else
om.logErrorMessage("PDP: doAutoPurchase failed with null appInfo or pid")
}
catch(c)
{
om.logErrorMessage("PDP: doAutoPurchase exception "+c.name+": "+c.message)
}
},initiatePcsFlow:function()
{
om.getPCSDetails(function(a)
{
if(a.fIsPCSSupported)
if(a.fIsRedirect)
if(a.fIsAsyncPurchase)
{
om.logInfoMessage("PDP: initiatePcsFlow - calling launchPcsFlow");
om.launchPcsFlow(a.pcsUrl)
}
else
{
om.logInfoMessage("PDP: initiatePcsFlow - displaying redirect dialog first");
var b=[{id:0,text:"Yes"},{id:1,text:"No"}];
om.showMessageDialog("Your web browser will open.","Do you want to continue to this website?",b,1,function(b)
{
b===0&&
om.launchPcsFlow(a.pcsUrl)
})
}
else
om.showPCS("pdp_app_purchase");
else
om.showPCS("pdp_app_purchase")
})
},onDesktopAppPurchaseClick:function()
{
om.logInfoMessage("PDP: onDesktopAppPurchaseClick");
var a=WinStore.PDP._extendedMetadata;
if(a)
if(WinStore.Utilities.isDesktopApp(a))
{
var b={"App.Id":WinStore.PDP._biData["App.Id"]};
WinStore.PDP.addOptionalBIValues(b);
WinStore.BI.logCustomBI("AppGetDesktopApp",b)
}
return true
},showRemediationDialog:function()
{
if(!WinStore.PDP._inRemediation)
{
om.logWarningMessage("PDP: showRemediationDialog called when not in remediation");
return
}
var b=WinStore.PDP._extendedMetadata;
if(!b)
{
om.logWarningMessage("PDP: showRemediationDialog called with no app info");
return
}
om.logInfoMessage("PDP: showRemediationDialog called with remediation state = "+WinStore.PDP._remediationData.remediationState+" ("+WinStore.Utilities.enumToString(RemediationCodes,WinStore.PDP._remediationData.remediationState)+") and app state = "+WinStore.PDP._remediationData.appxState+" ("+WinStore.Utilities.enumToString(PackageState,WinStore.PDP._remediationData.appxState)+")");
var a=null,
d=null,
c=-1,
e=false;
switch(WinStore.PDP._remediationData.remediationState)
{
case RemediationCodes.WS_REMEDIATION_APPSTORE_PURCHASE_FULL:
setPDPButtonsForGivenLicenseState("EXPIRED_TRIAL",true);
break;
case RemediationCodes.WS_REMEDIATION_APPSTORE_SYNC_LICENSE_INCR:
case RemediationCodes.WS_REMEDIATION_APPSTORE_SYNC_LICENSE_FULL:
a="There’s a problem with %1. Windows Store can try to repair the app for you.".replace("%1",b.Name);
d=[{id:WinStore.PDP._remediationData.remediationState,text:"Repair"},{id:-1,text:"Cancel"}];
c=1;
break;
case RemediationCodes.WS_REMEDIATION_APPSTORE_REINSTALL:
d=[{id:RemediationCodes.WS_REMEDIATION_APPSTORE_REINSTALL,text:"Repair"},{id:-1,text:"Cancel"}];
c=1;
if(WinStore.PDP.isUserLicenseValid())
if(WinStore.PDP._remediationData.appxState==PackageState.PACKAGESTATE_TAMPERED)
{
e=true;
om.getAVVendorName(function(e)
{
om.logInfoMessage("PDP: showRemediationDialog om.getAVVendorName callback returned '"+e+"'");
if(e)
a="There’s a problem with %1. %2 found a problem with this app. Windows Store can try to repair the app for you.".replace("%1",b.Name).replace("%2",e);
else
a="There’s a problem with %1. Windows Store can try to repair the app for you.".replace("%1",b.Name);
om.showMessageDialog(a,"This app needs to be repaired",d,c,WinStore.PDP.onRemediationDialogClosed)
})
}
else
a="There’s a problem with %1. Windows Store can try to repair the app for you.".replace("%1",b.Name);
else
{
a="There’s a problem with %1. Please reinstall the app.".replace("%1",b.Name);
d=[{id:-1,text:"Close"}];
c=0;
WinStore.PDP._inRemediation=false
}
}
a!==null&&!e&&
om.showMessageDialog(a,"This app needs to be repaired",d,c,WinStore.PDP.onRemediationDialogClosed)
},isUserLicenseValid:function()
{
var a=false;
if(WinStore.PDP._licenseInstallData&&WinStore.PDP._licenseInstallData.UserLicense)
{
var b=WinStore.PDP._licenseInstallData.UserLicense.toString();
if(b==="FULL"||b==="VALID_TRIAL")
a=true
}
return a
},doesUserOwnFullLicense:function()
{
var a=false;
if(WinStore.PDP._licenseInstallData&&WinStore.PDP._licenseInstallData.UserLicense)
{
var b=WinStore.PDP._licenseInstallData.UserLicense.toString();
if(b==="FULL")
a=true
}
return a
},onRemediationDialogClosed:function(a)
{
switch(a)
{
case RemediationCodes.WS_REMEDIATION_APPSTORE_SYNC_LICENSE_INCR:
WinStore.PDP.callSyncLicenses(false);
break;
case RemediationCodes.WS_REMEDIATION_APPSTORE_SYNC_LICENSE_FULL:
WinStore.PDP.callSyncLicenses(true);
break;
case RemediationCodes.WS_REMEDIATION_APPSTORE_REINSTALL:
WinStore.PDP.reinstallApp()
}
},callSyncLicenses:function(a)
{
try
{
WinStore.PDP.showAcquisitionUI(true);
WinStore.PDP.setPurchaseProgressText("Syncing app licenses…");
om.logInfoMessage("PDP: callSyncLicenses bSyncAll = "+a);
om.syncLicenses(a,WinStore.PDP.onsyncLicensesFromRemediationComplete)
}
catch(b)
{
om.logErrorMessage("PDP: callSyncLicenses fast fail, err = "+b.description);
WinStore.PDP.onsyncLicensesFromRemediationComplete(false)
}
},onsyncLicensesFromRemediationComplete:function(a)
{
om.logInfoMessage("PDP: onsyncLicensesFromRemediationComplete, succeeded = "+a);
WinStore.PDP.showAcquisitionUI(false);
WinStore.PDP._inRemediation=false
},reinstallApp:function()
{
var b="",
d=false,
e=WinStore.PDP._licenseInstallData;
if(e)
{
b=e.UserLicense.toString();
if(b==="FULL"||b==="VALID_TRIAL")
d=true
}
if(d)
{
var a=WinStore.PDP._extendedMetadata;
if(a)
{
WinStore.PDP.showAcquisitionUI(true);
try
{
om.purchase(WinStore.PDP._parameters._pid,a.Name,a.UpdateId,a.AppLanguage,a.RawPrice,b==="VALID_TRIAL"?PT.trial:a.FreeApp?PT.free:PT.paid,true)
}
catch(c)
{
om.logErrorMessage("PDP: reinstallApp purchase exception "+c.name+": "+c.message)
}
}
}
},showTokenDialog:function()
{
var a=null,
b=null,
c=null,
d=false,
e=WinStore.PDP._extendedMetadata;
if(e&&WinStore.PDP._isToken)
{
if(WinStore.PDP._parentalControlsOK)
if(WinStore.PDP._tokenData.inAppOfferToken=="")
{
a="Do you want to install this app for free?\nApp: %1 ".replace("%1",e.Name);
c="Install App ";
b=[{id:0,text:"Install "},{id:1,text:"Cancel"}]
}
else
if(WinStore.PDP._tokenData.loadedInAppData)
{
a="Do you want to install this item for free?\nFor app: %1\nItem: %2 ".replace("%1",e.Name);
a=a.replace("%2",WinStore.PDP._tokenData.inAppTitle);
c="Install item";
b=[{id:0,text:"Install"},{id:1,text:"Cancel"}]
}
else
om.getInAppInfo(WinStore.PDP._tokenData.appGuid,WinStore.PDP.onGetInAppInfo);
else
if(WinStore.PDP._tokenData.inAppOfferToken=="")
{
a="Before you can install this app, a parent needs to change Family Safety settings for your account";
c="Ask a parent for help";
b=[{id:0,text:"Close"}]
}
else
{
a="Before you can install this item, a parent needs to change Family Safety settings for your account";
c="Ask a parent for help";
b=[{id:0,text:"Close"}];
d=true;
om.showMessageDialog(a,c,b,1,function()
{
WinStore.PDP.onTokenRedeemCancelButton()
})
}
if(a!==null&&!d)
{
d=true;
om.showMessageDialog(a,c,b,1,function(a)
{
if(a==0)
WinStore.PDP.onTokenRedeemButton();
else
WinStore.PDP.onTokenRedeemCancelButton()
})
}
}
},startPIAttach:function()
{
om.logInfoMessage("PIAttach: WinStore.PDP.startPIAttach");
var a=function(a)
{
a&&
om.logInfoMessage("PIAttach: WinStore.PDP.startPIAttach (success:"+a.success+" errorCode:"+a.errorCode+" location:"+a.location+")")
};
om.startPIAttach(a)
},continuePIAttach:function()
{
var a=WinStore.PDP._piAttachData.accountId,
b=WinStore.PDP._piAttachData.piid;
om.logInfoMessage("PIAttach: WinStore.PDP.continuePIAttach accountId:"+a+" piid: "+b);
var c=function(a)
{
a&&
om.logInfoMessage("PIAttach: WinStore.PDP.continuePIAttach (success:"+a.success+" errorCode:"+a.errorCode+" location:"+a.location+")")
};
om.continuePIAttachFromPCS(c,a,b)
},onGetInAppInfo:function(a)
{
WinStore.PDP._tokenData.loadedInAppData=true;
WinStore.PDP._inAppData=a;
WinStore.PDP.getInAppTitleForToken()
},getInAppTitleForToken:function()
{
var a=0;
for(var d in WinStore.PDP._inAppData)
{
var c=WinStore.PDP._inAppData[a].id;
if(c.toLowerCase()==WinStore.PDP._tokenData.inAppOfferToken.toLowerCase())
{
var b=WinStore.PDP._inAppData[a].title;
WinStore.PDP._tokenData.inAppTitle=b
}
a++
}
WinStore.PDP.showTokenDialog()
},onTokenRedeemCancelButton:function()
{
WinStore.PDP.clearTokenValues()
},clearTokenValues:function()
{
if(WinStore.PDP._isToken)
{
om.updateTravelLogCurrentPageParams("?pid="+WinStore.PDP._tokenData.appGuid);
WinStore.PDP._urlParams="?pid="+WinStore.PDP._tokenData.appGuid;
WinStore.PDP._isToken=false;
WinStore.PDP._tokenData.appGuid="";
WinStore.PDP._tokenData.tokenId="";
WinStore.PDP._tokenData.inAppOfferToken="";
WinStore.PDP._tokenData.inAppTitle="";
WinStore.PDP._tokenData.loadedInAppData=false
}
},onTokenRedeemButton:function()
{
om.updateTravelLogCurrentPageParams("?pid="+WinStore.PDP._tokenData.appGuid);
var d=WinStore.PDP._tokenData.tokenId,
c=WinStore.PDP._tokenData.appGuid,
b=WinStore.PDP._tokenData.inAppOfferToken,
a=WinStore.PDP._extendedMetadata;
if(a)
{
WinStore.PDP._inAcquisition=true;
WinStore.PDP._blockNavigate=true;
WinStore.PDP._acquiringTrial=false;
WinStore.Frame.toggleNavigationUI(true);
WinStore.PDP.enableElement("pdpBuyButton",false);
WinStore.PDP.enableElement("pdpTryButton",false);
WinStore.PDP.displayConfirmPurchaseWarning(false);
WinStore.PDP.getAppState(true);
WinStore.PDP.animateMainSectionUI();
WinStore.PDP.showAcquisitionUI(true);
om.logInfoMessage("PDP: onTokenRedeemButton with tokenId: "+WinStore.PDP._tokenData.tokenId);
om.etwPDPAcquisitionProgressStart(WinStore.PDP._extendedMetadata.Id,"buy",WinStore.PDP._extendedMetadata.FreeApp?"free":"paid",1);
om.redeemToken(d,c,a.Name,b,a.UpdateId,a.AppLanguage,a.RawPrice)
}
},_appProblemJustReported:{value:false,writable:true},setAppProblemReported:function(a)
{
WinStore.PDP._appProblemJustReported=a
},onReportAppProblemClick:function()
{
if(!WinStore.PDP.blockNavigation())
{
WinStore.PDP.startingNavigation();
om.logInfoMessage("PDP: user click on report app problem for '"+WinStore.PDP._parameters._pid+"'");
om.etwRrrDisplaySubmitAppProblemPageStart(WinStore.PDP._parameters._pid);
WinStore.PDP.saveHubPosition();
om.showReportProblemPage("?pid="+WinStore.PDP._parameters._pid);
WinStore.BI.logCustomBI("AppProblemReport",WinStore.PDP._biData)
}
},onRatingAndReviewHeaderClick:function()
{
if(WinStore.PDP._parameters._pid)
{
om.logInfoMessage("PDP: user clicked Ratings and Reviews header; navigating to L2 Rating List page");
om.etwRrrReviewTabClickStart(WinStore.PDP._parameters._pid);
var a={"CList.ID":WinStore.BI.biDataPoint.listId.ratingsAndReview,"App.Id":WinStore.PDP._parameters._pid};
WinStore.PDP.addOptionalBIValues(a);
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.clientListTitle,a);
WinStore.PDP.saveHubPosition();
om.showReviewListPage(WinStore.PDP._parameters._pid)
}
},_reviewJustPosted:{value:false,writable:true},_ratingJustPosted:{value:false,writable:true},setReviewPosted:function(a)
{
WinStore.PDP._reviewJustPosted=a
},setRatingPosted:function(a)
{
WinStore.PDP._ratingJustPosted=a
},onUserRatingChanged:function(f)
{
var d=parseInt(f.detail.tentativeRating);
if(d>0)
{
WinStore.PDP._userReviewData.UserRating=d;
var e=false,
c=WinStore.PDP._licenseInstallData;
if(c)
if(c.UserLicense.toString()==="VALID_TRIAL"||c.UserLicense.toString()==="EXPIRED_TRIAL")
e=true;
var b=WinStore.PDP._userReviewData,
a=WinStore.PDP._extendedMetadata;
om.submitRating(WinStore.PDP._parameters._pid,a.PackageFamilyName,WinStore.Utilities.encodeCDATA(b.UserReviewTitle?b.UserReviewTitle:""),WinStore.Utilities.encodeCDATA(b.UserReviewComments?b.UserReviewComments:""),b.UserRating,a.Version?a.Version:"",a.MinOsVersion?a.MinOsVersion:"",e);
WinStore.PDP.setRatingPosted(true);
WinStore.PDP.refreshRatingReviewAreaInMainHub();
WinStore.BI.refreshSigninState();
WinStore.BI.logCustomBI("AppRating",WinStore.PDP._biData)
}
},onWriteReviewClick:function()
{
WinStore.PDP.startingNavigation();
om.etwRrrDisplaySubmitReviewPageStart(WinStore.PDP._parameters._pid,document.getElementById("pdpReviewThisAppCaption").innerText);
om.showReviewPage(WinStore.PDP._parameters._pid)
},getCurrentAppExtendedMetadata:function()
{
return WinStore.PDP._extendedMetadata
},getCurrentAppLicenseData:function()
{
return WinStore.PDP._licenseInstallData
},getCurrentUserReviewData:function()
{
return WinStore.PDP._userReviewData
},getCurrentRatingData:function()
{
return WinStore.PDP._ratingData
},getIsInAcquisition:function()
{
return WinStore.PDP._inAcquisition
},showFullScreenScreenshots:function()
{
om.logInfoMessage("PDP: showFullScreenScreenshots showing enlarged screenshots");
var d=WinStore.PDP.getPDPElementById("wsFrame","showFullScreenScreenshots"),
a=WinStore.PDP.getPDPElementById("pdpFullScreenFlyout","showFullScreenScreenshots"),
c=WinStore.PDP.getPDPElementById("pdpFullScreenFlyoutContent","showFullScreenScreenshots");
if(d&&a&&c)
{
WinStore.PDP.createThumbnailFlipper(c,WinStore.PDP._extendedMetadata.Screenshots);
WinStore.PDP._fullScreenFlyout=a.winControl;
if(WinStore.PDP._fullScreenFlyout===null||WinStore.PDP._fullScreenFlyout===undefined)
{
WinJS.UI.process(a);
WinStore.PDP._fullScreenFlyout=a.winControl
}
if(WinStore.PDP._fullScreenFlyout)
{
WinStore.PDP._fullScreenFlyout.addEventListener("beforehide",WinStore.PDP.onHideFullScreenScreenshots);
WinStore.PDP._fullScreenFlyout.addEventListener("aftershow",WinStore.PDP.onShowFullScreenScreenshots);
WinStore.PDP._fullScreenFlyout.show(d,"top","left");
var b={"App.Id":WinStore.PDP._biData["App.Id"],"App.ReleaseGUID":WinStore.PDP._biData["App.ReleaseGUID"],"screenshot.Pos":0};
WinStore.PDP.addOptionalBIValues(b);
if(WinStore.PDP._flipper)
b["screenshot.Pos"]=WinStore.PDP._flipper.currentPage.toString();
WinStore.BI.fireClickEvent("pdpFullScreen",b)
}
else
om.logErrorMessage("PDP: showFullScreenScreenshots unable to create flyout")
}
else
om.logErrorMessage("PDP: showFullScreenScreenshots couldn't find required elements")
},hideFullScreenScreenshots:function()
{
if(WinStore.PDP._fullScreenFlyout)
{
WinStore.PDP._fullScreenFlyout.hide();
WinStore.PDP._fullScreenFlyout=null
}
},onHideFullScreenScreenshots:function()
{
WinStore.PDP._fullScreenFlyout.removeEventListener("beforehide",WinStore.PDP.onHideFullScreenScreenshots);
if(WinStore.PDP._flipper&&WinStore.PDP._fullScreenFlipper)
WinStore.PDP._flipper.currentPage=WinStore.PDP._fullScreenFlipper.currentPage
},onShowFullScreenScreenshots:function()
{
var a=document.documentElement.querySelector("#pdpFullScreenFlyout .pdpFullScreenClose"),
e=document.getElementById("pdpFullScreenScreenshotsContent");
if(a)
{
if(e)
{
var c=a.getBoundingClientRect().left,
b=e.getBoundingClientRect().right;
if(c-10<b)
{
var g=a.getBoundingClientRect().right,
f=document.documentElement.clientWidth,
d=(f-b)/2-(g-c)/2;
a.style.top=d+"px";
a.style.right=d+"px"
}
}
a.style.visibility="visible"
}
WinStore.PDP._fullScreenFlyout.removeEventListener("aftershow",WinStore.PDP.onShowFullScreenScreenshots)
},createThumbnailFlipper:function(t,c)
{
var g=WinStore.PDP.getPDPElementById("pdpFullScreenSnapshots","createThumbnailFlipper"),
f=WinStore.PDP.getPDPElementById("pdpFullScreenThumbnails","createThumbnailFlipper"),
m=WinStore.PDP.getPDPElementById("pdpFullScreenScreenshotsContent","createThumbnailFlipper"),
i=WinStore.PDP.getPDPElementById("pdpFullScreenFlyoutContent","createThumbnailFlipper");
if(g&&f&&m&&i)
{
var e=c.length>1;
WinJS.Utilities.addClass(i,e?"pdpFullScreenFlyoutContentMultiple":"pdpFullScreenFlyoutContentOne");
WinJS.Utilities.removeClass(i,e?"pdpFullScreenFlyoutContentOne":"pdpFullScreenFlyoutContentMultiple");
WinJS.Utilities.addClass(m,e?"pdpFullScreenScreenshotsContentMultiple":"pdpFullScreenScreenshotsContentOne");
WinJS.Utilities.removeClass(m,e?"pdpFullScreenScreenshotsContentOne":"pdpFullScreenScreenshotsContentMultiple");
WinJS.Utilities.addClass(g,e?"pdpFullScreenSnapshotsMultiple":"pdpFullScreenSnapshotsOne");
WinJS.Utilities.removeClass(g,e?"pdpFullScreenSnapshotsOne":"pdpFullScreenSnapshotsMultiple");
while(f.firstChild)
f.removeChild(f.firstChild);
for(var q=[],
p=[],
d=0;d<c.length;d++)
{
var b=c[d],
o=b.url.replace("/1x/","/1.8x/");
om.logVerboseMessage("PDP: createThumbnailFlipper adding screenshot '"+b.caption+"' with URL = "+o);
var n=document.createElement("div");
n.className="pdpScreenSnapshot";
var l=document.createElement("img");
l.src=o;
l.alt=b.altText;
l.ondragstart=function()
{
return false
};
n.appendChild(l);
p.push(n);
q.push({index:d});
if(c.length>1)
{
var j=document.createElement("div");
j.className="pdpFullScreenThumbnail";
j.id="pdpFullScreenThumbnail"+d;
var h=document.createElement("img");
h.src=o;
h.alt=b.altText;
h.setAttribute("thumbnailId",d);
h.ondragstart=function()
{
return false
};
j.appendChild(h);
var a=document.createElement("div");
a.className="pdpFullScreenThumbnailBorder";
a.setAttribute("thumbnailId",d);
a.setAttribute("role","option");
a.setAttribute("tabindex","0");
a.setAttribute("aria-label","Selected screenshot\n"+b.altText);
a.addEventListener("click",WinStore.PDP.onFullScreenThumbnailClick,false);
j.appendChild(a);
f.appendChild(j)
}
}
WinStore.PDP._fullScreenFlipper=new WinJS.UI.FlipView(g,{itemDataSource:(new WinJS.Binding.List(q)).dataSource,itemTemplate:function(a)
{
return a.then(function(a)
{
return p[a.data.index]
})
},orientation:"vertical"});
if(f&&c.length>1)
{
i.setAttribute("aria-hidden","true");
WinStore.PDP._fullScreenFlipper.addEventListener("pagecompleted",function()
{
for(var a=g.querySelectorAll("[tabindex='0']"),
c=a?a.length:0,
b=0;b<c;++b)
a[b].setAttribute("tabindex",-1)
},false)
}
else
if(c.length===1)
{
i.removeAttribute("aria-hidden");
WinStore.PDP.updateFullScreenScreenshotCaption(0);
var b=g.querySelector(".win-template");
b&&
b.setAttribute("aria-label","Screenshot\n"+c[0].altText)
}
var k=WinStore.PDP._extendedMetadata;
if(k)
{
WinStore.PDP.getPDPElementById("pdpFullScreenCaption","setScreenshots").style.color=k.ForegroundColor==="light"?"#ffffff":WinStore.Utilities.textDarkColor;
WinStore.PDP.getPDPElementById("pdpFullScreenSnapshots","setScreenshots").style.backgroundColor=k.BackgroundColor;
WinStore.PDP.getPDPElementById("pdpFullScreenCaptionContainer","setScreenshots").style.backgroundColor=k.BackgroundColor
}
if(WinStore.PDP._flipper)
WinStore.PDP._fullScreenFlipper.currentPage=WinStore.PDP._flipper.currentPage;
function r()
{
WinStore.PDP.fireFlipViewtNavClick("pdpFlipViewFullScreenNav","UP")
}
function s()
{
WinStore.PDP.fireFlipViewtNavClick("pdpFlipViewFullScreenNav","DW")
}
WinStore.PDP._fullScreenFlipper._prevButton.addEventListener("click",r,false);
WinStore.PDP._fullScreenFlipper._nextButton.addEventListener("click",s,false);
WinStore.PDP.onFullScreenFlipperPageSelected(false);
WinStore.PDP._fullScreenFlipper.addEventListener("pagevisibilitychanged",function(a)
{
!a.detail.visible&&
WinStore.PDP.onFullScreenFlipperPageSelected(true)
},false)
}
else
om.logErrorMessage("PDP: createThumbnailFlipper couldn't get element for flipper or thumbnails")
},onFullScreenFlipperPageSelected:function(b)
{
var a=WinStore.PDP._extendedMetadata;
if(a&&a.Screenshots&&a.Screenshots.length>1)
{
if(b)
{
var c=WinStore.PDP._flipper.currentPage.toString();
om.etwPDPScreenShot(WinStore.PDP._parameters._pid,c)
}
WinStore.PDP.updateFullScreenFlipperIndicator()
}
},updateFullScreenFlipperIndicator:function()
{
var a=WinStore.PDP._extendedMetadata;
if(a&&a.Screenshots&&a.Screenshots.length>1&&WinStore.PDP._fullScreenFlipper)
{
var b=WinStore.PDP._fullScreenFlipper.currentPage;
if(b>=0&&b<a.Screenshots.length)
{
for(var c=0;c<a.Screenshots.length;c++)
{
var d=WinStore.PDP.getPDPElementById("pdpFullScreenThumbnail"+c,"updateFullScreeFlipperIndicator");
if(d)
if(c===b)
WinJS.Utilities.addClass(d,"pdpSelectedThumbnail");
else
WinJS.Utilities.removeClass(d,"pdpSelectedThumbnail")
}
WinStore.PDP.updateFullScreenScreenshotCaption(b)
}
}
},updateFullScreenScreenshotCaption:function(c)
{
var b=WinStore.PDP._extendedMetadata;
if(b&&b.Screenshots)
{
var a=WinStore.PDP.getPDPElementById("pdpFullScreenCaption","updateFullScreenScreenshotCaption");
WinJS.UI.Animation.fadeOut(a).done(function()
{
a.innerText=b.Screenshots[c].caption;
WinJS.UI.Animation.fadeIn(a).done(function()
{
WinStore.PDP.updateTooltip(a)
})
})
}
},onFullScreenThumbnailClick:function(b)
{
if(b&&b.target)
{
var a=b.target.getAttribute("thumbnailId");
if(a!==null&&a!==undefined)
{
om.logInfoMessage("PDP: onFullScreenThumbnailClick("+a+")");
if(WinStore.PDP._fullScreenFlipper)
{
WinStore.PDP._fullScreenFlipper.currentPage=a;
var c={"App.Id":WinStore.PDP._biData["App.Id"],"App.ReleaseGUID":WinStore.PDP._biData["App.ReleaseGUID"],"screenshot.Pos":a};
WinStore.PDP.addOptionalBIValues(c);
WinStore.BI.fireClickEvent("pdpFullScreenFlipView",c)
}
}
b.stopPropagation()
}
},calculateItemHeight:function(d,b,f)
{
var c=-1,
a=d;
if(typeof d==="string")
a=WinStore.PDP.getPDPElementById(d,"calculateItemHeight");
if(a)
{
var k=a.style.display,
j=a.style.visibility;
a.style.visibility="hidden";
a.style.display=f?f:"block";
if(typeof b==="string")
{
a.innerText=b;
c=a.offsetHeight;
a.innerText=""
}
else
if(Array.isArray(b))
{
while(a.hasChildNodes())
a.removeChild(a.firstChild);
for(var e=0;e<b.length;e++)
{
var h=document.createElement("div");
h.innerText=b[e];
a.appendChild(h)
}
c=a.offsetHeight;
while(a.hasChildNodes())
a.removeChild(a.firstChild)
}
else
{
for(var l=a.innerHTML,
g=".",
i=1;i<b;i++)
g+="<br>.";
a.innerHTML=g;
c=a.offsetHeight;
a.innerHTML=l
}
a.style.display=k;
a.style.visibility=j
}
return c
},buildDivList:function(b,a,d)
{
var e=false;
while(a.hasChildNodes())
a.removeChild(a.firstChild);
if(a&&b)
for(var c=0;c<b.length;c++)
{
e=true;
var f=document.createElement(d?d:"div");
f.innerText=b[c];
a.appendChild(f)
}
return e
},setDivContent:function(e,a,f,g)
{
var b=e;
if(typeof e==="string")
b=WinStore.PDP.getPDPElementById(e,"setDivContent");
if(b)
{
var d=false;
if(Array.isArray(a))
{
WinStore.PDP.buildDivList(a,b,g);
d=a.length===0
}
else
{
var c="";
if(a)
if(typeof a==="number")
c=a.toString();
else
c=a;
if(typeof c==="string")
c=c.replace(/<br\s*\/>/g,"\r\n");
b.innerText=c;
d=b.innerText===""
}
d&&
WinStore.PDP.showElement(b,false);
f&&
WinStore.PDP.showElement(f,!d)
}
},getPDPElementById:function(a,b)
{
var c=document.getElementById(a);
if(!c)
if(b)
om.logErrorMessage("PDP: getPDPElementById couldn't find content element for ID = '"+a+"' ["+b+"]");
else
om.logErrorMessage("PDP: getPDPElementById couldn't find content element for ID = '"+a+"'");
return c
},updateTooltip:function(a)
{
if(a)
if(WinStore.Utilities.isOverflowed(a))
a.setAttribute("title",a.innerText);
else
a.removeAttribute("title")
},showElement:function(b,d,c)
{
var a=b;
if(typeof b==="string")
a=WinStore.PDP.getPDPElementById(b,"showElement");
if(a)
try
{
a.style.display=!d?"none":c?c:"block";
a.setAttribute("aria-hidden",(!d).toString());
WinStore.PDP.logPDPDebugMessage("showElement setting element '"+a.id+"' display = '"+a.style.display+"'")
}
catch(e)
{
om.logErrorMessage("PDP: showElement exception for element '"+a.id+"' ("+a.name+" = "+a.message+")");
throw e
}
},setElementVisibility:function(c,b)
{
var a=c;
if(typeof c==="string")
a=WinStore.PDP.getPDPElementById(c,"setElementVisibility");
if(a)
try
{
if(typeof b==="string")
a.style.visibility=b;
else
a.style.visibility=!b?"hidden":"visible";
WinStore.PDP.logPDPDebugMessage("setElementVisibility setting element '"+a.id+"' visibility = '"+a.style.visibility+"'")
}
catch(d)
{
om.logErrorMessage("PDP: setElementVisibility exception for element '"+a.id+"' ("+a.name+" = "+a.message+")");
throw d
}
},enableElement:function(b,c)
{
var a=b;
if(typeof b==="string")
a=WinStore.PDP.getPDPElementById(b,"enableElement");
if(a)
try
{
a.disabled=!c;
WinStore.PDP.logPDPDebugMessage("enableElement "+(c?"enabling":"disabling")+" element '"+a.id+"'")
}
catch(d)
{
om.logErrorMessage("PDP: enableElement exception for element '"+a.id+"' ("+a.name+" = "+a.message+")");
throw d
}
},createLinkTooltip:function(b,d)
{
var a=WinStore.PDP.getPDPElementById(b,"createLinkTooltip");
if(a)
{
var e=new WinJS.UI.Tooltip(a,{}),
c=document.createElement("div");
c.innerText=d;
e.contentElement=c;
WinStore.PDP.logPDPDebugMessage("createLinkTooltip setting tooltip for '"+b+"' to '"+d+"'")
}
},logPDPDebugMessage:function(a)
{
WinStore.PDP._debugVerbose&&
om.logInfoMessage("PDP:    "+a)
}});
window.addEventListener("blur",function()
{
var a=document.getElementById("pdpProgressControl");
a&&
WinJS.Utilities.addClass(a,"paused")
},false);
window.addEventListener("focus",function()
{
var a=document.getElementById("pdpProgressControl");
a&&
WinJS.Utilities.removeClass(a,"paused")
},false);
var pdpHubSections=[{sectionID:"pdpHubSectionMain",sectionHeader:WinStore.PDP.getAppNameHeaderText,displayed:false,refresh:WinStore.PDP.refreshMainSection,reset:WinStore.PDP.resetMainSection,displaying:WinStore.PDP.displayingMainSection,resize:WinStore.PDP.resizeMainSection,isHidden:true},{sectionID:"pdpHubSectionRatingReview",sectionHeader:"Ratings and reviews",displayed:false,canDisplay:WinStore.PDP.canDisplayRatingReviewSection,displaying:WinStore.PDP.displayingRatingReviewSection,refresh:WinStore.PDP.refreshRatingReviewSection,reset:WinStore.PDP.resetRatingReviewSection,headerClick:WinStore.PDP.onRatingAndReviewHeaderClick,resize:WinStore.PDP.resizeReviewSection,isHidden:false},{sectionID:"pdpHubSectionDetails",sectionHeader:"Details",displayed:false,refresh:WinStore.PDP.refreshDetailsSection,reset:WinStore.PDP.resetDetailsSection,displaying:WinStore.PDP.displayingDetailsSection,resize:WinStore.PDP.resizeDetails,isHidden:false},{sectionID:"pdpHubSectionSimilarApps",sectionHeader:"Related apps",displayed:false,canDisplay:WinStore.PDP.canDisplaySimilarApps,refresh:WinStore.PDP.refreshSimilarApps,reset:WinStore.PDP.resetSimilarApps,headerClick:WinStore.PDP.onSimilarHeaderClick,isHidden:false,resize:WinStore.PDP.resizeSimilarApps},{sectionID:"pdpHubSectionAppsByDeveloper",sectionHeader:WinStore.PDP.getDeveloperHeaderText,displayed:false,canDisplay:WinStore.PDP.canDisplayDeveloperApps,refresh:WinStore.PDP.refreshDeveloperApps,reset:WinStore.PDP.resetDeveloperApps,headerClick:WinStore.PDP.onDeveloperHeaderClick,isHidden:false,resize:WinStore.PDP.resizeDeveloperApps}],
translateCapabilitiesLookup={microphone:{sortOrder:13,text:"Your microphone",longtext:"Your microphone, including recording audio"},"2eef81be-33fa-4800-9670-1cd474972c3f":{sortOrder:13,text:"Your microphone",longtext:"Your microphone, including recording audio"},"e5323777-f976-4f5b-9b55-b94699c46e44":{sortOrder:12,text:"Your webcam",longtext:"Your webcam, including taking pictures and recording videos"},webcam:{sortOrder:12,text:"Your webcam",longtext:"Your webcam, including taking pictures and recording videos"},"6ac27878-a6fa-4155-ba85-f98f491d4f33":{sortOrder:99,text:"Your portable devices",longtext:"Your portable devices, like a mobile phone, digital camera, or portable music player"},"dd04d5fc-9d6e-4f76-9dcf-eca6339b7389":{sortOrder:99,text:"Your contacts on a portable device",longtext:"Your contacts on a portable device, like a mobile phone"},"e4dfdbd3-7f04-45e9-9fa1-5ca0eaeb0ae3":{sortOrder:99,text:"Your calendars on a portable device",longtext:"Your calendars on a portable device, like a mobile phone"},"bb340c54-b5c6-491d-8827-28d0e7631903":{sortOrder:99,text:"Your tasks on a portable device",longtext:"Your tasks on a portable device, like a mobile phone"},"5c017aea-e706-4719-8cc0-a303836fd321":{sortOrder:99,text:"Your notes on a portable device",longtext:"Your notes on a portable device, like a mobile phone"},"0b9f1048-b94b-dc9a-4ed7-fe4fed3a0deb":{sortOrder:99,text:"Your status on a portable device",longtext:"Your status on a portable device, like a mobile phone, digital camera, or portable music player"},"d0eace0e-707d-4106-8d38-4f560e6a9f8e":{sortOrder:99,text:"Your ringtones on a portable device",longtext:"Your ringtones on a portable device, like a mobile phone"},"bfa794e4-f964-4fdb-90f6-51056bfe4b44":{sortOrder:11,text:"Your location",longtext:"Your location, which can be based on a GPS sensor in your PC or your network information"},location:{sortOrder:11,text:"Your location",longtext:"Your location, which can be based on a GPS sensor in your PC or your network information"},"95ef18f2-cdde-434c-a159-3c611e1325a2":{sortOrder:5,text:"Your text messaging",longtext:"Your PC’s or connected phones’ text messaging feature, including sending and receiving text messages"},"21157c1f-2651-4cc1-90ca-1f28b02263f6":{sortOrder:5,text:"Your text messaging",longtext:"Your PC’s or connected phones’ text messaging feature, including sending and receiving text messages"},"bfcd56f7-3943-457f-a312-2e19bb6dc648":{sortOrder:99,text:"Your mobile broadband account"},"fb3842cd-9e2a-4f83-8fcc-4b0761139ae9":{sortOrder:14,text:"Your PC’s near field proximity radio",longtext:"Your PC’s near field proximity radio, which can be used alone and with other wireless radios like Bluetooth and Wi-Fi to exchange files and communicate with an app on a nearby device"},sms:{sortOrder:5,text:"Your text messaging",longtext:"Your PC’s or connected phones’ text messaging feature, including sending and receiving text messages"},nearfieldproximity:{sortOrder:14,text:"Your PC’s near field proximity radio",longtext:"Your PC’s near field proximity radio, which can be used alone and with other wireless radios like Bluetooth and Wi-Fi to exchange files and communicate with an app on a nearby device"},proximity:{sortOrder:14,text:"Your PC’s near field proximity radio",longtext:"Your PC’s near field proximity radio, which can be used alone and with other wireless radios like Bluetooth and Wi-Fi to exchange files and communicate with an app on a nearby device"},appx_capability_default_windows_credentials:{sortOrder:1,text:"Your Windows credentials",longtext:"Your Windows credentials used by the app on your behalf to authenticate and provide access to a corporate intranet"},appx_capability_documents_library:{sortOrder:3,text:"Your documents library",longtext:"Your documents library, including adding, changing, or deleting files"},appx_capability_internet_client:{sortOrder:15,text:"Your Internet connection"},appx_capability_internet_client_server:{sortOrder:7,text:"Your Internet connection, including incoming connections from the Internet",longtext:"Your Internet connection, including incoming connections from the Internet–the app can send and receive information through firewalls"},appx_capability_music_library:{sortOrder:10,text:"Your music library",longtext:"Your music library, including adding, changing, or deleting files"},appx_capability_pictures_library:{sortOrder:8,text:"Your pictures library",longtext:"Your pictures library, including adding, changing, or deleting files"},appx_capability_private_network_client_server:{sortOrder:2,text:"Your home or work networks",longtext:"Your home or work networks–the app can communicate with other PCs on the same network"},appx_capability_removable_storage:{sortOrder:6,text:"Removable storage",longtext:"Removable storage, including adding, changing, or deleting files to an external hard drive, USB flash drive, or portable device"},appx_capability_shared_user_certificates:{sortOrder:4,text:"Software and hardware certificates or a smart card",longtext:"Certificates stored on your PC or a smart card to securely access organizations such as banks, government agencies, or your employer"},appx_capability_videos_library:{sortOrder:9,text:"Your videos library",longtext:"Your videos library, including adding, changing, or deleting files"},"6bdd1fc6-810f-11d0-bec7-08002be2092f":{sortOrder:99,text:"Your Scanner",longtext:"Your image scanner, including acquisition of photos and documents"},scanner:{sortOrder:99,text:"Your Scanner",longtext:"Your image scanner, including acquisition of photos and documents"},"2a9fe532-0cdc-44f9-9827-76192f2ca2fb":{sortOrder:99,text:"Magnetic Stripe Reader",longtext:"Your Magnetic Stripe Reader – the app can use your Magnetic Stripe Reader"},magneticstripereader:{sortOrder:99,text:"Magnetic Stripe Reader",longtext:"Your Magnetic Stripe Reader – the app can use your Magnetic Stripe Reader"},"c243ffbd-3afc-45e9-b3d3-2ba18bc7ebc5":{sortOrder:99,text:"Barcode Scanner",longtext:"Your Barcode Scanner – the app can use your Barcode Scanner"},barcodescanner:{sortOrder:99,text:"Barcode Scanner",longtext:"Your Barcode Scanner – the app can use your Barcode Scanner"},"b142fc3e-fa4e-460b-8abc-072b628b3c70":{sortOrder:99,text:"Bluetooth device",longtext:"Your Bluetooth device – the app can use your Bluetooth device"},bluetoothrfcomm:{sortOrder:99,text:"Bluetooth device",longtext:"Your Bluetooth device – the app can use your Bluetooth device"},"bluetooth.rfcomm":{sortOrder:99,text:"Bluetooth device",longtext:"Your Bluetooth device – the app can use your Bluetooth device"},"6e3bb679-4372-40c8-9eaa-4509df260cd8":{sortOrder:99,text:"Bluetooth Smart Device",longtext:"Your Bluetooth Smart device – the app can use your Bluetooth Smart device"},bluetoothgatt:{sortOrder:99,text:"Bluetooth Smart Device",longtext:"Your Bluetooth Smart device – the app can use your Bluetooth Smart device"},"bluetooth.genericattributeprofile":{sortOrder:99,text:"Bluetooth Smart Device",longtext:"Your Bluetooth Smart device – the app can use your Bluetooth Smart device"},"4d1e55b2-f16f-11cf-88cb-001111000030":{sortOrder:99,text:"HID Peripheral",longtext:"Your Human Interaction Device peripheral like a Game Controller"},hid:{sortOrder:99,text:"HID Peripheral",longtext:"Your Human Interaction Device peripheral like a Game Controller"},humaninterfacedevice:{sortOrder:99,text:"HID Peripheral",longtext:"Your Human Interaction Device peripheral like a Game Controller"},"dee824ef-729b-4a0e-9c14-b7117d33a817":{sortOrder:99,text:"USB Peripheral",longtext:"Your USB peripheral - like a fitness device"},winusb:{sortOrder:99,text:"USB Peripheral",longtext:"Your USB peripheral - like a fitness device"},usb:{sortOrder:99,text:"USB Peripheral",longtext:"Your USB peripheral - like a fitness device"}},
reviewState={appID:null,extendedMetadata:null,userReviewData:null,licenseInstallData:null,maxCommentCharacters:1e3,maxTitleCharacters:50,ratingControl:null,ratingValue:null,originalTitle:"",originalContent:"",originalRating:0,savedTitle:"",savedComment:"",savedRating:0,userCID:"",pageUrl:"",deeplinked:false,reviewBIData:{"App.Id":0,"App.PurchaseStatus":0,"App.AvgRating":0,URate:0,CatId:0,SCatId:0,PStat:0}};
WinJS.Namespace.define("WinStore.ReviewPage",{_licenseInstallDataPromise:{value:null,writable:true},getLicenseInstallData:function()
{
var a=WinStore.Utilities.getLicenseInstallData(reviewState.appID,false);
if(a)
return WinJS.Promise.wrap(a);
else
{
WinStore.ReviewPage._licenseInstallDataPromise=WinJS.Promise.timeout(1e4);
return WinStore.ReviewPage._licenseInstallDataPromise.then(function()
{
return WinJS.Promise.wrap(WinStore.Utilities.getLicenseInstallData(reviewState.appID,true))
},function()
{
return WinJS.Promise.wrap(WinStore.Utilities.getLicenseInstallData(reviewState.appID,true))
})
}
},onLicenseInstallData:function()
{
WinStore.ReviewPage._licenseInstallDataPromise&&
WinStore.ReviewPage._licenseInstallDataPromise.cancel()
},onReviewLoad:function(a)
{
reviewState.extendedMetadata=null;
reviewState.userReviewData=null;
reviewState.licenseInstallData=null;
reviewState.ratingControl=null;
reviewState.ratingValue=null;
reviewState.originalTitle="";
reviewState.originalContent="";
reviewState.originalRating=0;
WinStore.PDP.setReviewPosted(false);
var b=WinStore.BI.getPageId();
b&&
WinStore.BI.addMetaToHead("MS.PageId",b);
WinJS.Promise.join({userCID:om.getUserCID(),page:om.getTravelLogCurrentPageData()}).done(function(b)
{
om.logInfoMessage("WinStore.ReviewPage.onReviewLoad: urlParamsIn: "+a+", pageData: "+b.page.data+", userCID: "+b.userCID);
var e=WinStore.Utilities.getUrlParam(b.page.data,"cid");
if(e!==""&&e!=b.userCID)
{
om.goBack();
return
}
reviewState.appID=WinStore.Utilities.getUrlParam(a,"pid").toLowerCase();
reviewState.userCID=b.userCID;
reviewState.pageUrl=b.page.url;
reviewState.deeplinked=WinStore.Utilities.getUrlParam(a,"dpl")==="1";
reviewState.savedRating=WinStore.Utilities.getUrlParam(b.page.data,"r");
reviewState.savedTitle=decodeURIComponent(WinStore.Utilities.getUrlParam(b.page.data,"t"));
reviewState.savedComment=decodeURIComponent(WinStore.Utilities.getUrlParam(b.page.data,"c"));
var d=document.getElementById("reviewTitleEdit");
d.title="Enter a review title. %1 characters or less.".replace("%1",reviewState.maxTitleCharacters);
WinStore.ReviewPage.attachContentChangeHandlers(d,WinStore.ReviewPage.onReviewTitleChanged);
d.addEventListener("keydown",function()
{
if(event.keyCode==13)
{
event.cancelBubble=true;
event.returnValue=false;
return false
}
else
WinStore.ReviewPage.onReviewTitleChanged()
},false);
var c=document.getElementById("reviewContentEdit");
c.title="Enter review comments. %1 characters or less.".replace("%1",reviewState.maxCommentCharacters);
c.setAttribute("maxLength",reviewState.maxCommentCharacters);
WinStore.ReviewPage.attachContentChangeHandlers(c,WinStore.ReviewPage.onReviewCommentsChanged);
WinStore.ReviewPage.loadPageData()
})
},loadPageData:function()
{
var a=WinStore.RRR.isPdpDataValid(reviewState.appID);
WinJS.Promise.join({extendedMetadata:WinStore.RRR.selectCacheOrMethod(a,WinStore.PDP.getCurrentAppExtendedMetadata(),om.getAppInfo(reviewState.appID)),userReviewData:WinStore.RRR.selectCacheOrMethod(a,WinStore.PDP.getCurrentUserReviewData(),om.getUserReview(reviewState.appID)),licenseInstallData:WinStore.RRR.selectCacheOrMethod(a,WinStore.PDP.getCurrentAppLicenseData(),WinStore.ReviewPage.getLicenseInstallData())}).done(function(a)
{
reviewState.extendedMetadata=a.extendedMetadata;
reviewState.userReviewData=a.userReviewData;
reviewState.licenseInstallData=a.licenseInstallData;
WinStore.ReviewPage.appInfoReady();
WinStore.ReviewPage._licenseInstallDataPromise=null
})
},onPageUnload:function(a)
{
WinStore.BI.removeMetaFromHead("MS.PageId");
!a&&
WinStore.ReviewPage.persistUserData()
},onStoreSuspend:function()
{
WinStore.ReviewPage.persistUserData()
},persistUserData:function()
{
var a="?cid="+reviewState.userCID+"&t="+encodeURIComponent(WinStore.ReviewPage.getUserTitle())+"&c="+encodeURIComponent(WinStore.ReviewPage.getUserComments())+"&r="+reviewState.ratingValue;
om.logInfoMessage("WinStore.ReviewPage.persistUserData: updating current page params: "+a);
om.updateTravelLogCurrentPageData(reviewState.pageUrl,a)
},appInfoReady:function()
{
if(reviewState.extendedMetadata&&reviewState.extendedMetadata.Id.toLowerCase()===reviewState.appID&&reviewState.extendedMetadata.Name&&reviewState.extendedMetadata.Name!=="")
{
if(reviewState.extendedMetadata.MissingHardwareMask)
{
om.showMessageDialog("Sorry, you can’t review this app from this PC because it doesn’t have the required hardware to run the app.","You can’t review this app from this PC",[{id:0,text:"Close"}],0,function()
{
om.removeCurrentPageFromTravelLog();
WinStore.Utilities.displayPDP(reviewState.appID,{formCode:WinStore.BI.biFormCodes.ReviewPage})
},null);
return
}
if(reviewState.licenseInstallData.UserLicense==="NONE"&&!WinStore.Utilities.isDesktopApp(reviewState.extendedMetadata))
{
om.showMessageDialog("To rate or review this app, sign in with the Microsoft account used to install it.","Sign in with a different Microsoft account",[{id:0,text:"Close"}],0,function()
{
om.removeCurrentPageFromTravelLog();
WinStore.Utilities.displayPDP(reviewState.appID,{formCode:WinStore.BI.biFormCodes.ReviewPage})
},null);
return
}
var f=document.getElementById("reviewTitle"),
d=reviewState.userReviewData&&reviewState.userReviewData.UserReviewTitle&&reviewState.userReviewData.UserReviewTitle!=="";
f.innerText=d?"Update your review":"Write a review";
if(d)
document.getElementById("reviewSubmitButton").innerText="Update";
document.getElementById("reviewLogoImage").src=reviewState.extendedMetadata.LogoURL;
document.getElementById("reviewAppImage").style.backgroundColor=reviewState.extendedMetadata.BackgroundColor;
if(WinStore.ReviewPage.isAppTrialVersion())
document.getElementById("reviewAppDetailsName").innerText="%1 (trial version)".replace("%1",reviewState.extendedMetadata.Name);
else
document.getElementById("reviewAppDetailsName").innerText=reviewState.extendedMetadata.Name;
if(reviewState.userReviewData.UserReviewTitle)
reviewState.originalTitle=reviewState.userReviewData.UserReviewTitle;
if(reviewState.savedTitle)
document.getElementById("reviewTitleEdit").value=reviewState.savedTitle;
else
document.getElementById("reviewTitleEdit").value=reviewState.originalTitle;
if(reviewState.userReviewData.UserReviewComments)
reviewState.originalContent=reviewState.userReviewData.UserReviewComments;
if(reviewState.savedComment)
document.getElementById("reviewContentEdit").value=reviewState.savedComment;
else
document.getElementById("reviewContentEdit").value=reviewState.originalContent;
var a=0;
if(reviewState.userReviewData.UserRating&&reviewState.userReviewData.UserRating!=="")
reviewState.originalRating=parseFloat(reviewState.userReviewData.UserRating);
if(reviewState.savedRating&&reviewState.savedRating!=="")
a=parseFloat(reviewState.savedRating);
else
a=reviewState.originalRating;
var e=document.getElementById("reviewRatingControl");
WinStore.Search.AutoDisableTypeToSearchForElement(e);
reviewState.ratingControl=new WinJS.UI.Rating(e,{enableClear:false});
if(1<=a&&a<=5)
{
reviewState.ratingValue=a;
reviewState.ratingControl.userRating=a
}
reviewState.ratingControl.addEventListener("change",this.onRatingChanged,false);
var b=String(reviewState.licenseInstallData.Installed)==="true"?"0":"1";
if(reviewState.licenseInstallData.UserLicense)
if(String(reviewState.licenseInstallData.UserLicense)==="FULL")
b+="1";
else
if(String(reviewState.licenseInstallData.UserLicense)!=="NONE")
b+="2";
else
b+="0";
else
b+="0";
reviewState.reviewBIData["App.Id"]=reviewState.appID;
reviewState.reviewBIData["App.PurchaseStatus"]=b;
reviewState.reviewBIData["App.AvgRating"]=isNaN(parseFloat(reviewState.extendedMetadata.Rating,10))?0:parseFloat(reviewState.extendedMetadata.Rating,10);
reviewState.reviewBIData.URate=isNaN(parseFloat(reviewState.userReviewData.userRating,10))?0:parseFloat(reviewState.userReviewData.userRating,10);
reviewState.reviewBIData.CatId=reviewState.extendedMetadata.CategoryId;
reviewState.reviewBIData.SCatId=reviewState.extendedMetadata.SubCategoryId;
reviewState.reviewBIData.PStat=0;
if(reviewState.licenseInstallData&&reviewState.licenseInstallData.UserLicense&&reviewState.licenseInstallData.UserLicense!=="NONE")
if(reviewState.licenseInstallData.UserLicense==="FULL")
reviewState.reviewBIData.PStat=2;
else
reviewState.reviewBIData.PStat=1
}
else
{
om.logErrorMessage("Review: appInfoReady: returned app info doesn't match ID or is empty");
document.getElementById("reviewTitleEdit").disabled=true;
document.getElementById("reviewContentEdit").disabled=true;
document.getElementById("reviewRatingControl").disabled=true
}
this.updateReviewCharacterCount();
this.updateReviewButtons();
document.getElementById("reviewProcessingText").style.display="none";
document.getElementById("reviewProgressControl").style.visibility="hidden";
document.getElementById("reviewContent").style.display="block";
document.getElementById("reviewInstructionsContent").style.display="block";
document.getElementById("reviewLoadingProgress").style.visibility="hidden";
document.getElementById("reviewLoading").style.display="none";
var c={"App.Id":reviewState.appID};
if(reviewState.deeplinked)
c[WinStore.BI.biFieldNames.DeepLink]=1;
var g=WinStore.Utilities.getPromoBoundaryInMS(reviewState.extendedMetadata.PromoEndDate);
if(g>0)
c[WinStore.BI.biFieldNames.AppIsPromotion]=1;
WinStore.BI.firePageViewEvent(c);
om.etwRrrDisplaySubmitReviewPageStop(reviewState.appID)
},attachContentChangeHandlers:function(b,a)
{
b.addEventListener("keydown",a,false);
b.addEventListener("keyup",a,false);
b.addEventListener("textinput",a,false);
b.addEventListener("DOMCharacterDataModified",function()
{
setTimeout(a,150)
},false);
b.addEventListener("paste",function()
{
setTimeout(a,150)
},false);
b.addEventListener("cut",function()
{
setTimeout(a,150)
},false)
},updateReviewCharacterCount:function()
{
var a=document.getElementById("reviewContentEdit").value.length;
if(a<=reviewState.maxCommentCharacters)
document.getElementById("reviewCharCount").innerText="%1/%2".replace("%1",WinStore.RRR.formatNumber(a)).replace("%2",WinStore.RRR.formatNumber(reviewState.maxCommentCharacters));
else
document.getElementById("reviewCharCount").innerHTML=document.getElementById("reviewOverCountTemplate").innerHTML.replace("%1",WinStore.RRR.formatNumber(a)).replace("%2",WinStore.RRR.formatNumber(reviewState.maxCommentCharacters))
},onRatingChanged:function(a)
{
if(a.detail.tentativeRating>0)
{
reviewState.ratingValue=a.detail.tentativeRating;
WinStore.ReviewPage.updateReviewButtons()
}
},validateReviewForm:function()
{
var c=document.getElementById("reviewTitleEdit").value.replace(/\s/g,""),
b=document.getElementById("reviewContentEdit").value.replace(/\s/g,""),
a=reviewState.ratingValue&&reviewState.ratingValue!==0;
if(c===""&&b!=="")
if(!a)
errorMsg="Please choose a rating and add a title to your review.";
else
errorMsg="Please add a title to your review.";
else
if(b===""&&c!=="")
if(!a)
errorMsg="Please choose a rating and add comments to your review.";
else
errorMsg="Please add comments to your review.";
else
if(!a)
errorMsg="Please choose a rating for your review.";
else
return true;
document.getElementById("reviewSubmitFailed").innerText=errorMsg;
document.getElementById("reviewSubmitFailed").style.display="block";
return false
},updateReviewButtons:function()
{
var b=document.getElementById("reviewTitleEdit").value!==reviewState.originalTitle||document.getElementById("reviewContentEdit").value!==reviewState.originalContent||reviewState.ratingValue!=reviewState.originalRating,
a=document.getElementById("reviewContentEdit").value.length>reviewState.maxCommentCharacters;
document.getElementById("reviewSubmitButton").disabled=!b||a
},onReviewTitleChanged:function()
{
WinStore.ReviewPage.updateReviewButtons()
},onReviewCommentsChanged:function()
{
WinStore.ReviewPage.updateReviewButtons();
WinStore.ReviewPage.updateReviewCharacterCount()
},isAppTrialVersion:function()
{
var a=false;
if(reviewState.licenseInstallData)
if(reviewState.licenseInstallData.UserLicense.toString()==="VALID_TRIAL"||reviewState.licenseInstallData.UserLicense.toString()==="EXPIRED_TRIAL")
a=true;
return a
},onReviewSubmitButton:function()
{
if(!this.validateReviewForm())
return false;
om.etwRrrSubmitReviewStart(reviewState.extendedMetadata.Id);
this.updateReviewButtons();
if(!document.getElementById("reviewSubmitButton").disabled)
{
om.logInfoMessage("Review: onReviewSubmitButton: submitting review for application '"+reviewState.extendedMetadata.Name+"'");
document.getElementById("reviewSubmitFailed").style.display="none";
document.getElementById("reviewProcessingText").style.display="inline";
document.getElementById("reviewProgressControl").style.visibility="visible";
document.getElementById("reviewSubmitButton").disabled=true;
document.getElementById("reviewCancelButton").disabled=true;
document.getElementById("reviewTitleEdit").disabled=true;
document.getElementById("reviewContentEdit").disabled=true;
reviewState.ratingControl.disabled=true;
reviewState.reviewBIData.URate=reviewState.ratingValue;
WinStore.BI.logCustomBI("AppReview",{"App.Id":reviewState.reviewBIData["App.Id"]});
om.submitReview(reviewState.extendedMetadata.Id,reviewState.extendedMetadata.PackageFamilyName,WinStore.Utilities.encodeCDATA(this.getUserTitle()),WinStore.Utilities.encodeCDATA(this.getUserComments()),reviewState.ratingValue,reviewState.extendedMetadata&&reviewState.extendedMetadata.Version?reviewState.extendedMetadata.Version:"",reviewState.extendedMetadata&&reviewState.extendedMetadata.MinOsVersion?reviewState.extendedMetadata.MinOsVersion:"",WinStore.ReviewPage.isAppTrialVersion(),this.submitComplete)
}
},getUserComments:function()
{
var a=document.getElementById("reviewContentEdit").value.replace(/^\s\s*/,"").replace(/\s\s*$/,"");
if(a&&a.length>reviewState.maxCommentCharacters)
a=a.substring(0,reviewState.maxCommentCharacters-1);
return a
},getUserTitle:function()
{
return document.getElementById("reviewTitleEdit").value.replace(/^\s\s*/,"").replace(/\s\s*$/,"")
},submitComplete:function(a)
{
om.logInfoMessage("Review: submitComplete: result is '"+a+"'");
document.getElementById("reviewProcessingText").style.display="none";
document.getElementById("reviewProgressControl").style.visibility="hidden";
if(a===WinStore.RRR.SqrResult.success)
{
WinStore.PDP.setReviewPosted(true);
if(reviewState.deeplinked)
{
om.removeCurrentPageFromTravelLog();
WinStore.Utilities.displayPDP(reviewState.appID,{formCode:WinStore.BI.biFormCodes.ReviewPage})
}
else
om.goBack()
}
else
{
document.getElementById("reviewSubmitButton").disabled=false;
document.getElementById("reviewCancelButton").disabled=false;
document.getElementById("reviewTitleEdit").disabled=false;
document.getElementById("reviewContentEdit").disabled=false;
reviewState.ratingControl.disabled=false;
if(a===WinStore.RRR.SqrResult.failure)
{
document.getElementById("reviewSubmitFailed").innerText="There’s a problem completing your request. Please try again later.";
document.getElementById("reviewSubmitFailed").style.display="block"
}
om.etwRrrSubmitReviewStop(reviewState.extendedMetadata.Id)
}
},onReviewCancelButton:function()
{
if(reviewState.deeplinked)
{
om.removeCurrentPageFromTravelLog();
WinStore.Utilities.displayPDP(reviewState.appID,{formCode:WinStore.BI.biFormCodes.ReviewPage})
}
else
om.goBack()
}});
WinJS.Namespace.define("WinStore.ReviewListPage",{_extendedMetadata:{value:null,writable:true},_ratingControl:{value:null,writable:true},_reviewGridControl:{value:null,writable:true},_reviewCount:{value:0,writable:true},_selectedSortOrder:{value:"newest",writable:true},_selectedFilter:{value:"all",writable:true},_selectedVersionFilter:{value:"all",writable:true},_ratingData:{value:null,writable:true},_urlParams:{value:null,writable:true},_pid:{value:null,writable:true},_onDataLoaded:{value:null,writable:true},_inDataRefresh:{value:true,writable:true},_isRefreshDeferred:{value:false,writable:true},_savedPageData:{value:null,writable:true},_gridScrollPos:{value:0,writable:true},onPageLoad:function(b,a)
{
this._onDataLoaded=a;
this._urlParams=b;
WinStore.ReviewListPage._pid=WinStore.Utilities.getUrlParam(this._urlParams,"pid").toLowerCase();
WinStore.ReviewListPage._ratingControl=new WinStore.UI.RatingSummary;
WinStore.ReviewListPage._fillSortList();
WinStore.ReviewListPage._fillFilterList();
WinStore.ReviewListPage._fillVersionFilterList();
om.getTravelLogCurrentPageData().done(function(b)
{
var a=WinStore.RRR.isPdpDataValid(WinStore.ReviewListPage._pid);
WinStore.ReviewListPage._savedPageData=b;
WinStore.ReviewListPage._parseSavedData();
WinStore.RRR.selectCacheOrMethod(a,WinStore.PDP.getCurrentAppExtendedMetadata(),om.getAppInfo(WinStore.ReviewListPage._pid)).done(function(b)
{
WinStore.ReviewListPage._extendedMetadata=b;
WinJS.Promise.join({ratingData:WinStore.RRR.selectCacheOrMethod(a,WinStore.PDP.getCurrentRatingData(),om.getRatings(WinStore.ReviewListPage._pid,WinStore.ReviewListPage._extendedMetadata.ReleaseId)),reviewData:om.getAppReviewList(WinStore.ReviewListPage._pid,WinStore.ReviewListPage._extendedMetadata.ReleaseId,WinStore.ReviewListPage._selectedFilter,WinStore.ReviewListPage._selectedVersionFilter,WinStore.ReviewListPage._selectedSortOrder,1,1)}).done(function(b)
{
WinStore.ReviewListPage._ratingData=b.ratingData;
WinStore.ReviewListPage._reviewCount=b.reviewData.totalReviewCount;
var a=WinStore.BI.getPageId();
a&&
WinStore.BI.addMetaToHead("MS.PageId",a);
var c={"App.Id":WinStore.ReviewListPage._pid},
d=WinStore.Utilities.getPromoBoundaryInMS(WinStore.ReviewListPage._extendedMetadata.PromoEndDate);
if(d>0)
c[WinStore.BI.biFieldNames.AppIsPromotion]=1;
WinStore.BI.firePageViewEvent(c);
WinStore.ReviewListPage._onDataReady()
})
})
})
},onPageUnload:function()
{
if(WinStore.ReviewListPage._onDataLoaded)
{
WinStore.ReviewListPage._onDataLoaded(true);
WinStore.ReviewListPage._onDataLoaded=null
}
WinStore.BI.removeMetaFromHead("MS.PageId");
WinStore.ReviewListPage._persistUserData()
},onStoreSuspend:function()
{
WinStore.ReviewListPage._persistUserData()
},onReviewSortOrderChange:function()
{
var b=document.getElementById("reviewListSortSelect");
if(b!==null)
{
var a=b.value;
if(a!==null)
{
om.etwRrrReviewListSortStart(WinStore.ReviewListPage._pid,a);
this._selectedSortOrder=a;
this._refreshListView()
}
}
},onReviewFilterChange:function()
{
var b=document.getElementById("reviewListStarFilterSelect");
if(b!==null)
{
var a=b.value;
if(a!==null)
{
this._selectedFilter=a;
this._refreshListView()
}
}
},onReviewVersionFilterChange:function()
{
var b=document.getElementById("reviewListVersionFilterSelect");
if(b!==null)
{
var a=b.value;
if(a!==null)
{
this._selectedVersionFilter=a;
this._refreshListView()
}
}
},_persistUserData:function()
{
var a="?so="+this._selectedSortOrder+"&f="+this._selectedFilter+"&vf="+this._selectedVersionFilter+"&sp="+this._reviewGridControl._listViewControl.scrollPosition;
om.updateTravelLogCurrentPageData(WinStore.ReviewListPage._savedPageData.url,a)
},_parseSavedData:function()
{
var b=decodeURIComponent(WinStore.Utilities.getUrlParam(WinStore.ReviewListPage._savedPageData.data,"so")),
d=parseInt(decodeURIComponent(WinStore.Utilities.getUrlParam(WinStore.ReviewListPage._savedPageData.data,"f"))),
a=decodeURIComponent(WinStore.Utilities.getUrlParam(WinStore.ReviewListPage._savedPageData.data,"vf")),
c=parseInt(decodeURIComponent(WinStore.Utilities.getUrlParam(WinStore.ReviewListPage._savedPageData.data,"sp")));
if(b!=="")
{
this._selectedSortOrder=b;
document.getElementById("reviewListSortSelect").value=this._selectedSortOrder
}
if(!isNaN(d))
{
this._selectedFilter=d;
document.getElementById("reviewListStarFilterSelect").value=this._selectedFilter
}
if(a!=="")
{
this._selectedVersionFilter=a;
document.getElementById("reviewListVersionFilterSelect").value=this._selectedVersionFilter
}
if(!isNaN(c))
this._gridScrollPos=c
},_onDataReady:function()
{
WinStore.ReviewListPage._initPageTitle();
var b=document.getElementById("reviewListTitle");
if(b)
b.innerText=WinStore.ReviewListPage._extendedMetadata.Name;
var c=document.getElementById("reviewListLogoImage");
if(c)
{
c.src=WinStore.ReviewListPage._extendedMetadata.LogoURL;
c.style.backgroundColor=WinStore.ReviewListPage._extendedMetadata.BackgroundColor
}
var a=document.getElementById("reviewListRatingSummary");
if(a&&!a.hasChildNodes())
{
WinStore.ReviewListPage._ratingControl.attachToElement(a);
WinStore.RRR.setRatingSummaryFromRatingData(WinStore.ReviewListPage._ratingControl,WinStore.ReviewListPage._ratingData,WinStore.ReviewListPage._selectedVersionFilter=="all")
}
var d=WinStore.Utilities.firstChildByClassOrDefault(a,"ratingSummaryContent"),
e=d.clientWidth;
b.style.width=e-40+"px";
WinStore.RRR.setTooltip(b);
if(WinStore.ReviewListPage._reviewCount>0)
WinStore.ReviewListPage._showGridDisplay();
else
WinStore.ReviewListPage._showNoContentDisplay()
},_onReviewGridLoadingStateChanged:function()
{
var g=this,
b=g.reviewGridControl,
f=window.getComputedStyle(document.body).direction==="ltr";
if(b&&b.loadingState)
if(b.loadingState==="itemsLoaded")
{
if(WinStore.ReviewListPage._onDataLoaded)
{
WinStore.ReviewListPage._onDataLoaded(false,null,g.onEntranceAnimationCompleted);
WinStore.ReviewListPage._onDataLoaded=null
}
om.etwRrrReviewTabClickStop(WinStore.ReviewListPage._pid);
if(WinStore.ReviewListPage._gridScrollPos>0)
{
b._listViewControl.scrollPosition=WinStore.ReviewListPage._gridScrollPos;
WinStore.ReviewListPage._gridScrollPos=0
}
}
else
if(b.loadingState==="viewPortLoaded")
{
var e=document.getElementById("reviewListGridControl"),
h=WinStore.Utilities.firstChildByClassOrDefault(e,"reviewListRatingSummary");
if(!h)
{
var d=WinStore.Utilities.firstChildByClassOrDefault(e,"win-surface"),
a=document.createElement("div");
WinJS.Utilities.addClass(a,"reviewListRatingSummary");
WinStore.ReviewListPage._ratingControl.attachToElement(a);
d.insertBefore(a,d.firstChild);
WinStore.RRR.setRatingSummaryFromRatingData(WinStore.ReviewListPage._ratingControl,WinStore.ReviewListPage._ratingData,WinStore.ReviewListPage._selectedVersionFilter=="all");
var i=WinStore.Utilities.firstChildByClassOrDefault(a,"ratingSummaryContent"),
c=i.clientWidth;
a.style.left=(f?-1:1)*(c+75)+"px";
a.style.width=c+1+"px";
if(f)
d.style.paddingLeft=c+155+"px";
else
d.style.paddingRight=c+155+"px"
}
WinStore.ReviewListPage._refreshComplete()
}
},_initPageTitle:function()
{
WinStore.Frame.setPageTitle("Ratings and reviews",true);
var b=WinStore.ReviewListPage._reviewCount,
a;
if(b===1)
a="1 review";
else
a="%1 reviews".replace("%1",WinStore.RRR.formatNumber(b));
WinStore.Frame.setAppCount(a)
},_refreshComplete:function()
{
WinStore.ReviewListPage._inDataRefresh=false;
if(WinStore.ReviewListPage._isRefreshDeferred)
{
WinStore.ReviewListPage._isRefreshDeferred=false;
WinStore.ReviewListPage._refreshListView()
}
},_refreshListView:function()
{
if(WinStore.ReviewListPage._inDataRefresh)
{
WinStore.ReviewListPage._isRefreshDeferred=true;
return
}
WinStore.Frame.clearAppCount();
WinStore.ReviewListPage._inDataRefresh=true;
WinStore.ReviewListPage._setTransitionVisibility(true);
om.getAppReviewList(WinStore.ReviewListPage._pid,WinStore.ReviewListPage._extendedMetadata.ReleaseId,WinStore.ReviewListPage._selectedFilter,WinStore.ReviewListPage._selectedVersionFilter,WinStore.ReviewListPage._selectedSortOrder,1,1).done(function(a)
{
WinStore.ReviewListPage._reviewCount=a.totalReviewCount;
WinStore.ReviewListPage._initPageTitle();
if(a.totalReviewCount===0)
WinStore.ReviewListPage._showNoContentDisplay();
else
WinStore.ReviewListPage._showGridDisplay()
})
},_logCustomBI:function()
{
var a={"Review.Count":WinStore.ReviewListPage._reviewCount,"Review.Filter":WinStore.ReviewListPage._selectedFilter,"Review.VersionFilter":WinStore.ReviewListPage._selectedVersionFilter,"Review.Sort":WinStore.ReviewListPage._selectedSortOrder,"App.Id":WinStore.ReviewListPage._pid};
WinStore.BI.logCustomBI(WinStore.BI.biDataPoint.listId.ratingsAndReview,a)
},_showGridDisplay:function()
{
var a=document.getElementById("reviewListGridControl"),
c=parseInt((window.innerHeight-175)/280),
b=2998*c;
b=1800;
WinStore.ReviewListPage._inDataRefresh=true;
while(a.hasChildNodes())
a.removeChild(a.firstChild);
WinStore.ReviewListPage._setGridAreaVisibility(true);
WinStore.ReviewListPage._setTransitionVisibility(false);
WinStore.ReviewListPage._reviewGridControl=new WinStore.UI.ReviewGrid(a,WinStore.ReviewListPage._pid,WinStore.ReviewListPage._extendedMetadata.ReleaseId,Math.min(b,WinStore.ReviewListPage._reviewCount),WinStore.ReviewListPage._selectedSortOrder,WinStore.ReviewListPage._selectedFilter,WinStore.ReviewListPage._selectedVersionFilter,true);
WinStore.ReviewListPage._reviewGridControl.addLoadingStateChangedEventListener(WinStore.ReviewListPage._onReviewGridLoadingStateChanged);
WinStore.ReviewListPage._reviewGridControl.scrollContainerBy=function(b)
{
WinStore.Utilities.firstChildByClassOrDefault(a,"win-viewport").scrollLeft+=b
};
WinStore.ReviewListPage._reviewGridControl.adjustTotalReviewCount=function(a)
{
WinStore.ReviewListPage._reviewCount=a;
WinStore.ReviewListPage._initPageTitle()
};
WinStore.ReviewListPage._logCustomBI()
},_showNoContentDisplay:function()
{
var a=document.getElementById("reviewListNoContentDisplay");
if(a)
{
var b=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewListRatingSummary");
if(b)
{
WinStore.ReviewListPage._ratingControl.attachToElement(b);
WinStore.RRR.setRatingSummaryFromRatingData(WinStore.ReviewListPage._ratingControl,WinStore.ReviewListPage._ratingData,WinStore.ReviewListPage._selectedVersionFilter=="all")
}
}
WinStore.ReviewListPage._setGridAreaVisibility(false);
WinStore.ReviewListPage._setTransitionVisibility(false);
WinStore.ReviewListPage._refreshComplete();
if(WinStore.ReviewListPage._onDataLoaded)
{
WinStore.ReviewListPage._onDataLoaded(false,null);
WinStore.ReviewListPage._onDataLoaded=null
}
WinStore.ReviewListPage._logCustomBI();
WinStore.Utilities.readAloud("No reviews match that criteria.")
},_setTransitionVisibility:function(b)
{
var a=document.getElementById("reviewListGridArea");
if(a)
a.style.display=b?"none":"block"
},_setGridAreaVisibility:function(a)
{
WinStore.ReviewListPage._setVisibility("reviewListNoReviewsMessage",!a);
WinStore.ReviewListPage._setVisibility("reviewListGridControl",a);
document.getElementById("reviewListGridControl").setAttribute("aria-hidden",!a?"true":"false");
document.getElementById("reviewListNoContentDisplay").setAttribute("aria-hidden",a?"true":"false")
},_setVisibility:function(d,c)
{
var b=c?"block":"none",
a=document.getElementById(d);
if(a&&a.style.display!=b)
a.style.display=b
},_fillSortList:function()
{
for(var c=[{id:"newest",text:"Newest"},{id:"oldest",text:"Oldest"},{id:"highest-rated",text:"Highest rated"},{id:"lowest-rated",text:"Lowest rated"},{id:"helpful",text:"Most helpful"}],
d=document.getElementById("reviewListSortSelect"),
b=0;b<c.length;b++)
{
var a=document.createElement("option");
a.innerText=c[b].text;
a.value=c[b].id;
if(WinStore.ReviewListPage._selectedSortOrder===a.value)
a.selected=true;
d.appendChild(a)
}
},_fillFilterList:function()
{
for(var c=[{id:"all",text:"All reviews"},{id:"5",text:"Five star reviews"},{id:"4",text:"Four star reviews"},{id:"3",text:"Three star reviews"},{id:"2",text:"Two star reviews"},{id:"1",text:"One star reviews"}],
d=document.getElementById("reviewListStarFilterSelect"),
b=0;b<c.length;b++)
{
var a=document.createElement("option");
a.innerText=c[b].text;
a.value=c[b].id;
if(WinStore.ReviewListPage._selectedFilter===a.value)
a.selected=true;
d.appendChild(a)
}
},_fillVersionFilterList:function()
{
for(var c=[{id:"current",text:"Current version"},{id:"all",text:"All versions"}],
d=document.getElementById("reviewListVersionFilterSelect"),
b=0;b<c.length;b++)
{
var a=document.createElement("option");
a.innerText=c[b].text;
a.value=c[b].id;
if(WinStore.ReviewListPage._selectedVersionFilter===a.value)
a.selected=true;
d.appendChild(a)
}
}});
WinJS.Namespace.define("WinStore.RRR",{ProblemTypes:{poliCheck:2,flagReview:7},SqrResult:{success:0,failure:1,cancel:2},ReviewStatusValues:{autoApproved:0,manualApproved:1,autoRejected:2,manualRejected:3,pending:4},HelpfulVoteState:{no:0,yes:1},SqrReviewPageSize:10,normalizeCount:function(b)
{
var a;
if(typeof b==="string")
a=parseInt(b);
else
a=b;
if(isNaN(a))
a=0;
return a
},normalizeRatingValue:function(b)
{
var a=parseFloat(b);
if(!isNaN(a)&&a>0)
{
a=Math.max(a,1);
a=Math.min(a,5)
}
else
a=0;
return a.toFixed(1)
},selectCacheOrMethod:function(c,a,b)
{
if(c&&a)
return new WinJS.Promise.wrap(a);
else
return b
},setRatingSummaryFromRatingData:function(a,b,c)
{
if(b&&a)
{
a.setShowingCurrentRatings(!c);
if(c)
{
a.averageRating=b.AverageRating;
a.totalRatings=b.TotalRatingCount;
a.totalReviews=b.TotalReviewCount;
a.setStarInformation(5,b.FiveStarCount);
a.setStarInformation(4,b.FourStarCount);
a.setStarInformation(3,b.ThreeStarCount);
a.setStarInformation(2,b.TwoStarCount);
a.setStarInformation(1,b.OneStarCount)
}
else
{
a.averageRating=b.CurrentVersion_AverageRating;
a.totalRatings=b.CurrentVersion_TotalRatingCount;
a.totalReviews=b.CurrentVersion_TotalReviewCount;
a.setStarInformation(5,b.CurrentVersion_FiveStarCount);
a.setStarInformation(4,b.CurrentVersion_FourStarCount);
a.setStarInformation(3,b.CurrentVersion_ThreeStarCount);
a.setStarInformation(2,b.CurrentVersion_TwoStarCount);
a.setStarInformation(1,b.CurrentVersion_OneStarCount)
}
}
},isPdpDataValid:function(c)
{
var a=WinStore.PDP.getCurrentAppExtendedMetadata(),
b=!WinStore.PDP.getIsInAcquisition()&&a!=null&&a.Id.toLowerCase()===c;
return b
},setTooltip:function(a)
{
if(a)
WinStore.Utilities.isOverflowed(a)&&
a.setAttribute("title",a.innerText)
},formatNumber:function(e,b)
{
var a=navigator.userLanguage,
c=a.indexOf("_");
if(c!==-1)
a=a.substring(0,c);
var d=new Intl.NumberFormat(a,{minimumFractionDigits:typeof b!="undefined"?b:0});
return d.format(e)
}});
WinJS.Namespace.define("WinStore.UI",{RatingSummary:WinJS.Class.define(function(a)
{
a&&
this.attachToElement(a);
this.averageRating=0
},{attachToElement:function(a)
{
a.winControl=this;
WinStore.UI.RatingSummary._createRatingSummaryControl(a);
this._controlId=a._controlId
},setShowingCurrentRatings:function(a)
{
this._isShowingCurrentRatings=a
},setStarInformation:function(c,e)
{
var d=this._getRatingSummaryElementById("ratingSummaryStar"+c.toString()+"Bar"),
b=this._getRatingSummaryElementById("ratingSummaryStar"+c.toString()+"Count"),
a=WinStore.RRR.normalizeCount(e),
f=Math.min(this.totalRatings?100*(a/this.totalRatings):0,100);
if(d)
d.style.width=f.toString()+"%";
if(b)
if(this._isShowingCurrentRatings&&a===0)
b.innerText="";
else
b.innerText=WinStore.RRR.formatNumber(a);
this._starRatings[c-1]=a;
this._refreshAriaText()
},totalRatings:{"get":function()
{
return this._totalRatings
},"set":function(c)
{
this._totalRatings=WinStore.RRR.normalizeCount(c);
var b=this._getRatingSummaryElementById("ratingSummaryTotalRatingsCount");
if(b)
b.innerText=WinStore.RRR.formatNumber(this._totalRatings);
var a=this._getRatingSummaryElementById("ratingSummaryTotalRatingsCaption");
if(a)
if(this._totalRatings===1)
a.innerText="rating";
else
a.innerText="ratings"
}},totalReviews:{"get":function()
{
return this._totalReviews
},"set":function(d)
{
this._totalReviews=WinStore.RRR.normalizeCount(d);
var c=this._getRatingSummaryElementById("ratingSummaryTotalReviewsCount"),
a=this._getRatingSummaryElementById("ratingSummaryTotalReviewsCaption"),
b=this._getRatingSummaryElementById("ratingSummaryDisplayingReviewsCaption");
if(c)
c.innerText=WinStore.RRR.formatNumber(this._totalReviews);
if(a)
if(this._totalReviews===1)
a.innerText="total review";
else
a.innerText="total reviews";
if(b)
if(this._totalReviews===0)
b.innerText="No one has reviewed this app";
else
b.innerText="Displaying most helpful reviews"
}},showReviewDetails:{"get":function()
{
return this._isReviewDetailVisible
},"set":function(b)
{
this._isReviewDetailVisible=b;
var a=this._getRatingSummaryElementById("ratingSummaryReviewDetails");
if(a)
{
a.style.display=this._isReviewDetailVisible?"block":"none";
a.setAttribute("aria-hidden",this._isReviewDetailVisible?"false":"true")
}
}},averageRating:{"get":function()
{
return this._averageRating
},"set":function(g)
{
this._averageRating=WinStore.RRR.normalizeRatingValue(g);
var b=this._getRatingSummaryElementById("ratingSummaryRatingControl");
if(b)
{
var a=b.winControl;
if(a===null||a===undefined)
{
a=new WinJS.UI.Rating(b,{disabled:true,enableClear:false});
b.setAttribute("disabled","true")
}
a.averageRating=this._averageRating
}
var d=this._getRatingSummaryElementById("ratingSummaryAverageRatingValue"),
f=this._getRatingSummaryElementById("ratingSummaryAverageRating"),
e=this._getRatingSummaryElementById("ratingSummaryNoAverageRating"),
c=this._isShowingCurrentRatings&&parseInt(this._averageRating)===0;
if(d)
{
if(!c)
d.innerText=WinStore.RRR.formatNumber(this._averageRating,1);
WinStore.Utilities.showElement(e,c);
WinStore.Utilities.showElement(f,!c)
}
}},_refreshAriaText:function()
{
for(var b=this._getRatingSummaryElementById("ratingSummaryHistorgram"),
c="",
a=0;a<5;a++)
c+="%1 %2 star ratings\n".replace("%1",this._starRatings[a]).replace("%2",a+1);
b&&
b.setAttribute("aria-label",c)
},_getRatingSummaryElementById:function(a)
{
return document.getElementById(a+this._controlId.toString())
},_isReviewDetailVisible:false,_isShowingCurrentRatings:false,_averageRating:0,_totalRatings:0,_starRatings:[0,0,0,0,0],_totalReviews:0,_controlId:0},{_createRatingSummaryControl:function(a)
{
var e,
d=document.getElementById("ratingSummaryTemplate");
if(d)
{
a._controlId=WinStore.UI.RatingSummary._getNextControlId();
e=d.innerHTML.replace(/{{id}}/g,a._controlId)
}
var b=document.createElement("div"),
c=document.createElement("div");
c.innerHTML=e;
while(a.hasChildNodes())
a.removeChild(a.firstChild);
a.appendChild(b);
WinJS.Utilities.addClass(b,"ratingSummaryContainer");
b.appendChild(c);
WinJS.Utilities.addClass(c,"ratingSummaryContent")
},_getNextControlId:function()
{
return WinStore.UI.RatingSummary._controlCount++
},_controlCount:1}),ReviewGrid:WinJS.Class.define(function(a,h,e,c,f,g,b,d)
{
a.reviewGridControl=this;
WinJS.Utilities.addClass(a,"reviewGridListView");
this._appId=h;
this._releaseId=e;
this._controlId=WinStore.UI.ReviewGrid._getNextControlId();
this._totalReviews=c;
this._dataSourceVersion=0;
this._callbackCount=0;
this._initializeReportReviewMenu();
this.sortOrder=f;
this.filter=g;
this.versionFilter=b;
this._listViewControl=new WinJS.UI.ListView(a,{loadingBehavior:"randomAccess",selectionMode:WinJS.UI.SelectionMode.none,swipeBehavior:WinJS.UI.SwipeBehavior.none,tapBehavior:WinJS.UI.TapBehavior.none,itemDataSource:this._createReviewDataSource(this._appId,this._releaseId,this._sortOrder,this._filter,this._versionFilter,this._totalReviews),itemTemplate:this._createReviewRenderer()});
if(d)
this._listViewControl.currentItem={index:0,hasFocus:true};
a.setAttribute("role","listbox")
},{sortOrder:{"get":function()
{
return this._sortOrder
},"set":function(a)
{
this._sortOrder=a
}},filter:{"get":function()
{
return this._filter
},"set":function(a)
{
this._filter=a
}},versionFilter:{"get":function()
{
return this._versionFilter
},"set":function(a)
{
this._versionFilter=a
}},releaseId:{"get":function()
{
return this._releaseId
},"set":function(a)
{
this._releaseId=a
}},loadingState:{"get":function()
{
if(this._listViewControl)
return this._listViewControl.loadingState
}},scrollContainerBy:{"get":function()
{
return this._scrollContainerBy
},"set":function(a)
{
this._scrollContainerBy=a
}},adjustTotalReviewCount:{"get":function()
{
return this._adjustTotalReviewCount
},"set":function(a)
{
this._adjustTotalReviewCount=a
}},refreshDataSource:function()
{
this._listViewControl.itemDataSource=this._createReviewDataSource(this._appId,this._releaseId,this._sortOrder,this._filter,this._versionFilter,this._totalReviews)
},addLoadingStateChangedEventListener:function(a)
{
this._listViewControl&&
this._listViewControl.addEventListener("loadingstatechanged",a)
},_createReviewRenderer:function()
{
var a=document.getElementById("reviewGridItemTemplate").innerHTML,
b=this;
function c(f,e)
{
var c=e,
d=b;
if(!c)
{
c=document.createElement("div");
WinJS.Utilities.addClass(c,"reviewGridItemLoading")
}
return {element:c,renderComplete:f.then(function(b)
{
var m=b.data,
G=/{{(\w+)}}/g,
H=a.replace(G,function(c,b)
{
var a=m[b];
return a!==undefined?a:c
}),
g=m["reviewID"],
e="",
f=d;
WinJS.Utilities.removeClass(c,"reviewGridItemLoading");
c.innerHTML=H;
c.id="reviewGridItem"+g;
c.style.display="-ms-grid";
var k=m["reviewer"];
if(k&&k.length>0)
e+="\n"+k;
var D=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridReviewerName");
WinStore.RRR.setTooltip(D);
var t="Not yet rated",
u=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridRating");
if(u)
{
var n=WinStore.RRR.normalizeRatingValue(b.data["rating"]);
u.setAttribute("rating",n);
if(n>0)
t="Rating %1 out of 5 stars".replace("%1",n)
}
e+="\n"+b.data["date"];
e+="\n"+t;
var l=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridTitleText");
if(l&&b.data["title"])
{
l.innerText=b.data["title"];
e+="\n"+b.data["title"];
WinStore.RRR.setTooltip(l)
}
e+="\n"+b.data["version"];
var v=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridText");
if(v&&b.data["text"])
{
for(var z=b.data["text"].replace(/<br\s*\/>/g,"\r\n"),
j=z.split("\r\n"),
h=0;h<j.length;h++)
{
var C=document.createElement("div");
C.innerText=j[h]&&j[h]!==""?j[h]:" ";
v.appendChild(C)
}
e+="\n"+z
}
var s=document.getElementById("reviewGridStaticRender");
s.innerHTML=c.innerHTML;
var q=WinStore.Utilities.firstChildByClassOrDefault(s,"reviewGridText"),
x=f._calcContentHeight(q,1),
i=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridReadMoreLink");
if(i)
if(q.clientHeight>x*4)
{
i.style.display="inline";
i.addEventListener("click",function()
{
f._showReadmoreFlyout(c,g)
});
var r=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridTextContainer");
if(r)
r.style.height=x*3+"px"
}
else
i.style.display="none";
var y=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridReportLink");
y&&
y.addEventListener("click",function()
{
f._showReportReviewProblemMenu(g)
});
var w=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridHelpfulYesLink");
w&&
w.addEventListener("click",function()
{
f._onHelpfulnessVote(g,"yes")
});
var A=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridHelpfulNoLink");
A&&
A.addEventListener("click",function()
{
f._onHelpfulnessVote(g,"no")
});
var F=parseInt(b.data["totalCount"]),
o=parseInt(b.data["helpfulCount"]),
B=F-o;
c.setAttribute("yes",o);
c.setAttribute("no",B);
e+="\n[[ ]]";
e=f._updateHelpfulCountsInAriaText(e,o,B);
c.setAttribute("title","");
c.setAttribute("aria-label",e);
f._enableReviewItemActions(g,c,true);
f._refreshHelpfulDisplay(g,c);
var E=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridAccountImage"),
p=b.data.image;
if(p==="")
p="../../../../../images/2/reviewer.jpg";
E.setAttribute("imgsrc",p);
return b.ready
}).then(function(f)
{
var a=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridRating"),
b=a.getAttribute("rating");
if(b)
{
a.removeAttribute("rating");
var e=WinStore.RRR.normalizeRatingValue(b),
d=new WinJS.UI.Rating(a,{disabled:true,userRating:e});
d.element.tabIndex=-1;
d.element.setAttribute("aria-hidden","true")
}
return f
}).then(function(a)
{
var b=WinStore.Utilities.firstChildByClassOrDefault(c,"reviewGridAccountImage"),
d=b.getAttribute("imgsrc");
if(a.isImageCached(d))
{
b.setAttribute("src",d);
WinJS.UI.Animation.fadeIn(b)
}
else
return a.loadImage(d,b).then(function(b)
{
WinJS.UI.Animation.fadeIn(b);
return a
},function(c)
{
c.name!=="Canceled"&&
a.loadImage("../../../../../images/2/reviewer.jpg",b).then(function(b)
{
WinJS.UI.Animation.fadeIn(b);
return a
});
return a
});
return a
})}
}
return c
},_updateHelpfulCountsInAriaText:function(a,e,f)
{
if(a)
{
var b=a.indexOf("[[",0),
c=a.indexOf("]]",0);
if(b>=0&&c>=0)
{
var d="%1 people found this review helpful".replace("%1",WinStore.RRR.formatNumber(e))+"\n"+"%1 people did not find this review helpful".replace("%1",WinStore.RRR.formatNumber(f));
a=a.slice(0,b+2)+d+a.slice(c,a.length)
}
}
return a
},_enableReviewItemActions:function(d,a,c)
{
var b=["reviewGridHelpfulYesLink","reviewGridHelpfulNoLink","reviewGridReportLink","reviewGridReadMoreLink"];
this._forEachControl(a,b,function(b,a)
{
a.disabled=!c
})
},_refreshHelpfulDisplay:function(i,a)
{
var b=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridHelpfulYesCount"),
c=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridHelpfulNoCount"),
g=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridHelpfulYesLink"),
h=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridHelpfulNoLink"),
j=WinStore.UI.ReviewGrid._votingState[i]===WinStore.RRR.HelpfulVoteState.yes,
k=WinStore.UI.ReviewGrid._votingState[i]===WinStore.RRR.HelpfulVoteState.no,
e=a.getAttribute("yes"),
f=a.getAttribute("no"),
d=a.getAttribute("aria-label");
if(j)
{
e++;
if(g)
g.disabled=true
}
if(k)
{
f++;
if(h)
h.disabled=true
}
if(b)
if(e>0)
{
b.innerText="( %1 )".replace("%1",WinStore.RRR.formatNumber(e));
b.style.display="block"
}
else
b.style.display="none";
if(c)
if(f>0)
{
c.innerText="( %1 )".replace("%1",WinStore.RRR.formatNumber(f));
c.style.display="block"
}
else
c.style.display="none";
if(d)
{
d=this._updateHelpfulCountsInAriaText(d,e,f);
a.setAttribute("aria-label",d)
}
},_forEachControl:function(c,b,a)
{
b.every(function(d)
{
var b=WinStore.Utilities.firstChildByClassOrDefault(c,d);
b&&a&&
a(name,b);
return true
})
},_calcContentHeight:function(a,f)
{
for(var b=0,
e=a.innerHTML,
c=".",
d=1;d<f;d++)
c+="<br>.";
a.innerHTML=c;
b=a.clientHeight;
a.innerHTML=e;
return b
},_insertInlineProgress:function(c)
{
var b=document.createElement("span"),
a=document.createElement("progress");
a.setAttribute("aria-hidden","true");
a.className="win-ring";
b.appendChild(a);
c.appendChild(b)
},_createReviewDataSource:function(g,d,e,f,b,c)
{
this._dataSourceVersion++;
this._callbackCount=0;
var a=WinJS.Class.derive(WinJS.UI.VirtualizedDataSource,function(a)
{
this._baseDataSourceConstructor(a)
});
return new a(new WinStore.UI.ReviewDataAdapter(this,g,d,e,f,b,c))
},_hideReadmoreFlyout:function()
{
var a=document.getElementById("reviewGridReadMorePanel");
if(a)
{
var b=a.winControl;
b.hide()
}
},_showReadmoreFlyout:function(q,p)
{
var c=this;
if(!WinStore.PDP.getIsInAcquisition())
{
var a=document.getElementById("reviewGridReadMorePanel"),
f=document.getElementById("reviewGridReadMorePanelAnchor"),
s=window.getComputedStyle(document.body).direction==="ltr";
if(a)
{
var d=a.winControl;
if(d===null||d===undefined)
{
WinJS.UI.process(a);
d=a.winControl
}
var u=q.cloneNode(true);
reviewItemElementHTML=u.outerHTML.replace(/id=\"reviewGrid/g,'id="flyoutReviewGrid');
document.getElementById("reviewGridReadMorePanelContent").innerHTML=reviewItemElementHTML;
var g=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridTextContainer"),
k=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridReportLink"),
j=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridReviewTitleAndText"),
e=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridReadMoreLink"),
n=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridHelpfulYesLink"),
o=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridHelpfulNoLink"),
h=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridStatus"),
t=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridItemTemplate"),
m=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridRating"),
i=WinStore.Utilities.firstChildByClassOrDefault(a,"reviewGridAccountImage");
WinJS.Utilities.addClass(t,"reviewGridItemTemplateExpanded");
if(g)
{
WinJS.Utilities.addClass(g,"reviewGridTextExpanded");
g.style.height=""
}
if(k)
k.style.display="none";
if(e)
{
e.innerText="Show less";
e.addEventListener("click",function()
{
c._hideReadmoreFlyout();
return false
});
if(j)
{
var w=j.removeChild(e);
h.innerText="";
WinJS.Utilities.removeClass(h,"reviewGridRightAligned reviewErrorText");
h.appendChild(w)
}
}
n&&
n.addEventListener("click",function()
{
c._hideReadmoreFlyout();
c._onHelpfulnessVote(p,"yes")
});
o&&
o.addEventListener("click",function()
{
c._hideReadmoreFlyout();
c._onHelpfulnessVote(p,"no")
});
var l=m.getAttribute("rating");
if(l)
{
var y=WinStore.RRR.normalizeRatingValue(l),
v=new WinJS.UI.Rating(m,{disabled:true,userRating:y});
v.element.tabIndex=-1
}
var r=i.getAttribute("imgsrc");
if(r)
{
i.setAttribute("src",r);
WinJS.UI.Animation.fadeIn(i)
}
}
var b=WinJS.Utilities.getPosition(q);
if(b.top+580>window.innerHeight)
b.top-=280;
if(b.left<0)
if(this._scrollContainerBy)
{
this._scrollContainerBy((s?1:-1)*(b.left-15));
b.left=15
}
if(b.left+495>window.innerWidth)
{
var x=window.innerWidth-b.left;
b.left=window.innerWidth-495;
this._scrollContainerBy&&
this._scrollContainerBy((s?1:-1)*(495-x))
}
f.style.top=b.top-2+"px";
f.style.left=b.left-2+"px";
d.show(f,"bottom","left")
}
},_initializeReportReviewMenu:function()
{
var a=document.getElementById("reviewGridReportMenu");
if(a&&a.style.visibility!=="visible")
{
var e=[];
if(om.namespace)
if(om.namespace.rapReviewCategories&&Array.isArray(om.namespace.rapReviewCategories))
for(var f=om.namespace.rapReviewCategories.length,
d=0;d<f;d++)
{
var c=new WinJS.UI.MenuCommand;
c.label=om.namespace.rapReviewCategories[d].name;
c.problemType=om.namespace.rapReviewCategories[d].id.toString();
c.onclick=this._onSubmitReportReviewProblem;
e.push(c)
}
var b=a.winControl;
if(b===null||b===undefined)
{
WinJS.UI.process(a);
b=a.winControl
}
b.commands=e
}
},_showReportReviewProblemMenu:function(b)
{
if(!WinStore.PDP.getIsInAcquisition())
{
var a=document.getElementById("reviewGridReportMenu");
if(a)
{
var c=document.getElementById("reviewGridReportLink"+b);
if(c)
{
WinStore.Search.SetEnableTypeToSearch(false);
a.winControl.addEventListener("afterhide",function()
{
WinStore.Search.SetEnableTypeToSearch(true)
});
a.winControl.reviewID=b;
a.winControl.parentReviewGrid=this;
a.winControl.show(c)
}
}
}
},_onSubmitReportReviewProblem:function(j)
{
var d=j.target.winControl,
b=this._parentFlyout.parentReviewGrid;
if(d)
{
var g=d._parentFlyout;
if(g)
{
var a=g.reviewID,
f=d.problemType,
c=document.getElementById("reviewGridItem"+a),
h=document.getElementById("reviewGridReportProgress"+a),
m=document.getElementById("reviewGridReportText"+a),
e=document.getElementById("reviewGridReportLink"+a),
i=document.getElementById("reviewGridStatus"+a);
om.logInfoMessage("WinStore.ReviewGrid: _onSubmitReportReviewProblem: for review "+a);
om.etwRrrSubmitReportReviewStart(b._appId,a);
c.setAttribute("aria-label-save",c.getAttribute("aria-label"));
c.setAttribute("aria-label","");
c.focus();
b._resetReviewItemStatus(a);
WinJS.Utilities.addClass(i,"reviewGridLeftAligned");
b._insertInlineProgress(h);
b._enableReviewItemActions(a,c,false);
if(e)
e.style.display="none";
var k={reviewGrid:b,reviewDataSourceVersion:b._dataSourceVersion,reviewID:a};
om.submitReviewProblem(b._appId,a,f,"",b._onReportReviewComplete,k);
var l={"App.Id":WinStore.PDP._biData["App.Id"],"App.PurchaseStatus":WinStore.PDP._biData["App.PurchaseStatus"],iType:f};
WinStore.BI.logCustomBI("ReviewProblemReport",l)
}
}
},_onReportReviewComplete:function(h,a)
{
om.logInfoMessage("_onReportReviewComplete: result is "+h+" and context is "+a.reviewID);
if(a.reviewDataSourceVersion!==a.reviewGrid._dataSourceVersion)
{
om.logInfoMessage("_onReportReviewComplete: ignoring response for dataSourceVersion="+a.reviewDataSourceVersion+". Current version="+reviewGrid.reviewDataSourceVersion);
om.etwRrrSubmitReportReviewStop(reviewGrid._appId,a.reviewID);
return
}
var g=parseInt(h),
b=a.reviewID,
f=document.getElementById("reviewGridReportLink"+b),
e=document.getElementById("reviewGridReportProgress"+b),
c=document.getElementById("reviewGridStatus"+b),
d=document.getElementById("reviewGridItem"+b);
if(e)
e.innerHTML="";
if(c)
{
a.reviewGrid._resetReviewItemStatus(b);
if(g===WinStore.RRR.SqrResult.success)
{
WinJS.Utilities.addClass(c,"reviewGridRightAligned");
c.innerText="Thanks for reporting this review."
}
else
{
if(g===WinStore.RRR.SqrResult.failure)
{
c.innerText="There was an error. Please try again later.";
WinJS.Utilities.addClass(c,"reviewGridLeftAligned reviewErrorText")
}
if(f)
f.style.display="block"
}
}
if(d)
{
d.setAttribute("aria-label",d.getAttribute("aria-label-save"));
d.removeAttribute("aria-label-save");
a.reviewGrid._enableReviewItemActions(a.reviewID,d,true)
}
om.etwRrrSubmitReportReviewStop(a.reviewGrid._appId,b)
},_onHelpfulnessVote:function(a,d)
{
om.etwRrrSubmitHelpfulnessVoteStart(this._appId,a);
var b=document.getElementById("reviewGridItem"+a),
c=document.getElementById("reviewGridStatus"+a);
b.setAttribute("aria-label-save",b.getAttribute("aria-label"));
b.setAttribute("aria-label","");
b.focus();
this._resetReviewItemStatus(a);
WinJS.Utilities.addClass(c,"reviewGridLeftAligned");
this._insertInlineProgress(c);
this._enableReviewItemActions(a,b,false);
var e={reviewGrid:this,reviewDataSourceVersion:this._dataSourceVersion,reviewID:a,vote:d};
om.setHelpfulnessVote(this._appId,a,d==="yes",this._onHelpfulnessVoteComplete,e)
},_resetReviewItemStatus:function(b)
{
var a=document.getElementById("reviewGridStatus"+b);
if(a)
{
a.innerHTML="";
WinJS.Utilities.removeClass(a,"reviewGridLeftAligned reviewGridRightAligned reviewErrorText")
}
},_onHelpfulnessVoteComplete:function(f,a)
{
om.logInfoMessage("_onHelpfulnessVoteComplete: result is: "+f+"' and context is "+a.reviewID);
if(a.reviewDataSourceVersion!==a.reviewGrid._dataSourceVersion)
{
om.logInfoMessage("_onHelpfulnessVoteComplete: ignoring response for dataSourceVersion="+a.reviewDataSourceVersion+". Current version="+reviewGrid.reviewDataSourceVersion);
om.etwRrrSubmitHelpfulnessVoteStop(a.reviewGrid._appId,a.reviewID);
return
}
var b=a.reviewID,
d=parseInt(f),
c=document.getElementById("reviewGridItem"+b),
e=document.getElementById("reviewGridStatus"+b);
if(e)
{
a.reviewGrid._resetReviewItemStatus(b);
if(d===WinStore.RRR.SqrResult.success||d===WinStore.RRR.SqrResult.failure)
if(d===WinStore.RRR.SqrResult.success)
WinStore.UI.ReviewGrid._votingState[b]=a.vote==="yes"?WinStore.RRR.HelpfulVoteState.yes:WinStore.RRR.HelpfulVoteState.no;
else
if(d===WinStore.RRR.SqrResult.failure)
{
WinJS.Utilities.addClass(e,"reviewGridLeftAligned reviewErrorText");
e.innerText="There was an error. Please try again later."
}
}
c.setAttribute("aria-label",c.getAttribute("aria-label-save"));
c.removeAttribute("aria-label-save");
a.reviewGrid._enableReviewItemActions(b,c,true);
a.reviewGrid._refreshHelpfulDisplay(b,c);
om.etwRrrSubmitHelpfulnessVoteStop(a.reviewGrid._appId,b)
},_getRatingSummaryElementById:function(a)
{
return document.getElementById(a+this._controlId.toString())
},_totalReviews:0,_dataSourceVersion:0,_callbackCount:0,_reviewDataLoading:false,_sortOrder:"newest",_filter:"all",_versionFilter:"all",_controlId:0,_appId:null,_releaseId:null,_listViewControl:null,_imageUrlData:null,_adjustTotalReviewCount:null,_scrollContainerBy:null},{_getNextControlId:function()
{
return WinStore.UI.ReviewGrid._controlCount++
},_controlCount:1,_votingState:[]}),ReviewDataAdapter:WinJS.Class.define(function(c,g,d,e,f,a,b)
{
this._appId=g;
this._releaseId=d;
this._sortOrder=e;
this._filter=f;
this._versionFilter=a;
this._totalReviews=b;
this._reviewGrid=c
},{itemsFromIndex:function(b,c,d)
{
var a=this;
return new WinJS.Promise(function(g,j)
{
om.etwRrrReviewListLoadPageStart(a._appId,"index="+b+", countBefore="+c+", countAfter="+d);
if(b<a._totalReviews)
{
var e=parseInt(b/WinStore.RRR.SqrReviewPageSize),
f=Math.max(b-c,e*WinStore.RRR.SqrReviewPageSize),
h=Math.min(Math.min(b+d,a._totalReviews-1),(e+1)*WinStore.RRR.SqrReviewPageSize-1),
i={index:b,startIndex:f,endIndex:h,complete:g,reviewGrid:a._reviewGrid,dataAdapter:a,pageStartIndex:e*WinStore.RRR.SqrReviewPageSize,currentPage:e,appId:a._appId};
om.getAppReviewList(a._appId,a._releaseId,a._filter,a._versionFilter,a._sortOrder,f,1).done(function(b)
{
a.onGetAppReviewListResult(b,i)
})
}
else
j(new WinJS.ErrorFromName(WinJS.UI.FetchError.doesNotExist))
})
},getCount:function()
{
return new WinJS.Promise.wrap(this._totalReviews)
},onGetAppReviewListResult:function(l,a)
{
var i=l.reviews,
c=i.length,
o=a.startIndex,
j=[],
d=navigator.userLanguage,
k=d.indexOf("_");
if(k!==-1)
d=d.substring(0,k);
var n=new Intl.DateTimeFormat(d,{weekday:"long",year:"numeric",month:"long",day:"numeric"});
a.reviewGrid._callbackCount++;
a.reviewGrid._callbackCount===1&&
om.etwRrrReviewListSortStop(a.appId);
om.etwRrrReviewListLoadPageStop(a.appId,"index="+a.index+",startIndex="+a.startIndex+",endIndex="+a.endIndex);
if(c==0||Math.floor((a.dataAdapter._totalReviews-1)/WinStore.RRR.SqrReviewPageSize)==a.currentPage)
{
var m=a.endIndex-a.startIndex+1,
f=c+a.currentPage*WinStore.RRR.SqrReviewPageSize;
if(c<m)
{
a.dataAdapter._totalReviews=f;
a.reviewGrid._totalReviews=f;
a.reviewGrid._adjustTotalReviewCount&&
a.reviewGrid._adjustTotalReviewCount(f)
}
}
for(var e=0;e<c;e++)
{
var b=i[e],
g=e+a.pageStartIndex;
if(b&&g>=a.startIndex&&g<=a.endIndex)
{
var h=WinStore.Utilities.parseDateJSON(b.updateDate);
j.push({key:"key"+b.reviewId+"i"+g,data:{reviewID:b.reviewId.toString(),reviewer:b.orderedBasicName&&b.orderedBasicName.length>0?b.orderedBasicName:b.authorName,image:b.authorImgUrl,version:b.appVersion!=="False"?"trial":"",title:b.title,date:h?n.format(h):"",text:b.comments,helpfulCount:b.helpfulVotes,totalCount:b.totalVotes,rating:b.rating}})
}
}
a.complete({items:j,offset:a.index-a.startIndex,totalCount:a.dataAdapter._totalReviews,absoluteIndex:a.index})
},_totalReviews:0,_appId:null,_releaseId:null,_sortOrder:"newest",_filter:"all",_versionFilter:"all",_reviewGrid:null},{})});
var problemState={maxCommentCharacters:500,appID:"",userCID:"",pageUrl:"",problemBIData:{"App.Id":0,"App.AvgRating":0,CatId:0,SCatId:0,PStat:0,IType:0}};
WinJS.Namespace.define("WinStore.ReportProblemPage",{onReportProblemLoad:function(a)
{
WinJS.Promise.join({userCID:om.getUserCID(),page:om.getTravelLogCurrentPageData()}).done(function(b)
{
om.logInfoMessage("WinStore.ReportProblemPage.onReportProblemLoad: pageData: "+b.page.data);
var m=WinStore.BI.getPageId();
m&&
WinStore.BI.addMetaToHead("MS.PageId",m);
var i=WinStore.Utilities.getUrlParam(b.page.data,"cid");
if(i!==""&&i!=b.userCID)
{
om.goBack();
return
}
document.getElementById("problemPageTitle").innerText="Report app to Microsoft";
var c=document.getElementById("problemContentEdit");
c.title="Enter a comment. %1 characters or less.".replace("%1",problemState.maxCommentCharacters);
c.setAttribute("maxLength",problemState.maxCommentCharacters);
c.addEventListener("keydown",WinStore.ReportProblemPage.onProblemCommentsChanged,false);
c.addEventListener("keyup",WinStore.ReportProblemPage.onProblemCommentsChanged,false);
c.addEventListener("textinput",WinStore.ReportProblemPage.onProblemCommentsChanged,false);
c.addEventListener("DOMCharacterDataModified",function()
{
setTimeout("WinStore.ReportProblemPage.onProblemCommentsChanged()",150)
},false);
c.addEventListener("paste",function()
{
setTimeout("WinStore.ReportProblemPage.onProblemCommentsChanged()",150)
},false);
c.addEventListener("cut",function()
{
setTimeout("WinStore.ReportProblemPage.onProblemCommentsChanged()",150)
},false);
WinStore.PDP.setAppProblemReported(false);
problemState.pageUrl=b.page.url;
problemState.appID=WinStore.Utilities.getUrlParam(a,"pid").toLowerCase();
problemState.userCID=b.userCID;
problemState.problemBIData["App.Id"]=problemState.appID.replace("{","").replace("}","");
var n={"App.Id":problemState.problemBIData["App.Id"]};
WinStore.ReportProblemPage.fillCategoryList();
WinStore.ReportProblemPage.configureTermsLink();
if(b.page.data&&b.page.data!=="")
{
var j=WinStore.Utilities.getUrlParam(b.page.data,"rate");
if(j)
problemState.problemBIData["App.AvgRating"]=WinStore.Utilities.getBIRating(j);
var k=WinStore.Utilities.getUrlParam(b.page.data,"catid");
if(k)
problemState.problemBIData.CatId=k;
var g=WinStore.Utilities.getUrlParam(b.page.data,"subcatid");
if(g)
problemState.problemBIData.SCatId=g;
var l=WinStore.Utilities.getUrlParam(b.page.data,"pstat");
if(l)
problemState.problemBIData.PStat=l;
var h=WinStore.Utilities.getUrlParam(b.page.data,"c");
if(h)
document.getElementById("problemContentEdit").value=decodeURIComponent(h);
var f=parseInt(WinStore.Utilities.getUrlParam(b.page.data,"ri"),10);
if(!isNaN(f))
{
if(f!==-1)
document.getElementById("problemReason").selectedIndex=f+1;
WinStore.ReportProblemPage.onProblemReasonChange()
}
}
else
if(WinStore.PDP.getCurrentAppExtendedMetadata())
{
var d=WinStore.PDP.getCurrentAppExtendedMetadata();
problemState.problemBIData["App.AvgRating"]=WinStore.Utilities.getBIRating(d.Rating);
problemState.problemBIData.CatId=d.CategoryId;
if(d.SubCategoryId!==undefined)
problemState.problemBIData.SCatId=d.SubCategoryId;
problemState.problemBIData.PStat=0;
var e=WinStore.PDP.getCurrentAppLicenseData();
if(e&&e.UserLicense&&e.UserLicense!=="NONE")
if(e.UserLicense==="FULL")
problemState.problemBIData.PStat=2;
else
problemState.problemBIData.PStat=1;
var o=WinStore.Utilities.getPromoBoundaryInMS(d.PromoEndDate);
if(o>0)
{
problemState.problemBIData[WinStore.BI.biFieldNames.AppIsPromotion]=1;
n[WinStore.BI.biFieldNames.AppIsPromotion]=1
}
}
else
{
om.logErrorMessage("ReportProblem: onReportProblemLoad: no appInfo object");
document.getElementById("problemReason").disabled=true;
document.getElementById("problemContentEdit").disabled=true
}
document.getElementById("problemProcessingText").style.display="none";
document.getElementById("problemProgressControl").style.visibility="hidden";
WinStore.ReportProblemPage.updateProblemCharacterCount();
WinStore.BI.firePageViewEvent(n);
om.etwRrrDisplaySubmitAppProblemPageStop(problemState.appID)
})
},onPageUnload:function(a)
{
WinStore.BI.removeMetaFromHead("MS.PageId");
!a&&
WinStore.ReportProblemPage.persistUserData()
},onStoreSuspend:function()
{
WinStore.ReportProblemPage.persistUserData()
},persistUserData:function()
{
var b=-1,
a=document.getElementById("problemReason");
if(a&&a.options[0].value!=="0")
b=a.selectedIndex;
var c="?cid="+problemState.userCID+"&rate="+problemState.problemBIData["App.AvgRating"]+"&catid="+problemState.problemBIData.CatId+"&subcatid="+problemState.problemBIData.SCatId+"&pstat="+problemState.problemBIData.PStat+"&c="+encodeURIComponent(document.getElementById("problemContentEdit").value)+"&ri="+b;
om.logInfoMessage("WinStore.ReportProblemPage.persistUserData: updating current page params: "+c);
om.updateTravelLogCurrentPageData(problemState.pageUrl,c)
},configureTermsLink:function()
{
var a=document.getElementById("problemTerms");
if(a)
{
WinJS.Utilities.addClass(a,"store-linkDefault");
a.addEventListener("click",WinStore.ReportProblemPage.onTermsLink,false);
a.tabIndex=0
}
},onTermsLink:function()
{
om.showSettingsPage("termsofuse")
},updateProblemCharacterCount:function()
{
var a=document.getElementById("problemContentEdit").value.length;
if(a<=problemState.maxCommentCharacters)
document.getElementById("problemCommentsTitle").innerText="Comments (%1/%2 characters)".replace("%1",WinStore.RRR.formatNumber(a)).replace("%2",WinStore.RRR.formatNumber(problemState.maxCommentCharacters));
else
document.getElementById("problemCommentsTitle").innerHTML=document.getElementById("problemOverCountTemplate").innerHTML.replace("%1",WinStore.RRR.formatNumber(a)).replace("%2",WinStore.RRR.formatNumber(problemState.maxCommentCharacters))
},updateProblemButtons:function()
{
var a=document.getElementById("problemContentEdit").value.length<=problemState.maxCommentCharacters&&document.getElementById("problemContentEdit").value.replace(/\s/g,"")!==""&&document.getElementById("problemReason").value!=="0";
document.getElementById("problemSubmitButton").disabled=!a
},onProblemCommentsChanged:function()
{
WinStore.ReportProblemPage.updateProblemButtons();
WinStore.ReportProblemPage.updateProblemCharacterCount()
},onProblemReasonChange:function()
{
var a=document.getElementById("problemReason");
if(a.value!=="0")
{
a.options[0].value==="0"&&
a.removeChild(a.options[0]);
WinStore.ReportProblemPage.updateProblemButtons()
}
},onProblemSubmitButton:function()
{
om.etwRrrSubmitAppProblemStart(problemState.appID);
WinStore.ReportProblemPage.updateProblemButtons();
if(!document.getElementById("problemSubmitButton").disabled)
{
document.getElementById("problemSubmitFailed").style.display="none";
document.getElementById("problemProcessingText").style.display="inline";
document.getElementById("problemProgressControl").style.visibility="visible";
document.getElementById("problemSubmitButton").disabled=true;
document.getElementById("problemCancelButton").disabled=true;
document.getElementById("problemContentEdit").disabled=true;
document.getElementById("problemReason").disabled=true;
document.getElementById("problemTerms").disabled=true;
problemState.problemBIData.IType=document.getElementById("problemReason").value;
WinStore.BI.logCustomBI("ProblemAppSubmit",problemState.problemBIData);
om.submitAppProblem(problemState.appID,encodeURIComponent(document.getElementById("problemReason").value),WinStore.Utilities.encodeCDATA(document.getElementById("problemContentEdit").value),WinStore.ReportProblemPage.onSubmitComplete)
}
},onSubmitComplete:function(a)
{
document.getElementById("problemProcessingText").style.display="none";
document.getElementById("problemProgressControl").style.visibility="hidden";
if(a===WinStore.RRR.SqrResult.success)
{
WinStore.PDP.setAppProblemReported(true);
om.goBack()
}
else
{
document.getElementById("problemSubmitButton").disabled=false;
document.getElementById("problemCancelButton").disabled=false;
document.getElementById("problemContentEdit").disabled=false;
document.getElementById("problemReason").disabled=false;
document.getElementById("problemTerms").disabled=false;
if(a===WinStore.RRR.SqrResult.failure)
document.getElementById("problemSubmitFailed").style.display="block";
om.etwRrrSubmitAppProblemStop(problemState.appID)
}
},fillCategoryList:function()
{
var b=document.getElementById("problemReason");
while(b.hasChildNodes())
b.removeChild(b.firstChild);
var a=document.createElement("option");
a.innerText="Select a reason";
a.value="0";
b.appendChild(a);
if(om.namespace)
if(om.namespace.rapAppCategories&&Array.isArray(om.namespace.rapAppCategories))
for(var d=om.namespace.rapAppCategories.length,
c=0;c<d;c++)
{
a=document.createElement("option");
a.innerText=om.namespace.rapAppCategories[c].name;
a.value=om.namespace.rapAppCategories[c].id.toString();
b.appendChild(a)
}
}});
var SettingsSignIn={never:0,asNeeded:1,always:2};
WinJS.Namespace.define("WinStore.Settings",{signedIn:{value:false,writable:true},settingsPage:{value:null,writable:true},piContext:{value:null,writable:true},identityDataReturned:{value:false,writable:true},settingsChanged:{value:false,writable:true},alwaysPromptOnPurchase:{value:true,writable:true},toggleLanguage:{value:null,writable:true},toggleAccessibility:{value:null,writable:true},toggleAlwaysPrompt:{value:null,writable:true},toggleAutoUpdate:{value:null,writable:true},paymentSetupError:{value:false,writable:true},langFilterChanged:{value:false,writable:true},toggleRecommendations:{value:null,writable:true},onPageLoad:function(a)
{
window.addEventListener("keydown",WinStore.Settings.onKeyDown,false);
om.logInfoMessage("WinStore.Settings.onPageLoad: params = "+a);
this.settingsPage=WinStore.Utilities.getUrlParam(a,"display");
this.piContext=WinStore.Utilities.getUrlParam(a,"pi_context");
om.logInfoMessage("WinStore.Settings.onPageLoad: pi_context = "+this.piContext);
var b=false;
switch(this.settingsPage)
{
case "help":
this.showHelp();
WinStore.BI.addMetaToHead("MS.PageId","Settings.TermsOfUse");
WinStore.BI.firePageViewEvent(null,null);
break;
case "termsofuse":
this.showTermsOfUse();
WinStore.BI.addMetaToHead("MS.PageId","Settings.Help");
WinStore.BI.firePageViewEvent(null,null);
break;
case "pisetup_redirect":
case "pisetup":
this.handlePaymentSetup(a);
break;
case "preferences":
WinStore.BI.addMetaToHead("MS.PageId","Settings.YourAccount");
b=true;
break;
case "apppreferences":
WinStore.BI.addMetaToHead("MS.PageId","Settings.Preferences");
b=true;
break;
case "appupdates":
WinStore.BI.addMetaToHead("MS.PageId","Settings.AppUpdates");
b=true;
break;
case "yourapps_redirect":
this.refresh();
break;
default:
om.logErrorMessage("WinStore.Settings.onPageLoad: Unknown page ID: "+String(a));
this.settingsPage="preferences";
WinStore.BI.onPageLoaded();
this.refresh()
}
if(b)
{
WinStore.BI.firePageViewEvent(null,null);
var d=WinStore.Utilities.getUrlParam(a,"chkUpdates");
if(d==="false")
document.getElementById("settingsCheckUpdatesButton").disabled=true;
var c=WinStore.Utilities.getUrlParam(a,"sauChangeEnabled");
if(c==="false")
{
document.getElementById("settingsAutoUpdateToggle").disabled=true;
document.getElementById("settingsSAUPolicyInEffect").style.display="block"
}
else
document.getElementById("settingsSAUPolicyInEffect").style.display="none";
WinStore.Settings.configureCSVTermsLink();
this.refresh()
}
},onPageUnload:function()
{
window.removeEventListener("keydown",WinStore.Settings.onKeyDown,false);
WinStore.BI.removeMetaFromHead("MS.PageId");
om.logInfoMessage("WinStore.Settings.onPageUnload: saving = "+(this.signedIn&&this.settingsChanged));
if(this.signedIn&&this.settingsChanged)
{
WinStore.Settings.save(false);
this.langFilterChanged&&
WinStore.Navigation.onLangFilterChanged()
}
},initializeRefresh:function()
{
switch(this.settingsPage)
{
case "apppreferences":
WinStore.Frame.setPageTitle("Preferences",false);
break;
case "appupdates":
WinStore.Frame.setPageTitle("App updates",false);
break;
case "yourapps_redirect":
WinStore.Frame.setPageTitle("My apps",false);
break;
case "preferences":
default:
WinStore.Frame.setPageTitle("My account",false)
}
document.getElementById("settingsContentHelp").style.display="none";
document.getElementById("settingsContentSettings").style.display="none";
document.getElementById("settingsLoading").style.visibility="visible";
WinStore.Settings.hideElementById("settingsPIDetails");
this.signedIn=false;
this.identityDataReturned=false;
this.settingsChanged=false;
this.alwaysPromptOnPurchase=true;
this.paymentSetupError=false;
this.langFilterChanged=false
},refresh:function()
{
this.initializeRefresh();
this.loadIdentity(false,function()
{
om.getSettings(WinStore.Settings.showIdentityResults)
})
},hideSettings:function()
{
om.goBack()
},loadIdentity:function(b,a)
{
om.getConnectedAccountDetails(function(b)
{
if(b.fSuccess)
om.getStoreAccountDetails(function(c)
{
if(c.fSuccess)
{
if(c.cid===b.cid)
{
document.getElementById("settingsUserEmail").innerText=c.signInName;
document.getElementById("settingsChangeUserMessage").innerText="Sign in with a different account";
WinStore.Settings.hideElementById("settingsSignOutButton");
WinStore.Settings.showElementById("settingsChangeUserMessage");
WinStore.Settings.showElementById("settingsChangeUserButton")
}
else
{
document.getElementById("settingsUserEmail").innerText=c.signInName;
document.getElementById("settingsChangeUserMessage").innerText="Switch back to %1".replace("%1",b.signInName);
WinStore.Settings.hideElementById("settingsSignOutButton");
WinStore.Settings.showElementById("settingsChangeUserMessage");
WinStore.Settings.showElementById("settingsChangeUserButton")
}
a()
}
else
a()
});
else
om.getStoreAccountDetails(function(b)
{
if(b.fSuccess)
{
document.getElementById("settingsUserEmail").innerText=b.signInName;
WinStore.Settings.showElementById("settingsSignOutButton");
WinStore.Settings.hideElementById("settingsChangeUserMessage");
WinStore.Settings.hideElementById("settingsChangeUserButton");
a()
}
else
a()
})
})
},showIdentityResults:function(a)
{
WinStore.Settings.identityDataReturned=true;
if(!a||!a.Email||a.Email.toString()==="")
{
WinStore.Settings.signedIn=false;
om.etwSettingsPageLoadComplete()
}
else
{
WinStore.Settings.signedIn=true;
WinStore.Settings.settingsPage==="yourapps_redirect"&&
om.showReacquirePage();
document.getElementById("settingsUserEmail").innerText=a.Email;
var c=String(a.FilterLanguage)==="true",
b=document.getElementById("settingsFilterLanguageToggle");
WinStore.Settings.toggleLanguage=new WinJS.UI.ToggleSwitch(b,{checked:c,labelOn:"Yes",labelOff:"No",title:"Make it easier to find apps in my preferred languages",onchange:function()
{
WinStore.Settings.langFilterChanged=WinStore.Settings.toggleLanguage.checked!==c;
WinStore.Settings.onToggleChange(null)
}});
b=document.getElementById("settingsFilterAccessibilityToggle");
WinStore.Settings.toggleAccessibility=new WinJS.UI.ToggleSwitch(b,{checked:String(a.FilterAccessibility)==="true",labelOn:"Yes",labelOff:"No",title:"Make it easier to find apps that include accessibility features",onchange:WinStore.Settings.onToggleChange});
b=document.getElementById("settingsFilterRecommendationsToggle");
WinStore.Settings.toggleRecommendations=new WinJS.UI.ToggleSwitch(b,{checked:String(a.FilterRecommendations)==="false",labelOn:"On",labelOff:"Off",title:"Recommend apps for me on this PC",onchange:WinStore.Settings.onToggleChange});
document.getElementById("settingsSAUMeteredNetworkWarning").style.display=String(a.AutoInstallUpdates)==="true"?"block":"none";
b=document.getElementById("settingsAutoUpdateToggle");
WinStore.Settings.toggleAutoUpdate=new WinJS.UI.ToggleSwitch(b,{disabled:b.disabled,checked:String(a.AutoInstallUpdates)==="true",labelOn:"Yes",labelOff:"No",title:"Automatically update my apps",onchange:WinStore.Settings.onToggleChange});
WinStore.Settings.alwaysPromptOnPurchase=a.AlwaysPromptOnPurchase;
b=document.getElementById("settingsAlwaysPromptToggle");
WinStore.Settings.toggleAlwaysPrompt=new WinJS.UI.ToggleSwitch(b,{checked:String(a.AlwaysPromptOnPurchase)==="true",labelOn:"Yes",labelOff:"No",title:"Always ask for your password when buying an app",onchange:WinStore.Settings.onAlwaysPromptChanged});
WinStore.Settings.toggleLanguage.checked=String(a.FilterLanguage)==="true";
WinStore.Settings.toggleAccessibility.checked=String(a.FilterAccessibility)==="true";
WinStore.Settings.toggleAutoUpdate.checked=String(a.AutoInstallUpdates)==="true";
WinStore.Settings.toggleAlwaysPrompt.checked=String(a.AlwaysPromptOnPurchase)==="true";
WinStore.Settings.toggleRecommendations.checked=String(a.FilterRecommendations)==="false";
WinStore.Settings.settingsChanged=false;
WinStore.Settings.loadMachines();
if(om.namespace&&om.namespace.marketFreeOnly===1)
{
document.getElementById("settingsPaymentTitle").style.display="none";
document.getElementById("settingsPaymentLoading").style.display="none";
document.getElementById("settingsPIDetails").style.display="none";
document.getElementById("settingsAlwaysPromptToggle").style.display="none";
om.logInfoMessage("WinStore.Settings.showIdentityResults: hiding payment information for free-only market")
}
else
{
WinStore.Settings.showElementById("settingsPaymentLoading");
om.getPaymentSettings(WinStore.Settings.showPIResults)
}
}
document.getElementById("settingsPageYourAccount").style.display=WinStore.Settings.settingsPage==="preferences"?"block":"none";
document.getElementById("settingsPageAppPreferences").style.display=WinStore.Settings.settingsPage==="apppreferences"?"block":"none";
document.getElementById("settingsPageAppUpdates").style.display=WinStore.Settings.settingsPage==="appupdates"?"block":"none";
document.getElementById("settingsSignIn").style.display=WinStore.Settings.signedIn?"none":"block";
document.getElementById("settingsSignedIn").style.display=WinStore.Settings.signedIn?"block":"none";
document.getElementById("settingsLoading").style.visibility="hidden";
document.getElementById("settingsContentSettings").style.display="block";
WinStore.BI.refreshSigninState()
},onToggleChange:function(a)
{
if(WinStore.Settings.toggleAutoUpdate)
document.getElementById("settingsSAUMeteredNetworkWarning").style.display=WinStore.Settings.toggleAutoUpdate.checked?"block":"none";
WinStore.Settings.settingsChanged=true;
if(a&&a.currentTarget&&a.currentTarget.id==="settingsFilterRecommendationsToggle")
{
var b=WinStore.Settings.toggleRecommendations.checked?"show":"hide";
om.logInfoMessage("WinStore.Settings.onToggleChange: recommendations filter changed. Updating NavBar to "+b+" Picks for You");
WinStore.Frame.initNavBar(WinStore.Settings.toggleRecommendations.checked,true);
WinStore.Navigation.invalidateHomePage()
}
},onKeyDown:function(a)
{
a.altKey&&a.key==="v"&&
WinStore.Settings.showVersion()
},showVersion:function()
{
if(WinStore.Settings.identityDataReturned)
{
var a=document.getElementById("settingsPageVersion");
a&&a.innerText===""&&
om.getBI(WinStore.Settings.showVersionBI)
}
},showVersionBI:function(a)
{
if(a)
{
var c=document.getElementById("settingsPageVersion");
if(c&&c.innerText==="")
{
while(c.hasChildNodes())
c.removeChild(c.firstChild);
var b=function(b)
{
var a=document.createElement("div");
a.innerText=b;
c.appendChild(a)
};
if(a.StoreClientVersion&&a.StorePagesVersion)
{
var e="Version: "+a.StoreClientVersion+"-"+a.StorePagesVersion,
d=a.StoreFlightId;
if(d!==undefined&&d!==null&&d!=="0")
e+="."+d;
b(e)
}
a.OsBuildVer&&
b("Build: "+a.OsBuildVer);
a.OsQfeNum&&
b("QFE: "+a.OsQfeNum);
a.OsAppModel&&
b("App Model: "+a.OsAppModel);
a.SelfhostUser!==undefined&&a.SelfhostUser!==null&&
b("MSA: "+(a.SelfhostUser?"self-host":"public"));
a.Location&&
b("Market: "+a.Location);
a.Language&&
b("Locale: "+a.Language);
om.namespace&&om.namespace.environment&&
b("Environment: "+om.namespace.environment);
c.style.display=c.hasChildNodes()?"block":"none"
}
}
},savedPIResults:null,showPIResults:function(a)
{
WinStore.Settings.savedPIResults=a;
if(WinStore.Settings.silentRedeemRequired)
{
WinStore.Settings.silentRedeemRequired=false;
om.redeemStoredValueToken(WinStore.Settings.onRedeemStoredValueResponse,"silentredeem")
}
else
{
WinStore.Settings.hideElementById("settingsPaymentLoading");
WinStore.Settings.showElementById("settingsPIDetails");
var e=false,
b="",
d="",
f=true;
if(a&&a.storedValue&&a.storedValue.supported)
{
e=true;
b=a.storedValue.balance;
if(b&&b!==""&&b!=="0"&&b!=="0.00"&&b!=="0.0")
{
f=false;
d=a.storedValue.formattedBalance;
om.logInfoMessage("WinStore.Settings.showPIResults: CSV balance: "+d)
}
else
om.logInfoMessage("WinStore.Settings.showPIResults: CSV balance was 0 ("+b+")")
}
var g=document.getElementById("settingsPaymentStoredValueBalance");
if(a&&a.name&&a.name.toString()!=="")
{
om.logInfoMessage("WinStore.Settings.showPIResults: Payment Method type is "+a.pitype);
var h=a.name,
c="";
WinStore.Settings.hideElementById("settingsPaymentDefaultPIError");
WinStore.Settings.showElementById("settingsPaymentDefaultPIDetails");
WinStore.Settings.showElementById("settingsChangeDefaultPaymentLink");
WinStore.Settings.showElementById("settingsViewBillingLink");
WinStore.Settings.hideElementById("settingsAddPaymentButton");
WinStore.Settings.showElementById("settingsRemovePILink");
if(a.pitype.toLowerCase()=="ap")
h="Alipay";
else
if(a.expiration&&a.expiration.toString()!=="")
if(a.description1&&a.description1.toString()!="")
c="************ %1 (expires %2)".replace("%1",a.description1).replace("%2",a.expiration);
else
c="************ %1 (expires %2)".replace("%1",a.name).replace("%2",a.expiration);
else
if(a.description1&&a.description1.toString()!="")
c=a.description1;
else
c=a.name;
var k=document.getElementById("settingsPaymentDefaultPIDetails");
if(k)
k.innerText=h+(h&&c?"   ":"")+c;
if(e&&!f)
{
if(g)
g.innerText=d;
WinStore.Settings.showElementById("settingsPaymentStoredValue");
WinStore.Settings.showElementById("settingsPaymentStoredValueUsageMessage");
WinStore.Settings.showElementById("settingsPaymentStoredValueBillingHistoryLink")
}
else
WinStore.Settings.hideElementById("settingsPaymentStoredValue")
}
else
{
WinStore.Settings.hideElementById("settingsPaymentDefaultPIDetails");
WinStore.Settings.showElementById("settingsPaymentDefaultPIError");
WinStore.Settings.hideElementById("settingsViewBillingLink");
WinStore.Settings.hideElementById("settingsChangeDefaultPaymentLink");
WinStore.Settings.showElementById("settingsAddPaymentButton");
WinStore.Settings.hideElementById("settingsRemovePILink");
var j=document.getElementById("settingsDefaultPIErrorMsg");
if(j)
j.innerText="Before you can purchase an app you need to add a payment method to your account.";
if(e&&!f)
{
if(g)
g.innerText=d;
WinStore.Settings.showElementById("settingsPaymentStoredValue");
WinStore.Settings.hideElementById("settingsPaymentStoredValueUsageMessage");
WinStore.Settings.showElementById("settingsPaymentStoredValueBillingHistoryLink");
WinStore.Settings.hideElementById("settingsPaymentDefaultPIError");
var i=document.getElementById("settingsAddPaymentButton");
i&&
WinJS.Utilities.removeClass(i,"settingsMarginTop")
}
else
WinStore.Settings.hideElementById("settingsPaymentStoredValue")
}
WinStore.Settings.paymentSetupError&&
WinStore.Settings.showPaymentSetupError(e&&!f)
}
},onRedeemStoredValueResponse:function(a)
{
if(!WinStore.Frame.isOnPage("settingsFrame")||!WinStore.Frame.isShowingYourAccount())
return;
if(a&&a.piAttach)
{
if(a.showAddPaymentAccountProgressRing)
{
om.logInfoMessage("WinStore.Settings.onRedeemTokenButtonClicked: got piattach callback - need to show AddPI progress ring");
WinStore.Settings.hideElementById("settingsPIDetails");
WinStore.Settings.showElementById("settingsPaymentLoading")
}
else
if(a.finishedAddingPIAndRedeem)
{
WinStore.Settings.hideElementById("settingsRedeemTokenProgressSection");
WinStore.Settings.showElementById("settingsRedeemTokenTermsOfUse");
var d=document.getElementById("settingsRedeemTokenTextBox");
if(d)
d.value="";
var e=document.getElementById("settingsRedeemTokenButton");
if(e)
e.disabled=true;
om.logInfoMessage("WinStore.Settings.onRedeemTokenButtonClicked: got piattach callback - need to update top section - ADDPI result: "+a.success);
if(a.success)
{
WinStore.Settings.showElementById("settingsPaymentLoading");
om.getPaymentSettings(WinStore.Settings.showPIResults)
}
else
{
var b=WinStore.Settings.savedPIResults;
if(b)
{
if(!b.storedValue)
b.storedValue={supported:true,balance:"0.00",currencySymbol:"$",formattedBalance:"$0.00"};
if(b.storedValue.supported)
{
b.storedValue.balance=a.balance;
b.storedValue.currencySymbol=a.currencySymbol;
b.storedValue.formattedBalance=a.formattedBalance
}
WinStore.Settings.showPIResults(b);
WinStore.Settings.showPaymentSetupError(true);
WinStore.Settings.narratorReadAloudStoredValueBalance(b&&b.name&&b.name.toString()!=="")
}
else
om.logErrorMessage("WinStore.Settings.onRedeemTokenButtonClicked: Redeem was successful. PIResults information was not found.")
}
}
}
else
if(a)
{
WinStore.Settings.hideElementById("settingsRedeemTokenProgressSection");
if(a.success)
{
om.logInfoMessage("WinStore.Settings.onRedeemTokenButtonClicked: Redeem was successful. (New balance: "+a.formattedBalance+")");
var d=document.getElementById("settingsRedeemTokenTextBox");
if(d)
d.value="";
var e=document.getElementById("settingsRedeemTokenButton");
if(e)
e.disabled=true;
WinStore.Settings.showElementById("settingsRedeemTokenTermsOfUse");
var b=WinStore.Settings.savedPIResults;
if(b)
{
if(!b.storedValue)
b.storedValue={supported:true,balance:"0.00",currencySymbol:"$",formattedBalance:"$0.00"};
if(b.storedValue.supported)
{
b.storedValue.balance=a.balance;
b.storedValue.currencySymbol=a.currencySymbol;
b.storedValue.formattedBalance=a.formattedBalance
}
WinStore.Settings.showPIResults(b);
WinStore.Settings.narratorReadAloudStoredValueBalance(b&&b.name&&b.name.toString()!=="")
}
else
om.logErrorMessage("WinStore.Settings.onRedeemTokenButtonClicked: Redeem was successful. PIResults information was not found.")
}
else
{
var c=document.getElementById("settingsRedeemTokenErrorMessage");
if(a.pcsUrl)
{
om.logInfoMessage("WinStore.Settings.onRedeemTokenButtonClicked: Redeem failed with errorCode "+a.errorCode+". PCS required: "+a.pcsUrl);
var d=document.getElementById("settingsRedeemTokenTextBox");
if(d)
d.value="";
var e=document.getElementById("settingsRedeemTokenButton");
if(e)
e.disabled=true;
om.showPCS(WinStore.Settings.piContext)
}
else
{
om.logErrorMessage("WinStore.Settings.onRedeemTokenButtonClicked: Redeem failed with error "+a.errorCode);
if(c)
if(a.errorCode===442)
c.innerText="The code you entered can’t be used in your country or region.";
else
if(a.errorCode===441)
c.innerText="The code you entered couldn’t be redeemed. Check to make sure you entered it correctly, or try a different code.";
else
if(a.errorCode===443)
c.innerText="The code you entered has already been redeemed. Try entering a different code.";
else
if(a.errorCode===444)
c.innerText="The code you’re trying to use has expired.";
else
if(a.errorCode===446)
c.innerText="You’ve reached the limit on the amount of money you can redeem from gift cards in a single day.";
else
c.innerText="There was a problem redeeming your code. Please try again later.";
WinStore.Settings.showPIResults(WinStore.Settings.savedPIResults)
}
WinStore.Settings.hideElementById("settingsRedeemTokenTermsOfUse");
WinStore.Settings.showElementById("settingsRedeemTokenError");
c&&
WinStore.Utilities.readAloudAssertive(c.innerText)
}
}
else
{
om.logErrorMessage("WinStore.Settings.onRedeemTokenButtonClicked: The method om.redeemStoredValueToken did not return a JSON object ("+a+")");
var c=document.getElementById("settingsRedeemTokenErrorMessage");
if(c)
c.innerText="There was a problem redeeming your code. Please try again later.";
WinStore.Settings.hideElementById("settingsRedeemTokenTermsOfUse");
WinStore.Settings.showElementById("settingsRedeemTokenError");
c&&
WinStore.Utilities.readAloudAssertive(c.innerText)
}
},narratorReadAloudStoredValueBalance:function(f)
{
var a=document.getElementById("settingsPaymentStoredValueName"),
c=document.getElementById("settingsPaymentStoredValueBalance");
if(a&&a.innerText&&c&&c.innerText)
{
var d=a.innerText+" "+c.innerText;
if(f)
{
var b=document.getElementById("settingsPaymentStoredValueUsageMessage");
if(b&&b.innerText)
d=b.innerText+" "+d
}
WinStore.Utilities.readAloudRude(d);
var e=document.getElementById("settingsRedeemTokenTextBox");
e&&
e.focus()
}
},onRedeemTokenButtonClicked:function()
{
var a=document.getElementById("settingsRedeemTokenTextBox").value;
if(!WinStore.Settings.isValidRedeemToken(a))
{
om.logInfoMessage("WinStore.Settings.onRedeemTokenButtonClicked: Token was invalid. "+a);
return
}
WinStore.Settings.hideElementById("settingsRedeemTokenTermsOfUse");
WinStore.Settings.hideElementById("settingsRedeemTokenError");
WinStore.Settings.showElementById("settingsRedeemTokenProgressSection");
if(a.length===29)
if(!WinStore.Settings.savedPIResults||!WinStore.Settings.savedPIResults.storedValue)
{
om.logInfoMessage("WinStore.Settings.onRedeemTokenButtonClicked: Cannot confirm CSV supported");
WinStore.Settings.hideElementById("settingsRedeemTokenProgressSection");
document.getElementById("settingsRedeemTokenErrorMessage").innerText="There was a problem redeeming your code. Please try again later.";
WinStore.Settings.hideElementById("settingsRedeemTokenTermsOfUse");
WinStore.Settings.showElementById("settingsRedeemTokenError")
}
else
if(!WinStore.Settings.savedPIResults.storedValue.supported)
{
om.logInfoMessage("WinStore.Settings.onRedeemTokenButtonClicked: User does not support CSV");
WinStore.Settings.hideElementById("settingsRedeemTokenProgressSection");
document.getElementById("settingsRedeemTokenErrorMessage").innerText="The code you entered can’t be used in your country or region.";
WinStore.Settings.hideElementById("settingsRedeemTokenTermsOfUse");
WinStore.Settings.showElementById("settingsRedeemTokenError")
}
else
{
om.logInfoMessage("WinStore.Settings.onRedeemTokenButtonClicked: Begin stored value token redemption process");
om.redeemStoredValueToken(WinStore.Settings.onRedeemStoredValueResponse,a)
}
else
{
om.logInfoMessage("WinStore.Settings.onRedeemTokenButtonClicked: Begin developer gifting token redemption process");
var b=function(a)
{
WinStore.Settings.hideElementById("settingsRedeemTokenProgressSection");
if(a)
if(a.errorCode===0)
{
om.logInfoMessage("WinStore.Settings.onRedeemTokenButtonClicked: LookupToken succeeded");
WinStore.Settings.hideElementById("settingsRedeemTokenError");
WinStore.Settings.showElementById("settingsRedeemTokenTermsOfUse")
}
else
{
if(a.errorCode===3225371215)
{
om.logErrorMessage("WinStore.Settings.onRedeemTokenButtonClicked: LookupToken failed with InvalidToken error");
document.getElementById("settingsRedeemTokenErrorMessage").innerText="The code you entered couldn’t be redeemed. Check to make sure you entered it correctly, or try a different code."
}
else
{
om.logErrorMessage("WinStore.Settings.onRedeemTokenButtonClicked: LookupToken failed with error "+a.errorCode);
document.getElementById("settingsRedeemTokenErrorMessage").innerText="There was a problem redeeming your code. Please try again later."
}
WinStore.Settings.hideElementById("settingsRedeemTokenTermsOfUse");
WinStore.Settings.showElementById("settingsRedeemTokenError");
WinStore.Utilities.readAloudAssertive(document.getElementById("settingsRedeemTokenErrorMessage").innerText)
}
else
{
om.logErrorMessage("WinStore.Settings.onRedeemTokenButtonClicked: The method om.lookupToken did not return a JSON object ("+a+")");
document.getElementById("settingsRedeemTokenErrorMessage").innerText="There was a problem redeeming your code. Please try again later.";
WinStore.Settings.hideElementById("settingsRedeemTokenTermsOfUse");
WinStore.Settings.showElementById("settingsRedeemTokenError");
WinStore.Utilities.readAloudAssertive(document.getElementById("settingsRedeemTokenErrorMessage").innerText)
}
};
om.lookupToken(b,a)
}
},isValidRedeemToken:function(a)
{
if(a.length>=23&&(a.length-5)%6===0)
return true;
return false
},redeemTokenTextBoxSelectionStart:0,redeemTokenTextBoxSelectionEnd:0,redeemTokenTextBoxDashesSelected:0,redeemTokenTextBoxPreviousTotalLength:0,getRedeemTokenTextBoxEditInformation:function(a)
{
var b=document.getElementById("settingsRedeemTokenTextBox");
WinStore.Settings.redeemTokenTextBoxSelectionStart=b.selectionStart;
WinStore.Settings.redeemTokenTextBoxSelectionEnd=b.selectionEnd;
WinStore.Settings.redeemTokenTextBoxDashesSelected=0;
for(var c=WinStore.Settings.redeemTokenTextBoxSelectionStart;c<WinStore.Settings.redeemTokenTextBoxSelectionEnd;c++)
if(b.value[c]==="-")
WinStore.Settings.redeemTokenTextBoxDashesSelected++;
if(b.value==="")
WinStore.Settings.redeemTokenTextBoxPreviousTotalLength=0;
a&&a.keyCode==13&&a.type==="keyup"&&
WinStore.Settings.onRedeemTokenButtonClicked();
return !(a&&a.keyCode==13)
},onRedeemTokenTextBoxInput:function()
{
var h=35,
g=30,
c=document.getElementById("settingsRedeemTokenTextBox");
if(c&&c.value)
{
for(var a=c.value.toUpperCase(),
j=/^[0-9A-Z]$/,
i="",
b=0;b<a.length;b++)
if(a[b].match(j))
i+=a[b];
a=i;
var k=WinStore.Settings.redeemTokenTextBoxSelectionEnd-WinStore.Settings.redeemTokenTextBoxSelectionStart-WinStore.Settings.redeemTokenTextBoxDashesSelected,
e=a.length-WinStore.Settings.redeemTokenTextBoxPreviousTotalLength+k;
WinStore.Settings.redeemTokenTextBoxPreviousTotalLength=a.length>g?g:a.length;
var d=5;
while(a.length>d)
{
a=a.substring(0,d)+"-"+a.substring(d);
d+=6
}
if(a.length>h)
a=a.substring(0,h);
c.value=a;
for(var f=WinStore.Settings.redeemTokenTextBoxSelectionStart+e,
b=0;b<e;b++)
{
var l=a[WinStore.Settings.redeemTokenTextBoxSelectionStart+b];
if(l==="-")
{
f++;
e++
}
}
c.setSelectionRange(f,f);
document.getElementById("settingsRedeemTokenButton").disabled=!WinStore.Settings.isValidRedeemToken(a)
}
},configureCSVTermsLink:function()
{
var a=document.getElementById("redeemStoredValueTermsOfUseLink");
if(a)
{
WinJS.Utilities.addClass(a,"store-linkDefault");
a.addEventListener("click",WinStore.Settings.onCSVTermsLink,false);
a.tabIndex=0;
a.onkeydown=function()
{
if(event.keyCode==13)
{
WinStore.Settings.onCSVTermsLink();
return false
}
}
}
},onCSVTermsLink:function()
{
var a="http://go.microsoft.com/fwlink/?LinkID=311741";
om.showSettingsPage("termsofuse_csv",a)
},loadMachines:function()
{
document.getElementById("settingsYourComputersLoading").style.display="block";
document.getElementById("settingsYourComputers").style.display="none";
WinStore.Settings.hideElementById("settingsYourComputersWaitRequired");
var a=document.getElementById("settingsYourComputers");
while(a.hasChildNodes())
a.removeChild(a.firstChild);
om.getMachineList(WinStore.Settings.showMachinesResults)
},showMachinesResults:function(e)
{
document.getElementById("settingsYourComputersLoading").style.display="none";
document.getElementById("settingsYourComputers").style.display="block";
var k=e.devices,
q=k.length,
l=e.maxDevices,
p=e.isSlotOpen;
if(l)
document.getElementById("settingsYourComputersDescription").innerText="When you install an app on a PC from the Windows Store, the name of that PC will appear here. You can install the apps you get from the Store on %1 PCs.".replace("%1",l);
var b=0;
if(p===false)
{
var j=WinStore.Utilities.parseDateJSON(e.dateNextAdd);
if(j)
{
b=Math.round((j.getTime()-Date.now())/8.64e7);
if(b>0)
{
var o=document.getElementById("settingsYourComputersWaitRequired");
o.innerText="You need to wait %1 days before you can add another PC.".replace("%1",b);
WinStore.Settings.showElementById("settingsYourComputersWaitRequired")
}
}
}
for(var i=0;i<q;i++)
{
var c=k[i],
n=document.getElementById("settingsYourComputers"),
f=document.createElement("div");
f.className="win-type-medium settingsComputersName";
f.innerText=c.systemName;
var h=document.createElement("div");
h.className="settingsComputer";
h.appendChild(f);
var a=document.createElement("button");
a.innerText="Remove";
var m="Remove %1".replace("%1",c.systemName);
a.setAttribute("aria-label",m);
a.machineId=c.machineId;
a.systemName=c.systemName;
a.addEventListener("click",function()
{
var a=b>0?"You’ll need to wait %1 days before you can replace this PC.".replace("%1",b):"You won’t be able to use any of the apps you installed from the Windows Store on %1.".replace("%1",this.systemName);
om.showMessageDialog(a,"Do you want to remove %1 from this list?".replace("%1",this.systemName),[{id:0,text:"Confirm"},{id:1,text:"Cancel"}],1,function(a,b)
{
a===0&&
om.removeMachine(b,function(a)
{
a===true&&
WinStore.Settings.loadMachines()
})
},this.machineId)
},false);
var g=document.createElement("div");
g.className="settingsComputerRemove";
g.appendChild(a);
var d=document.createElement("div");
d.id=c.machineId;
d.appendChild(h);
d.appendChild(g);
n.appendChild(d)
}
om.etwSettingsPageLoadComplete()
},refreshNavBar:function()
{
om.getShowPicksForYou().done(function(a)
{
var b=a?"opted in":"opted out";
om.logInfoMessage("WinStore.Settings.refreshNavBar: personalization opt-out state: "+b);
WinStore.Frame.initNavBar(a,true)
});
WinStore.Navigation.invalidateHomePage()
},onSignIn:function()
{
this.initializeRefresh();
om.authenticateUser(SettingsSignIn.asNeeded,function()
{
WinStore.Settings.refresh();
WinStore.Settings.refreshNavBar()
})
},onSignOut:function()
{
om.signout();
WinStore.Settings.signedIn=false;
document.getElementById("settingsSignIn").style.display="block";
document.getElementById("settingsSignedIn").style.display="none";
WinStore.BI.refreshSigninState();
WinStore.Settings.refreshNavBar()
},onChangeUser:function()
{
om.signout();
WinStore.Settings.signedIn=false;
this.initializeRefresh();
om.authenticateUser(SettingsSignIn.asNeeded,function()
{
WinStore.Settings.refresh();
WinStore.Settings.refreshNavBar()
})
},onCheckUpdatesLink:function()
{
WinStore.BI.logCustomBI("Settings.UpdateCheck");
om.showUpdatesPage(true)
},showHelp:function()
{
WinStore.Frame.setPageTitle("Help");
var a="http://go.microsoft.com/fwlink/?LinkID=282462";
if(om.namespace&&om.namespace.lcid&&om.namespace.lcid!=="")
a+="&clcid=0x"+om.namespace.lcid;
om.logInfoMessage("settings.js: showHelp: showing help URL = "+a);
this.loadWebContent(a)
},showTermsOfUse:function()
{
WinStore.Frame.setPageTitle("Terms of Use");
var a="http://go.microsoft.com/fwlink/?LinkID=298979";
if(om.namespace&&om.namespace.market)
{
var b=om.namespace.market.toLowerCase();
switch(b)
{
case "tw":
a="http://go.microsoft.com/fwlink/?LinkID=299078";
break;
case "jp":
a="http://go.microsoft.com/fwlink/?LinkID=299079"
}
}
if(om.namespace&&om.namespace.lcid&&om.namespace.lcid!=="")
a+="&clcid=0x"+om.namespace.lcid;
om.logInfoMessage("settings.js: showTermsOfUse: showing terms of use URL = "+a);
this.loadWebContent(a)
},loadWebContent:function(a)
{
document.getElementById("settingsContentHelp").style.display="block";
document.getElementById("settingsContentSettings").style.display="none";
document.getElementById("settingsLoading").style.visibility="hidden";
document.getElementById("settingsHelpFrame").src=a
},save:function(c,b)
{
var a={filterLanguage:false,filterAccessibility:false,filterRecommendations:false,autoInstallUpdates:false,alwaysPromptOnPurchase:true};
a.filterLanguage=this.toggleLanguage.checked;
a.filterAccessibility=this.toggleAccessibility.checked;
a.filterRecommendations=!this.toggleRecommendations.checked;
a.autoInstallUpdates=this.toggleAutoUpdate.checked;
a.alwaysPromptOnPurchase=this.toggleAlwaysPrompt.checked;
om.logInfoMessage("WinStore.Settings.save: JSON text = "+JSON.stringify(a));
if(c)
om.authenticateUser(SettingsSignIn.always,function(c)
{
if(c.fSuccess)
om.saveSettings(a,b?b:function(a)
{
om.logInfoMessage("WinStore.Settings.save: callback made for save settings, result = "+a.toString(16));
if(a!==0)
WinStore.Settings.settingsChanged=false;
WinStore.BI.setClientAnid("");
WinStore.BI.refreshSigninState()
});
else
b&&
b(c.code)
});
else
om.saveSettings(a,b?b:function(a)
{
om.logInfoMessage("WinStore.Settings.save: callback made for save settings, result = "+a.toString(16));
if(a!==0)
WinStore.Settings.settingsChanged=false;
WinStore.BI.setClientAnid("");
WinStore.BI.refreshSigninState()
})
},onAlwaysPromptChanged:function()
{
WinStore.Settings.settingsChanged=true;
if(!WinStore.Settings.toggleAlwaysPrompt.checked&&WinStore.Settings.toggleAlwaysPrompt.checked!==WinStore.Settings.alwaysPromptOnPurchase)
WinStore.Settings.save(true,function(a)
{
om.logInfoMessage("WinStore.Settings.save: callback made for save settings for changing always prompt setting, result = "+a.toString(16));
if(a!==0)
{
WinStore.Settings.toggleAlwaysPrompt.checked=true;
WinStore.Settings.save(false,function(a)
{
om.logInfoMessage("WinStore.Settings.save: callback made for save settings to revert always prompt change, result = "+a.toString(16));
WinStore.Settings.refresh()
})
}
});
else
{
WinStore.Settings.save(false);
WinStore.Settings.refresh()
}
},showElementById:function(b)
{
var a=document.getElementById(b);
if(a)
{
a.style.visibility="visible";
WinJS.Utilities.removeClass(a,"settingsInvisible")
}
else
LogWarningMessage("Winstore.Settings.showElementById: could not get element '"+b+"'")
},hideElementById:function(b)
{
var a=document.getElementById(b);
if(a)
{
a.style.visibility="hidden";
WinJS.Utilities.addClass(a,"settingsInvisible")
}
else
LogWarningMessage("Winstore.Settings.hideElementById: could not get element '"+b+"'")
},onSyncLicenses:function()
{
document.getElementById("settingsSyncLicensesButton").disabled=true;
WinStore.Settings.showElementById("settingsSyncLicensesProgressContainer");
WinStore.Settings.hideElementById("settingsSyncLicensesError");
document.getElementById("settingsSyncLicensesError").innerText="";
try
{
om.syncLicenses(true,WinStore.Settings.syncLicensesComplete)
}
catch(a)
{
om.logErrorMessage("syncLicenses fast fail, err = "+a.description);
WinStore.Settings.syncLicensesComplete(false)
}
},syncLicensesComplete:function(a)
{
WinStore.Settings.hideElementById("settingsSyncLicensesProgressContainer");
if(a===true)
{
WinStore.Settings.hideElementById("settingsSyncLicensesButton");
WinStore.Settings.showElementById("settingsSyncLicensesSuccess");
document.getElementById("settingsSyncLicensesError").innerText="";
document.getElementById("settingsSyncLicensesSuccess").innerText="Your app licenses are up to date."
}
else
{
WinStore.Settings.showElementById("settingsSyncLicensesError");
document.getElementById("settingsSyncLicensesError").innerText="Your app licenses couldn’t be synced.";
document.getElementById("settingsSyncLicensesSuccess").innerText="";
document.getElementById("settingsSyncLicensesButton").disabled=false
}
},onPCSLinkClicked:function()
{
om.getPCSDetails(function(a)
{
if(a.fSuccess===true)
if(a.fIsRedirect)
{
var b=[{id:0,text:"Yes"},{id:1,text:"No"}];
om.showMessageDialog("Your web browser will open.","Do you want to continue to this website?",b,1,function(b)
{
b===0&&
om.launchPcsFlow(a.pcsUrl)
})
}
else
om.showPCS(WinStore.Settings.piContext)
})
},handlePaymentSetup:function(a)
{
this.initializeRefresh();
om.updateTravelLogCurrentPageParams("?display="+WinStore.Utilities.getUrlParam(a,"display"));
this.settingsPage="preferences";
var b=WinStore.Utilities.getUrlParam(a,"accountid"),
g=WinStore.Utilities.getUrlParam(a,"piid"),
c=WinStore.Utilities.getUrlParam(a,"errorcode"),
e=WinStore.Utilities.getUrlParam(a,"silentredeem")==="true";
WinStore.Settings.silentRedeemRequired=e;
var f=WinStore.Utilities.getUrlParam(a,"piattach")==="true";
WinStore.Settings.pcsFromPIAttach=f;
if(e)
{
WinStore.Settings.hideElementById("settingsRedeemTokenTermsOfUse");
WinStore.Settings.hideElementById("settingsRedeemTokenError");
WinStore.Settings.showElementById("settingsRedeemTokenProgressSection")
}
if(c!==""&&c!=="0"||b==="")
{
om.logErrorMessage("Settings: payment account creation error: "+c+" AccountID: "+b);
this.paymentSetupError=true;
this.loadIdentity(false,function()
{
om.getSettings(WinStore.Settings.showIdentityResults)
})
}
else
{
var d="Settings";
if(WinStore.Settings.silentRedeemRequired||WinStore.Settings.pcsFromPIAttach)
d="RedeemCSVToken";
om.setupPaymentAccount(b,g,d,function(a)
{
if(!a.fSuccess)
{
om.logErrorMessage("Settings: payment account creation error: "+a.code);
WinStore.Settings.paymentSetupError=true
}
WinStore.Settings.loadIdentity(false,function()
{
om.getSettings(WinStore.Settings.showIdentityResults)
})
})
}
},showPaymentSetupError:function(b)
{
document.getElementById("settingsDefaultPIErrorMsg").innerText="There was an error in adding your payment method to your Windows Store account.";
var a=document.getElementById("settingsPaymentDefaultPIError");
if(a)
if(b)
WinJS.Utilities.addClass(a,"paymentSetupErrorLowerPadding");
else
WinJS.Utilities.removeClass(a,"paymentSetupErrorLowerPadding");
WinStore.Settings.showElementById("settingsPaymentDefaultPIError")
}});
WinJS.Namespace.define("WinStore.Installer",{_isInitialized:{value:false,writable:true},_lastUpdateCountObject:{value:null,writable:true},_lastInstallingAppCount:{value:0,writable:true},_lastInstallingUpdateCount:{value:0,writable:true},_headerLinkInstalling:{value:null,writable:true},_headerLinkUpdates:{value:null,writable:true},_headerLinksSeparator:{value:null,writable:true},initialize:function()
{
if(!WinStore.Installer._isInitialized)
{
if(!WinStore.Installer._headerLinkInstalling)
WinStore.Installer._headerLinkInstalling=document.getElementById("headerLinkInstalling");
if(!WinStore.Installer._headerLinkUpdates)
WinStore.Installer._headerLinkUpdates=document.getElementById("headerLinkUpdates");
if(!WinStore.Installer._headerLinksSeparator)
WinStore.Installer._headerLinksSeparator=document.getElementById("headerLinksSeparator");
WinStore.Installer._isInitialized=true
}
else
om.logWarningMessage("WinStore.Installer.initialize: Invoked, but WinStore.Installer._isInitialized is true. Expected to be invoked only once by Frame.js load() event handler. Not reinitializing.")
},unInitialize:function()
{
if(WinStore.Installer._headerLinkInstalling)
WinStore.Installer._headerLinkInstalling=null;
if(WinStore.Installer._headerLinkUpdates)
WinStore.Installer._headerLinkUpdates=null;
if(WinStore.Installer._headerLinksSeparator)
WinStore.Installer._headerLinksSeparator=null
},onProgressAwarePageLoad:function()
{
om.getActiveInstallSummary(WinStore.Installer.onInstallProgress,this);
if(!this._lastUpdateCountObject)
this._lastUpdateCountObject={asNumber:0,asString:"0"};
this.onUpdateCountEvent(this._lastUpdateCountObject)
},onUpdateCountEvent:function(d)
{
WinStore.Installer._lastUpdateCountObject=d;
var a=d.asNumber,
b=WinStore.Installer._headerLinkUpdates;
if(b&&!WinStore.Frame.isPurchaseProgressVisible())
{
var c=null;
if(a>1)
c="Updates (%1)".replace("%1",d.asString);
else
if(a===1)
c="Update (1)";
if(c)
b.innerText=c;
WinStore.Installer._showUpdatingLink(b,a>0)
}
if(!b||a<=0)
WinStore.BI.removeMetaFromHead("MS.AvailUpdates");
else
{
WinStore.BI.addMetaToHead("MS.AvailUpdates",a);
b.addEventListener("click",WinStore.Installer.onUpdatesAvailableClick,false);
a>0&&WinStore.Installer._lastInstallingUpdateCount===0&&WinStore.Installer._lastUpdatesCount!==a&&WinStore.BI.hasLoggedPageViews()&&
WinStore.BI.logCustomBI("UpdatesAvailable")
}
},onInstallProgress:function(d)
{
if(d)
{
var b=d.installCount,
c=d.updateCount,
e=d.installErrorCount,
f=d.updateErrorCount;
if(!WinStore.Frame.isPurchaseProgressVisible())
{
var g=WinStore.Installer._headerLinkInstalling;
if(g)
{
var a="";
if(0!==b+c+e+f)
{
WinStore.Installer._lastInstallingAppCount=b;
WinStore.Installer._lastInstallingUpdateCount=c;
if(WinStore.Installer._appListInErrorState(d))
{
if(e>1&&f===0)
a="%1 apps couldn’t be installed".replace("%1",e);
else
if(e===1&&f===0)
a="%1 couldn’t be installed".replace("%1",d.installErrorDisplayName);
else
if(e>=1&&f>=1)
a="%1 apps couldn’t be installed or updated".replace("%1",e+f);
else
if(e===0&&f===1)
a="%1 couldn’t be updated".replace("%1",d.updateErrorDisplayName);
else
if(e===0&&f>1)
a="%1 apps couldn’t be updated".replace("%1",f);
else
om.logWarningMessage("WinStore.Installer.onInstallProgress: Unexpected state in list of error state apps. Not setting text for install progress indicator. installErrorCount: "+e+", updateErrorCount: "+f);
WinJS.Utilities.addClass(g,"lightInlineErrorText")
}
else
{
if(b>1&&c===0)
a="Installing %1 apps…".replace("%1",b);
else
if(b===1&&c===0)
a="Installing %1…".replace("%1",d.installDisplayName);
else
if(b>1&&c>1)
a="Installing %1 apps and %2 updates…".replace("%1",b).replace("%2",c);
else
if(b===1&&c>1)
a="Installing 1 app and %1 updates…".replace("%1",c);
else
if(b===1&&c===1)
a="Installing 1 app and 1 update…";
else
if(b>1&&c===1)
a="Installing %1 apps and 1 update…".replace("%1",b);
else
if(b===0&&c===1)
a="Installing update…".replace("%1",d.updateDisplayName);
else
if(b===0&&c>1)
a="Installing %1 updates…".replace("%1",c);
else
om.logWarningMessage("WinStore.Installer.onInstallProgress: Unexpected state in list of installing apps. Not setting text for install progress indicator. installCount: "+b+", updateCount: "+c);
WinJS.Utilities.removeClass(g,"lightInlineErrorText")
}
g.innerHTML!==a&&
WinStore.Utilities.readAloud(a);
g.innerHTML=a;
g.title=WinStore.Installer.simpleXmlDecode(a);
g.addEventListener("click",WinStore.Installer.onInstallingLinkClick,false)
}
WinStore.Installer._showInstallingLink(g,b>0||c>0)
}
}
}
},onInstallingLinkClick:function()
{
var b=WinStore.Installer._lastInstallingAppCount,
a=WinStore.Installer._lastInstallingUpdateCount;
(b>0||a>0)&&
WinStore.BI.logCustomBI("InstallLinkProgress",{AppsCount:b,UpdatesCount:a})
},onUpdatesAvailableClick:function()
{
WinStore.Installer._lastUpdatesCount>0&&
WinStore.BI.logCustomBI("AppUpdatesAvailableViewed")
},setLinksMaxWidth:function(d)
{
var c="100%",
b="100%";
if(d)
{
var a=WinStore.Installer._headerLinkUpdates.clientWidth;
if(a>0)
b=320-a+"px"
}
WinStore.Installer._headerLinkInstalling.style.maxWidth=b;
WinStore.Installer._headerLinkUpdates.style.maxWidth=c
},_setLinkVisibility:function(a,d)
{
var b=false;
if(a&&a.getAttribute("blocked")!=="1")
{
var c=a.style.display==="inline-block";
if(c&&!d)
{
WinJS.UI.Animation.fadeOut(a).done(function()
{
a.style.display="none"
});
b=true
}
else
if(!c&&d)
{
a.style.opacity=0;
a.style.display="inline-block";
WinJS.UI.Animation.fadeIn(a);
b=true
}
}
return b
},_setLinkSeparatorVisibility:function(d,f)
{
if(d)
{
var a=WinStore.Installer._headerLinksSeparator;
if(a)
{
var e=d.style.display==="inline-block",
c=a.style.display==="inline-block",
b=e&&f;
if(c&&!b)
{
WinStore.Installer.setLinksMaxWidth(false);
WinStore.Installer._setLinkVisibility(a,false)
}
else
if(!c&&b)
{
WinStore.Installer.setLinksMaxWidth(true);
WinStore.Installer._setLinkVisibility(a,true)
}
}
}
},_showUpdatingLink:function(b,a)
{
var c=WinStore.Installer._setLinkVisibility(b,a);
WinStore.Installer._setLinkSeparatorVisibility(WinStore.Installer._headerLinkInstalling,a)
},_showInstallingLink:function(c,a)
{
var b=WinStore.Installer._setLinkVisibility(c,a);
b&&
WinStore.Installer._setLinkSeparatorVisibility(WinStore.Installer._headerLinkUpdates,a)
},_appListInErrorState:function(a)
{
var c=false,
b=a.installCount+a.updateCount;
if(b>0)
if(b===a.installErrorCount+a.updateErrorCount)
c=true;
return c
},simpleXmlDecode:function(b)
{
var a,
d=/(&.+?;)/gi,
c={"&amp;":"&","&quot;":'"',"&apos;":"'","&lt;":"<","&gt;":">","&#38;":"&","&#34;":'"',"&#39;":"'","&#60;":"<","&#62;":">","&#x26;":"&","&#x22;":'"',"&#x27;":"'","&#x3C;":"<","&#x3E;":">"};
a=b.replace(d,function(b)
{
var a=c[b];
if(!a)
a=b;
return a
});
return a
}});
WinJS.Namespace.define("WinStore.InstallsPage",{_listViewBindingList:{value:null,writable:true},_listView:{value:null,writable:true},_appBar:{value:null,writable:true},_onDataLoaded:{value:null,writable:true},_installErrorCodes:{WU_E_NO_UPDATE:2149842980,WU_E_NO_CONNECTION:2149842975,WU_E_PT_ENDPOINT_UNREACHABLE:2149844024,WU_E_DM_NONETWORK:2149867525,WU_E_DM_DOWNLOADLIMITEDBYUPDATESIZE:2149867532,WU_E_INSTALL_NOT_ALLOWED:2149842966,WU_E_SERVICE_STOP:2149842974,WU_E_NOT_APPLICABLE:2149842967,BG_E_BLOCKED_BY_COST_TRANSFER_POLICY:2149580889,ERROR_INSTALL_FIREWALL_SERVICE_NOT_RUNNING:2147958026,ERROR_INSTALL_OUT_OF_DISK_SPACE:2147958004,ERROR_DISK_FULL:2147942512,HR_DISK_FULL:3355445008,ERROR_DEPLOYMENT_BLOCKED_BY_POLICY:2147958017,ERROR_PACKAGES_IN_USE:2147958018,ERROR_ACCESS_DISABLED_BY_POLICY:2147943660,ERROR_WINHTTP_TIMEOUT:2147954402,WU_E_CALL_CANCELLED:2149842955,ERROR_WINHTTP_OPERATION_CANCELLED:2147954417,ERROR_NETWORK_UNREACHABLE:2147943631,BG_E_NETWORK_DISCONNECTED:2149580816,ERROR_SHOW_CUSTOM_USER_ACTION:4294967295},_stateMap:{initiated:"Pending",downloading:"Downloading",restoringdata:"Downloading",installing:"Installing","installing-osupgrade":"Installing",paused:"Paused",resuming:"Resuming",error:"This app wasn’t installed – view details.",_unknown:"We couldn’t install this app right now. Please try again.",updateavailable:"Update available",cancelled:"Installation cancelled",complete:"Complete"},_itemStateMap:{value:null,writable:true},_itemCount:{value:0,writable:true},_pageIsLoaded:{value:false,writable:true},_listViewIsReady:{value:true,writable:true},_appsToRemove:{value:null,writable:true},_appsToUpdate:{value:null,writable:true},initControls:function(a)
{
this._onDataLoaded=a;
this._appBar=null;
this._itemStateMap={};
this._itemCount=0;
this._appsToRemove=[];
this._appsToUpdate=[];
this._pageIsLoaded=false;
WinStore.Frame.showInstallingLink(false);
WinStore.Frame.setPageTitle("Installs",false);
om.getActiveInstalls(function(a)
{
WinStore.InstallsPage.onInstallProgress(a)
});
this._initList();
this._pageIsLoaded=true;
WinStore.BI.onPageLoaded(WinStore.BI.InstallPageSamplingId)
},onInstallsPageUnload:function()
{
this._pageIsLoaded=false;
WinStore.Frame.showInstallingLink(true);
if(this._onDataLoaded)
{
this._onDataLoaded(true);
this._onDataLoaded=null
}
},onEntranceAnimationCompleted:function()
{
var a=WinStore.InstallsPage,
c=[{id:"pauseCmd",label:"Pause download",icon:"",onclick:a._onPauseClicked,section:"selection",tooltip:"Pause download"},{id:"resumeCmd",label:"Resume download",icon:"",onclick:a._onResumeClicked,section:"selection",tooltip:"Resume download"},{id:"cancelCmd",label:"Cancel install",icon:"",onclick:a._onCancelClicked,section:"selection",tooltip:"Cancel install"}],
b=document.getElementById("appInstallsAppBarContainer");
if(b)
if(!b.winControl)
{
a._appBar=new WinJS.UI.AppBar(b,{commands:c,sticky:true});
a._appBar.hide()
}
},onInstallProgress:function(f)
{
if(this._pageIsLoaded&&f)
{
for(var c=document.getElementById("noActiveInstallsMessage"),
e=document.getElementById("mainContent"),
a,
b,
h=false,
g=0;g<f.length;++g)
{
a=f[g];
var d=a.installState.toLowerCase(),
i=a.lastStatusCode?parseInt(a.lastStatusCode):0;
if(a.packageFamilyName==="osUpgrade")
{
a.appIcon="../../../../osupgrade/115/installing_logo.png";
if(d==="installing")
a.installState="installing-osupgrade";
if(a.userActionText!=="")
{
a.lastStatusCode=WinStore.InstallsPage._installErrorCodes.ERROR_SHOW_CUSTOM_USER_ACTION;
a.installState="error";
d="error"
}
}
a=this._appInstallToListItem(a,g);
var j=d==="complete"||d==="cancelled"||i===WinStore.InstallsPage._installErrorCodes.WU_E_CALL_CANCELLED;
if(j)
{
if(WinStore.InstallsPage._itemStateMap[a.packageFamilyName]&&!WinStore.InstallsPage._itemStateMap[a.packageFamilyName].removed)
{
om.logInfoMessage("WinStore.InstallsPage.onInstallProgress: Removing tile for "+a.packageFamilyName+", installState: "+a.installState);
WinStore.InstallsPage._appsToRemove.push(a);
if(d=="cancelled"||i===WinStore.InstallsPage._installErrorCodes.WU_E_CALL_CANCELLED)
h=true;
if(WinStore.InstallsPage._appBar)
{
b=WinStore.InstallsPage._getSelectedItem();
b&&a.packageFamilyName===b.data.packageFamilyName&&
WinStore.InstallsPage._appBar.hide()
}
}
}
else
{
WinStore.InstallsPage._appsToUpdate.push(a);
h=false
}
}
WinStore.InstallsPage.servicePendingUpdates();
if(WinStore.InstallsPage._appBar)
{
if(!b)
b=WinStore.InstallsPage._getSelectedItem();
if(!b)
WinStore.InstallsPage._appBar.hide();
else
if(f.length===1)
b&&b.data.packageFamilyName===a.packageFamilyName&&
WinStore.InstallsPage._showAppBarIfNeeded(a.installState)
}
if(WinStore.InstallsPage._itemCount>0)
{
c.style.display="none";
c.setAttribute("aria-hidden","true");
e.style.visibility="visible";
e.setAttribute("aria-hidden","false")
}
else
{
e.style.visibility="hidden";
e.setAttribute("aria-hidden","true");
om.isOSUpgradeRebootPending(function(a)
{
if(a)
c.innerText="Please restart your PC to continue installing the Windows 8.1.";
else
if(h)
c.innerText="You aren’t installing any apps right now."
});
c.style.display="block";
c.setAttribute("aria-hidden","false");
WinStore.InstallsPage._appBar&&
WinStore.InstallsPage._appBar.hide()
}
}
},_initList:function()
{
var c=document.getElementById("mainContent");
if(c)
{
this._listViewBindingList=new WinJS.Binding.List({binding:true});
this._listViewBindingList.addEventListener("itemremoved",WinStore.InstallsPage._itemRemovedHandler,false);
var a=new WinJS.UI.ListView(c,{selectionMode:WinJS.UI.SelectionMode.single,tapBehavior:WinJS.UI.TapBehavior.toggleSelect,swipeBehavior:WinJS.UI.SwipeBehavior.select,itemDataSource:this._listViewBindingList.dataSource,resetItem:this._resetItem,itemTemplate:this._createTileRenderer()});
WinStore.InstallsPage._listView=a;
a.selection.clear();
if(a)
{
var b=this;
a.addEventListener("iteminvoked",b._onTileClicked,false);
a.addEventListener("selectionchanged",b._onSelectionChanged,false);
a.addEventListener("contentanimating",WinStore.Utilities.cancelListViewEntranceAnimation,false);
a.addEventListener("loadingstatechanged",function()
{
if(a.loadingState==="complete")
{
b._listViewIsReady=true;
b.servicePendingUpdates()
}
else
b._listViewIsReady=false;
if(a.loadingState==="itemsLoaded")
{
if(b._onDataLoaded)
{
b._onDataLoaded(false,null,b.onEntranceAnimationCompleted);
b._onDataLoaded=null
}
}
else
if(a.loadingState==="complete"&&a._setInitialFocus===undefined)
a._setInitialFocus=true
},false);
a.addEventListener("loadingstatechanged",WinStore.Utilities.addTooltipsToOverflowedTiles(a,false),false)
}
}
},_createTileRenderer:function()
{
var a="installingAppTileTemplate",
c=document.getElementById(a).cloneNode(true),
d=c.outerHTML,
b=WinStore.Utilities.getTileLayout(a);
c.id="";
function e(c)
{
var a=document.createElement("div");
a.style.width=b.width;
a.style.height=b.height;
return {element:a,renderComplete:c.then(function(e)
{
var b=e.data,
g=/{{(\w+)}}/g,
f=d.replace(g,function(d,c)
{
var a=b[c];
if(a===undefined)
if("tileId"===c)
a=e.key;
else
a=d;
return a
});
a.innerHTML=f;
a=a.firstChild;
a.removeAttribute("aria-hidden");
a.setAttribute("pfn",b.packageFamilyName);
var c=a.getElementsByClassName("appInstallTileIcon")[0];
if(c)
{
c.src=b.iconUrl;
c.style.backgroundColor=b.tileBackgroundColor
}
a.id="tile_"+e.key;
WinStore.InstallsPage._updateItem(a,b);
b.onchange=function(b)
{
WinStore.InstallsPage._updateItem(a,b.data)
};
return a
})}
}
return e
},_appInstallToListItem:function(a,b)
{
return {name:a.displayName,installState:a.installState?a.installState.toLowerCase():"_unknown",percentComplete:a.totalPercentComplete,phasePercentComplete:a.phasePercentComplete,iconUrl:a.appIcon?decodeURIComponent(a.appIcon):"",itemIndex:b,appId:a.appId,tileBackgroundColor:a.tileBgColor?a.tileBgColor:"#FFFFFF",tileTextColor:a.tileFgColor?a.tileFgColor:WinStore.Utilities.textDarkColor,message:a.message,lastStatusCode:a.lastStatusCode,packageFamilyName:a.packageFamilyName,statusText:a.statusText,userActionText:a.userActionText,userActionHwnd:a.userActionHwnd,userActionUMsg:a.userActionUMsg}
},_getLocdInstallState:function(b)
{
var a=this._stateMap[b];
if(!a)
if(b!=="initiated"&&a!=="")
{
om.logErrorMessage("WinStore.InstallsPage._getLocdInstallState: can't find loc string for state "+b+', using "unknown" state');
a=this._stateMap["_unknown"]
}
return a
},_onShowErrorFlyout:function(s,i,e)
{
if(i)
{
var g=document.getElementById("errorFlyout"),
d=g.winControl;
if(d===null||d===undefined)
{
WinJS.UI.process(g);
d=g.winControl
}
if(d)
{
var a=document.getElementById("errorButton0"),
b=document.getElementById("errorButton1");
a.style.visibility="visible";
b.style.visibility="visible";
a.style.display="block";
b.style.display="block";
WinJS.Utilities.addClass(a,"store-bordered-button");
WinJS.Utilities.addClass(b,"store-bordered-button");
a.disabled=false;
b.disabled=false;
var c,
l=false,
f="osUpgrade"===e.packageFamilyName,
m=parseInt(e.lastStatusCode);
switch(m)
{
case WinStore.InstallsPage._installErrorCodes.ERROR_DEPLOYMENT_BLOCKED_BY_POLICY:
case WinStore.InstallsPage._installErrorCodes.ERROR_ACCESS_DISABLED_BY_POLICY:
c="This app couldn’t be installed because of the Group Policy set by your system administrator. Please contact your system administrator for more information.";
a.innerText="Try again";
b.innerText="Cancel install";
break;
case WinStore.InstallsPage._installErrorCodes.ERROR_PACKAGES_IN_USE:
c="Your app couldn’t be installed. Close all open apps and try again.";
a.innerText="Try again";
b.innerText="Cancel install";
break;
case WinStore.InstallsPage._installErrorCodes.WU_E_NO_UPDATE:
c="Sorry, this app is no longer available.";
if(f)
c="The Windows 8.1 Preview isn’t available right now. Please try again later.";
a.style.visibility="hidden";
a.style.display="none";
b.innerText="Cancel install";
break;
case WinStore.InstallsPage._installErrorCodes.WU_E_INSTALL_NOT_ALLOWED:
case WinStore.InstallsPage._installErrorCodes.WU_E_SERVICE_STOP:
c="Windows is installing updates right now, please try again in a few minutes.";
a.style.visibility="hidden";
a.style.display="none";
b.innerText="Close";
l=true;
break;
case WinStore.InstallsPage._installErrorCodes.WU_E_NOT_APPLICABLE:
c="Sorry, this app can’t be installed because your PC might not meet some of the requirements. Go to the app’s description page to check for any requirements listed under Details.";
a.style.visibility="hidden";
a.style.display="none";
b.innerText="Cancel install";
break;
case WinStore.InstallsPage._installErrorCodes.WU_E_NO_CONNECTION:
case WinStore.InstallsPage._installErrorCodes.WU_E_PT_ENDPOINT_UNREACHABLE:
case WinStore.InstallsPage._installErrorCodes.WU_E_DM_NONETWORK:
case WinStore.InstallsPage._installErrorCodes.ERROR_NETWORK_UNREACHABLE:
case WinStore.InstallsPage._installErrorCodes.BG_E_NETWORK_DISCONNECTED:
case WinStore.InstallsPage._installErrorCodes.ERROR_WINHTTP_OPERATION_CANCELLED:
case WinStore.InstallsPage._installErrorCodes.ERROR_WINHTTP_TIMEOUT:
c="You’re not connected to the Internet. Please check your network connection and try again.";
a.innerText="Try again";
b.innerText="Cancel install";
break;
case WinStore.InstallsPage._installErrorCodes.WU_E_DM_DOWNLOADLIMITEDBYUPDATESIZE:
c="You can’t download this app using a mobile broadband or metered Internet connection. Use a Wi-Fi or Ethernet Internet connection to continue downloading.";
if(f)
c="You can’t download Windows 8.1 using a mobile broadband connection. Use a Wi-Fi or Ethernet Internet connection to continue downloading.";
a.innerText="Try again";
b.innerText="Cancel install";
break;
case WinStore.InstallsPage._installErrorCodes.BG_E_BLOCKED_BY_COST_TRANSFER_POLICY:
c="You’re using mobile broadband or a metered Internet connection to download this app. This might result in additional charges to your data plan.";
if(f)
c="You’re now using a mobile broadband connection. Do you want to continue downloading this upgrade?";
a.innerText="Continue";
b.innerText="No";
break;
case WinStore.InstallsPage._installErrorCodes.ERROR_INSTALL_FIREWALL_SERVICE_NOT_RUNNING:
c="The app couldn’t be installed because the Windows Firewall service is not running. Please enable the Windows Firewall service and try again.";
a.innerText="Try again";
b.innerText="Cancel install";
break;
case WinStore.InstallsPage._installErrorCodes.ERROR_INSTALL_OUT_OF_DISK_SPACE:
case WinStore.InstallsPage._installErrorCodes.ERROR_DISK_FULL:
case WinStore.InstallsPage._installErrorCodes.HR_DISK_FULL:
c="Your PC doesn’t have enough space to install this app. Make more space available on your drive and try again.";
if(f)
c="Your PC doesn’t have enough space to install Windows 8.1. Make more space available on your drive and try again.";
a.innerText="Try again";
b.innerText="Cancel install";
break;
case WinStore.InstallsPage._installErrorCodes.ERROR_SHOW_CUSTOM_USER_ACTION:
c=e.userActionText;
a.innerText="Try again";
b.innerText="Cancel install";
break;
default:
om.logInfoMessage("WinStore.InstallsPage: No friendly error message mapping for error "+e.lastStatusCode+", displaying generic error message");
c="Something happened and this app couldn’t be installed. Please try again. Error code: %1".replace("%1",e.lastStatusCode);
if(f)
c="Something happened and the Windows 8.1 couldn’t be installed. Please try again. Error code: %1".replace("%1",e.lastStatusCode);
a.innerText="Try again";
b.innerText="Cancel install"
}
var q=function()
{
d.hide();
om.logInfoMessage("WinStore.InstallsPage.onRetryButtonClicked: retrying installation for "+e.packageFamilyName);
om.retryInstallation(e.appId)
},
o=function()
{
d.hide();
om.logInfoMessage("WinStore.InstallsPage.onCancelButtonClicked: cancelling installation of "+e.packageFamilyName);
om.cancelInstallation(e.appId)
},
p=function()
{
d.hide()
},
n=function()
{
d.hide();
om.onUpgradeInstallUserActionClick(e.userActionHwnd,e.userActionUMsg)
};
if(m!==WinStore.InstallsPage._installErrorCodes.ERROR_SHOW_CUSTOM_USER_ACTION)
a.onclick=q;
else
a.onclick=n;
if(l)
b.onclick=p;
else
b.onclick=o;
var k=function()
{
b.focus();
d.removeEventListener("aftershow",k,false)
},
j=function()
{
a.style.display="none";
b.style.display="none";
a.disabled=true;
b.disabled=true;
d.removeEventListener("afterhide",j,false)
};
d.addEventListener("aftershow",k,false);
d.addEventListener("afterhide",j,false);
var r=document.getElementById("errorFlyoutTitle");
r.textContent=c;
g.setAttribute("aria-label",c);
var h=i.children[0];
if(!h)
h=i;
d.show(h,"auto")
}
}
},_onTileClicked:function(a)
{
var c=WinStore.InstallsPage._getListView(),
b=c.elementFromIndex(a.detail.itemIndex);
b&&
a.detail.itemPromise.done(function(c)
{
var a=c&&WinStore.InstallsPage._itemStateMap[c.data.packageFamilyName];
if(a&&a.installState==="error")
{
om.logInfoMessage("WinStore.InstallsPage._onTileClicked: installState === error");
WinStore.InstallsPage._onShowErrorFlyout(this,b,a);
om.logInfoMessage("WinStore.InstallsPage._onTileClicked: error flyout done")
}
})
},_onSelectionChanged:function()
{
var b=WinStore.InstallsPage._getSelectedItem();
if(b)
{
var a=WinStore.InstallsPage._itemStateMap[b.data.packageFamilyName];
if(a)
{
if(a.installState==="error")
{
var c=WinStore.InstallsPage._getListView();
c&&
c.selection.clear()
}
WinStore.InstallsPage._showAppBarIfNeeded(a.installState)
}
else
om.logErrorMessage("WinStore.InstallsPage._onSelectionChanged: itemData is null")
}
else
WinStore.InstallsPage._appBar&&
WinStore.InstallsPage._appBar.hide()
},_showAppBarIfNeeded:function(b)
{
var a=WinStore.InstallsPage._appBar;
if(a)
switch(b)
{
case "downloading":
case "restoringdata":
a.hideCommands([resumeCmd]);
a.showCommands([pauseCmd,cancelCmd]);
pauseCmd.disabled=false;
a.show();
break;
case "initiated":
case "resuming":
case "_unknown":
case "acquiringlicense":
case "updateavailable":
a.hideCommands([resumeCmd]);
a.showCommands([pauseCmd,cancelCmd]);
pauseCmd.disabled=true;
a.show();
break;
case "paused":
a.hideCommands([pauseCmd]);
a.showCommands([resumeCmd,cancelCmd]);
pauseCmd.disabled=false;
a.show();
break;
case "installing-osupgrade":
a.hideCommands([pauseCmd,resumeCmd]);
a.showCommands([cancelCmd]);
pauseCmd.disabled=true;
a.show();
break;
case "installing":
case "complete":
default:
a.hide()
}
else
om.logErrorMessage("WinStore.InstallsPage._showAppBarIfNeeded: WinStore.InstallsPage._appBar undefined. Can't display")
},_getSelectedItem:function()
{
var b=null,
a;
a=WinStore.InstallsPage._getListView();
a&&
a.selection.getItems().done(function(a)
{
a.length>1&&
om.logWarningMessage("WinStore.InstallsPage._getSelectedItem: expected single item selected, "+a.length+" selected.");
if(a.length>=1)
b=a[0]
});
return b
},_getSelectedItemData:function()
{
var a=WinStore.InstallsPage._getSelectedItem(),
b;
if(a&&a.data)
b=WinStore.InstallsPage._itemStateMap[a.data.packageFamilyName];
return b
},_getListView:function()
{
var a;
if(WinStore.InstallsPage._listView)
a=WinStore.InstallsPage._listView;
else
{
var b=document.getElementById("mainContent");
if(b)
a=b.winControl
}
return a
},_onCancelClicked:function()
{
var a=WinStore.InstallsPage._getSelectedItemData();
if(a&&a.installState!=="completed"&&a.installState!=="cancelled")
{
om.cancelInstallation(a.appId);
WinStore.InstallsPage._appBar.hide()
}
},_onPauseClicked:function()
{
var a=WinStore.InstallsPage._getSelectedItemData();
if(a&&a.installState=="downloading")
{
om.pauseInstallation(a.appId);
WinStore.InstallsPage._appBar.showCommands([resumeCmd,cancelCmd]);
WinStore.InstallsPage._appBar.hideCommands([pauseCmd])
}
},_onResumeClicked:function()
{
var a=WinStore.InstallsPage._getSelectedItemData();
a&&a.installState=="paused"&&
om.resumeInstallation(a.appId)
},_toggleTilePausedState:function(a,b)
{
if(b)
WinJS.Utilities.addClass(a,"appInstallTileProgressPaused");
else
WinJS.Utilities.removeClass(a,"appInstallTileProgressPaused")
},servicePendingUpdates:function()
{
while(WinStore.InstallsPage._listViewIsReady)
{
var a;
if(WinStore.InstallsPage._appsToRemove.length>0)
{
a=WinStore.InstallsPage._appsToRemove.shift();
WinStore.InstallsPage._removeItem(a)
}
else
if(WinStore.InstallsPage._appsToUpdate.length>0)
{
a=WinStore.InstallsPage._appsToUpdate.shift();
WinStore.InstallsPage._addOrUpdateListViewItem(a)
}
else
break
}
},_addOrUpdateListViewItem:function(b)
{
var c=b.packageFamilyName;
if(c)
{
for(var e=false,
a,
d=0;d<this._listViewBindingList.length;++d)
{
a=this._listViewBindingList.getItem(d);
if(a.data.packageFamilyName===c)
{
e=true;
WinStore.InstallsPage._copyItemData(b,a.data);
a.data.onchange&&
a.data.onchange(a);
break
}
}
!e&&!WinStore.InstallsPage._itemStateMap[c]&&
WinStore.InstallsPage._addItem(b)
}
else
om.logWarningMessage("WinStore.InstallsPage._addOrUpdateListViewItem: No key data (packageFamilyName) in item to be added; skipping item.")
},_addItem:function(a)
{
WinStore.InstallsPage._itemCount++;
WinStore.InstallsPage._itemStateMap[a.packageFamilyName]=WinStore.InstallsPage._createItemCopy(a);
WinStore.InstallsPage._listViewBindingList.push(a)
},_updateItem:function(d,a)
{
if(d)
{
var e=WinStore.InstallsPage._getLocdInstallState(a.installState),
f=d.getElementsByClassName("appInstallTileState"),
g=d.getElementsByClassName("appInstallTileProgress"),
b,
c;
if(f&&f.length>0)
b=f[0];
if(g&&g.length>0)
c=g[0];
if(a.statusText)
e=a.statusText;
if(b)
b.innerHTML=e;
if(a.installState!=="error")
{
var k=WinStore.Installer.simpleXmlDecode(a.name),
i="{1} {2} ({3}% complete)".replace("{1}",k).replace("{2}",e).replace("{3}",a.percentComplete);
d.setAttribute("title",i);
d.setAttribute("aria-label",i)
}
c&&a.installState!=="initiated"&&a.installState!=="pending"&&
c.setAttribute("value",a.percentComplete);
var h=WinStore.InstallsPage._itemStateMap[a.packageFamilyName];
if(!h||a.installState!==h.installState||a.installState==="error"||h.installState==="error")
{
if(!b&&a.installState!=="error")
{
f=d.getElementsByClassName("appInstallTileStateMultiRow");
if(f&&f.length>0)
{
c.style.display="block";
b=f[0];
WinJS.Utilities.removeClass(b,"appInstallTileStateMultiRow");
WinJS.Utilities.removeClass(b,"lightInlineErrorText");
WinJS.Utilities.addClass(b,"appInstallTileState");
b.innerHTML=e
}
}
if(a.installState==="downloading")
WinStore.InstallsPage._toggleTilePausedState(c,false);
else
if(a.installState==="restoringdata")
if(a.phasePercentComplete===100)
{
a.installState="installing";
if(a.packageFamilyName==="osUpgrade")
a.installState="installing-osupgrade";
b.innerHTML=WinStore.InstallsPage._getLocdInstallState("installing")
}
else
WinStore.InstallsPage._toggleTilePausedState(c,false);
else
if(a.installState==="paused")
WinStore.InstallsPage._toggleTilePausedState(c,true);
else
if(a.installState==="error")
{
if(c)
c.style.display="none";
if(b)
{
WinJS.Utilities.removeClass(b,"appInstallTileState");
WinJS.Utilities.addClass(b,"appInstallTileStateMultiRow");
WinJS.Utilities.addClass(b,"lightInlineErrorText")
}
d.setAttribute("title",a.name+": "+e);
d.setAttribute("aria-label",a.name+": "+e)
}
}
else
if(a.installState==="paused")
WinStore.InstallsPage._toggleTilePausedState(c,true);
else
if(a.installState==="error")
{
if(c)
c.style.display="none";
if(b)
{
WinJS.Utilities.removeClass(b,"appInstallTileState");
WinJS.Utilities.addClass(b,"appInstallTileStateMultiRow");
WinJS.Utilities.addClass(b,"lightInlineErrorText")
}
var j=WinStore.Installer.simpleXmlDecode(a.name);
d.setAttribute("title",j+": "+e);
d.setAttribute("aria-label",j+": "+e)
}
}
else
om.logInfoMessage("WinStore.InstallsPage._updateItem: No tile found for "+a.packageFamilyName+", item not realized. Skipping");
WinStore.InstallsPage._itemStateMap[a.packageFamilyName]=WinStore.InstallsPage._createItemCopy(a)
},_resetItem:function(a)
{
a.data.onchange=null
},_removeItem:function(d)
{
var b=d.packageFamilyName;
if(b)
{
for(var c=false,
a=0;a<WinStore.InstallsPage._listViewBindingList.length;++a)
if(WinStore.InstallsPage._listViewBindingList.getAt(a).packageFamilyName===b)
{
WinStore.InstallsPage._listViewBindingList.splice(a,1);
c=true;
break
}
!c&&
om.logWarningMessage("WinStore.InstallsPage._removeItem: Unable to remove "+b+" from Binding.List (not found). Possible orphan tile")
}
else
om.logInfoMessage("WinStore.InstallsPage._removeItem: No key data (packageFamilyName) in item to be removed; skipping item.")
},_itemRemovedHandler:function(b)
{
var a=b.detail.item.data.packageFamilyName;
if(WinStore.InstallsPage._itemStateMap[a]&&!WinStore.InstallsPage._itemStateMap[a].removed)
{
om.logInfoMessage("WinStore.InstallsPage._itemRemovedHandler: removing "+a+" from state map");
WinStore.InstallsPage._itemCount--;
WinStore.InstallsPage._itemStateMap[a].removed=true
}
},_copyItemData:function(a,b)
{
b.name=a.name,b.installState=a.installState,b.percentComplete=a.percentComplete,b.phasePercentComplete=a.phasePercentComplete,b.iconUrl=a.iconUrl,b.itemIndex=a.itemIndex,b.appId=a.appId,b.tileBackgroundColor=a.tileBackgroundColor,b.tileTextColor=a.tileTextColor,b.message=a.message,b.lastStatusCode=a.lastStatusCode,b.packageFamilyName=a.packageFamilyName,b.removed=a.removed,b.statusText=a.statusText,b.userActionText=a.userActionText,b.userActionButtonText=a.userActionButtonText,b.userActionHwnd=a.userActionHwnd,b.userActionUMsg=a.userActionUMsg
},_createItemCopy:function(b)
{
var a={};
WinStore.InstallsPage._copyItemData(b,a);
return a
}});
WinJS.Namespace.define("WinStore.Utilities",{MaxCollectionTileAppCount:{value:4,writable:false},textDarkColor:{value:"#1A1A1A",writable:false},greyWashBackgroundColor:{value:"#F2F2F2",writable:false},createNoResultsSection:function(b,c,g,d)
{
var a=document.createElement("div");
a.id="noResults";
a.setAttribute("listId",this._listId);
a.className="win-type-x-large noResults";
a.innerText=g;
d&&
WinJS.Utilities.addClass(a,d);
b.getAttribute("keepFocus")&&
a.setAttribute("keepFocus","1");
if(c&&c.parentNode)
{
a.opacity=0;
c.parentNode.replaceChild(a,c);
WinJS.UI.Animation.fadeIn(a);
WinStore.Utilities.readAloud(a.innerText)
}
else
{
WinJS.Utilities.children(b).forEach(function(a)
{
b.removeChild(a)
});
b.appendChild(a)
}
var e={FltInfo:b.getAttribute("FlightInfo")},
f=["RequestQueryTerm","RequestQueryForm","RequestQueryFilter","RequestQuerySort"];
f.forEach(function(a)
{
var c=b.getAttribute(a);
if(c)
e[a]=c
});
WinStore.BI.removeMetaFromHead("MS.pNum");
WinStore.BI.firePageViewEvent(e);
return a
},updateElementAttributes:function(h,d,f,g)
{
for(var e=WinStore.Utilities.getUrlParam,
i=d.length,
c=0;c<i;c++)
h.removeAttribute(d[c].name);
for(var c=0;c<i;c++)
{
var b=d[c];
if(b.listType===g||b.listType==undefined||g==undefined)
{
var a=e(f,b.queryParam);
if(""!==a||b.allowBlank)
{
if(b.sorting)
{
if(a==="2"&&"1"===e(f,"sortOrder"))
a="10"
}
else
if(b.query)
{
if(b.decode)
a=decodeURIComponent(a);
a=a.length>512?a.substring(0,512):a
}
else
if(b.notZero&&"0"===a)
continue;
h.setAttribute(b.name,a)
}
}
}
},getUrlParam:function(e,b)
{
var c="[\\?&]"+b+"=([^&#]*)",
d=new RegExp(c),
a=d.exec(e);
return a===null?"":a[1]
},nameFromId:function(a,d)
{
var c=null;
if(Array.isArray(a))
for(var b=0;b<a.length;b++)
if(a[b].id===d)
{
c=a[b].name;
break
}
return c
},enumToString:function(a,e,c)
{
var d=c?c:"unknown";
for(var b in a)
if(a.hasOwnProperty(b))
if(a[b]===e)
{
d=b;
break
}
return d
},getNamespaceAsync:function(a)
{
return new WinJS.Promise(function(b,c)
{
WinStore.Utilities.getNamespace(function()
{
if(om.namespace)
b(om.namespace);
else
c("om.namespace not set after successful call to om.getNamespace")
},null,a)
})
},getNamespace:function(a,b,c)
{
if(!c&&om.namespace)
a&&
a(b);
else
om.getNamespace(function(b,c)
{
if(b)
{
om.namespace=b;
a&&
a(c)
}
else
om.logErrorMessage("WinStore.Utilities.getNamespace: Failed since namespaceObj is null")
},b)
},setElementClasses:function(e,c,b)
{
var d=document.getElementById(e);
if(d)
{
if(b)
if(Array.isArray(b))
for(var a=0;a<b.length;a++)
b[a]&&
WinJS.Utilities.removeClass(d,b[a]);
else
WinJS.Utilities.removeClass(d,b);
if(c)
if(Array.isArray(c))
for(var a=0;a<c.length;a++)
c[a]&&
WinJS.Utilities.addClass(d,c[a]);
else
WinJS.Utilities.addClass(d,c)
}
else
om.logErrorMessage("WinStore.Utilities.setElementClasses: couldn't get elment with ID = "+e)
},getImageUrl:function(a,c,b)
{
if(!isNaN(b)&&b)
{
var d=c.charCodeAt(0)%b+1;
a=a.replace("{hostIndex}",String.fromCharCode(d))
}
return a+c
},encodeCDATA:function(a)
{
return "<![CDATA["+a.replace("]]>","")+"]]>"
},getElementTopOffset:function(c)
{
var b=0,
a=document.getElementById(c);
while(a)
{
b+=a.offsetTop;
a=a.offsetParent
}
return b
},isOverflowed:function(a)
{
return a&&(a.clientWidth+1<a.scrollWidth||a.clientHeight+1<a.scrollHeight)
},truncateElement:function(b,i,j)
{
var c=i?i:b,
f=String.fromCharCode(8230);
if(b)
if(WinStore.Utilities.isOverflowed(c))
{
var h=b.innerText,
e=Math.floor(h.length*(c.clientHeight/c.scrollHeight)),
g=h.substring(0,e);
b.innerText=g+f;
var a=Math.floor(e/10)*(WinStore.Utilities.isOverflowed(c)?-1:1);
while(a>1||a<0)
{
e+=a;
g=h.substring(0,e);
b.innerText=g+f;
a=Math.abs(a);
if(a>1)
a=Math.floor(a/2);
a*=WinStore.Utilities.isOverflowed(c)?-1:1
}
}
else
if(j)
{
var d=b.innerText;
b.innerText=d+f;
while(WinStore.Utilities.isOverflowed(c))
{
d=d.substring(0,d.length-1);
b.innerText=d+f
}
}
},parseDateJSON:function(c)
{
var b=null,
d=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/,
a=d.exec(c);
if(a)
b=new Date(Date.UTC(+a[1],+a[2]-1,+a[3],+a[4],+a[5],+a[6]));
return b
},saveScrollPosition:function(k,g,b,i,l)
{
var d=k.indexOfFirstVisible,
f="",
c="",
e="",
a;
if(b)
{
f=WinStore.Utilities.getUrlParam(b,"firstVis");
c=WinStore.Utilities.getUrlParam(b,"focus");
if(i)
e=WinStore.Utilities.getUrlParam(b,"scroll")
}
if(""===f)
a=(b?b+"&":"?")+"firstVis="+d;
else
a=b.replace("firstVis="+f,"firstVis="+d);
var h=g?g:d;
if(""===c)
a+="&focus="+h;
else
a=a.replace("focus="+c,"focus="+h);
if(i)
{
var j=k.scrollPosition;
if(""===e)
a+="&scroll="+j;
else
a=a.replace("scroll="+e,"scroll="+j);
if(l)
om.updateTravelLogPreviousPageParams(a);
else
om.updateTravelLogCurrentPageParams(a)
}
else
om.updateTravelLogCurrentPageParams(a)
},restoreScrollPosition:function(a,b,h,g)
{
var e=WinStore.Utilities.getUrlParam(b,"firstVis");
if(""!==e)
{
var c=WinStore.Utilities.getUrlParam(b,"focus"),
d=0;
if(""!==c)
d=parseInt(c);
a.currentItem={index:d,hasFocus:g};
if(h)
{
var f=WinStore.Utilities.getUrlParam(b,"scroll");
if(""!==f)
a.scrollPosition=f
}
else
a.indexOfFirstVisible=parseInt(e)
}
else
if(g)
a.currentItem={index:0,hasFocus:true}
},cancelListViewEntranceAnimation:function(a)
{
a.detail.type===WinJS.UI.ListViewAnimationType.entrance&&
a.preventDefault()
},isDesktopApp:function(a)
{
return a&&a.AppTypeId&&a.AppTypeId===2
},getBIRating:function(c)
{
var b=0;
if(c)
{
var a=parseFloat(c,10);
if(!isNaN(a)&&a!=0)
b=a.toFixed(2)
}
return b
},htmlSafeTruncateText:function(b,a)
{
var c=b;
if(b)
{
a=a|ShortDescriptionCharacterCount;
var d=b.lastIndexOf(">");
if(d>-1)
a=d+1;
c=b.substring(0,a)
}
return c
},substituteAppInfoPriceAsAppropriate:function(a)
{
var c=false;
if(a)
{
if(a.isOwned===undefined)
{
a.isOwned=false;
var b=WinStore.Utilities.getLicenseInstallDataByPFN(a.PackageFamilyName);
if(b)
{
a.Price="Owned";
a.isOwned=true;
if(b.Installed)
a.Price="Installed"
}
}
c=a.isOwned
}
return c
},checkAppHardwareRequirements:function(d,f)
{
var c=HWAction.invalid;
if(om.namespace&&d.RequiredHardwareMask)
{
var a=om.namespace.hardwareFeatures;
if(a&&Array.isArray(a))
for(var h=a.length,
e=0;e<h;e++)
{
var b=a[e],
g=1<<b.order-1;
f&&(d.RequiredHardwareMask&g)!==0&&
f.push(b.name);
if((d.MissingHardwareMask&g)!==0&&b.action>c)
c=b.action
}
}
return c
},prepareAppInfoData:function(a,b,c)
{
if(a.tilePrepCompleted)
return;
a.isDesktopApp=this.isDesktopApp(a);
if(a.isDesktopApp)
{
a.Price="Desktop app";
a.BackgroundColor=WinStore.Utilities.greyWashBackgroundColor
}
else
if(!a.BackgroundColor||a.BackgroundColor==="")
a.BackgroundColor="#FFFFFF";
if(!c&&!this.substituteAppInfoPriceAsAppropriate(a)&&!a.FreeApp&&a.FreeTrialAvailable)
a.FreeTrialText="(free trial)";
a.ratingBI=this.getBIRating(a.Rating);
if(!a.RatingCount)
a.RatingCountText="Not yet rated";
a.Accessible=a.Accessible?"Yes":"No";
if(!a.KValue)
a.KValue=b?b:"0";
a.TruncatedDescription=WinStore.Utilities.htmlSafeTruncateText(a.Description);
a.squareImage=a.AppTiles&&a.AppTiles[0]&&a.AppTiles[0].tile1x1ImageUrl?a.AppTiles[0].tile1x1ImageUrl:a.LogoURL;
a.mediumImage=a.AppTiles&&a.AppTiles[0]&&a.AppTiles[0].tileImageUrl?a.AppTiles[0].tileImageUrl:a.LogoURL;
a.largeImage=a.Screenshots&&a.Screenshots[0]?a.Screenshots[0].url:a.mediumImage;
if(a.AppTiles&&a.AppTiles[0]&&a.AppTiles[0].tileImageUrl===a.AppTiles[0].tile1x1ImageUrl)
a.MediumImageIs1x1=true;
if(a.isDesktopApp)
a.mediumImage=a.largeImage;
a.tilePrepCompleted=true
},populateTileTemplate:function(h,a,g)
{
var b=document.createElement("div"),
e=false;
if(g&&a.TruncatedDescription)
{
e=true;
a.FullDescription=a.Description;
a.Description=a.TruncatedDescription
}
b.innerHTML=WinStore.Utilities.replaceTokens(h,a);
if(e)
{
a.Description=a.FullDescription;
a.FullDescription=null
}
var f=this.substituteAppInfoPriceAsAppropriate(a),
c=WinStore.Utilities.firstChildByClassOrDefault(b,"appPromoPrice"),
d=WinStore.Utilities.firstChildByClassOrDefault(b,"appFreeTrial");
if(!f&&a.PromoEndDate)
{
priceElem=WinStore.Utilities.firstChildByClassOrDefault(b,"appPrice");
priceElem&&
WinJS.Utilities.addClass(priceElem,"appOldPrice");
c&&
c.setAttribute("aria-hidden","false");
b.firstElementChild.setAttribute(WinStore.BI.formatFieldNameAsAttribute(WinStore.BI.biFieldNames.AppIsPromotion),"1")
}
else
if(c)
{
c.style.display="none";
c.setAttribute("aria-hidden","true")
}
if(f||!a.FreeTrialText)
{
if(d)
{
d.style.display="none";
d.setAttribute("aria-hidden","true")
}
}
else
d&&
d.setAttribute("aria-hidden","false");
WinStore.Utilities.isUniversalApp(a)&&
b.firstElementChild.setAttribute(WinStore.BI.formatFieldNameAsAttribute(WinStore.BI.biFieldNames.AppIsUniversal),"1");
return b.firstElementChild
},populateCollectionTileTemplate:function(h,b)
{
for(var e=document.createElement("div"),
d=b.appInfo.length,
a=0;a<d;a++)
{
var g=b.appInfo[a],
j="LogoURL_"+a,
i="AppName_"+a;
b[j]=g.LogoURL;
b[i]=g.Name
}
e.innerHTML=WinStore.Utilities.replaceTokens(h,b);
for(var c=e.getElementsByClassName("appIconContainer"),
a=c.length;a>d;a--)
c[d].parentNode.removeChild(c[d]);
for(var a=c.length-1;a>=0;a--)
{
c[a].style.backgroundColor=b.appInfo[a].BackgroundColor;
var f=WinStore.Utilities.firstChildByClassOrDefault(c[a],"appIcon");
f&&
f.addEventListener("error",WinStore.Utilities.onBrokenImageError)
}
return e.firstElementChild
},replaceTokens:function(b,a)
{
return b.replace(/{{(\w+)}}/g,function(d,c)
{
var b=a[c];
if(b===undefined||b===null)
{
b=d;
om.logVerboseMessage("WinStore.Utilities.replaceTokens: No value mapped to dataObject field "+c+", not replacing")
}
return b
})
},patchImageSources:function(e)
{
if(!WinStore.Navigation.isSuspended)
for(var c=e.getElementsByClassName("appIcon"),
b=0;b<c.length;++b)
{
var a=c[b],
d=a.getAttribute("source");
if(d)
{
a.src=d;
a.removeAttribute("source")
}
}
},populateRatingsControl:function(f,e)
{
var a=f.querySelector("[rating]");
if(a)
{
a.removeAttribute("rating");
if(!e.RatingCount)
{
a.style.display="none";
var c=f.querySelector(".appRatingCount");
c&&
WinJS.Utilities.addClass(c,"notYetRated")
}
else
{
var b=parseFloat(e.Rating),
d={disabled:true};
if(!isNaN(b)&&b>=1)
d.averageRating=b;
var g=new WinStore.Controls.Rating(a,d)
}
}
},postProcessTileTemplate:function(g,b,a,j,k)
{
if(!k)
{
WinStore.Utilities.patchImageSources(b);
WinStore.Utilities.populateRatingsControl(b,a)
}
var d=WinStore.Utilities.firstChildByClassOrDefault(b,"appIconContainer");
if(d)
{
d.style.backgroundColor=a.BackgroundColor;
var c=WinStore.Utilities.firstChildByClassOrDefault(d,"appIcon");
c&&
c.addEventListener("error",WinStore.Utilities.onBrokenImageError);
a.MediumImageIs1x1&&
WinJS.Utilities.addClass(c,"mediumAppTileSquare");
a.isDesktopApp&g==="mediumAppTileTemplate"&&
WinJS.Utilities.addClass(c,"mediumDesktopAppTileIcon")
}
if(!a.FreeTrialAvailable&&!a.PromoPrice&&WinStore.Utilities.isUniversalApp(a))
{
var f=b.querySelector(".appContentContainer .appPrice");
if(f)
{
var e=document.createElement("img");
e.setAttribute("src",WinStore.Utilities.getUniversalAppBadgeURL());
WinJS.Utilities.addClass(e,"appTileUniversalAppBadge");
f.parentNode.insertBefore(e,f.nextSibling)
}
}
var h=TileLayout[g];
if(h)
{
var i=WinStore.Utilities.generateAriaLabelTemplate(h,j,a);
b.setAttribute("aria-label",WinStore.Utilities.replaceTokens(i,a))
}
},getTileFromTemplate:function(b)
{
var a=this[b];
if(!a)
{
var c=document.getElementById(b);
if(c)
{
a=c.innerHTML;
this[b]=a
}
}
return a
},createTile:function(b,d,e,f)
{
var c=WinStore.Utilities.getTileFromTemplate(b),
a=null;
if(c)
{
a=WinStore.Utilities.populateTileTemplate(c,d,true);
WinStore.Utilities.postProcessTileTemplate(b,a,d,e,f)
}
return a
},createCollectionTile:function(c)
{
var b=WinStore.Utilities.getTileFromTemplate("collectionTileTemplate"),
a=null;
if(b)
{
a=WinStore.Utilities.populateCollectionTileTemplate(b,c);
WinStore.Utilities.patchImageSources(a)
}
return a
},createPlaceholderTile:function(h)
{
var g=WinStore.Utilities.getTileFromTemplate(h),
a=document.createElement("div");
if(g)
{
a.innerHTML=g;
var d=WinStore.Utilities.firstChildByClassOrDefault(a,"appContentContainer");
if(d)
d.style.display="none";
var e=WinStore.Utilities.firstChildByClassOrDefault(a,"appRecommendation");
if(e)
e.style.display="none";
var c=WinStore.Utilities.firstChildByClassOrDefault(a,"appIcon");
if(c)
{
var f=c.parentNode,
b=document.createElement("div");
WinJS.Utilities.addClass(b,"appIcon");
WinJS.Utilities.addClass(b,"placeholderGlyph");
WinJS.Utilities.addClass(f,"placeholder");
c.style.display="none";
f.appendChild(b)
}
}
return a.firstElementChild
},showElement:function(b,d,c)
{
var a=b;
if(typeof b==="string")
a=document.getElementById(b);
if(a)
{
a.style.display=!d?"none":c?c:"block";
a.setAttribute("aria-hidden",(!d).toString())
}
},showRatingSystem:function(a,b)
{
if(a)
{
var f=document.getElementById(b+"GameRatingIconImg");
if(f)
{
var i=a.levelImageUrl?a.levelImageUrl.replace(/^.*[\/]/,""):"";
f.src="../../../../../images/2/rating/"+i;
f.alt=a.system+": "+a.level;
f.ondragstart=function()
{
return false
}
}
var h=document.getElementById(b+"GameRatingLink");
if(h)
{
h.href=a.systemUrl;
h.innerText=a.level
}
if(om.namespace&&om.namespace.market.toLowerCase()==="tw"&&a.systemId===om.namespace.parentalControlsPreferredSystemId)
{
document.getElementById(b+"GameRatingWarning").innerText="注意使用時間，避免遊戲沉迷";
this.showElement(b+"GameRatingWarning",true)
}
else
this.showElement(b+"GameRatingWarning",false);
var d=document.getElementById(b+"GameRatingDescriptors");
if(d)
{
while(d.hasChildNodes())
d.removeChild(d.firstChild);
if(a.descriptors&&a.descriptors.length>0)
{
for(var g=[],
c=0;c<a.descriptors.length;c++)
if(a.descriptors[c].imageUrl&&a.descriptors[c].imageUrl!=="")
{
i=a.descriptors[c].imageUrl.replace(/^.*[\/]/,"");
var e=document.createElement("img");
e.src="../../../../../images/2/rating/"+i;
e.alt=a.descriptors[c].name;
e.ondragstart=function()
{
return false
};
e.className="pdpGameRatingDescriptorImg";
d.appendChild(e)
}
else
g.push(a.descriptors[c].name);
if(g.length>0)
d.innerText=g.join(", ")
}
}
this.showElement(b+"GameRatingsContent",true)
}
else
this.showElement(b+"GameRatingsContent",false)
},onBrokenImageError:function(a)
{
if(a.currentTarget)
{
var b="ImageUrl = "+(a.currentTarget.src?a.currentTarget.src:"null");
om.qosScenarioFailWithInit(WinStore.Utilities.QosScenario.ImageMissing,WinStore.Utilities.ErrorCodes.HTTP_STATUS_NO_CONTENT,b);
WinStore.Utilities.replaceBrokenImageIcon(a.currentTarget)
}
},replaceBrokenImageIcon:function(a)
{
if(a)
{
if(a.getAttribute("noBrokenImageReplacement"))
return;
for(var c=document.createElement("span"),
d=0;d<a.attributes.length;++d)
{
var b=a.attributes[d];
b.nodeName!=="src"&&
c.setAttribute(b.nodeName,b.nodeValue)
}
WinJS.Utilities.addClass(c,"appTileBrokenImage");
a.removeEventListener("error",WinStore.Utilities.onBrokenImageError,false);
a.swapNode(c)
}
},_licensedApps:{value:[],writable:true},_licensedAppsLastRefresh:{value:0,writable:true},_licensedAppsRefreshRequested:{value:false,writable:true},_licensedAppsMap:{value:null,writable:true},getLicensedAppsMap:function()
{
var a=WinStore.Utilities._licensedAppsMap;
if(a===null)
{
a=new Map;
WinStore.Utilities._licensedAppsMap=a
}
return a
},makePFNKeyedLicensedAppsMap:function(a)
{
WinStore.Utilities._licensedApps=a;
var b=WinStore.Utilities.getLicensedAppsMap();
a.forEach(function(a)
{
a.PFN&&
b.set(a.PFN,a)
})
},isAppInstalled:function(c)
{
var b=false,
a=WinStore.Utilities.getLicenseInstallDataByPFN(c);
if(a)
b=a.Installed;
return b
},getLicenseInstallDataByPFN:function(b)
{
var a=null;
if(WinStore.Utilities._licensedAppsMap)
a=WinStore.Utilities._licensedAppsMap.get(b);
return a
},getLicenseInstallData:function(c,d)
{
for(var a=null,
b=0;b<WinStore.Utilities._licensedApps.length;b++)
if(WinStore.Utilities._licensedApps[b].Id===c)
{
a=WinStore.Utilities._licensedApps[b];
break
}
if(a===null&&(WinStore.Utilities._licensedApps.length!==0||d))
a={Id:c,UserLicense:"NONE",Installed:false};
return a
},refreshLicensedAppListIfNeeded:function()
{
var c=Date.now(),
b=c-WinStore.Utilities._licensedAppsLastRefresh,
a=b>3.6e6;
if(!a)
{
a=WinStore.Utilities._licensedAppsRefreshRequested&&b>1.2e5;
if(!a)
if(WinStore.Utilities._licensedAppsMap==null||WinStore.Utilities._licensedAppsMap.size===0)
a=!WinStore.Utilities._licensedAppsRefreshRequested
}
if(a)
{
WinStore.Utilities._licensedAppsLastRefresh=c;
WinStore.Utilities._licensedAppsRefreshRequested=true;
om.refreshLicensedAppList()
}
},getTodayAsString:function()
{
var a=navigator.userLanguage,
b=a.indexOf("_");
if(b!==-1)
a=a.substring(0,b);
return (new Intl.DateTimeFormat(a)).format(new Date)
},addNewLicense:function(b,c)
{
var a=WinStore.Utilities.getLicenseInstallDataByPFN(b.PackageFamilyName);
if(a&&a.UserLicense)
{
var e=String(a.UserLicense);
if(e==="NONE")
a=null;
else
if(e==="VALID_TRIAL"&&!c)
{
a.Id=b.Id;
a.ReleaseId=b.ReleaseId;
a.UserLicense="FULL";
a.TrialHoursRemaining=2.4e8;
a.LicAcqDate=WinStore.Utilities.getTodayAsString()
}
}
if(a===null||a===undefined)
{
var d=WinStore.Utilities.getLicensedAppsMap();
if(d)
{
a={Id:b.Id,PFN:b.PackageFamilyName,ReleaseId:b.ReleaseId,UserLicense:c?"VALID_TRIAL":"FULL",TrialHoursRemaining:(c?b.TrialDuration?b.TrialDuration:0:1e7)*24,LicAcqDate:WinStore.Utilities.getTodayAsString(),Installed:false};
d.set(a.PFN,a);
WinStore.Utilities._licensedApps&&
WinStore.Utilities._licensedApps.unshift(a)
}
}
},setInstalledInLicensedAppList:function(b)
{
var a=WinStore.Utilities.getLicenseInstallDataByPFN(b);
if(a)
{
a.Installed=true;
a.InstallDate=WinStore.Utilities.getTodayAsString()
}
},firstChildByClassOrDefault:function(d,b)
{
var c=null;
if(d&&b)
{
var a=d.getElementsByClassName(b);
if(a&&a[0])
c=a[0]
}
return c
},getAttributeValueOrDefault:function(c,b)
{
var a=null;
if(c)
{
var d=c.attributes[b];
if(d)
a=d.value;
else
om.logWarningMessage("WinStore.Utilities.getAttributeValueOrDefault: no "+b+" attribute on element. Unable to query for value")
}
else
om.logWarningMessage("WinStore.Utilities.getAttributeValueOrDefault: no element specified. Unable to query for attribute");
return a
},renameAttributes:function(d,a,f)
{
if(d)
for(var e=d.querySelectorAll("["+a.replace(".","\\.")+"]"),
c=0;c<e.length;c++)
{
var b=e[c],
g=b.getAttribute(a);
b.removeAttribute(a);
b.setAttribute(f,g)
}
},createElementWithClass:function(d,c,b)
{
var a=null,
e=b?b:"div";
if(!document)
return a;
a=document.createElement(e);
if(a)
{
WinJS.Utilities.addClass(a,d);
c&&
a.setAttribute("id",c)
}
return a
},getTileLayout:function(b)
{
var a=TileLayout[b];
if(!a)
{
om.logErrorMessage("WinStore.Utilities.getTileLayout: no layout data found for tile template "+b+", using small tile template layout");
a=TileLayout["smallAppTileTemplate"];
!a&&
om.logErrorMessage("WinStore.Utilities.getTileLayout: no layout data found for fallback smallAppTileTemplate, hard coding to 310px x 70px.")
}
return a
},addTooltipsToOverflowedTiles:function(a,b)
{
return function()
{
if(a.loadingState==="complete")
{
var h=a.indexOfFirstVisible,
l=a.indexOfLastVisible;
if(h<0||h>l)
return;
for(var i=h;i<=l;i++)
{
var c=a.elementFromIndex(i);
if(c===null||c.hasAttribute("data-tooltip-built"))
continue;
var d=[];
if(b||WinJS.Utilities.hasClass(c,"appTileHome"))
{
var e=c.getElementsByClassName("appName")[0],
n=c.getElementsByClassName("appTileMiddleRow")[0];
if(WinStore.Utilities.isOverflowed(n))
{
var p=c.getElementsByClassName("appCategory")[0].innerText;
d.push(e.innerText,p)
}
else
WinStore.Utilities.isOverflowed(e)&&
d.push(e.innerText)
}
else
if(WinJS.Utilities.hasClass(c,"featureTile"))
{
var j=c.getElementsByClassName("featureTitle")[0],
g=c.getElementsByClassName("featureSubtitle")[0],
o=!!g.getElementsByClassName("featuredAppPrice")[0];
if(WinStore.Utilities.isOverflowed(j)||WinStore.Utilities.isOverflowed(g))
{
d.push(j.innerText);
!o&&
d.push(g.innerText)
}
}
else
if(WinJS.Utilities.hasClass(c,"dgListTile"))
{
var k=c.getElementsByClassName("dgListText")[0];
WinStore.Utilities.isOverflowed(k)&&
d.push(k.innerText)
}
else
if(WinJS.Utilities.hasClass(c,"groupHeader"))
{
if(WinStore.Utilities.isOverflowed(c))
{
var m=c.firstChild;
m.nodeType===Node.TEXT_NODE&&
d.push(m.data)
}
}
else
if(WinJS.Utilities.hasClass(c,"appInstallTile"))
{
var e=c.getElementsByClassName("appInstallTileName")[0];
if(WinStore.Utilities.isOverflowed(e))
{
var f=c.getAttribute("aria-label");
f&&
d.push(f)
}
}
else
if(WinJS.Utilities.hasClass(c,"appUpdReacqTile"))
{
var e=c.getElementsByClassName("appName")[0];
if(WinStore.Utilities.isOverflowed(e))
{
var f=c.getAttribute("aria-label");
f&&
d.push(f)
}
}
c.setAttribute("title",d.join("\n"));
c.setAttribute("data-tooltip-built","true")
}
}
}
},currentScalingFactor:{value:null,writable:true},getScalingFactor:function()
{
if(!WinStore.Utilities.currentScalingFactor)
{
var a="1x";
if(matchMedia("(min-resolution: 174dpi)").matches&&matchMedia("(min-height: 1080px) and (max-height: 1439px)").matches&&matchMedia("(min-width: 1920px) and (max-width: 2659px)").matches)
a="1.4x";
else
if(matchMedia("(min-resolution: 240dpi)").matches&&matchMedia("(min-height: 1440px)").matches&&matchMedia("(min-width: 2560px)").matches)
a="1.8x";
WinStore.Utilities.currentScalingFactor=a
}
return WinStore.Utilities.currentScalingFactor
},isLargeScreen:function()
{
var a=false;
if(matchMedia("(min-height: 1080px)").matches)
a=true;
return a
},generateNewGuid:function()
{
return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(b)
{
var a=Math.random()*16|0,
c=b=="x"?a:a&3|8;
return c.toString(16)
})
},displayPDP:function(e,a,c)
{
var b="?pid="+e;
if(a)
{
while(a.srcElement)
{
var d=a.srcElement.getAttribute("FlightInfo");
if(d)
{
b+="&flt="+d;
break
}
a.srcElement=a.srcElement.parentElement
}
if(a.formCode&&a.formCode.length>0)
b=b+"&formCode="+a.formCode;
if(a.origIg&&a.origIg.length>0)
b=b+"&origIg="+a.origIg
}
if(c)
b=b+c;
om.showPurchasePDP(b)
},showAppsByDeveloper:function(a)
{
var b="";
if(typeof a==="string")
b=a;
else
{
b=a.currentTarget.innerText;
WinStore.BI.fireClickEvent(WinStore.BI.biDataPoint.objectName.clientListSmallTitle,{"CList.Id":WinStore.BI.biDataPoint.listId.developerApps},a.currentTarget)
}
event.stopPropagation();
var c="?dname="+encodeURIComponent(b);
om.logInfoMessage("WinStore.Utilities.showAppsByDeveloper: "+c);
om.showResultsView(c)
},generateGuid:function()
{
return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(b)
{
var a=Math.random()*16|0,
c=b=="x"?a:a&3|8;
return c.toString(16)
})
},readAloud:function(a)
{
var b=document.getElementById("storeNarratorAlert");
om.logVerboseMessage("WinStore.Utilities.readAloud: "+a);
if(b&&a)
b.innerText=a
},readAloudAssertive:function(a)
{
var b=document.getElementById("storeNarratorAlertAssertive");
om.logVerboseMessage("WinStore.Utilities.readAloudAssertive: "+a);
if(b&&a)
b.innerText=a
},readAloudRude:function(a)
{
var b=document.getElementById("storeNarratorAlertRude");
om.logVerboseMessage("WinStore.Utilities.readAloudRude: "+a);
if(b&&a)
b.innerText=a
},getPromoEndDateString:function(c)
{
var b=new Date(c),
d=new Date(Date.now()),
a=Math.floor((b-d)/(1e3*60));
if(a<0)
return null;
else
if(a==0)
return "Less than one minute";
else
if(a<60)
return "%1 minutes remaining".replace("%1",1+a);
else
if(a<24*60)
return "%1 hours remaining".replace("%1",1+Math.floor(a/60));
else
if(a<14*24*60)
{
var e=1+Math.floor(a/(24*60));
return "%1 days remaining".replace("%1",e)
}
else
return "until %1".replace("%1",b.toLocaleDateString())
},getPromoBoundaryInMS:function(d)
{
var a=new Date(d),
c=new Date(Date.now()),
b=Math.floor((a-c)/(1e3*60));
if(b<0)
return null;
else
if(b!=0)
if(b<60)
a.setMinutes(a.getMinutes()-b);
else
if(b<24*60)
a.setHours(a.getHours()-Math.floor(b/60));
else
if(b<14*24*60)
{
var e=Math.floor(b/(24*60));
a.setDate(a.getDate()-e)
}
else
a.setDate(a.getDate()-14);
return Math.round(a-c)
},generateAriaLabelTemplate:function(c,e,b)
{
var a=[];
a.push("{{Name}}");
if(c.name==="medium")
{
var d=b.Description;
d&&
a.push(d.substring(0,ShortDescriptionCharacterCount))
}
if(b.isDesktopApp)
a.push("Desktop app");
else
if(c.name!=="picksForYou")
{
a.push("Price:  {{Price}}");
b.PromoEndDate&&
a.push("Sale price %1, %2".replace("%1","{{PromoPrice}}").replace("%2",WinStore.Utilities.getPromoEndDateString(b.PromoEndDate)));
b.FreeTrialText&&
a.push("{{FreeTrialText}}")
}
if(c.name!=="picksForYou")
{
if(!b.RatingCount)
a.push("Not yet rated");
else
{
a.push("Rating:  {{Rating}}");
a.push("%1 ratings".replace("%1","{{RatingCountText}}"))
}
e&&
a.push("Category:  {{Category}}")
}
else
b.RecommendationAnnotation&&
a.push("{{RecommendationAnnotation}}");
a.push("Accessibility:  {{Accessible}}");
return a.join("\n")
},appsToTune:{value:[],writable:true},appsSubmitedToTune:{value:[],writable:true},impressionGuid:{value:null,writable:true},tuningRecsTimer:{value:null,writable:true},onTuningClick:function(a,c)
{
if(a&&!WinJS.Utilities.hasClass(a,"appTuningLinkDisabled"))
if(a.attributes&&a.attributes["appId"])
{
var b=a.attributes["appId"].value;
if(b)
{
WinStore.BI.logCustomBI("AppTuningLink",null,a);
WinStore.Utilities.appsToTune.push(b);
a.setAttribute("tabindex","-1");
a.setAttribute("role","");
a.setAttribute("aria-hidden","true");
a.onclick=null;
a.onmspointerdown=null;
WinJS.Utilities.removeClass(a,"win-interactive");
WinJS.Utilities.addClass(a,"appTuningLinkDisabled");
a.innerText="Thanks for your feedback";
WinStore.Utilities.impressionGuid=c;
clearTimeout(WinStore.Utilities.tuningRecsTimer);
WinStore.Utilities.tuningRecsTimer=setTimeout(WinStore.Utilities.submitTuningRecs,5e3)
}
}
},submitTuningRecs:function()
{
if(WinStore.Utilities.appsToTune&&WinStore.Utilities.appsToTune.length>0)
if(WinStore.Utilities.impressionGuid)
{
om.logVerboseMessage("WinStore.Utilities.submitTuningRecs: submitting tuning for impressionId "+WinStore.Utilities.impressionGuid);
WinStore.Utilities.appsSubmitedToTune=WinStore.Utilities.appsSubmitedToTune.concat(WinStore.Utilities.appsToTune);
om.submitTuningRecs(WinStore.Utilities.appsToTune,WinStore.Utilities.impressionGuid);
WinStore.Utilities.appsToTune=[];
WinStore.Navigation.invalidateHomePage()
}
else
om.logWarningMessage("WinStore.Utilities.submitTuningRecs: No impressionGuid set so not submitting tuning recommendations");
clearTimeout(WinStore.Utilities.tuningRecsTimer);
WinStore.Utilities.impressionGuid=null
},appHasBeenTunedOut:function(c)
{
var b=false;
if(c)
for(var a=0;a<WinStore.Utilities.appsSubmitedToTune.length;++a)
if(WinStore.Utilities.appsSubmitedToTune[a]===c)
{
b=true;
break
}
return b
},getSpotlightLanguageFromUrl:function(b)
{
if(b)
{
var a=b.split("/");
if(a.length===7)
return a[3]
}
},isDescendantOfNode:function(d,b)
{
var c=false;
if(d.nodeType&&b.nodeType)
{
var a=d.parentNode;
while(a)
{
if(a===b)
{
c=true;
break
}
a=a.parentNode
}
}
return c
},QosScenario:{value:{DGListMissing:124,SpotLightMissing:125,ImageMissing:300},writable:true},ErrorCodes:{value:{HTTP_STATUS_NO_CONTENT:2147942604},writable:true},updateFrameCount:function(a,c,b)
{
if(1==a)
WinStore.Frame.setAppCount(c,true);
else
0<a&&
om.formatNumber(a,function(a)
{
WinStore.Frame.setAppCount(b.replace("%1",a),true)
})
},setActive:function(a)
{
try
{
a.setActive()
}
catch(b)
{
}
},getUniversalAppBadgeURL:function()
{
if(matchMedia("screen and (-ms-high-contrast)").matches)
return "../../../../../images/2/icons/1x/UA16_HC.png";
else
return "../../../../../images/2/icons/1x/UA16.png"
},isUniversalApp:function(a)
{
if(a&&a.SupportedPlatforms&&Array.isArray(a.SupportedPlatforms))
for(var b=0;b<a.SupportedPlatforms.length;b++)
if(a.SupportedPlatforms[b]>1)
return true;
return false
},universalAppHasRequirements:function(a)
{
if(a&&a.SupportedPlatformRequirements&&Array.isArray(a.SupportedPlatformRequirements))
for(var b=0;b<a.SupportedPlatformRequirements.length;b++)
if(a.SupportedPlatformRequirements[b].platform>1)
return true;
return false
},getUniversalAppRequirements:function(a)
{
var e=[];
if(a&&a.SupportedPlatformRequirements&&Array.isArray(a.SupportedPlatformRequirements))
if(om.namespace&&om.namespace.supportedPlatformRequirements&&Array.isArray(om.namespace.supportedPlatformRequirements))
for(var d=om.namespace.supportedPlatformRequirements,
b=0;b<a.SupportedPlatformRequirements.length;b++)
if(a.SupportedPlatformRequirements[b].platform>1)
for(var c=0;c<d.length;c++)
d[c].id===a.SupportedPlatformRequirements[b].id&&
e.push(d[c].name);
return e
}});
var TileLayout={collectionTileTemplate:{name:"collection",width:"200px",height:"94px",tileHeightpx:94,tileWidthPx:200,bottomMarginPx:0},collectionTileL2Template:{name:"collectionL2",width:"200px",height:"105px",tileHeightpx:105,tileWidthPx:200,bottomMarginPx:0},smallAppTileTemplate:{name:"small",width:"310px",height:"70px",tileHeightPx:70,tileWidthPx:310,bottomMarginPx:20},mediumAppTileTemplate:{name:"medium",width:"310px",height:"280px",tileHeightPx:280,tileWidthPx:310,bottomMarginPx:0},picksForYouAppTileTemplate:{name:"picksForYou",width:"310px",height:"280px",tileHeightPx:280,tileWidthPx:310,bottomMarginPx:0},tallAppTileTemplate:{name:"tall",width:"150px",height:"280px",tileHeightPx:280,tileWidthPx:150,bottomMarginPx:0},textTile:{name:"text",width:"310px",height:"40px",tileHeightPx:40,tileWidthPx:310,bottomMarginPx:0},reacquireTileTemplate:{name:"reacquire",width:"310px",height:"70px"},installingAppTileTemplate:{name:"installingApp",width:"310px",height:"70px"}},
ShortDescriptionCharacterCount=250,
SelectViewState={hidden:0,visible:1,justMachine:2};
WinJS.Namespace.define("WinStore.ReacquirePage",{_myAppCount:{value:null,writable:true},_persistUI:{value:null,writable:true},_navigatingToPDP:{value:false,writable:true},_appBar:{value:null,writable:true},_networkCost:{value:false,writable:true},_onDataLoaded:{value:null,writable:true},_canReacquire:{value:false,writable:true},initControls:function(e)
{
this._myAppCount=null;
this._appBar=null;
this._navigatingToPDP=false;
this._networkCost=false;
this._onDataLoaded=e;
if(!this._persistUI)
this._persistUI={machineId:"NOTPC",machineName:"",sort:"2",indices:[]};
WinStore.Frame.setPageTitle("My apps",false);
if(WinStore.Settings.signedIn)
{
om.getMachineList(this._devicesCallback);
var b=document.getElementById("mainContent");
if(b)
{
this._createListView(this._persistUI.machineId,this._persistUI.sort,true);
var a=this,
c=document.getElementById("computerFilterSelect");
c&&
c.addEventListener("change",function(f)
{
if(f.srcElement.selectedIndex>=0)
{
var h=a._appBar;
h&&
h.hide();
a._persistUI.indices=[];
WinStore.Frame.clearAppCount();
var e=this.getElementsByTagName("option");
if(e)
{
a._myAppCount=null;
var c=e[f.srcElement.selectedIndex].value;
a._persistUI.machineId=c;
a._persistUI.machineName=e[f.srcElement.selectedIndex].machineName;
b=document.getElementById("mainContent");
if(b)
{
var g=b.winControl;
if(g)
{
WinStore.Frame.showProgressRing(true);
g.itemDataSource=a._createDataSource(c,a._persistUI.sort,false)
}
}
else
{
b=document.getElementById("noResults");
if(b)
{
var d=document.createElement("div");
d.id="mainContent";
d.className="mainContentReacquire";
var i=b.parentNode;
i.replaceChild(d,b);
WinStore.Frame.showProgressRing(true);
a._createListView(c,a._persistUI.sort,false)
}
}
}
}
},false);
var d=document.getElementById("viewSortSelect");
d&&
d.addEventListener("change",function(g)
{
if(g.srcElement.selectedIndex>=0)
{
var e=a._appBar;
e&&
e.hide();
a._persistUI.indices=[];
b=document.getElementById("mainContent");
if(b)
{
var d=b.winControl;
if(d)
{
var f=this.getElementsByTagName("option");
if(f)
{
a._myAppCount=null;
var c=f[g.srcElement.selectedIndex].value;
a._persistUI.sort=c;
WinStore.Frame.showProgressRing(true);
d.itemDataSource=a._createDataSource(a._persistUI.machineId,c,false)
}
}
}
}
},false)
}
}
else
{
if(this._onDataLoaded)
{
this._onDataLoaded(true);
this._onDataLoaded=null
}
om.showSettingsPage("yourapps_redirect")
}
},_createListView:function(e,f,d)
{
var c=document.getElementById("mainContent"),
a=new WinJS.UI.ListView(c,{selectionMode:WinJS.UI.SelectionMode.multi,swipeBehavior:WinJS.UI.SwipeBehavior.select,tapBehavior:WinJS.UI.TapBehavior.invokeOnly,itemDataSource:WinStore.ReacquirePage._createDataSource(e,f,d),itemTemplate:WinStore.UpdatesPage.createRenderer(false)});
if(a)
{
var b=this;
a.addEventListener("iteminvoked",function(c)
{
var b=document.getElementById("mainContent");
if(b)
{
var a=b.winControl;
if(a)
{
var d=a.elementFromIndex(c.detail.itemIndex);
d&&
c.detail.itemPromise.done(function(c)
{
WinStore.ReacquirePage._persistUI.indices=a.selection.getIndices();
WinStore.ReacquirePage._navigatingToPDP=true;
var b=c.data.Id;
WinStore.BI.logCustomBI("YourAppView",{"App.ID":b,"App.ReleaseGUID":c.data.ReleaseId});
WinStore.Utilities.displayPDP(b,{formCode:WinStore.BI.biFormCodes.YourAppsPage})
})
}
}
},false);
a.addEventListener("selectionchanged",function()
{
b.updateAppBar(a.selection)
},false);
a.addEventListener("contentanimating",WinStore.Utilities.cancelListViewEntranceAnimation,false);
a.addEventListener("loadingstatechanged",function()
{
c=document.getElementById("mainContent");
if(c)
{
a=c.winControl;
if(a)
if(a.loadingState==="itemsLoaded")
{
if(b._onDataLoaded)
{
b._onDataLoaded(false,null,b.onEntranceAnimationCompleted);
b._onDataLoaded=null
}
}
else
if(a.loadingState==="complete")
if(a._doneInitBI===undefined)
{
a._doneInitBI=true;
WinStore.BI.onPageLoaded();
a.selection.set(b._persistUI.indices);
WinStore.Utilities.setActive(c);
om.etwReacquireListInit(WinStore.ReacquirePage._myAppCount)
}
}
else
if(b._onDataLoaded)
{
b._onDataLoaded(false,null,b.onEntranceAnimationCompleted);
b._onDataLoaded=null
}
},false);
a.addEventListener("loadingstatechanged",WinStore.Utilities.addTooltipsToOverflowedTiles(a,false),false)
}
},doClickSelectAll:function()
{
var a=document.getElementById("mainContent");
if(a)
{
var b=a.winControl;
if(b)
{
WinStore.ReacquirePage._persistUI.indices=[];
b.selection.selectAll()
}
}
},doClickClear:function()
{
var a=document.getElementById("mainContent");
if(a)
{
a.focus();
var b=a.winControl;
if(b)
{
WinStore.ReacquirePage._persistUI.indices=[];
b.selection.clear()
}
}
},doClickInstall:function()
{
WinStore.UpdatesPage.checkNetworkCost(WinStore.ReacquirePage._networkCost,WinStore.ReacquirePage._doClickInstall)
},_doClickInstall:function()
{
var d=document.getElementById("mainContent");
if(d)
{
var a=d.winControl;
if(a&&a.selection.count()>0)
{
var b=null;
if(WinStore.BI.enabled())
{
var f=a.indexOfLastVisible+1,
e=a.selection.count(),
c=document.getElementById("computerFilterSelect"),
g=c&&c.selectedIndex>0?1:0;
b={"YourApps.Filter":g,"YourApps.AppsTotal":f,"YourApps.AppsSelected":e,"YourApps.AppsReacquired":0,"YourApps.AppsReinstalled":0}
}
a.selection.getItems().done(function(c)
{
for(var d=[],
f=0,
e=0,
a=0;a<c.length;a++)
if(c[a].data.Price==="Not installed")
{
om.logInfoMessage("doClickInstall: re-acquiring "+c[a].data.PackageFamilyName);
e++;
d.push(c[a].data.PackageFamilyName)
}
else
if(c[a].data.Price==="Installed")
{
om.logInfoMessage("doClickInstall: re-installing "+c[a].data.PackageFamilyName);
f++;
d.push(c[a].data.PackageFamilyName)
}
if(b&&(e||f))
{
b["YourApps.AppsReacquired"]=e;
b["YourApps.AppsReinstalled"]=f;
WinStore.BI.logCustomBI("AppReInstall",b)
}
if(d.length)
if(WinStore.ReacquirePage._canReacquire)
{
om.installApps(d,0,false);
om.goBack()
}
else
om.showMessageDialog("You need to remove a PC from your Windows Store account before you can install apps on this PC.","You’ve reached the PC limit for your account",[{id:0,text:"Choose a PC to remove"},{id:1,text:"Cancel"}],1,function(a)
{
if(a===0)
om.showSettingsPage("preferences");
else
om.goBack()
})
})
}
}
},_devicesCallback:function(b)
{
var d=document.getElementById("computerFilterSelect");
if(d)
{
d.tabIndex=0;
var h=document.createElement("option");
h.text="All apps";
h.value="";
h.id=0;
d.appendChild(h);
var g=document.createElement("option");
g.text="Apps not installed on this PC";
g.value="NOTPC";
g.id=1;
d.appendChild(g);
if(b&&b.devices)
{
WinStore.ReacquirePage._canReacquire=b.canReacquire;
for(var a=0;a<b.devices.length;a++)
{
var c=document.createElement("option");
if(b.devices[a].systemName)
{
c.text="Apps installed on %1".replace("%1",b.devices[a].systemName);
c.machineName=b.devices[a].systemName
}
else
{
c.text="Apps installed on %1 %2".replace("%1",b.devices[a].manufacturer).replace("%2",b.devices[a].model);
c.machineName=b.devices[a].manufacturer+" "+b.devices[a].model
}
c.value=b.devices[a].machineId;
c.id=a+2;
d.appendChild(c)
}
}
for(var j=d.getElementsByTagName("option"),
a=0;a<j.length;a++)
if(WinStore.ReacquirePage._persistUI.machineId===j[a].value)
{
j[a].selected=true;
break
}
}
var i=document.getElementById("viewSortSelect");
if(i)
{
i.tabIndex=0;
var e=document.createElement("option");
e.text="Sort by date";
e.value=2;
e.id=2;
i.appendChild(e);
var f=document.createElement("option");
f.text="Sort by name";
f.value=3;
f.id=3;
i.appendChild(f);
switch(WinStore.ReacquirePage._persistUI.sort)
{
case "3":
f.selected=true;
break;
case "2":
default:
e.selected=true
}
}
},onEntranceAnimationCompleted:function()
{
var b,
c=document.getElementById("mainContent");
if(c)
{
var a=c.winControl;
if(a)
if(a.selection.count()>0)
b=a.selection
}
WinStore.ReacquirePage.updateAppBar(b)
},_createDataSource:function(f,h,e)
{
var a=[],
b=this;
function g(k,l)
{
WinStore.ReacquirePage._networkCost=k.networkCost;
var g=k.appList;
WinStore.ReacquirePage._myAppCount=g.length;
if(0<g.length)
{
for(var f=0;f<g.length;f++)
{
var c=g[f];
if(c)
{
WinStore.Utilities.prepareAppInfoData(c,f,true);
if(c.Applicability==="NI"&&WinStore.Utilities.checkAppHardwareRequirements(c)>=HWAction.warn)
c.Applicability="NA";
var h;
if(c.Applicability==="NI")
h="Not installed";
else
if(c.Applicability==="INST")
h="Installed";
else
h="Not available";
c.Price=h;
c.Category=(c.UserLicense==="Full"?"Purchased":"Trial version")+"  "+c.InstallDate;
c.itemIndex=f;
c.tilePositionBI=f+1;
a[f]={key:f.toString(),data:c}
}
else
om.logErrorMessage("WinStore.ReacquirePage._createDataSource.onResults: Could not retrieve MyApps list")
}
WinStore.ReacquirePage.showSelectElements(SelectViewState.visible);
if(!e)
{
WinStore.ReacquirePage.updateAppBar();
WinStore.Frame.showProgressRing(false)
}
var i;
if(g.length===1)
i="1 app";
else
i="%1 apps".replace("%1",g.length);
WinStore.Frame.setAppCount(i,true)
}
else
{
om.logInfoMessage("WinStore.ReacquirePage._createDataSource.onResults: MyApps List hidden since there are no apps in the list");
WinStore.Frame.showProgressRing(false);
var j=document.getElementById("mainContent");
if(j)
{
var d=document.createElement("div");
d.id="noResults";
if(WinStore.ReacquirePage._persistUI.machineId==="")
{
d.className="win-type-x-large noResultsUpdReacq";
d.innerText="You haven’t installed any apps yet.";
WinStore.ReacquirePage.showSelectElements(SelectViewState.hidden)
}
else
if(WinStore.ReacquirePage._persistUI.machineId==="NOTPC")
{
d.className="win-type-x-large noResultsMachineSpecific";
d.innerText="All of your available apps are installed on this PC.";
WinStore.ReacquirePage.showSelectElements(SelectViewState.justMachine)
}
else
{
d.className="win-type-x-large noResultsMachineSpecific";
d.innerText="The apps installed on %1 are no longer available in the Windows Store.".replace("%1",WinStore.ReacquirePage._persistUI.machineName);
WinStore.ReacquirePage.showSelectElements(SelectViewState.justMachine)
}
var m=j.parentNode;
m.replaceChild(d,j)
}
if(b._onDataLoaded)
{
b._onDataLoaded(false);
b._onDataLoaded=null
}
WinStore.Frame.clearAppCount();
WinStore.BI.onPageLoaded()
}
l.success()
}
var c={itemsFromIndex:function(b)
{
return new WinJS.Promise(function(c)
{
c({items:a.slice(0),offset:b,totalCount:a.length,absoluteIndex:b,atStart:true,atEnd:true})
})
},getCount:function()
{
if(WinStore.ReacquirePage._myAppCount!==null)
return new WinJS.Promise(function(a)
{
a(WinStore.ReacquirePage._myAppCount)
});
else
return new WinJS.Promise(function(b,c)
{
om.getYourAppsList(f,h,g,{success:function()
{
b(a.length)
},error:function()
{
c(new WinJS.ErrorFromName(WinJS.UI.FetchResult.noResponse))
}})
})
}},
d=WinJS.Class.derive(WinJS.UI.VirtualizedDataSource,function(a)
{
this._baseDataSourceConstructor(a)
});
return new d(c)
},showSelectElements:function(c)
{
var b=document.getElementById("headerBottomReacquire"),
a=document.getElementById("viewSortSelect");
if(b&&a)
if(c===SelectViewState.hidden)
{
b.style.visibility="hidden";
a.style.visibility="hidden"
}
else
{
b.style.visibility="visible";
if(c===SelectViewState.justMachine)
a.style.visibility="hidden";
else
a.style.visibility="visible"
}
},updateAppBar:function(d)
{
if(WinStore.ReacquirePage._persistUI)
{
var a=WinStore.ReacquirePage._appBar;
if(a===null)
{
var c=document.getElementById("appBarContainer");
if(c)
{
var g=c.currentStyle.direction!=="rtl",
f=WinStore.UpdatesPage.initAppBarCommands(false,g);
a=new WinJS.UI.AppBar(c,{commands:f,sticky:true});
WinStore.ReacquirePage._appBar=a
}
}
if(a)
{
var e=WinStore.ReacquirePage._persistUI.machineId==="NOTPC",
b=[];
if(e)
b.push(selectAllCmd);
else
b.push(clearCmd);
if(d)
d.getItems().done(function(c)
{
for(var f=false,
d=0;d<c.length;d++)
if(c[d].data.Price==="Not installed"||c[d].data.Price==="Installed")
{
f=true;
break
}
var g=c.length;
if(g!==0)
{
e&&
b.push(clearCmd);
if(f)
{
b.push(sep);
b.push(installCmd)
}
}
a.showOnlyCommands(b);
a.hidden&&
a.show()
});
else
if(WinStore.ReacquirePage._myAppCount>0)
{
a.showOnlyCommands(b);
a.show()
}
}
}
},onPageUnload:function()
{
if(!this._navigatingToPDP)
WinStore.ReacquirePage._persistUI=null;
WinStore.Frame.showPurchaseProgress(false);
if(this._onDataLoaded)
{
this._onDataLoaded(true);
this._onDataLoaded=null
}
},setApplicabilityAttribute:function(c,b)
{
var a="NA";
if(b==="Not installed")
a="NI";
else
if(b="Installed")
a="INST";
c.setAttribute("Applicability",a)
}});
WinJS.Namespace.define("WinStore.UpdatesPage",{_urlParams:{value:null,writable:true},_updateCount:{value:null,writable:true},_selectedIndex:{value:null,writable:true},_waitingForProgressCallback:{value:false,writable:true},_networkCost:{value:false,writable:true},_onDataLoaded:{value:null,writable:true},initControls:function(f,e)
{
WinJS.UI.processAll();
this._urlParams=f;
this._updateCount=null;
this._networkCost=false;
this._onDataLoaded=e;
WinStore.Frame.setPageTitle("App updates",false);
WinStore.Frame.showUpdatesLink(false);
var c=document.getElementById("mainContent");
if(c)
{
var d=WinStore.Utilities.getUrlParam(this._urlParams,"rescan");
if(d==="")
d="0";
else
om.updateTravelLogCurrentPageParams("?rescan=0");
var a=new WinJS.UI.ListView(c,{selectionMode:WinJS.UI.SelectionMode.multi,swipeBehavior:WinJS.UI.SwipeBehavior.select,tapBehavior:WinJS.UI.TapBehavior.invokeOnly,itemDataSource:this._createDataSource(d),itemTemplate:WinStore.UpdatesPage.createRenderer(true)});
if(a)
{
var b=this;
a.addEventListener("iteminvoked",function(c)
{
var a=document.getElementById("mainContent");
if(a)
{
var b=a.winControl;
if(b)
{
var d=b.elementFromIndex(c.detail.itemIndex);
d&&
c.detail.itemPromise.done(function(b)
{
var a=b.data.Id;
WinStore.BI.logCustomBI("AppUpdateView",{"App.Id":a});
WinStore.PDP.disableAcquisition();
WinStore.PDP.setDefaultTab("details");
WinStore.Utilities.displayPDP(a,{formCode:WinStore.BI.biFormCodes.UpdatesPage})
})
}
}
},false);
a.addEventListener("selectionchanged",function()
{
b.updateAppBar(a.selection.count())
},false);
a.addEventListener("contentanimating",WinStore.Utilities.cancelListViewEntranceAnimation,false);
a.addEventListener("loadingstatechanged",function()
{
c=document.getElementById("mainContent");
if(c)
{
a=c.winControl;
if(a)
if(a.loadingState==="itemsLoaded")
{
if(b._onDataLoaded)
{
b._onDataLoaded(false,null,b.onEntranceAnimationCompleted);
b._onDataLoaded=null
}
}
else
if(a.loadingState==="complete"&&a._doneInitBI===undefined)
{
a._doneInitBI=true;
WinStore.BI.onPageLoaded();
om.etwUpdateListInit();
if(b._selectedIndex===null)
a.selection.selectAll();
else
{
a.selection.set(b._selectedIndex);
b._selectedIndex=null
}
WinStore.Utilities.setActive(c)
}
}
else
if(b._onDataLoaded)
{
b._onDataLoaded(false,null,b.onEntranceAnimationCompleted);
b._onDataLoaded=null
}
},false);
a.addEventListener("loadingstatechanged",WinStore.Utilities.addTooltipsToOverflowedTiles(a,true),false)
}
}
},doClickSelectAll:function()
{
var b=document.getElementById("mainContent");
if(b)
{
var a=b.winControl;
a&&WinStore.UpdatesPage._updateCount!==a.selection.count()&&
a.selection.selectAll()
}
},doClickClear:function()
{
var a=document.getElementById("mainContent");
if(a)
{
a.focus();
var b=a.winControl;
b&&
b.selection.clear()
}
},checkNetworkCost:function(b,a)
{
if(b)
om.showMessageDialog("Downloading this app using a mobile broadband or metered Internet connection might result in additional charges to your data plan.","Do you want to continue this download?",[{id:0,text:"Yes"},{id:1,text:"No"}],1,function(b)
{
b===0&&
a()
});
else
a()
},doClickInstall:function()
{
var b=document.getElementById("mainContent");
if(b)
{
var a=b.winControl;
if(a&&a.selection.count()>0)
{
var d=WinStore.UpdatesPage._updateCount,
c=a.selection.count();
WinStore.BI.logCustomBI("AppUpdate",{AppsTotal:d,AppsSelected:c});
a.selection.getItems().done(function(a)
{
var d=[],
c=false;
om.logInfoMessage("doClickInstall: installing "+a.length+" updates.");
for(var b=0;b<a.length;b++)
{
om.logInfoMessage("doClickInstall: installing update for "+a[b].data.Id);
d.push(a[b].data.Id);
if(a[b].data.downloadRequired)
c=true
}
WinStore.UpdatesPage.checkNetworkCost(c&&WinStore.UpdatesPage._networkCost,function()
{
WinStore.UpdatesPage.setInstallingUI();
om.installApps(d,0,true);
WinStore.UpdatesPage._waitingForProgressCallback=true
})
})
}
}
},onInstallProgress:function()
{
if(WinStore.UpdatesPage._waitingForProgressCallback)
{
WinStore.UpdatesPage._waitingForProgressCallback=false;
WinStore.Frame.showPurchaseProgress(false);
om.showInstallsPage(false)
}
},onEntranceAnimationCompleted:function()
{
if(WinStore.UpdatesPage._updateCount>0)
{
var a=document.getElementById("appBarContainer");
if(a)
{
var b=a.winControl;
if(!b)
{
var f=a.currentStyle.direction!=="rtl",
e=WinStore.UpdatesPage.initAppBarCommands(true,f);
b=new WinJS.UI.AppBar(a,{commands:e,sticky:true})
}
if(b)
{
var c=document.getElementById("mainContent");
if(c)
{
var d=c.winControl;
d&&
WinStore.UpdatesPage.updateAppBar(d.selection.count())
}
b.show()
}
}
}
},_createDataSource:function(f)
{
var a=this,
b=[];
function e(j,k)
{
WinStore.UpdatesPage._networkCost=j.networkCost;
var h=j.appList,
e=a._updateCount=h.length;
if(0<e)
for(var c=0;c<e;c++)
{
var d=h[c].appInfo;
if(d)
{
WinStore.Utilities.prepareAppInfoData(d,c,true);
d.Price="";
d.downloadRequired=h[c].downloadRequired;
d.itemIndex=c;
d.tilePositionBI=c+1;
b[c]={key:c.toString(),data:d}
}
else
om.logErrorMessage("WinStore.UpdatesPage._createDataSource.onResults: Could not retrieve updates list")
}
else
{
om.logInfoMessage("WinStore.UpdatesPage._createDataSource.onResults: updates List hidden since there are no updates available");
var i=document.getElementById("mainContent");
if(i)
{
var f=document.createElement("div");
f.id="noResults";
f.className="win-type-x-large noResultsUpdReacq";
f.innerText="No updates available.";
var l=i.parentNode;
l.replaceChild(f,i)
}
}
if(0<e)
{
var g;
if(e===1)
g="1 update available";
else
g="%1 updates available".replace("%1",e);
WinStore.Frame.setAppCount(g,true)
}
else
if(a._onDataLoaded)
{
a._onDataLoaded(false);
a._onDataLoaded=null;
WinStore.BI.onPageLoaded()
}
k.success()
}
var c={itemsFromIndex:function(a)
{
return new WinJS.Promise(function(c)
{
c({items:b.slice(0),offset:a,totalCount:b.length,absoluteIndex:a,atStart:true,atEnd:true})
})
},getCount:function()
{
if(a._updateCount!==null)
return new WinJS.Promise(function(b)
{
b(a._updateCount)
});
else
return new WinJS.Promise(function(a,c)
{
om.getUpdatesList(f==="1"?true:false,e,{success:function()
{
a(b.length)
},error:function()
{
c(new WinJS.ErrorFromName(WinJS.UI.FetchResult.noResponse))
}})
})
}},
d=WinJS.Class.derive(WinJS.UI.VirtualizedDataSource,function(a)
{
this._baseDataSourceConstructor(a)
});
return new d(c)
},onPageUnload:function()
{
if(this._waitingForProgressCallback)
{
this._waitingForProgressCallback=false;
WinStore.Frame.showPurchaseProgress(false)
}
WinStore.Frame.showUpdatesLink(true);
if(this._onDataLoaded)
{
this._onDataLoaded(true);
this._onDataLoaded=null
}
},updateAppBar:function(c)
{
var b=document.getElementById("appBarContainer").winControl;
if(b)
{
var a=[selectAllCmd];
if(c!==0)
{
a.push(clearCmd);
a.push(sep);
a.push(installCmd)
}
b.showOnlyCommands(a)
}
},createRenderer:function(c)
{
var e="{{Name}}\n{{Category}}\n{{Price}}",
a="reacquireTileTemplate",
d=document.getElementById(a).innerHTML,
b=WinStore.Utilities.getTileLayout(a);
function f(h)
{
var a=document.createElement("div");
a.className="appUpdReacqTile";
a.style.width=b.width;
a.style.height=b.height;
var f,
g;
return {element:a,renderComplete:h.then(function(h)
{
var b=h.data;
if(!b.tileId)
b.tileId=h.key;
a.innerHTML=WinStore.Utilities.replaceTokens(d,b);
a.setAttribute("aria-label",WinStore.Utilities.replaceTokens(e,b));
!c&&
WinStore.ReacquirePage.setApplicabilityAttribute(a,b.Price);
f=a.getElementsByClassName("appIcon")[0];
g=f.getAttribute("source");
if(h.isImageCached(g))
{
f.src=g;
f.style.opacity=1
}
a.getElementsByClassName("appIconContainer")[0].style.backgroundColor=b.BackgroundColor;
b.MediumImageIs1x1&&
WinJS.Utilities.addClass(f,"mediumAppTileSquare");
return h.ready
}).then(function(a)
{
if(f.src==="")
return a.loadImage(g,f).then(function()
{
f.style.opacity=1;
return a
},function(b)
{
b.name!=="Canceled"&&
om.logErrorMessage("WinStore.UpdatesPage.createRenderer: failed to download app icon image for '"+a.data.Name+"' from "+g);
return a
});
return a
})}
}
return f
},setInstallingUI:function()
{
var a=document.getElementById("appBarContainer");
if(a)
{
var b=a.winControl;
b&&
b.hide();
a.style.display="none"
}
WinStore.Frame.showPurchaseProgress(true)
},initAppBarCommands:function(a)
{
var b=[{id:"selectAllCmd",label:"Select all",icon:"",onclick:a?WinStore.UpdatesPage.doClickSelectAll:WinStore.ReacquirePage.doClickSelectAll,section:"selection",tooltip:"Select all"},{id:"clearCmd",label:"Clear",icon:"",onclick:a?WinStore.UpdatesPage.doClickClear:WinStore.ReacquirePage.doClickClear,section:"selection",tooltip:"Clear"},{id:"sep",type:"separator",section:"selection"},{id:"installCmd",label:"Install",icon:"",onclick:a?WinStore.UpdatesPage.doClickInstall:WinStore.ReacquirePage.doClickInstall,section:"selection",tooltip:"Install"}];
return b
}});
var pcsState={},
pcsOrigin=null,
progressTimer=null,
piContext="";
function toggleProgress(a)
{
if(a)
document.getElementById("pcsProgress").style.display="block";
else
document.getElementById("pcsProgress").style.display="none"
}
function onPCSFrameLoad(a)
{
om.etwPCSFrameOpen(true);
pcsState={};
pcsOrigin=null;
piContext=WinStore.Utilities.getUrlParam(a,"pi_context");
WinStore.Frame.setPageTitle("Payment and billing",false);
om.getPCSDetails(function(b)
{
pcsState=b;
if(pcsState.fSuccess)
{
if(pcsState.fIsPCSSupported)
{
var a=pcsState.pcsUrl.match(/^\w+:\/\/[^\/\?]+/);
if(a)
pcsOrigin=a[0].toLowerCase()
}
if(pcsOrigin)
{
document.getElementById("pcsiframe").src=pcsState.pcsUrl;
if(pcsState.pcsTarget==="pdp3ds")
progressTimer=window.setTimeout(function()
{
toggleProgress(false)
},2e3)
}
else
{
toggleProgress(false);
document.getElementById("pcsUnsupportedError").style.display="block";
om.clearAuthenticatedAppId()
}
WinStore.BI.onPageLoaded()
}
else
pcs_onerror(-1)
})
}
function onPCSFrameUnload(a)
{
if(!a)
om.removeCurrentPageFromTravelLog();
else
om.clearAuthenticatedAppId();
if(progressTimer)
{
window.clearTimeout(progressTimer);
progressTimer=null
}
pcsState={};
pcsOrigin=null
}
function pcsMessageHandler(b)
{
if(pcsOrigin&&b.origin.toLowerCase()===pcsOrigin)
{
var c=null;
if(typeof b.data==="string")
try
{
c=JSON.parse(b.data)
}
catch(d)
{
om.logWarningMessage("pcsMessageHandler - Failed to parse JSON(1): "+d.name+": "+d.message+", JSON string: "+b.data)
}
else
if(typeof b.data==="object")
c=b.data;
var a=null;
if(c&&c.data!==undefined)
try
{
a=JSON.parse(c.data)
}
catch(d)
{
om.logWarningMessage("pcsMessageHandler - Failed to parse JSON(2): "+d.name+": "+d.message+", JSON string: "+c.data)
}
if(a)
if(a.method==="pcs_onheightchange")
pcs_onheightchange(a.height);
else
if(a.method==="pcs_onerror")
if(a.errorcode==10||a.errorcode==11)
pcs_oncancel();
else
pcs_onerror(a.errorcode);
else
if(a.method==="pcs_onnavigationrequired")
pcs_onnavigationrequired(a.redirecturl);
else
if(a.method==="pcs_onsuccess")
pcs_onsuccess(a.accountid,a.piid,a.authrespfor3ds);
else
om.logInfoMessage("Igorning unknown method: "+a.method)
}
else
om.logWarningMessage("Ignoring unknown web message, origin = "+b.origin)
}
function pcs_onheightchange(a)
{
if(a>0)
{
toggleProgress(false);
om.etwPCSFrameOpen(false)
}
}
function pcs_onerror(a)
{
pcs_logPi("error",a);
om.logErrorMessage("PCS returned error: "+a);
var b=[{id:0,text:"Try again"},{id:1,text:"Cancel"}];
om.showMessageDialog("There was an error setting up your payment method","Add or update payment method",b,1,function(a)
{
if(a===0)
onPCSFrameLoad();
else
{
om.clearAuthenticatedAppId();
om.goBack()
}
})
}
function pcs_onnavigationrequired(a)
{
pcs_logPi("navrequired");
om.logInfoMessage("PCS redirect required: "+a);
var b=[{id:0,text:"Yes"},{id:1,text:"No"}];
om.showMessageDialog("Your web browser will open.","Do you want to continue to this website?",b,1,function(b)
{
b===0&&
om.launchPcsFlow(a);
om.clearAuthenticatedAppId();
om.goBack()
})
}
function pcs_onsuccess(a,b,c)
{
om.removeCurrentPageFromTravelLog();
pcs_logPi("success");
if(pcsState.pcsTarget==="pdp")
om.showPurchasePDP("?pid="+pcsState.appId+"&accountid="+a+"&piid="+b+"&resumePurchaseFlag=pisetup");
else
if(pcsState.pcsTarget==="pdp_piattach")
om.showPurchasePDP("?pid="+pcsState.appId+"&accountid="+a+"&piid="+b+"&mode=piattach");
else
if(pcsState.pcsTarget==="pdp3ds")
om.showPurchasePDP("?pid="+pcsState.appId+"&tid="+pcsState.transactionId+"&3ds="+c+"&resumePurchaseFlag=3dsauth");
else
if(pcsState.pcsTarget==="settings")
om.showSettingsPage("pisetup&accountid="+a+"&piid="+b);
else
if(pcsState.pcsTarget==="settings_silent_redeem")
om.showSettingsPage("pisetup&accountid="+a+"&piid="+b+"&silentredeem=true");
else
if(pcsState.pcsTarget==="settings_piattach")
om.showSettingsPage("pisetup&accountid="+a+"&piid="+b+"&piattach=true");
else
om.logErrorMessage("pcs_onsuccess: Unknown PCS return target:"+pcsState.pcsTarget)
}
function pcs_logPi(b,a)
{
WinStore.BI.logCustomBI("PcsAddEdit",{piContext:piContext,status:b,reason:a});
piContext=""
}
function pcs_oncancel()
{
pcs_logPi("canceled");
om.clearAuthenticatedAppId();
om.goBack()
}
WinJS.Namespace.define("WinStore.CategoryHub",{_hub:{value:null,writable:true},initControls:function(d,f)
{
var c=document.getElementById("mainContentHub");
if(c)
{
var e=WinStore.Utilities.getUrlParam(d,"cid"),
b=null,
a;
if(e)
{
a=parseInt(e);
if(!isNaN(a))
b=WinStore.Category.getCategoryName(a)
}
if(b)
WinStore.Frame.setPageTitle(b,true);
else
om.logErrorMessage("WinStore.CategoryHub.initControls: Could not get category name for id = "+a);
var g={categoryId:a,showSpotlight:true,showSeeAll:true,showPicksForYou:false,showGangOfThree:true,showCollections:false};
this._hub=new WinStore.Controls.Hub(c,g);
this._hub.init(d,f)
}
else
{
om.logErrorMessage("WinStore.CategoryHub.initControls: unable to locate mainContentHub container, can't initialize hub control");
om.navigateToErrorPage("Category Hub Page unable to initialize custom hub control")
}
},onUnload:function()
{
WinStore.Controls.Hub.onPageUnload();
if(this._hub&&this._hub.control)
{
WinStore.Controls.Hub.ScrollPositionMap[this._hub.categoryId]=this._hub.control.scrollPosition;
this._hub.dispose()
}
},reload:function()
{
this._hub.reload(this._hub.urlParams,this._hub.onDataLoaded,true)
}});
(function()
{
"use strict";
var a=WinJS.Class.define(function(h,i,g,e,f,a,c,d,b)
{
this._kind=h;
this._text=i;
this._guid=g;
this._detailText=e;
this._image=f;
this._imageAlternateText=a;
this._resultIndex=c;
this._tag=d;
this._originalQuery=b||"";
this._imageLoaded=false
},{kind:{"get":function()
{
return this._kind
},"set":function(a)
{
this._kind=a
}},text:{"get":function()
{
return this._text
},"set":function(a)
{
this._text=a
}},tag:{"get":function()
{
return this._tag
},"set":function(a)
{
this._tag=a
}},detailText:{"get":function()
{
return this._detailText
},"set":function(a)
{
this._detailText=a
}},image:{"get":function()
{
return this._image
},"set":function(a)
{
this._image=a
}},imageAlternateText:{"get":function()
{
return this._imageAlternateText
},"set":function(a)
{
this._imageAlternateText=a
}},resultIndex:{"get":function()
{
return this._resultIndex
},"set":function(a)
{
this._resultIndex=a
}},guid:{"get":function()
{
return this._guid
},"set":function(a)
{
this._guid=a
}},originalQuery:{"get":function()
{
return this._originalQuery
},"set":function(a)
{
this._originalQuery=a
}},imageLoaded:{"get":function()
{
return this._imageLoaded
},"set":function(a)
{
this._imageLoaded=a
}}});
function h(a)
{
a._resetVector()
}
function d(f,c,h,b,g)
{
var e=c.guid.replace("{","").replace("}",""),
d=f[b];
if(d&&d.guid===e)
d.originalQuery=g;
else
{
f._removeElement(b);
var i=new a(1,c.title,e,"",null,null,h,b,g);
f._insertElement(b,i);
WinStore.Search.LoadImage(c,e,b)
}
}
function i(d,b)
{
var c=new a(2,"",null,null,null,null,null,b);
d._insertElement(b,c)
}
function e(g,c,e,b,d)
{
var f=new a(0,c.query,null,null,null,null,e,b,d);
g._insertElement(b,f)
}
function f(d,b)
{
var a=d[b.index];
if(a&&a.kind===1&&a.imageLoaded===false&&a.guid===b.guid)
{
var c=g(a);
c.imageUrl=URL.createObjectURL(b.imgBits);
c.imageLoaded=true;
d[b.index]=c;
d._updateElement(b.index)
}
}
function g(b)
{
return new a(b.kind,b.text,b.guid,b.detailText,b.image,b.imageAlternateText,b.resultIndex,b.tag,b.originalQuery)
}
function c()
{
var a=[];
a._events={};
a._resetVector=function()
{
this.splice(0,this.length);
this._fireEvent("vectorchanged",{collectionChange:Windows.Foundation.Collections.CollectionChange.reset,index:0})
};
a._insertElement=function(a,b)
{
this.splice(a,0,b);
this._fireEvent("vectorchanged",{collectionChange:Windows.Foundation.Collections.CollectionChange.itemInserted,index:a})
};
a._removeElement=function(a)
{
this.splice(a,1);
this._fireEvent("vectorchanged",{collectionChange:Windows.Foundation.Collections.CollectionChange.itemRemoved,index:a})
};
a._updateElement=function(a)
{
this._fireEvent("vectorchanged",{collectionChange:Windows.Foundation.Collections.CollectionChange.itemChanged,index:a})
};
a._fireEvent=function(d,c)
{
for(var b=this._events[d]||[],
a=0;a<b.length;a++)
b[a](c)
};
a.addEventListener=function(a,b)
{
this._events[a]=this._events[a]||[];
this._events[a].push(b)
};
a.removeEventListener=function(b,c)
{
var a=this._events[b].indexOf(c);
a!==-1&&
this._events[b].splice(a,1)
};
return a
}
if(!window.Windows)
{
var b=WinJS.Class.define(function()
{
this.searchSuggestions=c()
},{ResultSuggestionCountDisplayed:{value:0,writable:true},QuerySuggestionCountDisplayed:{value:0,writable:true},ResultSuggestionCountReturned:{value:0,writable:true},QuerySuggestionCountReturned:{value:0,writable:true},suggestions:{"get":function()
{
return this.searchSuggestions
}},setQuery:function()
{
},addToHistory:function()
{
},InsertResultSuggestion:function(a,c,e,b)
{
d(this.searchSuggestions,a,c,e,b)
},InsertSeparator:function(a)
{
i(this.searchSuggestions,a)
},InsertQuerySuggestion:function(a,c,d,b)
{
e(this.searchSuggestions,a,c,d,b)
},ClearSuggestions:function()
{
h(this.searchSuggestions);
document.getElementById("searchControl").winControl._currentFocusedIndex=-1
},UpdateSuggestionImage:function(a)
{
f(this.searchSuggestions,a)
},CompleteSuggestions:function(b)
{
for(var a=this.searchSuggestions.length-1;a>=b;a--)
this.searchSuggestions._removeElement(a)
}});
window.Windows={ApplicationModel:{Search:{Core:{SearchSuggestionManager:function()
{
if(!window.Windows.SearchSuggestionManager)
window.Windows.SearchSuggestionManager=new b;
return window.Windows.SearchSuggestionManager
}}}},Foundation:{Collections:{CollectionChange:{reset:"reset",itemInserted:"itemInserted",itemRemoved:"itemRemoved",itemChanged:"itemChanged"}}}}
}
WinJS.Namespace.define("WinStore.Search",{TimerId:{value:0,writable:true},QueryId:{value:"",writable:true},ImpressionGuid:{value:"",writable:true},IsSearching:{value:false,writable:true},RetrievingSuggestions:{value:false,writable:true},QueryText:{value:"",writable:true},RequestId:{value:0,writable:true},InputLanguage:{value:"",writable:true},NumResults:{value:new Array([]),writable:true},IdealDisplayIndex:{value:0,writable:true},IsSearchBoxActive:function()
{
return document.activeElement&&WinJS.Utilities.hasClass(document.activeElement,"win-searchbox-input")
},WireUpSearchBox:function()
{
var c=document.querySelector("#searchGlyph"),
d=document.querySelector(".win-searchbox-input"),
e=document.querySelector("#navBarSearchContainer"),
b=document.querySelector("#navBarContainer"),
a=document.querySelector("#searchControl");
c.addEventListener("click",function()
{
WinStore.Search.ShowSearchControl()
});
c.addEventListener("focusin",function()
{
WinStore.Search.ShowSearchControl()
});
d.addEventListener("blur",function()
{
document.activeElement.parentElement.id!=="searchControl"&&
WinStore.Search.BlurSearchControl()
});
a.addEventListener("focusin",function()
{
WinJS.Utilities.addClass(b,"searchExpanded")
});
a.addEventListener("focusout",function()
{
WinJS.Utilities.removeClass(b,"searchExpanded")
});
a.addEventListener("receivingfocusonkeyboardinput",function()
{
!WinStore.Search.IsSearchBoxActive()&&
WinStore.Search.ShowSearchControl()
})
},SetEnableTypeToSearch:function(b)
{
var a=document.querySelector("#searchControl");
if(a&&a.winControl)
a.winControl.focusOnKeyboardInput=b
},AutoDisableTypeToSearchForElement:function(a)
{
if(a)
{
a.addEventListener("focus",function()
{
WinStore.Search.SetEnableTypeToSearch(false)
});
a.addEventListener("blur",function()
{
WinStore.Search.SetEnableTypeToSearch(true)
})
}
},_setSuggestionCountToDisplay:function()
{
if(window.innerHeight<774)
{
WinStore.Search.NumResults=[[4,0],[3,2],[2,3],[1,4],[0,4]];
WinStore.Search.IdealDisplayIndex=2
}
else
if(window.innerHeight<900)
{
WinStore.Search.NumResults=[[4,0],[4,1],[3,2],[2,3],[2,4],[1,4],[0,4]];
WinStore.Search.IdealDisplayIndex=4
}
else
if(window.innerHeight<1024)
{
WinStore.Search.NumResults=[[4,0],[4,1],[4,2],[3,3],[3,4],[2,4],[1,4],[0,4]];
WinStore.Search.IdealDisplayIndex=4
}
else
{
WinStore.Search.NumResults=[[4,0],[4,1],[4,2],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4]];
WinStore.Search.IdealDisplayIndex=4
}
},ShowSearchControl:function()
{
var b=document.querySelector(".win-searchbox-input"),
c=document.querySelector("#navBarSearchContainer"),
a=document.getElementById("navBarContainer");
WinJS.Utilities.addClass(a,"searchExpanded");
b.focus()
},UpdateSearchBox:function(a,h)
{
if(a!=null&&document.getElementById("searchControl").winControl.queryText!==""&&a.requestId>WinStore.Search.RequestId)
{
var d=0,
b=0;
window.Windows.SearchSuggestionManager.ResultSuggestionCountReturned=a.resultSuggestions.length;
window.Windows.SearchSuggestionManager.QuerySuggestionCountReturned=a.querySuggestions.length;
this._setSuggestionCountToDisplay();
var c=WinStore.Search.IdealDisplayIndex;
while(a.resultSuggestions.length<WinStore.Search.NumResults[c][0]&&a.querySuggestions.length>WinStore.Search.NumResults[c][1])
c++;
while(a.querySuggestions.length<WinStore.Search.NumResults[c][1])
c--;
for(var f=a.resultSuggestions.length-WinStore.Search.NumResults[c][0],
g=a.querySuggestions.length-WinStore.Search.NumResults[c][1],
e=0;e<f;e++)
a.resultSuggestions.pop();
for(var e=0;e<g;e++)
a.querySuggestions.pop();
window.Windows.SearchSuggestionManager.ResultSuggestionCountDisplayed=a.resultSuggestions.length;
window.Windows.SearchSuggestionManager.QuerySuggestionCountDisplayed=a.querySuggestions.length;
WinStore.Search.RequestId=a.requestId;
WinStore.Search.ImpressionGuid=a.impressionGuid;
this.populateResultSuggestions=function()
{
a.resultSuggestions.forEach(function(c)
{
window.Windows.SearchSuggestionManager.InsertResultSuggestion(c,d,b,a.queryText);
d++;
b++
})
};
this.populateQuerySuggestions=function()
{
a.querySuggestions.forEach(function(c)
{
window.Windows.SearchSuggestionManager.InsertQuerySuggestion(c,d,b,a.queryText);
d++;
b++
})
};
this.insertSeparator=function()
{
if(a.resultSuggestions.length>0&&a.querySuggestions.length>0)
{
window.Windows.SearchSuggestionManager.InsertSeparator(b);
b++
}
};
if(a.resultSuggestionsFirst)
{
this.populateResultSuggestions();
this.insertSeparator();
this.populateQuerySuggestions()
}
else
{
this.populateQuerySuggestions();
this.insertSeparator();
this.populateResultSuggestions()
}
window.Windows.SearchSuggestionManager.CompleteSuggestions(b)
}
h&&
WinStore.Search.BlurSearchControl()
},BlurSearchControl:function()
{
WinJS.Utilities.removeClass(document.querySelector("#navBarContainer"),"searchExpanded");
var a=document.activeElement,
b=document.getElementById("searchControl");
b.focus();
b.blur();
a&&a!==document.querySelector(".win-searchbox-input")&&
WinStore.Utilities.setActive(a)
},LoadImage:function(a,c,b)
{
om.getSearchImage(a.relImage,a.imageUrl,a.bkgd,a.largeImage,c,b,function(a)
{
window.Windows.SearchSuggestionManager.UpdateSuggestionImage(a)
})
},QueryChanged:function(c)
{
WinStore.Search.InputLanguage=c.detail.language;
WinStore.Search.GetSuggestions(c.detail.queryText);
var a=document.querySelector(".win-searchbox-input");
a.style.paddingLeft="";
a.style.paddingRight="";
a.removeAttribute("lang");
var b=getComputedStyle(a,null),
e=b.paddingLeft,
d=b.paddingRight;
a.setAttribute("lang",WinStore.Search.InputLanguage);
a.style.paddingLeft=e;
a.style.paddingRight=d
},GetSuggestions:function(b,a)
{
if(b!=="")
om.onSearchQueryChanged(b,WinStore.Search.InputLanguage,(new Date).getTime().toString(),function(b)
{
WinStore.Search.UpdateSearchBox(b,a)
});
else
{
window.Windows.SearchSuggestionManager.ClearSuggestions();
a&&
WinStore.Search.BlurSearchControl()
}
},QuerySubmitted:function(a)
{
if(a.detail.queryText!=="")
{
for(var d=false,
c=0;c<window.Windows.SearchSuggestionManager.searchSuggestions.length;c++)
{
var b=window.Windows.SearchSuggestionManager.searchSuggestions[c];
if(b.kind===0&&b.text===a.detail.queryText&&b.text!==b.originalQuery)
{
WinStore.Search.RecordBi(a,b);
om.onSearchQuerySubmitted(a.detail.queryText,a.detail.language+"&queryId="+WinStore.Search.QueryId+"&ig="+WinStore.Search.QueryId);
d=true;
break
}
}
if(!d)
{
WinStore.Search.RecordBi(a,null);
om.onSearchQuerySubmitted(a.detail.queryText,a.detail.language+"&queryId="+WinStore.Search.QueryId)
}
}
},ResultSuggestionChosen:function(b)
{
var a=window.Windows.SearchSuggestionManager.searchSuggestions[b.detail.tag];
WinStore.Search.RecordBi(b,a);
window.setTimeout(function()
{
om.onResultSuggestionChosen(a.guid+"&queryId="+WinStore.Search.QueryId+"&ig="+WinStore.Search.QueryId+"&origIg="+WinStore.Search.ImpressionGuid+"&formCode="+WinStore.BI.biFormCodes.AutoSuggest)
},150)
},RecordBi:function(f,b)
{
WinStore.Search.QueryId=WinStore.Utilities.generateNewGuid();
var c=document.getElementById("searchControl").winControl.queryText,
e=window.Windows.SearchSuggestionManager.ResultSuggestionCountDisplayed+window.Windows.SearchSuggestionManager.QuerySuggestionCountDisplayed,
d="N";
WinStore.BI.addMetaToHead("MS.PageIg",WinStore.Search.QueryId);
var a={"Search.QueryID":WinStore.Search.QueryId,"Search.Sug":b===null?0:1,"Search.Sug.TotalCount":e,"Search.Sug.TotalResultSugg":window.Windows.SearchSuggestionManager.ResultSuggestionCountReturned,"Search.Sug.TotalQuerySugg":window.Windows.SearchSuggestionManager.QuerySuggestionCountReturned};
if(b!==null)
{
c=b.originalQuery;
a["IG"]=WinStore.Search.ImpressionGuid;
a["Search.Sug.Pos"]=b.resultIndex+1;
a["Search.Sug.Query"]=b.text;
if(b.kind===1)
{
d="AA";
a["Search.Sug.App.Id"]=b.guid
}
else
if(b.kind===0)
d="AS";
a["src"]="AutoSuggest"
}
else
a["src"]="Button.Search";
a["Search.Query"]=c;
a["Search.Sug.Source"]=e.toString()+"-"+c.length.toString();
a["Search.Sug.TotalDisplay"]="AA"+window.Windows.SearchSuggestionManager.ResultSuggestionCountDisplayed+"AS"+window.Windows.SearchSuggestionManager.QuerySuggestionCountDisplayed;
a["Search.Sug.Type"]=d;
WinStore.BI.logCustomBI("SearchQuery",a)
},SetSearchBoxText:function(b)
{
var a=document.getElementById("searchControl");
if(a&&a.winControl&&a.winControl.queryText!==b)
{
a.winControl.queryText=b;
WinStore.Search.GetSuggestions(b,true)
}
}})
})();
var upgradeState={info:null,inAcquisition:false,mqlHighContrast:null,onDataLoaded:null,leavingPDP:false,cachedUserCID:"",urlParams:"",deeplinked:false,loadBISent:false};
function onUpgradeLoad(a,c)
{
om.logInfoMessage("Upgrade: onUpgradeLoad: urlParamsIn = "+a);
upgradeState.urlParams=a;
upgradeState.onDataLoaded=c;
upgradeState.mqlHighContrast=matchMedia("screen and (-ms-high-contrast)");
upgradeState.leavingPDP=false;
var b=document.getElementById("upgradeTermsOfUseLink");
if(b)
{
b.href="http://go.microsoft.com/fwlink/?LinkId=308927";
b.target="_blank"
}
resetUpgrade();
upgradeState.deeplinked=WinStore.Utilities.getUrlParam(a,"dpl")==="1"
}
function onUpgradeUnload()
{
try
{
if(upgradeState.onDataLoaded)
{
upgradeState.onDataLoaded(true);
upgradeState.onDataLoaded=null
}
if(upgradeState.mqlHighContrast)
upgradeState.mqlHighContrast=null;
upgradeState.loadBISent=false;
document.getElementById("upgradeFrame").removeAttribute("MS.App.Id")
}
catch(a)
{
om.logErrorMessage("Upgrade: onUpgradeUnload: exception "+a.name+": "+a.message)
}
}
function showUpgradeAcquisitionUI(a)
{
try
{
!upgradeState.onDataLoaded&&
WinStore.Frame.enableBackButton(!a,true);
setUpgradeProgressText(a?document.getElementById("upgradePurchaseProgress").innerText:"");
WinStore.Frame.showPurchaseProgress(a)
}
catch(b)
{
om.logErrorMessage("Upgrade: showUpgradeAcquisitionUI: exception "+b.name+": "+b.message)
}
}
function resetUpgrade()
{
om.etwPDPOpenStart("osUpgrade");
upgradeState.deeplinked=false;
showUpgradeAcquisitionUI(false);
om.getOSUpgradeInfo(updateUpgradeContents)
}
function updateUpgradeContents(a)
{
try
{
var e=false;
if(a.appId==="")
{
a.disabled="sku";
a.title="Update to Windows 8.1";
a.ds=0;
a.extUrl=null
}
if(matchMedia("screen and (-ms-high-contrast)").matches)
{
a.fg="light";
e=true
}
else
a.fg="dark";
if(a.fg==="light")
WinStore.Utilities.setElementClasses("upgradeLeftPane","upgradeLeftPaneLightText","upgradeLeftPaneDarkText");
else
WinStore.Utilities.setElementClasses("upgradeLeftPane","upgradeLeftPaneDarkText","upgradeLeftPaneLightText");
upgradeState.info=a;
WinStore.Frame.setPageTitle(a.title,true);
updateUpgradeDownloadState(a.ds);
setDivContentHideIfEmpty("upgradeMetadataFileSize","Approximate size ",a.size);
var f=document.getElementById("upgradeExtInfo");
f.src=a.extUrl;
if(a.disabled!=="false")
{
document.getElementById("upgradeInstallButton").style.display="none";
document.getElementById("upgradeTermsOfUse").style.display="none";
document.getElementById("upgradeDownloadWarning").style.display="none";
document.getElementById("upgradeMayReboot").style.display="none";
if(a.disabled==="policy")
document.getElementById("upgradePolicyBlock").style.display="";
else
if(a.disabled==="sku")
{
document.getElementById("upgradeMetadataDeveloper").style.display="none";
document.getElementById("upgradeMetadataCopyright").style.display="none";
document.getElementById("upgradeRightPane").style.display="none";
document.getElementById("upgradeSKUBlock").style.display="";
var b=document.getElementById("upgradeSKUBlockLink");
if(b)
{
b.href="http://go.microsoft.com/fwlink/p/?LinkId=328758";
b.target="_blank"
}
}
else
{
document.getElementById("upgradeCPUBlock").style.display="";
var b=document.getElementById("upgradeCPUBlockLink");
if(b)
{
b.href="http://go.microsoft.com/fwlink/p/?LinkId=325248";
b.target="_blank"
}
}
}
document.getElementById("mainContent").style.display="-ms-grid";
if(upgradeState.onDataLoaded)
{
var d=document.getElementById("upgradeLeftPane");
d.style.opacity=0;
var c=document.getElementById("upgradeRightPane");
c.style.opacity=0;
upgradeState.onDataLoaded(false,[d,c],onUpgradeEntranceAnimationCompleted);
upgradeState.onDataLoaded=null
}
logUpgradeLoadBI();
om.etwPDPOpenStop()
}
catch(b)
{
om.etwPDPOpenStop();
om.logErrorMessage("Upgrade: updateUpgradeContents: exception "+b.name+": "+b.message);
document.getElementById("mainContent").style.display="none";
if(upgradeState.onDataLoaded)
{
upgradeState.onDataLoaded();
upgradeState.onDataLoaded=null
}
om.showMessageDialog("The Windows 8.1 Preview isn’t available right now. Please try again later.","",[{id:0,text:"Close"}],1,function()
{
om.goBack()
},null)
}
om.removeCurrentPageFromTravelLog()
}
function onUpgradeEntranceAnimationCompleted()
{
var a=document.getElementById("mainContent");
if(a)
a.style.overflowX="auto"
}
function getUpsellValue()
{
var b=WinStore.Utilities.getUrlParam(upgradeState.urlParams,"ref"),
a=0;
if("app"===b)
a=2;
else
if("home"==b)
a=1;
return a
}
function logUpgradeLoadBI()
{
if(!upgradeState.loadBISent)
{
WinStore.BI.addMetaToHead("MS.PageId","pdpBlueOSFrame");
var a={"App.Id":upgradeState.info.appId,Deeplink:upgradeState.deeplinked?1:0,"App.UpsellLink":getUpsellValue()};
WinStore.BI.firePageViewEvent(a,WinStore.BI.PdpSamplingId);
upgradeState.loadBISent=true
}
}
function updateUpgradeDownloadState(b)
{
var a="";
om.logInfoMessage("Upgrade: updateUpgradeDownloadState: ds = "+b);
switch(b)
{
case 1:
a="You can’t download Windows 8.1 using a mobile broadband connection. Use a Wi-Fi or Ethernet Internet connection to continue downloading.";
break;
case 2:
a="Downloading this update using a mobile broadband connection might result in additional charges to your data plan."
}
setDivContentHideIfEmpty("upgradeDownloadWarning","",a)
}
function onUpgradeInstallButton()
{
var a=document.getElementById("upgradeInstallButton");
a.disabled=true;
om.purchase("osUpgrade",upgradeState.info.title,"",upgradeState.info.language,0,PT.free,false);
var b={"App.Id":upgradeState.info.appId,"App.UpsellLink":getUpsellValue()};
WinStore.BI.logCustomBI("OSUpgrade",b,WinStore.BI.PdpSamplingId)
}
function onUpgradePurchaseProgress(a)
{
if(!a||a.ps===null||a.code===null)
om.logErrorMessage("Upgrade: onUpgradePurchaseProgress: called with invalid arguments");
else
if(a.appId==="osUpgrade")
{
om.logInfoMessage("Upgrade: onUpgradePurchaseProgress: "+a.ps+" - "+a.code);
var b=true,
c=false;
switch(a.ps)
{
case 1:
case 2:
case 3:
setUpgradeProgressText("");
break;
case 4:
setUpgradeProgressText("Starting installation…");
c=true;
b=false;
break;
case 5:
b=false;
document.getElementById("upgradeInstallButton").disabled=false;
var e=a.code>>16&8191;
if(e==FACILITY_WINDOWS_STORE)
onUpgradePurchaseErrors(a);
else
{
var d=a.code&65535;
switch(d)
{
case 0:
case ErrorCodes.ERROR_CANCELLED:
break;
case ErrorCodes.ERROR_IO_PENDING:
b=true;
setUpgradeProgressText("Processing payment…");
break;
case ErrorCodes.ERROR_ACCESS_DENIED:
case ErrorCodes.ERROR_WINHTTP_TIMEOUT:
default:
onUpgradePurchaseErrors(a)
}
}
}
if(b)
{
document.getElementById("upgradeInstallButton").disabled=true;
upgradeState.inAcquisition=true;
showUpgradeAcquisitionUI(true)
}
else
{
showUpgradeAcquisitionUI(false);
if(c)
{
if(!upgradeState.leavingPDP)
{
upgradeState.deeplinked=false;
om.showInstallsPage(false)
}
upgradeState.leavingPDP=true
}
else
{
upgradeState.inAcquisition=false;
om.getOSUpgradeInfo(updateUpgradeContents);
location.hash=""
}
}
}
}
function setUpgradeProgressText(b)
{
var a=document.getElementById("upgradePurchaseProgress"),
f=a&&a.innerText!==b;
if(f)
if(upgradeState.onDataLoaded)
{
a.innerText=b;
a.style.display=b!==""?"block":"none"
}
else
{
var e=function(a)
{
return WinJS.UI.Animation.fadeOut(a).then(function()
{
return new WinJS.Promise(function(c,d)
{
try
{
a.innerText="";
a.style.display="none";
c()
}
catch(b)
{
d(b)
}
})
})
},
g=function(a,b)
{
return (new WinJS.Promise(function(d,e)
{
try
{
a.innerText=b;
a.style.display="block";
d()
}
catch(c)
{
e(c)
}
})).then(function()
{
return WinJS.UI.Animation.fadeIn(a)
})
},
d=a.innerText!==""?e(a):WinJS.Promise.as(),
c=b!==""?g(a,b):WinJS.Promise.as();
d.then(function()
{
return c
}).done()
}
}
function onUpgradePurchaseErrors(f)
{
var a=null,
c=null,
b=-1,
d={isGeneralPurchaseFailure:false,errorCode:f.code,extraInfo:f.info},
e="Store";
switch(f.code)
{
case ErrorCodes.ERROR_ACCESS_DENIED:
a="Access denied";
c=[{id:0,text:"Try again"},{id:1,text:"Cancel"}];
b=1;
d.isGeneralPurchaseFailure=true;
break;
case ErrorCodes.ERROR_WINHTTP_TIMEOUT:
a="Request timed out";
d.isGeneralPurchaseFailure=true;
break;
case ErrorCodes.WU_E_NO_UPDATE:
case ErrorCodes.WU_E_UNEXPECTED:
a="The Windows 8.1 Preview isn’t available right now. Please try again later.";
c=[{id:0,text:"Close"}];
b=0;
break;
case ErrorCodes.WU_E_INSTALL_NOT_ALLOWED:
a="Windows is installing updates right now, please try again in a few minutes.";
c=[{id:0,text:"Close"}];
b=0;
break;
case ErrorCodes.ERROR_INSTALL_OUT_OF_DISK_SPACE:
case ErrorCodes.ERROR_DISK_FULL:
case ErrorCodes.HR_DISK_FULL:
a="Your PC doesn’t have enough space to install Windows 8.1. Make more space available on your drive and try again.";
c=[{id:0,text:"Close"}];
b=0;
break;
case ErrorCodes.COMMERCE_E_APP_NOT_AVAILABLE:
e="This item is no longer available.";
a="Sorry, this item has been removed and is no longer available for purchase from the Windows Store.";
c=[{id:0,text:"Close"}];
b=0;
break;
case ErrorCodes.COMMERCE_E_NOT_ACTIVATED:
a="This PC needs to be activated before you can install Windows 8.1, please activate this copy of Windows and try again.";
c=[{id:0,text:"Close"}];
b=0;
break;
case ErrorCodes.E_ACCESSDENIED:
a="You need to use an account with Administrator privileges to install Windows 8.1, try logging in with the user account of an administrator of this PC and trying the update again.";
c=[{id:0,text:"Close"}];
b=0;
break;
default:
e="Your Windows 8.1 install couldn’t be completed";
a="Something happened and the install of Windows 8.1 can’t be completed.";
c=[{id:0,text:"Try again"},{id:1,text:"Cancel"}];
b=1;
d.isGeneralPurchaseFailure=true
}
if(a)
{
om.showMessageDialog(a,e,c,b,onUpgradeErrorDialogClosed,d);
upgradeState.inAcquisition=false;
showUpgradeAcquisitionUI(false)
}
}
function onUpgradeErrorDialogClosed(a,b)
{
if(a.usersChoice==0)
b.isGeneralPurchaseFailure&&
onUpgradeInstallButton();
else
a.usersChoice==1&&
om.clearAuthenticatedAppId()
}
function setDivContentHideIfEmpty(c,d,b)
{
var a=document.getElementById(c);
if(b&&b!=="")
{
a.innerText=d+b;
a.style.display="block"
}
else
a.style.display="none"
}
window.addEventListener("blur",function()
{
var a=document.getElementById("upgradeProgressControl");
a&&
WinJS.Utilities.addClass(a,"paused")
},false);
window.addEventListener("focus",function()
{
var a=document.getElementById("upgradeProgressControl");
a&&
WinJS.Utilities.removeClass(a,"paused")
},false)
