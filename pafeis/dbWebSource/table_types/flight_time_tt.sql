CREATE TYPE flight_time_tt AS TABLE(
flight_time_id	INT	NULL
,flight_operation_id	INT	NULL
,flight_take_off_time	DATETIME	NULL
,flight_landing_time	DATETIME	NULL
,no_hours	DECIMAL(12)	NULL
,is_engine_off	CHAR(1)	NULL
,remarks	NVARCHAR(2000)	NULL)