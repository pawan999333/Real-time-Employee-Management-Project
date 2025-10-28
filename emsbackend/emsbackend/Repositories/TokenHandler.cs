using emsbackend.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace emsbackend.Repositories
{
    public class TokenHandler : ITokenHandler
    {
        private readonly IConfiguration  configuration;
        public TokenHandler(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public Task<string> CreateTokenAsync(GetEmployeeDetails user)
        {

            //create claims

            var claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.GivenName, user.EmpName));
            claims.Add(new Claim(ClaimTypes.Email, user.Email));
            claims.Add(new Claim(ClaimTypes.Role, user.role));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                configuration["Jwt:Issuer"],
                configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials
                );

           return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));

        }
    }
}
