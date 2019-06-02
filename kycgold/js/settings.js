function settings_save(){ //儲存 系統設定參數
 localStorage.company_id = $$('.page[data-name="settings"] input[name="company_id"]').val(); // 公司代碼 
 localStorage.uname = $$('.page[data-name="settings"] input[name="uname"]').val(); // 使用者帳號;
 localStorage.pass = $$('.page[data-name="settings"] input[name="pass"]').val(); // 使用者密碼;
 golbalCompanyId = $$('.page[data-name="settings"] input[name="company_id"]').val(); // 公司代碼 
}

function setupRestore(){ //儲存 系統設定參數
 var company_id = localStorage.company_id; 
 var uname = localStorage.uname;
 var pass = localStorage.pass;
 golbalCompanyId = company_id; // 公司代碼  
}