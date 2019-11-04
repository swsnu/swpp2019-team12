from django.urls import path

from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('user/<str:username>/', views.search_user, name='search_user'),
    path('profile/<int:id>', views.profile, name='profile'),
    # path('profile/<int:id>/workspace/', views.get_workspace_of_user, name='get_workspace_of_user'),
    path('workspace/', views.workspace, name='workspace'),
    path('workspace/<int:id>/', views.specific_workspace, name='specific_workspace'),
    path('workspace/<int:w_id>/todos/', views.workspace_todo, name='workspace_todo'),
    # 해당 workspace의 모든 agenda 가져오는 메ㅑ
    path('workspace/<int:w_id>/agendas/', views.workspace_agenda, name='workspace_agenda'),
    path('workspace/<int:w_id>/notes/', views.notes, name='notes'),
    path('workspace/<int:w_id>/note/<int:n_id>/', views.specific_note, name='specific_note'),
    path('note/<int:n_id>/textblock/', views.textblock, name='textblock'),
]