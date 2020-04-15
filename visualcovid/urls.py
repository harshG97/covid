from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path(r'^data/$', views.data, name = 'data'),
    path(r'^countries/$', views.getCountries, name = 'countries'),
    path('explorer/', views.explorer, name = 'explorer'),
]