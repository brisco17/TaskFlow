from django.contrib import admin

from .models import Setting

class SettingAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'value', 'user',)

admin.site.register(Setting, SettingAdmin)
