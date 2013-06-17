
//var locations = ["333"];

var locations = ["3dw","bbg","eos"];

var towerIds = ['1007705', '1007704', '1005399'];

var qtyNotamsRegex = new RegExp(".*Number of NOTAMs:\\D*(\\d+)","gim");

var asrNotamsRegex = new RegExp("(lgts ots).*asr.*(\\d{7})\\).*til.*(\\d{10}).*","gim");
//var asrNotamsRegex = new RegExp(".*(lgts ots).*asr.*(\\d{7}).*(til)|(wef).*(\\d{10})-?(\\d{10}?)", "gim");

var notamRequestGenerator = {

  searchPilotwebURL_: "https://pilotweb.nas.faa.gov/PilotWeb/notamRetrievalByICAOAction.do?method=displayByICAOs",

  formFields_:  {formatType:"DOMESTIC", retrieveLocId:locations.join("\n"),
                 reportType:"REPORT", actionType:"notamRetrievalByICAOs"},

  pilotwebRequest: function() {
    var req = $.post(this.searchPilotwebURL_,
                     this.formFields_,
                     this.findNotams_.bind(this),
                     "html");

  },

  parseNotam_: function(i, str) {
    //var result = this.asrNotamsRegex_.exec(str);
    var text = $(str).text().trim();
    var result = asrNotamsRegex.exec(text);
    console.log(text);
    console.log(result);
    asrNotamsRegex.lastIndex = 0;
    if (null !== result) {
      var asrnum = result[2];
      var expire_time = result[3];
      text = '<div>' + text + '</div>';
      text += '<p>ASR is ' + asrnum + '</p>';
      $('body').append(text);
    }
  },

  findNotams_: function(data) {
    var gen = this;
    //console.log(data);
    console.log(typeof data);
    var page = $('<html />').html(data);
    numNotams = qtyNotamsRegex.exec(data)[1];
    console.log(numNotams);
    $('body').append('<p>The number of Notams is ' + numNotams + '</p>');
    console.log(qtyNotamsRegex.exec(data));
    page.find('#notamRight').each(this.parseNotam_);

  }

}

document.addEventListener('DOMContentLoaded', function () {
  notamRequestGenerator.pilotwebRequest();
});
