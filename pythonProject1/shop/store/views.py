from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout
from django.shortcuts import render, redirect
from .models import ClothingItem, Category
from .models import ClothingItem


def index(request):
    clothing_items = ClothingItem.objects.all()
    return render(request, 'store/index.html', {'clothing_items': clothing_items})


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')
    else:
        form = UserCreationForm()
    return render(request, 'store/register.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')
    else:
        form = UserCreationForm()
    return render(request, 'store/login.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('index')


def clothing_item_detail(request, item_id):
    item = ClothingItem.objects.get(id=item_id)
    return render(request, 'store/clothing_item_detail.html', {'item': item})

def add_to_cart(request, item_id):
    item = ClothingItem.objects.get(id=item_id)
    cart = request.session.get('cart', [])
    cart.append(item.id)
    request.session['cart'] = cart
    return redirect('index')


def view_cart(request):
    cart_ids = request.session.get('cart', [])
    cart_items = ClothingItem.objects.filter(id__in=cart_ids)
    total_price = sum(item.price for item in cart_items)
    return render(request, 'store/cart.html', {'cart_items': cart_items, 'total_price': total_price})


class Order:
    pass

def checkout(request):
    cart_ids = request.session.get('cart', [])
    cart_items = ClothingItem.objects.filter(id__in=cart_ids)
    total_price = sum(item.price for item in cart_items)

    if request.method == 'POST':
        order = Order.objects.create(
            user=request.user,
            total_price=total_price,
        )
        order.items.set(cart_items)
        order.save()
        request.session['cart'] = []

        return redirect('order_success')

    return render(request, 'store/checkout.html', {'cart_items': cart_items, 'total_price': total_price})
def order_success(request):
    return render(request, 'store/order_success.html')
def order_history(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'store/order_history.html', {'orders': orders})
def remove_from_cart(request, item_id):
    cart = request.session.get('cart', [])
    if item_id in cart:
        cart.remove(item_id)
        request.session['cart'] = cart
    return redirect('view_cart')
def clothing_list(request):
    items = ClothingItem.objects.all()
    return render(request, 'store/clothing_list.html', {'items': items})
def item_detail(request, item_id):
    item = ClothingItem.objects.get(id=item_id)
    return render(request, 'store/item_detail.html', {'item': item})
def clothing_list(request):
    categories = Category.objects.all()
    clothing_items = ClothingItem.objects.all()
    return render(request, 'store/clothing_list.html', {'clothing_items': clothing_items, 'categories': categories})

def add_to_cart(request, item_id):
    cart = request.session.get('cart', [])
    cart.append(item_id)
    request.session['cart'] = cart
    return redirect('clothing_list')

def remove_from_cart(request, item_id):
    cart = request.session.get('cart', [])
    cart.remove(item_id)
    request.session['cart'] = cart
    return redirect('view_cart')
def checkout(request):
    cart_ids = request.session.get('cart', [])
    cart_items = ClothingItem.objects.filter(id__in=cart_ids)
    total_price = sum(item.price for item in cart_items)
    if request.method == 'POST':
        order = Order.objects.create(user=request.user, total_price=total_price)
        order.items.set(cart_items)
        order.save()
        request.session['cart'] = []
        return redirect('order_detail', order_id=order.id)
    return render(request, 'store/checkout.html', {'cart_items': cart_items, 'total_price': total_price})
def order_list(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'store/order_list.html', {'orders': orders})
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash

def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            return redirect('password_change_done')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'store/change_password.html', {'form': form})
from django.shortcuts import render
from .models import ClothingItem, Category

def filter_clothing_by_category(request, category_id):
    category = Category.objects.get(id=category_id)
    clothing_items = ClothingItem.objects.filter(category=category)
    return render(request, 'store/clothing_list.html', {'clothing_items': clothing_items, 'category': category})
from django.shortcuts import redirect

def add_to_cart(request, item_id):
    cart = request.session.get('cart', [])
    if item_id not in cart:
        cart.append(item_id)
        request.session['cart'] = cart
    return redirect('view_cart')

def remove_from_cart(request, item_id):
    cart = request.session.get('cart', [])
    if item_id in cart:
        cart.remove(item_id)
        request.session['cart'] = cart
    return redirect('view_cart')
from .models import Order

def place_order(request):
    cart_ids = request.session.get('cart', [])
    cart_items = ClothingItem.objects.filter(id__in=cart_ids)
    total_price = sum(item.price for item in cart_items)

    order = Order.objects.create(user=request.user, total_price=total_price)

    for item in cart_items:
        order.items.add(item)
    request.session['cart'] = []

    return redirect('order_confirmation', order_id=order.id)
def order_confirmation(request, order_id):
    order = Order.objects.get(id=order_id)
    return render(request, 'store/order_confirmation.html', {'order': order})
def add_to_cart(request, item_id):
    cart = request.session.get('cart', [])
    if item_id in cart:
        cart.append(item_id)
    else:
        cart.append(item_id)
    request.session['cart'] = cart
    return redirect('view_cart')

from django.shortcuts import render
from .models import Order
from django.contrib.auth.decorators import login_required

@login_required
def view_orders(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'store/my_orders.html', {'orders': orders})
from django.contrib.auth.decorators import login_required

@login_required
def my_orders(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'store/my_orders.html', {'orders': orders})

from django.shortcuts import render, redirect
from .forms import UserRegistrationForm
from django.contrib.auth import login

def signup(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserRegistrationForm()
    return render(request, 'registration/signup.html', {'form': form})

from django.shortcuts import render

def home(request):
    return render(request, 'home.html')
from django.contrib.auth.decorators import login_required

@login_required
def my_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'store/my_orders.html', {'orders': orders})

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})

from django.shortcuts import render
from .models import ClothingItem


def clothing_list(request):
    clothing_type = request.GET.get('type', None)
    if clothing_type:
        clothes = ClothingItem.objects.filter(type=clothing_type)
    else:
        clothes = ClothingItem.objects.all()

    return render(request, 'store/clothing_list.html', {'clothes': clothes})

def product_list(request):
    clothing_items = ClothingItem.objects.all()
    return render(request, 'store/products.html', {'clothing_items': clothing_items})

from django.shortcuts import render
from .models import ClothingItem

def clothing_item_list(request):
    items = ClothingItem.objects.all()
    return render(request, 'store/clothing_item_list.html', {'items': items})

from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from .models import Order, ClothingItem

@login_required
def place_order(request):
    cart = request.session.get('cart', [])
    items = ClothingItem.objects.filter(id__in=cart)

    if items:
        order = Order.objects.create(user=request.user)
        order.items.set(items)
        order.save()
        request.session['cart'] = []
        return render(request, 'store/order_success.html', {'order': order})
    else:
        return redirect('clothing_item_list')

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Order

@login_required
def user_orders(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'store/user_orders.html', {'orders': orders})

from django.shortcuts import render
from .models import Order


from django.shortcuts import render

def user_orders(request):
    return render(request, 'store/orders.html')

from django.shortcuts import render

def user_orders(request):
    return render(request, 'store/orders.html')

from django.shortcuts import render

def user_orders(request):
    return render(request, 'store/orders.html')
from django.shortcuts import render, get_object_or_404
from .models import Product
def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    return render(request, 'store/product_detail.html', {'product': product})


def index(request):
    category = request.GET.get('category')

    if category:
        items = ClothingItem.objects.filter(category=category)
    else:
        items = ClothingItem.objects.all()

    categories = ClothingItem.objects.values_list('category', flat=True).distinct()

    context = {
        'clothing_items': items,
        'categories': categories
    }

    return render(request, 'store/index.html', context)


