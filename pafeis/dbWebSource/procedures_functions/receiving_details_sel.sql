
CREATE PROCEDURE [dbo].[receiving_details_sel]
(
    @receiving_id INT = null
   ,@user_id      INT 
   ,@col_no       INT = 1
   ,@order_no     INT = 0
)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @stmt VARCHAR(MAX);
	DECLARE @role_id INT;
	DECLARE @organization_id INT;

	SELECT @role_id = role_id, @organization_id = organization_id FROM users WHERE [user_id] = @user_id;
	
	SET @stmt =  'SELECT * FROM dbo.receiving_details_v WHERE role_id = '+ CAST(@role_id AS VARCHAR(20)) + ' AND organization_id = ' + CAST(@organization_id AS VARCHAR(20))
  
	IF @receiving_id IS NOT NULL  
		SET @stmt = @stmt + ' AND receiving_id = ' + CAST(@receiving_id AS VARCHAR(20)); 

	SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
	IF @order_no = 0
		SET @stmt = @stmt + ' ASC';
	ELSE
		SET @stmt = @stmt + ' DESC';
  
	EXEC(@stmt);
	
END