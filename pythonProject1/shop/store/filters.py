import django_filters
from .models import Clothing

class ClothingFilter(django_filters.FilterSet):
    class Meta:
        model = Clothing
        fields = {
            'category': ['exact'],
        }
