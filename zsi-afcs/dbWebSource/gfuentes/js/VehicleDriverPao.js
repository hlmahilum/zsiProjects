 var vehicledriverpao = (function(){
    var   bs                    = zsi.bs.ctrl 
        ,svn                    = zsi.setValIfNull 
        ,bsButton               = zsi.bs.button
        ,tblName                = "tblusers"
        ,_public                = {}
        ,gCompanyId             = app.userInfo.company_id
        ,gSubTabName            = ""
        ,gSqlCode               = ""
        ,gActiveTab             = ""
        ,gFullName              = ""
        ,gDataRows
        ,gClientName
        ,gGridId                = ""
        ,gId                    = 0
        ,gPlateNo
        ,gVehicleId             = null
    ;
   
    zsi.ready = function(){
        $(".page-title").html("Vehicle Driver/PAO");
        displayRoutes();
        if(app.userInfo.company_id === 0){
            $("#companyLogo").attr({src: base_url + 'img/logo.png'});
            $("#logoImg").attr({src: base_url + 'img/logo.png'});
        }
        else {
            $("#companyLogo").attr({src: base_url + 'dbimage/ref-0001/client_id/' + app.userInfo.company_id + "/company_logo" }); 
            $("#logoImg").attr({src: base_url + 'dbimage/ref-0001/client_id/' + app.userInfo.company_id + "/company_logo" }); 
        }
        zsi.getData({
             sqlCode    : "G1413" 
            ,parameters  : {client_id: app.userInfo.company_id} 
            ,onComplete : function(d) {
                var _hashKey = d.rows[0].hash_key;
                var _clientName = d.rows[0].client_name;
                gClientName = _clientName;
                $("#clientName").text("");
                $("#clientName").text(_clientName);
                $("#clientQRCode").text("");
                if(_hashKey){ var qrcode = new QRCode($("#clientQRCode").get(0),{width:150,height:150}).makeCode(_hashKey);}
                $("#clientQRCode").attr("title","");
                
            }
        });
        $("#route_id").select2({placeholder: "ROUTE",allowClear: true});
    }; 
    gSubTabName = $.trim($(".sub-nav-tabs-drivers").find(".nav-link.active").text());  
    gActiveTab = $.trim($(".main-nav-tabs").find(".nav-link.active").text());  
    $("#searchVal").attr('placeholder','Search vehicles...');
    $("#searchDiv").removeClass("hide");
    $(".main-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
        gActiveTab = $.trim($(e.target).text());
        
        if(gActiveTab === "PAO"){
            gRoleId = 2; 
            gPosition = 4;  
            $("#searchDiv").addClass("hide");
            gGridId = "#gridPAO"
            displayPAO();
            
        }
        if(gActiveTab === "Drivers"){
            gPosition = 3;
            gRoleId = 1;     
            $("#searchVal").attr('placeholder','Search drivers...');
            $("#searchDiv").removeClass("hide");
            gGridId = "#gridDriversLicensed"
            displayDrivers();
        }
        if(gActiveTab === "Vehicles"){
            $("#searchVal").attr('placeholder','Search vehicles...');
            $("#searchDiv").removeClass("hide");
            $("#route_id").dataBind({
                sqlCode      : "D1425"
               ,text         : "route"
               ,value        : "route_id"
            });
            displayVehicles(); 
        }
        if(gActiveTab === "Devices"){
            $("#searchVal").attr('placeholder','Search vehicles...');
            $("#searchDiv").removeClass("hide"); 
            displayDevices();
        }
    });  
    $(".sub-nav-tabs-drivers").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text());
        displayDrivers();   
    });  
    $(".nav-tab-vhs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text());  
        displayVehicles();   
    }); 
    
    function toExcelFormat(html){
        return "<html><head><meta charset='utf-8' /><style> table, td {border:thin solid black}table {border-collapse:collapse;font-family:Tahoma;font-size:10pt;}</style></head><body>"
             + html + "</body></html>";
    }
    function getFilters(){ 
        var  _searchVal     = $.trim($("#searchVal").val()); 
        return {
             client_id  : gCompanyId
            ,searchVal  : _searchVal
        };
    }
    function printQR(id){
        $('#myModal').modal('hide');
        setTimeout(function(){ 
            var _win = window.open('/');
            var _objDoc = _win.document;
            _objDoc.write('<html><body style="text-align:center;">');
            _objDoc.write('<div style="justify-content:center;display:flex;">');
            _objDoc.write( document.getElementById(id).innerHTML ); 
            _objDoc.write('</div>');
            _objDoc.write('</body></html>');
            _objDoc.close();
            _win.focus();
            _win.print();
            _win.close(); 
            
            return true;
        }, 500);
    }
    function displayRoutes(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        $("#gridRoutes").dataBind({
             sqlCode        : "C1422"
            ,height         : $(window).height() - 460
            ,blankRowsLimit : 5
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"client_route_id"       ,type:"hidden"      ,value: app.svn(d,"client_route_id")}) 
                                 + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"client_id"             ,type:"hidden"      ,value: app.userInfo.company_id})
                                 + (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" );
                        }
                }
                ,{text:"Route No."                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalRouteNos(this,"+ app.svn (d,"route_id") +")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Route"                             ,name:"route_id"               ,type:"select"   ,width : 500   ,style : "text-align:left;"}
                //,{text: "Route Number"                    ,name:"route_desc"               ,type:"input"       ,width : 450   ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                $("[name='cbFilter1']").setCheckEvent("#gridRoutes input[name='cb']");
                var _zRow = this.find(".zRow");
                _zRow.find("[name='route_id']").dataBind({
                    sqlCode      : "D1269"
                   ,text         : "route"
                   ,value        : "route_id"
                });
            }
        });
    }
    function displayRouteNos(id){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridRouteNos").dataBind({
             sqlCode        : "R1427" 
            ,parameters     : {route_id:id}
            //,blankRowsLimit : 5
            ,height         : 350         
            ,dataRows       : [
                {text: "Route No."                 ,width : 70   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"route_no_id"             ,type:"hidden"      ,value: app.svn(d,"route_no_id")})
                                 + app.bs({name:"route_id"                ,type:"hidden"      ,value: id}) 
                                 + app.bs({name:"route_no"                ,type:"input"      ,value: app.svn(d,"route_no")}) ;
                                 + app.bs({name:"is_edited"               ,type:"hidden"      ,value: app.svn(d,"is_edited")});
                                 
                        }
                }
                ,{text: "Route Name"                      ,name:"route_name"               ,type:"input"       ,width : 400   ,style : "text-align:left;"}
            ]
            ,onComplete: function(){
                //$("[name='cbFilter']").setCheckEvent("#gridRouteNos input[name='cb']");
            }
        });
    }
    function displayVehicles(){  
        var _cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        var _searchVal = $.trim($("#searchVal").val());  
        var _routeId = $("#route_id").val();
        var ctr=-1
            ,_o = getFilters()
            ,_params = {
                 client_id: _o.client_id
                ,route_id:(_routeId ? _routeId : "")
            };
        
                    
        $("#gridVehicles").dataBind({
             sqlCode     : "V1229"
            ,parameters  : _params
            ,height         : $(window).height() - 500
            ,dataRows       : [
    		    {text: _cb                                                                  ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                         return app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                              + app.bs({name:"dummy1"                   ,type:"hidden"      ,value: app.svn(d,"vehicle_plate_no")})
                              + app.bs({name:"dummy2"                   ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                              + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                              + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                     }
                 }
                //,{ text  : "" , width : 25   , style : "text-center" 
                //    ,onRender  :  function(d)  
                //        { return  (d !==null ? app.bs({name:"rb"       ,type:"radio"   ,style:" width: 13px; margin:0 5px; cursor:pointer;"}) : "" ); }
                //}
                ,{text:"View QR"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewInfoVehicles(this,"+ app.svn (d,"vehicle_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\", \""+ app.svn (d,"vehicle_type_id") +"\",\""+ app.svn (d,"hash_key") +"\",\""+ app.svn (d,"vehicle_img_filename") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text:"Assigned Driver & PAO"                                       ,width:150         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='Assign Driver & PAO' onclick='vehicledriverpao.showModalDriverPaoAssignment(this,"+ app.svn (d,"vehicle_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\")'><i class='fas fa-calendar-alt'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Plate No."                 ,name:"vehicle_plate_no"         ,type:"input"                 ,width : 100   ,style : "text-align:center;"}
                ,{text: "Route Code"                ,name:"route_id"                 ,type:"select"                ,width : 500   ,style : "text-align:left;"}
                ,{text: "Vehicle Type"                                                          ,width : 200   ,style : "text-align:left;"
                            ,onRender  :  function(d)  
                        { return    app.bs({name:"vehicle_type_id"          ,type:"select"      ,value: app.svn(d,"vehicle_type_id")})  
                                 +  app.bs({name:"is_active"                ,type:"hidden"      ,value: app.svn(d,"is_active")});
                        }        
                }
                ,{text:"Odometer Reading"                   ,type:"input"           ,name:"odometer_reading"         ,width:105       ,style:"text-align:center"} 
            ]
            ,onComplete: function(o){
                var _this  = this;
                var _zRow = _this.find(".zRow");
                var _dRows = o.data.rows;
                
                //_zRow.find("input[type='radio']").click(function(){
    	        //    var _i      = $(this).closest(".zRow").index();
    	        //    var _data   = _dRows[_i];
    	        //    gId = _data.vehicle_id? _data.vehicle_id : 0;
    	        //    gPlateNo = _data.vehicle_plate_no;
    	        //    displayAssignDriverAndPao(_data.vehicle_id);
                //});
                
                _this.find("[name='cbFilter1']").setCheckEvent("#gridVehicles input[name='cb']");
                _zRow.find("[name='route_id']").dataBind({
                    sqlCode      : "D1425"
                   ,text         : "route"
                   ,value        : "route_id"
                });
                _zRow.find("[name='vehicle_type_id']").dataBind({
                    sqlCode      : "D1307"
                   ,text         : "vehicle_type"
                   ,value        : "fare_id"
                });
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "transfer_type"
                   ,value        : "transfer_type_id"
                });
                _zRow.find("input[name='cb']").click(function(){
                    if($(this).is(':checked')) $(this).closest(".zRow").find("input[name='is_active']").val("N");
                    else $(this).closest(".zRow").find("input[name='is_active']").val("Y");
                });  
            }
        });
    }
    function displayAssignDriverAndPao(id){
        var cb = app.bs({name:"cbFilter4",type:"checkbox"});
        var _clientId = app.userInfo.company_id;
        var _data = [
                 {shift_id: 1,shift: 1}
                ,{shift_id: 2,shift: 2}
                ,{shift_id: 3,shift: 3}
            ];
        $("#gridDriverPaoAssignment").dataBind({
             sqlCode        : "D1428"
            ,parameters     : {vehicle_id:id,client_id:_clientId}
            ,blankRowsLimit : 5
            ,height         : 270        
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"driver_pao_assignment_id"      ,type:"hidden"      ,value: app.svn(d,"driver_pao_assignment_id")})
                                 + app.bs({name:"is_edited"                     ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"client_id"                     ,type:"hidden"      ,value: _clientId})
                                 + app.bs({name:"vehicle_id"                    ,type:"hidden"      ,value: id}) 
                                 + (d !==null ? app.bs({name:"cb"               ,type:"checkbox"}) : "" );
                        }
                }
                ,{text: "Assignment Date"                                                            ,width : 100        ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"assignment_date"      ,type:"input"      ,value: app.svn(d,"assignment_date").toShortDate()});
                        }
                }
                ,{text: "Driver"                     ,name:"driver_id"          ,type:"select"       ,width : 250        ,style : "text-align:left;"}
                ,{text: "PAO"                        ,name:"pao_id"             ,type:"select"       ,width : 250        ,style : "text-align:left;"}
                ,{text: "Shift No."                  ,name:"shift_id"           ,type:"select"       ,width : 100        ,style : "text-align:left;"}
            ]
            ,onComplete: function(){
                $("[name='cbFilter4']").setCheckEvent("#gridRouteDetails input[name='cb']");
                
                this.find("[name='driver_id']").dataBind({
                     sqlCode     : "D1402"
                    ,text        : "fullname"
                    ,value       : "id"
                });
                this.find("[name='pao_id']").dataBind({
                     sqlCode     : "D1403"
                    ,text        : "fullname"
                    ,value       : "id"
                });
                this.find("[name='shift_id']").fillSelect({
                     data        : _data
                    ,text        : "shift"
                    ,value       : "shift_id"
                });
                this.find("[name='assignment_date']").datepicker({
                     autoclose : false 
                    ,todayHighlight: true 
                    ,startDate: new Date()
                });
            }
        });
    }
    function displayAssignDriverAndPaoHistory(id){
        var cb = app.bs({name:"cbFilter4",type:"checkbox"});
        var _frm = $("#history_frm").val();
        var _to = $("#history_to").val();
        var _clientId = app.userInfo.company_id;
        var _data = [
                 {shift_id: 1,shift: 1}
                ,{shift_id: 2,shift: 2}
                ,{shift_id: 3,shift: 3}
            ];
        $("#gridDriverPaoAssignmentHistory").dataBind({
             sqlCode        : "D1430"
            ,parameters     : {vehicle_id:id,client_id:_clientId,date_frm:(_frm? _frm : ""),date_to:(_to? _to : "")}
            ,height         : 270        
            ,dataRows       : [
                // { text  : cb , width : 25   , style : "text-center" 
                //    ,onRender  :  function(d)  
                //        { return   app.bs({name:"driver_pao_assignment_id"      ,type:"hidden"      ,value: app.svn(d,"driver_pao_assignment_id")})
                //                 + app.bs({name:"is_edited"                     ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                //                 + app.bs({name:"client_id"                     ,type:"hidden"      ,value: _clientId})
                //                 + app.bs({name:"vehicle_id"                    ,type:"hidden"      ,value: id}) 
                //                 + (d !==null ? app.bs({name:"cb"               ,type:"checkbox"}) : "" );
                //        }
                //}
                {text: "Assignment Date"                                                            ,width : 100        ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"assignment_date"      ,type:"input"      ,value: app.svn(d,"assignment_date").toShortDate()});
                        }
                }
                ,{text: "Driver"                     ,name:"driver_id"          ,type:"select"       ,width : 250        ,style : "text-align:left;"}
                ,{text: "PAO"                        ,name:"pao_id"             ,type:"select"       ,width : 250        ,style : "text-align:left;"}
                ,{text: "Shift No."                  ,name:"shift_id"           ,type:"select"       ,width : 100        ,style : "text-align:left;"}
            ]
            ,onComplete: function(){
                //$("[name='cbFilter4']").setCheckEvent("#gridRouteDetails input[name='cb']");
                
                this.find("[name='driver_id']").dataBind({
                     sqlCode     : "D1402"
                    ,text        : "fullname"
                    ,value       : "id"
                });
                this.find("[name='pao_id']").dataBind({
                     sqlCode     : "D1403"
                    ,text        : "fullname"
                    ,value       : "id"
                });
                this.find("[name='shift_id']").fillSelect({
                     data        : _data
                    ,text        : "shift"
                    ,value       : "shift_id"
                });
                this.find("[name='assignment_date']").datepicker({
                     autoclose : false 
                    ,todayHighlight: true 
                });
                this.find("input,select").attr("disabled",true);
            }
        });
    }
    function displayDrivers(){
        var _cb = app.bs({name:"cbFilter2",type:"checkbox"}); 
        var ctr=-1;
        var _$windowHeight = $(window).height()
            ,_sqlCode  = "D1232" 
            ,_o        = getFilters()
            ,_params   = {
                 client_id  : _o.client_id
                ,tab_id     : 1
                ,searchVal  : (_o.searchVal ? _o.searchVal : "")
                ,is_active  : 'Y'
            };
            
        switch(gActiveTab){
            case "Drivers":  
                switch (gSubTabName) {  
                    case "(15)Days for Renewal":  
                        _params.tab_id = 2;
                    break;
                    case "(30)Days for Renewal":  
                        _params.tab_id = 3;
                    break;
                    case "Expired License":  
                        _params.tab_id = 4;
                    break;  
                }
            break; 
        }
                    
        $("#gridDriversLicensed").dataBind({
             sqlCode        : "D1232"
            ,parameters     : _params
    	    ,height         : $(window).height() - 529 
    	    ,selectorType   : "checkbox" 
    	    ,rowsPerPage    : 50
            ,isPaging       : true
            ,dataRows       : [ 
                {text: _cb                                                                  ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                         return app.bs({name:"first_name"               ,type:"hidden"      ,value: app.svn(d,"first_name")}) 
                              + app.bs({name:"last_name"                ,type:"hidden"      ,value: app.svn(d,"last_name")})
                              + app.bs({name:"middle_name"              ,type:"hidden"      ,value: app.svn(d,"middle_name")})
                              + app.bs({name:"name_suffix"              ,type:"hidden"      ,value: app.svn(d,"name_suffix")})
                              + app.bs({name:"emp_hash_key"             ,type:"hidden"      ,value: app.svn(d,"emp_hash_key")})
                              + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                     }
                }
        		,{text:"View QR"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            ctr++; 
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewPaoImage(this,\""+ app.svn (d,"id") +"\",\""+ app.svn (d,"first_name") +"\",\""+ app.svn (d,"last_name") +"\",\""+ app.svn (d,"middle_name") +"\",\""+ app.svn (d,"name_suffix") +"\",\""+ app.svn (d,"img_filename") +"\",\""+ app.svn (d,"emp_hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : ""); 
                    }
                }
                
                ,{text  : "Last Name"     , width : 150           , style : "text-align:center;"    ,sortColNo:4
                    ,onRender : function(d){ 
                        return app.bs({name:"user_id"           ,type:"hidden"      ,value: app.svn(d,"user_id")}) 
                            +  app.bs({name:"client_id"         ,type:"hidden"     ,value: gCompanyId})
                            +  app.bs({name:"emp_hash_key"      ,type:"hidden"      ,value: app.svn(d,"emp_hash_key")}) 
                            +  app.bs({name:"is_edited"         ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"last_name"       ,value: app.svn(d,"last_name")});
                    }
        		}
                ,{text  : "First Name"                                                      ,width: 150           ,style: "text-align:left;"            ,sortColNo:5
                    ,onRender : function(d){ 
                        return app.bs({name:"first_name"                ,type:"input"       ,value: app.svn(d,"first_name")}) 
                            +  app.bs({name:"driver_license_exp_date"   ,type:"hidden"      ,value: app.svn(d,"driver_license_exp_date").toShortDate()}) 
                            +  app.bs({name:"position_id"               ,type:"hidden"      ,value: gPosition});
                    }
                } 
                ,{text  : "Middle Initial"              ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"middle_name"}
                ,{text  : "Name Suffix"                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"name_suffix"}
                ,{text  : "Academy No."                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_academy_no"}
                ,{text  : "License No."                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_license_no"}
                ,{text  : "License Expr. Date"          ,width : 120           ,style : "text-align:center;"          
                     ,onRender : function(d){ 
                        return app.bs({name:"driver_license_exp_date"       ,type:"input"       ,value: app.svn(d,"driver_license_exp_date").toShortDate()}) 
                            +  app.bs({name:"position_id"               ,type:"hidden"      ,value: gPosition});
                    }
                } 
                ,{text  : "Active?"                     ,width : 60            ,style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}  
            ] 
            ,onComplete: function(o){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter2']").setCheckEvent("#gridDriversLicensed input[name='cb']");
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "tranfer_type"
                   ,value        : "tranfer_type_id"
                });
                _zRow.find("[name='bank_id']").dataBind({
                    sqlCode      : "B1245"
                   ,text         : "bank_code"
                   ,value        : "bank_id"
                });
                _zRow.find("[name='driver_license_exp_date']").datepicker({
                     autoclose : true
                    ,todayHighlight: false  
                }).datepicker("setDate",'0');
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "transfer_type"
                   ,value        : "transfer_type_id"
                });
                _zRow.find("input[type='text'],select").attr("disabled",true);
            }
        });
                    
    }
    function displayPAO(){    
        var _cb = app.bs({name:"cbFilter3",type:"checkbox"}); 
        var ctr=-1
            ,_o = getFilters()
            ,_params = {
                 client_id: _o.client_id
                ,searchVal:(_o.searchVal ? _o.searchVal : "")
            };
            
        $("#gridPAO").dataBind({
             sqlCode     : "P1233"
            ,parameters  : _params 
    	    ,height         : $(window).height() - 488
    	    ,selectorType   : "checkbox"
    	    ,rowsPerPage    : 50
            ,isPaging : true
            ,dataRows       : [ 
                {text: _cb                                                                  ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                         return app.bs({name:"first_name"               ,type:"hidden"      ,value: app.svn(d,"first_name")}) 
                              + app.bs({name:"last_name"                ,type:"hidden"      ,value: app.svn(d,"last_name")})
                              + app.bs({name:"middle_name"              ,type:"hidden"      ,value: app.svn(d,"middle_name")})
                              + app.bs({name:"name_suffix"              ,type:"hidden"      ,value: app.svn(d,"name_suffix")})
                              + app.bs({name:"emp_hash_key"             ,type:"hidden"      ,value: app.svn(d,"emp_hash_key")})
                              + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                     }
                }
        		,{text:"View QR"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            ctr++; 
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewPaoImage(this,\""+ app.svn(d,"id") +"\",\""+ app.svn (d,"first_name") +"\",\""+ app.svn (d,"last_name") +"\",\""+ app.svn (d,"middle_name") +"\",\""+ app.svn (d,"name_suffix") +"\",\""+ app.svn (d,"img_filename") +"\",\""+ app.svn (d,"emp_hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : ""); 
                    }
                }
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"      ,sortColNo:4
                    ,onRender : function(d){
                         return app.bs({name:"user_id"          ,type:"hidden"      ,value: app.svn(d,"user_id")}) 
                            +  app.bs({name:"client_id"         ,type:"hidden"      ,value: _o.client_id})
                            +  app.bs({name:"emp_hash_key"      ,type:"hidden"      ,value: app.svn(d,"hash_key")})   
                            +  app.bs({name:"is_edited"         ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"first_name"        ,type:"input"       ,value: app.svn(d,"first_name")});
                    }
                }
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"       ,sortColNo:6}
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;" 
                    ,onRender : function(d){ 
                        return      app.bs({name:"name_suffix"              ,type:"input"       ,value: app.svn(d,"name_suffix")}) 
                                +   app.bs({name:"position_id"               ,type:"hidden"      ,value:  gPosition});
                    }
                }
                ,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            ]
            ,onPageChange : function(){
                ctr=-1;
            }
            ,onComplete: function(o){ 
                this.find("[name='cbFilter3']").setCheckEvent("#gridPAO input[name='cb']");
                this.find("[name='role_id']").dataBind("roles");
                this.find("input[type='text'],select").attr("disabled",true);
            }
        });    
                    
        
    }  
    function displayDevices(){
        var _ctr = 1;
        $("#gridDevices").dataBind({
             sqlCode        : "D1214"
            ,parameters     : {company_id: app.userInfo.company_id} 
            ,height         : $(window).height() - 460      
            ,dataRows       : [
                {text:"Item No."                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            return _ctr++;
                    }
                }
                ,{text:"View QR"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewQR(this,\""+ app.svn (d,"hash_key") +"\",\""+ app.svn (d,"serial_no") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Device Id"                                                                          ,width: 60      ,style: "text-align:center;"
                    ,onRender   : function(d){
                        return app.svn(d,"device_id");
                    }
                }
                ,{text: "Serial No."                           ,name:"serial_no"         ,type:"input"        ,width: 160     ,style: "text-align:left;"}
                
                ,{text: "Mobile No."                                                                          ,width: 120      ,style: "text-align:center;"
                    ,onRender   : function(d){
                        return app.svn(d,"mobile_no");
                    }
                }
                ,{text: "Load Date"                                                                           ,width: 150      ,style: "text-align:center;"
                    ,onRender   : function(d){
                        return app.svn(d,"load_date");
                    }
                }
                ,{text: "Registered?"                       ,width : 80    ,style : "text-align:center;" ,defaultValue:"Y"
                    ,onRender  :  function(d)  
                    { 
                        var _yesNo = "";
                        if(app.svn(d,"is_active") === "Y") _yesNo = "YES";
                        else _yesNo = "NO";
                        return   _yesNo;
                             
                    }
                }
            ]
            ,onComplete: function(){
                var _this = this;
            }
        });
    }
    
    _public.showModalViewPaoImage = function (eL,id,firstName,lastName,middleName,nameSuffix,fileName,hashKey){ 
        var _frm = $("#frm_modalPao");
        var _middleName = middleName? middleName + "." + " ": "";
        var _nameSuffix = nameSuffix? " " + nameSuffix + "." : "";
        gFullName = firstName + " " + _middleName + lastName + _nameSuffix;
        
        
        _frm.find("#nameId").text(gFullName);
        _frm.find("#qrcodeDriverPao").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcodeDriverPao").get(0),{width:150,height:150}).makeCode(hashKey);}
        _frm.find("#qrcodeDriverPao").attr("title","");
        $('#modalPao').modal({ show: true, keyboard: false, backdrop: 'static' });
        
        
    };  
    _public.showModalViewInfoVehicles = function (eL,id,vehiclePlateNo,vehicleType,hashKey,fileName) {
        var _frm = $("#frm_modalVehicleId");
        _frm.find("#plateNoId").find("u").text(vehiclePlateNo);
        _frm.find("#qrcodeVehicles").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcodeVehicles").get(0),{width:150,height:150}).makeCode(hashKey);}
        _frm.find("#qrcodeVehicles").attr("title","");
        $('#modalVehicleId').modal({ show: true, keyboard: false, backdrop: 'static' });
        
    }; 
    _public.showModalRouteNos = function(eL,id) {
        var _$modal = $("#modalRouteNos");
        var _routeCode = $(eL).closest(".zRow").find('[name="route_id"] option[value="'+id+'"]').text();
        _$modal.find(".modal-title").text("Route » " + _routeCode ) ;
        displayRouteNos(id);
        _$modal.modal({ show: true, keyboard: false, backdrop: 'static' });
        
    };
    _public.showModalDriverPaoAssignment = function(eL,id,plateNo) {
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate() - 1;
        var yesterday = (d.getMonth() + 1) + "/"+day+"/" +    d.getFullYear();
        var _$modal = $("#modalDriverPaoAssignment");
        gVehicleId = id;
        $("#history_frm,#history_to").datepicker({
             autoclose : false 
            ,todayHighlight: false 
            ,endDate: yesterday
        }).datepicker("setDate", yesterday);
        
        _$modal.find(".modal-title").text("Vehicle Plate Number » " + plateNo );
        displayAssignDriverAndPao(id);
        _$modal.modal({ show: true, keyboard: false, backdrop: 'static' });
        
    };
    _public.showModalViewQR = function (eL,hashKey,serialNo) {
        var _frm = $("#frm_modalQR");
        _frm.find("#serialNo").find("u").text(serialNo);
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:150,height:150}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
        
        $('#modalViewQR').modal({ show: true, keyboard: false, backdrop: 'static' });
    };
    
    $("#btnFilterHistory").click(function(){
       displayAssignDriverAndPaoHistory(gVehicleId);
       
       $("#historyId").show(500);
    });
    $(".btnPrintId").click(function(){
        var _$tbody = $("#qrTable > tbody");
        var _style = "text-align:center;border:1px solid black;margin-left: 10px; margin-top: 10px;height: 324px !important;width: 204px !important;";
        var _createQR = function(text){new QRCode(document.getElementById(text), {width:124, height:124}).makeCode(text);}
        var obj = {};
        var _data = [];
        var  _row= $(gGridId).find("[name='cb']:checked").parent(".zCell");
        
        for(var x =0; x < _row.length; x++){
            var _rows = _row[x];
            var _inputs = $(_rows).find("input");
            var arr = [].map.call( _inputs, function( input ) {
                return input.value;
            }).join( ',' );
            var data = arr.split(",");
            
            obj = {
                 first_name     : data[0]
                ,last_name      : data[1]
                ,middle_name    : data[2]
                ,name_suffix    : data[3]
                ,emp_hash_key   : data[4]
            }
            
            _data.push(obj);
        }
        
        
        var _getData = function(cb){
            var _arr = [],
                _obj= {},
                _ctr = 0,
                _ctr2 = 0,
                _h = "";  
                
            for(var i=0; i < _data.length; i++ ){
                _ctr++;
                _ctr2++;
                var _o = _data[i];
                
                var _hashKey = _o.emp_hash_key;
                var _nameSuffix = _o.name_suffix? " " + _o.name_suffix + "." : "";
                var _middleName = _o.middle_name? _o.middle_name + "." + " ": ""; 
                var _fulName =  _o.first_name + " " + _middleName + _o.last_name + _nameSuffix;
                
                _h +='<td><div id="empId_'+_o.id+'" style="'+ _style +'">'
                    +'    <div style="justify-content:center;margin-top:17px;margin-bottom:1rem;display:flex;">'
                    +'        <div style="width:96px; height:96px; border:1px solid black;align-items:center;"><span>PHOTO</span></div>'
                    +'    </div>'
                    +'    <div class="text-center" style="margin-bottom:2px;">'
                    +'        <div class="m-0 font-weight-bold" style="font-size:18px !important;padding:0px !important;margin:0px !important;">'+_fulName+'</div>'
                    +'    </div>'
                    +'   <div style="width: 100%;height:auto;justify-content:center;display:flex;">'
                    +'         <div id="'+_hashKey+'"></div>'
                    +'   </div>'
                    +'         <span style="font-size:15px !important; text-align:left !important">'+gClientName+'</span>'
                    +'</div></td>';
                
                _obj["hash" +_ctr] = _hashKey;
                
                if ((_ctr && (_ctr % 3 === 0)) || (_data.length === _ctr2)) {
                    _h = "<tr>"+ _h +"</tr>";
                    _$tbody.append(_h);
                    _arr.push(_obj);
                    _obj = {};
                    _ctr = 0;
                    _h = "";
                }
                
                
            }
            cb(_arr);
               
        };
        _$tbody.html("");
        _getData(function(data){
            for(var i=0; i < data.length; i++){
                var _o = data[i];
                var _hash1  = _o.hash1,
                    _hash2  = (isUD(_o.hash2)? "":_o.hash2),
                    _hash3 = (isUD(_o.hash3)? "":_o.hash3),
                    _hashId1 = _o.hashId1,
                    _hashId2  = (isUD(_o.hashId2)? "":_o.hashId2),
                    _hashId3  = (isUD(_o.hashId3)? "":_o.hashId3);
                
                _createQR(_hash1,_hashId1); 
                if(_hash2) _createQR(_hash2,_hashId2); 
                if(_hash3) _createQR(_hash3,_hashId3);
            }
        }); 
        
        if(_data.length > 0){
            setTimeout(function(){
                $('#myModal').find("#msg").text("Are you sure you want to print this ID's?");
                $('#myModal').modal('show');
            },100);
        }else alert("Please select checkbox to proceed.");
        
    });
    $("#btnPrintSaveId").click(function(){
        printQR("printThis");
    });
    $(".btnPrint").click(function(){
        var _$tbody = $("#qrTable > tbody");
        var _style = "text-align:center;border:1px solid black; padding: 8px; margin-left: 5px; margin-top: 5px;";
        var _createQR = function(text){new QRCode(document.getElementById(text), {width:160, height:160}).makeCode(text);}
        var obj = {};
        var _data = [];
        var  _row= $("#gridVehicles").find("[name='cb']:checked").parent(".zCell");
        
        for(var x =0; x < _row.length; x++){
            var _rows = _row[x];
            var _inputs = $(_rows).find("input");
            var arr = [].map.call( _inputs, function( input ) {
                return input.value;
            }).join( ',' );
            var data = arr.split(",");
            
            obj = {
                 vehicle_plate_no     : data[1]
                ,hash_key             : data[2]
            }
            
            _data.push(obj);
        }
        
        
        var _getData = function(cb){
            var _arr = [],
                _obj= {},
                _ctr = 0,
                _ctr2 = 0,
                _h = "";  
                
            for(var i=0; i < _data.length; i++ ){
                _ctr++;
                _ctr2++;
                var _o = _data[i];
                var _hashKey = _o.hash_key;
                var _plateNo = _o.vehicle_plate_no;
                
                _h += "<td><div style='"+ _style +"'><span style='font-size:20px;'>"+_plateNo+"</span><div id='"+ _hashKey +"'></div><span style='font-size:15px !important; text-align:left !important'>"+gClientName+"</span></div></td>";
                
                _obj["hash" +_ctr] = _hashKey;
                
                if ((_ctr && (_ctr % 3 === 0)) || (_data.length === _ctr2)) {
                    _h = "<tr>"+ _h +"</tr>";
                    _$tbody.append(_h);
                    _arr.push(_obj);
                    _obj = {};
                    _ctr = 0;
                    _h = "";
                }
                
            }
            cb(_arr);
               
        };
        _$tbody.html("");
        _getData(function(data){
            for(var i=0; i < data.length; i++){
                var _o = data[i];
                var _hash1  = _o.hash1,
                    _hash2  = (isUD(_o.hash2)? "":_o.hash2),
                    _hash3 = (isUD(_o.hash3)? "":_o.hash3),
                    _hashId1 = _o.hashId1,
                    _hashId2  = (isUD(_o.hashId2)? "":_o.hashId2),
                    _hashId3  = (isUD(_o.hashId3)? "":_o.hashId3);
                
                _createQR(_hash1,_hashId1); 
                if(_hash2) _createQR(_hash2,_hashId2); 
                if(_hash3) _createQR(_hash3,_hashId3);
            }
        }); 
        
        if(_data.length > 0){
            setTimeout(function(){
                $('#myModal').find("#msg").text("Are you sure you want to print this vehicle QR's?");
                $('#myModal').modal('show');
            },100);
        }else alert("Please select checkbox to proceed.");
    });
    $("#btnPrintId").click(function(){
        printCanvas("printThisId");
    });
    $("#btnFilterVal").click(function(){
       displayVehicles(); 
    });
    $("#download").click(function() { 
        html2canvas($("#printThisId"),{
            onrendered: function(canvas){
                var _imgData = canvas.toDataURL("image/png");
                var _newImgData = _imgData.replace(/^data:image\/png/, "data:application/octet-stream");
                $("#download").attr("download", ""+gFullName+"Id.png").attr("href", _newImgData);
            }
        });
    });
    $("#btnUploadExcel").click(function(){
        var _grid = "#gridVehicles";  
            _fileName = gActiveTab
        $(_grid).convertToTable(function(table){
            var _html = table.get(0).outerHTML; 
            zsi.htmlToExcel({
                fileName: _fileName
                ,html : _html
            });
        }); 
       
    }); 
    $("#btnSaveDevices").click(function () {
        $("#gridDevices").jsonSubmit({
             procedure: "devices_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) { 
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridDevices").trigger("refresh");
            }
        });
    });
    $("#btnInactiveVehicles").click(function(){
       var _$body = $("#frm_modalInactiveVehicles").find(".modal-body"); 
        g$mdl = $("#modalInactiveVehicles");
        g$mdl.find(".modal-title").text("Inactive Vehicles") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveVehicles();
    });
    $("#btnSaveVehicles").click(function () {
        $("#gridVehicles").find("input[name='cb']:checked").closest(".zRow").find("input[name='is_active']").each(function(){this.value = "Y"});
        $("#gridVehicles").jsonSubmit({
             procedure: "vehicle_upd"
            ,notIncludes: ["dummy1","dummy2"]
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridVehicles").trigger("refresh");
            }
        });
    });   
    $("#btnSaveDriverPaoAssignment").click(function () {
        $("#gridDriverPaoAssignment").jsonSubmit({
             procedure: "driver_pao_assignment_upd"
            ,optionalItems: ["driver_id","pao_id","shift_id"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridDriverPaoAssignment").trigger("refresh");
            }
        });
    });   
    $("#btnSaveRoute").click(function () {
       $("#gridRoutes").jsonSubmit({
             procedure: "client_routes_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridRoutes").trigger("refresh");
            }
        });
    });
    $("#btnDeleteRoute").click(function(){ 
        $("#gridRoutes").deleteData({
            tableCode: "ref-00011"
            ,onComplete : function(d){
                $('#gridRoutes').trigger('refresh');
            }
         });      
    });
    $("#btnDeleteDriverPaoAssignment").click(function(){ 
        $("#gridDriverPaoAssignment").deleteData({
            tableCode: "ref-00012"
            ,onComplete : function(d){
                $('#gridDriverPaoAssignment').trigger('refresh');
            }
         });      
    });
    return _public;
})();                                                                                                       