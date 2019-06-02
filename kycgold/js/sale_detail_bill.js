var device_name = "00:15:83:D1:04:C7"; // 存放 scan 後所得到的 device name
var Paperang_addr = "00:15:83:D1:04:C7"; // 存放 scan 後所得到的 device name
var font_size = 16; // PAPERANG 列印時字體大小
var base64Image = ""; // Canvas  銷貨單
function connectPrint() { 
    app.preloader.show();
    connectPrint_1().then(function(message){
        return connectPrint_2();     
    }).catch(function(message){
        app.preloader.hide();
        alert(message);
    }).then(function(message){
        return connectPrint_3();     
    }).catch(function(message){
        app.preloader.hide();  
        alert(message);
    }).then(function(message){
        $$('.startPrintBill').css("background-color" , "#007aff").removeAttr('disabled');
        app.preloader.hide();
    }).catch(function(message){
        app.preloader.hide();
        alert(message);
    })
}

function connectPrint_1(){
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

function connectPrint_2(){
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

function connectPrint_3(){
 return new Promise(function(resolve, reject){
     window.PaperangAPI.connect(
        Paperang_addr,
         function(message) {
             resolve("印表機連接成功");
         },
         function(error) {
             reject("印表機連接失敗"); 
         }
     ); 
 });
};

function showBillData(){
    var params = {};
    params.company_id = golbalCompanyId;    
    params.target = "phone_a01_sale_head";            
    params.op = "get_single_id";    
    params.id = currentSale.id;  
    app.request( {
      url: url1,
      data: params,
      method: "POST",
      beforeSend:function(xhr) {
        app.preloader.show();
       },              
      success: function(response) {
       var data1 = JSON.parse(response);   
       if(data1["responseStatus"] == "SUCCESS"){
           sale_detail_bill_data = showBillDataGenData(data1["responseArray"]);  // 產生帳單之資料  sale_detail_bill.js  
           showBillOnPage(); // 將帳單顯示在畫面上   sale_detail_bill.js  
           app.preloader.hide();           
       } else {
         kyc_warnning("sale_bill.js 資料抓取失敗");
       }
    
      },    
      complete: function() {
        app.preloader.hide();      
      },
      error: function(xhr,status) {
        app.preloader.hide();      
        kyc_warnning("sale_bill.js 連線失敗02");
      }
    })  // 
}

function showBillDataGenData(data){  // 產生帳單之資料
    app.preloader.show();
    let items = $$('.page[data-name="sale_detail"] ul li');  
    let countItems = items.length;
    var arr1 = new Array()
    var obj1 = {};    
    obj1.company_name = "冠宇銀樓股份有限公司台南中正分店";   
    obj1.report_name  = "　　　　　銷貨單　　　　　";  
    obj1.report_line  = "　　　　　=====　　　　　"; 
    obj1.cust_name    = "客戶:" + data[0].c_name; 
    obj1.datewk       = "日期:" + data[0].datewk;      
    if(data[0].c_remark != "") obj1.c_remark      = "備註:" + data[0].c_remark;        
    obj1.c_price      = "每日金價:" + data[0].c_price;    
    obj1.line         = "-".repeat(50); // 分隔線　          
    arr1.push(obj1);              
    for (let i = 0; i < countItems; i++) {
        let a2 = items.eq(i).find('.item-subtitle');
        let a3 = items.eq(i).find('.item-title');   

        obj1 = {};        
        obj1.partno = "產品：" + a3.eq(0).text().split("產品編號：")[1]; // 產品編號        
        obj1.descrp = a2.eq(0).text(); // 品名               
        obj1.weight = a2.eq(1).text(); // 重量         
        obj1.amount = a2.eq(2).text(); // 金價
        obj1.c_wage = a2.eq(3).text(); // 工資
        obj1.c_amt  = a2.eq(4).text(); // 小計
        obj1.c_qty  = a2.eq(5).text(); // 數量        
        if(parseInt(a2.eq(5).text().split("數量：")[1]) > 1){
            obj1.c_total = a2.eq(6).text(); // 合計  
        } 
        
        if(a2.eq(7).text().split("備註：")[1] != "") obj1.c_remark = a2.eq(7).text(); // 備註
        // obj1.id = a2.eq(8).text(); // 序號　  
        obj1.line = "-".repeat(50); // 分隔線　           
        arr1.push(obj1);   
    }    

    if(data[0].c_count > 1) {
        let wxweight = weightTrans(parseInt(data[0].weight_1),parseInt(data[0].weight_2),parseInt(data[0].weight_3),parseInt(data[0].weight_4) );      

       obj1 = {};  
       obj1.weight    = "重量合計:" + wxweight;         
       obj1.amount    = "金價合計:" + data[0].amount;  
       obj1.c_wage    = "工資合計:" + data[0].c_wage;  
       obj1.c_total   = "合計金額:" + (parseInt(data[0].amount) + parseInt(data[0].c_wage));   
       arr1.push(obj1);                              
    }   

    data.arr1 = arr1;
    app.preloader.hide();
    return data;
};

function showBillOnPage(){  // 將帳單顯示在畫面上 
    genSaleDetailCanvas(sale_detail_bill_data , 'kycgold/image/blank.png', function(dataUri) {
        let base64Image = "data:image/png;base64,"+dataUri;
        
    }); 
};

function startPrintBill(){  // 開始列印帳單
    return new Promise(function(resolve, reject){     
        genSaleDetailCanvas(sale_detail_bill_data , 'kycgold/image/blank.png', function(dataUri) {
               let base64Image = "data:image/png;base64,"+dataUri;
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
}

function genSaleDetailCanvas(data , url, callback) {
 var image = new Image();
 image.onload = function () {
    //  var wk_height = 2 + 48 ;  
    var wk_height = 2  ;   
     for (let items in data.arr1) {
        for (let key in data.arr1[items]) {    
        wk_height += font_size + 3
        }
     }  

     var canvas = document.getElementById("printCanvas");     
    //  canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
     canvas.height = wk_height ; // this.naturalHeight; // or 'height' if you want a special/scaled size

     canvas.getContext('2d').drawImage(this, 0, 0);
     canvas.getContext('2d').fillStyle = '#ff0000';
     canvas.getContext('2d').font = font_size + "px Arial";
     var i = 1;  

     for (let items in data.arr1) {
        for (let key in data.arr1[items]) {    
           let printData = data.arr1[items][key];
           genSaleDetailCanvasText(i,canvas.getContext('2d'),printData , ""); 
           i++;               
        }
    }          
     callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
     callback(canvas.toDataURL('image/png'));
 };

 image.src = url;
}

function genSaleDetailCanvasText(sub_count , sub_obj, sub_name , sub_data) {
//    var wk_space = (sub_count-1)*8 + 4; 
   var wk_space = (sub_count-1)*3 ; 
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

function signature(){
 var Signature = cordova.require('nl.codeyellow.signature.Signature');
 Signature.getSignature(
     function (imgData) {
        /* This is the "success" callback. */
        screen.orientation.lock('portrait'); // 直                 
        if (!imgData) return; // User clicked cancel, we got no image data.
         var myCanvas = document.getElementById('myCanvas'),
         ctx = myCanvas.getContext('2d');
         myCanvas.width = imgData.width;
         myCanvas.height = imgData.height;
         ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
         ctx.putImageData(imgData, 0, 0);
         convertCanvasToImage(myCanvas);
     }, function (msg) {
        /* This is the "error" callback. */
         alert('Could not obtain a signature due to an error: '+msg);
     },
     {
         title: 'Please put your signature down below',
     });
}    

function convertCanvasToImage(subCanvas) {
 var image = document.getElementById('singnatureImg2');
 image.src = subCanvas.toDataURL("image/png");
 $$('#singnatureImg2').css("display","block");
 return image;
}