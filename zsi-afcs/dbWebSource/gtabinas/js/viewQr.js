var signup = (function(){
    var _pub         = {}
        ,gClientId   = null
        ,gCtr        = 1
    ;
    
    zsi.ready = function(){
        $(".pageTitle").remove();
        $(":input").inputmask();
        getData(); 
    };
    
    function getData(){
               zsi.getData({
                    sqlCode: "Q1505",
                    parameters: {
                        search_type: "Q",
                        search_keyword: "100639"
                    },
                    onComplete:function(d){ 
                        displayTransactions(d.rows);
                    }
               });
            }
            
        function displayTransactions(data) {
            var _height = "";
            if (zsi.isMobileDevice) _height = $(window).height() - 350;
            else _height = $(window).height() - 270;
            $("#gridQR").dataBind({
                rows: data, 
                height: ((zsi.isMobileDevice)?$(window).height() - 350:$(window).height() - 270),
                dataRows: [
                    {
                        text: "Transaction Date",
                        width: 150,
                        style: "text-align:center",
                        labelName: "tran_date",
                        onRender: function(d) {
                            return app.bs({
                                name: "tran_date",
                                type: "input",
                                value: app.svn(d, "tran_date")
                            });
                        }
                    }, {
                        text: "Load Amount",
                        width: 80,
                        style: "text-align:right",
                        labelName: "load_amount",
                        onRender: function(d) {
                            return app.bs({
                                name: "load_amount",
                                type: "input",
                                value: app.svn(d, "load_amount") ? app.svn(d, "load_amount").toMoney() : 0.00,
                                style: "text-align:right;padding-right: 0.3rem;"
                            });
                        }
                    }, {
                        text: "Paid Amount",
                        width: 80,
                        style: "text-align:right",
                        labelName: "paid_amount",
                        onRender: function(d) {
                            return app.bs({
                                name: "paid_amount",
                                type: "input",
                                value: app.svn(d, "paid_amount") ? app.svn(d, "paid_amount").toMoney() : 0.00,
                                style: "text-align:right;padding-right: 0.3rem;"
                            });
                        }
                    }, {
                        text: "No of Passenger",
                        width: 80,
                        style: "text-align:right",
                        labelName: "no_pass",
                        onRender: function(d) {
                            return app.bs({
                                name: "no_pass",
                                type: "input",
                                value: app.svn(d, "no_pass") ? app.svn(d, "no_pass") : 0,
                                style: "text-align:right;padding-right: 0.3rem;"
                            });
                        }
                    }, {
                        text: "Origin",
                        width: 200,
                        style: "text-align:right",
                        labelName: "from_location",
                        onRender: function(d) {
                            return app.bs({
                                name: "from_location",
                                type: "input",
                                value: app.svn(d, "from_location"),
                                style: "text-align:right;padding-right: 0.3rem;"
                            });
                        }
                    }, {
                        text: "Destination",
                        width: 200,
                        style: "text-align:right",
                        labelName: "to_location",
                        onRender: function(d) {
                            return app.bs({
                                name: "to_location",
                                type: "input",
                                value: app.svn(d, "to_location"),
                                style: "text-align:right;padding-right: 0.3rem;"
                            });
                        }
                    },{
                        text: "Company Name",
                        width: 120,
                        style: "text-align:right",
                        labelName: "client_name",
                        onRender: function(d) {
                            return app.bs({
                                name: "client_name",
                                type: "input",
                                value: app.svn(d, "client_name")
                            });
                        }
                    }, 
                    {text: "Vehicle Plate No."   ,name:"vehicle_plate_no" ,type:"input"       ,width : 100     ,style : "text-align:left;"  } 
                     
    
                ],
                onComplete: function(o) {
                    var _data = o.data;
                    
                    var _tot = {
                        paid_amt: 0,
                        load_amt: 0,
                        total: 0,
                        begAmt: 0,
                        noPass: 0,
                        qrId : ""
                        
                    };
                    var _h = "";
    
                    for (var i = 0; i < _data.length; i++) {
                        var _info = _data[i]; 
                        _tot.paid_amt += Number(_info.paid_amount) || 0;
                        _tot.load_amt += Number(_info.load_amount) || 0;
                        _tot.begAmt = Number(_info.beg_amount) || 0;
                        _tot.noPass = Number(_info.no_pass)|| 0;
                        _tot.total = (_tot.begAmt + _tot.load_amt) - _tot.paid_amt;
                        _tot.qrId = _info.qr_id;
                        
                    }
                    
                    _h += '<div class="zRow even zTotal" id="colTrip">' +
                        ' <div class="zCell" style="width:150px;text-align:right;">Total»</div>' +
                        ' <div class="zCell" style="width:80px;text-align:right;padding-right: 0.3rem;">' + _tot.load_amt.toMoney() + '</div>' +
                        ' <div class="zCell" style="width:80px;text-align:right;padding-right: 0.3rem;">' + _tot.paid_amt.toMoney() + '</div>' + 
                        ' <div class="zCell" style="width:80px;text-align:right;"></div>' +
                        ' <div class="zCell" style="width:200px;text-align:right;"></div>' +
                        ' <div class="zCell" style="width:200px;text-align:right;"></div>' +
                        ' <div class="zCell" style="width:120px;text-align:right;"></div>' +
                        ' <div class="zCell" style="width:100px;text-align:right;"></div>' +
                        '</div>';
    
                    $("#spanQrNumber").html(_data[0].qr_id);
                    $("#spanBalAmt").html(_tot.begAmt.toMoney());
                    $("#remBal").html(_tot.total.toMoney());
                    this.find("#table").append(_h);
                    this.find("input").attr("readonly", true);
                    this.find(".zRow").css("width", "100%");
                    setFooterFreezed2("#gridQRTransactions");
                }
            });
        }
    
        function setFooterFreezed2(zGridId) {
            var _zRows = $(zGridId).find(".zGridPanel.right .zRows");
            var _tableRight = _zRows.find("#table");
            var _zRowsHeight = _zRows.height();
            var _everyZrowsHeight = $(".zRow:not(:contains('Total'))");
            var _zTotala = _tableRight.find(".zTotal");
            var _arr = [];
            var _height = 0;
            var _zTotal = _tableRight.find(".zRow:contains('Total')");
    
            _everyZrowsHeight.each(function() {
                if (this.clientHeight) _arr.push(this.clientHeight);
            });
            for (var i = 0; i < _arr.length; i++) {
                _height += _arr[i];
            }
            if (_zRows.find(".zRow").length == 1) {
                _zTotal.addClass("hide");
            } else {
                if (_tableRight.height() > _zRowsHeight) { 
                    _tableRight.parent().scroll(function() {
                        if(zsi.isMobileDevice){
                            _zTotal.css({
                                    "top": _zRowsHeight - 20 - (_tableRight.offset().top - _zRows.offset().top)
                                });
                                _zTotala.prev().css({
                                    "margin-bottom": 20
                                });
                        }
                        else{
                            if ($(window).width() < 1536) { 
                                _zTotal.css({
                                    "top": _zRowsHeight - 38 - (_tableRight.offset().top - _zRows.offset().top)
                                });
                                _zTotala.prev().css({
                                    "margin-bottom": 20
                                });
                            } else { 
                                _zTotal.css({
                                    "top": _zRowsHeight - 20 - (_tableRight.offset().top - _zRows.offset().top)
                                });
                                _zTotala.prev().css({
                                    "margin-bottom": 30
                                });
                            }
                        }
                    });
                } else { 
                    _zTotal.css({
                        "top": _height
                    });
                }
            }
        }
        
        
    return _pub;
})();                     