using TaskManagement.Models;
using System.Collections.Generic;

public interface ITaskRepository
{
    TaskModel GetById(int id);
    IEnumerable<TaskModel> GetAll();
    void Add(TaskModel task);
    void Update(TaskModel task);
    void Delete(int id);
}
