  
(function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
      /*  , $j   = jQuery.noConflict()*/
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Shifts");
        displayShifts(); 
    }; 
    function displayShifts(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 url                : app.procURL + "shifts_sel"  
                ,width      : $(".zContainer").outerWidth()
                //,width              : $("#panel-content").width()  
                ,blankRowsLimit     : 5
                ,dataRows           : [
                        {text:cb        ,width:25              ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"shift_id"         ,type:"hidden"      ,value: svn (d,"shift_id")}) 
                                            + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                            
                            }
                        
                        } 
                        ,{text:"Shift Code"                     ,type:"input"           ,name:"shift_code"                  ,width:100       ,style:"text-align:left"} 
                        ,{text:"Monday"                         ,type:"select"          ,name:"monday"                      ,width:200       ,style:"text-align:center"} 
                        ,{text:"Tuesday"                        ,type:"select"          ,name:"tuesday"                     ,width:200       ,style:"text-align:center"} 
                        ,{text:"Wednesday"                      ,type:"select"          ,name:"wednesday"                   ,width:200       ,style:"text-align:center"}
                        ,{text:"Thursday"                       ,type:"select"          ,name:"thursday"                    ,width:200       ,style:"text-align:center"} 
                        ,{text:"Friday"                         ,type:"select"          ,name:"friday"                      ,width:200       ,style:"text-align:center"}
                        ,{text:"Saturday"                       ,type:"select"          ,name:"saturday"                    ,width:200       ,style:"text-align:center"}
                        ,{text:"Sunday"                         ,type:"select"          ,name:"sunday"                      ,width:200       ,style:"text-align:center"} 
                        ,{text:"No. Hours"                      ,type:"input"           ,name:"no_hours"                    ,width:100       ,style:"text-align:left"} 
                        //,{text:"Next Day Out"                   ,type:"yesno"           ,name:"next_day_out"                ,width:100       ,style:"text-align:left"}
                        ,{text:"From Time In"                   ,type:"time"            ,name:"from_time_in"                ,width:100       ,style:"text-align:left" } 
                        ,{text:"To Time In"                     ,type:"time"            ,name:"to_time_in"                  ,width:100       ,style:"text-align:left" } 
                        
                    ] 
                    ,onComplete : function(d){    
                        this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");  
                        this.find("select[name='monday']").dataBind("duty");
                        this.find("select[name='tuesday']").dataBind("duty");
                        this.find("select[name='wednesday']").dataBind("duty");
                        this.find("select[name='thursday']").dataBind("duty");
                        this.find("select[name='friday']").dataBind("duty");
                        this.find("select[name='saturday']").dataBind("duty");
                        this.find("select[name='sunday']").dataBind("duty");
                        //this.find("#grid input[name='to_time_in']").addClass("timepicker");  
                    } 
                });
            }   
    
    
        $("#btnSave").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "shifts_upd"
                //,optionalItems: ["is_active"] 
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#grid").trigger("refresh");
                } 
            }); 
        });
        
        $("#btnDelete").click(function (){ 
            zsi.form.deleteData({ 
                code:"ref-00015"
               ,onComplete:function(data){
                    displayShifts();
               }
            });
        });
    
})();

                          