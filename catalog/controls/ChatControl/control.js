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
        content: [{
          ctl: 'div',
          name: 'toolbar',
          content: [{
            "ctl": "title",
            "size": "small",
            "color": "violet",
            "name": "title",
            "text": '<div pageaction="clearChat" class="ui button toright blue pad8 mar2">Clear Chat</div> <div pageaction="setYourName" class="ui label violet mar0">Chat Name: </div> <span style="margin-left:10px;" class="one-liner" pagespot="your-disp-name">(none)</span><div style="clear:both;"></div>'
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
						"text": 'Send Banner',
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
						"text": 'Send a Fins Up',
						"name": "btn-send-markup",
						"onClick": {
							"run": "action",
							"action": "selectMarkupToSend"
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
        }, {
          "ctl": "fieldrow",
          "name": "ro1",
          items: [{
            "ctl": "button",
            compact: true,
            style: "max-height:40px;min-width:40px;margin-left:10px;",
            "icon": "smile",
						"onClick": {
							"run": "action",
							"action": "toggleExtras"
						},
            "name": "btn-extras"
          },
          {
            "ctl": "checkboxlist",
            "list": "Private|private",
            "default": "public",
            hidden: true,
            "direction": "upward",
            "onChange": {
              "run": "refreshPeopleList"

            },
            "size": 5,
            "name": "selectvis"
          },
            {
              "ctl": "dropdown",
              "list": "everyone",
              "default": "everyone",
              "direction": "upward",
              "size": 13,
              "onChange": {
                "run": "onPersonSelect"
  
              },
              "name": "selectto"
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
    console.log('updateForSecurityLevel',theLevel,tmpShow);
    
     this.setItemDisplay('selectvis',tmpShow);
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
    theHTML.push ('<div class="ui message blue">Click item below to send it in chat.<br /><div class="ui button orange toright pad5" action="showSubPage" group="chatbodytabs" item="chat-area"><i class="icon close"></i> Close</div><div style="clear:both;"></div>');
    theHTML.push ('</div>');
  }
    
  ControlCode.selectMarkupToSend = function() {
    window.activeControl = this;
    var tmpHTML = [];
    var tmpMarkups = this.context.page.controller.msgGroups.markups;
    addPopupHeader(tmpHTML);
    for( var iName in tmpMarkups){
      var tmpMarkup = tmpMarkups[iName];
      tmpHTML.push ('<div class="ui segment slim" myaction="sendMarkup" name="' + iName + '" >' + tmpMarkup + '</div><div style="border-bottom: solid 2px black" class="pad1"></div>');
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
  
  
  ControlCode.sendMarkup = function(theParams, theTarget){
    var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['name', 'src']);
    var tmpName = tmpParams.name;
    ThisApp.gotoCard({group: 'chatbodytabs', item: 'chat-area'})
    this.sendChat(tmpName, 'everyone', 'markups');
  }

  ControlCode.sendBanner = function(theParams, theTarget){
    var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['name', 'src']);
    var tmpName = tmpParams.name;
    ThisApp.gotoCard({group: 'chatbodytabs', item: 'chat-area'})
    this.sendChat(tmpName, 'everyone', 'banners');
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

    for (var aID in tmpPeople) {
      var tmpPerson = tmpPeople[aID];
      if (tmpUserID != aID) {
        if (tmpPerson && tmpPerson.name) {
          if (tmpList) {
            tmpList += ',';
          }
          tmpList += '@' + tmpPerson.name + "|" + aID;
        }
      }
    }
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
    var tmpSpot = this.getSpot('chat-area');
    var tmpEl = tmpSpot.get(0);
    console.log(tmpSpot,tmpEl,'ca')
    window.activeEl = tmpEl;
    tmpEl.scrollTop = tmpEl.scrollHeight;
    
  }

  ControlCode.gotChat = function(theChat) {
    console.log('theChat',theChat)
    var tmpMsg = theChat.message;
    var tmpText = tmpMsg.text;
    var tmpTo = tmpMsg.to;
    var tmpVis = tmpMsg.vis;
    var tmpToName = theChat.toname;
    var tmpColor = 'white';
    var tmpNameColor = 'blue';
    if (tmpVis == 'private') {
      tmpColor = 'orange';
      tmpNameColor = 'orange'
    }

    var tmpGroup = theChat.group || '';

    this.chatNumber = this.chatNumber || 0;
    this.chatNumber++;

    var tmpNewChat = `<div class="ui message larger `+ tmpColor +` mar0 pad3" chatcount="` + this.chatNumber + `">`;

    if( tmpGroup != 'banners'){
      tmpNewChat = `<div class="ui label right pointing toleft ` + tmpNameColor + ` basic">` + theChat.fromname + `</div>`;
  
      if (tmpToName) {
        tmpNewChat += `<div class="ui label basic">@` + tmpToName + `</div> `
      }
    }
    tmpNewChat += '<div style="font-size:16px;">' + tmpText + '</div>' + `<div style="clear:both;"></div></div>`;

    this.addToSpot('chat-area', tmpNewChat)

    var tmpLastAdded = this.getByAttr$({
      'chatcount': ''+this.chatNumber
    });
    if (tmpLastAdded.length > 0) {
      var tmpPrevNum = this.chatNumber -1;
      if (tmpPrevNum) {
        var tmpPrevAdded = this.getByAttr$({
          'chatcount': ''+tmpPrevNum
        });
        if (tmpPrevAdded.length > 0) {
          if (isScrolledIntoView(tmpPrevAdded.get(0))) {
            tmpLastAdded.get(0).scrollIntoView();
            this.scrollToBottom();
            
          }
        }

      }
    }



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
  }

  ControlCode._onInit = _onInit;
  function _onInit() {
    var self = this;
    
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