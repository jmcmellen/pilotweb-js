
//var locations = ["333"];

var locations = ["3dw","bbg","eos"];

var towerIds = ['1007705', '1007704', '1005399'];

var qtyNotamsRegex = new RegExp(".*Number of NOTAMs:\\D*(\\d+)","gim");

//var asrNotamsRegex = new RegExp("(lgts ots).*asr.*(\\d{7})\\).*til.*(\\d{10}).*","gim");
var asrNotamsRegex = new RegExp("(obst tower lgt).*asr.*(\\d{7})\\).*out of service.*(\\d{10}\\-\\d{10}).*","gim");
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
      var valid_time = result[3].split("-");
      text = '<div>' + text + '</div>';
      text += '<p>ASR is ' + asrnum + '<br/> Expires ' + notamRequestGenerator.parseDateStr_(valid_time[1]) + ' </p>';
      $('body').append(text);
    }
  },

  parseDateStr_: function(str) {
    var d = new Date();
    d.setUTCFullYear(parseInt("20" + str.slice(0,2)), parseInt(str.slice(2,4))-1, parseInt(str.slice(4,6)) );
    //d.setUTCMonth(parseInt(str.slice(2,4)));
    //d.setUTCDate(parseInt(str.slice(4,6)));
    d.setUTCHours(parseInt(str.slice(6,8)));
    d.setUTCMinutes(parseInt(str.slice(8)));
    d.setUTCSeconds(0);
    return d.toString();

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
