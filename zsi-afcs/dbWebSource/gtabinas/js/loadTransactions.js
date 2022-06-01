 var lt = (function(){
    var  _pub                   = {} 
        ,gSubTabName            = ""
        ,gTabName               = "" 
        ,gLoaderId              = ""
        ,gRecTranDtls           = false
        ,gHistTranDtls          = false
        ,gDaata                 = []
        ,gTabClickedRec         =  false
        ,gTabClickedHis         =  false
        ,gTot                   = 0 
        ,gLoadDate              = ""
        ,gLoadDateFromSumm      = ""
        ,gLoadDateToSumm        = ""
        ,gLoadPersonnelR        = ""
        ,gLoadPersonnelH        = ""
    ;
    
    zsi.ready = function(){ 
        $(".page-title").html("Load Transactions");
        $(".panel-container").css("min-height", $(window).height() - 200); 
        displayLoadingTransaction();  
        getFilters();
    }; 
    
    gTabName = $.trim($(".main-nav-tabs").find(".nav-link.active").text()); 
    
    gSubTabName = $.trim($(".sub-nav-tabs").find(".nav-link.active").text()); 
    
    $(".main-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
        gTabName = $.trim($(e.target).text()); 
        $(".sub-nav-tabs").find(".nav-link").removeClass("active");
        $(".sub-nav-tabs").find(".nav-item:first-child()").find(".nav-link").addClass("active"); 
        gLoaderId="";
        gSubTabName = $.trim($(".sub-nav-tabs").find(".nav-link.active").text());  
        dropDown();
        dateValidation();
        displayLoadingTransaction();   
        gLoadPersonnelR=""; 
        gLoadPersonnelH="";
    });
    
    $(".sub-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text());   
        dateValidation();
        dropDown();
        displayLoadingTransaction();  
        
    }); 
    
    _pub.displayColDtls  =  function(load_id,loadDate,LoadPersonnel){  
        if(gTabName==="Recent Transaction" ){ 
            gLoadPersonnelR = LoadPersonnel;
            gRecTranDtls = true;
            gTabClickedRec = true; 
            gTabClickedHis = false;
        }
        if(gTabName==="History Transaction"){
            gHistTranDtls = true;
            gTabClickedRec = false;
            gTabClickedHis = true; 
            gLoadPersonnelH = LoadPersonnel;
        } 
        gLoaderId = load_id;  
        gLoadDate = loadDate;
        $("#colDtlsTab").click();  
    };
    
    function dropDown(){  
        var _loadBy = 0; 
        var _o = getFilters();  
        $("#loadPersonnel").dataBind({
             sqlCode : "D1502"
            ,parameters : {client_id:app.userInfo.company_id}
            ,text   : "load_personnel"
            ,value  : "id" 
            ,selectedValue : gLoaderId
            ,onChange : function(){  
                gLoaderId = $(this).val();   
                if(gTabName=="History Transaction"){
                    if(gSubTabName=="Transaction Details"){
                        if($(this).val()===""){ 
                            gTabClickedHis=false;
                        }else{
                             gTabClickedHis=true;
                        }
                    }
                }
               
            }
            ,onComplete : function(d){}
        });  
    }
    
    function getFilters(){
        var  _start_date    = $("#startTransactionDate").val()
            ,_end_date      = $("#endTransactionDate").val()
            ,_load_by       = $("#recLPDD").val()
            ,_load_person   = $("#hisLPDD").val();
        return{
             start_date  : _start_date
            ,end_date   : _end_date  
            ,load_by    : _load_by 
            ,load_by2   : _load_person
        };
    }
    
    function dateValidation(){ 
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate() - 1;
        var _date1 = (d.getMonth() + 1) + "/01/" +    d.getFullYear();
        var yesterday = (d.getMonth() + 1) + "/"+day+"/" +    d.getFullYear();  
        if(gSubTabName ==="Transaction Summary"){ 
            $("#startTransactionDate").datepicker({
                 autoclose : true 
                ,endDate: yesterday
                ,todayHighlight: false 
            }).datepicker("setDate", gLoadDateFromSumm?gLoadDateFromSumm:yesterday).on("changeDate",function(e){  
                
                $("#endTransactionDate").datepicker({endDate: gLoadDateToSumm?gLoadDateToSumm:yesterday,autoclose: true}).datepicker("setStartDate",e.date);
                $("#endTransactionDate").datepicker().datepicker("setDate",gLoadDateToSumm?gLoadDateToSumm:yesterday);
            }); 
             $("#endTransactionDate").datepicker({
                 autoclose : true 
                ,endDate: yesterday
                ,todayHighlight: false 
            }).datepicker("setDate", gLoadDateToSumm?gLoadDateToSumm:yesterday);
        }
        
        if(gSubTabName ==="Transaction Details"){
            $("#startTransactionDate").datepicker({
                 autoclose : true 
                ,endDate: yesterday
                ,todayHighlight: false 
            }).datepicker("setDate", gLoadDate?gLoadDate:yesterday).on("changeDate",function(e){   
                $("#endTransactionDate").datepicker({endDate: gLoadDate?gLoadDate:yesterday,autoclose: true}).datepicker("setStartDate",e.date);
                $("#endTransactionDate").datepicker().datepicker("setDate",gLoadDate?gLoadDate:yesterday);
            }); 
             $("#endTransactionDate").datepicker({
                 autoclose : true 
                ,endDate: yesterday
                ,todayHighlight: false 
            }).datepicker("setDate", gLoadDate?gLoadDate:yesterday).on("changeDate",function(e){});
        }
 
    } 
    
    function displayLoadingTransaction(){    
        var _o = getFilters(); 
        var _sqlCode  = "R1458"  
            ,_params = {
                   client_id    : app.userInfo.company_id
                  ,load_by      :gLoaderId?gLoaderId: _o.load_by 
            }
            ,_paramsHistory = {
                client_id    : app.userInfo.company_id 
                ,pdate_from  : _o.start_date
                ,pdate_to    : _o.end_date
                ,load_by     : gLoaderId?gLoaderId: _o.load_by2
            };  
            switch(gTabName){  
                case "Recent Transaction":  
                     gHistTranDtls = false;
                     $("#dateDiv").hide();
                    switch (gSubTabName) { 
                        case "Transaction Summary": 
                            $("#recentDD").addClass("hide");
                            $("#gridTransactions").show();
                            _sqlCode = "R1456"; 
                            delete _params.load_by;
                            break; 
                        case "Transaction Details":  
                            $("#recentDD").removeClass("hide") 
                            $("#recentDD").show();  
                            _sqlCode = "R1458";
                            _params.load_by;
                            $("#gridTransactions").show(); 
                        break;
                    }
                break;
                case "History Transaction":  
                    $("#dateDiv").show(); 
                    $("#recentDD").hide(); 
                    gRecTranDtls = false;
                    switch (gSubTabName) {  
                        case "Transaction Summary":   
                            _sqlCode = "L1503";  
                            _params = _paramsHistory;
                            $("#gridTransactions").show(); 
                            break;  
                         case "Transaction Details":  
                            _sqlCode = "L1461"; 
                            _params = _paramsHistory; 
                            $("#gridTransactions").show();
                        break;    
                    }
                break;
            }  
            var _getDataRows = function(){
                var  _clickedTabFalse = "";
                var  _clickedTabTrue = "";
                var _dataRows =[];  
                    if(gTabName==="Recent Transaction"){ 
                        if( gSubTabName === "Transaction Summary"){ 
                            _dataRows.push(
                               {text: "Load Personnel"    ,width : 150     ,style : "text-align:left;" 
                                    , onRender      : function(d) {  
                                        return   "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='lt.displayColDtls(\""+ app.svn (d,"load_by") +"\",\""+ "" +"\",\""+ app.svn (d,"load_personnel") +"\");'>" + app.svn (d,"load_personnel") + "</a>";      
                                    }
                                } 
                                ,{text: "Amount"                ,width : 120       ,style : "text-align:right;"  
                                    ,onRender: function(d){
                                        return app.bs({name: "load_amount"      ,type: "input"          ,value: app.svn(d,"load_amount") ? app.svn(d,"load_amount").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                                    } 
                                } 
                            );  
                        }
                        else if( gSubTabName === "Transaction Details"){ 
                                _clickedTabFalse = function(){
                                    _dataRows.push(
                                        {text: "Load Date"    ,width : 200     ,style : "text-align:center;" 
                                             , onRender      : function(d) {  
                                                 return app.bs({name: "loading_date"        ,type: "input"     ,value: app.svn(d,"loading_date")});       
                                            }
                                        }
                                        ,{text: "Serial No"                ,width : 120       ,style : "text-align:right;"  
                                            ,onRender: function(d){
                                                    return app.bs({name: "qr_id"      ,type: "input"          ,value: app.svn(d,"qr_id")   ,style : "text-align:right;padding-right: 0.3rem;" });
                                                } 
                                        }
                                        ,{text: "Amount"                ,width : 120       ,style : "text-align:right;"  
                                            ,onRender: function(d){
                                                return app.bs({name: "load_amount"      ,type: "input"          ,value: app.svn(d,"load_amount") ? app.svn(d,"load_amount").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                                            } 
                                        } 
                                    ); 
                                };
                                _clickedTabTrue = function(){
                                     _dataRows.push(
                                        {text: "Load Date"    ,width : 200     ,style : "text-align:center;" 
                                             , onRender      : function(d) {  
                                                 return app.bs({name: "loading_date"        ,type: "input"     ,value: app.svn(d,"loading_date")});       
                                            }
                                        }  
                                        /*,{text: "Load Personnel"    ,width : 150     ,style : "text-align:left;" 
                                             , onRender      : function(d) {  
                                                return app.svn(d,"load_personnel")
                                                    +   app.bs({name: "load_by"      ,type: "hidden"          ,value: app.svn(d,"load_by")}); 
                                                
                                            }
                                        } */
                                        ,{text: "Serial No"                ,width : 120       ,style : "text-align:right;"  
                                            ,onRender: function(d){
                                                    return app.bs({name: "qr_id"      ,type: "input"          ,value: app.svn(d,"qr_id")   ,style : "text-align:right;padding-right: 0.3rem;" });
                                                } 
                                        }
                                        ,{text: "Amount"                ,width : 120       ,style : "text-align:right;"  
                                            ,onRender: function(d){
                                                return app.bs({name: "load_amount"      ,type: "input"          ,value: app.svn(d,"load_amount") ? app.svn(d,"load_amount").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                                            } 
                                        } 
                                    );  
                                };
                            if(gTabClickedRec === true){ 
                                _clickedTabTrue();
                            }
                            else{  
                                _clickedTabFalse();
                            }
                           
                        }
                    }
                    else if(gTabName==="History Transaction"){ 
                        if( gSubTabName === "Transaction Summary"){ 
                            _dataRows.push(
                                {text: "Load Date"                ,width : 120                    ,style : "text-align:center;"   
                                    ,onRender : function(d){  
                                       return app.bs({name: "load_date"        ,type: "input"     ,value: app.svn(d,"load_date").toShortDates()}); 
                                    }
                                
                                }
                                ,{text: "Load Personnel"    ,width : 150     ,style : "text-align:left;" 
                                     , onRender      : function(d) {  
                                         var _loadDate = app.svn(d,"load_date").toShortDates();
                                         return   "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='lt.displayColDtls(\""+ app.svn (d,"load_by") +"\",\""+_loadDate+"\");'>" + app.svn (d,"load_personnel") + "</a>"; 
                                    }
                                }
                                ,{text: "Amount"                ,width : 120       ,style : "text-align:right;"  
                                    ,onRender: function(d){
                                            return app.bs({name: "load_amount"      ,type: "input"          ,value: app.svn(d,"load_amount") ? app.svn(d,"load_amount").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.4rem;" });
                                        } 
                                } 
                            );
                        }
                        if(gSubTabName === "Transaction Details"){
                                _clickedTabFalse = function(){
                                    _dataRows.push(
                                        {text: "Load Date"                ,width : 120                    ,style : "text-align:center;"   
                                            ,onRender : function(d){  
                                               return app.bs({name: "loading_date"        ,type: "input"     ,value: app.svn(d,"loading_date") ,style : "text-align:center; padding-right: 0.4rem;"   }); 
                                            }
                                        
                                        }
                                        ,{text: "Serial No"                ,width : 120       ,style : "text-align:right;"  
                                            ,onRender: function(d){
                                                    return app.bs({name: "qr_id"      ,type: "input"          ,value: app.svn(d,"qr_id")   ,style : "text-align:right;padding-right: 0.4rem;" });
                                                } 
                                        }
                                        ,{text: "Amount"                ,width : 120       ,style : "text-align:right;"  
                                            ,onRender: function(d){
                                                    return app.bs({name: "load_amount"      ,type: "input"          ,value: app.svn(d,"load_amount") ? app.svn(d,"load_amount").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.4rem;" });
                                                } 
                                        } 
                                    );
                                };
                                _clickedTabTrue = function(){
                                    _dataRows.push(
                                        {text: "Load Date"                ,width : 120                    ,style : "text-align:center;"   
                                            ,onRender : function(d){  
                                               return app.bs({name: "loading_date"        ,type: "input"     ,value: app.svn(d,"loading_date") ,style : "text-align:center; padding-right: 0.4rem;"   }); 
                                            }
                                        
                                        } 
                                        ,{text: "Serial No"                ,width : 120       ,style : "text-align:right;"  
                                            ,onRender: function(d){
                                                    return app.bs({name: "qr_id"      ,type: "input"          ,value: app.svn(d,"qr_id")   ,style : "text-align:right;padding-right: 0.4rem;" });
                                                } 
                                        }
                                        ,{text: "Amount"                ,width : 120       ,style : "text-align:right;"  
                                            ,onRender: function(d){
                                                    return app.bs({name: "load_amount"      ,type: "input"          ,value: app.svn(d,"load_amount") ? app.svn(d,"load_amount").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.4rem;" });
                                                } 
                                        } 
                                    );
                                };
                            if(gTabClickedHis === true){ 
                                _clickedTabTrue();
                            }
                            else{  
                                _clickedTabFalse();
                            } 
                        }
                    }
                
                 return _dataRows; 
            }; 
            $("#gridRecentLoadingTransaction").dataBind({
                 sqlCode        : _sqlCode
                ,parameters     :  _params
                ,height         : $(window).height() - 400  
                ,dataRows       : _getDataRows()   
                ,onComplete: function(o){ 
                    if(isUD(o.data)) return false;
                    var _loadBy = null 
                        ,_this = this
                        ,_data = o.data.rows;
                    gDaata = _data; 
                     
                    _this.find("[name='load_amount']").maskMoney();
                    _this.find("input").attr("disabled",true); 
                  
                   _this.find("select[name='load_by']").dataBind({
                         sqlCode : "D1502"
                        ,parameters : {client_id:app.userInfo.company_id}
                        ,text   : "load_personnel"
                        ,value  : "id"
                        ,selectedValue: gLoaderId 
                        ,onComplete:function(){
                            _loadBy = this.val();  
                            if(gTabName==="Recent Transaction" && gSubTabName==="Transaction Details"){ 
                                $("#loadPersonnelLabel").removeClass("hide");
                                $("#loaderPersonnel").text(gLoadPersonnelR);
                            } 
                            else if(gTabName==="History Transaction" && gSubTabName==="Transaction Details"){ 
                                $("#loadPersonnelLabel").removeClass("hide");
                                $("#loaderPersonnel").text(gLoadPersonnelH);
                            }else{ 
                                $("#loadPersonnelLabel").addClass("hide");
                            }
                            
                            
                        }
                    });
                   
                    var _tot    = {load_amt:0}; 
                    for(var i=0; i < _data.length;i++ ){
                        var _info = _data[i];
                        _tot.load_amt    +=Number(_info.load_amount)|| 0;
                    }
                    gTot = _tot; 
                    setFooterColumn(_this,_tot); 
                    $(".zRow:last-child()").addClass("zTotal");   
                    $(".zTotal").css("width","-webkit-fill-available")
                    setFooterFreezed("#gridRecentLoadingTransaction");  
                }
            }); 
        } 
        
    function setFooterColumn(_this,_tot){
        var _h      = "";
        var _footerTabFalse = "";
        var _footerTabTrue = "";
        if(gTabName === "Recent Transaction"){ 
            if(gSubTabName === "Transaction Summary"){
                _h  +=  '<div class="zRow even" id="colTrip">' 
                    +' <div class="zCell" style="width:150px;text-align:right;">Total&raquo;</div>'
                    +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;"><b>&#8369; '+_tot.load_amt.toMoney()+'</b></div>'
                +'</div>';
                
            }
            if(gSubTabName === "Transaction Details"){
                _footerTabFalse = function(){
                    _h  +=  '<div class="zRow even" id="colTrip">'  
                        +' <div class="zCell" style="width:200px;text-align:right;"></div>'
                        +' <div class="zCell" style="width:120px;text-align:right"><b>Total&raquo;</b></div>'
                        +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;"><b>&#8369; '+_tot.load_amt.toMoney()+'</b></div>'
                    +'</div>'; 
                };
                _footerTabTrue = function(){
                     _h  +=  '<div class="zRow even" id="colTrip">' 
                        +' <div class="zCell" style="width:200px;text-align:center;"></div>' 
                        +' <div class="zCell" style="width:120px;text-align:right"><b>Total&raquo;</b></div>'
                        +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;"><b>&#8369; '+_tot.load_amt.toMoney()+'</b></div>'
                    +'</div>'; 
                };
                
                if(gTabClickedRec === true){ 
                    _footerTabTrue();
                }
                else{  
                    _footerTabFalse();
                }  
            } 
        }
        if(gTabName === "History Transaction"){
            if(gSubTabName === "Transaction Summary"){
                _h  +=  '<div class="zRow even" id="colTrip">' 
                    +' <div class="zCell" style="width:120px;text-align:center;"></div>'
                    +' <div class="zCell" style="width:150px;text-align:right;">Total&raquo;</div>'
                    +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;"><b>&#8369; '+_tot.load_amt.toMoney()+'</b></div>'
                +'</div>'; 
           }
           if(gSubTabName === "Transaction Details"){
                _footerTabFalse = function(){
                    _h  +=  '<div class="zRow even" id="colTrip">' 
                        +' <div class="zCell" style="width:120px;text-align:right;"></div>'
                        +' <div class="zCell" style="width:120px;text-align:right"><b>Total&raquo;</b></div>'
                        +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;"><b>&#8369; '+_tot.load_amt.toMoney()+'</b></div>'
                    +'</div>'; 
                };
                _footerTabTrue = function(){
                    _h  +=  '<div class="zRow even" id="colTrip">' 
                        +' <div class="zCell" style="width:120px;text-align:center;"></div>' 
                        +' <div class="zCell" style="width:120px;text-align:right"><b>Total&raquo;</b></div>'
                        +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;"><b>&#8369; '+_tot.load_amt.toMoney()+'</b></div>'
                    +'</div>'; 
                };
                
                if(gTabClickedHis === true){ 
                    _footerTabTrue();
                }
                else{  
                    _footerTabFalse();
                } 
               
           }
            
        } 
         _this.find("#table").append(_h);
    }    
   
    function setFooterFreezed(zGridId){ 
        var _zRows = $(zGridId).find(".zGridPanel.right .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight =   _zRows.height();
        var _everyZrowsHeight = "";
        var _zTotala = _tableRight.find(".zTotal");
        var _arr = [];
        var _height = 0;
        var _zTotal = "";
       
        _everyZrowsHeight = $(".zRow:not(:contains('Total»'))");
        _zTotal = _tableRight.find(".zRow:contains('Total»')");
        
        _everyZrowsHeight.each(function(){
            if(this.clientHeight) _arr.push(this.clientHeight);
        });
        
        for (var i = 0; i < _arr.length; i++){
           _height += _arr[i];
        }
        
        _zTotal.css({"top": _zRowsHeight}); 
        if(_zRows.find(".zRow").length == 1){
            _zTotal.addClass("hide");
        }else{
            if(_tableRight.height() > _zRowsHeight){ 
                _tableRight.parent().scroll(function() {  
                    _zTotal.css({"top":_zRowsHeight - 20 -( _tableRight.offset().top - _zRows.offset().top) });
                    _zTotala.prev().css({"margin-bottom":20 }); 
                });
            }else{ 
                _zTotal.css({"top": _height});
                
            }
        }
    }  
    
    function exportExcel(fName){
        $("#thead").empty();  
        $("#tfoot").empty(); 
        $("#tbody").empty(); 
       
        var _h="";
        var _b="";
        var _f="";
        var _tableInfotrue = "";
        var _tableInfofalse = "";
        var convertExcelData = function(filename){
            var downloadLink;
            var dataType = 'application/vnd.ms-excel';
            var tableSelect = document.getElementById("exclTbl");
            var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
            
            // Specify file name
            filename = filename?filename+'.xls':'excel_data.xls';
            
            // Create download link element
            downloadLink = document.createElement("a");
            
            document.body.appendChild(downloadLink);
            
            if(navigator.msSaveOrOpenBlob){
                var blob = new Blob(['\ufeff', tableHTML], {
                    type: dataType
                });
                navigator.msSaveOrOpenBlob( blob, filename);
            }else{
                // Create a link to the file
                downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
            
                // Setting the file name
                downloadLink.download = filename;
                
                //triggering the function
                downloadLink.click();
            }
        };
        
        $.each(gDaata,function(i,v){ 
            _tableInfotrue = function(){ 
                _h='<tr>'
                    +'<th>Load Date</th>'
                    +'<th>Load Personnel</th>'
                    +'<th>Amount</th>'
                +'</tr>';
                _b='<tr>'
                    +'<td>'+(v.load_date?v.load_date:v.loading_date)+'</td>'
                    +'<td>'+v.load_personnel+'</td>'
                    +'<td>'+v.load_amount+'</td>'
                +'</tr>';
                _f='<tr>'
                    +'<td></td>'
                    +'<td><b>&nbsp; &nbsp; Total»</b></td>'
                    +'<td><b>&nbsp; &nbsp;  &nbsp;&#8369;'+gTot.load_amt+'</b></td>'
                +'</tr>';  
                    
            };
            
            if(gTabName==="Recent Transaction"){
                if(gSubTabName==="Transaction Summary"){
                    _h='<tr>' 
                        +'<th>Load Personnel</th>'
                        +'<th>Amount</th>'
                    +'</tr>';
                    _b='<tr>' 
                        +'<td>'+v.load_personnel+'</td>'
                        +'<td>'+v.load_amount+'</td>'
                    +'</tr>';
                    _f='<tr>' 
                        +'<td><b>&nbsp; &nbsp; Total»</b></td>'
                        +'<td><b>&nbsp; &nbsp;  &nbsp;&#8369;'+gTot.load_amt+'</b></td>'
                    +'</tr>'; 
                }else{
                    if(gTabClickedRec === true){ 
                        _tableInfotrue();
                    }
                    else{  
                        _tableInfotrue();
                    } 
                }
                
             }
            if(gTabName==="History Transaction"){
                if(gSubTabName==="Transaction Summary"){
                    _h='<tr>' 
                        +'<th>Load Date</th>'
                        +'<th>Load Personnel</th>'
                        +'<th>Amount</th>'
                    +'</tr>';
                    _b='<tr>' 
                        +'<td>'+(v.load_date?v.load_date:v.loading_date)+'</td>' 
                        +'<td>'+v.load_personnel+'</td>'
                        +'<td>'+v.load_amount+'</td>'
                    +'</tr>';
                    _f='<tr>' 
                        +'<td></td>'
                        +'<td><b>&nbsp; &nbsp; Total»</b></td>'
                        +'<td><b>&nbsp; &nbsp;  &nbsp;&#8369;'+gTot.load_amt+'</b></td>'
                    +'</tr>'; 
                }else{
                    if(gTabClickedRec === true){ 
                        _tableInfotrue();
                    }
                    else{  
                        _tableInfotrue();
                    } 
                }
                
             }   
            $("#tbody").append(_b);
        });
        $("#thead").append(_h);
        $("#tfoot").append(_f);
        convertExcelData(fName);
    }
    
    $("#btnFilterTransaction").click(function(){  
        if(gSubTabName === "Transaction Summary"){
            gHistTranDtls = false; 
            gLoadDateFromSumm   = $("#dateDiv").find("#startTransactionDate").val() ;
            gLoadDateToSumm     = $("#dateDiv").find("#endTransactionDate").val();
           
        }else if(gSubTabName === "Transaction Details"){
             gHistTranDtls = true; 
        }
        displayLoadingTransaction();
    }); 
    
    $(".btnExport").click(function(){   
        var _fileName = "";
        var _grid = "#gridRecentLoadingTransaction";   
        if(gTabName === "Recent Transaction") {
            if(gSubTabName === "Transaction Summary") { 
                _fileName = "Recent Transaction Summary"; 
                 exportExcel(_fileName); 
            }
            else if(gSubTabName === "Transaction Details"){
                _fileName = "Recent Collection Details"; 
                exportExcel(_fileName);
            }    
        }
        else if(gTabName === "History Transaction"){ 
            if(gSubTabName === "Transaction Summary") { 
                _fileName = "History Transaction Summary";  
                exportExcel(_fileName);
            }
            else if(gSubTabName === "Transaction Details") {
                _fileName = "History Transaction Details";
                exportExcel(_fileName);
            } 
        }
        
        
    });
    
    return _pub; 
})();     


                                                                                                                                        