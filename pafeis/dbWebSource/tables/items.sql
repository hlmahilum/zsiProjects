CREATE TABLE items(
item_id	INT IDENTITY(1,1)	NOT NULL
,item_code_id	INT	NOT NULL
,serial_no	NVARCHAR(40)	NULL
,manufacturer_id	INT	NULL
,dealer_id	INT	NULL
,supply_source_id	INT	NULL
,time_since_new	DATETIME	NULL
,time_before_overhaul	DATETIME	NULL
,time_since_overhaul	DATETIME	NULL
,remaining_time_hr	INT	NULL
,remaining_time_min	INT	NULL
,date_delivered	DATETIME	NULL
,aircraft_info_id	INT	NULL
,date_issued	DATETIME	NULL
,status_id	INT	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,item_class_id	INT	NULL)