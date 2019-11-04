from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from django.contrib import auth
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
import json
from django.db.models import Q

from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder

@api_view(['PATCH', 'POST'])
def signup(request):
    if request.method == 'PATCH':
        try:
            username = request.data['username']
        except(KeyError):
            return HttpResponse(status=400)
        try:
            user = User.objects.get(username=username)
        except(User.DoesNotExist) as e:
            # 아이디가 생성 가능한 경우
            return Response(status=status.HTTP_200_OK)
        # 아이디가 이미 사용되고 있는 경우 
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'POST':
        try:
            username = request.data['username']
            password = request.data['password']
            nickname = request.data['nickname']
        except(KeyError):
            return HttpResponse(status=400)
        
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
            profile.nickname = nickname
            profile.save()
            auth.login(request, user)
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    


@api_view(['POST'])
def signin(request):
    if request.method == 'POST':
        try:
            username = request.data['username']
            password = request.data['password']
        except(KeyError):
            return Response(status=status.HTTP_404_NOT_FOUND)
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            print(Response(status=status.HTTP_204_NO_CONTENT).cookies)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def signout(request):
    if request.method == 'GET':
        print(request.user)
        if request.user.is_authenticated:
            auth.logout(request)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
@api_view(['GET'])
def search_user(request, username):
    if request.method == 'GET':
        try:
            queryset = User.objects.filter(username__contains=username)
            serializer = SearchSerializer(queryset, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# 추가된 api / Profile에 닉네임 저장
@api_view(['GET', 'PATCH'])
def profile(request, id):
    if request.method == 'GET':
        try: 
            profile = Profile.objects.get(id=id)
        except(Profile.DeosNotExist) as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # ===========Front implementation===========
    # Signup 성공시 Response로 반환되는 새 유저의 id 로
    # /api/profile/:id/ PATCH 호출해서 닉네임 수정
    # ==========================================
    elif request.method == 'PATCH':
        # queryset = request.user.profile
        try: 
            queryset = Profile.objects.get(id=id)
        except(Profile.DeosNotExist) as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProfileSerializer(queryset, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# ===================================================
# 모든 workspace GET / 워크스페이스 생성 POST
#
# 모든 workspace GET 의 경우 admin 정보만 같이 리턴
# for FE/WorkspaceSelection
# ===================================================
@api_view(['GET', 'POST'])
def workspace(request):
    if request.method == 'GET':
        profile = request.user.profile
        queryset = Workspace.objects.filter(members__in=[profile])
        admins = []

        for queryset_element in queryset:
            admin = queryset_element.admins.all()
            admin_serializer = ProfileSerializer(admin, many=True)
            admins.append(admin_serializer.data)

        if queryset.count() > 0:
            workspace_serializer = WorkspaceSerializer(queryset, many=True)
            serializer = {"workspaces": workspace_serializer.data, "admins": admins }
            return Response(serializer, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST':
        try:
            name = request.data['name']
            admins = request.data['admins'] # admin id list
            members = request.data['members'] # members id list
        except(KeyError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        admin_list = []
        for admin in admins:
            try:
                admin_list.append(Profile.objects.get(user__username=admin))
            except(Profile.DeosNotExist) as e:
                return Response(status=status.HTTP_404_NOT_FOUND)

        member_list = []
        for member in members:
            try:
                member_list.append(Profile.objects.get(user__username=member))
            except(Profile.DeosNotExist) as e:
                return Response(status=status.HTTP_404_NOT_FOUND)

        Workspace.objects.create(name=name)
        workspace = Workspace.objects.get(name=name)
        workspace.admins.set(admin_list)
        workspace.members.set(member_list)
        workspace.save()
        return Response(status=status.HTTP_201_CREATED)


# ===================================================
# workspace id로부터 특정 워크스페이스 GET / PATCH / DELETE
# 
# GET의 경우 관련된 모든 정보 리턴 for FE/Workspace
# (workspace, member, admin, note, agenda, todo)
# ===================================================
"""
# ======================== RESTful Code ==========================
# if request.method == 'GET':
#     try: 
#         workspace = Workspace.objects.get(id=id)
#     except(Workspace.DeosNotExist) as e:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#     serializer = WorkspaceSerializer(workspace)
#     return Response(serializer.data, status=status.HTTP_200_OK)
#
# => workspace와 관련된 정보만을 반환하는 RESTful 한 GET 코드
#
# Frontend 에서 필요한 각 정보별로 API를 따로 호출하는 것이 더 바람직!
# 아래의 경우 여러 serializer를 거쳐야 하므로 한 api가 비대해지는 문제점 발생
# ================================================================
"""
@api_view(['GET', 'PATCH', 'DELETE'])
def specific_workspace(request, id):
    if request.method == 'GET':
        profile = request.user.profile
        #profile = Profile.objects.get(id=1)
        try: 
            workspace = Workspace.objects.get(id=id)
        except(Workspace.DeosNotExist) as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        members = workspace.members.all()
        member_serializer = ProfileSerializer(members, many=True)
        admins = workspace.admins.all()
        admin_serializer = ProfileSerializer(admins, many=True)
        notes = Note.objects.filter(workspace=workspace)
        note_serializer = NoteSerializer(notes, many=True)
        agendas = Agenda.objects.filter(note__workspace=workspace)
        agenda_serializer = AgendaSerializer(agendas, many=True)
        todos = Todo.objects.filter(assignees__in=[profile])
        todo_serializer = TodoSerializer(todos, many=True)

        serializer = {
            "members": member_serializer.data,
            "admins": admin_serializer.data,
            "notes": note_serializer.data,
            "agendas": agenda_serializer.data,
            "todos": todo_serializer.data
        }
        
        return Response(serializer, status=status.HTTP_200_OK)
        
    elif request.method == 'PATCH':
        try:
            current_workspace = Workspace.objects.get(id=id)
        except(Workspace.DoesNotExist) as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = WorkspaceSerializer(current_workspace, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            current_workspace = Workspace.objects.get(id=id)
        except(Workspace.DoesNotExist) as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        current_workspace.delete()
        return Response(status=status.HTTP_200_OK)


# 어떤 유저의 워크스페이스 상의 assign된 모든 Todo 반환
@api_view(['GET'])
def workspace_todo(request, w_id):
    if request.method == 'GET':
        profile = request.user.profile
        queryset = Todo.objects.filter(workspace__id=w_id, assignees__in=[profile])
        if queryset.count() > 0:
            serializer = TodoSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


# 어떤 유저의 워크스페이스 상의 모든 agenda 반환
@api_view(['GET'])
def workspace_agenda(request, w_id):
    if request.method == 'GET':
        queryset = Agenda.objects.filter(note__workspace=workspace)
        if queryset.count() > 0:
            serializer = AgendaSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST'])
def notes(request, w_id):
    if request.method == 'GET':
        queryset = Note.objects.filter(workspace__id=w_id)
        serializer = NoteSerializer(queryset)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'POST':
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
def specific_note(request, n_id):
    if request.method == 'GET':
        try:
            current_note = Note.objects.get(id=n_id)
        except(Note.DeosNotExist) as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = NoteSerializer(current_note)
        Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PATCH':
        try:
            current_note = Note.objects.get(id=n_id)
        except(Note.DeosNotExist) as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = NoteSerializer(current_note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        try:
            current_note = Note.objects.get(id=n_id)
        except(Workspace.DoesNotExist) as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        current_note.delete()
        return Response(status=status.HTTP_200_OK)


"""
===================================================
url: /api/note/:id/textblock/
Note에 직접 속해있는 TextBlock을 모두 가져오거나 생성하는 API
POST 를 하는 경우 Frontend에서 다음과 같은 Json을 날리면 됨
    {
        "content": "Hello World",
        "layer_x": 0,
        "layer_y": 1
    }
===================================================
"""
@api_view(['GET', 'POST'])
def textblock_child_of_note(request, n_id):
    # 해당 노트의 모든 TextBlock 리스트 반환
    if request.method == 'GET':
        queryset = TextBlock.objects.filter(
            is_parent_note=True, 
            note__id=n_id
        )
        if queryset.count() > 0:
            serializer = TextBlockSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    elif request.method == 'POST':
        try:
            note = Note.objects.get(id=n_id)
        except(Note.DeosNotExist) as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        data = {
            'content': request.data['content'],
            'layer_x': request.data['layer_x'],
            'layer_y': request.data['layer_y'],
            'note': n_id,
            'is_parent_note': True
        }
        serializer = TextBlockSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)


"""
==================================================
url: /api/agenda/:id/textblock/
Agenda에 속해있는 TextBlock을 모두 가져오거나 생성하는 API

POST 를 하는 경우 Frontend에서 다음과 같은 Json을 날리면 됨
    {
        "content": "Hello World",
        "layer_x": 0,
        "layer_y": 1
    }
==================================================
"""
@api_view(['GET', 'POST'])
def textblock_child_of_agenda(request, a_id):
    try:
        agenda = Agenda.objects.get(id=a_id)
    except(Agenda.DeosNotExist) as e:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        queryset = TextBlock.objects.filter(
            is_parent_note=False, 
            note__id=agenda.note.id,
            parent_agenda__id=a_id
        )
        if queryset.count() > 0:
            serializer = TextBlockSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    elif request.method == 'POST':        
        data = {
            'content': request.data['content'],
            'layer_x': request.data['layer_x'],
            'layer_y': request.data['layer_y'],
            'note': agenda.note.id,
            'parent_agenda':a_id,
            'is_parent_note': False
        }
        serializer = TextBlockSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)


"""
================================================
url: /api/textblock/id/
PATCH 를 하는 경우 수정하고자 하는 field에 대해서만 새로운
정보를 전달하면 됨. 예를 들어 content만 수정하고자 한다면 
다음과 같은 Json을 날리면 됨. 
    {
        "content": "Modification",
    }
================================================
"""
@api_view(['GET', 'PATCH', 'DELETE'])
def modify_textblock(request, id):
    try:
        current_textblock = TextBlock.objects.get(id=id)
    except(TextBlock.DoesNotExist) as e:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = TextBlockSerializer(current_textblock)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PATCH':
        serializer = TextBlockSerializer(current_textblock, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        current_textblock.delete()
        return Response(status=status.HTTP_200_OK)


"""
===================================================
url: /api/note/:id/agendas/
Note에 직접 속해있는 Agenda들을 모두 가져오거나 생성하는 API
POST 를 하는 경우 Frontend에서 다음과 같은 Json을 날리면 됨
    {
        "content": "Hello World",
        "layer_x": 0,
        "layer_y": 1
    }
===================================================
"""
@api_view(['GET', 'POST'])
def agenda_child_of_note(request, n_id):
    # 해당 노트의 모든 TextBlock 리스트 반환
    if request.method == 'GET':
        queryset = TextBlock.objects.filter(
            is_parent_note=True, 
            note__id=n_id
        )
        if queryset.count() > 0:
            serializer = TextBlockSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    elif request.method == 'POST':
        try:
            note = Note.objects.get(id=n_id)
        except(Note.DeosNotExist) as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        data = {
            'content': request.data['content'],
            'layer_x': request.data['layer_x'],
            'layer_y': request.data['layer_y'],
            'note': n_id,
            'is_parent_note': True
        }
        serializer = AgendaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)


"""
==================================================
url: /api/agenda/:id/agendas/
Agenda에 속해있는 하위 agenda를 모두 가져오거나 생성하는 API

POST 를 하는 경우 Frontend에서 다음과 같은 Json을 날리면 됨
    {
        "content": "Hello World",
        "layer_x": 0,
        "layer_y": 1
    }
==================================================
"""
@api_view(['GET', 'POST'])
def agenda_child_of_agenda(request, a_id):
    try:
        # parent agenda에 해당함
        agenda = Agenda.objects.get(id=a_id)
    except(Agenda.DeosNotExist) as e:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        queryset = Agenda.objects.filter(
            is_parent_note=False, 
            # parent agenda가 중첩되어있더라도 결국 가장 최상위
            # agenda는 note에 속해있으므로 이 방식으로 note id 획득 가능함
            note__id=agenda.note.id,
            parent_agenda__id=a_id
        )
        if queryset.count() > 0:
            serializer = AgendaSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    elif request.method == 'POST':
        data = {
            'content': request.data['content'],
            'layer_x': request.data['layer_x'],
            'layer_y': request.data['layer_y'],
            'note': agenda.note.id,
            'parent_agenda':a_id,
            'is_parent_note': False
        }
        serializer = AgendaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)


"""
================================================
url: /api/agenda/:id/
PATCH 를 하는 경우 수정하고자 하는 field에 대해서만 새로운
정보를 전달하면 됨. 예를 들어 is_done만 수정하고자 한다면 
다음과 같은 Json을 날리면 됨. 
    {
        "is_done": "true",
    }
================================================
"""
@api_view(['GET', 'PATCH', 'DELETE'])
def modify_agenda(request, id):
    try:
        current_agenda = Agenda.objects.get(id=id)
    except(Agenda.DoesNotExist) as e:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AgendaSerializer(current_agenda)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    elif request.method == 'PATCH':
        serializer = AgendaSerializer(current_agenda, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        current_agenda.delete()
        return Response(status=status.HTTP_200_OK)