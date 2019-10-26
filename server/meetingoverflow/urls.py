from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('workspace/', views.create_workspace, name='create_workspace'),
    path('workspace/<int:id>/', views.workspace, name='workspace'),

]