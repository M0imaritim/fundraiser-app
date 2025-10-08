from django.contrib import admin
from .models import Contributor

@admin.register(Contributor)
class ContributorAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'kcpe_year', 'amount', 'paid', 'created_at')
    list_filter = ('paid', 'kcpe_year', 'created_at')
    search_fields = ('name', 'phone')
    ordering = ('-created_at',)
    list_per_page = 25

    fieldsets = (
        (None, {
            'fields': ('name', 'phone', 'kcpe_year', 'amount', 'paid')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at',)
