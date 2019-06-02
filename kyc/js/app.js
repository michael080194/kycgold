

function onLoad() {
  //  Cordova加載完成會觸發
  document.addEventListener("deviceready", onDeviceReady , false);

}

function onDeviceReady(){

  device_version = device.version;
  device_uuid = device.uuid;
  device_platform = device.platform;
  firebase.initializeApp(config);// Initialize Firebase
  push_notification();
}

// Dom7
var $$ = Dom7;

// Framework7 App main instance
app  = new Framework7({
  init: false,
  root: '#app', // App root element
  id: 'com.kyc168.repair', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  routes: routes,
});

$$(document).on('page:init', function (e) {
  var page = e.detail;
  // console.log(e.detail.name);
});

app.init();

// console.log(app.views);

var mainView  = app.views.create('.view-main');

//To load contacts page from template:
/*
// Init/Create views
var loginView = app.views.create('#view-login', {
  url: '/login/'
});
var aboutView = app.views.create('#view-about', {
  url: '/about/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});
*/

// var website = "http://202.39.64.155/~may"; // 網站位址
// var url1 = website + "/modules/kyc_repair/appRepair.php";//API位址  
// Login Screen Demo
$$('.login-button').on('click', function () {
  FCMPlugin.getToken(function (token) {
     // alert(token);
  });
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();
  if(username =="" || password =="") {
    kyc_warnning("帳號或密碼不可空白")
    return false;
  }

  /*  
  var filePath = cordova.file.externalRootDirectory;
  var fileName = "123.txt";//"car_website.txt";
  var file = filePath + fileName;

  window.resolveLocalFileSystemURL(file,function(root){
  },function(err){
    alert(fileName + ' 檔案不存在');
  });  
  */
  // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail); // not working in android webview
//  getTextFileByGet(file); // android 7.0 not working
  // getTextFileByAjax(file)  // android 7.0 not working

  // app.views.main.router.navigate("/main/");
  app.views.main.router.navigate("/orderMenu/");  
  return ;

  var pass0 = {};
  pass0.op = "login";
  pass0.uname = $$('#my-login-screen [name="username"]').val(); // 帳號
  pass0.pass  = $$('#my-login-screen [name="password"]').val(); // 密碼
    app.request({
      url: url1,
      method:"POST",
      data:pass0,
      beforeSend:function(xhr) {
          app.preloader.show();
        },
      success:function(data, xhr, status) {
          var data1 = JSON.parse(data);
          var ret_status=data1["responseStatus"];//data1.responseStatus也可    
          app.preloader.hide();
          if(ret_status !="SUCCESS" ) {
            kyc_warnning("帳號或密碼輸入錯誤")
            return false;
          } else {
          //   routes[1].options.context = {
          //       tel: '(999)-111-22-33',
          //       email: '44444@john.doe'
          // }
            app.views.main.router.navigate("/main/");
          }
        },
      complete:function(xhr, status) {
          app.preloader.hide();
        },   
      error:function(xhr, status) {
          kyc_warnning("app.js 連線錯誤")
        }
    })                    
});


function push_notification(){
  FCMPlugin.subscribeToTopic('repair');

  FCMPlugin.onTokenRefresh(function (token) {
  });

  FCMPlugin.getToken(function (token) {
     // alert(token);
  });

  FCMPlugin.onNotification(function (data) {
      // wktemp1.forEach(function(childSnapshot) {
      //   var childData = childSnapshot.val();
      //   alert("1111=" + childData)
      //   for (var key in childData) {
      //       var obj = childData[key];
      //       alert(key + ":" + obj); 
      //   }
      // });      
      var notificationWithButton = app.notification.create({
        icon: '<i class="icon demo-icon">7</i>',
        title: data.title,
        subtitle: data.body,
        closeButton: true,
      });
      
      notificationWithButton.open();
//      alert(JSON.stringify(data));
      // if (data.wasTapped) {
      //     alert("111");
      //     //Notification was received on device tray and tapped by the user.
      //     alert(JSON.stringify(data));
      // } else {
      //     //Notification was received in foreground. Maybe the user needs to be notified.
      //     alert("2222");
      //     alert(JSON.stringify(data));
      // }
  });
}

function gotFS(fileSystem) {
  var fileName = "123.txt";
  fileSystem.root.getFile(fileName, {create: true}, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
  alert("cccdddd");
  fileEntry.file(gotFile, fail);
}

function gotFile(file){
  // readDataUrl(file);
  readAsText(file);
}

function readDataUrl(file) {
  var reader = new FileReader();
  reader.onloadend = function(evt) {
    alert("readDataUrl reader.readyState=" + reader.readyState);  
    alert("readDataUrl this.result=" + evt.target.result);
  };
  reader.readAsDataURL(file);
}

function readAsText(file) {
  var reader = new FileReader();
  reader.onload = function(evt) {
      alert("reader.readyState=" + reader.readyState);        
      alert("this.result=" + reader.result.length);
      alert("111="+evt.target.result);
  };
  // reader.readAsText(file);
  reader.readAsBinaryString(file);

 }; 

function fail(evt) {
  alert(evt.target.error.code);
}


function getTextFileByAjax(file) {
  $.ajax({
      url : file,
      async: false,
      dataType: "text",
      success : function (txt_read) {
        alert("get Text File By Ajax =" + txt_read);
      }
  });
}



function getTextFileByGet(file) {
  $.get( file, function( data ) {
    alert("get Text File By Get =" + data);
  });  
}

/*
// for breakfast order system
let menuTemplate = `
    <p>Left Panel content here</p>
    <p><a class="panel-close" href="/accordion-layout/">Accordion Layout</a></p>
    <p><a class="panel-close" href="/action-sheet/">Action Sheet</a></p>
`;

function menuPrepared() {
    menu = document.getElementById('menu');
    menu.innerHTML = menuTemplate;
}

let orderLists = [];

$$(document).on('click', '.printBill', function () {
  let itemList = $$('.list ul li.swipeout');
  let itemCount = itemList.length
  let order = [];

  for (let i = 0; i < itemCount; i++) {
      order[i] = {
          name: itemList.eq(i).find('.item-content .item-inner > .item-title').text(),
          amount: itemList.eq(i).find('.item-content .item-media > .badge').text()
      }
  }

  alert(JSON.stringify(order));
});

let toastCheckout = app.toast.create({
  text: '您尚未點餐喔。',
  position: 'top',
  closeTimeout: 2000
});

function prepareCheckout(order) {
  let items = $$('.list li.item-choose');
  let countOrder = items.length;
  for (let i = 0; i < countOrder; i++) {
      order[i] = {};
      order[i].name = items.eq(i).find('.item-title').text();
      order[i].price = parseInt(items.eq(i).find('.item-price').text());
      order[i].amount = parseInt(items.eq(i).find('.item-amount').text());
  }
}
*/
