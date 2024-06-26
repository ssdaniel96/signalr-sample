using Api.Hubs;
using Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddSignalR();

builder.Services.AddScoped<ChatHub1Service>();
builder.Services.AddScoped<ChatHub2Service>();
builder.Services.AddScoped<ChatHub3Service>();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["FirebaseTokenValidation:Authority"];
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["FirebaseTokenValidation:ValidIssuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["FirebaseTokenValidation:Audience"],
            ValidateLifetime = true
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken))
                    // && (path.StartsWithSegments("/hubs")))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

app.MapControllers();
app.UseAuthentication();
app.UseAuthorization();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "SignalR PoC v1");
    options.RoutePrefix = string.Empty;
});

app.MapHub<Chat1Hub>("/hubs/chat1");
app.MapHub<Chat2Hub>("/hubs/chat2");
app.MapHub<Chat3Hub>("/hubs/chat3");

app.Run();