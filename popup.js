
var locations = "3dw\nbbg\neos";

var towerIds = "";

var notamRequestGenerator = {
  searchPilotwebURL_: "https://pilotweb.nas.faa.gov/PilotWeb/notamRetrievalByICAOAction.do?method=displayByICAOs",

  formFields_:  {formatType:"DOMESTIC", retrieveLocId:locations,
                 reportType:"REPORT", actionType:"notamRetrievalByICAOs"},

  pilotwebRequest: function() {
    var req = $.post(this.searchPilotwebURL_,
                     this.formFields_,
                     this.findNotams_.bind(this),
                     "html");

  },

  findNotams_: function(data) {
    //console.log(data);
    console.log(typeof data);
    var page = $('<html />').html(data);
    var i;
    console.log($('body').text());
    page.find('#notamRight').each(function (i) {
      var text = '<div>' + $(this).text() + '</div>';
      $('body').append(text);

      console.log(text);
    });

  }

}

document.addEventListener('DOMContentLoaded', function () {
  notamRequestGenerator.pilotwebRequest();
});
