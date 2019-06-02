function sale_detail_del(up_id , id){ 
 var params = {};
 params.company_id = golbalCompanyId;  
 params.target = "phone_a01_sale_detail";             
 params.op = "del";    
 params.up_id = up_id; 
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
     saleResponseArray =  data1["responseArray"];    
     app.preloader.hide();    
     $$('#saleDetail001').click();                   
   },    
   complete: function() {
    app.preloader.hide();     
   },
   error: function(xhr,status) {
     app.preloader.hide();     
     kyc_warnning("sale_detail.js 連線失敗01");
   }
 })  // end of app.request  
}     

function sale_detail_get_single_id(id){
  var params = {};
  params.company_id = golbalCompanyId;    
  params.target = "phone_a01_sale_detail";            
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
        var product={};
        let data2 = data1["responseArray"];   // if  SUCCESS return content array      
        for (var key in data2) {
            var obj = data2[key];
            let wxweight = weightTrans(parseInt(obj["weight_1"]),parseInt(obj["weight_2"]),parseInt(obj["weight_3"]),parseInt(obj["weight_4"]) );          
            product.weight =  wxweight;       
            product.c_amt  =  parseInt(obj.amount) + parseInt(obj.c_wage);
            product.c_total  =  Math.round(product.c_amt * parseInt(obj.c_qty)) // 
            // product.id = obj.id;     
            for (var key1 in obj) {
             var val = obj[key1];
             product[key1] = obj[key1];
            }
         }
         product.op = "update";       
         app.preloader.hide();           
         app.views.main.router.navigate("/sale_detail_edit/", { context: product});
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

function sale_detail_chg_page_infomation(){
  let objCount =  Object.keys(saleDetailResponseArray).length;
  if(saleDetailResponseArray.op == "insert"){
    sale_detail_append_li(saleDetailResponseArray);
    return false;
  }
  // 抓取原來之 li a 位置 , 並改變其值
  // alert(currentSale.id);
  let a1 = $$('.page[data-name="sale_detail"] ul li a[data-id="'+ currentSaleDetail.id + '"]');  

  let a2 = a1.find('.item-subtitle');
  let a3 = a1.find('.item-title');   
  a3.eq(0).text("產品編號："+saleDetailResponseArray.partno);     

  if(objCount > 10){ // 修改銷貨明細檔
      let wxtotal = (parseInt(saleDetailResponseArray.c_wage) + parseInt(saleDetailResponseArray.amount)) * parseInt(saleDetailResponseArray.c_qty)
      let weight_1 = saleDetailResponseArray.weight_1;
      let weight_2 = saleDetailResponseArray.weight_2;
      let weight_3 = saleDetailResponseArray.weight_3;
      let weight_4 = saleDetailResponseArray.weight_4;
      let wxweight=weightTrans(parseInt(weight_1),parseInt(weight_2),parseInt(weight_3),parseInt(weight_4));

      a2.eq(0).text("品名："+saleDetailResponseArray.descrp);                 
      a2.eq(1).text("重量："+wxweight);           
      a2.eq(2).text("金價："+saleDetailResponseArray.amount);    
      a2.eq(3).text("工資："+saleDetailResponseArray.c_wage);    
      a2.eq(4).text("小計："+(parseInt(saleDetailResponseArray.c_wage) + parseInt(saleDetailResponseArray.amount))); 
      a2.eq(5).text("數量："+saleDetailResponseArray.c_qty);   
      a2.eq(6).text("合計："+wxtotal);    
      a2.eq(7).text("備註："+saleDetailResponseArray.c_remark);   
      // a2.eq(8).text("銷貨序號："+saleDetailResponseArray.id);                              
  }     

}  

function sale_detail_append_li(a){
  let a1 = $$('.page[data-name="sale_detail"] ul ');   
  let wxtotal = (parseInt(a.c_wage) + parseInt(a.amount)) * parseInt(a.c_qty);
  let wxweight=weightTrans(parseInt(a.weight_1),parseInt(a.weight_2),parseInt(a.weight_3),parseInt(a.weight_4));  
  var e1 =  '<li  class="swipeout deleted-callback">';
  
  e1 += '<a href="#" class="item-link item-content" data-id=' + a.id + '>';
  e1 += '<div class="item-inner">';
  e1 += '<div class="item-title-row">';
  e1 += '<div class="item-title">產品編號：'  + a.partno+ '</div>';    
  e1 += '</div>';
  e1 += '<div class="item-subtitle">品名：'  + a.descrp+ '</div>';
  e1 += '<div class="item-subtitle">重量：'  + wxweight + '</div>';     
  e1 += '<div class="item-subtitle">金價：' + a.amount + '</div>';  
  e1 += '<div class="item-subtitle">工資：' + a.c_wage+ '</div>';  
  e1 += '<div class="item-subtitle">小計：' + a.c_amt+ '</div>';  
  e1 += '<div class="item-subtitle">數量：'  + a.c_qty+ '</div>';  
  e1 += '<div class="item-subtitle">合計：' + wxtotal + '</div>';
  e1 += '<div class="item-subtitle">備註：'  + a.c_remark+ '</div>';  
  e1 += '<div class="item-subtitle">銷貨序號：' + a.id+ '</div>';                         
  e1 += '</div>';  
  e1 += '</a>';  
  e1 += '<div class="swipeout-actions-left">';  
  e1 += '<a href="#" class="changeDetail color-green" data-id=' + a.id + '>修改</a> ';                  
  e1 += '<a href="#" data-confirm="確定刪除嗎?" class="swipeout-delete" >刪除</a>';  
  e1 += '</div>';                 
  e1 += '</li>';  

  a1.prepend(e1);


}