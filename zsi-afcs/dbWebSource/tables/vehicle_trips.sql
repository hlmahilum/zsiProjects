CREATE TABLE vehicle_trips(
trip_id	INT IDENTITY(1,1)	NOT NULL
,trip_no	INT	NULL
,trip_date	DATE	NULL
,vehicle_id	INT	NULL
,driver_id	INT	NULL
,pao_id	INT	NULL
,start_date	DATETIME	NULL
,start_odo	INT	NULL
,end_date	DATETIME	NULL
,end_odo	INT	NULL
,start_by	INT	NULL
,end_by	INT	NULL
,no_kms	INT	NULL
,total_collection_amt	DECIMAL(20)	NULL)