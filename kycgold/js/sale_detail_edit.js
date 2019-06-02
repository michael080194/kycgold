function sale_detail_edit_save(op , id){
 var up_id  = currentSale.id;  // 銷貨單號
 var c_name = currentSale.c_name ; // 目前客戶名稱  
 var datewk = currentSale.datewk ; // 銷貨日期   
 var c_price = currentSale.c_price ; // 每日金價         
 var partno = $$('.page[data-name="sale_detail_edit"] input[name="partno"]').val(); // 產品編號
 var descrp = $$('.page[data-name="sale_detail_edit"] input[name="description"]').val(); // 產品說明
 var amount = $$('.page[data-name="sale_detail_edit"] input[name="amount"]').val(); // amount 
 var c_wage = $$('.page[data-name="sale_detail_edit"] input[name="c_wage"]').val(); // 工資 
 var c_qty  = $$('.page[data-name="sale_detail_edit"] input[name="c_qty"]').val();  // 銷貨數量
 var c_remark  = $$('.page[data-name="sale_detail_edit"] input[name="c_remark"]').val();  // 備註 

 var c_cost    = $$('.page[data-name="sale_detail_edit"] input[name="c_cost"]').val();  // 單位成本 
 var weight_1  = $$('.page[data-name="sale_detail_edit"] input[name="weight_1"]').val();  // 重量--兩  
 var weight_2  = $$('.page[data-name="sale_detail_edit"] input[name="weight_2"]').val();  // 重量--錢  
 var weight_3  = $$('.page[data-name="sale_detail_edit"] input[name="weight_3"]').val();  // 重量--分  
 var weight_4  = $$('.page[data-name="sale_detail_edit"] input[name="weight_4"]').val();  // 重量--厘   

 if(partno == ""){
  kyc_warnning("產品編號 不可空白"); 
  return false;
 }

 
 var data = {};
 data.up_id = up_id;    
 data.c_name = c_name;    
 data.datewk = datewk;  
 data.partno = partno;
 data.c_price = c_price;     
 data.amount = amount;   
 data.c_wage = c_wage;
 data.c_qty  = c_qty;
 data.c_remark = c_remark; 
 data.c_cost = c_cost;   
 data.weight_1 = weight_1;    
 data.weight_2 = weight_2;    
 data.weight_3 = weight_3;    
 data.weight_4 = weight_4;       
 

//  saleDetailResponseArray.descrp = "aaa";

 var params = {};
 params.company_id = golbalCompanyId; 
 params.up_id = up_id;    
 params.id = id;     
 params.partno = partno;      
 params.target = "phone_a01_sale_detail";    
 if (op == "update" ){
   params.op = "update";    
 } else {
   op = "insert" ; 
   params.op = "insert";    
 }       

 params.uploaddata = JSON.stringify(data); 
 app.request( {
   url: url1,
   data: params,
   method: "POST",
   beforeSend:function(xhr) {
    app.preloader.show();
   },          
   success: function(response) {
    var data1 = JSON.parse(response);   
    if(data1["responseStatus"] == "FAIL")kyc_warnning("sale_detail_edit.js 資料新增失敗");
      saleDetailResponseArray = {}; 
      saleDetailResponseArray = data; // 修改銷貨明細頁面用
      if(op == "insert"){
        saleDetailResponseArray.id = data1['responseMessage'];  // 新增回傳 new id  
      }    
      saleDetailResponseArray.op = op;      
      saleDetailResponseArray.descrp = descrp;

      saleResponseArray = {}; 
      saleResponseArray = data1['responseArray'];// 修改銷貨彙總頁面用
     app.preloader.hide();    
     $$('#saleDetailEdit001').click();                   
   },    
   complete: function() {
    app.preloader.hide();    
   },
   error: function(xhr,status) {
     app.preloader.hide();    
     kyc_warnning("sale_detail_edit.js 連線失敗");
   }
 })  // end of app.request        

}


function sale_detail_edit_sacn(){
  var product = {};
  var wxpartno = "10119010004";
  // var wxpartno = "10219010002"; 
  // var wxpartno = "10219010001";    

  $$('.page[data-name="sale_detail_edit"] input[name="partno"]').val(wxpartno)  
  scanBarcode_xx(wxpartno , "scanBarcode");

  return false;
  
 cordova.plugins.barcodeScanner.scan(
   function (result) {
     $$('.page[data-name="sale_detail_edit"] input[name="partno"]').val(result.text);    
     scanBarcode_xx(result.text , "scanBarcode");
   },
   function (error)  {
         alert("掃描失敗");
   },
   {
       "preferFrontCamera" : false, // iOS and Android
       "showFlipCameraButton" : true, // iOS and Android
       "showTorchButton" : true, // iOS and Android
       "disableAnimations" : true, // iOS
       "prompt" : "請將條碼置於掃描區", // supported on Android only
   }
 );

}

function scanBarcode_xx(sub_barcode){
 // var barcode1 = $$('.barcode1').val(); 
 // alert(barcode1);
  app.preloader.show();  
  var pass0 = {};
  pass0.target = "a00_mstock";      
  pass0.op       = "barcode"; // "scanBarcode" ;  // "prod_detail" or "scanBarcode"
  pass0.company_id = golbalCompanyId;  // sub_barcode; 
  pass0.partno = sub_barcode;  // sub_barcode; 

 app.request({
   url: url1,
   method:"POST",
   data:pass0,
   beforeSend:function(xhr) {
       app.preloader.show();
     },
   success:function(data, xhr, status) {
      var data1 = JSON.parse(data);
      product= data1["responseArray"];   // if  SUCCESS return content array      
      for (var key in product) {
          var obj = product[key];
          $$('.page[data-name="sale_detail_edit"] input[name="description"]').val(obj["descrp"]);  
          $$('.page[data-name="sale_detail_edit"] input[name="c_cost"]').val(obj["c_total"]);           
          $$('.page[data-name="sale_detail_edit"] input[name="weight_1"]').val(obj["weight_1"]); 
          $$('.page[data-name="sale_detail_edit"] input[name="weight_2"]').val(obj["weight_2"]); 
          $$('.page[data-name="sale_detail_edit"] input[name="weight_3"]').val(obj["weight_3"]); 
          $$('.page[data-name="sale_detail_edit"] input[name="weight_4"]').val(obj["weight_4"]);                                    

          var weight = "";       
          if (obj["weight_1"] > 0) weight = weight + obj["weight_1"] + "兩" ; 
          if (obj["weight_2"] > 0) weight = weight + obj["weight_2"] + "錢" ; 
          if (obj["weight_3"] > 0) weight = weight + obj["weight_3"] + "分" ; 
          if (obj["weight_4"] > 0) weight = weight + obj["weight_4"] + "厘" ;  
          var wxtotal = (parseInt(obj["weight_1"]) * 10) + parseInt(obj["weight_2"]) + formatFloat(parseInt(obj["weight_3"] ) / 10 ,2) + formatFloat(parseInt(obj["weight_4"]) / 100 ,3);

          // currentSale.c_price ; // 每日金價
          var wxprice = wxtotal * currentSale.c_price;
          $$('.page[data-name="sale_detail_edit"] input[name="amount"]').val(wxprice);           
          $$('.page[data-name="sale_detail_edit"] input[name="weight"]').val(weight);  
          $$('.page[data-name="sale_detail_edit"] input[name="c_qty"]').val(1);
          $$('.page[data-name="sale_detail_edit"] input[name="c_wage"]').val(parseInt(obj["c_wage"]));     

          $$('.page[data-name="sale_detail_edit"] input[name="c_amt"]').val(wxprice + parseInt(obj["c_wage"]));   
          $$('.page[data-name="sale_detail_edit"] input[name="c_total"]').val(wxprice + parseInt(obj["c_wage"]));                               
      }
      app.preloader.hide();

     },
   complete:function(xhr, status) {
       // routes[6].options.context = { productArray: product[0] };
       // app.views.main.router.navigate("/product_detail/");
       app.preloader.hide();
     },   
   error:function(xhr, status) {
       app.preloader.hide();    
       kyc_warnning("sale_detail_edit.js 連線錯誤");
     }
 })    
}
