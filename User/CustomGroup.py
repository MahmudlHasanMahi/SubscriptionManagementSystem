from django.contrib.auth.models import Permission,GroupManager
from django.db import models

class Groups(models.Model):
    
    objects = GroupManager()

    name = models.CharField(max_length=64,unique=True,blank=False)
    level = models.IntegerField(max_length=65,unique=True,blank=False)
    permission = models.ManyToManyField(Permission,related_name="Groups")
    class Meta:
        app_label = 'auth'
        verbose_name = 'Group'
    
    def __str__(self):
        return f"{self.name}"
