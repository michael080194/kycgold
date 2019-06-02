const routes = [
  {
    path: '/',
    url: './index.html',
  },  
  {
    path: '/list/',
    templateUrl: './list.html',
    options: {},
  },    
  {
    path: '/about/',
    url: './kyc/pages/about.html',
  }, 
  {
    path: '/settings/',
    url: './kyc/pages/settings.html',
  },
  {
    path: '/main/',
    url: './kyc/pages/main.html',
    on: {
      pageInit: function (e, page) {
        // alert(page.name)
        $$('#scanBarcode').on('click', function () {
          scanBarcode();
        });
        // $$('#push').on('click', function () {
        //   sendPush();
        //   // push_notification();
        // });  
        $$('#tab-bluetooth').on('click', function () {
            // alert("01:aaaaa");
            new Promise(function (resolve, reject) {
                bluetoothle.initialize(resolve, reject,
                    { request: true, statusReceiver: false });
            }).then(initializeSuccess, handleError);
        });   

        $$('#start-scan').on('click', function () {
          // alert("start scan bluetooth.....");
          startScan();
        });     
        $$('#stopScan').on('click', function () {
          stopScan();
        });    

        $$('#paperangRegister').on('click', function () {
          paperangRegister();
        });      
        $$('#paperangConnect').on('click', function () {
          paperangConnect();
        });  
        $$('#paperangPrintImage').on('click', function () {
          paperangPrintImage();
        });  
        $$('#testPromise').on('click', function () {
          app.preloader.show();
          testPromise();
        });          
        $$('#signature').on('click', function () {      
          signature();
        });                 
        $$('#checkOut').on('click', function () {
          checkOut();   
        });                      

        $$('#rooms').on('click', function () {
          // alert("rooms click");
          // readRooms();
          // getPrinter();
          // paperangInit();
        });                
      },
    }
  },  
  {
    path: '/product/',
    url: './kyc/pages/product.html',
  },   
  {
    path: '/product_detail/',
    templateUrl: './kyc/pages/product_detail.html',
    options: {},
    on: {
      pageInit: function (e, page) {
        // console.log(product);
      },
    }
  },      
  {
    path: '/qrcode/',
    url: './kyc/pages/qrcode.html',
  },      
  {
    path: '/orderMenu/',
    url: './kyc/pages/orderMenu.html',
  },   
  {
    path: '/orderCheckout/',
    on: {
      pageInit: function () {
          setOrderList(orderLists);
      }
    },
    // 記錄點餐細項
    async (routeTo, routeFrom, resolve, reject) {
        if ($$('.total-price').text() !== '0') {
            prepareCheckout(orderLists);
            resolve({
                url: './kyc/pages/orderCheckout.html'
            })
        } else {
            toastCheckout.open();
            reject();
        }
    }
  },          
  {
    path: '(.*)',
    url: './kyc/pages/404.html',
  },
];
