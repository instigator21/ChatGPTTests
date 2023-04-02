using System.Collections.Generic;
using Xunit;
using TaskManagement.Controllers;
using TaskManagement.Models;
using TaskManagement.Repositories;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace TaskManagement.Tests
{
    public class TaskControllerTests
    {
        private readonly Mock<ITaskRepository> _mockTaskRepository;
        private readonly TaskController _taskController;

        public TaskControllerTests()
        {
            _mockTaskRepository = new Mock<ITaskRepository>();
            _taskController = new TaskController(_mockTaskRepository.Object);
        }

        [Fact]
        public void GetAllTasks_ReturnsAllTasks()
        {
            // Arrange
            var tasks = new List<TaskModel>
            {
                new TaskModel { ID = 1, Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.ToDo },
                new TaskModel { ID = 2, Title = "Task 2", Description = "Task 2 description", Status = Models.TaskStatus.InProgress },
                new TaskModel { ID = 3, Title = "Task 3", Description = "Task 3 description", Status = Models.TaskStatus.Done }
            };

            _mockTaskRepository.Setup(repo => repo.GetAll()).Returns(tasks);

            // Act
            var result = _taskController.GetAllTasks();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedTasks = Assert.IsType<List<TaskModel>>(okResult.Value);
            Assert.Equal(tasks.Count, returnedTasks.Count);
        }

        [Fact]
        public void GetTaskById_ReturnsTask_WhenTaskExists()
        {
            // Arrange
            var task = new TaskModel { ID = 1, Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.ToDo };
            _mockTaskRepository.Setup(repo => repo.GetById(task.ID)).Returns(task);

            // Act
            var result = _taskController.GetTaskById(task.ID);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedTask = Assert.IsType<TaskModel>(okResult.Value);
            Assert.Equal(task.ID, returnedTask.ID);
        }

        [Fact]
        public void GetTaskById_ReturnsNotFound_WhenTaskDoesNotExist()
        {
            // Arrange
            int taskId = 1;
            _mockTaskRepository.Setup(repo => repo.GetById(taskId)).Returns((TaskModel)null);

            // Act
            var result = _taskController.GetTaskById(taskId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
        [Fact]
        public void CreateTask_ReturnsCreatedTask()
        {
            // Arrange
            var task = new TaskModel { Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.ToDo };
            var addedTask = new TaskModel { ID = 1, Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.ToDo };

            _mockTaskRepository.Setup(repo => repo.Add(task)).Callback<TaskModel>(t => t.ID = 1);
            _mockTaskRepository.Setup(repo => repo.GetById(addedTask.ID)).Returns(addedTask);

            // Act
            var result = _taskController.CreateTask(task);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedTask = Assert.IsType<TaskModel>(createdAtActionResult.Value);
            Assert.Equal(addedTask.ID, returnedTask.ID);
        }

        [Fact]
        public void UpdateTask_ReturnsNoContent_WhenTaskExists()
        {
            // Arrange
            var task = new TaskModel { ID = 1, Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.ToDo };
            _mockTaskRepository.Setup(repo => repo.GetById(task.ID)).Returns(task);

            // Act
            var result = _taskController.UpdateTask(task.ID, task);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public void UpdateTask_ReturnsBadRequest_WhenIdsDoNotMatch()
        {
            // Arrange
            var task = new TaskModel { ID = 1, Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.ToDo };

            // Act
            var result = _taskController.UpdateTask(2, task);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void UpdateTask_ReturnsNotFound_WhenTaskDoesNotExist()
        {
            // Arrange
            var task = new TaskModel { ID = 1, Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.ToDo };
            _mockTaskRepository.Setup(repo => repo.GetById(task.ID)).Returns((TaskModel)null);

            // Act
            var result = _taskController.UpdateTask(task.ID, task);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void DeleteTask_ReturnsNoContent_WhenTaskExists()
        {
            // Arrange
            var task = new TaskModel { ID = 1, Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.ToDo };
            _mockTaskRepository.Setup(repo => repo.GetById(task.ID)).Returns(task);

            // Act
            var result = _taskController.DeleteTask(task.ID);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public void DeleteTask_ReturnsNotFound_WhenTaskDoesNotExist()
        {
            // Arrange
            int taskId = 1;
            _mockTaskRepository.Setup(repo => repo.GetById(taskId)).Returns((TaskModel)null);

            // Act
            var result = _taskController.DeleteTask(taskId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void CreateTask_ReturnsBadRequest_WhenValidationFails()
        {
            // Arrange
            var invalidTask = new TaskModel { Title = string.Empty, Description = "Task 1 description", Status = Models.TaskStatus.ToDo };

            // Manually add validation error to the ModelState
            var modelState = new ModelStateDictionary();
            modelState.AddModelError("Title", "The Title field is required.");
            _taskController.ModelState.AddModelError("Title", "The Title field is required.");

            // Act
            var result = _taskController.CreateTask(invalidTask);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public void UpdateTask_ReturnsBadRequest_WhenValidationFails()
        {
            // Arrange
            var invalidTask = new TaskModel { ID = 1, Title = string.Empty, Description = "Task 1 description", Status = Models.TaskStatus.ToDo };
            _mockTaskRepository.Setup(repo => repo.GetById(invalidTask.ID)).Returns(invalidTask);

            // Manually add validation error to the ModelState
            var modelState = new ModelStateDictionary();
            modelState.AddModelError("Title", "The Title field is required.");
            _taskController.ModelState.AddModelError("Title", "The Title field is required.");

            // Act
            var result = _taskController.UpdateTask(invalidTask.ID, invalidTask);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void UpdateTask_SetsCompletedAt_WhenStatusIsDone()
        {
            // Arrange
            var task = new TaskModel { ID = 1, Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.ToDo };
            var updatedTask = new TaskModel { ID = 1, Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.Done };
            _mockTaskRepository.Setup(repo => repo.GetById(task.ID)).Returns(task);
            _mockTaskRepository.Setup(repo => repo.Update(It.IsAny<TaskModel>())).Callback<TaskModel>(t => task.CompletedAt = DateTime.Now);

            // Act
            var result = _taskController.UpdateTask(task.ID, updatedTask);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.NotNull(task.CompletedAt);
        }

    }
}
