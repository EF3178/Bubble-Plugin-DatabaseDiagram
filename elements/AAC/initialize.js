function(instance, context) {
  var div;

  var uniqueid = 'dp'+(Math.random() * Math.pow(2, 54)).toString(18);
  div = $('<div id='+uniqueid+'></div>');
  instance.canvas.append(div);

  instance.data.uniqueid = uniqueid;
}