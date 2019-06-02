function kyc_warnning(msg1){
  app.dialog.create({
      title: '警告視窗',
      text: msg1,
      buttons: [
        {
          text: 'OK',
        }
      ],
      verticalButtons: true,
  }).open();
	// app.dialog.alert("帳號或密碼不可空白");
}

var showClock = function(){
  var d= new Date();
  var h = pad(d.getHours());
  var m = pad(d.getMinutes());
  var s = pad(d.getSeconds());   
  alert([h,m,s].join(':'));
}
var pad = function(x) {
  return x < 10 ? '0'+x :x ;
}

function weightTrans(weight_1, weight_2 , weight_3 , weight_4)
{
  var weight = "";       
  if (weight_1 > 0) weight = weight + weight_1 + "兩" ; 
  if (weight_2 > 0) weight = weight + weight_2 + "錢" ; 
  if (weight_3 > 0) weight = weight + weight_3 + "分" ; 
  if (weight_4 > 0) weight = weight + weight_4 + "厘" ;  
  return weight;
}

function formatFloat(num, pos)
{
  var size = Math.pow(10, pos);
  return Math.round(num * size) / size;
}

