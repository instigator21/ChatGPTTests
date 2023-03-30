namespace TaskManagement.DTOs
{
    public class TaskDTO
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public TaskManagement.Models.TaskStatus Status { get; set; }
    }
}
