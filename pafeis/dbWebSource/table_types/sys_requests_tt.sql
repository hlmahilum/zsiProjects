CREATE TYPE sys_requests_tt AS TABLE(
ticket_id	INT	NOT NULL
,ticket_date	DATETIME	NOT NULL
,requested_by	INT	NOT NULL
,request_desc	NVARCHAR(0)	NOT NULL
,request_type_id	INT	NOT NULL
,status_id	INT	NOT NULL
,img_filename	NVARCHAR(0)	NULL)