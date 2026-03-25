from django.urls import path
from .views import (
    CSRFTokenView,
    AppointmentView,
    AppointmentDetailView,
    AppointmentRequestView,
    DoctorEnrollmentView,
    EnrollmentStatusView,
    PatientEnrollmentView,
    PatientEnrollmentDetailView
)

urlpatterns = [
    # CSRF
    path('csrf/', CSRFTokenView.as_view(), name='csrf-token'),
    
    # Appointments
    path('appointments/', AppointmentView.as_view(), name='appointment-list'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    
    # Appointment Requests
    path('appointment-requests/', AppointmentRequestView.as_view(), name='appointment-request-create'),
    
    # Doctor Enrollment Management
    path('doctor/enrollments/', DoctorEnrollmentView.as_view(), name='doctor-enrollment-list'),
    path('enrollments/<int:pk>/status/', EnrollmentStatusView.as_view(), name='enrollment-status-update'),
    
    # Patient Enrollment Management
    path('patient/enrollments/', PatientEnrollmentView.as_view(), name='patient-enrollment-list'),
    path('patient/enrollments/<int:pk>/', PatientEnrollmentDetailView.as_view(), name='patient-enrollment-detail'),
]