function Tracelog(message) {
  //var time_stamp = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "") + ": ";
  var time_stamp = new Date().toLocaleString();
  console.log(`EMS-srv:${time_stamp} -> ${message}`);
}

module.exports = Tracelog;
