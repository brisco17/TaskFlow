from django.contrib import admin

from .models import Setting

class SettingAdmin(admin.ModelAdmin):
    list_display = ('author', 'name', 'value',)

admin.site.register(Setting, SettingAdmin)
