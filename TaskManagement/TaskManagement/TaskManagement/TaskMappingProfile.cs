using AutoMapper;
using TaskManagement.Models;
using TaskManagement.DTOs;

public class TaskMappingProfile : Profile
{
    public TaskMappingProfile()
    {
        CreateMap<TaskModel, TaskDTO>();
        CreateMap<TaskDTO, TaskModel>();
    }
}
