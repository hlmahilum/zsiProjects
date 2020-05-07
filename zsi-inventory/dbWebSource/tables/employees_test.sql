CREATE TABLE employees_test(
id	INT IDENTITY(1,1)	NOT NULL
,employee_id	NVARCHAR(100)	NULL
,last_name	NVARCHAR(100)	NULL
,first_name	NVARCHAR(100)	NULL
,middle_name	NVARCHAR(100)	NULL
,name_suffix	NVARCHAR(100)	NULL
,gender	CHAR(1)	NULL
,civil_status_code	CHAR(1)	NULL
,empl_type_code	CHAR(1)	NULL
,basic_pay	DECIMAL(20)	NULL
,pay_type_code	CHAR(1)	NULL
,sss_no	NVARCHAR(100)	NULL
,tin	NVARCHAR(100)	NULL
,philhealth_no	NVARCHAR(100)	NULL
,hmdf_no	NVARCHAR(100)	NULL
,account_no	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL
,inactive_type_code	CHAR(1)	NULL
,inactive_date	DATE	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)