/*
TextSendBar Control

Author: Joseph Francis
License: MIT
*/
(function (ActionAppCore, $) {

	var ControlSpecs = {
		"options": {
			"padding": false
		},
		"content": [
			{
				"ctl": "field",
				"name": "TextSend",
				"fluid": true,
				"styles": "font-size:14px;font-weight:bold !important;",
				"placeholder": "Text to send ...",
				"content": [
					{
						"ctl": "button",
						"color": "violet",
						"icon": "right chevron",
						"right": true,
						"text": "Send",
						"name": "btn-send",
						"onClick": {
							"run": "action",
							"action": "runTextSend"
						}
					},
					{
						"ctl": "button",
						"icon": "close",
						"hidden": true,
						"name": "btn-clear",
						"onClick": {
							"run": "action",
							"action": "clearTextSend"
						}
					}
				]
			}
		]
	}

  var ControlCode = {
		runTextSend: runTextSend,
		clearTextSend: clearTextSend,
		showLoading: showLoading,
		clearLoading: clearLoading,
		_onInit: _onInit
	};

	
  ControlCode.insertAtCursor = insertAtCursor;
  function insertAtCursor(theValue) {
    var myField = this.getFieldEl('TextSend').get(0);
    window.lastField = myField;
    console.log('insertAtCursor myField',myField);
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;
      var tmpVal = myField.value || ''; 
      // Insert the text at the cursor position
      
      tmpVal = tmpVal.substring(0, startPos) + theValue + tmpVal.substring(endPos, tmpVal.length);
      myField.value = tmpVal;
      // Move the cursor to the end of the inserted text
      ThisApp.delay(100).then(function(){
        myField.selectionStart = myField.selectionEnd = startPos + theValue.length;
      })
      
      this.onProcessChange();
  }


	function showLoading(theIsLoading) {
		var tmpSeg = this.getItem('container');
		if( !tmpSeg && tmpSeg.el){
			return;
		}
		if( theIsLoading !== false ){
			tmpSeg.el.addClass('loading');
		} else {
			tmpSeg.el.removeClass('loading');
		}
	}
	function clearLoading() {
		this.showLoading(false)
	}
	function runTextSend(theOnlyIfChangedFlag) {
		var tmpVal = this.getFieldValue('TextSend');
		this.lastVal = tmpVal;
		if( tmpVal == '' ){
			this.publish('clear',[this]);
			return;
		}
		this.publish('send',[this,tmpVal]);
		this.clearTextSend();
	}
	function clearTextSend() {
		this.setFieldValue('');
		this.publish('clear',[this]);
	}
	function _onInit() {
		//--- Only fire the process change event
		var processChange = ActionAppCore.debounce(function (theEvent) {			
			var tmpVal = this.getFieldValue('TextSend');
			var tmpIsDisabled = (this.getFieldValue('TextSend') == '')
			this.setItemDisabled('btn-send',tmpIsDisabled)
			this.setItemDisabled('btn-clear',tmpIsDisabled)
			if( ( theEvent && theEvent.keyCode  && theEvent.keyCode == 13) ){
				this.runTextSend(true);
			} else if( ( theEvent && theEvent.keyCode  && theEvent.keyCode == 27) ){
				this.clearTextSend()
			}
			
		}, 100).bind(this);
		
		this.onProcessChange = processChange;
		
		this.elTextSend = this.getFieldEl('TextSend');
		this.elTextSend.on('change', processChange.bind(this));
		this.elTextSend.keyup(processChange.bind(this));
		this.setItemDisabled('btn-send',true)
		this.setItemDisabled('btn-clear',true)
		
	}
	
	

	//---- Return control
	var ThisControl = {specs: ControlSpecs, options: { proto: ControlCode, parent: ThisApp }};
	return ThisControl;

})(ActionAppCore, $);

