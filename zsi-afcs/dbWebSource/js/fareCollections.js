  var payment = (function(){
    var  _pub            = {}
        ,gTotal          = ""
        ,gDate           = ""
        ,gPaymentId      = ""
        ,gPaoId1         = null
        ,gPaoId2         = null
        ,gDriverId1      = null
        ,gDriverId2      = null
        ,gRouteId1       = null
        ,gRouteId2       = null
        ,gVehicleId1     = null
        ,gVehicleId2     = null
        ,gzGrid1         = "#gridTransactions"
        ,gzGrid2         = "#gridPostedTransactions"  
        ,gzGridForPostDtl = "#gridForPostingSummary"
        ,gzGridPostDtl   = "#gridPostingSummary"
        ,gSubTabName     = ""
        ,gTabName        = "" 
        ,gUser           =  app.userInfo
        ,gTripNo          = []
        ,gVehicle         = []
        ,gDriver          = []
    ;
       
    gSubTabName = $.trim($(".nav-sub-mfg").find(".nav-item.active").text());  
    gTabName = $.trim($(".nav-tab-main").find(".nav-item.active").text());
    displayDailyFareCollection();
    getFilters();
    $(".nav-tab-main").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
        gTabName = $.trim($(e.target).text());
        $(".nav-tab-sub").find(".nav-item").removeClass("active");
        $(".nav-tab-sub").find(".nav-item:first-child()").addClass("active");

        if(gTabName === "Recent Collection"){
            gSubTabName = $.trim($(".nav-sub-mfg").find(".nav-item.active").text()); 
            displayDailyFareCollection(); 
        }
        if(gTabName === "History Collection"){ 
            gSubTabName = $.trim($(".nav-sub-mfg").find(".nav-item.active").text());  
            displayDailyFareCollection(); 
        }
    }); 
    
    $(".nav-tab-sub").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text()); 
        displayDailyFareCollection(); 
    }); 
    _pub.viewDetails = function(){ 
        var g$mdl = $("#modalDetails");
        g$mdl.find(".modal-title").text("Details") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
    };
    function getFilters(){ 
        var  _$filter       = $("#nav-recentCollection")
            ,_clientId      = app.userInfo.company_id
            ,_vehicleId     = _$filter.find('#dailyFare_vehicle').val() 
            ,_driverId      = _$filter.find('#dailyFare_driver').val()
            ,_startDate     = _$filter.find('#trip_startDate').val()
            ,_endDate       = _$filter.find("#trip_endDate").val()
            ,_tripNo        = _$filter.find("#trip_no").val()
        ;

        return {
             client_id      : _clientId
            ,vehicle_id     : _vehicleId   
            ,driver_id      : _driverId
            ,trip_no        : _tripNo
            ,start_date     : _startDate 
            ,end_date       : _endDate
        };
    }  
    /*function dropdowns(){ 
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        gDate = d.getFullYear() + '/' +
            (month<10 ? '0' : '') + month + '/' +
            (day<10 ? '0' : '') + day;
            
             
        $('#dailyFare_vehicle').select2({placeholder: " ",allowClear: true});  
        $('#dailyFare_driver').select2({placeholder: " ",allowClear: true});
       // $('#trips_vehicle').select2({placeholder: " ",allowClear: true});
       // $('#trips_driver').select2({placeholder: " ",allowClear: true});  
        
        $("#dailyFare_driver").dataBind({
            sqlCode      : "D1262" //dd_drivers_sel
           ,parameters : {company_id:app.userInfo.company_id}
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1];
                   _driver_id         = isUD(_info) ? "" : _info.user_id;
                gDriverId1 = _driver_id;
           }
        }); 
        $("#dailyFare_vehicle").dataBind({
            sqlCode      : "D1264" //dd_vehicle_sel
           ,parameters : {company_id:app.userInfo.company_id}
           ,text         : "vehicle_plate_no"
           ,value        : "vehicle_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1];
                   _vehicle_id     = isUD(_info) ? "" : _info.vehicle_id;
                   gVehicleId1 = _vehicle_id;
           }
        });
         $("#trips_driver").dataBind({
            sqlCode      : "D1262" 
           ,parameters : {company_id:app.userInfo.company_id}
           ,text         : "full_name"
           ,value        : "user_id"
            
        }); 
        $("#trips_vehicle").dataBind({
            sqlCode      : "D1264" 
           ,parameters : {company_id:app.userInfo.company_id}
           ,text         : "vehicle_plate_no"
           ,value        : "vehicle_id"
            
        });
        $("#trip_no").dataBind({
            sqlCode      : "D1350"   
           ,text         : "trip_no"
           ,value        : "trip_id" 
        });
       
        
    } */
    function dateValidation(){
        $("#dailyFare_to").attr("disabled",true); 
        $("#end_date").attr("disabled",true);  
        
        $("#dailyFare_from").datepicker({
             autoclose : true 
             ,endDate: new Date()
            ,todayHighlight: false 
        }).datepicker("setDate",'-1d').on("changeDate",function(e){  
            $("#dailyFare_to").removeAttr("disabled",true);  
            $("#dailyFare_to").datepicker('setStartDate', e.date); 
        }); 
        $("#dailyFare_to").datepicker({
             autoclose : true
            ,todayHighlight: false 
            ,endDate: new Date()
        }).datepicker("setDate",'-1d');
          
        
        
        $("#trip_startDate").datepicker({
             autoclose : true 
             ,endDate: new Date()
            ,todayHighlight: false 
        }).datepicker("setDate",'-1d').on("changeDate",function(e){  
             $("#trip_endDate").removeAttr("disabled",true);  
             $("#trip_endDate").datepicker('setStartDate', e.date); 
        });
         
        $("#trip_endDate").datepicker({
             autoclose : true
            ,todayHighlight: false 
            ,endDate: new Date()
        }).datepicker("setDate",'-1d');
         
          
    } 
    function displayForPosting(){ 
        zsi.getData({
             sqlCode    : "P1339" //payment_for_posting_sum_sel
            ,parameters: { client_id: gUser.company_id}
            ,onComplete : function(d) {
                var _rows= d.rows;
                var _totality = 0.00;
                for(var i=0; i < _rows.length;i++ ){
                    var _info = _rows[i];
                    _totality  +=_info.total_fare;
                }
                
                //create additional row for total
                var _total = {
                     payment_date      : ""
                    ,vehicle_plate_no  : "Total Amount"
                    ,total_fare        : _totality
                };
                
                d.rows.push(_total);
                
                $("#gridTransactions").dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 240
                    ,blankRowsLimit : 0
                    ,dataRows       : [
                        {text: "Payment Date"           ,name:"payment_date"            ,type:"input"       ,width : 150   ,style : "text-align:left;"
                            , onRender      : function(d) { 
                                return app.svn(d, "payment_date").toShortDate();
                            }
                        }
                        ,{text: "Vehicle Plate No."           ,width : 150   ,style : "text-align:left;"
                            , onRender      : function(d) { 
                                var _vpn = app.svn (d,"vehicle_plate_no");
                                if(_vpn=="Total Amount")
                                    return _vpn;
                                else
                                    return "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='payment.showModalForPostingSummary(\""+ app.svn (d,"vehicle_id") +"\",\""+ _vpn +"\");'>" + _vpn + "</a>";
                            }
                        }
                        ,{text: "Total Fare"        ,name:"total_fare"              ,type:"input"       ,width : 150   ,style : "text-align:right;"
                            , onRender      : function(d) { 
                                return app.svn(d, "total_fare").toMoney();
                            }
                        }
                    ]
                    ,onComplete: function(o){
                        var _this   = this; 
                        this.find("input").attr("readonly",true);
                        $(".zRow:last-child()").addClass("zTotal");
                        $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                        setFooterFreezed(gzGrid1); 
                    }
                });
            }
        });
    }
    function displayPostedTransactions(fromDate,toDate,paymentId,routeId,vehicleId,driverId,paoId){ 
        zsi.getData({
             sqlCode    : "P1341" //posted_dates_sel
            //,parameters : {posted_frm:(fromDate ? fromDate : ""),posted_to:(toDate ? toDate : ""),payment_type:(paymentId ? paymentId : ""),route_id:(routeId ? routeId : ""),vehicle_id:(vehicleId ? vehicleId : ""),driver_id:(driverId ? driverId : ""),pao_id:(paoId ? paoId : "")} 
            ,onComplete : function(d) {
                var _rows = d.rows;
                var _totality = 0.00;
                for(var i=0; i < _rows.length;i++ ){
                    var _info = _rows[i];
                    _totality  +=_info.posted_amount;
                }
                
                //create additional row for total
                var _total = {
                     post_no      : ""
                    ,posted_date  : "Total Amount"
                    ,posted_amount        : _totality
                    ,bank_transfer_no: ""
                };
                
                d.rows.push(_total);
                
                $(gzGrid2).dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 240
                    ,dataRows       : [
                         {text: "Post Id"               ,width : 150   ,style : "text-align:left;"
                            , onRender      : function(d) { 
                                var _postNo = app.svn (d,"post_no");
                                if(_postNo=="Total Amount")
                                    return _postNo;
                                else
                                    return "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='payment.showModalPostedSummary(\""+ app.svn (d,"id") +"\",\""+ _postNo +"\");'>" + _postNo + "</a>";
                            }
                         }
                        ,{text: "Posted Date"           ,width : 150   ,style : "text-align:left;"
                            , onRender      : function(d) { 
                                var _postDate = app.svn (d,"posted_date");
                                if(_postDate=="Total Amount")
                                    return _postDate;
                                else
                                    return _postDate.toShortDate();;
                            }
                        }
                        ,{text: "Amount"                ,width : 150   ,style : "text-align:right;"
                            , onRender      : function(d) { 
                                return app.svn(d, "posted_amount").toMoney();
                            }
                        }
                        ,{text: "Bank Transfer No."     ,width : 150   ,style : "text-align:right;"
                            , onRender      : function(d) { 
                                return app.svn(d, "bank_transfer_no");
                            }
                        }
                    ]
                    ,onComplete: function(o){
                        var _this   = this; 
                        this.find("input").attr("readonly",true);
                        $(".zRow:last-child()").addClass("zTotal");
                        $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                        setFooterFreezed(gzGrid1); 
                    }
                });
            }
        });
    }  
    function setFooterFreezed(zGridId){ 
        var _zRows = $(zGridId).find(".zGridPanel.right .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight =   _zRows.height() - 40;
        var _zTotal = _tableRight.find(".zTotal");
        _zTotal.css({"top": _zRowsHeight});
        _zTotal.prev().css({"margin-bottom":23 }); 
        if(_zRows.find(".zRow").length == 1){
            _zTotal.addClass("hide");
        }else{
            if(_tableRight.height() > _zRowsHeight){
                _tableRight.parent().scroll(function() {
                   _zTotal.css({"top":_zRowsHeight - ( _tableRight.offset().top - _zRows.offset().top) });
                });
            }else{
                _zTotal.css({"position":"unset"});
                _zTotal.prev().css({"margin-bottom":0 });
            }
        }
    }
    
    function displayForPostingSummary(vehicle_id){
        var _getDataRows = function(){ 
            var _dataRows =[
                 {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}	 
        		,{id: 2  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
        		,{id: 3  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
        		,{id: 4  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
        		,{id: 5  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
        		,{id: 6  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
        		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                ,{text: "Payment Date"                                                      ,width : 150          ,groupId : 1
                    ,onRender: function(d){
                        return app.bs({name: "payment_date"         ,type: "input"     ,value: app.svn(d,"payment_date")    ,style : "text-align:center;"})
                            +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                    }
                }            
            ]; 
            
            _dataRows.push(
                 {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1} 
                ,{text: "Vehicle Type"              ,name:"vehicle_type"            ,type:"input"       ,width : 150   ,style : "text-align:center;"       ,groupId : 1}
                ,{text: "Driver"                    ,name:"full_name"               ,type:"input"       ,width : 130   ,style : "text-align:center;"       ,groupId : 1} 
                ,{text: "Distance(Km)"              ,name:"no_klm"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
                ,{text: "Base Fare"                 ,name:"base_fare"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 1}
                ,{text: "Quantity"                  ,name:"no_reg"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 2}
                ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 2
                    ,onRender: function(d){
                        return app.bs({name: "reg_amount"          ,type: "input"   ,value: app.svn(d,"reg_amount").toMoney()    ,style : "text-align:center;"});
                    }
                }
                ,{text: "Quantity"                  ,name:"no_stu"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 3}
                ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 3
                    ,onRender: function(d){
                        return app.bs({name: "stu_amount"          ,type: "input"     ,value: app.svn(d,"stu_amount").toMoney()    ,style : "text-align:center;"    ,width : 60});
                    }
                }
                ,{text: "Quantity"                  ,name:"no_sc"                   ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 4}
                ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 4
                    ,onRender: function(d){
                        return app.bs({name: "sc_amount"          ,type: "input"     ,value: app.svn(d,"sc_amount").toMoney()    ,style : "text-align:center;"      ,width : 60});
                    }
                }
                ,{text: "Quantity"                  ,name:"no_pwd"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 5}
                ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 5
                    ,onRender: function(d){
                        return app.bs({name: "pwd_amount"          ,type: "input"   ,value: app.svn(d,"pwd_amount").toMoney()    ,style : "text-align:center;"  ,width : 60});
                    }
                }
                ,{text: "Total Amount"                                                                  ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"       ,groupId : 6
                    ,onRender: function(d){
                        return app.bs({name: "total_paid_amount"   ,type: "input"   ,value: app.svn(d,"total_paid_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;" ,width : 60});
                    }
                } 
            );
            
            return _dataRows;  
        };  
            
        zsi.getData({
             sqlCode        : "P1231" //payment_for_posting_sel
            ,parameters     : {vehicle_id: vehicle_id}
            ,onComplete : function(d) {
                var _rows= d.rows;
                var _tot = {reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                
                for(var i=0; i < _rows.length;i++ ){
                    var _info = _rows[i];
                    _tot.reg    +=_info.reg_amount; 
                    _tot.stu    +=_info.stu_amount; 
                    _tot.sc     +=_info.sc_amount; 
                    _tot.pwd    +=_info.pwd_amount;
                    _tot.reg_no +=_info.no_reg; 
                    _tot.stu_no +=_info.no_stu; 
                    _tot.sc_no  +=_info.no_sc; 
                    _tot.pwd_no +=_info.no_pwd;
                    _tot.total  +=_info.total_paid_amount;
                }
                
                //create additional row for total
                var _total = {
                         payment_date       : ""
                        ,inspector_id       : ""
                        ,route_code         : ""
                        ,from_location      : ""
                        ,to_location        : ""
                        ,no_klm             : "Total Amount"
                        ,no_reg             : _tot.reg_no
                        ,no_stu             : _tot.stu_no
                        ,no_sc              : _tot.sc_no
                        ,no_pwd             : _tot.pwd_no
                        ,reg_amount         : _tot.reg
                        ,stu_amount         : _tot.stu
                        ,sc_amount          : _tot.sc
                        ,pwd_amount         : _tot.pwd
                        ,total_paid_amount  : _tot.total
                        ,post_id            : ""
                        ,qr_id              : ""
                        ,driver             : ""
                        ,pao                : ""
                        ,vehicle_plate_no   : ""
                };
                
                d.rows.push(_total);
                $(gzGridForPostDtl).dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 320
                    ,blankRowsLimit : 0
                    ,dataRows       : _getDataRows()
                    ,onComplete: function(o){
                        var _this   = this; 
                        this.find("input").attr("readonly",true);
                        $(".zRow:last-child()").addClass("zTotal");
                        $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                        setFooterFreezed(gzGridForPostDtl); 
                    }
                });
            }
        });
    }
    function displayPostedSummary(post_id){
        zsi.getData({
             sqlCode    : "P1340" //payment_posted_sum_sel
            ,parameters : {post_id: post_id,client_id: gUser.company_id}
            ,onComplete : function(d) {
                var _rows= d.rows;
                var _totality = 0.00;
                for(var i=0; i < _rows.length;i++ ){
                    var _info = _rows[i];
                    _totality  +=_info.total_amount;
                }
                
                //create additional row for total
                var _total = {
                     payment_date      : ""
                    ,vehicle_plate_no  : "Total Amount"
                    ,total_amount        : _totality
                };
                
                d.rows.push(_total);
                
                $("#gridPostedSummary").dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 300
                    ,blankRowsLimit : 0
                    ,dataRows       : [
                        {text: "Payment Date"           ,width : 150   ,style : "text-align:left;"
                            , onRender      : function(d) { 
                                return app.svn(d, "payment_date").toShortDate();
                            }
                        }
                        ,{text: "Vehicle Plate No."     ,width : 150   ,style : "text-align:left;"
                            , onRender      : function(d) { 
                                var _vpn = app.svn (d,"vehicle_plate_no");
                                if(_vpn=="Total Amount")
                                    return _vpn;
                                else
                                    return "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='payment.showModalPostedSummaryDtl(\""+ app.svn (d,"post_id") +"\",\""+ app.svn (d,"vehicle_id") +"\",\""+ _vpn +"\");'>" + _vpn + "</a>";
                            }
                        }
                        ,{text: "Total"            ,width : 150   ,style : "text-align:right;"
                            , onRender      : function(d) { 
                                return app.svn(d, "total_amount").toMoney();
                            }
                        }
                    ]
                    ,onComplete: function(o){
                        var _this   = this; 
                        this.find("input").attr("readonly",true);
                        $(".zRow:last-child()").addClass("zTotal");
                        $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                        setFooterFreezed(gzGrid1); 
                    }
                });
            }
        }); 
            
    }
    function displayPostedSummaryDtl(post_id, vehicle_id){
        var _getDataRows = function(){ 
            var _dataRows =[
                 {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}	 
        		,{id: 2  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
        		,{id: 3  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
        		,{id: 4  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
        		,{id: 5  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
        		,{id: 6  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
        		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                ,{text: "Payment Date"                                                      ,width : 150          ,groupId : 1
                    ,onRender: function(d){
                        return app.bs({name: "payment_date"         ,type: "input"     ,value: app.svn(d,"payment_date")    ,style : "text-align:center;"})
                            +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                    }
                }            
            ]; 
            
            _dataRows.push(
                 {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1} 
                ,{text: "Vehicle Type"              ,name:"vehicle_type"            ,type:"input"       ,width : 150   ,style : "text-align:center;"       ,groupId : 1}
                ,{text: "Driver"                    ,name:"full_name"               ,type:"input"       ,width : 130   ,style : "text-align:center;"       ,groupId : 1} 
                ,{text: "Distance(Km)"              ,name:"no_klm"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
                ,{text: "Base Fare"                 ,name:"base_fare"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 1}
                ,{text: "Quantity"                  ,name:"no_reg"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 2}
                ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 2
                    ,onRender: function(d){
                        return app.bs({name: "reg_amount"          ,type: "input"   ,value: app.svn(d,"reg_amount").toMoney()    ,style : "text-align:center;"});
                    }
                }
                ,{text: "Quantity"                  ,name:"no_stu"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 3}
                ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 3
                    ,onRender: function(d){
                        return app.bs({name: "stu_amount"          ,type: "input"     ,value: app.svn(d,"stu_amount").toMoney()    ,style : "text-align:center;"    ,width : 60});
                    }
                }
                ,{text: "Quantity"                  ,name:"no_sc"                   ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 4}
                ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 4
                    ,onRender: function(d){
                        return app.bs({name: "sc_amount"          ,type: "input"     ,value: app.svn(d,"sc_amount").toMoney()    ,style : "text-align:center;"      ,width : 60});
                    }
                }
                ,{text: "Quantity"                  ,name:"no_pwd"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 5}
                ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 5
                    ,onRender: function(d){
                        return app.bs({name: "pwd_amount"          ,type: "input"   ,value: app.svn(d,"pwd_amount").toMoney()    ,style : "text-align:center;"  ,width : 60});
                    }
                }
                ,{text: "Total Amount"                                                                  ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"       ,groupId : 6
                    ,onRender: function(d){
                        return app.bs({name: "total_paid_amount"   ,type: "input"   ,value: app.svn(d,"total_paid_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;" ,width : 60});
                    }
                } 
            );
            
            return _dataRows;  
        };  
            
        zsi.getData({
             sqlCode        : "P1235" //payment_posted_sel
            ,parameters     : {post_id: post_id, vehicle_id: vehicle_id}
            ,onComplete : function(d) {
                var _rows= d.rows;
                var _tot = {reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                
                for(var i=0; i < _rows.length;i++ ){
                    var _info = _rows[i];
                    _tot.reg    +=_info.reg_amount; 
                    _tot.stu    +=_info.stu_amount; 
                    _tot.sc     +=_info.sc_amount; 
                    _tot.pwd    +=_info.pwd_amount;
                    _tot.reg_no +=_info.no_reg; 
                    _tot.stu_no +=_info.no_stu; 
                    _tot.sc_no  +=_info.no_sc; 
                    _tot.pwd_no +=_info.no_pwd;
                    _tot.total  +=_info.total_paid_amount;
                }
                
                //create additional row for total
                var _total = {
                         payment_date       : ""
                        ,inspector_id       : ""
                        ,route_code         : ""
                        ,from_location      : ""
                        ,to_location        : ""
                        ,no_klm             : "Total Amount"
                        ,no_reg             : _tot.reg_no
                        ,no_stu             : _tot.stu_no
                        ,no_sc              : _tot.sc_no
                        ,no_pwd             : _tot.pwd_no
                        ,reg_amount         : _tot.reg
                        ,stu_amount         : _tot.stu
                        ,sc_amount          : _tot.sc
                        ,pwd_amount         : _tot.pwd
                        ,total_paid_amount  : _tot.total
                        ,post_id            : ""
                        ,qr_id              : ""
                        ,driver             : ""
                        ,pao                : ""
                        ,vehicle_plate_no   : ""
                };
                
                d.rows.push(_total);
                $("#gridPostedSummaryDtl").dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 320
                    ,blankRowsLimit : 0
                    ,dataRows       : _getDataRows()
                    ,onComplete: function(o){
                        var _this   = this; 
                        this.find("input").attr("readonly",true);
                        $(".zRow:last-child()").addClass("zTotal");
                        $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                        setFooterFreezed("#gridPostedSummaryDtl"); 
                    }
                });
            }
        });
    }    
    function displayDailyFareCollection(){ 
        var _$navGrid = "#gridDailyFareCollections"
            ,_sqlCode  = "V1349" 
            ,_o        = getFilters()
            ,_params = {
                 client_id   : _o.client_id
                ,trip_no     : _o.trip_no 
                ,vehicle_id  : _o.vehicle_id
                ,driver_id   : _o.driver_id 

            }
            ,_paramsDetails = {
                 client_id   : _o.client_id 
                ,vehicle_id  : _o.vehicle_id
                ,driver_id   : _o.driver_id  
                
            }
            ,_paramsHistory ={
                 client_id   : _o.client_id
                ,vehicle_id  : _o.vehicle_id
                ,driver_id   : _o.driver_id 
                ,pdate_from  : _o.start_date 
                ,pdate_to    : _o.end_date  
            };
            
            console.log("_sqlCode",_sqlCode);
            switch(gTabName){  
                case "Recent Collection":  
                    switch (gSubTabName) { 
                        case "Collection by Trip":   
                            _sqlCode = "V1349"; 
                            _params = _params;  
                            $("#tripNo").removeClass("hide");
                            $("#hideFromDate,#hideToDate").addClass("hide");
                            break;
                        case "Collection Details":  
                            _sqlCode = "P1338"; 
                            _params = _paramsDetails;  
                            $("#hideFromDate,#hideToDate,#tripNo").addClass("hide");
                        break;
                       
                    }
                break;
                case "History Collection":  
                    switch (gSubTabName) { 
                        case "Collection by Trip":   
                            _sqlCode = "V1349"; 
                            _params = _params;  
                            $("#tripNo").removeClass("hide");
                            $("#hideFromDate,#hideToDate").addClass("hide");
                            break;
                        case "Collection Details":  
                            _sqlCode = "P1337"; 
                            _params = _paramsHistory;  
                            $("#hideFromDate,#hideToDate,#tripNo").removeClass("hide");
                            $("#tripNo").addClass("hide");
                        break;
                       
                    }
                break;
            }  
            
            var _getDataRows = function(){  
                var _dataRows =[];  
                if(gSubTabName === "Collection by Trip"){ 
                    console.log("gSubTabName under collection",gSubTabName);
                    _dataRows.push(
                         {text: "Trip No"                   ,name:"trip_no"                 ,type:"input"       ,width : 80     ,style : "text-align:center;"  } 
                        ,{text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100    ,style : "text-align:center;"  }  
                        ,{text: "Driver"                    ,name:"driver_name"             ,type:"input"       ,width : 130    ,style : "text-align:center;"  } 
                        ,{text: "Pao"                       ,name:"pao_name"                ,type:"input"       ,width : 150    ,style : "text-align:center;"  }
                        ,{text: "Start Date"                ,width : 100                    ,style : "text-align:left;"  
                            ,onRender : function(d){
                                return app.bs({name: "start_date"                           ,type: "input"     ,value: app.svn(d,"start_date").toShortDate()   })
                            }
                        }
                        ,{text: "End Date"                   ,width : 100                   ,style : "text-align:left;"  
                            ,onRender : function(d){
                                return app.bs({name: "end_date"         ,type: "input"     ,value: app.svn(d,"end_date").toShortDate()   })
                            }
                        }
                        ,{text: "Start Odo Reading"         ,name:"start_odo"               ,type:"input"       ,width : 150    ,style : "text-align:center;"  }
                        ,{text: "End Odo Reading"           ,name:"end_odo"                 ,type:"input"       ,width : 150    ,style : "text-align:center;"  }
                        ,{text: "Distance(Km)"              ,name:"no_kms"                  ,type:"input"       ,width : 100    ,style : "text-align:center;"  } 
                        ,{text: "Collection Amount"         ,name:"total_collection_amt"    ,type:"input"       ,width : 150    ,style : "text-align:center;"  }
                        
                    ); 
                }
                if(gSubTabName === "Collection Details"){  
                    _dataRows.push(
                         {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}	 
                		,{id: 2  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
                		,{id: 3  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
                		,{id: 4  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
                		,{id: 5  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
                		,{id: 6  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                        ,{text: "Payment Date"                                                      ,width : 150          ,groupId : 1
                            ,onRender: function(d){
                                return app.bs({name: "payment_date"         ,type: "input"     ,value: app.svn(d,"payment_date")    ,style : "text-align:center;"})
                                    +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                            }
                        }
                                        
                    );  
                    _dataRows.push(
                         {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1} 
                        ,{text: "Vehicle Type"              ,name:"vehicle_type"            ,type:"input"       ,width : 150   ,style : "text-align:center;"       ,groupId : 1}
                        ,{text: "Driver"                    ,name:"full_name"               ,type:"input"       ,width : 130   ,style : "text-align:center;"       ,groupId : 1} 
                        ,{text: "Distance(Km)"              ,name:"no_klm"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
                        ,{text: "Base Fare"                 ,name:"base_fare"               ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 1}
                        ,{text: "Quantity"                  ,name:"no_reg"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 2}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 2
                            ,onRender: function(d){
                                return app.bs({name: "reg_amount"          ,type: "input"   ,value: app.svn(d,"reg_amount").toMoney()    ,style : "text-align:center;"});
                            }
                        }
                        ,{text: "Quantity"                  ,name:"no_stu"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 3}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 3
                            ,onRender: function(d){
                                return app.bs({name: "stu_amount"          ,type: "input"     ,value: app.svn(d,"stu_amount").toMoney()    ,style : "text-align:center;"    ,width : 60});
                            }
                        }
                        ,{text: "Quantity"                  ,name:"no_sc"                   ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 4}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 4
                            ,onRender: function(d){
                                return app.bs({name: "sc_amount"          ,type: "input"     ,value: app.svn(d,"sc_amount").toMoney()    ,style : "text-align:center;"      ,width : 60});
                            }
                        }
                        ,{text: "Quantity"                  ,name:"no_pwd"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 5}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 5
                            ,onRender: function(d){
                                return app.bs({name: "pwd_amount"          ,type: "input"   ,value: app.svn(d,"pwd_amount").toMoney()    ,style : "text-align:center;"  ,width : 60});
                            }
                        }
                        ,{text: "Total Amount"                                                                  ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"       ,groupId : 6
                            ,onRender: function(d){
                                return app.bs({name: "total_paid_amount"   ,type: "input"   ,value: app.svn(d,"total_paid_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;" ,width : 60});
                            }
                        } 
                    );  
                } 
                 return _dataRows; 
            };  
            
            zsi.getData({
                 sqlCode    : _sqlCode 
                ,parameters :  _params
                ,onComplete : function(d) {
                    var _rows = d.rows;
                    var _tot  = {reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0,stod:0,edo:0,kms:0,tca:0}; 
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.reg    +=_info.reg_amount; 
                        _tot.stu    +=_info.stu_amount; 
                        _tot.sc     +=_info.sc_amount; 
                        _tot.pwd    +=_info.pwd_amount;
                        _tot.reg_no +=_info.no_reg; 
                        _tot.stu_no +=_info.no_stu; 
                        _tot.sc_no  +=_info.no_sc; 
                        _tot.pwd_no +=_info.no_pwd;
                        _tot.total  +=_info.total_paid_amount;
                        _tot.stod   +=_info.start_odo;
                        _tot.edo    +=_info.end_odo;
                        _tot.kms    +=_info.no_kms;
                        _tot.tca    +=_info.total_collection_amt;
                    }
                    //create additional row for total 
                    if(_sqlCode ==="V1349"){
                        var _total = {
                                 trip_no                : ""
                                ,vehicle_plate_no       : ""
                                ,driver_name            : ""
                                ,pao_name               : ""
                                ,start_date             : ""
                                ,end_date               : "Total Amount"
                                ,start_odo              : _tot.stod
                                ,end_odo                : _tot.edo
                                ,no_kms                 : _tot.kms
                                ,total_collection_amt   : _tot.tca 
                        };
                         _rows.push(_total);
                    }else{
                        var _total = {
                                 payment_date       : ""
                                ,inspector_id       : ""
                                ,route_code         : ""
                                ,from_location      : ""
                                ,to_location        : ""
                                ,no_klm             : "Total Amount"
                                ,no_reg             : _tot.reg_no
                                ,no_stu             : _tot.stu_no
                                ,no_sc              : _tot.sc_no
                                ,no_pwd             : _tot.pwd_no
                                ,reg_amount         : _tot.reg
                                ,stu_amount         : _tot.stu
                                ,sc_amount          : _tot.sc
                                ,pwd_amount         : _tot.pwd
                                ,total_paid_amount  : _tot.total
                                ,post_id            : ""
                                ,qr_id              : ""
                                ,driver             : ""
                                ,pao                : ""
                                ,vehicle_plate_no   : ""
                        };
                         _rows.push(_total);
                    } 
    
                    $("#nav-recentCollection").find("select[id='trip_no']").fillSelect({
                         data   : _rows
                        ,text   : "trip_no"
                        ,value  : "trip_id"
                    });
                    $("#nav-recentCollection").find("select[id='dailyFare_vehicle']").fillSelect({
                         data   : _rows
                        ,text   : "vehicle_plate_no"
                        ,value  : "vehicle_id"
                    });
                    $("#nav-recentCollection").find("select[id='dailyFare_driver']").fillSelect({
                         data   : _rows
                        ,text   : "driver_name"
                        ,value  : "driver_id"
                    });
    
                    $(_$navGrid).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 500
                        ,dataRows       : _getDataRows()
                        ,onComplete: function(o){
                            var _this = this; 
                            this.find("input").attr("readonly",true);
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                    }
                });
    
            }
        });
    }
    
    function getDataRowsByStatus(statusId){
        //statusId: 1 =  for posting, 2= posted
        var _dataRows =[
             {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}	 
    		,{id: 2  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
    		,{id: 3  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
    		,{id: 4  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
    		,{id: 5  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
    		,{id: 6  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
    		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
            ,{text: "Payment Date"                                                      ,width : 150          ,groupId : 1
                ,onRender: function(d){
                    return app.bs({name: "payment_date"         ,type: "input"     ,value: app.svn(d,"payment_date")    ,style : "text-align:center;"})
                        +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                }
            }
                            
        ];
       
        _dataRows.push(
             {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "PAO"                       ,name:"pao_name"                ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Driver"                    ,name:"driver_name"             ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Inspector"                 ,name:"inspector_id"            ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Route"                     ,name:"route_code"              ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "From"                      ,name:"from_location"           ,type:"input"       ,width : 200   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "To"                        ,name:"to_location"             ,type:"input"       ,width : 200   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Distance(Km)"                  ,name:"no_klm"              ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Quantity"                  ,name:"no_reg"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 2}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 2
                ,onRender: function(d){
                    return app.bs({name: "reg_amount"          ,type: "input"   ,value: app.svn(d,"reg_amount").toMoney()    ,style : "text-align:center;"});
                }
            }
            ,{text: "Quantity"                  ,name:"no_stu"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 3}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 3
                ,onRender: function(d){
                    return app.bs({name: "stu_amount"          ,type: "input"     ,value: app.svn(d,"stu_amount").toMoney()    ,style : "text-align:center;"    ,width : 60});
                }
            }
            ,{text: "Quantity"                  ,name:"no_sc"                   ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 4}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 4
                ,onRender: function(d){
                    return app.bs({name: "sc_amount"          ,type: "input"     ,value: app.svn(d,"sc_amount").toMoney()    ,style : "text-align:center;"      ,width : 60});
                }
            }
            ,{text: "Quantity"                  ,name:"no_pwd"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 5}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 5
                ,onRender: function(d){
                    return app.bs({name: "pwd_amount"          ,type: "input"   ,value: app.svn(d,"pwd_amount").toMoney()    ,style : "text-align:center;"  ,width : 60});
                }
            }
            ,{text: "Total Amount"                                                                  ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"       ,groupId : 6
                ,onRender: function(d){
                    return app.bs({name: "total_paid_amount"   ,type: "input"   ,value: app.svn(d,"total_paid_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;" ,width : 60});
                }
            }
            //,{text: "Payment Type"               ,name:"payment_type"           ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 7}
                        
        );
        
        return _dataRows;
    }
    
    _pub.showModalForPostingSummary = function(vehicle_id, vehicle_plate_no){
        var _tabH = $("#nav-tabContent").height();
        var _$mdl = $('#modalForPostingSummary');
        _$mdl.modal('show');
        _$mdl.find("#modalTitle").text("Vehicle Plate No.:" + vehicle_plate_no);
        _$mdl.find(".modal-content").height(_tabH-5);
    
    	$("#nav-forPosting").addClass("after_modal_appended");
    
    	//appending modal background inside the blue div
    	$('.modal-backdrop').appendTo('#nav-forPosting');   
    
    	//remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
    
    	$('body').removeClass("modal-open")
   	 	$('body').css("padding-right","");     
         
        displayForPostingSummary(vehicle_id);
    }
    _pub.showModalPostedSummary = function(post_id, post_no){
        var _tabH = $("#nav-tabContent").height();
        var _$mdl = $('#modalPostedSummary');
        _$mdl.modal('show');
        _$mdl.find("#modalTitle").text("Post Id :" + post_no);
        _$mdl.find(".modal-content").height(_tabH-5);
   
    	$("#nav-posted").addClass("after_modal_appended");
    
    	//appending modal background inside the blue div
    	$('.modal-backdrop').appendTo('#nav-posted');   
    
    	//remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
    
    	$('body').removeClass("modal-open")
   	 	$('body').css("padding-right","");     
         
        displayPostedSummary(post_id);
    }
    _pub.showModalPostedSummaryDtl = function(post_id, vehicle_id, vehicle_plate_no){
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
    
    	$('body').removeClass("modal-open")
   	 	$('body').css("padding-right","");     
         
        displayPostedSummaryDtl(post_id, vehicle_id);
    }

    $("#btnSaveTransations").click(function () {
    $("#gridTransactions").jsonSubmit({
       procedure: "payment_posting_upd"
      ,notIncludes : ["payment_date","vehicle_plate_no","pao","driver","inspector_id","route_id","from_location","to_location","no_klm","no_reg","reg_amount","no_stu","stu_amount","no_sc","sc_amount","no_pwd","pwd_amount","total_paid_amount","payment_type","route_code"]
      ,onComplete: function (data) {
          displayTransactions();
          displayPostedTransactions();
          if(data.isSuccess===true) zsi.form.showAlert("alert");
          
            $("#gridTransactions").convertToTable(
                function($table){
                    $("#ExcelgridTransactions").find("th").remove();
                    setTimeout(function(){
                        var _confirmation = confirm("Do you want to print this data?");
                        if (_confirmation === true) {
                            var mywindow = window.open('', 'PRINT');
                            mywindow.document.write('<html><head><style>table,th,td{border: 1px solid black;text-align:center;}</style></head><body>');
                            mywindow.document.write('<div style="text-align:center;"><h1>LAMADO TRANSPORATION</h4></div>');
                            mywindow.document.write('<div style="text-align:center;"><h4>Run Date: '+gDate+'</h4></div>');
                            mywindow.document.write('<table style="border-collapse: collapse;">');
                            mywindow.document.write('<thead><tr><td colspan="9">&nbsp;</td><td colspan="2">Regular</td><td colspan="2">Student</td><td colspan="2">Senior</td><td colspan="2">PWD</td><td ></td><td></td></tr>');
                            mywindow.document.write('<tr><td>Date</td><td>Vehicle</td><td>PAO</td><td>Driver</td><td>Inspector</td><td>Route</td><td>From</td><td>To</td><td>Distance</td><td>Qty</td><td>Total</td><td>Qty</td><td>Total</td><td>Qty</td><td>Total</td><td>Qty</td><td>Total</td><td>Total Amount</td><td>Payment Type</td></tr></thead>');
                            mywindow.document.write(document.getElementById("ExcelgridTransactions").innerHTML);
                            mywindow.document.write('</table></body></html>');
                            mywindow.document.close();
                            mywindow.focus();
                            mywindow.print();
                            mywindow.close();
                        }
                        return true;
                    }, 1000);
                });
            }
        });
    });
    $("#btnExportTransations").click(function () {
    $("#gridPostedTransactions").convertToTable(
        function($table){
             
            $table.find("th").closest("tr").remove();
            $("#ExcelgridPostedTransactions tbody").before('<thead><tr><th colspan="10"></th><th colspan="2">Regular</th><th colspan="2">Student</th><th colspan="2">Senior</th><th colspan="2">PWD</th><th ></th><th></th></tr>'
                        + '<tr><th>Payment Date</th><th>Posted Date</th><th>Vehicle</th><th>PAO</th><th>Driver</th><th>Inspector</th><th>Route</th><th>From</th><th>To</th><th>Distance</th><th>Qty</th><th>Total</th><th>Qty</th>'
                        + '<th>Total</th><th>Qty</th><th>Total</th><th>Qty</th><th>Total</th><th>Total Amount</th><th>Payment Type</th></tr></thead>'
            );
            $table.htmlToExcel({
               fileName: "Posted Payments"
           });
        });
    }); 
     
    //for posting tab
    $("#btnFilterCollection").click(function(){  
        getFilters();
        displayDailyFareCollection(gSubTabName);
        setTimeout(function(){
            setFooterFreezed(gzGrid1);
        }, 1000);
    });  
    $("#btnResetDailyFare").click(function(){   
        var  _$filter = $("#nav-recentCollection");
        _$filter.find('#trip_no, #dailyFare_vehicle, #dailyFare_driver').val("") 
        displayDailyFareCollection();
    });
    //posted tab
    $("#btnFilterVal2").click(function(){ 
        var _from = $.trim($("#posted_date_from").val()); 
        var _to = $.trim($("#posted_date_to").val()); 
        displayPostedTransactions(_from,_to,gPaymentId,gRouteId2,gVehicleId2,gDriverId2,gPaoId2);
        setTimeout(function(){
            setFooterFreezed(gzGrid2);
        }, 1000);
    }); 
    $("#btnResetPosted").click(function(){
        $("#paymentTypeId2").val("");
        $("#routeIdPosted").val(null).trigger('change');
        $("#vehicleRemitted").val(null).trigger('change');
        $("#driverIdPosted").val(null).trigger('change');
        $("#PAOForRemitted").val(null).trigger('change');
        displayPostedTransactions();
    });

    zsi.ready = function(){ 
        $(".page-title").html("Fare Collections");
        $(".panel-container").css("min-height", $(window).height() - 190);
        dateValidation();
        displayForPosting();
        displayPostedTransactions(); 
        //dropdowns();  
    };
    return _pub;
})();                                                                                                