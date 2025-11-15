using emsbackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PdfSharpCore;
using PdfSharpCore.Pdf;
using TheArtOfDev.HtmlRenderer.PdfSharp;

namespace emsbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        [Authorize]
        [HttpPost("generate-pdf")]
        public async Task<IActionResult> GeneratePDF(GetSalaryDetailsDTO dto)
        {
            var document = new PdfDocument();
            string htmlContent = $@"
         <div style='font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;'>
          <h1 style='text-align:center;  margin-bottom: 30px;'>Salary Slip</h1>

          <table style='width:100%; border-collapse: collapse; margin-bottom: 20px; font-size: 16px;'>
            <tr>
              <td style='font-weight:bold; width:50%; padding:8px;'>Employee ID:</td>
              <td style='padding:8px;'>{dto.EmpId}</td>
            </tr>
            <tr>
              <td style='font-weight:bold; padding:8px;'>Employee Name:</td>
              <td style='padding:8px;'>{dto.EmpName}</td>
            </tr>
            <tr>
              <td style='font-weight:bold; padding:8px;'>Month:</td>
              <td style='padding:8px;'>{dto.Month}</td>
            </tr>
            <tr>
              <td style='font-weight:bold; padding:8px;'>Year:</td>
              <td style='padding:8px;'>{dto.Year}</td>
            </tr>
              <tr>
              <td style='font-weight:bold; padding:8px;'>Working Days:</td>
              <td style='padding:8px;'>{dto.WorkingDays}</td>
            </tr>
              <tr>
              <td style='font-weight:bold; padding:8px;'>Attendance Days:</td>
              <td style='padding:8px;'>{dto.AttendanceDays}</td>
            </tr>
               <tr>
              <td style='font-weight:bold; padding:8px;'>Working Salary:</td>
              <td style='padding:8px;'>{dto.WorkingSalery}</td>
            </tr>
             <tr>
              <td style='font-weight:bold; padding:8px;'>Provide Salary:</td>
              <td style='padding:8px;'>{dto.ProvideSalery}</td>
            </tr>
           
          </table>

          

          <div style='margin-top:50px; text-align:right; font-size:15px;'>
            <span>Authorized By,</span><br>
           <span style=""font-weight:bold;"">Pawan Kumar Sharma</span>
          </div>
        </div>";



            PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);
            byte[]? response = null;
            using (MemoryStream ms = new MemoryStream())
            {
                document.Save(ms);
                response = ms.ToArray();
            }

            string Filename =  dto.EmpName+"_"+dto.Month + ".pdf";
                return File(response, "application/pdf", Filename);
        }
    }
}
