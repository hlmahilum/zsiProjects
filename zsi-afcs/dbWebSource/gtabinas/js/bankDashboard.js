        
var db=(function(){ 
        var   bs                    = zsi.bs.ctrl 
            ,_public                = {}
             ,gContainer            = null
            ,gName                  = ""
            ,gClientId              = ""
            ,gData                  = ""
            ,gMonth                 = ""
            ,gYear                  = ""
            ,gMonthName             = ""
            ,gDDChange              = false
            ,gDataRows              = ""
            ,gGridDataContainer     = ""
            ,gMonthlyClicked        = false
             ;
            
        
        zsi.ready = function(){   
            $(".page-title").html("Dashboard");
             var _roleId     = app.userInfo.role_id;    
                getYearlyData();
                getTimeDataSorting();
        };
         
        
        function getYearlyData(){ 
            zsi.getData({
                 sqlCode : "P1389" 
                ,parameters : {client_id:app.userInfo.company_id}
                ,onComplete : function(d) {
                    var _rows = d.rows;  
                    var _getColor = function(cb){ 
                        var _colorSet = new am4core.ColorSet();
                        _colors = _colorSet;   
                        cb(_colors);
                    }; 
                    var _displayYearGraph = function(o){   
                        var _data = [];
                        var _colorSet = new am4core.ColorSet(); 
                        var _getCategoryColor = function(category, index){
                            var _color = $.grep(_colorRows, function(z) {
                                return z.field_name.toUpperCase() == category.toUpperCase();
                            });
                            return (!isUD(_color[0])) ? _color[0].color_value.toLowerCase() : _colorSet.getIndex(index);
                        };
                        var _setData = function(){  
                            $.each(o.data, function(i,v){  
                                var _json = {};  
                                    _json.category = v.pay_year;
                                    _json.value = v.total_fare;
                                    _json.color = _colorSet.next();  
                                _data.push(_json);
                                
                            });
                        
                        };
                        _setData();  
                        am4core.ready(function() { 
                             var chart = am4core.create(o.container, am4charts.PieChart); 
                             chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
                            chart.numberFormatter.numberFormat = '###';
                            // Set data  
                            var generateChartData = function() { 
                                var chartData       = [] 
                                    ,_dataLength    = _data.length;
                                    
                                for (var i = 0; i < _dataLength; i++) {  
                                    chartData.push({
                                        category: _data[i].category,
                                        value: _data[i].value,
                                        color: _data[i].color,
                                        id: i
                                      }); 
                                    } 
                                    
                                return chartData; 
                            }; 
                            // Add data
                            chart.data = generateChartData();  
                            chart.radius = am4core.percent(70);
                            chart.innerRadius = am4core.percent(40);
                            chart.startAngle = 180;
                            chart.endAngle = 360; 
                            
                            var series = chart.series.push(new am4charts.PieSeries());
                            series.dataFields.value = "value";
                            series.dataFields.category = "category";
                            
                            series.slices.template.cornerRadius = 10;
                            series.slices.template.innerCornerRadius = 7;
                            series.slices.template.draggable = true;
                            series.slices.template.inert = true;
                            series.alignLabels = false;
                            
                            series.hiddenState.properties.startAngle = 90;
                            series.hiddenState.properties.endAngle = 90;
                            
                            chart.legend = new am4charts.Legend();
                               
                        });
                         
                    }; 
                    var _container = "graph1"
                        ,_value = "total_fare"
                        ,_category = "pay_year"
                        ,_isColorSet = false
                        ,_json = {};
                        _json.title = "Collection";
                        _json.container = _container;
                        _json.value = _value;
                        _json.category = _category;
                        _json.isColorSet = _isColorSet;  
                        _getColor(function(colorSet){ 
                            _json.colorSet = colorSet;
                            _json.data = _rows;
                            _json.category; 
                            _json.title = "Collection";  
                            _displayYearGraph(_json); 
                             
                        });  
                
                    }
                });
           } 
         function getTimeDataSorting(){ 
            zsi.getData({
                 sqlCode : "P1387" 
                ,parameters :  {
                    client_id:app.userInfo.company_id
                    ,month:1 
                   ,year:2021
                }
                ,onComplete : function(d) {
                    var _rows = d.rows;  
                    var _getColor = function(cb){ 
                        var _colorSet = new am4core.ColorSet();
                        _colors = _colorSet;   
                        cb(_colors);
                    }; 
                    var _displayYearGraph = function(o){   
                        var _data = [];
                        var _colorSet = new am4core.ColorSet(); 
                        var _getCategoryColor = function(category, index){
                            var _color = $.grep(_colorRows, function(z) {
                                return z.field_name.toUpperCase() == category.toUpperCase();
                            });
                            return (!isUD(_color[0])) ? _color[0].color_value.toLowerCase() : _colorSet.getIndex(index);
                        };
                        var _setData = function(){  
                            $.each(o.data, function(i,v){  
                                var _json = {};  
                                    _json.category = v.pay_day;
                                    _json.value = v.total_fare;
                                    _json.color = _colorSet.next();  
                                _data.push(_json);
                                
                            });
                        
                        };
                        _setData();  
                        am4core.ready(function() { 
                             var chart = am4core.create(o.container, am4charts.XYChart3D); 
                            chart.numberFormatter.numberFormat = '###';
                            // Set data  
                            var generateChartData = function() { 
                                var chartData       = [] 
                                    ,_dataLength    = _data.length;
                                    
                                for (var i = 0; i < _dataLength; i++) {  
                                    chartData.push({
                                        category: _data[i].category,
                                        value: _data[i].value,
                                        color: _data[i].color,
                                        id: i
                                      }); 
                                    } 
                                    
                                return chartData; 
                            }; 
                            // Add data
                            chart.data = generateChartData(); 
                            chart.padding(40, 40, 40, 40);
                           // Add and configure Series    
                            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                                categoryAxis.renderer.grid.template.location = 0;
                                categoryAxis.dataFields.category = "category";
                                categoryAxis.renderer.minGridDistance = 60;
                                categoryAxis.renderer.inversed = true;
                                categoryAxis.renderer.grid.template.disabled = true;
                           
                            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis()); 
                                valueAxis.min = 0;
                                valueAxis.extraMax = 0.1;
                                
                            var series = chart.series.push(new am4charts.ColumnSeries());
                                series.dataFields.categoryX = "category";
                                series.dataFields.valueY = "value";
                                series.tooltipText = "{valueY.value}"
                                series.columns.template.strokeOpacity = 0;
                                series.columns.template.column.cornerRadiusTopRight = 10;
                                series.columns.template.column.cornerRadiusTopLeft = 10;
                                //series.interpolationDuration = 1500;
                                //series.interpolationEasing = am4core.ease.linear;
                                var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                                labelBullet.label.verticalCenter = "bottom";
                                labelBullet.label.dy = -10;
                                labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
                                
                                chart.zoomOutButton.disabled = true;
                                
                                // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                                series.columns.template.adapter.add("fill", function (fill, target) {
                                 return chart.colors.getIndex(target.dataItem.index);
                                });
                                
                                setInterval(function () {
                                 am4core.array.each(chart.data, function (item) {
                                   item.visits += Math.round(Math.random() * 200 - 100);
                                   item.visits = Math.abs(item.visits);
                                 })
                                 chart.invalidateRawData();
                                }, 2000)
                                
                                categoryAxis.sortBySeries = series;
                                 
                        });
                      
                    }; 
                    var _container = "graphTimeDataSorting"
                        ,_value = "total_fare"
                        ,_category = "pay_day"
                        ,_isColorSet = false
                        ,_json = {};
                        
                        _json.title = "Collection";
                        _json.container = _container;
                        _json.value = _value;
                        _json.category = _category;
                        _json.isColorSet = _isColorSet;  
                        _getColor(function(colorSet){ 
                            _json.colorSet = colorSet;
                            _json.data = _rows;
                            _json.category; 
                            _json.title = "Collection";  
                            _displayYearGraph(_json); 
                             
                        });  
                
                    }
                });
           } 
         
         
         
    return _public;
})();                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                   