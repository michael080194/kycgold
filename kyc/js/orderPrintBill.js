var device_name = "00:15:83:D1:04:C7"; // 存放 scan 後所得到的 device name
var font_size = 16; // PAPERANG 列印時字體大小
function printBill(data) { 
 printBill_1().then(function(message){
     return printBill_2();     
 }).catch(function(message){
     app.preloader.hide();
     alert(message);
 }).then(function(message){
     return printBill_3();     
 }).catch(function(message){
     app.preloader.hide();  
     alert(message);
 }).then(function(message){
     app.preloader.hide();
     return printBill_4(data);  
 }).catch(function(message){
     app.preloader.hide();
     alert(message);
 }).then(function(message){
 }).catch(function(message){
     alert(message);
 })
}

function printBill_1(){
 return new Promise(function(resolve, reject){
     window.PaperangAPI.register(
         function(message) {
          if (message == "OK") {
             resolve("register OK");
          } else {
             reject("印表機初使化失敗111"); 
          }
         },
         function(error) {
             reject("印表機初使化失敗"); 
         }
     );        
 });
};

function printBill_2(){
 return new Promise(function(resolve, reject){
     window.PaperangAPI.scan(
         function(message) {
          for (var key in message){
             if(key = "deviceList"){
               var obj2 = message[key]; 
               for (var key2 in obj2){
                  var obj3 =  obj2[key2];
                  device_name = obj3.name;
               }
             }
           }                 
             if (device_name != "") {
                 resolve("scan OK");
             } else {
                 reject("印表機偵測失敗"); 
             }
         },
         function(error) {
             reject("印表機偵測失敗"); 
         }
     );
 });
};

function printBill_3(){
 return new Promise(function(resolve, reject){
     window.PaperangAPI.connect(
         "00:15:83:D1:04:C7",
         function(message) {
             resolve("印表機連接成功");
         },
         function(error) {
             reject("印表機連接失敗"); 
         }
     ); 
 });
};

function printBill_4(data){
 return new Promise(function(resolve, reject){     
  printOrderDetail(data , 'kyc/image/blank.png', function(dataUri) {
         var base64Image = "data:image/png;base64,"+dataUri;
         window.PaperangAPI.print(
             base64Image,
             function(message) {
                 resolve("paperangPrintImage: " + message);
             },
             function(error) {
                 reject("paperangPrintImage Error: " + error);
             }
         );    
     }); 
     paperangPrintSingnature(); // 列印客戶簽名
 });
};

function printOrderDetail(data , url, callback) {
 var image = new Image();
 image.onload = function () {
     var wk_height = 2 + 48 ;  
     $.each(data, function(key,val) {    
         wk_height += font_size + 8                              
     });    
     var canvas = document.createElement('canvas');
     canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
     canvas.height = wk_height; // this.naturalHeight; // or 'height' if you want a special/scaled size

     canvas.getContext('2d').drawImage(this, 0, 0);
     canvas.getContext('2d').fillStyle = '#ff0000';
     canvas.getContext('2d').font = font_size + "px Arial";
     var i = 1;  
     $.each(data, function(key,val) {             
         var name1 = val.name
         var qty = val.qty
         var price = val.price  
         var wk_data = qty + "*" + price + "=" + (qty * price);         
         printOrderDetailText(i,canvas.getContext('2d'),name1 , wk_data); 
         i++;                   
     });   

     var wk_total = "合計 $ " + $$('.total-price-sured > span').text() + "元";

     printOrderDetailText(i+1,canvas.getContext('2d'), "" , wk_total); 
     i++;  

     callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
     callback(canvas.toDataURL('image/png'));
 };

 image.src = url;
}
function printOrderDetailText(sub_count , sub_obj, sub_name , sub_data) {
   var wk_space = (sub_count-1)*8 + 4; 
   sub_obj.fillText(sub_name , 0  , (font_size * sub_count)+wk_space);  
   if(sub_name !== ""){
     sub_obj.fillText(sub_data , 160 , (font_size * sub_count)+wk_space);    
   } else {
     sub_obj.fillText(sub_data , 120 , (font_size * sub_count)+wk_space);    
   }
  
}

function paperangPrintSingnature() {
 // var imgxx1 = "kyc/image/rose.jpeg";
 // var imgxx1 = $$('#singnatureImg2').attr("data-src");
 var image = document.getElementById('singnatureImg2');
 var imgxx1 = image.src
 toDataURL(imgxx1, function(dataUrl) {
     window.PaperangAPI.print(
         dataUrl,
             function(message) {
                 console.log("Message: " + message);
             },
             function(error) {
                 console.log("Error: " + error);
             }
     );             
 })

}

function toDataURL(url, callback) {
 var httpRequest = new XMLHttpRequest();
 httpRequest.onload = function() {
    var fileReader = new FileReader();
       fileReader.onloadend = function() {
          callback(fileReader.result);
       }
       fileReader.readAsDataURL(httpRequest.response);
 };
 httpRequest.open('GET', url);
 httpRequest.responseType = 'blob';
 httpRequest.send();
}
