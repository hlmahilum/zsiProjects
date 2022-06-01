var printQR = (function(){
    var  _pub     = {}
        ,gSqlCode = 'G1333' //generated_qrs_prepaid_sel
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Print QR");
        zsi.initInputTypesAndFormats();
    };
    
    function printQR(){
        setTimeout(function(){ 
            var _win = window.open('/');
            var _objDoc = _win.document;
            _objDoc.write('<html><body style="text-align:center;"><head><style>tbody tr > td:last-child{padding-right:0 !important;}</style></head>');
            _objDoc.write('<div>');
            _objDoc.write( document.getElementById("printThis").innerHTML ); 
            _objDoc.write('</div>');
            _objDoc.write('</body></html>');
            _objDoc.close();
            _win.focus();
            _win.print();
            _win.close(); 
            
            return true;
        }, 500);
    }
    
    function printQRTable(batch_no){
        var _$tbody = $("#printThis");
        var _style = "text-align:left; padding: 5px;border: 1px solid #000;";
        var _createQR = function(text){
            new QRCode(document.getElementById(text), {width:150, height:150}).makeCode(text);  
        };
        var _getData = function(cb){
            zsi.getData({ 
                 sqlCode     : gSqlCode
                ,parameters  : {batch_no: (batch_no ? batch_no : "")}
                ,onComplete  : function(d) {
                    var _rows = d.rows,
                        _arr = [],
                        _obj= {},
                        _ctr = 0,
                        _ctr2 = 0,
                        _h = "",
                        _divId = 0;
                        _indexId = 0;
                    _$tbody.html("");
                    _$tbody.append("<table id='table_"+_indexId+"' style='width: 100%;page-break-beforer: always;margin-left: auto;margin-right: auto;'><tbody></tbody></table>");
                    for(var i=0; i < _rows.length; i++ ){
                        _ctr++;
                        _ctr2++;
                        _divId++;
                        var _o = _rows[i];
                        var _topIn = _o.hash_key;
                        var _topOut = _o.hash_key2;
                        
                        _h += "<td style='"+ _style +"'><div style='text-align:center;color:#1a0dab;'>Scan In</div><div style='width:100%;justify-content:center;display:flex;'><div style='width:150px;text-align:center;'>"+ _o.ref_trans 
                                            +"</div></div><div style='width:100%;justify-content:center;display:flex;'><div id='"+ _topIn +"'></div></div>"
                                            +"<div style='width:100%;justify-content:center;display:flex;'><div style='width:150px;color:#1a0dab;text-align:center;'><b>ZPay</b></b></div></div><div style='position:absolute:top:50%;right:80%;'>&#8369;"+ parseFloat(_o.denomination).toFixed(2)+"</div></td>"
                                            
                            + "<td style='"+ _style +"'><div style='text-align:center;color:#1a0dab;'>Scan Out</div><div style='width:100%;justify-content:center;display:flex;'><div style='width:150px;text-align:center;'>"+ _o.ref_trans 
                                            +"</div></div><div style='width:100%;justify-content:center;display:flex;'><div id='"+ _topOut +"'></div></div>"
                                            +"<div style='width:100%;justify-content:center;display:flex;'><div style='width:150px;color:#1a0dab;text-align:center;'><b>ZPay</b></div></div><div style='position:absolute:top:50%;right:80%;'>&#8369;"+ parseFloat(_o.denomination).toFixed(2)+"</div></td>"

                        _obj["tIn" +_ctr] = _topIn;
                        _obj["tOut" +_ctr] = _topOut;
                        
                       
                        
                        if ((_ctr && (_ctr % 2 === 0)) || (_rows.length === _ctr2)) {
                            _h = "<tr>"+ _h +"</tr>";
                            $("#table_"+_indexId).find("tbody").append(_h);
                            _arr.push(_obj);
                            _obj = {};
                            _ctr = 0;
                            _h = "";
                            
                             if( (_divId && (_divId % 8 === 0)) ){
                                 _indexId++;
                                _$tbody.append("<div style='width: 100%'><table id='table_"+_indexId+"' style='width: 100%;page-break-before: always;margin-left: auto;margin-right: auto;'><tbody></tbody></table></div>")
                                
                                _divId = 0;
                            }
                        }
                    }
                    cb(_arr);
                }  
            });
        };
        
        _$tbody.html("");
        _getData(function(data){
            for(var i=0; i < data.length; i++){
                var _o = data[i];
                var _tIn1  = _o.tIn1,
                    _tOut1 = _o.tOut1,
                    _tIn2  = (isUD(_o.tIn2)? "":_o.tIn2),
                    _tOut2 = (isUD(_o.tOut2)? "":_o.tOut2);
                    //_tIn3  = (isUD(_o.tIn3)? "":_o.tIn3),
                    //_tOut3 = (isUD(_o.tOut3)? "":_o.tOut3);
                
                _createQR(_tIn1); 
                _createQR(_tOut1); 
                if(_tIn2) _createQR(_tIn2); 
                if(_tOut2) _createQR(_tOut2); 
                //if(_tIn3) _createQR(_tIn3); 
                //if(_tOut3) _createQR(_tOut3); 
            }
            
            printQR(); 
        });
    }
    
    $("#btnFilterVal").click(function(){
        var _batchNo = $("#batch_no").val().trim();
        
        if(_batchNo) printQRTable(_batchNo);
    });
    
    return _pub;
})();                                                                        