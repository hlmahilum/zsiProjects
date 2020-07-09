CREATE VIEW dbo.users_v
AS
SELECT        dbo.users.user_id, dbo.users.logon, dbo.users.last_name, dbo.users.first_name, dbo.users.password, dbo.users.role_id, dbo.users.is_active, dbo.users.is_admin, dbo.users.img_filename, 
                         dbo.users.first_name + N' ' + CASE WHEN middle_name IS NULL THEN '' ELSE middle_name END + ' ' + dbo.users.last_name AS userFullName, dbo.users.is_developer, 
                         dbo.users.last_name + N',' + dbo.users.first_name AS last_first_name, dbo.roles.role_name, dbo.users.middle_name, dbo.users.name_suffix, dbo.users.company_code, dbo.users.hash_key, dbo.users.company_id, 
                         dbo.clients_v.company_logo, dbo.clients_v.client_name AS company_name
FROM            dbo.users INNER JOIN
                         dbo.clients_v ON dbo.users.company_id = dbo.clients_v.client_id LEFT OUTER JOIN
                         dbo.roles ON dbo.users.role_id = dbo.roles.role_id
WHERE        (dbo.users.logon IS NOT NULL)
