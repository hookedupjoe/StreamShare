(function (ActionAppCore, $) {

  var ControlSpecs = {
    "options": {
      padding: true
    },
    "content": [
      {
        "ctl": "message",
        "color": "blue",
        "size": "large",
        "name": "welcome",
        "hidden": false,
        "text": "Provide details about this stream below."
      },
      {
        "ctl": "fieldrow",
        "name": "info-row",
        "items": [{
          "label": "Stream Name",
          "ctl": "field",
          "name": "name",
         "note": "A short unique name for this stream",
          "req": true
        },
        {
          "label": "Stream Title",
          "ctl": "field",
          "name": "title",
          "note": "A very short title for this stream",
          "req": true
        }
          ]
      },
      
      {
        "ctl": "fieldrow",
        "name": "status-row",
        "items": [
          {
          "label": "Stream Status",
          "ctl": "radiolist",
          "name": "status",
          "list": "Active,Inactive",
          "default": "Inactive",
          "req": true
        },
          {
            "label": "Stream Type",
            "ctl": "radiolist",
            "list": "Primary,Secondary",
            "Default": "Primary",
            "name": "streamtype",
            "req": true
          }
      ]
      },
      {
        name: 'streamurl',
        label: 'Stream URL',
        ctl: 'field'
      },
      {
        name: 'details',
        label: 'Stream Details',
        ctl: 'textarea',
        rows: 3
      },
      {
        "name": "_id",
        "ctl": "hidden"
      },
      {
        "name": "__doctype",
        "ctl": "hidden",
        "value": "stream"
      },
      {
        "name": "__doctitle",
        "ctl": "hidden"
      },
      ]

  }


  function submitForm() {
    var tmpData = this.getData();
    var tmpDocTitle = tmpData.title;

    var tmpBaseURL = ActionAppCore.ActAppData.rootPath;
    var tmpDocType = 'app';

    console.log('tmpData', tmpData);
    var tmpPostOptions = {
      formSubmit: false,
      data: tmpData,
      url: tmpBaseURL + 'appdata/api/create-appdoc.json'
    };

    return ThisApp.apiCall(tmpPostOptions);
  }

  var ControlCode = {
    submitForm: submitForm,
  };

  ControlCode.setup = setup;
  function setup() {
    console.log("Ran setup")
  }

  ControlCode.getColumnsFromIndex = function() {
    //console.log('getColumnsFromIndex');
    var tmpIndex = this.getIndex();
    var tmpCols = [];
    for (var iPos in tmpIndex.fieldsList) {
      var tmpFieldName = tmpIndex.fieldsList[iPos];
      var tmpFieldSpecs = tmpIndex.all[tmpFieldName];
      tmpCols.push({
        "title": tmpFieldSpecs.label || tmpFieldName,
        "field": tmpFieldName
      })

      //console.log('tmpFieldSpecs',tmpFieldSpecs)
    }
    return tmpCols;
  }

  ControlCode._onInit = _onInit;
  function _onInit() {
    //console.log("Ran _onInit")
  }

  var ThisControl = {
    specs: ControlSpecs,
    options: {
      proto: ControlCode,
      parent: ThisApp
    }};
  return ThisControl;
})(ActionAppCore, $);