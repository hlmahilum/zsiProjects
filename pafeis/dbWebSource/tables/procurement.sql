CREATE TABLE procurement(
procurement_id	INT IDENTITY(1,1)	NOT NULL
,procurement_date	DATE	NOT NULL
,procurement_code	NVARCHAR(40)	NOT NULL
,procurement_name	VARCHAR(500)	NOT NULL
,organization_id	INT	NOT NULL
,supplier_id	INT	NOT NULL
,promised_delivery_date	DATE	NOT NULL
,status_id	INT	NOT NULL
,actual_delivery_date	DATE	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)