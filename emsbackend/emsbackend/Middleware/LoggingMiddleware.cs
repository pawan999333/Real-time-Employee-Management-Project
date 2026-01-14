namespace emsbackend.Middleware
{
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _logFilePath;

        public LoggingMiddleware(RequestDelegate next, string logFilePath)
        {
            _next = next;
            _logFilePath = logFilePath;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var startTime = DateTime.UtcNow;
            var request = context.Request;
            var logMessage = $"[{DateTime.UtcNow}] Request: {request.Method}{request.Path}";

            try
            {
                await _next(context);
                var response = context.Response;
                logMessage += $" - Response:{response.StatusCode}";
            }
            catch (Exception ex)
            {
                logMessage += $" - Error: {ex.Message}";
            }
            finally
            {
                var elapsedTime = DateTime.UtcNow - startTime;
                logMessage += $" - Elapsed Time: {elapsedTime}";
                await AppendToFileAsync(logMessage);
            }
        }

        private async Task AppendToFileAsync(string logMessage)
        {
            try
            {
                await File.AppendAllTextAsync(_logFilePath, $"{logMessage}{Environment.NewLine}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error writing log: {ex.Message}");
            }
        }

    }
        public static class LoggingMiddlewareExtensions
        {
            public static IApplicationBuilder UseLogging(this IApplicationBuilder builder, string logFilePath)
            {
                return builder.UseMiddleware<LoggingMiddleware>(logFilePath);
            }
        
    }
}
