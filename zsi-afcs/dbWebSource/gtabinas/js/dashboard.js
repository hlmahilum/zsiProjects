        
var db=(function(){ 
        var   bs                    = zsi.bs.ctrl 
            ,_public                = {} 
            ,gData                  = ""
            ,gMonth                 = "" 
            ,gMonthName             = ""
            ,gDDChange              = false  
            ,gMClick                = false 
            ,gCategory              = ""   
            ,gClientName            = ""
             ;
            
        
        zsi.ready = function(){   
            $(".page-title").html("Dashboard");
             var _roleId     = app.userInfo.role_id;   
            if(_roleId === 5) {  
                $("#nonBankPersonnel").hide();
                displayBankPersonnelRecords();
            }else{
                $("#nonBankPersonnel").show();
                getYearlyData();   
            }   
            
            document.addEventListener('keydown', (event) => {
              if (event.key === 'Escape') {
                $('#modalDailyRecords').find(".close").click();
              }
            });  
        };
        
        _public.showModalDailyRecords = function(clientId,year,month,clientName){   
            gClientName     = clientName;  
            var _monthParam = month 
                ,_data      = []  
                ,_$mdl      = $('#modalDailyRecords')    
                ,_month     = []; 
                _month[1]   = "January";
                _month[2]   = "February";
                _month[3]   = "March";
                _month[4]   = "April";
                _month[5]   = "May";
                _month[6]   = "Jun";
                _month[7]   = "July";
                _month[8]   = "August";
                _month[9]   = "September";
                _month[10]  = "October";
                _month[11]  = "November";
                _month[12]  = "December"; 
                for (var i = 0; i < gData.length; i++) {  
                    for(var n=1;n<=_month.length-1; n++){  
                        if(gData[i].pay_month === n){  
                            gMonthName  = _month[_monthParam];
                            _data.push(
                                {month:_month[n],no:n}    
                            ); 
                        } 
                    }   
                }
          
            var monthName = function(param){
                var _month     = [] 
                _month[1]   = "January";
                _month[2]   = "February";
                _month[3]   = "March";
                _month[4]   = "April";
                _month[5]   = "May";
                _month[6]   = "Jun";
                _month[7]   = "July";
                _month[8]   = "August";
                _month[9]   = "September";
                _month[10]  = "October";
                _month[11]  = "November";
                _month[12]  = "December"; 
                 
                for(var n=1;n<=param.length; n++){   
                     gMonthName  = _month[param];  
                }    
            };
            $("#companyLogo").attr({src: base_url + 'dbimage/ref-0001/client_id/' + clientId + "/company_logo" }); 
            _$mdl.find(".modal-title").text(clientName);
            _$mdl.find("#modalDates").html(year);
            _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
            _$mdl.find("#month_of").fillSelect({	
                 data       : _data
                ,text       : "month"
                ,value      : "no" 
                ,onChange   : function(){
                    _monthParam = $(this).val(); 
                    gMonth      = $(this).val(); 
                    monthName(gMonth);
                    gDDChange   = true;
                }
                ,onComplete : function(){
                   $(this).val(_monthParam); 
                }
            }); 
             $('body').css("overflow", "scroll");
            if($(window).width() <= 575){
                $("#titleLabel").removeClass("mt-6");
            }
            displayDailyRecords(clientId,year,month,clientName);
        };
        
        function _am4Core(o,_data,records,cName){  
            var mCatgry = ""; 
            am4core.useTheme(am4themes_animated);  // Enable queuing 
            am4core.options.commercialLicense = true;
            am4core.options.queue = true;
            am4core.options.onlyShowOnViewport = true; 
            am4core.ready(function() { 
                var chart = am4core.create(o.container, am4charts.XYChart3D); 
                chart.numberFormatter.numberFormat = '###';
                // Set data   
                var generateChartData = function() {
                    var chartData = []; 
                        var _monthlyCtgry   = ""; 
                        var _month          = [];
                            _month[1]   = "Jan";
                            _month[2]   = "Feb";
                            _month[3]   = "Mar";
                            _month[4]   = "Apr";
                            _month[5]   = "May";
                            _month[6]   = "Jun";
                            _month[7]   = "Jul";
                            _month[8]   = "Aug";
                            _month[9]   = "Sep";
                            _month[10]  = "Oct";
                            _month[11]  = "Nov";
                            _month[12]  = "Dec"; 
                          
                    if(records === "monthly"){ 
                        for (var x = 0; x < _data.length; x++) {      
                            for(var n=1;n<=_month.length-1; n++){  
                                if(_data[x].category === n){ 
                                  _monthlyCtgry = _month[n]; 
                                } 
                            } 
                            chartData.push({
                                title       : o.title,
                                year        : o.year,
                                code        : o.sqlCode,
                                category    : _monthlyCtgry,
                                categorySub : _data[x].category,
                                container   : o.container, 
                                value       : _data[x].value,
                                color       : _data[x].color,
                                rows        : o.data,
                                id: x
                            });   
                        
                        }
                        return chartData; 
                    }
                    else if (records === "daily"){
                        for (var d = 0; d < _data.length; d++) {  
                            chartData.push({
                                container   : _data[d].container,
                                category    : "Day "+_data[d].category,   
                                value       : _data[d].value,
                                color       : _data[d].color,
                                id: d
                            }); 
                            
                        } 
                        return chartData;
                    } 
                    if(records === "yearly"){ 
                        console.log("o",o)
                        for (var i = 0; i < _data.length; i++) {  
                            chartData.push({
                                category    : _data[i].category,
                                value       : _data[i].value,
                                color       : _data[i].color,
                                client_id   : o.client_id,
                                client_name : o.client_name,
                                container   : o.container, 
                                code        : o.sqlCode,
                                id          : i,
                                subContainer: o.subContainer,
                                dataRows    : o.data
                              }); 
                        } 
                        return chartData;  
                    }
                };
                // Add data
                chart.data = generateChartData();
                chart.scrollbarX = new am4core.Scrollbar();
                chart.scrollbarY = new am4core.Scrollbar();
               // Add and configure Series    
                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                categoryAxis.dataFields.category = "category";
                categoryAxis.renderer.minGridDistance = 20;    
                categoryAxis.renderer.labels.template.horizontalCenter = "right";
                categoryAxis.renderer.labels.template.verticalCenter = "middle";
                categoryAxis.renderer.labels.template.rotation = 300;   
                
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());  
                
                var series = chart.series.push(new am4charts.ColumnSeries3D());   
                series.dataFields.categoryX = "category"; 
                series.dataFields.valueY = "value";    
                series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";  
                
                if(o.category==="pay_month") series.columns.template.tooltipText = "Month of "+"{categoryX}: [bold]{valueY}[/]";  
                var series2 = chart.series.push(new am4charts.LineSeries());
                series2.name = "category";
                series2.stroke = am4core.color("#CDA2AB");
                series2.strokeWidth = 3;
                series2.dataFields.valueY = "value";
                series2.dataFields.categoryX = "category";      
                chart.cursor = new am4charts.XYCursor();   
                // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                series.columns.template.adapter.add("fill", function (fill, target) { 
                	return chart.colors.getIndex(target.dataItem.index);
                }); 
                var title = chart.titles.create();  
                title.text = "Yearly Collection";  
                var resetLabel = chart.plotContainer.createChild(am4core.Label); 
                if(records === "monthly"){  
                    title.text = "Monthly Collection";
                     var _dailyParams = window.yearParams;
                    series.columns.template.events.on("hit", function(ev) { 
                        if (typeof ev.target.dataItem.dataContext.category) {   
                            var _params       ={}  
                              ,_catgry       =  ev.target.dataItem.dataContext.category
                              ,_yearly       =  ev.target.dataItem.dataContext.year
                              ,_container    =  ev.target.dataItem.dataContext.container
                              ,_code         =  ev.target.dataItem.dataContext.code 
                              ,_month        =  ev.target.dataItem.dataContext.categorySub; 
                              gData          =  ev.target.dataItem.dataContext.rows; 
                              gDDChange      = false;
                              
                              gMonth = _month;
                              _params.container       = _container;
                              _params.year            = _yearly;
                              _params.code            = _code; 
                              _params.category        = _catgry;
                              _params.month           = _month; 
                              window.params = _params; 
                          
                            if(cName==="BP"){   
                                _public.showModalDailyRecords(_dailyParams.client_id,_dailyParams.year,_month,_dailyParams.client_name);   
                            }else _displayDaily(_params); 
                        }
                    }, this);
                    if(cName==="BP"){  
                        resetLabel.text = "[bold]<< Back to yearly data";
                        resetLabel.valign = "top";
                        resetLabel.x = 20;
                        resetLabel.y = 200;
                        resetLabel.cursorOverStyle = am4core.MouseCursorStyle.pointer; 
                        resetLabel.events.on('hit', function(ev) {
                            resetLabel.hide(); 
                            gMClick=false;    
                            var _initCol = function(name){ 
                                var _sqlCode = "P1389"
                                    ,_params = {
                                        client_id:_dailyParams.client_id 
                                    }
                                    ,_isColorSet = false
                                    ,_json = {};  
                                _json.container     = _dailyParams.container;
                                _json.value         = "total_fare";
                                _json.category      = "pay_year";
                                _json.isColorSet    = _isColorSet;
                                _json.subContainer  = _dailyParams.subContainer;
                                _json.sqlCode       = _sqlCode;
                                _json.client_id     = _dailyParams.client_id; 
                                _json.client_name   = _dailyParams.client_name
                                _getColor(function(colorSet){
                                    _getData(_sqlCode,_params, function(data){
                                        _json.colorSet  = colorSet;
                                        _json.data      = data;   
                                        _displayYearGraph(_json,"BP"); 
                                    });
                                });  
                        }; 
                            _initCol(); 
                            resetLabel.hide(); 
                        }); 
                        resetLabel.show(); 
                    } 
                } 
                if(records === "daily"){
                    title.text = 'Month of '+window.params.category;  
                    resetLabel.text = "[bold]<< Back to monthly data";
                    resetLabel.valign = "top";
                    resetLabel.x = 20;
                    resetLabel.y = 200;
                    resetLabel.cursorOverStyle = am4core.MouseCursorStyle.pointer; 
                        resetLabel.events.on('hit', function(ev) { 
                            resetLabel.hide();    
                            var _initCol = function(name){ 
                                var params = window.params;
                                var _sqlCode = "P1388"
                                    ,_params = {
                                        client_id:app.userInfo.company_id
                                        ,year : params.year 
                                    }
                                    ,_isColorSet = false
                                    ,_json = {}; 
                                _json.container     =  params.container;
                                _json.value         = "total_fare";
                                _json.category      = "pay_month";
                                _json.isColorSet    = _isColorSet;   
                                _json.year          = params.year;   
                                _getColor(function(colorSet){
                                    _getData(_sqlCode,_params, function(data){
                                        _json.colorSet = colorSet;
                                        _json.data = data; 
                                        _displayMonthGraph(_json,"NBP"); 
                                    });
                                }); 
                            }; 
                            _initCol(o.title);  
                        resetLabel.hide(); 
                    }); 
                    resetLabel.show(); 
                }    
                if(records==="yearly" && cName === "BP"){  
                    series.columns.template.events.on("hit", function(ev) {
                        if (typeof ev.target.dataItem.dataContext.category) {  
                            gMClick=true;
                            var _jsonParams  =  {}
                            ,_subContainer =  ev.target.dataItem.dataContext.subContainer
                            ,_clientId     =  ev.target.dataItem.dataContext.client_id
                            ,_year         =  ev.target.dataItem.dataContext.category
                            ,_container    =  ev.target.dataItem.dataContext.container
                            ,_code         =  ev.target.dataItem.dataContext.code
                            ,_clientName   =  ev.target.dataItem.dataContext.client_name
                            ,_dataRows     =  ev.target.dataItem.dataContext.dataRows;  
                              
                            gClientName = _clientName; 
                            
                            _jsonParams.subContainer    = _subContainer;
                            _jsonParams.client_id       = _clientId;
                            _jsonParams.container       = _container;
                            _jsonParams.year            = _year;
                            _jsonParams.code            = _code;
                            _jsonParams.client_name     = _clientName;  
                            
                            window.yearParams = _jsonParams;  
                            _displayMonthlyData(_jsonParams);
                        }
                    }, this); 
                }
                
            });
        } 
        function _getData(sqlCode,params,cb){ // GET PARAMS AND SQL CODE TO BE DISPLAYED IN GRAPH    
            zsi.getData({
                 sqlCode : sqlCode 
                ,parameters : params
                ,onComplete : function(d) {
                    var _rows = d.rows;  
                    cb(_rows);  
                }
            });
        }  
        function _getColor(cb){ // GET COLORS FROM AM4CORE DYNAMIC COLORS
            var _colorSet = new am4core.ColorSet();
            _colors = _colorSet;   
            cb(_colors);
        } 
        function _displayDaily(params){    
            var _sqlCode = "P1387"   
                ,_value = "total_fare"
                ,_category = "pay_day"
                ,_isColorSet = false
                ,_json = {};
                _params = {
                    client_id   :app.userInfo.company_id 
                   ,month       :params.month
                   ,year        :params.year
                }; 
               
            _getColor(function(colorSet){
                _getData(_sqlCode,_params, function(data){
                    _json.colorSet  = colorSet;
                    _json.data      = data;
                    _json.category  = params.category; 
                    _json.subCtgry  = params.month; 
                    _json.container = params.container;
                    _json.sqlCode   = params.code;  
                    _displayDailyGraph(_json); 
                });
            }); 
        }  //SETTING DAILY DATA PARAMS AND PROCEDURES
        function _displayDailyGraph(o){
             o.data.sort((a, b) => (a.pay_day > b.pay_day) ? 1 : -1); 
                var _data = [];
                var _colorSet = new am4core.ColorSet();  
                var _setDailyData = function(){  
                    $.each(o.data, function(i,v){  
                        var _json       = {};     
                        _json.category  = v.pay_day; 
                        _json.container = o.container;
                        _json.value     = v.total_fare;
                        _json.sqlCode   = o.sqlCode;
                        _json.title     = o.title;
                        _json.color     = _colorSet.next();  
                        _data.push(_json); 
                    });
                    
                };
                _setDailyData();
                _am4Core(o,_data,"daily"); 
        } // SETTING DATA VALUE TO BE DISPLAYED IN GRAPH
        function _displayMonthGraph(o,cName){  
             o.data.sort((a, b) => (a.pay_month > b.pay_month) ? 1 : -1); 
            var _data = [];
            var _colorSet = new am4core.ColorSet(); 
            var _setData = function(){ 
                $.each(o.data, function(i,v){  
                    var _json = {};  
                    _json.category = v.pay_month;
                    _json.value = v.total_fare;
                    _json.color = _colorSet.next();   
                    _data.push(_json); 
                }); 
            };
            if(cName==="BP"){
                gridData(o);
            }
            _setData(); 
            _am4Core(o,_data,"monthly",cName); 
        } //DISPLAY MONTHLY GRAPH 
        function _displayMonthlyData(params){  
            var _value = "total_fare"
                ,_category = "pay_month"
                ,_isColorSet = false 
                ,_sqlCode    = "P1388"
                ,_json = {};
                _params = {
                    client_id   :params.client_id 
                   ,year        :params.year
                }; 
            
            _getColor(function(colorSet){
                _getData(_sqlCode,_params, function(data){
                    _json.colorSet  = colorSet;
                    _json.data      = data; 
                    _json.container = params.container;
                    _json.sqlCode   = _sqlCode;
                    _json.subContainer = params.subContainer;
                    _displayMonthGraph(_json,"BP"); 
                });
            }); 
        }         
        function _displayYearGraph(o,clientName){
            o.data.sort((a, b) => (a.pay_year > b.pay_year) ? 1 : -1);
            var _data = []
            ,_colorSet = new am4core.ColorSet() 
            ,_setData = function(){  
                $.each(o.data, function(i,v){  
                    var _json = {};  
                        _json.category = v.pay_year;
                        _json.value = v.total_fare;
                        _json.color = _colorSet.next();  
                    _data.push(_json); 
                }); 
            };
            if(clientName==="BP"){
                gridData(o);
            }
            _setData();
            _am4Core(o,_data,"yearly",clientName);
        } 
        function getYearlyData(){  
            zsi.getData({
                 sqlCode : "P1389" 
                ,parameters : {client_id:app.userInfo.company_id}
                ,onComplete : function(d) {
                    var _rows  = d.rows  
                        ,_displayMonthly = function(){
                            _rows.reverse().forEach(function(o,i) {  
                            var _container = "graph_"+i; 
                            var templateString = ' <div class="col-md-6 col-sm-6 col-12 graphs mt-3 ">'
                             +'     <div class="panel mb-0">'
                             +'         <div class="panel-hdr text-primary">'
                             +'             <h2>'
                             +'                 <span class="mr-2"><i class="far fa-chart-pie"></i></span>'+ o.pay_year+" Monthly Collection"+''
                             +'             </h2>'
                             +'             <div class="panel-toolbar"> '
                             +'                 <button class="btn btn-panel waves-effect waves-themed far fa-window-minimize" data-action="panel-collapse"  data-offset="0,10" data-original-title="Collapse" data-toggle="tooltip" title="Collapse"></button>'
                             +'                 <button class="btn btn-panel waves-effect waves-themed fas fa-expand" data-action="panel-fullscreen"  data-offset="0,10" data-original-title="Fullscreen" data-toggle="tooltip" title="Expand"></button> '
                             +'             </div>'
                             +'         </div>'
                             +'         <div class="panel-container show">'
                             +'             <div class="panel-content"> ' 
                             +'                 <div class="panel-container collapse show">'
                             +'                     <div class="panel-content">'
                             +'                         <div class="zGraph" id="'+ _container +'"></div>'
                             +'                     </div>'
                             +'                 </div> '
                             +'             </div>'
                             +'         </div>'
                             +'     </div>'
                             +'</div>';
                        	$('#newDiv').append(templateString);   
                        
                            var _params = {
                                    client_id:app.userInfo.company_id 
                                    ,year   : _rows[i].pay_year
                                }
                                ,_sqlCode = "P1388" 
                                ,_value = "total_fare"
                                ,_category = "pay_month"
                                ,_isColorSet = false
                                ,_name = _rows[i].pay_year
                                ,_json = {};  
                               
                                _json.title =  _rows[i].pay_year+" Monthly Collection";
                                _json.container = _container;
                                _json.yearParams = _rows[i].pay_year;
                                _json.value = _value;
                                _json.category = _category;
                                _json.isColorSet = _isColorSet;  
                                _getColor(function(colorSet){
                                    _getData(_sqlCode,_params, function(data){  
                                        _json.colorSet = colorSet;
                                        _json.data = data;  
                                        _json.sqlCode = _sqlCode;  
                                        _json.year = _params.year;  
                                        _displayMonthGraph(_json,"NBP"); 
                                    });
                                });  
                    	 	 
                            });   
                        } //SETTING MONTHLY PARAM AND SQLCODE   
                    
                    _container = "graph1"
                    ,_value = "total_fare"
                    ,_category = "pay_year"
                    ,_isColorSet = false
                    ,_json = {};
                    _json.title = "Collection";
                    _json.container = _container;
                    _json.value = _value;
                    _json.category = _category; 
                    _getColor(function(colorSet){  
                        _json.data = _rows;  
                        _displayYearGraph(_json,"NBP");  
                    });  
                    _displayMonthly();
                }
            });
       }    
        //BANK PERSONNEL
        function displayBankPersonnelRecords(){   
            zsi.getData({
                     sqlCode    : "B1448"   
                    ,onComplete : function(d) {
                    var _rows = d.rows   ;
                    $.each(_rows,function(i,v){  
                        var _container   = "graph_"+i; 
                        var _gridDataContainer    = "gridGraphData"+i;  
                        var templateString = 
                          ' <div class="col-md-6 col-sm-6 col-12 graphs mt-3 ">'
                         +'     <div class="panel mb-0">'
                         +'         <div class="panel-hdr text-primary">'
                         +'             <h2>'
                         +'                 <span class="mr-2"><i class="far fa-chart-pie"></i></span>'+ v.client_name+''
                         +'             </h2>'
                         +'             <div class="panel-toolbar"> '
                         +'                 <button class="btn btn-panel waves-effect waves-themed far fa-window-minimize" data-action="panel-collapse"  data-offset="0,10" data-original-title="Collapse" data-toggle="tooltip" title="Collapse"></button>'
                         +'                 <button class="btn btn-panel waves-effect waves-themed fas fa-expand" data-action="panel-fullscreen"  data-offset="0,10" data-original-title="Fullscreen" data-toggle="tooltip" title="Expand"></button> '
                         +'             </div>'
                         +'         </div>'
                         +'         <div class="panel-container show">'
                         +'             <div class="panel-content"> ' 
                         +'                 <div class="panel-container collapse show">'
                         +'                     <div class="panel-content">'
                         +'                         <div class="zGraph" id="'+ _container +'"></div>'
                         +'                     </div>'
                         +'                 </div> '
                         +'             </div>'
                         +'         </div>'
                         +'     </div>'
                         +'</div>'
                         +' <div class="col-md-6 col-sm-6 col-12 graphs mt-3 ">'
                         +'     <div class="panel mb-0">'
                         +'         <div class="panel-hdr text-primary">'
                         +'             <h2>'
                         +'                 <span class="mr-2"><i class="far fa-chart-pie"></i></span>'+ v.client_name+''
                         +'             </h2>'
                         +'             <div class="panel-toolbar"> '
                         +'                 <button class="btn btn-panel waves-effect waves-themed far fa-window-minimize" data-action="panel-collapse"  data-offset="0,10" data-original-title="Collapse" data-toggle="tooltip" title="Collapse"></button>'
                         +'                 <button class="btn btn-panel waves-effect waves-themed fas fa-expand" data-action="panel-fullscreen"  data-offset="0,10" data-original-title="Fullscreen" data-toggle="tooltip" title="Expand"></button> '
                         +'             </div>'
                         +'         </div>'
                          +'         <div class="panel-container show">' 
                         +'             <div class="panel-container collapse show">'
                         +'                 <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-1">' 
                         +'                     <div class="zGrid" id="'+ _gridDataContainer +'"></div>' 
                         +'                 </div>'
                         +'             </div> ' 
                         +'         </div>' 
                         +'     </div>'
                         +'</div>'
                         ;
                         
            	       $('#newDiv').append(templateString);
            	        
            	        var _params = {
                            client_id:v.client_id 
                        }
                        ,_sqlCode = "P1389" 
                        ,_value = "total_fare"
                        ,_category = "pay_year"
                        ,_isColorSet = false 
                        ,_json = {};  
                       
                        _json.title         = "Yearly Collection";
                        _json.container     = _container;
                        _json.client_id     = v.client_id;
                        _json.client_name   = v.client_name;
                        _json.value         = _value;
                        _json.category      = _category;
                        _json.isColorSet    = _isColorSet;
                        _json.subContainer  = _gridDataContainer;
                        _getColor(function(colorSet){
                            _getData(_sqlCode,_params, function(data){ 
                                _json.sqlCode   = _sqlCode;
                                _json.colorSet  = colorSet;
                                _json.data      = data;   
                                _displayYearGraph(_json,"BP"); 
                            });
                        });
                        
                    });  
                }
            }); 
       }
        function gridData(o){  
            var _dailyParams = window.yearParams;  
            var _data      = [];
            var _monthName  = function(param){
                var  _month     = []
                ,_DLength   = gData.length
                ,_MLength   = _month.length-1; 
                _month[1]   = "January";
                _month[2]   = "February";
                _month[3]   = "March";
                _month[4]   = "April";
                _month[5]   = "May";
                _month[6]   = "Jun";
                _month[7]   = "July";
                _month[8]   = "August";
                _month[9]   = "September";
                _month[10]  = "October";
                _month[11]  = "November";
                _month[12]  = "December"; 
                for (var i = 0; i < param.length; i++) { 
                    for(var n=1;n<=_month.length-1; n++){ 
                        if(param[i].pay_month === n){  
                             _data.push(
                                {pay_month:_month[n],month:param[i].pay_month,total_fare:param[i].total_fare}    
                            ); 
                        } 
                    }   
                } 
            }; 
            
            if(gMClick===false){  
                $("#"+o.subContainer).dataBind({
                     rows: o.data
                    ,height : 338 
                    ,dataRows : [
                             {text: "Pay Year"                  ,type: "input"          ,name: "pay_year"               ,width: 150     ,style: "text-align:center"}
                            ,{text: "Total Fare"                ,width: 250     ,style: "text-align:right"
                                ,onRender: function(d){
                                    return app.bs({name: "total_fare"         ,type: "input"     ,value: app.svn(d,"total_fare") ? app.svn(d,"total_fare").toMoney() : 0.00 ,style : "text-align:right;padding-right: 0.3rem;"  });
                                } 
                            }    
                    ]
                    ,onComplete : function(o){
                        this.find("input").attr("readonly",true)
                        this.find(".zRow").css("width","100%")
                    }
                });     
            }
            if(gMClick===true){ 
                gData=o.data;
                 _monthName(o.data)  
                $("#"+o.subContainer).dataBind({
                     rows: _data
                    ,height : 338 
                    ,dataRows : [
                             {text: "Pay Month"            ,width: 150     ,style: "text-align:center"
                                 ,onRender: function(d){ 
                                        return   "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='db.showModalDailyRecords(\""+_dailyParams.client_id+"\",\""
                                        +_dailyParams.year+"\",\""+ app.svn (d,"month") +"\",\""+gClientName+"\");'>" + app.svn (d,"pay_month") + " </a>"
                                    
                                }
                             } 
                            ,{text: "Total Fare"                                                                        ,width: 250     ,style: "text-align:right"
                                ,onRender: function(d){
                                    return app.bs({name: "total_fare"         ,type: "input"     ,value: app.svn(d,"total_fare") ? app.svn(d,"total_fare").toMoney() : 0.00  ,style : "text-align:right;padding-right: 0.3rem;" });
                                }
                            }    
                    ]
                    ,onComplete : function(o){ 
                        var _data       = o.data;  
                        var _tot        = {total_fare:0}; 
                        var _total      = {}; 
                        var _h          = ""; 
                        for(var i=0; i < _data.length;i++ ){
                            var _info = _data[i];
                            _tot.total_fare    +=Number(_info.total_fare)|| 0;    
                        }  
                        _h  +=  '<div class="zRow even zTotal" id="colTrip">'  
                            +' <div class="zCell" style="width:150px;text-align:right;">Total Sales</div>'
                            +' <div class="zCell" style="width:250px;text-align:right;padding-right: 0.3rem;">'+_tot.total_fare.toMoney()+'</div>'
                        +'</div>'; 
                         
                        this.find("#table").append(_h); 
                        this.find("input").attr("readonly",true);
                        this.find(".zRow").css("width","100%"); 
                        setFooterFreezed("#"+o.subContainer);
                    }
                }); 
            } 
        }
        function displayDailyRecords(clientId,year,month,clientName){ 
                $("#gridModalDailyRecords").dataBind({
                 sqlCode        : "P1387" 
                ,height         : 338
                ,parameters     : {client_id:clientId,year:year,month:month}
                ,dataRows       : [
                    {text: "Day"              ,width : 200          ,style:"text-align:center"
                        , onRender      : function(d) {  
                            return  app.svn (d,"pay_day");
                        }
                    } 
                    ,{text: "Total Fare"                ,width : 200     ,style : "text-align:right;"   
                        ,onRender: function(d){
                            return app.bs({name: "total_fare"         ,type: "input"     ,value: app.svn(d,"total_fare") ? app.svn(d,"total_fare").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                        } 
                    } 
                ]
                ,onComplete: function(o){
                    var _data = o.data.rows;  
                    var _tot        = {total_fare:0}; 
                    var _total      = {}; 
                    var _h          = "";
                    for(var i=0; i < _data.length;i++ ){
                        var _info = _data[i];
                        _tot.total_fare    +=Number(_info.total_fare)|| 0;    
                    } 
                    _h  +=  '<div class="zRow even zTotal" id="colTrip">'  
                        +' <div class="zCell" style="width:200px;text-align:right;">Total Sales</div>'
                        +' <div class="zCell" style="width:200px;text-align:right;padding-right: 0.3rem;">'+_tot.total_fare.toMoney()+'</div>'
                    +'</div>'; 
                    this.find("#table").append(_h); 
                    this.find("input").attr("readonly",true); 
                    this.find("#table").css("width","unset")
                    //setFooterFreezed("#gridModalDailyRecords")
                    
                }
            });
        } 
        function setFooterFreezed(zGridId){ 
            var _zRows = $(zGridId).find(".zGridPanel.right .zRows");
            var _tableRight   = _zRows.find("#table");
            var _zRowsHeight =   _zRows.height();
            var _everyZrowsHeight = $(".zRow:not(:contains('Total Sales'))");
            var _zTotala = _tableRight.find(".zTotal");
            var _arr = [];
            var _height = 0;
            var _zTotal = _tableRight.find(".zRow:contains('Total Sales')");
            
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
                           _zTotal.css({"top":_zRowsHeight - 40 - ( _tableRight.offset().top - _zRows.offset().top) });
                           _zTotala.prev().css({"margin-bottom":20 });
                        } 
                    });
                }else{
                    _zTotal.css({"top": _height}); 
                }
            }
        } 
        
        $("#filterMonth").click(function(){ 
            var _dailyParams = window.yearParams; 
            if(gDDChange===true) displayDailyRecords(_dailyParams.client_id,_dailyParams.year,gMonth,_dailyParams.client_name);
        });
        $(".btnExport").click(function(){
            var _grid       = "#gridModalDailyRecords" 
                ,_fileName  = gClientName+" "+gMonthName+" "+_dailyParams.year 
            $(_grid).convertToTable(function(table){
                var _html = table.get(0).outerHTML; 
                zsi.htmlToExcel({
                    fileName: _fileName
                    ,html : _html
                });
            }); 
           
        }); 
    return _public;
})();                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                  