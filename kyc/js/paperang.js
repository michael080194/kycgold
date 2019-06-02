/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var device_name = "00:15:83:D1:04:C7"; // 存放 scan 後所得到的 device name
var font_size = 16; // PAPERANG 列印時字體大小
function  paperangRegister() {
 window.PaperangAPI.register(
     function(message) {
      if (message == "OK") {
         paperangScan();
         // paperangConnect();
      }
     },
     function(error) {
      alert("paperangRegister Error: " + error);
     }
 );

}

function paperangScan() {
 device_name = "";
 window.PaperangAPI.scan(
     function(message) {
      for (var key in message){
         if(key = "deviceList"){
           var obj2 = message[key]; 
           for (var key2 in obj2){
              var obj3 =  obj2[key2];
              device_name = obj3.name;
            //   alert(obj3.name + "==" + obj3.address); 
           }
         }
       }                 
    //    alert(device_name);
     },
     function(error) {
      alert("paperangScan Error: " + error);
     }
 );
}

function paperangConnect() {
//  alert("connectButton click")
if(device_name == ""){
   alert("connect failure")
   return false;
} else {
    // alert("connect To:" + device_name) 
}
 window.PaperangAPI.connect(
     "00:15:83:D1:04:C7",
     function(message) {
      alert("paperangConnect: " + device_name + " " + message); 
     },
     function(error) {
      alert("paperangConnect Error:" + error);
     }
 );
}

function paperangDisconnect() {
 alert("disconnectButton click")
 window.PaperangAPI.disconnect(
     function(message) {
      alert("paperangDisconnect: " + message);
     },
     function(error) {
      alert("paperangDisconnect Error: " + error);
     }
 );
}

function paperangPrintImage() {
    if (device_name == "") {
       alert("印表機未啓動");  
       return false;
    } else {
        alert("paperangPrintImage:" + device_name);  
    }
    var data = {
        "飯團": { "qty":"1", "price":"50" },
        "漢堡": { "qty":"2", "price":"20" }, 
        "土司": { "qty":"3", "price":"30" },  
        "蛋餅": { "qty":"4", "price":"40" }  
        };    
    getDataUriByImage(data , 'kyc/image/blank.png', function(dataUri) {
        var base64Image = "data:image/png;base64,"+dataUri;
        window.PaperangAPI.print(
            base64Image,
            function(message) {
                alert("paperangPrintImage: " + message);
            },
            function(error) {
                alert("paperangPrintImage Error: " + error);
            }
        );    
    }); 
    paperangPrintSingnature(); // 列印客戶簽名
}

function getDataUriByImage(data , url, callback) {
    var image = new Image();
    image.onload = function () {
        /*
        var data = {
            "飯團": { "qty":"1", "price":"50" },
            "漢堡": { "qty":"2", "price":"20" }, 
            "土司": { "qty":"3", "price":"30" },  
            "蛋餅": { "qty":"4", "price":"40" }  
            };
        */    
        var wk_height = 2;  
        $.each(data, function(key,val) {    
            wk_height += font_size + 8                              
        });    
        // alert("wk_height=" + wk_height)
        // return false;                  
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = wk_height; // this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);
        canvas.getContext('2d').fillStyle = '#ff0000';
        canvas.getContext('2d').font = font_size + "px Arial";
        var i = 1;  
        /*         
        $.each(data, function(key,val) {             
            var name1 = key   
            var qty = val.qty
            var price = val.price  
            getDataUriByImageGeneralText(i,canvas.getContext('2d'),name1,qty,price); 
            i++;                           
        });   
        */ 
        $.each(data, function(key,val) {             
            // alert(val.name + ":" + val.qty + ":" + val.price); 
            var name1 = val.name
            var qty = val.qty
            var price = val.price  
            getDataUriByImageGeneralText(i,canvas.getContext('2d'),name1,qty,price); 
            i++;                   
        });           
        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}
function getDataUriByImageGeneralText(sub_count , sub_obj, sub_name , sub_qty , sub_price) {
    var wk_space = (sub_count-1)*8 + 4; 
    var wk_data = sub_qty + "*" + sub_price + "=" + (sub_qty * sub_price);
    // alert(sub_name + "=" + wk_data);
    sub_obj.fillText(sub_name , 0  , (font_size * sub_count)+wk_space);  
    sub_obj.fillText(wk_data , 160 , (font_size * sub_count)+wk_space);      
}



function testPromise(data) { 
    Promise1().then(function(message){
        // alert("2222:"+message);
        return Promise2();     
    }).catch(function(message){
        alert(message);
    }).then(function(message){
        // alert("3333:"+message);
        return Promise3();     
    }).catch(function(message){
        alert(message);
    }).then(function(message){
        app.preloader.hide();
        return Promise4(data);  
    }).catch(function(message){
        alert(message);
    }).then(function(message){
        // app.preloader.hide();
    }).catch(function(message){
        alert(message);
    })
}
function Promise1(){
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
 
function Promise2(){
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

function Promise3(){
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

function Promise4(data){
    return new Promise(function(resolve, reject){
        /*
        var data = {
            "飯團": { "qty":"1", "price":"50" },
            "漢堡": { "qty":"2", "price":"20" }, 
            "土司": { "qty":"3", "price":"30" },  
            "蛋餅": { "qty":"4", "price":"40" }  
            }; 
        */               
        getDataUriByImage(data , 'kyc/image/blank.png', function(dataUri) {
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

function getDataUriByImageBk1(url, callback) {
    var image = new Image();
    image.onload = function () {
        var data = {
            "01": "親愛的小紅帽",
            "02": "母親節 Happy"
            };
        var wk_height = 2;  
        $.each(data, function(key,val) {    
            wk_height += font_size + 8                              
        });    
        // alert("wk_height=" + wk_height)
        // return false;                  
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = wk_height; // this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);
        canvas.getContext('2d').fillStyle = '#ff0000';
        canvas.getContext('2d').font = font_size + "px Arial";
        var i = 1;           
        $.each(data, function(key,val) {             
            var wktitle = val;
            var wk_space = (i-1)*8 + 4 ; 
            canvas.getContext('2d').fillText(wktitle , 0  , (font_size * i)+wk_space); 
            i++;                           
        });    
        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
        callback(canvas.toDataURL('image/png'));
    };
    image.src = url;
}