from django.db import models
from api.models import Patient,Doctor
from django.db.models import Max

class Appointment(models.Model):
    title = models.CharField(max_length=200)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctor_appointments')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='patient_appointments', null=True)  # Made optional temporarily
    tags = models.JSONField(default=list)
    schedule = models.TextField()
    description_file = models.FileField(upload_to='appointment_descriptions/', blank=True, null=True)
    enrolled_patients = models.ManyToManyField(
        Patient,
        related_name='enrolled_appointments',
        blank=True
    )


    def __str__(self):
        return self.title

class AppointmentRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    ]
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='Doctor_req')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='enrollment_requests')
    appointment_obj = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    description_file = models.FileField(upload_to='appointment_descriptions/', blank=True, null=True)
    schedule = models.TextField(default='')


    class Meta:
        unique_together = ('patient', 'appointment_obj', 'doctor')

    def __str__(self):
        return f"{self.patient} - {self.doctor} - {self.appointment_obj}"