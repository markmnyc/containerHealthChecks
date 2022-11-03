#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["HealthCheckTest1/HealthCheckTest1.csproj", "HealthCheckTest1/"]
RUN dotnet restore "HealthCheckTest1/HealthCheckTest1.csproj"
COPY . .
WORKDIR "/src/HealthCheckTest1"
RUN dotnet build "HealthCheckTest1.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HealthCheckTest1.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HealthCheckTest1.dll"]