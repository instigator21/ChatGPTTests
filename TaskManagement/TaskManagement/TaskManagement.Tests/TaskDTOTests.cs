using Xunit;
using TaskManagement.DTOs;

namespace TaskManagement.Tests
{
    public class TaskDTOTests
    {
        [Fact]
        public void TaskDTO_PropertiesInitialization_Success()
        {
            // Arrange
            var taskDTO = new TaskDTO
            {
                ID = 1,
                Title = "Test Task",
                Description = "This is a test task",
                Status = TaskManagement.Models.TaskStatus.ToDo
            };

            // Act
            // No action needed, since we only initialize properties

            // Assert
            Assert.Equal(1, taskDTO.ID);
            Assert.Equal("Test Task", taskDTO.Title);
            Assert.Equal("This is a test task", taskDTO.Description);
            Assert.Equal(TaskManagement.Models.TaskStatus.ToDo, taskDTO.Status);
        }
    }
}

