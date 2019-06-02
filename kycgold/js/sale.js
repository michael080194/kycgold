function sale_del(id){ 
 var params = {};
 params.company_id = golbalCompanyId;     
 params.target = "phone_a01_sale_head";       
 params.op = "del";    
 params.id = id;  
 app.request( {
   url: url1,
   data: params,
   method: "POST",
   beforeSend:function(xhr) {
    app.preloader.show();
   },           
   success: function(response) {
    var data1 = JSON.parse(response);   
    if(data1["responseStatus"] == "FAIL")kyc_warnning("sale_detail.js 資料刪除失敗");
    app.preloader.hide();
   },    
   complete: function() {
    app.preloader.hide();
   },
   error: function(xhr,status) {
     app.preloader.hide();
     kyc_warnning("sale_head.js 連線錯誤");
   }
 })  // end of app.request  
}     

function sale_head_get_single_id(id){
  var params = {};
  params.company_id = golbalCompanyId;    
  params.target = "phone_a01_sale_head";            
  params.op = "get_single_id";    
  params.id = id;  
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
        var productSale={};
        let data2 = data1["responseArray"];   // if  SUCCESS return content array     
        for (var key in data2) {
            var obj = data2[key];
            for (var key1 in obj) {
             var val = obj[key1];
             productSale[key1] = obj[key1];
            }
         }
         productSale.op = "update";     
         app.preloader.hide();           
         app.views.main.router.navigate("/sale_head_edit/", { context: productSale});
     } else {
       kyc_warnning("sale_detail.js 資料抓取失敗");
     }
  
    },    
    complete: function() {
      app.preloader.hide();      
    },
    error: function(xhr,status) {
      app.preloader.hide();      
      kyc_warnning("sale_detail.js 連線失敗02");
    }
  })  // end of app.request    
}

function sale_chg_page_infomation(){
  let objCount =  Object.keys(saleResponseArray).length;
  if(saleResponseArray.op == "insert"){
    sale_append_li(saleResponseArray);
    return false;
  }
  // 抓取原來之 li a 位置 , 並改變其值
  // alert(currentSale.id);
  let a1 = $$('.page[data-name="sale"] ul li a[data-id="'+ currentSale.id + '"]');  
  let a2 = a1.find('.item-subtitle');  
  if(objCount == 8){ // 修改銷貨明細檔後的更新
      let a3 = a1.find('.badge');    
      a3.eq(0).text(saleResponseArray.c_count);  
      let weight_1 = saleResponseArray.weight_1;
      let weight_2 = saleResponseArray.weight_2;
      let weight_3 = saleResponseArray.weight_3;
      let weight_4 = saleResponseArray.weight_4;
      let wxweight=weightTrans(parseInt(weight_1),parseInt(weight_2),parseInt(weight_3),parseInt(weight_4));

      a2.eq(2).text("重量合計："+wxweight);           
      a2.eq(3).text("金價合計："+saleResponseArray.amount);    
      a2.eq(4).text("工資合計："+saleResponseArray.c_wage);    
      a2.eq(5).text("金額合計："+(parseInt(saleResponseArray.c_wage) + parseInt(saleResponseArray.amount)));  
  }     
  if(objCount == 5){ // 修改銷貨彙總檔後的更新
    let a3 = a1.find('.item-title');        
    a3.eq(0).text("客戶："+saleResponseArray.c_name);           
    a2.eq(0).text("銷貨日期："+saleResponseArray.datewk);    
    a2.eq(1).text("每日金價：$"+saleResponseArray.c_price);    
    a2.eq(6).text("銷貨備註："+saleResponseArray.c_remark);  
}       
}  

function sale_append_li(a){
  let a1 = $$('.page[data-name="sale"] ul ');   
  let wxweight=weightTrans(parseInt(a.weight_1),parseInt(a.weight_2),parseInt(a.weight_3),parseInt(a.weight_4));  
  var e1 = "";
  e1 +=  '<li class="swipeout  deleted-callback">';
  e1 +=  '    <a href="#" class="item-link item-content" data-id=' + a.id + '>';
  e1 +=  '      <div class="item-inner">';
  e1 +=  '        <div class="item-title-row">';
  e1 +=  '          <div class="item-title">客戶：' + a.c_name + '</div>';
  e1 +=  '          <div class="item-after"> <span class="badge">0</span></div> ';
  e1 +=  '        </div>';
  e1 +=  '        <div class="item-subtitle">銷貨日期：' + a.datewk + '</div>';
  e1 +=  '        <div class="item-subtitle">每日金價：'+ a.c_price + '</div>';    
  e1 +=  '        <div class="item-subtitle">重量合計：</div>';  
  e1 +=  '        <div class="item-subtitle">金價合計：</div>';
  e1 +=  '        <div class="item-subtitle">工資合計：</div>';
  e1 +=  '        <div class="item-subtitle">金額合計：</div>';
  e1 +=  '        <div class="item-subtitle">銷貨備註：' + a.c_remark + '</div>';
  e1 +=  '        <div class="item-subtitle">銷貨單號：' + a.id + '</div>';
  e1 +=  '      </div>';
  e1 +=  '    </a>';
  e1 +=  '    <div class="swipeout-actions-left">';
  e1 +=  '      <a href="#" class="changeHead color-green" data-id=' + a.id+ ' onclick="sale_head_get_single_id(' + a.id+ ')">修改</a>'; 
  e1 +=  '      <a href="#" class="deleteHead color-red" data-id=' + a.id+ ' onclick="sale_head_del(' + a.id+ ')">刪除</a>';              
  // e1 +=  '      <a href="#" data-confirm="確定刪除嗎?" class="swipeout-delete" >刪除</a>';
  e1 +=  '    </div>';                
  e1 +=  '</li>';   

  a1.prepend(e1);

  let a2 = $$('.page[data-name="sale"] ul ');   

}
function sale_head_del(id){
  alert("del:" + id);
}