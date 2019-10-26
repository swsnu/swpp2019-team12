from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('signup/', views.signup, name='signup'),
    path('workspace/', views.create_workspace, name='create_workspace'),
    path('workspace/<int:id>/', views.workspace, name='workspace'),

]