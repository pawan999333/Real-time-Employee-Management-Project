using emsbackend.Models;
using emsbackend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace emsbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly string _connectionString;
        private readonly ITokenHandler tokenHandler;

        public AuthController(IConfiguration configuration, ITokenHandler tokenHandler)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            this.tokenHandler = tokenHandler;

        }

        public static string EncryptPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                return null;
            }
            else
            {


                byte[] storePassword = ASCIIEncoding.ASCII.GetBytes(password);
                string encryptedPassword = Convert.ToBase64String(storePassword);
                return encryptedPassword;
            }
        }

        public static string DecryptPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                return null;
            }
            else
            {
                byte[] encryptedPassword = Convert.FromBase64String(password);
                string decryptedPassword = ASCIIEncoding.ASCII.GetString(encryptedPassword);
                return decryptedPassword;
            }

        }

        [Authorize(Roles = "admin")]
        [HttpPost("Add-Employee")]
        public ActionResult AddEmployee(EmployeeDTO dto)
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_AddOrUpdateEmployee",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };
                string generatedPassword = "12345";

                command.Parameters.AddWithValue("@EmpName", dto.EmpName);
                command.Parameters.AddWithValue("@Email", dto.Email);
                command.Parameters.AddWithValue("@Gender", dto.Gender);
                command.Parameters.AddWithValue("@DateOfBirth", dto.DateOfBirth);
                command.Parameters.AddWithValue("@JoiningDate", dto.JoiningDate);
                command.Parameters.AddWithValue("@Salery", dto.Salery);
                command.Parameters.AddWithValue("@LastWorkingDate", dto.LastWorkingDate);
                command.Parameters.AddWithValue("@JobTitle", dto.JobTitle);
                command.Parameters.AddWithValue("@DepartmentId", dto.DepartmentId);
                command.Parameters.AddWithValue("@Phone", dto.Phone);
                command.Parameters.AddWithValue("@PasswordHash", EncryptPassword(generatedPassword));

                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();

                return Ok(new { message = "Employee Added Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Invalid or Duplicate Employee request." });
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task <IActionResult> login(LoginDTO dto)
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);
                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_Login",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@Email", dto.Email);
                command.Parameters.AddWithValue("@PasswordHash", EncryptPassword(dto.PasswordHash));

                connection.Open();
                List<GetEmployeeDetails> response = new List<GetEmployeeDetails>();

                using (SqlDataReader sqlDataReader = command.ExecuteReader())
                {
                    while (sqlDataReader.Read())
                    {
                        GetEmployeeDetails employeeDto = new GetEmployeeDetails();

                        employeeDto.Id = Convert.ToInt32(sqlDataReader["Id"]);
                        employeeDto.EmpName = Convert.ToString(sqlDataReader["EmpName"]);
                        employeeDto.Email = Convert.ToString(sqlDataReader["Email"]);
                        employeeDto.DateOfBirth = Convert.ToDateTime(sqlDataReader["DateOfBirth"]);
                        employeeDto.Salery = Convert.ToString(sqlDataReader["Salery"]);
                        employeeDto.JoiningDate = Convert.ToDateTime(sqlDataReader["JoiningDate"]);
                        employeeDto.LastWorkingDate = Convert.ToDateTime(sqlDataReader["LastWorkingDate"]);
                        employeeDto.DepartmentId = Convert.ToInt32(sqlDataReader["DepartmentId"]);
                        employeeDto.DepartmentName = Convert.ToString(sqlDataReader["DepartmentName"]);
                        employeeDto.JobTitle = Convert.ToString(sqlDataReader["JobTitle"]);
                        employeeDto.Gender = Convert.ToString(sqlDataReader["Gender"]);
                        employeeDto.Phone = Convert.ToString(sqlDataReader["Phone"]);
                        employeeDto.role = Convert.ToString(sqlDataReader["role"]);


                        response.Add(employeeDto);

                        
                    }
                }

                if (response.Count > 0)
                {
                    var token = await tokenHandler.CreateTokenAsync(response.First());
                    return Ok(new {success=true, token=token, message="Login successfully", user = response.First() });
                }
                else
                    return Unauthorized(new { success=false, message = "Invalid email or password." });



            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while processing login." });
            }

        }


        [Authorize(Roles = "admin")]

        [HttpPut("UpdateEmployee")]
        public ActionResult UpdateEmployee(EmployeeDTO dto)
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_AddOrUpdateEmployee",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };
                string generatedPassword = "12345";

                command.Parameters.AddWithValue("@Id", dto.Id);
                command.Parameters.AddWithValue("@EmpName", dto.EmpName);
                command.Parameters.AddWithValue("@Email", dto.Email);
                command.Parameters.AddWithValue("@Gender", dto.Gender);
                command.Parameters.AddWithValue("@DateOfBirth", dto.DateOfBirth);
                command.Parameters.AddWithValue("@JoiningDate", dto.JoiningDate);
                command.Parameters.AddWithValue("@Salery", dto.Salery);
                command.Parameters.AddWithValue("@LastWorkingDate", dto.LastWorkingDate);
                command.Parameters.AddWithValue("@JobTitle", dto.JobTitle);
                command.Parameters.AddWithValue("@DepartmentId", dto.DepartmentId);
                command.Parameters.AddWithValue("@Phone", dto.Phone);
                command.Parameters.AddWithValue("@PasswordHash", EncryptPassword(generatedPassword));


                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();

                return Ok(new { message = "Employee Updated Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Invalid or Duplicate Employee request." });
            }
        }

        [HttpGet("send-email")]
        public ActionResult SendEmail(string requestEmail)
        {

            try
            {


                string Subject = "Employee Registration Details";
                string mailed = "emsbackend.mailer@gmail.com";
                string password = "vokxkajduhcaqhib";
                using (MailMessage messg = new MailMessage(mailed, requestEmail))
                {
                    messg.Subject = Subject;
                    messg.Body = "Hello! Your login password is 12345";
                    messg.IsBodyHtml = false;
                    using (SmtpClient smtp = new SmtpClient())
                    {
                        smtp.Host = "smtp.gmail.com";
                        smtp.EnableSsl = true;
                        NetworkCredential cred = new NetworkCredential(mailed, password);
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = cred;
                        smtp.Port = 587;
                        smtp.Send(messg);

                    }
                }

                return Ok(new { message = "Employee added successfully and email sent"});
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = "Invalid Request" });
            }


        }


    }
}
