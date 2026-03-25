from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.middleware.csrf import get_token
from .models import Appointment, AppointmentRequest
from .serializers import (
    AppointmentSerializer,
    AppointmentRequestSerializer,
    AppointmentStatusUpdateSerializer
)
from .permissions import IsDoctor, IsPatient
from api.models import Doctor

class CSRFTokenView(generics.GenericAPIView):
    """Provides CSRF token for frontend"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({'csrfToken': get_token(request)})

class AppointmentView(generics.ListCreateAPIView):
    """
    Combined view for listing and creating appointments
    - Patients can create appointments
    - All authenticated users can view appointments
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]  # All authenticated users can view

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'patient'):
            return Appointment.objects.filter(patient=user.patient)
        elif hasattr(user, 'doctor'):
            return Appointment.objects.filter(doctor=user.doctor)
        return Appointment.objects.none()

    def perform_create(self, serializer):
        doctor_id = self.request.data.get('doctor_id')
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            # Get the Patient instance instead of using User instance directly
            patient = self.request.user.patient
            
            # First create the appointment
            appointment = serializer.save(doctor=doctor, patient=patient)
            
            # Then create the appointment request
            AppointmentRequest.objects.create(
                doctor=doctor,
                patient=patient,
                appointment_obj=appointment,
                status='pending',
                description_file=appointment.description_file,
                schedule=appointment.schedule
            )
            
        except Doctor.DoesNotExist:
            raise serializers.ValidationError({'doctor_id': 'Doctor does not exist'})
        except Patient.DoesNotExist:
            raise serializers.ValidationError({'detail': 'User is not a patient'})

    def create(self, request, *args, **kwargs):
        if not hasattr(request.user, 'patient'):
            return Response(
                {'detail': 'Only patients can create appointments'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Create the appointment
        return super().create(request, *args, **kwargs)

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Detailed view for single appointment (doctor only)"""
    serializer_class = AppointmentSerializer
    permission_classes = [IsDoctor]
    queryset = Appointment.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(doctor=self.request.user)

class AppointmentRequestView(generics.CreateAPIView):
    """Patients can request appointments"""
    serializer_class = AppointmentRequestSerializer
    permission_classes = [IsPatient]
    queryset = AppointmentRequest.objects.all()

    def perform_create(self, serializer):
        doctor_id = self.request.data.get('doctor_id')
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            # Get the Patient instance
            patient = self.request.user.patient
            instance = serializer.save(
                patient=patient,
                doctor=doctor,
                status='pending'
            )
            if instance.status == 'accepted':
                instance.appointment_obj.enrolled_patients.add(patient)
        except Doctor.DoesNotExist:
            raise serializers.ValidationError({'doctor_id': 'Doctor does not exist'})
        except Patient.DoesNotExist:
            raise serializers.ValidationError({'detail': 'User is not a patient'})

class DoctorEnrollmentView(generics.ListAPIView):
    """Doctor views all enrollment requests"""
    serializer_class = AppointmentRequestSerializer
    permission_classes = [AllowAny]  # Allow any authenticated user to view enrollments

    def get_queryset(self):
        return AppointmentRequest.objects.filter(
            appointment_obj__doctor=self.request.user
        )

class EnrollmentStatusView(generics.UpdateAPIView):
    """Doctor updates enrollment status"""
    serializer_class = AppointmentStatusUpdateSerializer
    permission_classes = [AllowAny]  # Allow any authenticated user to update status
    
    def get_queryset(self):
        return AppointmentRequest.objects.filter(
            appointment_obj__doctor=self.request.user
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status == 'accepted':
            instance.appointment_obj.enrolled_patients.add(instance.patient)
        elif instance.status == 'declined':
            instance.appointment_obj.enrolled_patients.remove(instance.patient)

class PatientEnrollmentView(generics.ListAPIView):
    """Patient views their enrollments"""
    serializer_class = AppointmentRequestSerializer
    permission_classes = [IsPatient]
    
    def get_queryset(self):
        return AppointmentRequest.objects.filter(
            patient=self.request.user.patient
        )

class PatientEnrollmentDetailView(generics.RetrieveDestroyAPIView):
    """Patient manages specific enrollment"""
    serializer_class = AppointmentRequestSerializer
    permission_classes = [IsPatient]
    
    def get_queryset(self):
        return AppointmentRequest.objects.filter(
            patient=self.request.user.patient
        )

    def perform_destroy(self, instance):
        if instance.status == 'accepted':
            instance.appointment_obj.enrolled_patients.remove(instance.patient)
        instance.delete()