using Xunit;
using TaskManagement.Models;

namespace TaskManagement.Tests
{
    public class TaskModelTests
    {
        [Fact]
        public void TaskModel_PropertiesAssignment()
        {
            // Arrange
            var task = new TaskModel
            {
                ID = 1,
                Title = "Test Task",
                Description = "This is a test task",
                Status = Models.TaskStatus.InProgress,
                CreatedAt = DateTime.UtcNow,
                CompletedAt = DateTime.UtcNow.AddHours(1)
            };

            // Assert
            Assert.Equal(1, task.ID);
            Assert.Equal("Test Task", task.Title);
            Assert.Equal("This is a test task", task.Description);
            Assert.Equal(Models.TaskStatus.InProgress, task.Status);
            Assert.Equal(DateTime.UtcNow.Date, task.CreatedAt.Date);
            Assert.Equal(DateTime.UtcNow.AddHours(1).Date, task.CompletedAt.Value.Date);
        }
    }
}
