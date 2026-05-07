from .base import *

DEBUG = True

DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "loggers": {
        "accounts": {"handlers": ["console"], "level": "INFO", "propagate": False},
    },
}