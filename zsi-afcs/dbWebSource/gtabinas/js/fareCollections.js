  
var fc = (function(){
    var  _pub                   = {}
        ,gTotal                 = ""  
        ,gzGrid1                = "#gridTransactions"
        ,gzGrid2                = "#gridPostedTransactions"  
        ,gzGridForPostDtl       = "#gridForPostingSummary"
        ,gzGridPostDtl          = "#gridPostingSummary"
        ,gSubTabName            = ""
        ,gTabName               = "" 
        ,gUser                  =  app.userInfo
        ,gSqlCode               = "" 
        ,gRecentSumm            = 0
        ,gHistorySumm           = 0
        ,gVhId                  = null
        ,gDriver                = null
        ,gPao                   = null 
        ,gClickedRecTab         = false
        ,gClickedHisTab         = false
        ,gVHDD                  = false 
        ,gVRDD                  = false
        ,gData                  = "" 
        ,gCSDate                = ""
        ,gCEDate                = ""
        ,gDataExcelHistSumm     = "" 
        ,gqrAmt                 = 0
        ,gposCashAmt            = 0
        ,gTca                   = 0
        ,gPDate                 = ""
        ,gFooterTotal           = {}
        ,gHistColStartDate      = ""
        ,gHistColEndDate        = ""
    ;
    
    zsi.ready = function(){ 
        $(".page-title").html("Fare Collections");
        $(".panel-container").css("min-height", $(window).height() - 200);   
        displayDailyFareCollection();
        getFilters();
        fillDropdowns();
        
    }; 
    
    gSubTabName = $.trim($(".sub-nav-tabs").find(".nav-link.active").text());  
    gTabName = $.trim($(".main-nav-tabs").find(".nav-link.active").text()); 
    $(".main-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gTabName = $.trim($(e.target).text()); 
        $(".sub-nav-tabs").find(".nav-link").removeClass("active");
        $(".sub-nav-tabs").find(".nav-item:first-child()").find(".nav-link").addClass("active");  
        if(gTabName === "Recent Collection"){ 
            gVhId   = null;
            gDriver = null;
            gPao    = null;
            gPDate  = "";
            gSubTabName = $.trim($(".sub-nav-tabs").find(".nav-link.active").text());  
             dateValidation();
            displayDailyFareCollection(); 
        } 
        if(gTabName === "History Collection"){
            gVhId   = null;
            gDriver = null;
            gPao    = null;
            gPDate  = ""; 
            gSubTabName = $.trim($(".sub-nav-tabs").find(".nav-link.active").text());  
            dateValidation();
            displayHistoryColSummary() 
        }    
    }); 
    $(".sub-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text());    
        dateValidation();
        fillDropdowns(gData);
        if(gTabName === "History Collection"){
            if(gSubTabName=="Collection Summary"){
                $("#dd_Div,#dateDiv,#vehicleRecentSummDiv").hide(); 
                $("#vehicleHistorySummDiv,#gridHistorySummary,.btnSaveSumm").show();
                $("#gridDailyFareCollections").hide();
                $("#hideBTN").hide(); 
                $("#paoDiv").show(); 
            }else{ 
                 displayDailyFareCollection(); 
            }
        }else{ 
             displayDailyFareCollection(); 
        }
       
        
    }); 
    
    _pub.viewDetails                =  function(){ 
        var g$mdl = $("#modalDetails");
        g$mdl.find(".modal-title").text("Details") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
    };
    _pub.showModalForPostingSummary =  function(vehicle_id, payment_date, vehicle_plate_no){
        var _tabH = $("#nav-tabContent").height();
        var _$mdl = $('#modalForPostingSummary');
        _$mdl.modal('show');
        _$mdl.find("#modalTitle").text("Vehicle Plate No.:" + vehicle_plate_no);
        //_$mdl.find(".modal-content").height(_tabH-5);
    
    	$("#nav-forPosting").addClass("after_modal_appended");
    
    	//appending modal background inside the blue div
    	$('.modal-backdrop').appendTo('#nav-forPosting');   
    
    	//remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
    
    	$('body').removeClass("modal-open");
   	 	$('body').css("padding-right","");     
         
         
    };
    _pub.showModalPostedSummary     =  function(post_id, post_no){
        var _tabH = $("#nav-tabContent").height();
        var _$mdl = $('#modalPostedSummary');
        _$mdl.modal('show');
        _$mdl.find("#modalTitle").text("Post Id :" + post_no);
        _$mdl.find(".modal-content").height(_tabH-5);
   
    	$("#nav-posted").addClass("after_modal_appended");
    
    	//appending modal background inside the blue div
    	$('.modal-backdrop').appendTo('#nav-posted');   
    
    	//remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
    
    	$('body').removeClass("modal-open");
   	 	$('body').css("padding-right","");     
         
        displayPostedSummary(post_id);
    };
    _pub.showModalPostedSummaryDtl  =  function(post_id, vehicle_id, vehicle_plate_no){
        var _tabH = $("#nav-tabContent").height();
        var _$mdl = $('#modalPostedSummaryDtl');
        _$mdl.modal('show');
        _$mdl.find("#modalTitle").text("Post Id :" + post_id + "- Vehicle Plate No. :" + vehicle_plate_no);
        _$mdl.find(".modal-content").height(_tabH-5);
        _$mdl.css("padding-right", 0);
        
    	$("#nav-posted").addClass("after_modal_appended");
    
    	//appending modal background inside the blue div
    	$('.modal-backdrop').appendTo('#nav-posted');   
    
    	//remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
    
    	$('body').removeClass("modal-open");
   	 	$('body').css("padding-right","");     
         
        displayPostedSummaryDtl(post_id, vehicle_id);
    }; 
    _pub.displayColDtls             =  function(vehicle_id,driver_id,paoId,pDate){
        if(gTabName === "Recent Collection"){
            gVRDD=true;
            gClickedRecTab = true;
        }
        if(gTabName === "History Collection"){ 
            gClickedHisTab = true;
            gVHDD = true;
        }
        
        gVhId   = vehicle_id;
        gDriver = driver_id;
        gPao    = paoId;
        gPDate  = pDate 
        $("#colDtlsTab").click();  
    };
    
    function getFilters(){ 
        var  _$filter           = $("#nav-recentCollection")
            ,_clientId          = app.userInfo.company_id 
            ,_vehicleId         = _$filter.find('#dailyFare_vehicle').val() 
            ,_driverId          = _$filter.find('#dailyFare_driver').val()
            ,_paoId             = _$filter.find('#dailyFare_pao').val()
            ,_paorcnt           = _$filter.find('[name="dailyFare_pao"]').val()
            ,_startDate         = _$filter.find('#trip_startDate').val()
            ,_endDate           = _$filter.find("#trip_endDate").val()  
            ,_vehicleRecent     = _$filter.find("#vehicleRecent").val()
            ,_vehicleHistory    = _$filter.find("#vhistorySumm").val()
            ,_paoHistory        = _$filter.find("#paoHistorySumm").val()
            ,_driverHistory     = _$filter.find("#driverHistorySumm").val()
            ,_historyStart      = _$filter.find("#historyStart").val()
            ,_historyEnd        = _$filter.find("#historyEnd").val() 
        ; 
        return {
             client_id      : _clientId 
            ,vehicle_id     : _vehicleId   
            ,driver_id      : _driverId
            ,driver_idSumm  : _driverHistory
            ,pao_id         : _paoId
            ,paoRecent      : _paorcnt
            ,start_date     : _startDate 
            ,end_date       : _endDate
            ,vehicle_recent : _vehicleRecent
            ,vehicle_history: _vehicleHistory
            ,pao_history    : _paoHistory
            ,history_start  : _historyStart
            ,history_end    : _historyEnd
        };
    }    
    function fillDropdowns(data){  
         if(isUD(data) || data===0 || data.length===0) return false;
         var _o = getFilters()
            ,_ddDriver = []
            ,_ddPAO    = [];
            
        if(data){  
            for(var i=0;i<data.length;i++){
                _ddDriver.push({driver_name:data[i].driver_name,driver_id:data[i].driver_id});
                _ddPAO.push({pao_name:data[i].pao_name,pao_id:data[i].pao_id});
            }    
            _ddDriver.sort((a, b) => (a.driver_name > b.driver_name) ? 1 : -1);
            _ddPAO.sort((a, b) => (a.pao_name > b.pao_name) ? 1 : -1);
             
            $("select[id='vehicleRecent']").fillSelect({	                
                 data   : data.getUniqueRows(["vehicle_id"])	                   
                ,text   : "vehicle_plate_no"
                ,value  : "vehicle_id"
                ,selectedValue: _o.vehicle_recent
                ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }
            });   
            $("[name='dailyFare_pao']").fillSelect({	                
                 data   : _ddPAO.getUniqueRows(["pao_id"])	                   
                ,text   : "pao_name"	                    
                ,value  : "pao_id"	                    
                ,selectedValue : gPao 
                ,onChange : function(){
                   gPao = $(this).val();
                }
                ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }
            });
        } 
        
        //SUMMARY COLLECTION DETAILS  
            $("select[id='dailyFare_vehicle']").dataBind({	                
                 sqlCode   : "D1264"  	
                ,parameters : {company_id:app.userInfo.company_id}
                ,text   : "vehicle_plate_no"
                ,value  : "vehicle_id" 
                ,selectedValue : gVhId
                ,onChange : function(){
                    gVhId = $(this).val();
                    if(gTabName === "Recent Collection"){
                        gVRDD = false;
                        gClickedRecTab = true;
                    }
                    if(gTabName === "History Collection") { 
                        gVHDD   = false; 
                    }
                }
                ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }
            });
            $("select[id='dailyFare_driver']").dataBind({
                sqlCode   : "D1402"  
                ,text   : "fullname"
                ,value  : "id"
                ,selectedValue : gDriver 
                ,onChange : function(){
                   gDriver = $(this).val();
                   if(gTabName === "Recent Collection"){
                        gVRDD = false;
                        gClickedRecTab = true;
                    }
                    if(gTabName === "History Collection") {
                        gClickedHisTab = true;
                        gVHDD   = false; 
                    } 
                }
                ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }
            }); 
            $("select[id='dailyFare_pao']").dataBind({	                
                 sqlCode   : "D1403"	                   
                ,text   : "fullname"
                ,value  : "id"                   
                ,selectedValue : gPao 
                ,onChange : function(){
                   gPao = $(this).val();
                    if(gTabName === "Recent Collection"){
                        gVRDD = false;
                        gClickedRecTab = true;
                    }
                    if(gTabName === "History Collection") {
                        gClickedHisTab = true;
                        gVHDD   = false; 
                    }
                }
                ,onComplete : function(d){}
            });
        //history summm
        
        $("select[id='vhistorySumm']").dataBind({	                
             sqlCode   : "D1264"  	
            ,parameters : {company_id:app.userInfo.company_id}
            ,text   : "vehicle_plate_no"
            ,value  : "vehicle_id" 
            ,selectedValue: _o.vehicle_history
            ,onComplete : function(d){   
            }  
        }); 
        $("select[id='paoHistorySumm']").dataBind({	                
                 sqlCode   : "D1403"	                   
                ,text   : "fullname"
                ,value  : "id"                   
                ,selectedValue: _o.pao_history 
                ,onComplete : function(d){}
            });
        $("select[id='driverHistorySumm']").dataBind({	                
             sqlCode   : "D1402"  
            ,text   : "fullname"
            ,value  : "id"
            ,selectedValue: _o.driver_idSumm 
            ,onComplete : function(d){ }  
        });  
        
           
    }  
    function dateValidation(){
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate() - 1;
        var _date1 = (d.getMonth() + 1) + "/01/" +    d.getFullYear();
        var yesterday = (d.getMonth() + 1) + "/"+day+"/" +    d.getFullYear();  
        if(gTabName ==="History Collection"){
            if(gSubTabName==="Collection Summary"){  
                $("#historyStart").datepicker({
                     autoclose : true 
                    ,endDate: yesterday
                    ,todayHighlight: false 
                }).datepicker("setDate", gHistColStartDate?gHistColStartDate:yesterday).on("changeDate",function(e){ 
                    $("#historyEnd").datepicker({endDate: gHistColEndDate?gHistColEndDate:yesterday,autoclose: true}).datepicker("setStartDate",e.date);
                    $("#historyEnd").datepicker().datepicker("setDate",gHistColEndDate?gHistColEndDate:yesterday);
                }); 
                 $("#historyEnd").datepicker({
                     autoclose : true 
                    ,endDate: yesterday
                    ,todayHighlight: false 
                }).datepicker("setDate",gHistColEndDate?gHistColEndDate:yesterday).on("changeDate",function(e){});
            } 
            if(gSubTabName==="Collection by Trip"){ 
                $("#trip_startDate").datepicker({
                     autoclose : true 
                    ,endDate: yesterday
                    ,todayHighlight: false 
                }).datepicker("setDate", gPDate?gPDate:yesterday).on("changeDate",function(e){ 
                    $("#trip_endDate").datepicker({endDate: gPDate?gPDate:yesterday,autoclose: true}).datepicker("setStartDate",e.date);
                    $("#trip_endDate").datepicker().datepicker("setDate",gPDate?gPDate:yesterday);
                }); 
                 $("#trip_endDate").datepicker({
                     autoclose : true 
                    ,endDate: yesterday
                    ,todayHighlight: false 
                }).datepicker("setDate",gPDate?gPDate:yesterday).on("changeDate",function(e){});
            } 
            if(gSubTabName==="Collection Details"){ 
                $("#trip_startDate").datepicker({
                     autoclose : true 
                    ,endDate: yesterday
                    ,todayHighlight: false 
                }).datepicker("setDate", gPDate?gPDate:yesterday).on("changeDate",function(e){ 
                    $("#trip_endDate").datepicker({endDate: gPDate?gPDate:yesterday,autoclose: true}).datepicker("setStartDate",e.date);
                    $("#trip_endDate").datepicker().datepicker("setDate",gPDate?gPDate:yesterday);
                }); 
                 $("#trip_endDate").datepicker({
                     autoclose : true 
                    ,endDate: yesterday
                    ,todayHighlight: false 
                }).datepicker("setDate",gPDate?gPDate:yesterday).on("changeDate",function(e){});
            } 
        } 
    } 
     /*DISPLAY COLLECTION SUMMARY*/
    function displayHistoryColSummary(){
        $("#dd_Div,#dateDiv,#vehicleRecentSummDiv").hide(); 
        $("#vehicleHistorySummDiv,#gridHistorySummary,.btnSaveSumm").show();
        $("#gridDailyFareCollections").hide();
        $("#hideBTN").hide(); 
        $("#paoDiv").show(); 
        var _ctr = 1; 
        var _sqlCode  = "V1349" 
            ,_o        = getFilters()
            ,_paramSumm = {
                 vehicle_id  :  _o.vehicle_history
                ,client_id   : _o.client_id
                ,driver_id   : _o.driver_idSumm
                ,pao_id      : _o.pao_history
                ,pdate_from  : _o.history_start 
                ,pdate_to    : _o.history_end   
            }; 
        
        var _getdataRows = function(){
            var _dataRows=[]
                _dataRows.push(
                    {text:"No."                                       ,width:60         ,style:"text-align:center"
                        ,onRender : function(d){ 
                                return    _ctr++
                                       + app.bs({name:"payment_summ_id"                 ,type:"hidden"      ,value: app.svn(d,"payment_summ_id")})
                                       + app.bs({name:"payment_date"                    ,type:"hidden"      ,value: app.svn(d,"payment_date").toShortDate()})
                                       + app.bs({name:"is_edited"                       ,type:"hidden"      ,value: app.svn(d,"is_edited")}); 
                                
                        }
                     }
                    ,{text: "Payment Date"              ,width : 100       ,sortColNo: 1 
                        ,onRender: function(d){
                            return  app.svn(d,"payment_date").toShortDate();
                        }
                    }
                    ,{text: "Vehicle"                    ,width : 150    ,style : "text-align:left;"  ,sortColNo: 3
                        , onRender      : function(d) {  
                            var _paymentDate =  app.svn(d,"payment_date").toShortDate();
                                      return   "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='fc.displayColDtls(\""+ app.svn (d,"vehicle_id") +"\",\""+ app.svn (d,"driver_id") +"\",\""+ app.svn (d,"pao_id") +"\",\""+_paymentDate +"\");'>" + app.svn (d,"vehicle_plate_no") + "</a>"
                                        + app.bs({name:"vehicle_plate_no"              ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")})
                                        + app.bs({name:"vehicle_id"                    ,type:"hidden"       ,value: app.svn(d,"vehicle_id")});
                        }
                    } 
                    ,{text: "Driver"                                   ,width : 180   ,style : "text-align:left;" ,sortColNo: 4
                        ,onRender: function(d){
                            return  app.bs({name:"driver_id"             ,type:"select"          ,value: app.svn(d,"driver_id")});
                        } 
                    }
                    ,{text: "PAO"                                       ,width : 180            ,style : "text-align:left;" ,sortColNo: 5 
                         ,onRender: function(d){
                            return    app.bs({name:"pao_id"                ,type:"select"          ,value: app.svn(d,"pao_id")})
                            ;
                        } 
                    }
                    ,{text: "QR Amount"                                 ,width : 120        ,style : "text-align:right;"     ,sortColNo: 9 
                        ,onRender: function(d){
                            //return app.svn(d,"qr_amt") ? app.svn(d,"qr_amt").toMoney() : 0.00  
                              return   app.bs({name: "qr_amt"               ,type: "input"          ,value: app.svn(d,"qr_amt") ? app.svn(d,"qr_amt").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                        } 
                    }
                    ,{text: "Cash Amount"                                ,width : 120      ,style : "text-align:right;"       ,sortColNo: 1 
                        ,onRender: function(d){ 
                            return app.bs({name: "pos_cash_amt"         ,value: app.svn(d,"pos_cash_amt") ? app.svn(d,"pos_cash_amt").toMoney() : 0.00 ,style : "text-align:right;padding-right: 0.3rem;"});
                        } 
                    } 
                  
                    ,{text: "Total Collections"                ,width : 120    ,style : "text-align:right;"  ,sortColNo: 13
                        ,onRender: function(d){
                            return  app.bs({name: "total_collection_amt"          ,value: app.svn(d,"total_collection_amt").toCommaSeparatedDecimal()         ,style : "text-align:right;padding-right: 0.3rem;"});
                        } 
                    } )
                  return _dataRows; 
        }         
             
        $("#gridHistorySummary").dataBind({
             sqlCode        : "P1442"
            ,parameters     :  _paramSumm
            ,height         : $(window).height() - 400 
            ,dataRows       : _getdataRows()
            ,onComplete: function(o){
                
                _ctr = 1;
                var _data       = o.data.rows; 
                var _zRow       = this.find(".zRow");
                var _this       = this;
                var _rows;
                var _counter    = 1;
                var _tot        = {tca:0,qrAmt:0,posCashAmt:0}; 
                var _total      = {}; 
                var _h          = "";
                var _dataRecentDD;
                var _dataHistoryDD;
                gDataExcelHistSumm = _data;
                this.find("#colTrip").remove();  
                _rows = _data;   
           
                //Computing data from tot
                for(var i=0; i < _rows.length;i++ ){
                    var _info = _rows[i];  
                    _tot.tca            +=Number(_info.total_collection_amt)|| 0; 
                    _tot.posCashAmt     +=Number(_info.pos_cash_amt)|| 0;
                    _tot.qrAmt          +=Number(_info.qr_amt)|| 0; 
                }  
               
                _h  +=  '<div class="zRow even" id="colTrip">' 
                    +' <div class="zCell" style="width:60px;text-align:center;"></div>' 
                    +' <div class="zCell" style="width:100px;text-align:center;"></div>' 
                    +' <div class="zCell" style="width:150px;text-align:center;"></div>' 
                    +' <div class="zCell" style="width:180px;text-align:center;"></div>' 
                    +' <div class="zCell" style="width:180px;text-align:right;">Total&raquo;</div>' 
                    +' <div class="zCell" style="width:120px;text-align:right;">'+ _tot.qrAmt.toMoney()+' </div>' 
                    +' <div class="zCell" style="width:120px;text-align:right;">'+ _tot.posCashAmt.toMoney()+' </div>' 
                    +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;">'+_tot.tca.toMoney()+'</div>'
                +'</div>';                      
                this.find("#table").append(_h); 
                gFooterTotal = _tot;
                fillDropdowns(_data); 
              
                zsi.getData({
                     sqlCode   : "D1402"	   
                     ,onComplete : function(d){ 
                        _this.find("select[name='driver_id']").fillSelect({	                
                             data   : d.rows.getUniqueRows(["id"])	                   
                            ,text   : "fullname"
                            ,value  : "id"  
                            ,onComplete : function(d){}
                        });
                    }
                })
                zsi.getData({
                     sqlCode   : "D1403"	   
                     ,onComplete : function(d){ 
                        _this.find("select[name='pao_id']").fillSelect({	                
                             data   : d.rows.getUniqueRows(["id"])	                   
                            ,text   : "fullname"
                            ,value  : "id"  
                            ,onComplete : function(d){}
                        });
                    }
                }) 
                var _tca = _this.find(".zRow").find("[name='total_collection_amt']").val(); 
                var total = function(){
                    var _$lastRow = _this.find(".zRow").find("b");
                    var _totalCost = _this.find(".zRow").find("[name='total_collection_amt']");
                    var _data = [];
                    var _totality = 0.00;
                    
                    _totalCost.each(function(){
                        if(this.value) _data.push(this.value.replace(/,/g, ""));
                    });
                    
                    for (var i = 0; i < _data.length; i++){
                       _totality += parseFloat(_data[i]);
                    }
                    
                   _$lastRow.text(_totality.toCommaSeparatedDecimal());
                } 
                _this.find("[name='excess_amt']").on("keyup change",function(){
                    var _$row = $(this).closest(".zRow");  
                    var _$exsAmt = _$row.find("[name='excess_amt']")
                        ,_dummyAmt = _$row.find("[name='dummy']").val().replace(/,/g, "")
                        ,_$totCollectionAmt = _$row.find("[name='total_collection_amt']")
                        ,_exsAmt = _$exsAmt.val().replace(/,/g, "")
                        ,_amount = "";
                        
                        if(_exsAmt !=="" && _dummyAmt !==""){
                            _amount = parseFloat(_exsAmt) + parseFloat(_dummyAmt);
                            _$totCollectionAmt.val(_amount.toCommaSeparatedDecimal());
                            total();
                        }else _$totCollectionAmt.val(_tca)
                }); 
                this.find("[name='pos_cash_amt'],[name='total_collection_amt']").attr("readonly",true) 
                this.find("[name='excess_amt'],[name='shortage_amt']").maskMoney();
                $(".zRow:last-child()").addClass("zTotal"); 
                $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");  
                $(".zTotal").css("width","-webkit-fill-available")
                setFooterFreezed("#gridHistorySummary");  
                
            }
        });
    } 
     /*DISPLAY DAILY FARE COLLECTION*/
    function displayDailyFareCollection(){  
        $("#gridHistorySummary").hide();
         var _ctr = 1; 
        var _sqlCode  = "V1349" 
            ,_o        = getFilters()
            ,_params = {
                 client_id   : _o.client_id 
                ,vehicle_id  : gVhId?gVhId:  _o.vehicle_id
                ,driver_id   : gDriver?gDriver:  _o.driver_id 
                ,pao_id      : gPao?gPao:  _o.pao_id 
                ,pdate_from  : null 
                ,pdate_to    : null
            }
            ,_paramSumm = {
                 vehicle_id  : _o.vehicle_recent
                ,client_id   : _o.client_id
                ,driver_id   : _o.driver_idSumm
                ,pao_id      : _o.pao_history
                ,pdate_from  : _o.history_start 
                ,pdate_to    : _o.history_end   
            };
            switch(gTabName){  
                case "Recent Collection":  
                    $("#hideBTN").show();
                    $("#paoDiv").hide(); 
                    switch (gSubTabName) { 
                        case "Collection Summary":   
                            _sqlCode = "P1443";  
                            _params = _paramSumm; 
                            delete _paramSumm.pdate_from;
                            delete _paramSumm.pdate_to;   
                            delete _paramSumm.driver_id; 
                            delete _paramSumm.pao_id;
                            $("#dd_Div,#dateDiv,#vehicleHistorySummDiv,.btnSaveSumm").hide(); 
                            $("#vehicleRecentSummDiv,#gridDailyFareCollections").show();  
                            break;
                        case "Collection by Trip":   
                            _sqlCode = "V1349";  
                            $("#hideFromDate,#hideToDate,#vehicleRecentSummDiv,#vehicleHistorySummDiv,.btnSaveSumm").hide();  
                            $("#dd_Div,#gridDailyFareCollections").show(); 
                            break;
                        case "Collection Details":
                            if(gClickedRecTab === false){
                                $("#dd_Div").show();
                                $("#hideFromDate,#hideToDate,#vehicleRecentSummDiv,#vehicleHistorySummDiv,#gridDailyFareCollections,.btnSaveSumm").hide();
                                 return ;
                            } else{
                                 _sqlCode = "P1338";   
                                _params.pao_id =_o.paoRecent; 
                                delete _params.pdate_from;
                                delete _params.pdate_to;   
                                $("#dd_Div,#gridDailyFareCollections").show(); 
                                $("#hideFromDate,#hideToDate,#vehicleRecentSummDiv,#vehicleHistorySummDiv,.btnSaveSumm").hide();
                            } 
                        break; 
                    }
                break;
                case "History Collection":  
                    $("#hideBTN").hide(); 
                    $("#paoDiv").show(); 
                    switch (gSubTabName) {   
                        case "Collection by Trip": 
                            _sqlCode = "V1349"; 
                            _params.pdate_from = _o.start_date; 
                            _params.pdate_to =_o.end_date; 
                            $("#dd_Div,#dateDiv,#hideFromDate,#hideToDate,#gridDailyFareCollections").show();
                            $("#vehicleRecentSummDiv,#vehicleHistorySummDiv,.btnSaveSumm").hide(); 
                            break;
                        case "Collection Details":
                            if(gClickedHisTab === false){
                                $("#dd_Div,#dateDiv,#hideFromDate,#hideToDate").show();
                                $("#vehicleRecentSummDiv,#vehicleHistorySummDiv,#gridDailyFareCollections,.btnSaveSumm").hide(); 
                                _sqlCode="" ;
                            }else{ 
                                _sqlCode = "P1337";
                                _params.pdate_from =_o.start_date; 
                                _params.pdate_to =_o.end_date;  
                                $("#dd_Div,#dateDiv,#hideFromDate,#hideToDate,#gridDailyFareCollections").show();
                                $("#vehicleRecentSummDiv,#vehicleHistorySummDiv,.btnSaveSumm").hide(); 
                            }
                        break; 
                    }
                break;
            }  
             
            var _getDataRows = function(){  
                var _dataRows =[];  
                var _todate = new Date().toLocaleString().replace(",","").replace(/:.. /," ");  
                if(gSubTabName === "Collection Summary" && _sqlCode === "P1443"){ 
                        _dataRows.push(
                           {text:"No."                                       ,width:60         ,style:"text-align:center"
                                ,onRender : function(d){ 
                                        return  _ctr++
                                               + app.bs({name:"payment_summ_id"                 ,type:"hidden"      ,value: app.svn(d,"payment_summ_id")})
                                               + app.bs({name:"payment_date"                    ,type:"hidden"      ,value: _todate.toShortDate()})
                                               + app.bs({name:"is_edited"                       ,type:"hidden"      ,value: app.svn(d,"is_edited")});
                                        
                                }
                            }
                            ,{text: "Vehicle"                    ,width : 150    ,style : "text-align:left;"  ,sortColNo: 7 
                                , onRender      : function(d) {  
                                              return   "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='fc.displayColDtls(\""+ app.svn (d,"vehicle_id") +"\",\""+ app.svn (d,"driver_id") +"\",\""+ app.svn (d,"pao_id") +"\");'>" + app.svn (d,"vehicle_plate_no") + "</a>"
                                                + app.bs({name:"vehicle_plate_no"              ,value: app.svn(d,"vehicle_plate_no")})
                                                + app.bs({name:"vehicle_id"                    ,type:"hidden"       ,value: app.svn(d,"vehicle_id")});
                                }
                            }
                            ,{text: "Driver"                                    ,width : 180            ,style : "text-align:left;"  ,sortColNo: 9
                                ,onRender: function(d){
                                    return app.bs({name:"driver_name"           ,value: app.svn(d,"driver_name")})
                                         + app.bs({name:"driver_id"             ,type:"hidden"          ,value: app.svn(d,"driver_id")});
                                } 
                            } 
                            ,{text: "PAO"                                       ,width : 180            ,style : "text-align:left;" ,sortColNo: 11 
                                 ,onRender: function(d){
                                    return  app.bs({name:"pao_name"             ,value: app.svn(d,"pao_name")})
                                         + app.bs({name:"pao_id"                ,type:"hidden"          ,value: app.svn(d,"pao_id")})
                                    ;
                                } 
                            }
                            ,{text: "QR Amount"                                 ,width : 120        ,style : "text-align:right;"     ,sortColNo: 2 
                                ,onRender: function(d){
                                    //return app.svn(d,"qr_sales") ? app.svn(d,"qr_sales").toMoney() : 0.00 
                                     return app.bs({name: "qr_amt"               ,type: "input"          ,value: app.svn(d,"qr_sales") ? app.svn(d,"qr_sales").toMoney() : 0.00  ,style : "text-align:right;padding-right: 0.3rem;"});
                                    
                                } 
                            }
                            ,{text: "Cash Amount"                                ,width : 120      ,style : "text-align:right;"       ,sortColNo: 1 
                                ,onRender: function(d){ 
                                    return app.bs({name: "pos_cash_amt"         ,type: "input"          ,value: app.svn(d,"cash_sales") ? app.svn(d,"cash_sales").toMoney() : 0.00 ,style : "text-align:right;padding-right: 0.3rem;"});
                                } 
                            } 
                            ,{text: "Total Collections"                ,width : 120    ,style : "text-align:right;"  ,sortColNo: 6
                                ,onRender: function(d){
                                    return  app.bs({name: "total_collection_amt"          ,value: app.svn(d,"total_sales").toCommaSeparatedDecimal()         ,style : "text-align:right;padding-right: 0.3rem;"});
                                    
                                } 
                            } 
                            ,{text: "Load Sales"                                ,width : 120      ,style : "text-align:right;"        
                                ,onRender: function(d){ 
                                    return app.bs({name: "load_sales"           ,type: "input"          ,value: app.svn(d,"load_sales") ? app.svn(d,"load_sales").toMoney() : 0.00 ,style : "text-align:right;padding-right: 0.3rem;"});
                                } 
                            } 
                            ,{text: "Cash Remit"                                ,width : 120      ,style : "text-align:right;"        
                                ,onRender: function(d){ 
                                    return app.bs({name: "total_cash_remit"           ,type: "input"          ,value: app.svn(d,"total_cash_remit") ? app.svn(d,"total_cash_remit").toMoney() : 0.00 ,style : "text-align:right;padding-right: 0.3rem;"});
                                } 
                            } 
                            
                        );  
                } 
                if(gSubTabName === "Collection by Trip"){ 
                    _dataRows.push(
                         {text: "Trip No"                   ,name:"trip_no"                 ,type:"input"       ,width : 80     ,style : "text-align:center;"  ,sortColNo: 5} 
                        ,{text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 150    ,style : "text-align:left;"   ,sortColNo: 1}  
                        ,{text: "Driver"                    ,name:"driver_name"             ,type:"input"       ,width : 180    ,style : "text-align:left;"  ,sortColNo: 2} 
                        ,{text: "PAO"                       ,name:"pao_name"                ,type:"input"       ,width : 180    ,style : "text-align:left;"  ,sortColNo: 3}
                        ,{text: "Start Date"                ,width : 120                    ,style : "text-align:left;"  ,sortColNo: 11
                            ,onRender : function(d){
                                return app.bs({name: "start_date"        ,type: "input"     ,value: app.svn(d,"start_date").toShortDate()});
                            }
                        }
                        ,{text: "End Date"                   ,width : 120                   ,style : "text-align:left;" ,sortColNo: 12 
                            ,onRender : function(d){
                                return app.bs({name: "end_date"          ,type: "input"     ,value: app.svn(d,"end_date").toShortDate()});
                            }
                        }
                        ,{text: "Start Odo Reading"         ,name:"start_odo"               ,type:"input"       ,width : 150    ,style : "text-align:center;"  ,sortColNo: 13}
                        ,{text: "End Odo Reading"           ,name:"end_odo"                 ,type:"input"       ,width : 150    ,style : "text-align:center;"  ,sortColNo: 14}
                        ,{text: "Distance(Km)"              ,name:"no_kms"                  ,type:"input"       ,width : 100    ,style : "text-align:center;"  ,sortColNo: 17} 
                        ,{text: "Collection Amount"          ,width : 150    ,style : "text-align:right;padding-right: 0.3rem;" ,sortColNo: 18 
                            ,onRender: function(d){
                                return app.bs({name: "total_collection_amt"          ,type: "input"  ,value: app.svn(d,"total_collection_amt") ? app.svn(d,"total_collection_amt").toMoney() : 0.00     ,style : "text-align:right;padding-right: 0.3rem;" });
                            }}
                        
                    ); 
                }
                if(gSubTabName === "Collection Details"){  
                    _dataRows.push(
                         {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                        ,{id: 2  ,groupId: 0                ,text: "Location"               ,style: "text-align:center;"}
                		,{id: 3  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
                		,{id: 4  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
                		,{id: 5  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
                		,{id: 6  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
                		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                		,{id: 8  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                        ,{text: "Trip No"                   ,name:"trip_no"                 ,type:"input"       ,width : 80     ,style : "text-align:center;"       ,groupId : 1  ,sortColNo: 1} 
                        ,{text: "Payment Date"                                                      ,width : 150          ,groupId : 1  ,sortColNo: 4
                            ,onRender: function(d){
                                return app.bs({name: "payment_date"         ,type: "input"     ,value: app.svn(d,"payment_date").toShortDateTime()    ,style : "text-align:center;"})
                                    +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                            }
                        }
                                        
                    );   
                    if(gVHDD===true || gVRDD===true){
                        _dataRows.push(
                            {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 150   ,style : "text-align:left;"     ,groupId : 1  ,sortColNo: 2}  
                        );
                    } 
                    _dataRows.push( 
                         {text: "Driver"                    ,name:"driver_name"             ,type:"input"       ,width : 180   ,style : "text-align:left;"       ,groupId : 1  ,sortColNo: 3} 
                        ,{text: "PAO"                       ,name:"pao_name"                ,type:"input"       ,width : 180   ,style : "text-align:left;"       ,groupId : 1  ,sortColNo: 4} 
                        ,{text: "Distance(Km)"              ,width : 100   ,style : "text-align:center;"       ,groupId : 1
                            ,onRender: function(d){
                                return app.bs({name: "no_klm"          ,type: "input"   ,value: app.svn(d,"no_klm")    ,style : "text-align:center;"});
                            }
                        }
                        ,{text: "Base Fare"                 ,name:"base_fare"               ,type:"input"       ,width : 60    ,style : "text-align:center;"     ,groupId : 1   ,sortColNo: 6}
                        ,{text: "From"                      ,name:"from_location"           ,type:"input"       ,width : 150   ,style : "text-align:left;"       ,groupId : 2   ,sortColNo: 7}
                        ,{text: "To"                        ,name:"to_location"             ,type:"input"       ,width : 150   ,style : "text-align:left;"       ,groupId : 2   ,sortColNo: 8}
                        ,{text: "Passenger"                  ,name:"no_reg"                 ,type:"input"       ,width : 60    ,style : "text-align:center;"     ,groupId : 3   ,sortColNo: 10}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"     ,groupId : 3
                            ,onRender: function(d){
                                return app.bs({name: "reg_amount"          ,type: "input"   ,value: app.svn(d,"reg_amount") ? app.svn(d,"reg_amount").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" ,sortColNo: 14});
                            }
                        }
                        ,{text: "Passenger"                  ,name:"no_stu"                  ,type:"input"      ,width : 60    ,style : "text-align:center;"       ,groupId : 4     ,sortColNo: 11}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 4     ,sortColNo: 15
                            ,onRender: function(d){
                                return app.bs({name: "stu_amount"          ,type: "input"     ,value: app.svn(d,"stu_amount") ? app.svn(d,"stu_amount").toMoney() : 0.00   ,style : "text-align:right;padding-right: 0.3rem;"    ,width : 60});
                            }
                        }
                        ,{text: "Passenger"                  ,name:"no_sc"                   ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 5    ,sortColNo: 12}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 5     ,sortColNo: 16
                            ,onRender: function(d){
                                return app.bs({name: "sc_amount"          ,type: "input"     ,value: app.svn(d,"sc_amount") ? app.svn(d,"sc_amount").toMoney() : 0.00     ,style : "text-align:right;padding-right: 0.3rem;"      ,width : 60});
                            }
                        }
                        ,{text: "Passenger"                  ,name:"no_pwd"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 6    ,sortColNo: 13}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 6     ,sortColNo: 17
                            ,onRender: function(d){
                                return app.bs({name: "pwd_amount"          ,type: "input"   ,value: app.svn(d,"pwd_amount") ? app.svn(d,"pwd_amount").toMoney() : 0.00  ,style : "text-align:right;padding-right: 0.3rem;"   ,width : 60});
                            }
                        }
                        ,{text: "Cash Amount"                                                                  ,width : 100          ,groupId : 7      ,sortColNo: 18
                            ,onRender: function(d){
                                return app.bs({name: "pos_amt"   ,type: "input"   ,value: app.svn(d,"pos_amt") ? app.svn(d,"pos_amt").toMoney() : 0.00   ,style : "text-align:right;padding-right: 0.3rem;" ,width : 60});
                            }
                        } 
                        ,{text: "QR Amount"                                                                  ,width : 100          ,groupId : 7      ,sortColNo: 18
                            ,onRender: function(d){
                                return app.bs({name: "qr_amt"   ,type: "input"   ,value: app.svn(d,"qr_amt") ? app.svn(d,"qr_amt").toMoney() : 0.00   ,style : "text-align:right;padding-right: 0.3rem;" ,width : 60});
                            }
                        } 
                    );  
                    
                } 
                 return _dataRows;  
            }; 
            $("#gridDailyFareCollections").dataBind({
                 sqlCode        : _sqlCode
                ,parameters     :  _params
                ,height         : $(window).height() - 400 
                ,dataRows       : _getDataRows()   
                ,onComplete: function(o){
                    _ctr = 1;
                    if(isUD(o.data)) return false;
                    var _data       = o.data.rows; 
                    var _zRow       = this.find(".zRow");
                    var _this       = this;
                    var _rows;
                    var _counter    = 1;
                    var _tot        = {loadSales:0,cashRemit:0,reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0,stod:0,edo:0,kms:0,tca:0,sales:0,pos:0,qrSales:0,qrAmt:0,posCashAmt:0,pos_amt:0,qr_amt:0}; 
                    var _total      = {}; 
                    var _h          = "";
                    var _dataRecentDD;
                    var _dataHistoryDD;
                    gDataExcelHistSumm = _data;
                    this.find("#colTrip").remove(); 
                    if(_sqlCode==="V1349"){   
                        _rows    = _data;//.getUniqueRows(["trip_no"]);    
                    }  
                    if(_sqlCode==="P1337" || _sqlCode==="P1338" || _sqlCode==="P1443" || _sqlCode==="P1442"){ 
                        _rows = _data;   
                    }  
                   
                    //Computing data from tot
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i]; 
                        _tot.reg            +=Number(_info.reg_amount)|| 0; 
                        _tot.stu            +=Number(_info.stu_amount)|| 0; 
                        _tot.sc             +=Number(_info.sc_amount) || 0; 
                        _tot.pwd            +=Number(_info.pwd_amount)|| 0;
                        _tot.reg_no         +=Number(_info.no_reg)|| 0; 
                        _tot.stu_no         +=Number(_info.no_stu)|| 0; 
                        _tot.sc_no          +=Number(_info.no_sc) || 0; 
                        _tot.pwd_no         +=Number(_info.no_pwd) || 0;
                        _tot.total          +=Number(_info.total_paid_amount)|| 0;
                        _tot.stod           +=Number(_info.start_odo)|| 0;
                        _tot.edo            +=Number(_info.end_odo) || 0;
                        _tot.kms            +=Number(_info.no_kms) || 0;
                        _tot.tca            +=Number(_info.total_collection_amt)|| 0;
                        _tot.sales          +=Number(_info.total_sales)|| 0;
                        _tot.pos            +=Number(_info.cash_sales)|| 0;
                        _tot.qrSales        +=Number(_info.qr_sales)|| 0;
                        _tot.posCashAmt     +=Number(_info.pos_cash_amt)|| 0;
                        _tot.qrAmt          +=Number(_info.qr_amt)|| 0;
                        _tot.pos_amt        +=Number(_info.pos_amt)|| 0;
                        _tot.qr_amt         +=Number(_info.qr_amt)|| 0;
                        _tot.loadSales      +=Number(_info.load_sales)|| 0;
                        _tot.cashRemit      +=Number(_info.total_cash_remit)|| 0;
                    }  
                      if( _sqlCode==="P1443"){
                        _h  +=  '<div class="zRow even" id="colTrip">' 
                            +' <div class="zCell" style="width:60px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:150px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:180px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:180px;text-align:right;">Total&raquo; &#8369; </div>'
                            +' <div class="zCell" style="width:120px;text-align:right;"> '+ _tot.qrSales.toMoney()+'  </div>'
                            +' <div class="zCell" style="width:120px;text-align:right;"> '+ _tot.pos.toMoney()+'    </div>' 
                            +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;"><b>'+_tot.sales.toMoney()+'</b></div>'
                            +' <div class="zCell" style="width:120px;text-align:right;">'+_tot.loadSales.toMoney() +'</div>'
                            +' <div class="zCell" style="width:120px;text-align:right;">'+_tot.cashRemit.toMoney()+'</div>'
                        +'</div>'; 
                    }
                    if(_sqlCode==="P1442"){
                        _h  +=  '<div class="zRow even" id="colTrip">' 
                            +' <div class="zCell" style="width:60px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:150px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:180px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:180px;text-align:right;">Total&raquo;</div>' 
                            +' <div class="zCell" style="width:120px;text-align:right;">'+ _tot.qrAmt.toMoney()+' </div>' 
                            +' <div class="zCell" style="width:120px;text-align:right;">'+ _tot.posCashAmt.toMoney()+' </div>' 
                            +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;">'+_tot.tca.toMoney()+'</div>'
                        +'</div>';  
                    }
                    if(_sqlCode ==="V1349"){  
                        _h  +=  '<div class="zRow even" id="colTrip">' 
                            +' <div class="zCell" style="width:80px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:150px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:180px;text-align:left;"></div>'
                            +' <div class="zCell" style="width:180px;text-align:left;"></div>'
                            +' <div class="zCell" style="width:120px;text-align:left;"></div>'
                            +' <div class="zCell" style="width:120px;text-align:left;"></div>' 
                            +' <div class="zCell" style="width:150px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:150px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:100px;text-align:right;">Total Amount</div>'
                            +' <div class="zCell" style="width:150px;text-align:right;padding-right: 0.3rem;">'+_tot.tca.toMoney()+'</div>'
                        +'</div>';
                     }
                    if(_sqlCode ==="P1338" || _sqlCode ==="P1337"){  
                        if(gVHDD===true || gVRDD===true){ 
                             _h  +=  '<div class="zRow even">'
                            +'    <div class="zCell" style="width:80px;text-align:center;"></div>'
                            +'    <div class="zCell" style="width:150px;left"></div>'
                            +'    <div class="zCell" style="width:150px;text-align:center;"></div>'
                            +'    <div class="zCell" style="width:180px;text-align:left;"></div>'
                            +'    <div class="zCell" style="width:180px;text-align:left;"></div>'
                            +'    <div class="zCell" style="width:100px;text-align:center;"></div>'
                            +'    <div class="zCell" style="width:60px;text-align:center;"></div>'
                            +'    <div class="zCell" style="width:150px;text-align:left;"></div>'
                            +'    <div class="zCell" style="width:150px;text-align:right;">Total Amount</div>'
                            +'    <div class="zCell" style="width:60px;text-align:center;">'+_tot.reg_no+'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.reg.toMoney()+'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:center;">'+_tot.stu_no  +'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.stu.toMoney() +'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:center;">'+_tot.sc_no +'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.sc.toMoney()  +'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:center;">'+ _tot.pwd_no +'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.pwd.toMoney() +'</div>' 
                            +'    <div class="zCell" style="width:100px;text-align:right;">'+  _tot.pos_amt.toMoney()+'</div>'
                            +'    <div class="zCell" style="width:100px;text-align:right;">'+ _tot.qr_amt.toMoney()+'</div>'
                            +' </div> ';  
                        }else{
                            _h  +=  '<div class="zRow even">'
                            +'    <div class="zCell" style="width:80px;text-align:center;"></div>'
                            +'    <div class="zCell" style="width:150px;undefined"></div>'
                            //+'    <div class="zCell" style="width:100px;text-align:center;"></div>'
                            +'    <div class="zCell" style="width:180px;text-align:left;"></div>'
                            +'    <div class="zCell" style="width:180px;text-align:left;"></div>'
                            +'    <div class="zCell" style="width:100px;text-align:center;"></div>'
                            +'    <div class="zCell" style="width:60px;text-align:center;"></div>'
                            +'    <div class="zCell" style="width:150px;text-align:left;"></div>'
                            +'    <div class="zCell" style="width:150px;text-align:right;">Total Amount</div>'
                            +'    <div class="zCell" style="width:60px;text-align:center;">'+_tot.reg_no+'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.reg.toMoney()+'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:center;">'+_tot.stu_no  +'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.stu.toMoney() +'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:center;">'+_tot.sc_no +'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.sc.toMoney()  +'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:center;">'+ _tot.pwd_no +'</div>'
                            +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.pwd.toMoney() +'</div>' 
                            +'    <div class="zCell" style="width:100px;text-align:right;">'+  _tot.pos_amt.toMoney()+'</div>'
                            +'    <div class="zCell" style="width:100px;text-align:right;">'+ _tot.qr_amt.toMoney()+'</div>'
                            +' </div> '; 
                        } 
                    }                       
                    this.find("#table").append(_h); 
                    gFooterTotal = _tot;
                    if(_sqlCode==="P1443"){  
                        if(_data.length){  
                            gRecentSumm = (gRecentSumm.length) ? gRecentSumm : _data;    
                            _dataRecentDD = gRecentSumm;   
                        }else{
                            gRecentSumm ;
                            gHistorySumm;
                        } 
                        gData = _dataRecentDD?_dataRecentDD:gRecentSumm;
                        fillDropdowns(gData);  
                     }
                    else if( _sqlCode==="P1442"){ 
                        
                        fillDropdowns(_data);  
                     } 
                    if(_sqlCode==="P1443" || _sqlCode==="P1442")  {   
                        zsi.getData({
                             sqlCode   : "D1402"	   
                             ,onComplete : function(d){ 
                                _this.find("select[name='driver_id']").fillSelect({	                
                                     data   : d.rows.getUniqueRows(["id"])	                   
                                    ,text   : "fullname"
                                    ,value  : "id"  
                                    ,onComplete : function(d){}
                                });
                            }
                        })
                        zsi.getData({
                             sqlCode   : "D1403"	   
                             ,onComplete : function(d){ 
                                _this.find("select[name='pao_id']").fillSelect({	                
                                     data   : d.rows.getUniqueRows(["id"])	                   
                                    ,text   : "fullname"
                                    ,value  : "id"  
                                    ,onComplete : function(d){}
                                });
                            }
                        })
                        
                        var _tca = _this.find(".zRow").find("[name='total_collection_amt']").val(); 
                        var total = function(){
                            var _$lastRow = _this.find(".zRow").find("b");
                            var _totalCost = _this.find(".zRow").find("[name='total_collection_amt']");
                            var _data = [];
                            var _totality = 0.00;
                            
                            _totalCost.each(function(){
                                if(this.value) _data.push(this.value.replace(/,/g, ""));
                            });
                            
                            for (var i = 0; i < _data.length; i++){
                               _totality += parseFloat(_data[i]);
                            }
                            
                           _$lastRow.text(_totality.toCommaSeparatedDecimal());
                        }
                        
                        _this.find("[name='excess_amt']").on("keyup change",function(){
                            var _$row = $(this).closest(".zRow"); 
                            
                            var _$exsAmt = _$row.find("[name='excess_amt']")
                                ,_dummyAmt = _$row.find("[name='dummy']").val().replace(/,/g, "")
                                ,_$totCollectionAmt = _$row.find("[name='total_collection_amt']")
                                ,_exsAmt = _$exsAmt.val().replace(/,/g, "")
                                ,_amount = "";
                                
                                if(_exsAmt !=="" && _dummyAmt !==""){
                                    _amount = parseFloat(_exsAmt) + parseFloat(_dummyAmt);
                                    _$totCollectionAmt.val(_amount.toCommaSeparatedDecimal());
                                    total();
                                }else _$totCollectionAmt.val(_tca)
                        });
                        
                        this.find("[name='pos_cash_amt'],[name='total_collection_amt']").attr("readonly",true)
                    }else this.find("input").attr("readonly",true);
                    $(".zRow:last-child()").addClass("zTotal"); 
                    this.find("[name='excess_amt'],[name='shortage_amt']").maskMoney();
                    $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");      
                    setFooterFreezed("#gridDailyFareCollections");  
                    
                }
            }); 
        }   
    function toExcelFormat(html){
        return "<html><head><meta charset='utf-8' /><style> table, td {border:thin solid black}table {border-collapse:collapse;font-family:Tahoma;font-size:10pt;}</style></head><body>"
             + html + "</body></html>";
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
        if(gSubTabName==="Collection Summary"){ 
           _everyZrowsHeight = $(".zRow:not(:contains('Total»'))")
            _zTotal = _tableRight.find(".zRow:contains('Total»')")
        }else{
             _everyZrowsHeight = $(".zRow:not(:contains('Total Amount'))")
            _zTotal = _tableRight.find(".zRow:contains('Total Amount')")
            
        }
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
                    if(gSubTabName==="Collection Details"){
                         _zTotal.css({"top":_zRowsHeight - 40 -( _tableRight.offset().top - _zRows.offset().top) });
                        _zTotala.prev().css({"margin-bottom":40 });
                    }
                    else if(gTabName==="Recent Collection" && gSubTabName==="Collection Summary"){
                         _zTotal.css({"top":_zRowsHeight - 20 -( _tableRight.offset().top - _zRows.offset().top) });
                        _zTotala.prev().css({"margin-bottom":40 });
                    }
                    else if(gTabName==="History Collection" && gSubTabName==="Collection Summary"){  
                        if($(window).width()<1912 && $(window).width()===1528){ 
                            _zTotal.css({"top":_zRowsHeight - 20 -( _tableRight.offset().top - _zRows.offset().top) });
                            _zTotala.prev().css({"margin-bottom":40 });
                        }else if($(window).width()<1528){  
                             _zTotal.css({"top":_zRowsHeight - 20 -( _tableRight.offset().top - _zRows.offset().top) });
                            _zTotala.prev().css({"margin-bottom":40 });
                        }else{ 
                             _zTotal.css({"top":_zRowsHeight - 20 -( _tableRight.offset().top - _zRows.offset().top) });
                            _zTotala.prev().css({"margin-bottom":40 });
                        } 
                       
                    }
                    else{ 
                        if($(window).width() < 1536){
                            _zTotal.css({"top":_zRowsHeight - 38 -( _tableRight.offset().top - _zRows.offset().top) });
                            _zTotala.prev().css({"margin-bottom":40 });
                        } 
                        if($(window).width() > 1536){
                           _zTotal.css({"top":_zRowsHeight - 30 - ( _tableRight.offset().top - _zRows.offset().top) });
                           _zTotala.prev().css({"margin-bottom":20 });
                        }
                    }
                   
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
        var _ctr = 1;
        var _h="";
        var _b="";
        var _f="";  
        var convertExcelData = function(filename){ 
            var downloadLink;
            var dataType = 'application/vnd.ms-excel';
            var tableSelect = document.getElementById("tableFare");
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
        $.each(gDataExcelHistSumm,function(i,v){ 
            console.log("gDataExcelHistSumm",gDataExcelHistSumm)
            console.log("gSubTabName",gSubTabName)
            _ctr++;
            if(gTabName==="Recent Collection"){
                if(gSubTabName==="Collection Summary"){
                    _h='<tr>' 
                            +'<th>No</th>' +'<th>Vehicle</th>'+'<th>Driver</th>'+'<th>PAO</th>' +'<th>QR Amount</th>'+'<th>Cash Amount</th>'+'<th>Total Collections</th>'
                        +'</tr>';
                    _b='<tr>' 
                            +'<td>'+_ctr+'</td>'+'<td>'+v.vehicle_plate_no+'</td>'+'<td>'+v.driver_name+'</td>'+'<td>'+v.pao_name+'</td>'+'<td>'+v.qr_sales.toMoney()+'</td>'
                            +'<td>'+v.cash_sales+'</td>'+'<td>'+v.total_sales.toCommaSeparatedDecimal()+'</td>'
                        +'</tr>';
                    _f='<tr>' 
                            +'<td></td>'+'<td></td>' +'<td></td>' +'<td><b>&nbsp; &nbsp; Total»</b></td>' +'<td><b>'+gFooterTotal.qrSales.toMoney()+'</b></td>'+'<td><b>'+gFooterTotal.pos.toMoney()+'</b></td>'
                            +'<td><b>&nbsp; &nbsp;  &nbsp;&#8369;'+gFooterTotal.sales.toMoney()+'</b></td>'
                        +'</tr>'; }
                else if(gSubTabName==="Collection by Trip"){ 
                    _h='<tr>' 
                            +'<th>Trip No</th>' +'<th>Vehicle</th>'+'<th>Driver</th>'+'<th>PAO</th>'+'<th>Start Date</th>' +'<th>End Date</th>' +'<th>Start Odo Reading</th>'
                            +'<th>End Odo Reading</th>'+'<th>Distance (Km)</th>'+'<th>Collection Amount</th>'
                        +'</tr>';
                    _b='<tr>' 
                            +'<td>'+v.trip_no+'</td>'+'<td>'+v.vehicle_plate_no+'</td>'+'<td>'+v.driver_name+'</td>'+'<td>'+v.pao_name+'</td>'+'<td>'+v.start_date+'</td>'
                            +'<td>'+v.end_date+'</td>'+'<td>'+v.start_odo?v.start_odo:0+'</td>'+'<td>'+v.end_odo?v.end_odo:0+'</td>' +'<td>'+v.no_kms?v.no_kms:0+'</td>' +'<td>'+v.total_collection_amt+'</td>' 
                        +'</tr>';
                    _f='<tr>' 
                            +'<td></td>'+'<td></td>'+'<td></td>'+'<td></td>'+'<td></td>' +'<td></td>'+'<td></td>'+'<td></td>'+'<td><b>&nbsp; &nbsp; Total»</b></td>' 
                            +'<td><b>'+gFooterTotal.tca.toMoney()+'</b></td>'
                        +'</tr>'; 
                } 
                else if(gSubTabName==="Collection Details"){  
                    _h='<tr>' 
                            +'<th>Trip No</th>' +'<th>Payment Date</th>' +'<th>Vehicle</th>'+'<th>Driver</th>'+'<th>PAO</th>'+'<th>Distance (Km)</th>'+'<th>Base Fare</th>'+'<th>Location From</th>' +'<th>Location To</th>' 
                            +'<th>Regular Passenger</th>'+'<th>Regular Total</th>' +'<th>Student Passenger</th>'+'<th>Student Total</th>' +'<th>Senior Passenger</th>'+'<th>Senior Total</th>' +'<th>PWD Passenger</th>'+'<th>PWD Total</th>' 
                            +'<th>Cash Amount</th>'+'<th>QR Amount</th>' 
                        +'</tr>';
                    _b='<tr>' 
                            +'<td>'+v.trip_no+'</td>'+'<td>'+v.payment_date+'</td>'+'<td>'+v.vehicle_plate_no+'</td>'+'<td>'+v.driver_name+'</td>'+'<td>'+v.pao_name+'</td>'
                            +'<td>'+v.no_klm+'</td>'+'<td>'+v.base_fare+'</td>'+'<td>'+v.from_location+'</td>' +'<td>'+v.to_location+'</td>'  +'<td>'+v.no_reg+'</td>' +'<td>'+v.reg_amount+'</td>'
                            +'<td>'+v.no_stu+'</td>'+'<td>'+v.stu_amount+'</td>'+'<td>'+v.no_sc+'</td>' +'<td>'+v.sc_amount+'</td>'  +'<td>'+v.no_pwd+'</td>' +'<td>'+v.pwd_amount+'</td>'
                            +'<td>'+v.pos_amt+'</td>'+'<td>'+v.qr_amt+'</td>' 
                        +'</tr>';
                    _f='<tr>' 
                            +'<td></td>'+'<td></td>'+'<td></td>'+'<td></td>'+'<td></td>' +'<td></td>'+'<td></td>'+'<td></td>'+'<td><b>&nbsp; &nbsp; Total»</b></td>' +'<td><b>'+gFooterTotal.reg_no+'</b></td>' 
                            +'<td><b>'+gFooterTotal.reg.toMoney()+'</b></td>' +'<td><b>'+gFooterTotal.stu_no+'</b></td>'+'<td><b>'+gFooterTotal.stu.toMoney()+'</b></td><b>' +'<td>'+gFooterTotal.sc_no+'</b></td>'
                            +'<td><b>'+gFooterTotal.sc.toMoney()+'</b></td>'+'<td><b>'+gFooterTotal.pwd_no+'</b></td>'+'<td><b>'+gFooterTotal.pwd.toMoney()+'</b></td>'+'<td><b>'+gFooterTotal.pos_amt.toMoney()+'</b></td>'
                            +'<td><b>'+gFooterTotal.qr_amt.toMoney()+'</b></td>'
                        +'</tr>'; 
                }
             } 
            else if(gTabName==="History Collection"){
                if(gSubTabName==="Collection Summary"){
                    _h='<tr>' 
                        +'<th>No</th>'+'<th>Payment Date</th>'+'<th>Vehicle</th>'+'<th>Driver</th>'+'<th>PAO</th>'+'<th>QR Amount</th>'+'<th>Cash Amount</th>'+'<th>Total Collections</th>'
                    +'</tr>';
                    _b='<tr>' 
                        +'<td>'+_ctr+'</td>'+'<td>'+v.payment_date+'</td>'+'<td>'+v.vehicle_plate_no+'</td>'+'<td>'+v.driver_name+'</td>' +'<td>'+v.pao_name+'</td>'
                        +'<td>'+v.qr_amt+'</td>'+'<td>'+v.pos_cash_amt+'</td>'+'<td>'+v.total_collection_amt.toCommaSeparatedDecimal()+'</td>'
                    +'</tr>';
                    _f='<tr>' 
                        +'<td></td>'
                        +'<td></td>'
                        +'<td></td>'
                        +'<td></td>' 
                        +'<td><b>&nbsp; &nbsp; Total»</b></td>'
                        +'<td><b>'+gFooterTotal.qrAmt.toMoney()+'</b></td>'
                        +'<td><b>'+gFooterTotal.posCashAmt.toMoney()+'</b></td>' 
                        +'<td><b>&nbsp; &nbsp;  &nbsp;&#8369;'+gFooterTotal.tca.toMoney()+'</b></td>'
                    +'</tr>'; 
                } 
                if(gSubTabName==="Collection by Trip"){
                    _h='<tr>' 
                        +'<th>Trip No</th>'+'<th>Vehicle</th>'+'<th>Driver</th>'+'<th>PAO</th>'+'<th>Start Date</th>'+'<th>End Date</th>'+'<th>Start Odo Reading</th>'
                        +'<th>End Odo Reading</th>'+'<th>Distance (Km)</th>'+'<th>Collection Amount</th>'
                    +'</tr>';
                    _b='<tr>' 
                        +'<td>'+_ctr+'</td>'+'<td>'+v.vehicle_plate_no+'</td>'+'<td>'+v.driver_name+'</td>' +'<td>'+v.pao_name+'</td>'+'<td>'+v.start_date+'</td>'
                        +'<td>'+v.end_date+'</td>'+'<td>'+v.start_odo+'</td>'+'<td>'+v.end_odo+'</td>'+'<td>'+v.no_kms+'</td>'+'<td>'+v.total_collection_amt+'</td>'
                    +'</tr>';
                    _f='<tr>' 
                        +'<td></td>'
                        +'<td></td>'
                        +'<td></td>'
                        +'<td></td>' 
                        +'<td></td>' 
                        +'<td></td>' 
                        +'<td></td>' 
                        +'<td></td>' 
                        +'<td><b>&nbsp; &nbsp; Total»</b></td>'
                        +'<td><b>&nbsp; &nbsp;  &nbsp;&#8369;'+gFooterTotal.tca.toMoney()+'</b></td>'
                    +'</tr>'; 
                } 
                if(gSubTabName==="Collection Details"){ 
                    _h='<tr>' 
                            +'<th>Trip No</th>' +'<th>Payment Date</th>' +'<th>Vehicle</th>'+'<th>Driver</th>'+'<th>PAO</th>'+'<th>Distance (Km)</th>'+'<th>Base Fare</th>'+'<th>Location From</th>' +'<th>Location To</th>' 
                            +'<th>Regular Passenger</th>'+'<th>Regular Total</th>' +'<th>Student Passenger</th>'+'<th>Student Total</th>' +'<th>Senior Passenger</th>'+'<th>Senior Total</th>' +'<th>PWD Passenger</th>'+'<th>PWD Total</th>' 
                            +'<th>Cash Amount</th>'+'<th>QR Amount</th>' 
                        +'</tr>';
                    _b='<tr>' 
                            +'<td>'+v.trip_no+'</td>'+'<td>'+v.payment_date+'</td>'+'<td>'+v.vehicle_plate_no+'</td>'+'<td>'+v.driver_name+'</td>'+'<td>'+v.pao_name+'</td>'
                            +'<td>'+v.no_klm+'</td>'+'<td>'+v.base_fare+'</td>'+'<td>'+v.from_location+'</td>' +'<td>'+v.to_location+'</td>'  +'<td>'+v.no_reg+'</td>' +'<td>'+v.reg_amount+'</td>'
                            +'<td>'+v.no_stu+'</td>'+'<td>'+v.stu_amount+'</td>'+'<td>'+v.no_sc+'</td>' +'<td>'+v.sc_amount+'</td>'  +'<td>'+v.no_pwd+'</td>' +'<td>'+v.pwd_amount+'</td>'
                            +'<td>'+v.pos_amt+'</td>'+'<td>'+v.qr_amt+'</td>' 
                        +'</tr>';
                    _f='<tr>' 
                            +'<td></td>'+'<td></td>'+'<td></td>'+'<td></td>'+'<td></td>' +'<td></td>'+'<td></td>'+'<td></td>'+'<td><b>&nbsp; &nbsp; Total»</b></td>' +'<td><b>'+gFooterTotal.reg_no+'</b></td>' 
                            +'<td><b>'+gFooterTotal.reg.toMoney()+'</b></td>' +'<td><b>'+gFooterTotal.stu_no+'</b></td>'+'<td><b>'+gFooterTotal.stu.toMoney()+'</b></td><b>' +'<td>'+gFooterTotal.sc_no+'</b></td>'
                            +'<td><b>'+gFooterTotal.sc.toMoney()+'</b></td>'+'<td><b>'+gFooterTotal.pwd_no+'</b></td>'+'<td><b>'+gFooterTotal.pwd.toMoney()+'</b></td>'+'<td><b>'+gFooterTotal.pos_amt.toMoney()+'</b></td>'
                            +'<td><b>'+gFooterTotal.qr_amt.toMoney()+'</b></td>'
                        +'</tr>'; 
                }
            } 
            $("#tbody").append(_b);
        });
        $("#thead").append(_h);
        $("#tfoot").append(_f);
        convertExcelData(fName);
    }  
     
    $("#btnFilterRecent").click(function(){  
        displayDailyFareCollection();  
    }); 
    $("#historyBtn").find("#btnFilterCollection").click(function(){
        var  _$filter = $("#nav-recentCollection");  
        var _stDate = _$filter.find('#trip_startDate').val();  
            if(gTabName=="History Collection"){
                if(gSubTabName=="Collection Details"){
                    if(_stDate=="") return false;
                    gClickedHisTab = true;
                    displayDailyFareCollection();  
                }else{
                    displayDailyFareCollection();  
                }
            } 
    });
    $("#btnFilterRecentSumm").click(function(){  
         displayDailyFareCollection();   
    });
    $("#btnFilterHistorySumm").click(function(){ 
        gHistColStartDate = $("#vehicleHistorySummDiv").find("#historyStart").val();
        gHistColEndDate = $("#vehicleHistorySummDiv").find("#historyEnd").val();
        displayHistoryColSummary();    
    }); 
    $("#btnResetDailyFare").click(function(){   
        if(gSubTabName === "Collection by Trip" || gSubTabName === "Collection Details"){ 
            $('#dailyFare_vehicle').val("");
            $('#dailyFare_driver').val("");
            $('#dailyFare_pao').val("");  
            gVhId=null;
            gDriver=null; 
            gPao=null;
        }
        
    }); 
    $("#btnResetRecent").click(function(){    
        if(gSubTabName === "Collection by Trip" || gSubTabName === "Collection Details"){ 
            $('#dailyFare_vehicle').val("");
            $('#dailyFare_driver').val("");
            $('select[name="dailyFare_pao"]').val("");
            gVhId=null;
            gDriver=null; 
            gPao=null;
        } 
    }); 
    $("#btnResetHistorySumm").click(function(){   
       var  _$filter = $("#nav-recentCollection"); 
             _$filter.find('#vhistorySumm,#driverHistorySumm,#paoHistorySumm').val("") 
        gVhId = null   
    }); 
    $("#btnResetRecentSumm").click(function(){   
        $('#vehicleRecent').val("")
        gVhId    = null 
        displayDailyFareCollection();
    });  
    $(".btnExport ").click(function () {   
        var _fileName = ""; 
        if(gTabName === "Recent Collection") {
            if(gSubTabName === "Collection Summary") { 
                _fileName = "Recent Collection Summary"; 
                 exportExcel(_fileName); 
            }
            else if(gSubTabName === "Collection by Trip"){
                _fileName = "Recent Collection by Trip"; 
                exportExcel(_fileName);
            }
            else if(gSubTabName === "Collection Details"){
                _fileName = "Recent Collection Details"; 
                exportExcel(_fileName);
            }    
        }
        else if(gTabName === "History Collection"){ 
            if(gSubTabName === "Collection Summary") { 
                _fileName = "History Collection Summary";  
                exportExcel(_fileName);
            }
            else if(gSubTabName === "Collection by Trip") {
                _fileName = "History Collection by Trip";
                exportExcel(_fileName);
            }
            else if(gSubTabName === "Collection Details") {
                _fileName = "History Collection Details";
                exportExcel(_fileName);
            }
        } 
        
    });
    $(".btnSaveSumm").click(function(){   
        if(gSubTabName){ 
            $("#gridDailyFareCollections").find("[name='pos_cash_amt'],[name='qr_amt'],[name='shortage_amt'],[name='excess_amt'],[name='total_collection_amt']").each(function(){
                this.value = this.value.replace(/,/g, "");
            });
            $("#gridDailyFareCollections").jsonSubmit({
                 procedure: "actual_payments_upd" 
                ,notIncludes : ["dummy"]
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    displayDailyFareCollection()   
                } 
            }); 
        };
    });
    
    return _pub;
})();     

                                                 
                                                            