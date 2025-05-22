from django.contrib.auth.models import Permission,GroupManager
from django.db import models
from django.utils.translation import gettext_lazy as _
class Groups(models.Model):
    
    

    name = models.CharField(max_length=64,unique=True,blank=False)
    level = models.IntegerField(max_length=65,unique=True,blank=False)
    permission = models.ManyToManyField(Permission,verbose_name=_("permissions"),related_query_name="group",blank=True)


    objects = GroupManager()
    
    class Meta:
        app_label = 'auth'
        verbose_name = _("group")
        verbose_name_plural = _("groups")
    
    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.name,)
