﻿using System.Web.Mvc;
namespace zsi.web.Controllers
{
    public class dataController : baseController
    {
        [HttpPost]
        public JsonResult Update()
        {

            return Json(DataHelper.processPostData(HttpContext.Request));

            
        }

        [HttpPost]
        public ContentResult GetRecords()
        {

            return Content(DataHelper.GetJSONData(HttpContext.Request), "application/json");


        }
    }
}