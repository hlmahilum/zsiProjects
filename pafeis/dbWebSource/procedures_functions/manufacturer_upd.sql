
CREATE PROCEDURE [dbo].[manufacturer_upd]
(
    @tt    manufacturer_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  manufacturer_name		= b.manufacturer_name
		,full_address			= b.full_address
		,contact_no  			= b.contact_no
		,email_address  		= b.email_address
		,contact_person		    = b.contact_person
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.manufacturer a INNER JOIN @tt b
    ON a.manufacturer_id = b.manufacturer_id
    WHERE (
			isnull(a.manufacturer_name,'')			<> isnull(b.manufacturer_name,'')  
		OR	isnull(a.full_address,'')		<> isnull(b.full_address,'')  
		OR	isnull(a.contact_no,'')		<> isnull(b.contact_no,'')   
		OR	isnull(a.email_address,'')	<> isnull(b.email_address,'')   
		OR	isnull(a.contact_person,'')		<> isnull(b.contact_person,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.manufacturer (
         manufacturer_name 
		,full_address
		,contact_no
		,email_address
		,contact_person
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        manufacturer_name 
	   ,full_address	
	   ,contact_no
	   ,email_address
	   ,contact_person
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE manufacturer_id IS NULL;
END

