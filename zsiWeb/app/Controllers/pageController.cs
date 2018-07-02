﻿using System;
using System.Collections.Generic;
using System.Web.Mvc;
using zsi.web.Models;
namespace zsi.web.Controllers
{
    public class pageController : baseController
    {
        // GET: Page
        public ActionResult Index()
        {
            if ( this.isAuthorizedUser() )
            {
                setPageLinks("admin");
                return View();
            }
            else
            {
                setRequestedURL();
                return Redirect(Url.Content("~/"));
            }
        }

        public ActionResult name(string param1)
        {
            param1 = param1.ToLower();
            param1 = (param1 != null ? param1 : "");
            if (CurrentUser.userName == null)
            {
                setRequestedURL();
                return Redirect(Url.Content("~/"));
            }
            else
            {
                string devURL = "zsiuserlogin";
                if (param1 == "signin")
                {
                    Session["zsi_login"] = "N";
                    Session["authNo"] = null;
                    Response.Cookies["zsi_login"].Expires = DateTime.Now.AddDays(-2);
                    Response.Cookies["username"].Expires = DateTime.Now.AddDays(-2);
                    Response.Cookies["isMenuItemsSaved"].Expires = DateTime.Now.AddDays(-2);
                    Session.Abandon();
                    return Redirect(Url.Content("~/"));
                }
                  if (param1 != devURL && param1 != "signin")
                {

                    if(this.CurrentUser.isDeveloper == "Y" )
                    {
                        if ( ! this.isAuthorizedUser() )
                            return Redirect(Url.Content("~/") + "page/name/" + devURL);
                    }

                }
                if ( this.AppConfig.system_pages.ToLower().Contains(param1.ToLower())  && ! this.isAuthorizedUser() ) return Redirect(Url.Content("~/"));

                setPageLinks(param1);
                return View();
            }
        }


        [HttpPost]
        public ActionResult loginAdmin()
        {
            if (Request["user_name"] == "zsidev" && Request["user_pwd"] == this.AppConfig.developer_key)
            {
                Session["zsi_login"] = "Y";
                Response.Cookies["zsi_login"].Value = "Y";
                Response.Cookies["zsi_login"].Expires = DateTime.Now.AddDays(1);
                return Redirect(gePriorityURL(Url.Content("~/") + "page/name/" + this.AppConfig.default_page));
            }
            else {
                Session["zsi_login"] ="N";
                return Redirect(Url.Content("~/") + "page/name/zsiUserLogin");
            }
            

        }
      
    }
}