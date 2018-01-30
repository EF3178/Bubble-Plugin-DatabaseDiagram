function(instance, properties, context) {
  var uniqueid = instance.data.uniqueid
  var el = instance.canvas.find('#'+uniqueid)[0]
  var div = $(el)
  var domainName = properties.domain_name
  var version = (properties.version === 'Development')? 'version-test/':''
  var metaurl = 'https://'+domainName+'/'+version+'api/1.1/meta'
  var request = $.get(metaurl)
  var diagram = "";
  request.done(function(result) {

   var meta = JSON.parse(result)
   var tables = meta.types


	var tableIds = Object.keys(tables)

  var tbl = ""
  var rel = ""
	for (i=0;i<tableIds.length;i++){
		var table = tables[tableIds[i]]
    var tableName = table.display
		var tableFields = table.fields
    var tblFields = ""
    for(j=0;j<tableFields.length;j++){
    	var fieldName = tableFields[j].display
        fieldName = fieldName.replace(/\?|\#/g,'');
      var fieldTypeStr = tableFields[j].type;
      var fieldType = getType(tableFields[j].type)
      var list = (isListField (fieldTypeStr))? ' *': ''
      var bgcolor = ['yellowgreen','whitesmokek','plum','white','wheat','violet','turquoise','yellow','mediumvioletred','tomato','thistle','tan','stellblue','rosybrown','springgreen','snow','slategray','slateblue','sienna','seashell','seagreen','skeyblue','sandybrown','salmon','saddlebrown','royalblue','red','purple','powderblue','pink','peru','peachpuff','papayawhip','palevioletred','paletuquoise','palegreen','palegoldenrod','orchid','orangered','orange','olivedrab','oldlace','navajowhite','moccasin','mistyrose','mediumturquoise','linen','lightyellow','lightskyblue','lightsalmon','kkaki','lightpink','goldenrod','gold','gray','corla','limegreen','chocolate','aliceblue','bisque']
      var rand = Math.floor(Math.random() * 59)
      if( isCustomType(fieldTypeStr) ){
      	if(isListField (fieldTypeStr)){
        	rel += '['+tableName+']'+'<>-'+fieldName+'>*'+'['+fieldType+'],'
        }
        else{
        	rel += '['+tableName+']'+'<>->'+fieldName+'['+fieldType+'],'
        }
      	tblFields += '&#9911; '+fieldName+" : "+fieldType+list+'; '
      }
      else{
      	tblFields += fieldName+" : "+fieldType+list+'; '
      }
      
    }
     if (properties.color){
       tbl += '['+tableName+'|'+tblFields+'{bg:'+bgcolor[rand]+'}],'
     }
      else {
        tbl += '['+tableName+'|'+tblFields+'],'
     }
	 
      
      //tbl += '['+tableName+'{bg:powderblue}|'+tblFields+'],'
    
    //generate relationships
	}
    
  var direction = 'lr'
  if(properties.direction == 'Left to Right'){
      direction  = 'lr'
  }
  else if(properties.direction == 'Top to Down') {
      direction = 'td'
  }
  else {
      direction = 'rl'
  }

    
  var diagram = tbl+rel
  var imgSrc = 'https://yuml.me/airdbdiagram/diagram/'+properties.style+';dir:'+direction+';scale:'+properties.scale+'/class/'+diagram
   var imgtag = '<p style="padding-top: 2em; position: relative;"><img style="max-height: 100%; max-width: 100%" src="'+imgSrc+'" /></p>';
    
 $(el).append(imgtag)
    //instance.publishState('value',imgSrc)
    

}); //end of done

request.fail(function(jqXHR, textStatus, errorThrown) {
  if (textStatus == 'timeout')
    console.log('The server is not responding');

  if (textStatus == 'error'){
    alert('Hmm something went wrong accessing your application metadata at : www.'+properties.domain_name)
     console.log('Error: ' + errorThrown);
  }
   
});

function isListField(str){
	var strArray = str.split('.')
  if (strArray[0] === 'list') return true;
  else return false;
}

function isCustomType(str){
	var strArray = str.split('.')
  if (strArray.length > 1) return true
  else return false
}

function getType(str){
	var strArray = str.split('.')
  if(strArray.length>1) return strArray[(strArray.length-1)]
  else return str
}


}