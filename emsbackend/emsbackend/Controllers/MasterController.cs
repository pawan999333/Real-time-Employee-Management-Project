using emsbackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace emsbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MasterController : ControllerBase
    {
        private readonly string _connectionString;

        public MasterController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }


        [Authorize(Roles = "admin")]

        [HttpPost]
        public ActionResult AddDepartment(DepartmentDTO dto)
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_AddDepartment",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@DepartmentName", dto.DepartmentName);

                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();

                return Ok(new { message = "Department Added Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Invalid or Duplicate Department request." });
            }
        }


        [HttpGet]
        public ActionResult GetDepartments()
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_GetDepartments",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                connection.Open();

                List<DepartmentDetailsDTO> response = new List<DepartmentDetailsDTO>();

                using (SqlDataReader sqlDataReader = command.ExecuteReader())
                {
                    while (sqlDataReader.Read())
                    {
                        DepartmentDetailsDTO departmentDto = new DepartmentDetailsDTO();
                        departmentDto.Id = Convert.ToInt32(sqlDataReader["Id"]);
                        departmentDto.DepartmentName = Convert.ToString(sqlDataReader["DepartmentName"]);

                        response.Add(departmentDto);
                    }
                }

                connection.Close();
                return Ok(response);



            }
            catch(Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching departments.");

            }
        }

        [Authorize(Roles = "admin")]

        [HttpDelete]
        public ActionResult DeleteDepartment(int Id)
        {
            try
            {

                SqlConnection connection = new SqlConnection(_connectionString);
                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_DeleteDepartment",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@Id", Id);
                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();
                return Ok(new { message = "Department Deleted Successfully" });

            }
            catch(Exception ex)
            {
                return BadRequest(new { message="Invalid Request" });
            }
        }

        [Authorize(Roles = "admin")]

        [HttpPut]
        public ActionResult UpdateDepartment(DepartmentDTO dto)
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_AddDepartment",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };
                command.Parameters.AddWithValue("@Id", dto.Id);
                command.Parameters.AddWithValue("@DepartmentName", dto.DepartmentName);

                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();

                return Ok(new { message = "Department Updated Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Invalid or Duplicate Department request." });
            }
        }


      

        [HttpGet("Get-Employees")]
        public ActionResult GetEmployees(int? Id)
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_GetEmployeesDetails",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@Id", (object)Id ?? DBNull.Value);

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

                connection.Close();
                return Ok(response);



            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching employees.");

            }
        }

        [Authorize(Roles = "admin")]

        [HttpDelete("delete-employee")]
        public ActionResult DeleteEmployee(int Id)
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);
                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_DeleteEmployee",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@Id", Id);
                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();

                return Ok(new { message = "Employee Deleted Sucessfully" });
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = "Invalid Request" });
            }
        }



        [HttpGet("employeeDepartmentwise")]
        public ActionResult GetEmployeeDepartmentwise()
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_GetEmployeedDepartmentwise",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                connection.Open();

                List<EmployeeDepartmentWiseDTO> response = new List<EmployeeDepartmentWiseDTO>();

                using (SqlDataReader sqlDataReader = command.ExecuteReader())
                {
                    while (sqlDataReader.Read())
                    {
                        EmployeeDepartmentWiseDTO departmentDto = new EmployeeDepartmentWiseDTO();
                        departmentDto.Id = Convert.ToInt32(sqlDataReader["Id"]);
                        departmentDto.DepartmentName = Convert.ToString(sqlDataReader["DepartmentName"]);
                        departmentDto.EmployeeCount = Convert.ToInt32(sqlDataReader["EmployeeCount"]);


                        response.Add(departmentDto);
                    }
                }

                connection.Close();
                return Ok(response);



            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching departments.");

            }
        }


    }
}
