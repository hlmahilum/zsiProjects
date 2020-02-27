﻿using System;
using System.Web.Mvc;
using zsi.web.Models;

namespace zsi.web.Controllers
{
    public class DataController : BaseController
    {
        [HttpPost]
        public ContentResult Update()
        {
            try
            {
                using (new impersonate())
                {

                    return Content(DataHelper.ProcessRequest(HttpContext.Request, ExecutionType.NonQuery, JsonRowsFormat.KeyValue, false), "application/json");
                }
            }
            catch (Exception ex)
            {
                return Content( "{errMsg:'" + ex.Message  +"'}", "application/json");
            }
        }

        [HttpPost]
        public ContentResult GetRecords()
        {
            try
            {
                using (new impersonate())
                {
                    return Content(DataHelper.ProcessRequest(HttpContext.Request, ExecutionType.Reader, JsonRowsFormat.KeyValue, false), "application/json");
                }
            }
            catch (Exception ex)
            {
                return Content("{errMsg:'" + ex.Message + "'}", "application/json");
            }
        }

        public ContentResult GetRecords2()
        {
            try
            {
                using (new impersonate())
                {
                    return Content(DataHelper.ProcessRequest(HttpContext.Request, ExecutionType.Reader, JsonRowsFormat.Array,false), "application/json");
                }
            }
            catch (Exception ex)
            {
                return Content("{errMsg:'" + ex.Message + "'}", "application/json");
            }
        }

    }
}