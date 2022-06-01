var devices = (function(){
    var _pub            = {}
        ,gCompanyCode   = "";
    
    zsi.ready = function(){
        $(".page-title").html("Devices");
        displayDevices();
       
        if(app.userInfo.company_id === 0) $("#companyLogo").attr({src: base_url + 'img/logo.png'});
        else $("#companyLogo").attr({src: base_url + 'dbimage/ref-0001/client_id/' + app.userInfo.company_id + "/company_logo" }); 
        zsi.getData({
             sqlCode    : "G1413" 
            ,parameters  : {client_id: app.userInfo.company_id} 
            ,onComplete : function(d) {
                var _hashKey = d.rows[0].hash_key;
                var _clientName = d.rows[0].client_name;
                
                $("#clientName").text("");
                $("#clientName").text(_clientName);
                $("#clientQRCode").text("");
                if(_hashKey){ var qrcode = new QRCode($("#clientQRCode").get(0),{width:150,height:150}).makeCode(_hashKey);}
                $("#clientQRCode").attr("title","");
                
            }
        });
    };
    
    
    function displayDevices(){
        var _cb = app.bs({name:"cbFilter",type:"checkbox"}); 
        var _ctr = 1;
        var _searchVal = $("#searchValDevice").val();
        var _isAdmin  = app.userInfo.is_admin;
        var _isDev    = app.userInfo.is_developer;
        $("#gridDevices").dataBind({
             sqlCode        : "D1214"
            ,parameters     : {company_id: app.userInfo.company_id,searchVal:_searchVal? _searchVal : ""} 
            ,height         : $(window).height() - 491      
            ,blankRowsLimit : _isAdmin==="Y" || _isDev ==="Y" ? 5 : 0
            ,dataRows       : [
                {text: _cb                                                                    ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                          return app.bs({name:"device_id"                 ,type:"hidden"      ,value: app.svn(d,"device_id")})
                               + app.bs({name:"is_edited"                 ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                               + (d !== null ? app.bs({name:"cb"          ,type:"checkbox"}) : "" );
                     }
                }
                ,{text:"Item No."                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            return _ctr++;
                    }
                }
                ,{text:"View QR"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='devices.showModalViewQR(this,\""+ app.svn (d,"hash_key") +"\",\""+ app.svn (d,"serial_no") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Device Id"                                                                          ,width: 60      ,style: "text-align:center;"
                    ,onRender   : function(d){
                        return app.svn(d,"device_id");
                    }
                }
                ,{text: "Serial No."                           ,name:"serial_no"         ,type:"input"        ,width: 160      ,style: "text-align:center;"}
                ,{text: "Mobile No."                           ,name:"mobile_no"         ,type:"input"        ,width: 120      ,style: "text-align:center;"}
                ,{text: "Load Date"                                                                           ,width: 100      ,style: "text-align:center;"
                    ,onRender   : function(d){
                         return app.bs({name:"load_date"             ,type:"input"       ,value: app.svn(d,"load_date").toShortDate()        ,style: "text-align:center;"});
                    }
                }
                ,{text: "Registered?"                               ,name: "is_active"              ,type:"yesno"       ,width : 80    ,style : "text-align:center;" ,defaultValue:"N"}
            ]
            ,onComplete: function(){
                _ctr = 1;
                var _this = this;
                _this.find("[name='cbFilter']").setCheckEvent("#gridDevices input[name='cb']");
            }
        });
    }
    
    function displayInactive(id){ 
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
         $("#gridInactiveDevices").dataBind({
    	     sqlCode        : "D1214"
            ,parameters     : {company_id:app.userInfo.company_id,is_active: "N"}
            ,height         : 360
            ,dataRows       : [
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return      app.bs({name:"device_id"          ,type:"hidden"      ,value: app.svn(d,"device_id")})
                                    + app.bs({name:"is_edited"          ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                    + app.bs({name:"company_code"       ,type:"hidden"      ,value: id}) 
                                    + (d !==null ? app.bs({name:"cb"    ,type:"checkbox"}) : "" );
                            
                        }
                }
                ,{text: "Mac Address"                 ,width : 250   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"mac_address"           ,type:"input"       ,value: app.svn(d,"mac_address")})
                                 + app.bs({name:"serial_no"             ,type:"hidden"      ,value: app.svn(d,"serial_no")}) 
                                 + app.bs({name:"device_desc"           ,type:"hidden"      ,value: app.svn(d,"device_desc")}) ;
                                 
                        }
                }
                ,{text: "Active?"                       ,name:"is_active"               ,type:"yesno"       ,width : 50    ,style : "text-align:left;" ,defaultValue:"N"}
            ]
    	    ,onComplete: function(o){
    	        var _zRow = this.find(".zRow");
    	        _zRow.find("[name='mac_address']").attr('readonly',true);
                this.find("[name='cbFilter1']").setCheckEvent("#gridInactiveDevices input[name='cb']");
                
            }
        });  
    }
    
    _pub.showModalViewQR = function (eL,hashKey,serialNo) {
        var _frm = $("#frm_modalQR");
        _frm.find("#serialNo").find("u").text(serialNo);
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:150,height:150}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
        
        $('#modalViewQR').modal({ show: true, keyboard: false, backdrop: 'static' });
    };
    
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
    
    $("#btnInactive").click(function(){
       var _$body = $("#frm_modalInactive").find(".modal-body"); 
        g$mdl = $("#modalInactiveDevices");
        g$mdl.find(".modal-title").text("Inactive Devices") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactive(gCompanyCode);
    });
    
    $("#btnSaveInactiveDevice").click(function () {
       $("#gridInactiveDevices").jsonSubmit({
             procedure: "devices_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) { 
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridDevices").trigger("refresh");
                $('#modalInactiveDevices').modal('toggle');
            }
        });
    });
    $("#btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "ref-00014"
            ,onComplete : function(data){
                    $("#gridDevices").trigger("refresh");
           }
        });       
    });
    $("#btnDeleteDevices").click(function(){
        zsi.form.deleteData({
             code       : "ref-00014"
            ,onComplete : function(data){
                    $("#gridDevices").trigger("refresh");
                    $('#modalInactiveDevices').modal('toggle');
           }
        });       
    });
    
    return _pub;
})();                           