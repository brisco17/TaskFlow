from django.contrib import admin

from .models import Task

# Register your models here.

class taskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'due_date', 'completed','user')

admin.site.register(Task, taskAdmin)
