# appointments/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import AppointmentRequest,Appointment

@receiver(post_save, sender=AppointmentRequest)
def send_appointment_email(sender, instance, created, **kwargs):
    if created:
        pass
    else:
            # Email to patient when a doctor confirms an appointment
            subject = f"New Appointment Information: {instance.appointment_obj.title}"
            message = (
                f"Dear Patient. {instance.patient.fullName},\n\n"
                f"{instance.doctor.fullName} has {instance.status} your appointment "
                f"'{instance.appointment_obj.title}'.\n\n"
                "Please log in to your account to review and respond to this request."
            )
            recipient = instance.patient.email
            send_mail(subject, message, None, [recipient])

