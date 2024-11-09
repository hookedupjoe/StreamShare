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
    south: false,
}
//~layoutOptions~//~

    //~layoutConfig//~
thisPageSpecs.layoutConfig = {
  west__size: "400"
  , east__size: "400",
  south__resizable: true,
  south__closable: true,
  south__slidable: true,
  south__togglerLength_open: 10,
  south__spacing_open: 10,
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

ThisPage.msgGroups = {};


ThisPage.msgGroups.banners = {
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

ThisPage.msgGroups.logos = {
  "[mdi-logo01.png]" : "mdi-logo01.png",
  "[mdi-logo03.png]" : "mdi-logo03.png",
  "[mdi-logo04.png]" : "mdi-logo04.png",
  "[mdi-logo06.png]" : "mdi-logo06.png",
  "[mdi-logo07.png]" : "mdi-logo07.png" 
}


ThisPage.msgGroups.colorlist = [
  "teal",
  "orange",
  "red",
  "green",
  "blue",
  "yellow",
  "olive",
  "violet",
  "purple",
  "brown",
  "black"
]

ThisPage.msgGroups.icons = {
  "waddle" : "🐧",
  "hill" : "🐆",
  "chop" : "🪓",
  "football" : "🏈",
  "dolphin" : "🐬",
  "up" : "👆🏻"
}


ThisPage.msgGroups.markups = {
}

ThisPage.msgGroups.lists = {};
ThisPage.msgGroups.lists.logos = [];
ThisPage.msgGroups.lists.logolist = [];




for (var iKey in ThisPage.msgGroups.logos){
  var tmpFN = ThisPage.msgGroups.logos[iKey];
  ThisPage.msgGroups.lists.logos.push(tmpFN);
  ThisPage.msgGroups.markups[iKey] = '<div style="padding-bottom:10px"><img style="height:35px;margin-top:5px;" src="./res/dolphins/logos/' + tmpFN + '" /><span style="font-weight:bolder;font-size:38px;color:#008E97" >Fins Up!</span></div>'
  var tmpLogoMarkup = '<div pageaction="setChatIcon" icon="' + tmpFN + '" class="ui button white basic fluid mar5 bufferbutton"><img class="chaticonselect" src="./res/dolphins/logos/' + tmpFN + '" /></div>';
  ThisPage.msgGroups.lists.logolist.push(tmpLogoMarkup);
}

for (var iKey in ThisPage.msgGroups.icons){
  var tmpIcon = ThisPage.msgGroups.icons[iKey];
  ThisPage.msgGroups.markups[iKey] = '<div style="padding-top:10px"><span style="font-size:28px">' + tmpIcon + tmpIcon + tmpIcon + '</span></div>'
}

ThisPage.loadSpot('chatselect-logos',ThisPage.msgGroups.lists.logolist.join('\n'));

ThisPage.msgGroups.lists.colorselect = [];
for( var iKey in ThisPage.msgGroups.colorlist ){
  var tmpColor = ThisPage.msgGroups.colorlist[iKey];
  var tmpMarkup = '<div pageaction="setChatColor" color="' + tmpColor + '" class="ui button small ' + tmpColor + ' fluid mar5 bufferbutton">Use this color</div> ';
  ThisPage.msgGroups.lists.colorselect.push(tmpMarkup);
}
ThisPage.loadSpot('chatselect-colors',ThisPage.msgGroups.lists.colorselect.join('\n'));

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

var tmpStartupColor = sessionStorage.getItem('displaycolor') || ''
if (!tmpStartupColor){
  tmpStartupColor = getRandomColor();
}
ThisPage.stage.profile.color = tmpStartupColor;


var tmpStartupIcon = sessionStorage.getItem('displayicon') || ''
if (!tmpStartupIcon){
  tmpStartupIcon = getRandomIcon();
}
ThisPage.stage.profile.logo = tmpStartupIcon;



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
    
    ThisApp.delay(100).then(function(){
      ThisPage.parts.welcome.updateForSecurityLevel(tmpLevel)
    })

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

function getRandomColor(){
  const tmpArray = ThisPage.msgGroups.colorlist;
  const tmpLenIndex = Math.floor(Math.random() * tmpArray.length);
  const tmpEntry = tmpArray[tmpLenIndex]; 
  return tmpEntry;
}

function getRandomIcon(){
  const tmpArray = ThisPage.msgGroups.lists.logos;
  const tmpLenIndex = Math.floor(Math.random() * tmpArray.length);
  const tmpEntry = tmpArray[tmpLenIndex]; 
  return tmpEntry;
}


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
    console.log('Websocket disconnected, will reconnect...');
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

function getProfileLook(theDetails){
  var tmpColor = theDetails.color || 'blue';
  var tmpIcon = theDetails.logo || 'default.png';
  var tmpName = theDetails.name || 'Anonymous';
  
  var tmpRet = '<div class="ui label pad1 ' + tmpColor + '">'
  tmpRet += '<img class="ui small rounded image inline chaticon" src="./res/dolphins/logos/' + tmpIcon + '"><span class="ui larger pad6" style="margin-left:5px;margin-right:5px;">' + tmpName + `</span></div>`;
  tmpRet += '<div class="pad5></div>';
  return tmpRet
}

function getProfileStatus(){
  var tmpProfileStatus = 'new';
  if( ThisPage.stage && ThisPage.stage.profile && ThisPage.stage.profile.name ){
    ThisPage.loadSpot('your-disp-name', ThisPage.stage.profile.name);
    ThisPage.loadSpot('your-disp-look', getProfileLook(ThisPage.stage.profile));
    var tmpName = ThisPage.stage.profile.name;
    if (tmpName) {
      tmpProfileStatus = 'outside';
    }
    if (ThisPage.stage.people && ThisPage.stage.people[ThisPage.stage.userid]) {
      tmpProfileStatus = 'backstage';
      ThisPage.chatTab.show();
    }  
  }
  return tmpProfileStatus;
}

function refreshUI() {

  var tmpProfileStatus = getProfileStatus();
  
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

function startHomePrompt(){
  setAppDispEls('hidewelcomeprompt', false);
}
function endHomePrompt(){
  setAppDispEls('hidewelcomeprompt', true);
}

actions.setChatColor = function(theParams, theTarget){
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['color']);
  var tmpColor = tmpParams.color;
  ThisPage.stage.profile.color = tmpColor;
  sessionStorage.setItem('displaycolor', tmpColor);
  sendProfile();
  loadForProfileStatus();
  endHomePrompt()
}

actions.setChatIcon = function(theParams, theTarget){
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['icon']);
  var tmpIcon = tmpParams.icon;
  ThisPage.stage.profile.logo = tmpIcon;
  sessionStorage.setItem('displayicon', tmpIcon);
  sendProfile();
  loadForProfileStatus();
  endHomePrompt()
}

actions.loadForProfileStatus = loadForProfileStatus;

function loadForProfileStatus(){
  var tmpProfileStatus = getProfileStatus();
  
  ThisPage.showSubPage({
    item: tmpProfileStatus, group: 'profilestatus'
  });
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
  sendProfile();
  refreshUI();
}

function translateChat(theMsg, theMessageGroup){
  var tmpMsg = theMsg;
  var theGroupName = theMessageGroup || 'banners';
  var tmpFound = ThisPage.msgGroups[theGroupName][theMsg];

  if( tmpFound ){
    if( theGroupName == 'banners'){
      tmpMsg = '<img class="ui image fluid" src="./res/dolphins/banners/' + tmpFound + '" />';
    } else {
      tmpMsg = tmpFound;
    }
  }

  return tmpMsg;
}
function onSendChat(theEvent, theEl, theMsg, theMessageGroup) {
  if (!(theMsg && theMsg.text)) {
    alert('Nothing to send', "Enter some text", "e").then(function () {
      return;
    })
  }
  theMsg.text = translateChat(theMsg.text, theMessageGroup);

  ThisPage.wsclient.send(JSON.stringify({
    action: 'chat', message: theMsg, group: theMessageGroup
  }))
}


actions.gotoChat = function(){
  ThisPage.parts.welcome.tabs.gotoTab('tab-chat');
}

actions.setHostName = function(theParams, theTarget){
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['name', 'src']);
  var tmpName = tmpParams.name;
  var tmpChatName = '';
  if( tmpName == 'Pam' ){
    tmpChatName = "<img style='height:22px;' src='./res/LongBackSplitHostPam.png' />";
  } else if( tmpName == 'Joe' ){
    tmpChatName = "<img style='height:22px;' src='./res/LongBackSplitHostJoe.png' />";
  } else {
    return;
  }
  setProfileName(tmpChatName);
}

actions.clearChat = function() {
  ThisPage.parts.welcome.clearChat();
}

actions.setYourName = function() {
  ThisApp.input('Enter the name to use in chat', 'Set Chat Name', 'Save Chat Name', ThisPage.stage.profile.name).then(setProfileName);
}
actions.setYourLogo = function() {
  ThisPage.showSubPage({
    item: 'selectlogo', group: 'profilestatus'
  });
  startHomePrompt();
}
actions.setYourColor = function() {
  
  ThisPage.showSubPage({
    item: 'selectcolor', group: 'profilestatus'
  });
  startHomePrompt();
}
//~YourPageCode~//~

})(ActionAppCore, $);
