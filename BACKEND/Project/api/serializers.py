from rest_framework import serializers
from .models import Doctor, Patient
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Note


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ("id", "username", "password", "fullName", "specialty", "gender", "dob", "phone", "about", "email", "photo")
        extra_kwargs = {"password": {"write_only": True}}
        
    def create(self, validated_data):
        user = Doctor.objects.create_user(**validated_data)
        user.role = 'DOCTOR'  # Set the role explicitly
        user.save()
        return user

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ("id", "username", "password", "fullName", "gender", "dob", "phone", "email", "photo")
        extra_kwargs = {
            "password": {"write_only": True},
            "id": {"read_only": True}
        }
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        patient = Patient(**validated_data)
        patient.set_password(password)
        patient.save()
        return patient

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role  # assuming your User model has a 'role' field
        return token



class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
