from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class ClothingItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(default="Опис не вказано")
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Review(models.Model):
    item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE)
    review_text = models.TextField()

    def __str__(self):
        return f"Review by {self.user.username} for {self.item.name}"
from django.contrib.auth.models import User

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(ClothingItem)
    created_at = models.DateTimeField(auto_now_add=True)
    is_confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"

class Clothing(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.CharField(max_length=50)
    category = models.CharField(max_length=50)

    def __str__(self):
        return self.name
class Item(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)  # Тип одягу, наприклад: "Футболка", "Джинси"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return self.name
class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name