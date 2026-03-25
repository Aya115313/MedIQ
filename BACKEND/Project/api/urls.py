from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from api.views import DoctorViewSet, CreateDoctorView, CreatePatientView  # Added imports
from django.urls import include
from .views import get_user_info

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet, basename='doctor')

urlpatterns = [
    path("api/notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("api/notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path('register/doctor/', CreateDoctorView.as_view(), name='doctor-register'),  # Added doctor registration
    path('register/patient/', CreatePatientView.as_view(), name='patient-register'),  # Added patient registration
    path('', include(router.urls)),
    path('get-user-info/', get_user_info, name='get_user_info'),
]