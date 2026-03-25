from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from . import models

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'first_name', 'last_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )

class PatientAdmin(UserAdmin):
    list_display = ('username', 'email', 'fullName', 'gender', 'phone')
    search_fields = ('username', 'fullName', 'email')
    ordering = ('username',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'fullName', 'gender', 'dob', 'phone', 'photo')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'fullName', 'gender', 'dob', 'phone'),
        }),
    )

class DoctorAdmin(UserAdmin):
    list_display = ('username', 'email', 'fullName', 'specialty')
    search_fields = ('username', 'fullName', 'specialty')
    ordering = ('username',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'fullName', 'specialty', 'gender', 'dob', 'phone', 'about', 'photo')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'fullName', 'specialty', 'gender', 'dob', 'phone', 'about'),
        }),
    )

# Register your models here
admin.site.register(models.User, CustomUserAdmin)
admin.site.register(models.Patient, PatientAdmin)
admin.site.register(models.Doctor, DoctorAdmin)