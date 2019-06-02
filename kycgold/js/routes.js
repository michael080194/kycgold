
const routes = [
  {
    path: '/',
    url: './index.html',    
  },  
  {
    path: '/about/',
    templateUrl: './kycgold/pages/about.html',
    options: {context:
       {appver : "1.0",
        developer:"冠宇資訊有限公司", 
        website:"michael1.cp35.secserverpros.com",   
        connectType:"WiFi",        
        phoneId:"xxx", 
        phoneVer:"Android 7.0",   
        ipAddress:"192.169.0.1",    
        androidStudioVer:"V3.01", 
        cordovaVer:"7.0",   
        java:"1.8.0",   
        Framework7:"4.0",                                       
      }
    },    
  }, 
  {
    path: '/settings/',
    async(to, from, resolve, reject) {
      var company_id = localStorage.company_id;      
      var uname = localStorage.uname;
      var pass  = localStorage.pass;
      var set1 = {};
      set1.company_id = company_id
      set1.uname = uname
      set1.pass = pass          
      resolve(
        {templateUrl: './kycgold/pages/settings.html'},
        {context: set1,}
       ); // end  resolve   
    },
    on: {
      pageInit: function (e, page) {
        $$('#settings_save').on('click', function () {
          settings_save(); // settings.js
          $$('#settings001').click();              
        });  
      },
    }    
  },
  {
    name: 'sale',
    path: '/sale/',
    async(to, from, resolve, reject) {
      var params = {};
      params.company_id = golbalCompanyId;  
      params.target = "phone_a01_sale_head";              
      params.op = "get_all";           
      app.request({
        url: url1,
        data: params,
        method: "POST",
        beforeSend:function(xhr) {
          app.preloader.show();
        },        
        success: function(response, xhr, status) {
         let data1 = JSON.parse(response);
         var templateDataArray = new Array();
         for (var key in data1["responseArray"]) {
            var value = data1["responseArray"][key];          
            var obj1 = {}; 
            let wxweight = weightTrans(parseInt(value["weight_1"]),parseInt(value["weight_2"]),parseInt(value["weight_3"]),parseInt(value["weight_4"]) ); 
            obj1.id = value["id"];   
            obj1.c_name = value["c_name"]; 
            obj1.datewk = value["datewk"];   
            obj1.c_count = value["c_count"];             
            obj1.c_price = value["c_price"]; 
            obj1.weight = wxweight;             
            obj1.amount = value["amount"];    
            obj1.c_wage = value["c_wage"];  
            obj1.c_total = parseInt(value["amount"]) + parseInt(value["c_wage"]);           
            obj1.c_remark = value["c_remark"];   
            templateDataArray.push(obj1);
          }; // end  each               
          app.preloader.hide();
         resolve(
          {templateUrl: './kycgold/pages/sale.html'},
          {context: {sales : templateDataArray},}
         ); // end  resolve   
        }, // end success
        complete:function(xhr, status) {
            app.preloader.hide();
          },   
        error:function(xhr, status) {
            app.preloader.hide();        
            kyc_warnning("routes.js/sale 連線錯誤");
          }        
       }); // end app.request                
    },    
    on: {
      pageInit: function (e, page) {
        $$('li.swipeout > .item-content').on('click', function () {
          let aa1 = $$(this).find('.item-subtitle');         
          // console.log($$(this).attr('data-id'));
          // currentPageStatus.saleLi = $$(this).attr('data-id');
          // var currentSale = {}; // 目前銷貨單資料  
          currentSale.c_name = $$(this).find('.item-title').eq(0).text().split("：")[1]; // 目前客戶名稱  
          currentSale.datewk = aa1.eq(0).text().split("：")[1]; // 銷貨日期           
          currentSale.c_price = parseInt(aa1.eq(1).text().split("：")[1]); // 儲存每日金價    
          currentSale.weight = aa1.eq(2).text().split("：")[1]; // 重量      
          currentSale.amount = parseInt(aa1.eq(3).text().split("：")[1]); // 金價合計    
          currentSale.c_wage = parseInt(aa1.eq(4).text().split("：")[1]); // 工資合計    
          currentSale.c_total = parseInt(aa1.eq(5).text().split("：")[1]); // 金額合計    
          currentSale.c_remark = aa1.eq(6).text().split("：")[1]; // 銷貨備註      
          currentSale.id = parseInt(aa1.eq(7).text().split("：")[1]); // 目前銷貨單號  
 
          app.views.main.router.navigate("/sale_detail/");
        });          
        $$('.changeHead').on('click', function () { // 修改銷貨彙總
          var id = $$(this).attr('data-id');
          if(id == 0) {
            kyc_warnning("銷貨單號空白;無法修改");
          }         
          sale_head_get_single_id(id); // sale.js
        });  
        $$('.deleted-callback').on('swipeout:deleted', function () {    
          let aa1 = $$(this).find('.item-subtitle');        
          let id =  aa1.eq(7).text().split("：")[1] ; // 刪除銷貨單號
          sale_del(id); // sale.js 
        });                
      }, 
      pageReinit:function (e, page) { // 每次頁面重新載入
        alert("sale pageReinit")
        sale_chg_page_infomation(); // sale.js            
      },      
    }
  },  
  {
    path: '/sale_head_edit/',
    templateUrl: './kycgold/pages/sale_head_edit.html',
    on: {
      pageInit: function (e, page) {
        var calendarDefault = app.calendar.create({
          inputEl: '#date1',
          on: {
            calendarClose :function(calendar){
              var dd = $$('#date1').val();
              var dt = new Date();
              var h = pad(dt.getHours());
              var m = pad(dt.getMinutes());              
              $$('#date1').val(dd + " " + h + ":" + m);
            }
          }
        });        
        $$('#sale_head_edit_save').on('click', function () {
          var op = $$(this).attr('data-op');
          var id = $$(this).attr('data-id');     
          sale_head_edit_save(op , id); // sale_head_edit.js
        });   
      },
    }        
  },    
  {
    path: '/sale_detail/',
    async(to, from, resolve, reject) {
      var params = {};
      params.company_id = golbalCompanyId;     
      params.target = "phone_a01_sale_detail"; 
      params.up_id = currentSale.id;                      
      params.op = "get_by_upid";           
      app.request({
        url: url1,
        data: params,
        method: "POST",
        beforeSend:function(xhr) {
          app.preloader.show();
        },        
        success: function(response, xhr, status) {
         var data1 = JSON.parse(response);
         var templateDataArray = new Array();
         for (var key in data1["responseArray"]) {
            var value = data1["responseArray"][key];          
            var obj1 = {}; 
            obj1.id = value["id"];   
            obj1.partno = value["partno"]; 
            obj1.description = value["descrp"];   
            obj1.amount = value["amount"]; 
            obj1.c_wage = value["c_wage"]; 
            obj1.c_amt = parseInt(value["amount"]) + parseInt(value["c_wage"]);           
            obj1.c_qty = value["c_qty"];       
            obj1.c_total = parseInt(value["c_qty"]) * obj1.c_amt;                             
            obj1.c_remark = value["c_remark"];   
            let wxweight = weightTrans(parseInt(value["weight_1"]),parseInt(value["weight_2"]),parseInt(value["weight_3"]),parseInt(value["weight_4"]) );      
            obj1.weight = wxweight;        
            templateDataArray.push(obj1);
         }; // end  each    
         app.preloader.hide();
         resolve(
          {templateUrl: './kycgold/pages/sale_detail.html'},
          {context: {sales : templateDataArray},}
         ); // end  resolve     
        }, // end success
        complete:function(xhr, status) {
          app.preloader.hide();
        },   
        error:function(xhr, status) {
          app.preloader.hide();        
          kyc_warnning("routes.js/sale_detail 連線錯誤");
        }                
       }); // end app.request                
    },      
    on: {
      pageInit: function (e, page) {
        $$('#sale_detail').find('div').eq(0).html("客戶名稱:"+currentSale.c_name+"<p>" +"銷貨日期:"+ currentSale.datewk +"</p>");  

        $$('.changeDetail').on('click', function () { // 修改銷貨明細
          var id = $$(this).attr('data-id');
          if(id == 0) {
            kyc_warnning("銷貨單序號空白;無法修改");
          }                 
          currentSaleDetail.id = id ; // 記錄銷貨明細目前 li 的 ID
          // alert("press : " + currentSaleDetail.id);
          sale_detail_get_single_id(id); // sale_detail.js
        });  

        $$('.deleted-callback').on('swipeout:deleted', function () { // 刪除銷貨明細
          let aa1 = $$(this).find('.item-subtitle');             
          let id =  aa1.eq(8).text().split("：")[1] ; // 銷貨明細序號
          let up_id = currentSale.id ; // 銷貨單號
          // alert(up_id + ":" + id); 
          if(up_id == 0) {
            kyc_warnning("銷貨單號空白;無法刪除");
          }
          if(id == 0) {
            kyc_warnning("銷貨單序號空白;無法刪除");
          }           
          sale_detail_del(up_id , id); // sale_detail.js     
          // app.dialog.alert('Thanks, item removed!');
        });        
      },
      pageReinit:function (e, page) { // 每次頁面重新載入
        sale_detail_chg_page_infomation(); // sale_detail.js            
      },      
      pageBeforeOut:function (e, page) { // 每次頁面重新載入
        // alert("pageBeforeOut"); // sale_detail.js            
      },                  
    }        
  },     
  {
    path: '/sale_detail_edit/',
    templateUrl: './kycgold/pages/sale_detail_edit.html',
    on: {
      pageInit: function (e, page) {
        $$('#sale_detail_edit_sacn').on('click', function () {
          sale_detail_edit_sacn(); // sale_detail_edit.js  
        });  
        $$('#sale_detail_edit_save').on('click', function () {
          var op = $$(this).attr('data-op');
          var id = $$(this).attr('data-id');     
          sale_detail_edit_save(op , id);  // sale_detail_edit.js  
        });   
      },
    }    
  },          
  {
    path: '/sale_detail_bill/',
    url: './kycgold/pages/sale_detail_bill.html',
    on: {    
      pageInit: function (e, page) {
        $$('.signature').on('click', function () { // 簽名
          signature(); // sale_detail_bill.js
        });  
             
        $$('.connectPrint').on('click', function () { // 連接印表機
          connectPrint(); // sale_detail_bill.js
        });  

        $$('.startPrintBill').on('click', function () { // 開始印表
          startPrintBill(); // sale_detail_bill.js
        });  
      },      
      pageBeforeIn:function (e, page) { // 每次頁面重新載入
        // let items = $$('.page[data-name="sale_detail"] ul');      
        showBillData(); // sale_detail_bill.js 將帳單顯示在畫面上   
      },  
    }             
  },   
  {
    path: '/product/',
    url: './kycgold/pages/product.html',
  },     
  {
    path: '/product_detail/',
    templateUrl: './kycgold/pages/product_detail.html',
    options: {},
    on: {
      pageInit: function (e, page) {
      },
    }
  },         
  {
    path: '(.*)',
    url: './kycgold/pages/404.html',
  },
];

