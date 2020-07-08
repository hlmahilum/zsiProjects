 var client = (function(){
    var  _pub               = {}
        ,gClientId          = null
        ,gBatchNoVal        = null
        ,gBatchQty          = null
        ,gClientContractid  = null
        ,gActiveTab         = ""
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Clients");
        $(":input").inputmask();
        displayClients();
        displayClientContracts();
        gActiveTab = "search";
        $('#keyWord').select2({placeholder: "SELECT KEY WORD",allowClear: true});
        
    };
    
    $('#keyWord').on("keyup change", function(){
        var _this = $(this);
        if(_this.val() === "client_name"){
            $("#keyValue").attr("placeholder", "Enter Client Name......");
            $("#keyValue").val("");
        }
        else{
            $("#keyValue").val("");
            $("#keyValue").attr("placeholder", "Enter Contract No......");
        }
    });
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href");
        switch(target){
            case "#nav-search":
                gActiveTab = "search";
                $("#searchVal").val("");
                break;
            case "#nav-new":
                gActiveTab = "new";
                $("#searchVal").val("");
                break;
          default:break;
      }
    });
    
    function displayClients(){
        $("#gridClients").dataBind({
             sqlCode     : "C241"
            ,height      : $(window).height() - 278
            ,dataRows    : [
                {text: "Code", width: 130, style: "text-align:center"
                    ,onRender : function(d){ 
                        return app.svn (d,"client_code");
                    }
                }
                ,{text: "Name", width : 250, style: "text-align:left"
                    ,onRender : function(d){ 
                        return app.svn (d,"client_name");
                    }
                }
                ,{text: "Phone No.", width: 120, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"client_phone_no");
                    }
                }
                ,{text: "Mobile No.", width: 120, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"client_mobile_no");
                    }
                }
                ,{text: "Email Address", width: 200, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"client_email_add");
                    }
                }
                ,{text: "Billing Address", width: 300, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"billing_address");
                    }
                }
            ]
            ,onComplete  : function(o){
                
            }
        });
    }
    
    function displayClientContracts(keyword,searchVal){
        var _ctr = 1;
        $("#gridClientContracts").dataBind({
                 sqlCode    : "C1284"
                ,parameters  : {keyword:keyword,search_val: searchVal} 
                ,height     : $(window).height() - 276
                ,blankRowsLimit : 0
                ,dataRows   : [
                    { text  : "" , width : 25   , style : "text-center" 
                        ,onRender  :  function(d)  
                            { return  (d !==null ? app.bs({name:"rb"       ,type:"radio"   ,style:" width: 13px; margin:0 5px; cursor:pointer;"}) : "" ); }
                    }
                    ,{text: "Line No."         ,width:60                   ,style:"text-align:center"
                         ,onRender : function(d){
                             return app.bs({name:"client_contract_device_id"    ,type:"hidden"                  ,value: app.svn(d,"client_contract_device_id")}) 
                                +   app.bs({name:"is_edited"                    ,type:"hidden"                  ,value: app.svn(d,"is_edited")})
                                +   _ctr++;
                         }
                     }
                    ,{text:"Client Name"                                                                    ,width:250          ,style:"text-align:left"
                        ,onRender : function(d){
                             return app.bs({name:"client_name"                    ,type:"input"                  ,value: app.svn(d,"client_name")}) ;
                         }
                    }
                    ,{text:"Contract Number"            ,type:"input"       ,name:"contract_no"             ,width:150          ,style:"text-align:center"
                        , onRender      : function(d) {
                            var _contractNo = (app.svn(d,"contract_no") ? app.svn(d,"contract_no") : '<i class="fa fa-plus" aria-hidden="true" ></i>');
                            return "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='client.showModalContracts(this," + _ctr + ", \""+ app.svn (d,"client_contract_id") +"\", \""+ app.svn (d,"client_name") +"\", \""+ app.svn (d,"contract_no") +"\", \""+ app.svn (d,"client_id") +"\", \""+ app.svn (d,"contract_date").toShortDate() +"\", \""+ app.svn (d,"contract_term_id") +"\", \""+ app.svn (d,"activation_date").toShortDate() +"\", \""+ app.svn (d,"expiry_date").toShortDate() +"\", \""+ app.svn (d,"plan_id") +"\", \""+ app.svn (d,"plan_qty") +"\", \""+ app.svn(d,"srp_amount") +"\", \""+ app.svn(d,"dp_amount") +"\");'>" + _contractNo + "</a>";
                        }
                    }
                    ,{text:"Contract Date"                                                                          ,width:100           ,style:"text-align:center"
                        ,onRender : function(d){
                             return app.bs({name:"contract_date"                    ,type:"input"                  ,value: app.svn(d,"contract_date").toShortDate()});
                         }
                    }
                  ]
                  ,onComplete : function(o){
                    var _dRows = o.data.rows;
                    var _this  = this;
                    var _zRow  = _this.find(".zRow");
                    
                    _zRow.find("input[type='radio']").click(function(){
        	            var _i      = $(this).closest(".zRow").index();
        	            var _data   = _dRows[_i];
        	            $("#btnNewContracts").attr("onclick", "client.showModalContracts(this, "+_ctr+", '', '"+ _data.client_name +"', '', "+ _data.client_id +",'','','','','','','','')");
                    });
                    
                }
        });
    
    }
    
    function displayClientContractDevice(client_contract_id,qty){
        zsi.getData({
                 sqlCode    : "C272" 
                ,parameters  : {client_contract_id: client_contract_id} 
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _ctr = 1;
                    
                    $("#gridContractss").dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 395
                        ,blankRowsLimit : (qty? qty - _rows.length : 0)
                        ,dataRows       : [
                             {text: "Item No."         ,width:60                   ,style:"text-align:center"
                                 ,onRender : function(d){
                                     return app.bs({name:"client_contract_device_id"    ,type:"hidden"                  ,value: app.svn(d,"client_contract_device_id")}) 
                                        +   app.bs({name:"is_edited"                    ,type:"hidden"                  ,value: app.svn(d,"is_edited")})
                                        +   _ctr++;
                                 }
                             }
                            ,{text:"Subscription No."                                                                 ,width:140          ,style:"text-align:left"
                                ,onRender : function(d){
                                     return app.bs({name:"subscripton_no"               ,type:"input"                  ,value: app.svn(d,"subscripton_no")}) 
                                        +   app.bs({name:"client_contract_id"           ,type:"hidden"                  ,value: (app.svn(d,"client_contract_id")? app.svn(d,"client_contract_id") : client_contract_id)});
                                 }
                            }
                            ,{text:"Device"                ,type:"select"       ,name:"device_id"             ,width:130          ,style:"text-align:left"}
                            ,{text:"Unit Assignment"            ,type:"input"      ,name:"unit_assignment"     ,width:130           ,style:"text-align:center"}
                          ]
                          ,onComplete : function(){
                            var _this = this;
                            
                            if (!qty){
                                _this.find("input").attr("disabled",true);
                                _this.find("select").attr("disabled",true);
                            }
                            _this.find("input,select").prop('required',true);
                            _this.find(".zRow").find("[name='device_id']").dataBind({
                                sqlCode      : "D276" //dd_devices_sel
                               ,text         : "serial_no"
                               ,value        : "device_id"
                            });
                            
                        }
                });
            }
        });
    }
    
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    function displayClientsPlanInclusions(planId){
        var _ctr = 1;
        $("#gridContracts").dataBind({
             sqlCode     : "C1294"
            ,parameters  : {plan_id: planId}
            ,height      : $(window).height() - 395
            ,dataRows    : [
                {text: "Item No."         ,width:60                   ,style:"text-align:center"
                     ,onRender : function(d){
                         return _ctr++;
                     }
                 }
                ,{text: "Product Name", width : 200, style: "text-align:left"
                    ,onRender : function(d){ 
                        return app.svn (d,"product_name");
                    }
                }
                ,{text: "Product Description", width: 250, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"product_desc");
                    }
                }
                
            ]
        });
    }
    
    function commaSeparateNumber(n){
        var _res = "";
        if($.isNumeric(n)){
            var _num = parseFloat(n).toFixed(2).toString().split(".");
            _res = _num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (!isUD(_num[1]) ? "." + _num[1] : "");
        }
        return _res;
    }
    
    _pub.showModalContracts = function (eL,ctr,clientContractId,clientName,contractNo,clientId,contractDate,contractTermId,activationDate,expiryDate,planId,planQty,srpAmt,dpAmt) {
        var _$mdl = $('#modalClientContracts');
        _$mdl.find("#monthly_amort_amount,#total_amort_amount,#less_dp_amount,#srp_amount,#dp_amount").val(0.00);
        $("#plan_id,#contract_term_id").off();
        var _noMos = 0.00
           ,_interest = 0.00
           ,_productSrp = srpAmt? srpAmt : 0.00
           ,_productDp = dpAmt? dpAmt : 0.00
           ,_planId = planId? planId : null
           ,_keyup = "";
        _$mdl.modal('show');
        //gBatchQty = deviceQty;
        _$mdl.find("#dp_amount").maskMoney({allowZero:true});
        gActiveTab = "search";
        gClientContractid = clientContractId;
        
        $("#modalTitle").text(clientName + " " + "|" + " " + contractNo);
        $('#client_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        $('#plan_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        $('#contract_term_id').select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        
        _$mdl.find("#dp_amount").on('keyup change', function(){
           $(this).each(function(){_productDp = parseInt(this.value.replace(/,/g, ""));});
           _keyup = 'keyup';
           totalAmt();
        });
         
        $("#client_id").dataBind({
            sqlCode      : "D243" 
           ,text         : "client_name"
           ,value        : "client_id"
           ,onComplete   : function(){
               this.val(clientId? clientId: "").trigger('change');
           }
        });
        
        $("#contract_term_id").dataBind({
            sqlCode      : "D1291"
           ,text         : "term_code"
           ,value        : "term_id"
           ,onComplete   : function(d){
               this.val(contractTermId? contractTermId : "").trigger('change');
           }
           ,onChange     : function(d){
               var  _$this         = $(this)
                   ,_info          = d.data[d.index - 1];
                   
               _noMos  = isUD(_info) ? "" : _info.no_months;
               _interest  = isUD(_info) ? "" : _info.interest_pct;
               totalAmt();
           }
        });
         
        $("#plan_id").dataBind({
            sqlCode      : "D256"
           ,text         : "plan_name"
           ,value        : "plan_id"
           ,onChange     : function(d){
                var  _$this         = $(this)
                    ,_info          = d.data[d.index - 1];
                    
                _planId       = isUD(_info) ? "" : _info.plan_id;       
                _productSrp   = isUD(_info) ? "" : _info.plan_srp;
                _productDp    = isUD(_info) ? "" : _info.plan_dp;
                totalAmt();
                
                displayClientsPlanInclusions(_planId);
                
           }
           ,onComplete   : function(){
               this.val(_planId).trigger('change');
           }
        });
        
        function totalAmt(){
            setTimeout(function(){
               _$mdl.find("#srp_amount").val(commaSeparateNumber(_productSrp));
               if(!_keyup) _$mdl.find("#dp_amount").val(commaSeparateNumber(_productDp));
               _$mdl.find("#less_dp_amount").val(commaSeparateNumber(_productSrp - _productDp));
               _$mdl.find("#total_amort_amount").val(commaSeparateNumber((_productSrp * _interest/100) + _productSrp));
               _$mdl.find("#monthly_amort_amount").val(commaSeparateNumber((_productSrp * _interest/100) + _productSrp/_noMos));
            });
        }
        
        $("input[name$='date']").datepicker({ pickTime:false,autoclose:true,todayHighlight:true}).datepicker("setDate","0");  
        _$mdl.find("#client_contract_id").val(clientContractId? clientContractId: "");
        _$mdl.find("#contract_no").val(contractNo? contractNo : "");
        _$mdl.find("#contract_date").datepicker("setDate", contractDate? contractDate : "0");
        _$mdl.find("#activation_date").datepicker("setDate", activationDate? activationDate : "0");
        _$mdl.find("#expiry_date").datepicker("setDate", expiryDate? expiryDate : "0");
        
        gBatchNoVal = clientContractId;
        //displayClientContractDevice(clientContractId);
    };
    
    
    $("#searchOption").on("change", function(){
        var _this = $(this);
        if(_this.val() === "name") $("#searchVal").attr("placeholder", "Type client name......");
        else $("#searchVal").attr("placeholder", "Type contract number......");
    });
    
    
    $("#btnSubmit").click(function () {
        var _$frm = $("#formClients");
        var _frm = _$frm[0];
        var _formData = new FormData(_frm);  
        if( ! _frm.checkValidity() ){
            $("#formClients").addClass('was-validated');
        }else{   
            $("#formClients").removeClass('was-validated');
            $('#myModal').modal('show');
        }
    });
    
    $("#btnNew").click(function() {
        var _$mdl = $('#newClientModal');
        if($(window).height() <= 724 ) $("#clientInformationDiv").css({"height":$(window).height() - 208,"overflow-y":"auto","overflow-x":"hidden"});
        //else $("#clientInformationDiv").css({"height":$(window).height() - 578,"overflow-y":"auto","overflow-x":"hidden"}); 
        _$mdl.modal('show');
        gActiveTab = "new";
        var _$frm = _$mdl.find("form");
        var _$country = _$mdl.find('#country_id')
            ,_$state = _$mdl.find('#state_id')
            ,_$city = _$mdl.find('#city_id');
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        _$mdl.find(".modal-footer").addClass("justify-content-start");
        $("#formClients").find("input[type='text'],input[type='email'],select").val("");
        $("#registration_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            , startDate: new Date()
        }).datepicker("setDate","0");
        _$country.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$state.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$city.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        $("#bank_id").select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
        _$country.dataBind({
            sqlCode : "D247"
            ,text : "country_name"
            ,value : "country_id"
            ,onChange : function(d){
                var _info = d.data[d.index - 1]
                    ,country_id = isUD(_info) ? "" : _info.country_id;
                
                _$state.dataBind({
                    sqlCode : "D248"
                    ,parameters : {country_id:country_id}
                    ,text : "state_name"
                    ,value : "state_id"
                    ,onChange : function(d){
                        var _info = d.data[d.index - 1]
                            ,state_id = isUD(_info) ? "" : _info.state_id;
                           
                        _$city.dataBind({
                            sqlCode      : "D246"
                            ,parameters   : {state_id:state_id}
                            ,text         : "city_name"
                            ,value        : "city_id"
                            ,onChange     : function(d){
                                var _info = d.data[d.index - 1]
                                    ,city_id = isUD(_info) ? "" : _info.city_id;
                            }
                        });
                    }
                });
            }
        });
    });
    
    $("#is_ready").click(function(){
       if($(this).is(":checked")){
           $("#clientInformationDiv").toggle("top");
           $("#adminUserDiv").toggle("top");
       }else{
           $("#clientInformationDiv").toggle("down");
           $("#adminUserDiv").toggle("down");
       } 
    });
    
    $(".continuecancel").click(function(){
        $("#myModal").modal('toggle');
        modalTxt();
        $(".yesno").removeClass("hide");
        $(this).addClass("hide");
        $("#is_ready").prop('checked', false);
        $("#clientInformationDiv").toggle("down");
        $("#adminUserDiv").toggle("down");
        $(".continuecancel").addClass("hide");
         setTimeout(function(){
            $("#btnConfirm").removeAttr("onclick");
        },1000);
        
    });
    
    $("#btnSave").click(function (){
        if(gActiveTab === "search"){
            var _frm = $("#formContract");
            _frm.find("#srp_amount,#dp_amount").maskMoney('destroy');
            var _$monthlyAmort = _frm.find("#monthly_amort_amount")
                ,_$totalAmort = _frm.find("#total_amort_amount")
                ,_$lessDpAmt = _frm.find("#less_dp_amount")
                ,_$srpAmt = _frm.find("#srp_amount")
                ,_$dpAmt = _frm.find("#dp_amount");
                
                _$monthlyAmort.each(function(){this.value = this.value.replace(/,/g, "");});
                _$totalAmort.each(function(){this.value = this.value.replace(/,/g, "");});
                _$lessDpAmt.each(function(){this.value = this.value.replace(/,/g, "");});
                _$srpAmt.each(function(){this.value = this.value.replace(/,/g, "");});
                _$dpAmt.each(function(){this.value = this.value.replace(/,/g, "");});
            
            
            _frm.jsonSubmit({
                 procedure: "client_contracts_upd"
                ,isSingleEntry: true
                ,onComplete: function (data) {
                    gBatchNoVal = data.returnValue;
                    console.log("gBatchNoVal",gBatchNoVal);
                    gBatchQty = $("#formContract").find("#device_qty").val();
                    if(data.isSuccess){
                      if(data.isSuccess===true) zsi.form.showAlert("alert");
                      //displayClientContractDevice(gBatchNoVal,gBatchQty);
                      $("#formContract").find("#batchId").text(gBatchNoVal);
                      $("#myModal").find("#msg").text("Data successfully saved.");
                      $("#myModal").find("#msg").css("color","green");
                      modalTxt();
                      setTimeout(function(){
                          $("#myModal").modal('toggle');
                      },1000);
                    }else{
                      $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                      $("#myModal").find("#msg").css("color","red");
                      modalTxt();
                    }
                }
            }); 
        }else{
            var _$div1 = $("#clientInformationDiv");
            var _$div2 = $("#adminUserDiv");
            _$div2.find("input,select").attr("disabled", true);
            var _$frm = $("#formClients"); 
            _$frm.jsonSubmit({
                 procedure: "clients_upd" 
                ,isSingleEntry: true
                ,onComplete: function (data) {
                    var _clientName = $("#client_name").val();
                    gClientId = data.returnValue;
                    if(data.isSuccess){
                        if(data.isSuccess===true) zsi.form.showAlert("alert");
                        _$div1.find("input,select").attr("disabled", true);
                        _$div2.find("input,select").removeAttr("disabled");
                        _$frm.find("#clientId").val(gClientId);
                        $("#newClientModal").modal('toggle');
                        displayClients();
    			        setTimeout(function(){
        			        _$frm.jsonSubmit({
                                 procedure: "admin_user_upd" 
                                ,isSingleEntry: true
                                ,onComplete: function (data) {
                                    console.log("data",data);
                                    var _userId = data.returnValue;
                                    var _firstName = $("#first_name").val();
                                    var _email = $("#logon").val();
                                    $("#clientPassword").dataBind({
                                        sqlCode    : "D1282" 
                                       ,text       : "password"
                                       ,value      : "user_id"
                                       ,onComplete : function(){
                                           $(this).val(_userId);
                                       }
                                    });
                                     setTimeout (function(){
                                        $("#clientPassword").val(_userId);
                                        var _password = $("#clientPassword").find('option:selected').text();
                                        $("#mail_recipients").val(_email);
                                        $("#ename").val(_firstName);
                                        $("#epassword").val(_password);
                                        if(data.isSuccess){
                                           if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                           _$frm.removeClass('was-validated');
                                           $(".yesno").addClass("hide");
                                           $("#myModal").find("#msg").text("Data successfully saved. Password of the user has been sent to his/her email.");
                                           
                                           $("#myModal").find("#msg").css("color","green");
                                           
                                           $("#btnConfirm").attr("onclick", "client.showModalContracts(this, '', '', '"+ _clientName +"', '', "+ gClientId +")");
                                           $(".continuecancel").removeClass("hide");
                                           _$div1.find("input,select").removeAttr("disabled");
                                           
                                           $("#formEmail").jsonSubmit({
                                                 procedure: "send_mail_upd" 
                                                ,isSingleEntry: true
                                                ,onComplete: function (data) {
                                                    if(data.isSuccess){
                                                       if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                                    }
                                                }
                                            });
                                            
                                            setTimeout(function(){
                                               $("#myModal").find("#msg").text("Do you want to create contract(s) for this client?");
                                               $("#myModal").find("#msg").css("color","#000");
                                            },1500);
                                        }else{
                                           $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                                           $("#myModal").find("#msg").css("color","red");
                                           modalTxt();
                                        }
                                    },2000);
                                    
                                }
                            }); 
                            
    			        },1000);
    			       
                    }
                }
            });
        }
        
        
    });
    
    $("#submit").click(function () {
        var _$frm = $("#formContract");
        var _frm = _$frm[0];
        var _formData = new FormData(_frm);  
        if( ! _frm.checkValidity() ){
            $("#formContract").addClass('was-validated');
        }else{   
            $("#formContract").removeClass('was-validated');
            $('#myModal').modal('show');
        }
    });
    
    $("#btnSaveContracts").click(function(){ 
        $("#gridContracts").jsonSubmit({
             procedure: "client_contract_devices_upd"
            //,optionalItems: ["is_active"] 
            ,onComplete: function (data) { 
               if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                displayClientContractDevice(gClientContractid,gBatchQty);
            } 
        }); 
    });
    
    $("#btnFilterVal").click(function(){
        var _keyWord = $("#keyWord").val();
        var _keyValue = $("#keyValue").val();
        if(_keyWord && _keyValue) $("#contractsDiv").removeClass("hide");
        
        if(gActiveTab === "search") displayClientContracts(_keyWord,_keyValue);
        //else displayClients();
        
    });
    
    $("#btnResetVal").click(function(){
        //displayClientContractDevice();
        $("#formContract").find("#batch_qty").val("");
        $("#formContract").find("#received_by").val(null).trigger('change');
        $("#formContract").find("#batchId").text("");
        $("#received_date").datepicker({ 
              pickTime  : false
            , autoclose : true
            , todayHighlight: true
            //, startDate: new Date()
        }).datepicker("setDate","0");
    })
    
    return _pub;
})();                            