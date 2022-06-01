 var ph = (function(){
    var  _pub      = {} 
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Payment Summary by Date");
        displayPaymentSummary();
        dateValidation();
    };
    
    function dateValidation(){
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate() - 1;
        var _date1 = (d.getMonth() + 1) + "/01/" +    d.getFullYear();
        var yesterday = (d.getMonth() + 1) + "/"+day+"/" +    d.getFullYear();  
        $("#posted_date_from").datepicker({
             autoclose : true 
            ,endDate: yesterday
            ,todayHighlight: false 
        }).datepicker("setDate",_date1).on("changeDate",function(e){ 
            $("#posted_date_to").datepicker({endDate:yesterday,autoclose: true}).datepicker("setStartDate",e.date);
            $("#posted_date_to").datepicker().datepicker("setDate",yesterday);
        }); 
         $("#posted_date_to").datepicker({
             autoclose : true 
            ,endDate: yesterday
            ,todayHighlight: false 
        }).datepicker("setDate",yesterday).on("changeDate",function(e){});
    }
    function getFilters(){
        var  _$fromDate = $("#posted_date_from").val()
            ,_$toDate   = $("#posted_date_to").val();
            
        return {
                 from  : _$fromDate
                ,to    : _$toDate
        };
    }
    function displayPaymentSummary(){
        var _getdataRows = function(){
            var _dataRows = [
                  {text: "Payment Date"                ,width : 120                    ,style : "text-align:left;"  
                        ,onRender : function(d){
                            return app.bs({name: "payment_date"        ,type: "input"     ,value: app.svn(d,"payment_date").toShortDate()});
                        }
                    } 
                ,{text: "QR Amount"                          ,width : 180    ,style : "text-align:left;"
                    ,onRender:function(d){
                       return app.bs({name: "qr_amt"      ,type: "input"          ,value: app.svn(d,"qr_amt") ? app.svn(d,"qr_amt").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                    }
                }
                ,{text: "POS Amount"                          ,width : 180    ,style : "text-align:left;"
                    ,onRender:function(d){
                       return app.bs({name: "pos_cash_amt"      ,type: "input"          ,value: app.svn(d,"pos_cash_amt") ? app.svn(d,"pos_cash_amt").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                    }
                }
                ,{text: "Total Collection Amount"            ,width : 180    ,style : "text-align:left;"
                    ,onRender:function(d){
                       return app.bs({name: "total_amt"      ,type: "input"          ,value: app.svn(d,"total_amt") ? app.svn(d,"total_amt").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                    }
                } 
            ];
            return _dataRows;
        };
        var _o = getFilters();
        $("#gridPaymentSumm").dataBind({
            sqlCode         : "P1524"
           ,parameters      : {client_id:app.userInfo.company_id,pdate_from:_o.from,pdate_to:_o.to}
           ,height          : $(window).height() - 400 
           ,dataRows        : _getdataRows()
           ,onComplete      : function(d){
                var _data = d.data.rows; 
                var _this = this;
                var _tot    = {qr_amt:0,pos_cash_amt:0,total_amt:0}; 
                for(var i=0; i < _data.length;i++ ){
                    var _info = _data[i];
                    _tot.qr_amt    +=Number(_info.qr_amt)|| 0;
                    _tot.pos_cash_amt    +=Number(_info.pos_cash_amt)|| 0;
                    _tot.total_amt    +=Number(_info.total_amt)|| 0;
                }
                exportExcel(_data);
               setFooterColumn(_this,_tot); 
                $(".zRow:last-child()").addClass("zTotal");   
                $(".zTotal").css("width","-webkit-fill-available")
               setFooterFreezed("#gridPaymentSumm")
           }
        });
    }
    function setFooterColumn(_this,_tot){
        var _h      = "";
        var _footerTabFalse = "";
        var _footerTabTrue = "";
        
        _h  +=  '<div class="zRow even" id="colTrip">' 
            +' <div class="zCell" style="width:120px;text-align:right;"></div>'
            +' <div class="zCell" style="width:180px;text-align:right;"></div>'
            +' <div class="zCell" style="width:180px;text-align:right; color:white;"><b>Total&raquo;</b></div>'
            +' <div class="zCell" style="width:180px;text-align:right;padding-right: 0.3rem; color:white;"><b>&#8369; '+_tot.total_amt.toMoney()+'</b></div>'
        +'</div>'; 
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
    function exportExcel(data){
        var _total = {tot:0};          
        var _test = [{name:"rechie",last:"arnad",age:10},{name:"juan",last:"dela cruz",age:30}]
        var _html = "<table>";
        $("#btnExportTransations").click(function(){
             _html +="<thead>"
                        +"<tr>"
                            +"<th class='text-center'>Payment Date</th>"
                            +"<th class='text-center'>QR Amount</th>"
                            +"<th class='text-center'>POS Amount</th>"
                            +"<th class='text-center'>Total Collection Amount</th>"
                        +"</tr>"
                +"</thead>";
            $.each(data,function(i,v){  
                _html +="<tbody>"
                        +"<tr>"
                            +"<td class='text-center'>"+ v.payment_date +"</td>"
                            +"<td class='text-center'>"+v.qr_amt +"</td>"
                            +"<td class='text-center'>"+v.pos_cash_amt +"</td>"
                            +"<td class='text-center'>"+v.total_amt +"</td>"
                        +"</tr>"
                    +"</tbody>";  
                _total.tot += Number([v.total_amt])||0;
            });
            _html += "<tfoot>"
                        +"<tr><td></td><td></td><td><b>Total Collection</b></td><td><b>"+ _total.tot.toMoney() +"</b></td></tr>"
                    +"</tfoot>";  
           _html += "</table>"; 
            zsi.htmlToExcel({
                fileName: "Payment Summary Date"
                ,html : _html
            }); 
            
        });
    }
    $("#btnFilter").click(function(){
       displayPaymentSummary(); 
    });
    return _pub;
 })(); 
 
     