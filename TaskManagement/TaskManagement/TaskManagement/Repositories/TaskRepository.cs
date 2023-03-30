namespace TaskManagement.Repositories;

using System.Collections.Generic;
using System.Linq;
using TaskManagement.Models;

public class TaskRepository : ITaskRepository
{
    private readonly List<TaskModel> _tasks = new List<TaskModel>();

    public TaskModel GetById(int id)
    {
        return _tasks.FirstOrDefault(t => t.ID == id);
    }

    public IEnumerable<TaskModel> GetAll()
    {
        return _tasks;
    }

    public void Add(TaskModel task)
    {
        task.ID = _tasks.Count + 1;
        _tasks.Add(task);
    }

    public void Update(TaskModel task)
    {
        var existingTask = _tasks.FirstOrDefault(t => t.ID == task.ID);
        if (existingTask != null)
        {
            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.Status = task.Status;
        }
    }

    public void Delete(int id)
    {
        var task = _tasks.FirstOrDefault(t => t.ID == id);
        if (task != null)
        {
            _tasks.Remove(task);
        }
    }
}
