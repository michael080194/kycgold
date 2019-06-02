var product = {};

function scanBarcode(){
 cordova.plugins.barcodeScanner.scan(
   function (result) {
     $$('.barcode1').val(result.text);
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

function scanBarcode_xx(sub_barcode , sub_op){
 // var barcode1 = $$('.barcode1').val(); 
 // alert(barcode1);
  app.preloader.show();  
  var pass0 = {};
  pass0.op  = sub_op; // "scanBarcode" ;  // "prod_detail" or "scanBarcode"
  pass0.prod_id  = "4906938857135"; // sub_barcode; 

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
      // for (var key in product) {
      //     var obj = product[key];
      //     for (var prop in obj) {
            // console.log(prop + " = " + obj[prop]);
      //     }
      // }
      app.preloader.hide();

     },
   complete:function(xhr, status) {
       routes[6].options.context = { productArray: product[0] };
       app.views.main.router.navigate("/product_detail/");
       app.preloader.hide();
     },   
   error:function(xhr, status) {
       kyc_warnning("barcode.js 連線錯誤")
     }
 })    
}