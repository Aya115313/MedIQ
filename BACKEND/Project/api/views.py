from rest_framework import generics
from .models import Doctor,Patient
from .serializers import DoctorSerializer, PatientSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse




# Create your views here.

@ensure_csrf_cookie
def csrf_view(request):
    return JsonResponse({'detail': 'CSRF cookie set'})



class CreateDoctorView(generics.CreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]
class CreatePatientView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [AllowAny]

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    filter_backends = [SearchFilter]
    search_fields = ['specialty']

    def retrieve(self, request, pk=None):
        try:
            doctor = Doctor.objects.get(pk=pk)
            serializer = self.get_serializer(doctor)
            return Response(serializer.data)
        except Doctor.DoesNotExist:
            return Response({"detail": "Doctor not found."}, status=404)


class NoteListCreate(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class NoteDelete(generics.DestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
    })
