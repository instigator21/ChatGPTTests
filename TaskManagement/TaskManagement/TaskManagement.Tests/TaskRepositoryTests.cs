using Xunit;
using TaskManagement.Models;
using TaskManagement.Repositories;
using System.Linq;

namespace TaskManagement.Tests
{
    public class TaskRepositoryTests
    {
        private readonly ITaskRepository _taskRepository;

        public TaskRepositoryTests()
        {
            _taskRepository = new TaskRepository();
        }

        [Fact]
        public void AddTask_Success()
        {
            // Arrange
            var task = new TaskModel
            {
                Title = "Test Task",
                Description = "This is a test task",
                Status = Models.TaskStatus.ToDo
            };

            // Act
            _taskRepository.Add(task);

            // Assert
            var storedTask = _taskRepository.GetById(task.ID);
            Assert.Equal(1, task.ID);
            Assert.Equal(task.Title, storedTask.Title);
            Assert.Equal(task.Description, storedTask.Description);
            Assert.Equal(task.Status, storedTask.Status);
        }

        [Fact]
        public void AddThreeTasks_Success()
        {
            // Arrange
            var task1 = new TaskModel { Title = "Task 1", Description = "Task 1 description", Status = Models.TaskStatus.ToDo};
            var task2 = new TaskModel { Title = "Task 2", Description = "Task 2 description", Status = Models.TaskStatus.InProgress };
            var task3 = new TaskModel { Title = "Task 3", Description = "Task 3 description", Status = Models.TaskStatus.Done};

            // Act
            _taskRepository.Add(task1);
            _taskRepository.Add(task2);
            _taskRepository.Add(task3);

            var retrievedTask1 = _taskRepository.GetById(task1.ID);
            var retrievedTask2 = _taskRepository.GetById(task2.ID);
            var retrievedTask3 = _taskRepository.GetById(task3.ID);

            // Assert
            Assert.NotNull(retrievedTask1);
            Assert.Equal(task1.Title, retrievedTask1.Title);
            Assert.Equal(task1.Description, retrievedTask1.Description);
            Assert.Equal(task1.Status, retrievedTask1.Status);

            Assert.NotNull(retrievedTask2);
            Assert.Equal(task2.Title, retrievedTask2.Title);
            Assert.Equal(task2.Description, retrievedTask2.Description);
            Assert.Equal(task2.Status, retrievedTask2.Status);

            Assert.NotNull(retrievedTask3);
            Assert.Equal(task3.Title, retrievedTask3.Title);
            Assert.Equal(task3.Description, retrievedTask3.Description);
            Assert.Equal(task3.Status, retrievedTask3.Status);
        }

        [Fact]
        public void UpdateTask_Success()
        {
            // Arrange
            var task = new TaskModel { Title = "Task 1", Description = "This is task 1", Status = Models.TaskStatus.ToDo };
            _taskRepository.Add(task);
            task.Title = "Updated Task";
            task.Description = "This is an updated task";
            task.Status = Models.TaskStatus.Done;

            // Act
            _taskRepository.Update(task);
            var updatedTask = _taskRepository.GetById(task.ID);

            // Assert
            Assert.NotNull(updatedTask);
            Assert.Equal(task.ID, updatedTask.ID);
            Assert.Equal("Updated Task", updatedTask.Title);
            Assert.Equal("This is an updated task", updatedTask.Description);
            Assert.Equal(Models.TaskStatus.Done, updatedTask.Status);
        }


        [Fact]
        public void UpdateNonExistentTask_Failure()
        {
            // Arrange
            var task = new TaskModel { ID = 99, Title = "Non-existent Task", Description = "This task doesn't exist", Status = Models.TaskStatus.ToDo };

            // Act
            _taskRepository.Update(task);
            var updatedTask = _taskRepository.GetById(task.ID);

            // Assert
            Assert.Null(updatedTask);
        }

        [Fact]
        public void DeleteTask_Success()
        {
            // Arrange
            var task = new TaskModel { Title = "Task 1", Description = "This is task 1", Status = Models.TaskStatus.ToDo };
            _taskRepository.Add(task);

            // Act
            _taskRepository.Delete(task.ID);
            var deletedTask = _taskRepository.GetById(task.ID);

            // Assert
            Assert.Null(deletedTask);
        }


        [Fact]
        public void DeleteNonExistentTask_Failure()
        {
            // Arrange
            int nonExistentTaskId = 99;

            // Act
            _taskRepository.Delete(nonExistentTaskId);
            var deletedTask = _taskRepository.GetById(nonExistentTaskId);

            // Assert
            Assert.Null(deletedTask);
        }

        [Fact]
        public void GetById_ExistingTask_Success()
        {
            // Arrange
            var task = new TaskModel { Title = "Task 1", Description = "This is task 1", Status = Models.TaskStatus.ToDo };
            _taskRepository.Add(task);

            // Act
            var retrievedTask = _taskRepository.GetById(task.ID);

            // Assert
            Assert.NotNull(retrievedTask);
            Assert.Equal(task.ID, retrievedTask.ID);
            Assert.Equal(task.Title, retrievedTask.Title);
            Assert.Equal(task.Description, retrievedTask.Description);
            Assert.Equal(task.Status, retrievedTask.Status);
        }

        [Fact]
        public void GetById_NonExistentTask_Failure()
        {
            // Arrange
            int nonExistentTaskId = 99;

            // Act
            var retrievedTask = _taskRepository.GetById(nonExistentTaskId);

            // Assert
            Assert.Null(retrievedTask);
        }

        [Fact]
        public void GetAll_TasksExist_Success()
        {
            // Arrange
            var task1 = new TaskModel { Title = "Task 1", Description = "This is task 1", Status = Models.TaskStatus.ToDo };
            var task2 = new TaskModel { Title = "Task 2", Description = "This is task 2", Status = Models.TaskStatus.InProgress };
            _taskRepository.Add(task1);
            _taskRepository.Add(task2);

            // Act
            var tasks = _taskRepository.GetAll();

            // Assert
            Assert.NotNull(tasks);
            Assert.Equal(2, tasks.Count());
            Assert.Contains(tasks, t => t.Title == "Task 1" && t.Description == "This is task 1" && t.Status == Models.TaskStatus.ToDo);
            Assert.Contains(tasks, t => t.Title == "Task 2" && t.Description == "This is task 2" && t.Status == Models.TaskStatus.InProgress);
        }

        [Fact]
        public void GetAll_NoTasks_EmptyList()
        {
            // Arrange
            // No tasks created

            // Act
            var tasks = _taskRepository.GetAll();

            // Assert
            Assert.NotNull(tasks);
            Assert.Empty(tasks);
        }
    }
}
