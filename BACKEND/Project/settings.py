# In settings.py, add the static files configuration

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'

# Directory where static files will be collected
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Additional locations of static files
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Add static and media files configuration

# Media files (Uploaded files)
MEDIA_URL = '/documents/'
MEDIA_ROOT = BASE_DIR / 'documents'

# Ensure Django serves media files during development
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)