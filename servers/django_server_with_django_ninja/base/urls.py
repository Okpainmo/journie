"""
URL configuration for base project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from ninja import NinjaAPI
from django.urls import path, include
from . import views
from entry.views import entry_router
from user.views import user_router

api = NinjaAPI()

api.add_router("/v1/user", user_router)  
api.add_router("/v1/entry", entry_router)  


urlpatterns = [
    path("", views.index, name="index"),
    path('admin/', admin.site.urls),
    path('api/', api.urls), # do not include the ".py" extension
    # path('api/', user_router.urls) # do not include the ".py" extension
    # path('admin/', admin.site.urls),
    # path('user/', include('user.urls')), # do not include the ".py" extension
    # path('entry/', include('entry.urls')) # do not include the ".py" extension
]

