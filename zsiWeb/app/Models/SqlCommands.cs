﻿namespace zsi.web.Models
{
    using System;
    using System.Data;
    using System.Data.SqlClient;
    public class SqlCommands
    {
        public string code { get; set; }
        public string text { get; set; }
        public bool IsProcedure { get; set; }
        public bool isPublic { get; set; }

        public SqlDataReader SqlDataReader
        {
            set
            {
                SqlDataReader reader = value;
                if (reader["sqlcmd_code"] != DBNull.Value)
                {
                    this.code = (string)reader["sqlcmd_code"];
                }
                if (reader["sqlcmd_text"] != DBNull.Value)
                {
                    this.text= (string)reader["sqlcmd_text"];
                }
                if (reader["is_procedure"] != DBNull.Value)
                {
                    this.IsProcedure = (string)reader["is_procedure"] =="Y"? true : false ;
                }
                if (reader["is_public"] != DBNull.Value)
                {
                    this.isPublic = (string)reader["is_public"] == "Y" ? true : false;  
                }
       
            }
        }
    }


    public class dcSQLCommands : SqlCommands,IDisposable
    {
        public dcSQLCommands() { }
        public dcSQLCommands(SqlDataReader reader)
        {
            this.SqlDataReader = reader;
        }
        public void Dispose() {
            SqlDataReader = null;
        }
        public SqlCommands GetInfo(string code)
        {
            try
            {
                SqlConnection dbConn = new SqlConnection(dbConnection.ConnectionString);
                string sql = string.Format("select sqlcmd_code,sqlcmd_text,is_procedure,is_public from sql_commands where sqlcmd_code='{0}'", code);
                SqlCommand command = new SqlCommand(sql, dbConn);
                //command.CommandType = CommandType.Text;
                dbConn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                SqlCommands _info = new SqlCommands();
                while (reader.Read())
                {
                    _info.SqlDataReader = reader;
                }
                reader.Close();
                dbConn.Close();
                return _info;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
       

    }
}