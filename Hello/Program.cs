using NSwag.AspNetCore;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "Hello";
    config.Title = "Hello v1";
    config.Version = "v1";
});
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "TodoAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}
app.MapGet("/", () => "Hello World!");
 
app.MapGet("/hello", (string strName) => "Hello " + strName + "!");

//define new string array
string [] fruits = new string [] { "apple", "banana", "cherry" };
app.MapGet("/fruit", () => fruits);
 
app.Run();