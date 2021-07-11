from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Vendor(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=1000)
    email = models.EmailField()
    contact = models.CharField(max_length=20)
    officer_incharge = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(default=datetime.now)
    
    def __str__(self):
        return f'{self.name} -> {self.email}'