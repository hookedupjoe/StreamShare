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
          hidden: true,
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
						"icon": "up chevron",
						"text": 'Send Banner',
						"name": "btn-send-picture",
						"onClick": {
							"run": "action",
							"action": "selectPictureToSend"
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
      console.log('Chat updateForSecurityLevel', theLevel);

     var tmpShow = theLevel > 2;
     this.setFieldDisplay('selectvis',tmpShow);

  }

  ControlCode.onPersonSelect = function() {
    var tmpSelected = this.getFieldValue('selectto');
    
    if( (tmpSelected) ){
      this.lastPersonSelected = tmpSelected  
    }
    //console.log( 'onPersonSelect', this.lastPersonSelected);
    
  }
  
  
  ControlCode.toggleExtras = function() {
    var tmpBar = this.getItem('extras-bar');
    console.log('tmpBar',tmpBar);
    var tmpIsDisp = this.getItemDisplay('extras-bar');
    this.setItemDisplay('extras-bar', !tmpIsDisp)
    ThisApp.refreshLayouts();
  }
  
  ControlCode.selectPictureToSend = function() {
    console.log('selectPictureToSend');
    window.activeControl = this;
    var tmpHTML = [];
    tmpHTML.push ('<div class="ui button orange fluid" action="showSubPage" group="chatbodytabs" item="chat-area">Close - Back to Chat</div>');
    console.log('this.context',this.context);
    var tmpBanners = this.context.page.controller.banners;
    for( var iBannerName in tmpBanners){
      var tmpFN = tmpBanners[iBannerName];
      console.log(iBannerName,tmpFN);
      tmpHTML.push ('<img class="ui image fluid pad2" myaction="sendBanner" name="' + iBannerName + '" src="./res/dolphins/' + tmpFN + '" /><div style="border-bottom: solid 2px black" class="pad1"></div>');
  
    }
  //  tmpHTML.push ('<img class="ui image fluid" myaction="sendBanner" name="[touchdown]" src="./res/dolphins/md-touchdown.png" />');

    this.loadSpot('chat-popup', tmpHTML.join('\n'));

    ThisApp.gotoCard({group: 'chatbodytabs', item: 'popup'})
    //this.setFieldValue('TextSend','[touchdown]')
//or
    //this.sendChat('[touchdown]', 'everyone')
  }
  
  ControlCode.sendBanner = function(theParams, theTarget){
    var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['name', 'src']);
    var tmpName = tmpParams.name;
    ThisApp.gotoCard({group: 'chatbodytabs', item: 'chat-area'})
    this.sendChat(tmpName);
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

  ControlCode.gotChat = function(theChat) {
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


    this.chatNumber = this.chatNumber || 0;
    this.chatNumber++;

    var tmpNewChat = `<div class="ui message `+ tmpColor +` mar0 pad3" chatcount="` + this.chatNumber + `">
    <div class="ui label right pointing toleft ` + tmpNameColor + ` basic">` + theChat.fromname + `</div>`;

    if (tmpToName) {
      tmpNewChat += `<div class="ui label basic">@` + tmpToName + `</div> `
    }
    tmpNewChat += tmpText + `<div style="clear:both;"></div></div>`;

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
            tmpLastAdded.get(0).scrollIntoView()
          }
        }

      }
    }



  }

  ControlCode.clearChat = function() {
    this.loadSpot('chat-area', '')
  }

  ControlCode.sendChat = function(theValue, theSendTo) {
    var tmpMsg = {
      vis: this.getFieldValue('selectvis'),
      to: (theSendTo || this.getFieldValue('selectto')),
      text: theValue
    }
    if( tmpMsg.to == 'everyone'){
      tmpMsg.vis = 'public';
    }
    this.publish('sendChat', [this, tmpMsg]);
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