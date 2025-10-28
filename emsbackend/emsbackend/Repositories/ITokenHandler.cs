using emsbackend.Models;

namespace emsbackend.Repositories
{
    public interface ITokenHandler
    {
      public  Task<string> CreateTokenAsync(GetEmployeeDetails user);
    }
}
