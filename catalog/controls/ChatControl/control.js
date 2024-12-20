(function (ActionAppCore, $) {

  var ControlSpecs = {
    options: {
      padding: false
    },
    content: [{
      "ctl": "layout",
      "attr": {
        "rem-template": "none"
      },
      "name": "lo",
      "north": [{
        ctl: 'segment',
        "classes": "pad5 mar2",
        name: 'north-body',
        content: [{
          ctl: 'div',
          name: 'toolbar',
          content: [{
            "ctl": "div",
            "name": "title",
            "text": '<div appdisp="hidewhenshort"><div pageaction="clearChat" class="nomobile ui button toright blue pad8 mar2">Clear Chat</div> <div pageaction="showStream" class="mobileonly ui button toright purple pad8 mar2">Watch Stream</div> <span style="margin-left:10px;" class="one-liner" pagespot="your-disp-look">(none)</span><div style="clear:both;"></div></div>'
          }]
        }]
      }],
      "south": [{
        ctl: 'segment',
        name: 'chat-bar',
        classes: 'mar2 pad5',
        content: [{
          ctl: 'segment',
          name: "extras-bar",
          hidden: false,
          classes: 'mar2 pad5',
          content: [
          {
						"ctl": "button",
						size: 'small',
						compact: true,
						color: 'blue',
						basic: true,
						"icon": "down chevron",
						"text": "Add Code",
						"name": "btn-add-code",
						hidden: true,
						"onClick": {
							"run": "action",
							"action": "addCode"
						}
					},
					{
						"ctl": "button",
						size: 'small',
						compact: true,
						color: 'blue',
						basic: true,
						hidden: true,
						"icon": "up chevron",
						"text": 'Banner',
						"name": "btn-send-picture",
						"onClick": {
							"run": "action",
							"action": "selectPictureToSend"
						}
					},
					{
						"ctl": "button",
						size: 'small',
						compact: true,
						color: 'blue',
						basic: true,
						"icon": "up chevron",
						"text": 'Send Picture',
						"name": "btn-send-markup",
						"onClick": {
							"run": "action",
							"action": "selectMarkupToSend"
						}
					},
					{
						"ctl": "button",
						size: 'small',
						compact: true,
						color: 'blue',
						basic: true,
						"icon": "down chevron",
						"text": 'Insert icon',
						"name": "btn-insert-icon",
						"onClick": {
							"run": "action",
							"action": "selectIconSend"
						}
					}
          ]
        },
            {
          "ctl": "control",
          "controlname": "SendBar",
          "catalog": "__app",
          "name": "sendbar"
        }, {
          ctl: 'div',
          classes: 'pad3'
        },

          {
            ctl: 'div',
            classes: 'ui grid nopadgrid',
            name: 'people-bar',
            content: [{
              ctl: 'div',
              classes: 'two wide column center aligned',
              content: [{
                "ctl": "button",
                compact: true,
                "icon": "thumbtack",
                "onClick": {
                  "run": "action",
                  "action": "togglePinSendTo"
                },

                "name": "btn-pin-sendto"
              }]
            },
              {
                ctl: 'div',
                classes: 'twelve wide column center aligned',
                content: [{
                  "ctl": "dropdown",
                  "list": "everyone",
                  "default": "everyone",
                  "direction": "upward",

                  "onChange": {
                    "run": "onPersonSelect"

                  },
                  "name": "selectto"
                }]
              },
              {
                ctl: 'div',
                classes: 'two wide column center aligned',
                content: [{
                  "ctl": "button",
                  compact: true,
                  hidden: false,

                  "icon": "users",
                  "onClick": {
                    "run": "action",
                    "action": "clearSendTo"
                  },
                  "name": "btn-clear-sendto"
                }]
              }]
          }]


      }],
      "center": [{
        ctl: 'div',
        name: 'chat-zone',
        items: [
          {
            ctl: 'div',
            text: '<div appuse="cards" group="chatbodytabs" item="chat-area" class="pad0 "><div myspot="chat-area"></div></div><div appuse="cards" group="chatbodytabs" item="popup" class="pad0  hidden "><div myspot="chat-popup"></div></div>'
          
          }
        ]
      }]
    }]
  }


  var ControlCode = {};

  ControlCode.setup = setup;
  function setup() {
    //--- Placeholder
  }


  function setAppDispEls(theKey,theIsDisp){
    var tmpEls = ThisApp.getByAttr$({appdisp:theKey});
    if( theIsDisp ){
      tmpEls.removeClass('hidden');
    } else {
      tmpEls.addClass('hidden');
    }
  }

  function setChatName(theName) {}
  function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  }

  ControlCode.updateForSecurityLevel = function(theLevel){
     var tmpShow = theLevel > 1;
    
     //this.setFieldDisplay('selectvis',tmpShow);
     this.setItemDisplay('btn-send-picture',tmpShow);
     
     //setAppDispEls('foradmins', tmpShow)
     
  }

  ControlCode.onPersonSelect = function() {
    var tmpSelected = this.getFieldValue('selectto');
    
    if( (tmpSelected) ){
      this.lastPersonSelected = tmpSelected  
    }
    
  }
  
  
  ControlCode.toggleExtras = function() {
    var tmpBar = this.getItem('extras-bar');
    var tmpIsDisp = this.getItemDisplay('extras-bar');
    this.setItemDisplay('extras-bar', !tmpIsDisp)
    ThisApp.refreshLayouts();
  }

  function addPopupHeader(theHTML){
    theHTML.push ('<div class="ui message blue"><div class="toleft">Click item below to send it in chat.</div><div class="ui button orange toright pad5" action="showSubPage" group="chatbodytabs" item="chat-area"><i class="icon close"></i> Close</div><div style="clear:both;"></div></div>');
  }
  function addIconPopupHeader(theHTML){
    theHTML.push ('<div class="ui message blue"><div class="toleft">Click icon to insert into your chat text.</div><div class="ui button orange toright pad5" action="showSubPage" group="chatbodytabs" item="chat-area"><i class="icon close"></i> Close</div><div style="clear:both;"></div></div>');
  }
   
    
   ControlCode.selectIconSend = function() {
    window.activeControl = this;
    var tmpHTML = [];
    tmpHTML.push('<div class="ui segment center alignedpad5 mar2">')
    var tmpMarkups = this.page.msgGroups.lists.iconselect;
    addIconPopupHeader(tmpHTML);
    for( var iName in tmpMarkups){
      var tmpMarkup = tmpMarkups[iName];
      tmpHTML.push (tmpMarkup);
      
    }
    tmpHTML.push('</div>');
    this.loadSpot('chat-popup', tmpHTML.join('\n'));

    ThisApp.gotoCard({group: 'chatbodytabs', item: 'popup'})
    //this.setFieldValue('TextSend','[touchdown]')
//or
    //this.sendChat('[touchdown]', 'everyone')
  }
  
  ControlCode.selectMarkupToSend = function() {
    window.activeControl = this;
    var tmpHTML = [];
    var tmpMarkups = this.page.msgGroups.markups;
    addPopupHeader(tmpHTML);
    for( var iName in tmpMarkups){
      var tmpMarkup = tmpMarkups[iName];
      tmpHTML.push ('<div style="clear:both"></div><div class="ui segment slim" myaction="sendMarkup" name="' + iName + '" >' + tmpMarkup + '</div><div style="border-bottom: solid 2px black" class="pad1"></div>');
    }
    this.loadSpot('chat-popup', tmpHTML.join('\n'));
    
    ThisApp.gotoCard({group: 'chatbodytabs', item: 'popup'})
    //this.setFieldValue('TextSend','[touchdown]')
//or
    //this.sendChat('[touchdown]', 'everyone')
  }
  
  ControlCode.selectPictureToSend = function() {
    window.activeControl = this;
    var tmpHTML = [];
    addPopupHeader(tmpHTML);
    var tmpBanners = this.context.page.controller.msgGroups.banners;
    for( var iBannerName in tmpBanners){
      var tmpFN = tmpBanners[iBannerName];
      tmpHTML.push ('<img class="ui image fluid pad2" myaction="sendBanner" name="' + iBannerName + '" src="./res/dolphins/banners/' + tmpFN + '" /><div style="border-bottom: solid 2px black" class="pad1"></div>');
    }
    this.loadSpot('chat-popup', tmpHTML.join('\n'));
    ThisApp.gotoCard({group: 'chatbodytabs', item: 'popup'})
    //this.setFieldValue('TextSend','[touchdown]')
//or
    //this.sendChat('[touchdown]', 'everyone')
  }
  
  ControlCode.gotoChat = function(){
    ThisApp.gotoCard({group: 'chatbodytabs', item: 'chat-area'})
  }

  
  ControlCode.sendMarkup = function(theParams, theTarget){
    var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['name', 'src']);
    var tmpName = tmpParams.name;
    this.gotoChat();
    this.sendChat(tmpName, 'everyone', 'markups');
  }

  ControlCode.sendBanner = function(theParams, theTarget){
    var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['name', 'src']);
    var tmpName = tmpParams.name;
    ThisApp.gotoCard({group: 'chatbodytabs', item: 'chat-area'})
    this.sendChat(tmpName, 'everyone', 'banners');
  }

  ControlCode.clearSendTo = function(){
    this.setFieldValue('selectto','everyone');
    this.togglePinSendTo(false);
  }
  
  
  
  ControlCode.togglePinSendTo = function(theValueToUse){
    if( typeof(theValueToUse) === 'boolean'){
      this.isPinToggled = theValueToUse;
    } else {
      this.isPinToggled = !this.isPinToggled;
    }
    
    
    var tmpItem = $(this.getItem('btn-pin-sendto'));
    var tmpBtn = tmpItem.get(0).el;
    if( this.isPinToggled ){
      tmpBtn.addClass('orange');
    } else {
      tmpBtn.removeClass('orange');
    }
     window.lastBtn = tmpBtn;
     window.lastCtl = this;
  }
  

  ControlCode.refreshPeopleList = function() {
    //--- Refresh
    var tmpPeople = this.people;
    var tmpPrivate = this.getFieldValue('selectvis');

    var tmpList = '';
    if (tmpPrivate != 'private') {
      tmpList = this.everyoneOption;
    }

    if (!(ThisApp.stage && ThisApp.stage.userid)) {
      return;
    }
    var tmpUserID = ThisApp.stage.userid; //this.getParentPage().stage.userid;


    var tmpListArray = [];

    for (var aID in tmpPeople) {
      var tmpPerson = tmpPeople[aID];
      if (tmpUserID != aID) {
        if (tmpPerson && tmpPerson.name) {
          tmpListArray.push('@' + (tmpPerson.name || '').trim() + "|" + aID);
        }
      }
    }
    tmpListArray.sort();
    tmpList = tmpListArray.join(',');
    tmpList = this.everyoneOption + ',' + tmpList;

    this.setFieldList('selectto', tmpList)
    var tmpSel = this.lastPersonSelected;
    if (!tmpPrivate) {
      tmpSel = tmpSel || 'everyone';
    }
    this.setFieldValue('selectto',tmpSel)
  }
  ControlCode.refreshPeople = function(thePeople) {
    this.people = thePeople;
    this.refreshPeopleList();
  }
  
  ControlCode.scrollToBottom = function(){
    var tmpLastEl = ThisApp.getByAttr$({chatcount:''+this.chatNumber}).get(0)
    tmpLastEl.scrollIntoView()
  }

  ControlCode.gotChat = function(theChat) {
    var tmpMsg = theChat.message;
    var tmpText = tmpMsg.text;
    var tmpTo = tmpMsg.to;
    var tmpVis = tmpMsg.vis;
    var tmpToName = theChat.toname;
    var tmpColor = 'white';
    var tmpFromColor = theChat.fromcolor || 'blue';
    var tmpFromLogo = theChat.fromicon || 'mdi-logo03.png';

    
    //var tmpFromID = theChat.fromid;

    //var tmpPage = this.getParentPage();
    // var tmpPeopleLookup = tmpPage.stage.people;

    // var tmpLogo = 'mdi-logo01.png';
    // var tmpPerson = tmpPeopleLookup[tmpFromID];
    // if(tmpPerson){
    //   if( tmpPerson.color ){
    //     tmpNameColor = tmpPerson.color;
    //   }
    //   if( tmpPerson.logo ){
    //     tmpLogo = tmpPerson.logo;
    //   }
    // }
    // if (tmpVis == 'private') {
    //   tmpColor = 'orange';
    //   tmpNameColor = 'orange'
    // }

    var tmpGroup = theChat.group || '';

    this.chatNumber = this.chatNumber || 0;
    this.chatNumber++;

    var tmpNewChat = `<div class="ui message larger `+ tmpColor +` mar0 pad3" chatcount="` + this.chatNumber + `">`;

    if( tmpGroup != 'banners'){
      tmpNewChat += this.page.pageActions.getProfileLook({fromid: theChat.fromid, host: theChat.host, color: tmpFromColor, logo: tmpFromLogo, name: theChat.fromname }, true);
      //tmpNewChat += `<div class="ui label right pointing pad0 toleft ` + tmpFromColor + `">` + '<img class="ui small rounded image inline chaticon" src="./res/dolphins/logos/' + tmpFromLogo + '"><span class="ui larger pad6" style="margin-left:5px;margin-right:5px;">' + theChat.fromname + `</span></div>`;
  
      if (tmpToName) {
        tmpNewChat += `<div class="ui label basic">@` + tmpToName + `</div> `
      }
    }
    tmpNewChat += '<span class="chattext">' + tmpText + '</span>' + `<div style="clear:both;"></div></div>`;

    this.addToSpot('chat-area', tmpNewChat)

    var tmpLastAdded = ThisApp.getByAttr$({
      'chatcount': ''+this.chatNumber
    });
    window.lastAdded = tmpLastAdded;

    if (tmpLastAdded.length > 0) {
      
      var tmpPrevNum = this.chatNumber -1;
      if (tmpPrevNum) {
        var tmpPrevAdded = this.getByAttr$({
          'chatcount': ''+tmpPrevNum
        });
        if (tmpPrevAdded.length > 0) {
          if (isScrolledIntoView(tmpPrevAdded.get(0))) {
            tmpLastAdded.get(0).scrollIntoView();
          }

        }

      }
    }

  }

  ControlCode.insertAtCursor = insertAtCursor;
  function insertAtCursor(theValue) {
    this.parts.sendbar.insertAtCursor(theValue);    
  }

  ControlCode.clearChat = function() {
    this.loadSpot('chat-area', '')
  }

  ControlCode.sendChat = function(theValue, theSendTo, theMessageGroup) {
    var tmpMsg = {
      vis: this.getFieldValue('selectvis'),
      to: (theSendTo || this.getFieldValue('selectto')),
      text: theValue
    }
    if( tmpMsg.to == 'everyone'){
      tmpMsg.vis = 'public';
    }
    this.publish('sendChat', [this, tmpMsg, theMessageGroup]);
    var self = this;
    if( (!this.isPinToggled) && tmpMsg.to !== 'everyone'){
      ThisApp.delay(100).then(function(){
        if (!self.isPinToggled){
          self.setFieldValue('selectto','everyone')
        }
      })
    }

    this.gotoChat();
    var self = this;
    ThisApp.delay(200).then(function(){
      self.scrollToBottom();
    })

  }

  
  ControlCode.refreshSubLayouts = refreshSubLayouts;
  function refreshSubLayouts() {
    ControlCode.onControlSize();
  }

  
  ControlCode.onChatNameSelect = onChatNameSelect;
  function onChatNameSelect(theEvent, theSource, theFromID, theName ) {
    this.setFieldValue('selectto', theFromID);
  }


  ControlCode._onInit = _onInit;
  function _onInit() {
    var self = this;
    this.page = this.getParentPage();
    window.chatControl = this; //for debug

    ThisApp.subscribe('chatnameselected', onChatNameSelect.bind(this));

    ControlCode.onControlSize = ActionAppCore.debounce(function () {
      var tmpEl = this.getEl()
      var tmpW = tmpEl.width();
      var tmpH = tmpEl.height();
      if( tmpW == 100 && tmpH == 100){
        return;
      }

      var tmpIsStubby = ( tmpH < 500 );
      if( tmpIsStubby != this.isStubby ){
        this.isStubby = tmpIsStubby;
        this.setItemDisplay('extras-bar', !tmpIsStubby);
        this.setItemDisplay('people-bar', !tmpIsStubby);
        this.setItemDisplay('north-body', !tmpIsStubby);
        this.refreshLayouts();
      }

    }, 200).bind(this);

    
    //this.page = this.getParentPage();
    //this.stage = this.page.stage;
    // this.userid = this.stage.userid;

    this.everyoneOption = "@ The Room|everyone";
    this.setFieldList('selectto', this.everyoneOption);

    this.parts.sendbar.subscribe('send', function(theEvent, theControl, theValue) {
      self.sendChat(theValue);
    })
  }

  var ThisControl = {
    specs: ControlSpecs,
    options: {
      proto: ControlCode,
      parent: ThisApp
    }};
  return ThisControl;
})(ActionAppCore, $);