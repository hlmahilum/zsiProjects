   var collections = (function(){
    var  _pub            = {}
        ,gTotal          = ""
        ,gDate           = ""
        ,gPaoId1         = ""
        ,gPaoId2         = ""
        ,gPaymentId      = ""
        ,gCompanyCode    = app.userInfo.company_code
        ,gzGrid1         = "#gridCollectionsForRemit"
        ,gzGrid2         = "#gridPostedTransactions"
        
    ;
    
    zsi.ready = function(){
        $(".page-title").html("PAO Collections");
        $(".panel-container").css("min-height", $(window).height() - 190);
        displayCollectionsForRemit("",gCompanyCode,"","");
        displayRemittedCollections("",gCompanyCode,"","");
        validation();
        $('.PAOForRemitted').select2({placeholder: "SELECT PAO",allowClear: true});
        $('.PAOForRemit').select2({placeholder: "SELECT PAO",allowClear: true});
        $("#nav-tabContent").find("#date_id").datepicker({todayHighlight:true}).datepicker("setDate","0");
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        gDate = d.getFullYear() + '/' +
            (month<10 ? '0' : '') + month + '/' +
            (day<10 ? '0' : '') + day;
        $(".PAOForRemit").dataBind({
            sqlCode      : "P1233" //pao_sel
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _pao_id         = isUD(_info) ? "" : _info.user_id;
                gPaoId1 = _pao_id;
           }
        });
        $(".PAOForRemitted").dataBind({
            sqlCode      : "P1233" //pao_sel
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _pao_id         = isUD(_info) ? "" : _info.user_id;
                gPaoId2 = _pao_id;
           }
        });
        $(".paymentTypeId").fillSelect({
            data: [
                 { text: "FARE"     ,value: "FARE"}
                ,{ text: "LOAD"     ,value: "LOAD"}
                
            ]
            ,onChange : function(){
                gPaymentId = this.val();
                
            }
            ,onComplete     : function(){
                $("option:first-child",this).text("COLLECTION TYPE");
                $("option:first-child",this).val("");
            }
        });
    };
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href");
        switch(target){
            case "#nav-posted":
                setFooterFreezed(gzGrid2);
                break;
            case "#nav-forPosting":
                setFooterFreezed(gzGrid1);
                break;
          default:break;
      }
    });
    
    function validation(){
        var _$navTab = $("#nav-tabContent");
        var _dayFrom = _$navTab.find("#remitted_from_date_id");
        var _dayTo   = _$navTab.find("#remitted_to_date_id");
        var _timeFrom = "";
        var _timeTo = "";
        var _error  = _$navTab.find("#ermsgId");
        
        _$navTab.find("#remitted_from_date_id,#remitted_to_date_id").on("keyup change",function(){
            var _colName    = $(this)[0].id;
            if(_colName === "remitted_from_date_id")_timeFrom = new Date(_dayFrom.val()).getTime();
            else _timeTo = new Date(_dayTo.val()).getTime();
            if(_timeFrom > _timeTo){
                _error.removeClass("hide");
                _dayTo.css("border-color","red");
                $("#btnFilterVal2").attr("disabled",true);
            }else{
                _error.addClass("hide");
                _dayTo.css("border-color","green");
                $("#btnFilterVal2").removeAttr("disabled");
            }
        });
    }
    
    function displayCollectionsForRemit(pao,cCode,date,paymentId){
        zsi.getData({
                 sqlCode    : "P1240" //pao_collections_for_remit
                ,parameters : {pao_id:(pao ? pao : ""),company_code:(cCode ? cCode : ""),tdate:(date ? date : ""),collection_type:(paymentId ? paymentId : "")}
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = {total:0};
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.total  +=_info.amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                             pao             : "Total Amount"
                            ,amount          : _tot.total
                           
                    };
                    
                    d.rows.push(_total);
                    $(gzGrid1).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 335
                        ,dataRows       : getDataRowsByStatus(1)
                        ,onComplete: function(o){
                            var _this = this;
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");
                            this.find("input").attr("readonly",true);
                            $(".zRow:last-child()").find('[name="pao"]').css("text-align","right");
                            if(o.data.length <= 1)$("#btnSaveCollections").attr("disabled",true);
                            else $("#btnSaveCollections").removeAttr("disabled");
                    }
                });
            }
        });
    }
    
    function displayRemittedCollections(pao,cCode,remitFrom,remitTo,paymentId){
        zsi.getData({
                 sqlCode    : "P1244" //pao_collections_remitted
                ,parameters : {pao_id:(pao ? pao : ""),company_code:(cCode ? cCode : ""),tdate:(remitFrom ? remitFrom : ""),remit_date:(remitTo ? remitTo : ""),collection_type:(paymentId ? paymentId : "")}
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = { reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.total  +=_info.amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                             pao             : "Total Amount"
                            ,amount          : _tot.total
                           
                    };
                    
                    d.rows.push(_total);
                    $(gzGrid2).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 335
                        ,dataRows       : getDataRowsByStatus(2)
                        ,onComplete: function(o){
                            var _this = this;
                            this.find("input").attr("readonly",true);
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");
                            $(".zRow:last-child()").find('[name="pao"]').css("text-align","right");
                            if(o.data.length <= 1)$("#btnExcelCollections").attr("disabled",true);
                            else $("#btnExcelCollections").removeAttr("disabled");
                            var _dateFr = _this.find(".zRow:first-child()").find("[name='remit_date']").val().toShortDates();
                            var _dateTo = _this.find(".zRow:nth-last-child(2)").find("[name='remit_date']").val().toShortDates();
                            $("#nav-tabContent").find("#remitted_from_date_id").datepicker("setDate",_dateFr);
                            $("#nav-tabContent").find("#remitted_to_date_id").datepicker("setDate",_dateTo);
                            setFooterFreezed(gzGrid1);
                    }
                });
            }
        });
    }
    
    function getDataRowsByStatus(id){
        //statusId: 1 =  for posting, 2= posted
        var _dataRows =[
            {text: "Date"                                                                           ,width : 180     ,style : "text-align:center;"
                 ,onRender: function(d){
                        return app.bs({name: "tdate"          ,type: "input"     ,value: app.svn(d,"tdate")         ,style : "text-align:center;"})
                            +  app.bs({name: "id"             ,type: "hidden"    ,value: app.svn(d,"id")});
                    }
             }];
        if(id == 2){
            _dataRows.push(
                 {text: "Remitted Date"         ,name: "remit_date"             ,type: "input"      ,width : 180   ,style : "text-align:center;"}         
            )}
        
        _dataRows.push(
             {text: "PAO"                       ,name:"pao"                     ,type:"input"       ,width : 200   ,style : "text-align:left;padding-right: 0.3rem;"}
            ,{text: "Amount"                                                                        ,width : 130   ,style : "text-align:right;padding-right: 0.3rem;"
                ,onRender: function(d){
                    return app.bs({name: "amount"          ,type: "input"     ,value: app.svn(d,"amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;"});
                }
            }
            ,{text: "Collection Type"           ,name:"collection_type"         ,type:"input"       ,width : 130   ,style : "text-align:center;"}
                        
        );
        
        return _dataRows;
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
                   _zTotal.css({"top":_zRowsHeight - ( _tableRight.offset().to - _zRows.offset().top) });
                });
            }else{
                _zTotal.css({"position":"unset"});
                _zTotal.prev().css({"margin-bottom":0 });
            }
        }
        
    }
    
    $("#btnSaveCollections").click(function () {
      $("#gridCollectionsForRemit").jsonSubmit({
           procedure: "pao_collection_posting_upd"
          ,notIncludes : ["tdate","pao","amount"]
          ,onComplete: function (data) {
              displayCollectionsForRemit("",gCompanyCode);
              displayRemittedCollections("",gCompanyCode);
              if(data.isSuccess===true) zsi.form.showAlert("alert");
              $("#gridCollectionsForRemit").convertToTable(
                function($table){
                    $("#ExcelgridCollectionsForRemit").find("th").remove();
                    setTimeout(function(){
                        var _confirmation = confirm("Do you want to print this data?");
                        if (_confirmation === true) {
                            var mywindow = window.open("");
                            mywindow.document.write('<html><head><style>table,th,td{border: 1px solid black;text-align:center;</style></head><body>');
                            mywindow.document.write('<div style="text-align:center;"><h1>LAMADO TRANSPORATION</h4></div>');
                            mywindow.document.write('<div style="text-align:center;"><h4>'+gDate+'</h4></div>');
                            mywindow.document.write('<div style="align-items:center;display: flex;justify-content: center;"><table style="border-collapse: collapse;">');
                            mywindow.document.write('<thead><tr><td>Date</td><td>PAO</td><td>Amount</td><td>Collection Type</td></thead>');
                            mywindow.document.write(document.getElementById("ExcelgridCollectionsForRemit").innerHTML);
                            mywindow.document.write('</table></div></body></html>');
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
    
    $("#btnExcelCollections").click(function () {
      $("#gridPostedTransactions").convertToTable(
        function($table){
            $table.htmlToExcel({
               fileName: "PAO Collections"
           });
        });
    });
    
    /*$("#btnSaveCollections").click(function () {
        console.log("asdasd")
          $("#gridCollectionsForRemit").convertToTable(
            function($table){
                console.log("$table",$table);
                $("#ExcelgridCollectionsForRemit").find("th").remove();
                
                    var w = window.open();
                    var html = ('<html><head><style>table,th,td{border: 1px solid black;text-align:center;</style></head><body>'
                             +  '<div style="text-align:center;"><h1>LAMADO TRANSPORATION</h4></div>'
                             +  '<div style="text-align:center;"><h4>'+gDate+'</h4></div>'
                             +  '<div style="align-items:center;display: flex;justify-content: center;"><table style="border-collapse: collapse;">'
                             +  $("#ExcelgridCollectionsForRemit").html()
                             +  '</table></div></body></html>').html();
                
                    $(w.document.body).html(html);
                
                
                
                var mywindow = window.open('', 'PRINT');
                mywindow.document.write('<html><head><style>table,th,td{border: 1px solid black;text-align:center;</style></head><body>');
                mywindow.document.write('<div style="text-align:center;"><h1>LAMADO TRANSPORATION</h4></div>');
                mywindow.document.write('<div style="text-align:center;"><h4>'+gDate+'</h4></div>');
                mywindow.document.write('<div style="align-items:center;display: flex;justify-content: center;"><table style="border-collapse: collapse;">');
                mywindow.document.write('<thead><tr><td>Date</td><td>PAO</td><td>Company Code</td><td>Collection Type</td><td>Amount</td></thead>');
                mywindow.document.write(document.getElementById("ExcelgridCollectionsForRemit").innerHTML);
                mywindow.document.write('</table></div></body></html>');
                mywindow.document.close();
                mywindow.focus();
                mywindow.print();
                mywindow.close();
                return true;
            });
    });*/
    
    //for remit tab
    $("#btnFilterVal1").click(function(){
        var _date = $.trim($("#date_id").val()); 
        displayCollectionsForRemit(gPaoId1,gCompanyCode,_date,gPaymentId);
        setTimeout(function(){
            setFooterFreezed(gzGrid1);
        }, 1000);
    }); 

    $("#btnResetVal1").click(function(){
        $(".PAOForRemit").val(isUD);
        $("#nav-tabContent").find("#date_id").datepicker({todayHighlight:true}).datepicker("setDate","0");
        displayCollectionsForRemit("",gCompanyCode,"","");
    });
    
    //remitted tab
    $("#btnFilterVal2").click(function(){
        var _from = $.trim($("#remitted_from_date_id").val()); 
        var _to = $.trim($("#remitted_to_date_id").val()); 
        displayRemittedCollections(gPaoId2,gCompanyCode,_from,_to,gPaymentId);
        setTimeout(function(){
            setFooterFreezed(gzGrid2);
        }, 1000);
    }); 

    $("#btnResetVal2").click(function(){
        $(".PAOForRemit").val(isUD);
        displayRemittedCollections("",gCompanyCode,"","","");
    });
    
    
    return _pub;
})();                                                      