  var qr = (function(){ 
     var _pub                = {}
        ,bs                 = zsi.bs.ctrl 
        ,gSearch_type       = ""
        ,gSearch_keyword    = ""
    ;
     zsi.ready = function(){
        $(".page-title").html("QR Transactions");  
        $(".gridCollapse").hide();  
        $("#qrNumber").keyup(function(){
            gSearch_type = "Q";
            gSearch_keyword = $(this).val()
        })
        $('input[name="radioButton"]').on("click", function(e) {  
            $("input[name='phoneNumber'],input[name='qrNumber']").val("");  
            gSearch_keyword = ""; 
            if($(this).val()==="Phone No..."){ 
                $(":input").inputmask(); 
                $("input[name='phoneNumber']").removeClass("hide");
                $("input[name='phoneNumber']").show();
                $("input[name='phoneNumber']").keyup(function(e){  
                    gSearch_type = "P"; 
                    gSearch_keyword = $(this).val()
                })
                $("#qrNumber").hide();
                 
            }else{
                $("#qrNumber").show();
                $("#qrNumber").attr("placeholder", $(this).val());
                $("#qrNumber").keyup(function(){
                    gSearch_keyword = $(this).val() 
                    gSearch_type = "Q";
                })
                $("input[name='phoneNumber']").hide();
            }
             
        });
    }; 
   
    function displayTransactions(qrId){ 
        $("#gridQRTransactions").dataBind({
             sqlCode : "Q1505" 
             ,parameters : {search_type:gSearch_type,search_keyword:gSearch_keyword}
            ,height         : $(window).height() - 500 
            ,dataRows : [
                     {text: "Transaction Date"            ,width: 150     ,style: "text-align:center"
                         ,onRender: function(d){ 
                                return app.bs({name: "tran_date"         ,type: "input"     ,value: app.svn(d,"tran_date")}); 
                        }
                     } 
                    ,{text: "Load Amount"                                                                        ,width: 150     ,style: "text-align:right"
                        ,onRender: function(d){
                            return app.bs({name: "load_amount"         ,type: "input"     ,value: app.svn(d,"load_amount")? app.svn(d,"load_amount").toMoney():0.00 ,style : "text-align:right;padding-right: 0.3rem;" });
                        }
                    }  
                    ,{text: "Paid Amount"                                                                        ,width: 150     ,style: "text-align:right"
                        ,onRender: function(d){
                            return app.bs({name: "paid_amount"         ,type: "input"     ,value: app.svn(d,"paid_amount")?app.svn(d,"paid_amount").toMoney():0.00 ,style : "text-align:right;padding-right: 0.3rem;" });
                        }
                    }  
                    
            ]
            ,onComplete : function(o){
                var _data       = o.data.rows;  
                var _tot        = {paid_amt:0,load_amt:0,total:0,begAmt:0};  
                var _h          = "";  
                
                for(var i=0; i < _data.length;i++ ){
                    var _info = _data[i];
                    console.log("_info",_info);
                    _tot.paid_amt    +=Number(_info.paid_amount)|| 0;
                    _tot.load_amt    +=Number(_info.load_amount)|| 0;
                    _tot.begAmt      = Number(_info.beg_amount)|| 0;
                    _tot.total       = (_tot.begAmt + _tot.load_amt) - _tot.paid_amt; 
                } 
                
                _h  +=  '<div class="zRow even zTotal" id="colTrip">'  
                    +' <div class="zCell" style="width:150px;text-align:right;">Total</div>'
                    +' <div class="zCell" style="width:150px;text-align:right;padding-right: 0.3rem;">'+_tot.load_amt.toMoney()+'</div>'
                    +' <div class="zCell" style="width:150px;text-align:right;">'+_tot.paid_amt.toMoney()+'</div>'
                +'</div>'; 
                
                $("#spanBalAmt").html( _tot.begAmt.toMoney());
                $("#remBal").html(_tot.total.toMoney()); 
                this.find("#table").append(_h); 
                this.find("input").attr("readonly",true);
                //this.find(".zRow").css("width","100%"); 
                setFooterFreezed("#gridQRTransactions");
            }
        });   
    }
    function setFooterFreezed(zGridId){ 
        var _zRows = $(zGridId).find(".zGridPanel.right .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight =   _zRows.height();
        var _everyZrowsHeight = $(".zRow:not(:contains('Total'))");
        var _zTotala = _tableRight.find(".zTotal");
        var _arr = [];
        var _height = 0;
        var _zTotal = _tableRight.find(".zRow:contains('Total')");
        
        _everyZrowsHeight.each(function(){
            if(this.clientHeight) _arr.push(this.clientHeight);
        }); 
        for (var i = 0; i < _arr.length; i++){
           _height += _arr[i];
        } 
        if(_zRows.find(".zRow").length == 1){
            _zTotal.addClass("hide");
        }else{
            if(_tableRight.height() > _zRowsHeight){
                
                _tableRight.parent().scroll(function() {
                    if($(window).width() < 1536){ 
                        _zTotal.css({"top":_zRowsHeight - 25 -( _tableRight.offset().top - _zRows.offset().top) });
                        _zTotala.prev().css({"margin-bottom":40 });
                    }
                    else{ 
                       _zTotal.css({"top":_zRowsHeight - 20 - ( _tableRight.offset().top - _zRows.offset().top) });
                       _zTotala.prev().css({"margin-bottom":30 });
                    } 
                });
            }else{
                _zTotal.css({"top": _height}); 
            }
        }
    } 
    
    $("#btnFilterRecords").click(function(){ 
        let _regex  = /^\d{11}$/; 
        if(gSearch_type == "P" && !_regex.test(gSearch_keyword)){
             alert('Invalid phone number!');
             return false;
        }   
        if(gSearch_keyword===""){
            alert("Please fill the input provided")
            return;
        }
        $(".gridCollapse").show();
        displayTransactions();
    });

    return _pub;
})();               
          