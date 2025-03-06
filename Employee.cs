using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApiSqlApp.Models
{
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public required string FullName { get; set; }
        [Required]
        [StringLength(100)]
        [EmailAddress]
        public required string Email { get; set; }
        [Required]
        [StringLength(15, MinimumLength = 10)]
        [RegularExpression("^[0-9]*$", ErrorMessage = "PhoneNumber must contain only numbers")]
        public required string PhoneNumber { get; set; }
        [Required]
        [StringLength(50)]
        public required string Position { get; set; }
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Salary must be greater than 0")]
        [Column(TypeName = "decimal(18,2)")]
        public required decimal Salary { get; set; }
        [Required]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy HH:mm:ss}", ApplyFormatInEditMode = true)]
        public required DateTime HiredDate { get; set; }
    }
}