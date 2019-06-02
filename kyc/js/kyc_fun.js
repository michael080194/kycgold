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


// https://cordova-plugin-fcm.appspot.com/  notification source code
// var endpoint = "https://cordova-plugin-fcm.appspot.com/push/freesend'
// var endpoint = "https://fcm.googleapis.com/fcm/send"
function sendPush_backup(){
  var endpoint = "https://cordova-plugin-fcm.appspot.com/push/freesend"
  var customDataFixed = [{param:'111',value:'222'}];

  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {

    if(xhttp.readyState == 4){
    if(xhttp.status == 200){
      var response = JSON.parse(xhttp.responseText);
      console.log( response );
      if(response.result == 1) alert( 'ERROR: ' + response.message )
      else alert( 'Push notification sent successfully!' )
    }
    }
  };

  xhttp.open("POST", endpoint , true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");

  var payload={
    recipient:"all", /* all */ 
    isTopic:true,  /* true */
    title:"title aaaa",
    body:"body bbbbb",
    apiKey:"AIzaSyDZjHWHKkaTcGW9jS-_HTGQlxsbDx4edHE",  /* AIzaSyDZjHWHKkaTcGW9jS-_HTGQlxsbDx4edHE */
    application:"com.kyc168.repair", /* com.kyc168.repair */    
    customData:customDataFixed
  }  
  xhttp.send(JSON.stringify(payload));
}

function sendPush(){
  var endpoint = "https://fcm.googleapis.com/fcm/send"
  // FirebaseMessaging.getInstance().subscribeToTopic("all");  
  // var messaging = firebase.messaging();
  // const messaging = firebase.messaging();

  // alert(messaging);
  // FCMPlugin.subscribeToTopic('all');
  xhttp = new XMLHttpRequest();
  xhttp.open("POST", endpoint , true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhttp.setRequestHeader('Access-Control-Allow-Methods', 'POST');  
  xhttp.setRequestHeader("Authorization", "key=AAAAkcnsDtw:APA91bGItafVSUixBSoqn9qOKa7gNsL_EitrVc9Wq1MmewB3UE1LrlS_SOMbErhiUVs0w2zNjZwxXjF5PuTxcSckZ6-o3DUZwdguSytLI6khntz9UeWy0WQCNnW8SOCftoXaPZKO9iAU");  

  xhttp.onreadystatechange = function() {
    if(xhttp.readyState == 4){
      if(xhttp.status == 200){
        var response = JSON.parse(xhttp.responseText);
        if(response.result == 1)
          alert( 'ERROR: ' + response.message )
        else
          alert( 'Push notification sent successfully!' )
      }
    }
  };


  var payload = {
    "notification": {
      "title": "Notification title",
      "body": "Notification body",
      "sound": "default",
      "click_action": "FCM_PLUGIN_ACTIVITY",
      "icon": "fcm_push_icon"
    },
    "data": {
      "param1": "value1",
      "param2": "value2"
    },
    "to": "/topics/all",
    // "token":"",    
    "priority": "high",
    "restricted_package_name": "com.kyc168.repair"
  };

  xhttp.send(JSON.stringify(payload));
}

function readRooms(){
  $("#table1 tbody").html('');
  var database = firebase.database();
  app.preloader.show();
  var ref = database.ref('rooms/');
  var str1 = "";
  ref.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        let roomsNo = childSnapshot.key;
        let childData = childSnapshot.val();
        str1 += '<tr>';
        str1 += '<td class="label-cell">' + roomsNo + '</td>'
        str1 += '<td class="label-cell">' + childData.temperature + '</td>' 
        str1 += '<td class="label-cell">' + childData.humility + '</td>'                 
        str1 += '</tr>';
      });
        $("#table1 tbody").html(str1);
        $('#table1').show();
        app.preloader.hide();
  });


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

