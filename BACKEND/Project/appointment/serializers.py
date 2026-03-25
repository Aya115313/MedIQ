from rest_framework import serializers
from .models import Appointment, AppointmentRequest

class AppointmentSerializer(serializers.ModelSerializer):
    doctor = serializers.StringRelatedField(read_only=True)
    patient = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'title', 'doctor', 'patient', 'tags', 'schedule', 'description_file'
        ]

    def create(self, validated_data):
        return Appointment.objects.create(**validated_data)

class AppointmentRequestSerializer(serializers.ModelSerializer):
    doctor = serializers.StringRelatedField(read_only=True)
    patient = serializers.StringRelatedField(read_only=True)
    appointment_obj = serializers.PrimaryKeyRelatedField(queryset=Appointment.objects.all(), write_only=True)

    class Meta:
        model = AppointmentRequest
        fields = [
            'id', 'patient', 'doctor', 'appointment_obj', 'status', 'description_file' , 'schedule'
        ]
        read_only_fields = ('patient', 'doctor', 'status')

    def create(self, validated_data):
        return AppointmentRequest.objects.create(**validated_data)

class AppointmentStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentRequest
        fields = ['status']