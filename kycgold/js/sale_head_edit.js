function sale_head_edit_save(op , id){
 var name = $$('.page[data-name="sale_head_edit"] input[name="name"]').val();
 // var date1 = $$('.page[data-name="sale"] input[name="date"]').val();
 var date1 = $$('#date1').val();
 var c_price = $$('.page[data-name="sale_head_edit"] input[name="c_price"]').val();  
 var c_remark = $$('.page[data-name="sale_head_edit"] input[name="c_remark"]').val();           
 if(name == ""){
  kyc_warnning("客戶名稱不可空白"); 
  return false;
 }
 if(date1 == ""){
  kyc_warnning("銷貨日期不可空白"); 
  return false;
 } 
 if(c_price == 0){
  kyc_warnning("每日金價不可為0"); 
  return false;
 }  

 var data = {};
 data.c_name = name;    
 data.datewk = date1;    
 data.c_price = c_price;  
 data.c_remark = c_remark;     

 var params = {};
 params.company_id = golbalCompanyId;          
 params.target = "phone_a01_sale_head"; 
 params.id = id;       
 if (op == "update" ){
  params.op = "update";    
} else {
  op = "insert" ;   
  params.op = "insert";    
}       
 params.uploaddata = JSON.stringify(data); 
 params.keyvalue= ""; 
 app.request( {
   url: url1,
   // dataType: 'json',
   data: params,
   method: "POST",
   beforeSend:function(xhr) {
    app.preloader.show();
   },            
   success: function(response) {
    var data1 = JSON.parse(response);   
    if(data1["responseStatus"] == "FAIL")kyc_warnning("sale_head_edit.js 資料處理失敗");    
    saleResponseArray = {}; 
    saleResponseArray = data;
    if(op == "insert"){
      saleResponseArray.id = data1['responseMessage'];  // 新增回傳 new id  
    }    
    saleResponseArray.op = op;          
    app.preloader.hide();    
    $$('#sale_head_edit001').click();                   
   },    
   complete: function() {
    app.preloader.hide();     
   },
   error: function(xhr,status) {
    app.preloader.hide();     
    kyc_warnning("sale_head_edit.js 連線錯誤");
   }
 })  // end of app.request        

}