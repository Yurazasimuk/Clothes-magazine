from django.contrib import admin
from .models import Category, ClothingItem, Review, Order

admin.site.register(Category)
admin.site.register(ClothingItem)
admin.site.register(Review)
admin.site.register(Order)
