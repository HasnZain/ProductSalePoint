using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace psl.Models
{
    public class Response
    { 
        public string Result { get; set; }
        public string Message { get; set; }
        public string ID { get; set; }
        public string Name { get; set; }

        public Response()
        {
            Result = "Fail";//Success
            Message = "Internal Server Error";
            ID = "0";
            Name = "";
        }
    }
}