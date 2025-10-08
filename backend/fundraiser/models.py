from django.db import models
from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models import Sum, Count, Q
from uuid import uuid4

class Contributor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    kcpe_year = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['paid']),
            models.Index(fields=['phone']),
            models.Index(fields=['kcpe_year']),
        ]

    def __str__(self):
        return f"{self.name} ({self.kcpe_year})"

# Stats (computed, not a model)
class Stats:
    def __init__(self, total_raised, total_contributors, goal=500000, percentage=0):
        self.total_raised = total_raised
        self.total_contributors = total_contributors
        self.goal = goal
        self.percentage = percentage

# YearlyContributors (computed)
class YearlyContributors:
    def __init__(self, year, contributors):
        self.year = year
        self.contributors = contributors