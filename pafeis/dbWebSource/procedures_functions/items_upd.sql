-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 7, 2016 9:27PM
-- Description:	Insert and update items.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE PROCEDURE [dbo].[items_upd]
(
    @tt    items_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_code_id		    = b.item_code_id
		,serial_no              = b.serial_no
		,manufacturer_id        = b.manufacturer_id
		,dealer_id              = b.dealer_id
		,supply_source_id       = b.supply_source_id
		,time_since_new         = b.time_since_new
		,time_before_overhaul   = b.time_before_overhaul
		,time_since_overhaul    = b.time_since_overhaul
		,remaining_time         = b.remaining_time
		,date_delivered         = b.date_delivered
		,aircraft_info_id       = b.aircraft_info_id
		,date_issued            = b.date_issued
		,status_id				= b.status_id
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.items a INNER JOIN @tt b
    ON a.item_id = b.item_id
    WHERE (
			isnull(a.item_code_id,0)			<> isnull(b.item_code_id,0)  
		OR	isnull(a.serial_no,'')				<> isnull(b.serial_no,'')  
		OR	isnull(a.manufacturer_id,0)		    <> isnull(b.manufacturer_id,0)  
		OR	isnull(a.dealer_id,0)				<> isnull(b.dealer_id,0)  
		OR	isnull(a.supply_source_id,0)		<> isnull(b.supply_source_id,0)  
		OR	isnull(a.time_since_new,'')		    <> isnull(b.time_since_new,'')  
		OR	isnull(a.time_before_overhaul,'')	<> isnull(b.time_before_overhaul,'')  
		OR	isnull(a.time_since_overhaul,'')	<> isnull(b.time_since_overhaul,'')  
		OR	isnull(a.remaining_time,'')		    <> isnull(b.remaining_time,'')  
		OR	isnull(a.date_delivered,'')		    <> isnull(b.date_delivered,'')  
		OR	isnull(a.aircraft_info_id,0)		<> isnull(b.aircraft_info_id,0)  
		OR	isnull(a.date_issued,'')		    <> isnull(b.date_issued,'')  
		OR	isnull(a.status_id,0)				<> isnull(b.status_id,0)  
	)
	   
-- Insert Process
    INSERT INTO dbo.items (
         item_code_id 
		,serial_no
		,manufacturer_id
		,dealer_id
		,supply_source_id
		,time_since_new
		,time_before_overhaul
		,time_since_overhaul
		,remaining_time
		,date_delivered
		,aircraft_info_id
		,date_issued
		,status_id
        ,created_by
        ,created_date
        )
    SELECT 
         item_code_id 
		,serial_no
		,manufacturer_id
		,dealer_id
		,supply_source_id
		,time_since_new
		,time_before_overhaul
		,time_since_overhaul
		,remaining_time
		,date_delivered
		,aircraft_info_id
		,date_issued
		,status_id
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE item_id IS NULL;
END

