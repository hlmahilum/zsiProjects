CREATE TABLE javascripts(
js_id	INT IDENTITY(1,1)	NOT NULL
,page_id	INT	NULL
,js_content	NTEXT(2147483646)	NULL
,rev_no	INT	NOT NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)