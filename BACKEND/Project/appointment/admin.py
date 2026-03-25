from django.contrib import admin
from django.utils.html import format_html
from .models import Appointment, AppointmentRequest
from api.models import User

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'doctor', 'enrolled_patients_count', 'enrollment_status')
    list_filter = ('doctor', 'enrolled_patients')
    search_fields = ('title', 'description_file', 'enrolled_patients__username')
    filter_horizontal = ('enrolled_patients',)  # Better UI for M2M management
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'doctor', 'tags')
        }),
        ('Schedule & Content', {
            'fields': ('schedule', 'description_file')
        }),
        ('Enrollment', {
            'fields': ('enrolled_patients',),
            'classes': ('collapse',)
        }),
    )

    def enrolled_patients_count(self, obj):
        return obj.enrolled_patients.count()
    enrolled_patients_count.short_description = 'Enrolled Patients'

    def enrollment_status(self, obj):
        pending = obj.enrollments.filter(status='pending').count()
        return format_html(
            '<span style="color: {};">{} Approved</span>, <span style="color: orange;">{} Pending</span>',
            'green',
            obj.enrolled_patients.count(),
            pending
        )
    enrollment_status.short_description = 'Enrollment Status'

    def save_model(self, request, obj, form, change):
        if not obj.doctor_id:
            obj.doctor = request.user
        super().save_model(request, obj, form, change)

@admin.register(AppointmentRequest)
class AppointmentRequestAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'appointment_obj', 'status','schedule', 'description_file')
    list_display_links = ('patient', 'doctor', 'appointment_obj')
    list_editable = ('status',)
    list_filter = ('status', 'appointment_obj')
    search_fields = ('patient__username', 'appointment_obj__title')
    actions = ['approve_selected', 'decline_selected']

    fieldsets = (
        ('Enrollment Details', {
            'fields': ('patient', 'doctor', 'appointment_obj', 'status','schedule', 'description_file')
        }),
    )

    def approve_selected(self, request, queryset):
        for enrollment in queryset:
            if enrollment.status != 'accepted':
                enrollment.status = 'accepted'
                enrollment.save()
                enrollment.appointment_obj.enrolled_patients.add(enrollment.patient)
    approve_selected.short_description = "Approve selected enrollments"

    def decline_selected(self, request, queryset):
        for enrollment in queryset:
            if enrollment.status != 'declined':
                enrollment.status = 'declined'
                enrollment.save()
                enrollment.appointment_obj.enrolled_patients.remove(enrollment.patient)
    decline_selected.short_description = "Decline selected enrollments"

    def save_model(self, request, obj, form, change):
        # Handle enrollment status changes
        if 'status' in form.changed_data:
            if obj.status == 'accepted':
                obj.appointment_obj.enrolled_patients.add(obj.patient)
            elif obj.status == 'declined':
                obj.appointment_obj.enrolled_patients.remove(obj.patient)
        super().save_model(request, obj, form, change)

# User Admin
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'enrolled_appointments_count', 'is_staff')
    list_filter = ('role', 'is_staff')
    
    def enrolled_appointments_count(self, obj):
        return obj.enrolled_appointments.count()
    enrolled_appointments_count.short_description = 'Classes Enrolled'
