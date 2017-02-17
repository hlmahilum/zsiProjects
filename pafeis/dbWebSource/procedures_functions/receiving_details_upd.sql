/****** Object:  StoredProcedure [dbo].[receiving_details_upd]    Script Date: 12/19/2016 11:59:40 AM ******/
CREATE PROCEDURE [dbo].[receiving_details_upd]
(
    @tt    receiving_details_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_code_id			= b.item_code_id
		,serial_no				= b.serial_no
		,unit_of_measure_id		= b.unit_of_measure_id
		,quantity				= b.quantity
		,item_class_id			= b.item_class_id
		,time_since_new         = b.time_since_new
		,time_since_overhaul    = b.time_since_overhaul
		,remarks	            = b.remarks
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.receiving_details a INNER JOIN @tt b
    ON a.receiving_detail_id = b.receiving_detail_id
    WHERE ISNULL(b.is_edited,'N')='Y'
  
-- Insert Process
    INSERT INTO dbo.receiving_details (
         receiving_id 
		,item_code_id
		,serial_no
		,unit_of_measure_id
		,quantity
		,item_class_id
		,time_since_new
		,time_since_overhaul
		,remarks
		,created_by
        ,created_date
        )
    SELECT 
        receiving_id 
	   ,item_code_id
	   ,serial_no
	   ,unit_of_measure_id	
	   ,quantity
	   ,item_class_id
	   ,time_since_new
	   ,time_since_overhaul
	   ,remarks
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE receiving_detail_id IS NULL
	  AND receiving_id IS NOT NULL
	  AND item_code_id IS NOT NULL
END


