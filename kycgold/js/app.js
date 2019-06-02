// import Home from './index_gold.html' 

function onLoad() {
  //  Cordova加載完成會觸發
  document.addEventListener("deviceready", onDeviceReady , false);
}

function onDeviceReady(){
  device_version = device.version;
  device_uuid = device.uuid;
  device_platform = device.platform;
}

// Dom7
var $$ = Dom7;

// Framework7 App main instance
app  = new Framework7({
  init: false,
  root: '#app', // App root element
  view:{
    // ex domCache
    stackPages:true,
    // looks better with js
    animateWithJS:true 
  },  
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

var mainView = app.views.create('.view-main');

var company_id = localStorage.company_id;      
var uname = localStorage.uname;
var pass  = localStorage.pass;

golbalCompanyId = company_id; // 公司代碼  

$$('#my-login-screen [name="username"]').val(uname);
$$('#my-login-screen [name="password"]').val(pass);

$$('.login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  if(golbalCompanyId =="" ) {
    kyc_warnning("公司代碼不可空白;請先至設定頁面設定")
    return false;
  }

  if(username =="" || password =="") {
    kyc_warnning("帳號或密碼不可空白")
    return false;
  }

  // app.views.main.router.navigate("/main/");  
  // return ;

  var pass0 = {};
  pass0.company_id = golbalCompanyId ;  
  pass0.target = "a00_user_login";
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
          // console.log(data);
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
            app.views.main.router.navigate("/sale/");
          }
        },
      complete:function(xhr, status) {
          app.preloader.hide();
        },   
      error:function(xhr, status) {
          app.preloader.hide();        
          kyc_warnning("app.js 連線錯誤");
        }
    })                    
});



