from django.urls import path


from . import views

urlpatterns = [
    # Auth APIs
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('profile/', views.profile, name='profile'),
    path('profile/<int:u_id>/', views.specific_profile, name='specific_profile'),

    # Workspace APIs
    path('workspace/', views.workspace, name='workspace'),
    path('workspace/<int:id>/', views.specific_workspace,
         name='specific_workspace'),
    # 해당 workspace에 속한 로그인한 user의 모든 todo 가져오는 API (필요하지 않다면 추후 삭제)
    path('workspace/<int:w_id>/todos/',
         views.workspace_todo, name='workspace_todo'),
    # 해당 workspace의 모든 agenda 가져오는 API (필요하지 않다면 추후 삭제)
    path('workspace/<int:w_id>/agendas/',
         views.workspace_agenda, name='workspace_agenda'),
    # 해당 workspace의 모든 notes 가져오는 API (필요하지 않다면 추후 삭제)
    path('workspace/<int:w_id>/notes/', views.notes, name='notes'),

    # Note API
    path('note/<int:n_id>/', views.specific_note, name='specific_note'),
    path('siblingnotes/<int:n_id>/', views.sibling_notes, name='sibling_notes'),
    # ===================
    #     Block APIs
    # ===================

    # TextBlock
    path('note/<int:n_id>/textblocks/', views.textblock_child_of_note,
         name='textblock_child_of_note'),
    path('agenda/<int:a_id>/textblocks/', views.textblock_child_of_agenda,
         name='textblock_child_of_agenda'),
    path('textblock/<int:id>/', views.modify_textblock, name='modify_textblock'),
    # AgendaBlock
    path('note/<int:n_id>/agendas/', views.agenda_child_of_note,
         name='agenda_child_of_note'),
    #path('agenda/<int:a_id>/agendas/', views.agenda_child_of_agenda, name='agenda_child_of_agenda'),
    path('agenda/<int:id>/', views.modify_agenda, name='modify_agenda'),
    # TodoBlock
    path('note/<int:n_id>/todos/', views.todoblock_child_of_note,
         name='todoblock_child_of_note'),
    path('agenda/<int:a_id>/todos/', views.todoblock_child_of_agenda,
         name='todoblock_child_of_agenda'),
    path('todo/<int:id>/', views.modify_todoblock, name='modify_agenda'),
    # ImageBlock
    path('note/<int:n_id>/images/', views.image_child_of_note,
         name='image_child_ofnote'),
    path('agenda/<int:a_id>/images/', views.image_child_of_agenda,
         name='image_child_of_agenda'),
    path('image/<int:id>/', views.modify_image, name='modify_image')

]
