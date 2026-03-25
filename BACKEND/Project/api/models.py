from django.db import models
from django.contrib.auth.models import AbstractUser,User
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN"
        DOCTOR = "DOCTOR"
        PATIENT = "PATIENT"
    role = models.CharField(max_length = 50, choices = Role.choices, default=Role.PATIENT)

class Patient(User):
    base_role = User.Role.PATIENT
    fullName = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    dob = models.DateField()
    phone = models.CharField(max_length=15)
    photo = models.FileField(upload_to='documents/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
            if not self.username:
                self.username = self.email
        return super().save(*args, **kwargs)

class Doctor(User):
    base_role = User.Role.DOCTOR
    fullName = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    dob = models.DateField()
    phone = models.CharField(max_length=15)
    about = models.TextField()
    photo = models.FileField(upload_to='documents/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
        return super().save(*args, **kwargs)
    


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title