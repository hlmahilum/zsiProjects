CREATE TYPE employees_tt AS TABLE(
id	INT	NULL
,is_edited	CHAR(1)	NULL
,inactive_type_code	CHAR(1)	NULL
,inactive_date	DATE	NULL
,employee_id	INT	NULL
,last_name	NVARCHAR(100)	NULL
,first_name	NVARCHAR(100)	NULL
,middle_name	NVARCHAR(100)	NULL
,name_suffix	NVARCHAR(100)	NULL
,gender	CHAR(1)	NULL
,civil_status_code	CHAR(1)	NULL
,date_hired	DATE	NULL
,empl_type_code	CHAR(1)	NULL
,department_id	INT	NULL
,section_id	INT	NULL
,position_id	INT	NULL
,basic_pay	DECIMAL(20)	NULL
,pay_type_code	CHAR(1)	NULL
,sss_no	NVARCHAR(100)	NULL
,tin	NVARCHAR(100)	NULL
,philhealth_no	NVARCHAR(100)	NULL
,hmdf_no	NVARCHAR(100)	NULL
,account_no	NVARCHAR(100)	NULL
,no_shares	DECIMAL(12)	NULL
,contact_name	NVARCHAR(100)	NULL
,contact_phone_no	NVARCHAR(100)	NULL
,contact_address	NVARCHAR(100)	NULL
,contact_relation_id	INT	NULL
,is_active	VARCHAR(1)	NULL)