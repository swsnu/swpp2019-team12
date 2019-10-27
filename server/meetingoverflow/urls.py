from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('profile/<int:id>', views.profile, name='profile'),
    path('workspace/', views.create_workspace, name='create_workspace'),
    path('workspace/<int:id>/', views.workspace, name='workspace'),
    path('workspace/<int:w_id>/user/<int:u_id>/todos/', views.specific_todo, name='specific_todo'),

]