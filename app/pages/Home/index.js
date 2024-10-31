(function (ActionAppCore, $) {

    var SiteMod = ActionAppCore.module("site");

    //~thisPageSpecs//~
var thisPageSpecs = {
        "pageName": "Home",
        "pageTitle": "Home",
        "navOptions": {
            "topLink": true,
            "sideLink": true
        }
    }
//~thisPageSpecs~//~

    var pageBaseURL = 'app/pages/' + thisPageSpecs.pageName + '/';

    //~layoutOptions//~
thisPageSpecs.layoutOptions = {
    baseURL: pageBaseURL,
    north: { html: "north" },
    west: false,
    east: { name: "welcome", control: "WelcomeCenter", "source": "__app" },
    center: { html: "center" },
    south: false
}
//~layoutOptions~//~

    //~layoutConfig//~
thisPageSpecs.layoutConfig = {
  west__size: "400"
  , east__size: "400"
}
//~layoutConfig~//~
    //~required//~
thisPageSpecs.required = {

    }
//~required~//~

    var ThisPage = new SiteMod.SitePage(thisPageSpecs);

    var actions = ThisPage.pageActions;

    ThisPage._onPreInit = function (theApp) {
        //~_onPreInit//~

//~_onPreInit~//~
    }

    ThisPage._onInit = function () {
        //~_onInit//~

//~_onInit~//~
    }


    ThisPage._onFirstActivate = function (theApp) {
        //~_onFirstActivate//~

//~_onFirstActivate~//~
        ThisPage.initOnFirstLoad().then(
            function () {
                //~_onFirstLoad//~
window.ThisPageNow = ThisPage;
ThisPage.cutOffSmall = 500;
ThisPage.navOpen = true;

ThisPage.banners = {
  "[bigthirddown]" : "md-bigthirddown.png",
"[firstdown]" : "md-firstdown.png",
"[firstdownname]" : "md-firstdownname.png",
"[score]" : "md-score.png",
"[stufftime]" : "md-stufftime.png",
"[takethelead]" : "md-takethelead.png",
"[timetoscore]" : "md-timetoscore.png",
"[touchdown]" : "md-touchdown.png",
"[touchdownname]" : "md-touchdownname.png"

  
}

ThisPage.mainFrame = ThisApp.getByAttr$({appuse:"mainframe"});
ThisPage.chatFrame = ThisApp.getByAttr$({appuse:"chatframe"});
ThisPage.mainFrameEl = ThisPage.mainFrame.get(0);

ThisPage.chatTab = ThisApp.getByAttr$({appuse:"tablinks", group:"tab-group4",  item:"tab-chat",  action:"selectMe" });
ThisPage.chatTab.hide();

ThisApp.getSpot('Home:center').css('overflow','hidden');
//--- In case using Stream Chat
ThisApp.getSpot('Home:east').css('overflow','hidden');

ThisPage.liveIndicator = ThisPage.getByAttr$({appuse:"live-indicator"});

ThisPage.parts.welcome.subscribe('sendChat', onSendChat);

ThisPage.chatInput = ThisPage.getByAttr$({pageuse:"chatinput"})

ThisPage.stage = {
  name: "StreamShare",
  userid: sessionStorage.getItem('userid') || '',
  profile: {
    name: sessionStorage.getItem('displayname') || ''
  }
}
ThisApp.stage = ThisPage.stage;


ThisPage.getStreamInfo = function()
{
  var dfd = jQuery.Deferred();

  var tmpBaseURL = ActionAppCore.ActAppData.rootPath;
  var tmpPostOptions = {
    dataContext: this,
    url: tmpBaseURL + 'appserver/actions/get-stream-info'
  };
  ThisApp.apiCall(tmpPostOptions).then(function(theReply){
    console.log('Stream Info Results',theReply.results);
    ThisPage.streamInfo = theReply.results;
    var tmpIsLive = ThisPage.streamInfo.streamStatus;
    ThisApp.streamInfo = ThisPage.streamInfo;
    var tmpLevel = ThisPage.streamInfo.level;
    var tmpIsAdmin = ( tmpLevel > 1);
    setAppDispEls('foradmin', tmpIsAdmin);
    if( tmpIsLive ){
      refreshStream();
    } else {
      clearStream();
      ThisApp.loadSpot('whenclosed', ThisPage.streamInfo.noStreamText);
    }
    
    ThisPage.parts.welcome.updateForSecurityLevel(tmpLevel)

    refreshUI();
    dfd.resolve(ThisPage.streamInfo);
  })
  return dfd.promise();

}

initWebsocket();

ThisPage.getStreamInfo().then(refreshUI);

ThisPage.resizeLayoutProcess();
if( ThisPage.mode == "S"){
  showStream();
}

var tmpPageToOpen = ThisApp.util.getUrlParameter('page');

if( tmpPageToOpen == 'admin'){
  ThisApp.delay(1000).then(function(){
    ThisApp.gotoPage('Streams');
  })
}
//~_onFirstLoad~//~
                ThisPage._onActivate();
            }
        );
    }


    ThisPage._onActivate = function () {
        //~_onActivate//~

//~_onActivate~//~
    }

    ThisPage._onResizeLayout = function (thePane, theElement, theState, theOptions, theName) {
        //~_onResizeLayout//~
try {
  ThisApp.resizeToLayout(ThisPage.mainFrame);
  ThisApp.resizeToLayout(ThisPage.chatFrame);

  ThisPage.resizeLayoutProcess();

} catch (ex){
  console.error(ex);
}
//~_onResizeLayout~//~
    }

    //------- --------  --------  --------  --------  --------  --------  -------- 
    //~YourPageCode//~
var sendChannel;

ThisPage.getAppUse = function(theUse){
  return ThisPage.getByAttr$({appuse: theUse}).get(0);
}



ThisPage.resizeLayoutProcess = function (theForce) {

  try {

    //--- On layout resize ...
    var tmpEl = ThisPage.getParent$();
    var tmpTW = tmpEl.innerWidth();
    var tmpTH = tmpEl.innerHeight();
    ThisPage.currentWidth = tmpTW;
    ThisPage.currentHeight = tmpTH;


    if (tmpTW < ThisPage.cutOffSmall || tmpTH < ThisPage.cutOffSmall) {
      if (ThisPage.mode != "S") {
        setModeSmall()
        refreshNavPos();
        refreshHideWhens();
          }
    } else {
      if (ThisPage.mode != "M") {
        setModeMedium()
        refreshNavPos();
        refreshHideWhens();
          }
    }
    //--- end layout resize

  } catch (ex) {
    console.warn("Error on refresh ", ex);
  }
};



actions.initWebsocket = initWebsocket;
function initWebsocket() {

  var tmpURL = ActionAppCore.util.getWebsocketURL('actions', 'ws-main');
  ThisPage.wsclient = new WebSocket(tmpURL);

  var ws = ThisPage.wsclient;

  ws.onmessage = function (event) {
    var tmpData = '';
    if (typeof (event.data == 'string')) {
      tmpData = event.data.trim();
      if (tmpData.startsWith('{')) {
        tmpData = JSON.parse(tmpData);
        processMessage(tmpData);
      }
    }
    
  }

  ws.onclose = () => {
    console.log('websocket disconnected');
    // Try to reconnect after a delay
    setTimeout(initWebsocket, 1000);
};

}

actions.toggleNav = toggleNav;
function toggleNav() {
  if (ThisPage.navOpen) {
    ThisPage.navClickClosed = true;
    hideNav();
  } else {
    ThisPage.navClickClosed = false;
    showNav();
  }
}

actions.showNav = showNav;
function showNav() {

  // if (ThisPage.navOpen === true) {
  //   return;
  // }
  ThisPage.navOpen = true;
  if (ThisPage.mode == "S") {
    ThisPage.layout.close('east');
    ThisPage.layout.sizePane('east', '100%');
    ThisPage.layout.open('east');
    
  } else {
    ThisPage.layout.close('east');
    ThisPage.layout.sizePane('east', thisPageSpecs.layoutConfig.east__size);
    ThisPage.layout.open('east');
  }
}

actions.hideNav = hideNav;
function hideNav() {
  if (ThisPage.navOpen === false) {
    return;
  }
  //--- Short delay to assure click doesn't bleed through
  ThisApp.delay(10).then(function () {
    ThisPage.navOpen = false;
    ThisPage.layout.close('east');
    refreshHideWhens();
  })
}


function refreshHideWhens() {
  //--- any adustments here

}



actions.showStream = showStream;
function showStream() {
  ThisPage.isViewingStream = true;
  hideNav();
  refreshUI();
};

actions.showChat = showChat;
function showChat() {
  ThisPage.isViewingStream = false;
  showNav();
  refreshUI();
};



actions.setModeSmall = setModeSmall;
function setModeSmall() {
  ThisPage.mode = "S";
};


actions.setModeMedium = setModeMedium;
function setModeMedium() {
  ThisPage.mode = "M";
};


function refreshNavPos(){


  if( ThisPage.mode != "S"){
    if( ThisPage.modeShow != "M" ){
      ThisPage.modeShow = "M";
      showNav();
      refreshUI();
    }
  } else {
    if (ThisPage.modeShow != "S"){
      ThisPage.modeShow = "S";
      if( ThisPage.isViewingStream ){
        hideNav();
      } else {
        showNav();
      }
      refreshUI();
    }
  }

  
}


function setAppDispEls(theKey,theIsDisp){
  var tmpEls = ThisApp.getByAttr$({appdisp:theKey});
  if( theIsDisp ){
    tmpEls.removeClass('hidden');
  } else {
    tmpEls.addClass('hidden');
  }
}

function refreshUI() {

  var tmpProfileStatus = 'new';
  if( ThisPage.stage && ThisPage.stage.profile && ThisPage.stage.profile.name ){
    ThisPage.loadSpot('your-disp-name', ThisPage.stage.profile.name);
    var tmpName = ThisPage.stage.profile.name;
    if (tmpName) {
      tmpProfileStatus = 'outside';
    }
    if (ThisPage.stage.people && ThisPage.stage.people[ThisPage.stage.userid]) {
      tmpProfileStatus = 'backstage';
      ThisPage.chatTab.show();
    }  
  }
  
  ThisPage.showSubPage({
    item: tmpProfileStatus, group: 'profilestatus'
  });

  var tmpActiveStream = false;
  if( ThisPage.streamInfo && ThisPage.streamInfo.streamStatus ){
    tmpActiveStream = true;
  }

  var tmpIsSmall = ThisPage.mode == "S";

  if( tmpIsSmall){
    ThisPage.layout.open('north');
  } else {
    ThisPage.layout.close('north');
  }

  setAppDispEls('modesmall',tmpIsSmall);
  setAppDispEls('modemedium',!tmpIsSmall);
  
  setAppDispEls('whenlive',tmpActiveStream);
  setAppDispEls('whenclosed',!tmpActiveStream);
  var tmpShowViewing = ThisPage.isViewingStream === true;
  setAppDispEls('whenviewing',tmpShowViewing);
  setAppDispEls('whenchatting',!tmpShowViewing);

  

}

actions.refreshStream = refreshStream;
function refreshStream() {
 if( !ThisPage.streamInfo.streamStatus){
  return this.getStreamInfo();
 }
 ThisPage.mainFrameEl.src = ThisPage.streamInfo.streamURL;
}

actions.clearStream = clearStream;
function clearStream() {
 ThisPage.mainFrameEl.src = '';
}



actions.sendProfile = sendProfile;
function sendProfile() {
  ThisPage.wsclient.send(JSON.stringify({
    action: 'profile', profile: ThisPage.stage.profile, userid: ThisPage.stage.userid, id: ThisPage.stage.stageid
  }))
}

actions.refreshPeople = refreshPeople;
function refreshPeople(thePeople) {
  ThisPage.stage.people = thePeople;
  //ThisPage.parts.welcome.refreshPeople(thePeople);
  ThisPage.parts.welcome.refreshPeople(thePeople);
  refreshUI();
}


function onPeopleList(theMsg) {
  if( theMsg && theMsg.people){
    refreshPeople(theMsg.people);
  }
  
}

function processMessage(theMsg) {
  if (typeof(theMsg) == 'string' && theMsg.startsWith('{')) {
    theMsg = JSON.parse(theMsg);
  }
  if (typeof(theMsg) != 'object') {
    return;
  }

  var tmpAction = theMsg.action || theMsg.people;
  if (!(tmpAction)) {
    console.warn('no action to take', theMsg);
    return;
  }

  if (tmpAction == 'welcome' && theMsg.id) {
    ThisPage.stage.stageid = theMsg.id;
    if (!(ThisPage.stage.userid)) {
      ThisPage.stage.userid = theMsg.userid;
      sessionStorage.setItem('userid', ThisPage.stage.userid)
    } else {
      //--- We already have a profile, send userid we have
      if (ThisPage.stage.profile.name && ThisPage.stage.userid) {
        sendProfile();
      }
      //ThisPage.wsclient.send({action:'profile',})
    }

  } else if (tmpAction == 'chat') {
    ThisPage.parts.welcome.gotChat(theMsg);
  } else if (tmpAction == 'people') {
    onPeopleList(theMsg);
  } else {
    console.log('unknown message', theMsg);
  }
  if (theMsg.people) {
    refreshPeople(theMsg.people);
  }

}


function setProfileName(theName) {
  if (!(theName)) return;
  ThisPage.stage.profile = ThisPage.stage.profile || {};
  ThisPage.stage.profile.name = theName;
  sessionStorage.setItem('displayname', theName);
  ThisPage.chatTab.show();
  ThisPage.parts.welcome.tabs.gotoTab('tab-chat');
  sendProfile();
  refreshUI();
}


function onStringInfo(theEvent, theEl, theInfo) {
  console.log('onStringInfo',theInfo);
}

function translateChat(theMsg){
  var tmpMsg = theMsg;
  var tmpFound = ThisPage.banners[theMsg];

  if( tmpFound ){
    tmpMsg = '<img class="ui image fluid" src="./res/dolphins/' + tmpFound + '" />';
  }

  return tmpMsg;
}
function onSendChat(theEvent, theEl, theMsg) {
  if (!(theMsg && theMsg.text)) {
    alert('Nothing to send', "Enter some text", "e").then(function () {
      return;
    })
  }
  theMsg.text = translateChat(theMsg.text);

  ThisPage.wsclient.send(JSON.stringify({
    action: 'chat', message: theMsg
  }))
}



actions.setHostName = function(theParams, theTarget){
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['name', 'src']);
  var tmpName = tmpParams.name;
  var tmpChatName = '';
  if( tmpName == 'Pam' ){
    tmpChatName = '<img style="height:22px;" src="./res/LongBackSplitHostPam.png" />';
  } else if( tmpName == 'Joe' ){
    tmpChatName = '<img style="height:22px;" src="./res/LongBackSplitHostJoe.png" />';
  } else {
    return;
  }
  setProfileName(tmpChatName);
}

actions.clearChat = function() {
  console.log('clearChat');
  ThisPage.parts.welcome.clearChat();
}

actions.setYourName = function() {
  ThisApp.input('Enter the name to use in chat', 'Set Chat Name', 'Save Chat Name', ThisPage.stage.profile.name).then(setProfileName);
}
//~YourPageCode~//~

})(ActionAppCore, $);
