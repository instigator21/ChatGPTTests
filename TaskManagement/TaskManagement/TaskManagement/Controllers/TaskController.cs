using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Models;
using TaskManagement.Repositories;

namespace TaskManagement.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ITaskRepository _taskRepository;

        public TaskController(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        // GET: api/task
        [HttpGet]
        public ActionResult<IEnumerable<TaskModel>> GetAllTasks()
        {
            return Ok(_taskRepository.GetAll());
        }

        // GET: api/task/{id}
        [HttpGet("{id}")]
        public ActionResult<TaskModel> GetTaskById(int id)
        {
            var task = _taskRepository.GetById(id);

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        // POST: api/task
        [HttpPost]
        public ActionResult<TaskModel> CreateTask(TaskModel taskModel)
        {
            _taskRepository.Add(taskModel);
            var createdTask = _taskRepository.GetById(taskModel.ID);
            return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.ID }, createdTask);
        }


        // PUT: api/task/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, TaskModel taskModel)
        {
            if (id != taskModel.ID)
            {
                return BadRequest();
            }

            var existingTask = _taskRepository.GetById(id);

            if (existingTask == null)
            {
                return NotFound();
            }

            _taskRepository.Update(taskModel);
            return NoContent();
        }

        // DELETE: api/task/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var task = _taskRepository.GetById(id);

            if (task == null)
            {
                return NotFound();
            }

            _taskRepository.Delete(id);
            return NoContent();
        }
    }
}
