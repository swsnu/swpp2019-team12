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
        except(Profile.DoesNotExist):
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
        except(Profile.DoesNotExist):
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
        queryset = Workspace.objects.filter(members__in=profile)
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
            except(Profile.DoesNotExist):
                return Response(status=status.HTTP_404_NOT_FOUND)

        member_list = []
        for member in members:
            try:
                member_list.append(Profile.objects.get(user__username=member))
            except(Profile.DoesNotExist):
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
#     except(Workspace.DoesNotExist):
#         return Response(status=status.HTTP_404_NOT_FOUND)
#     serializer = WorkspaceSerializer(workspace)
#     return Response(serializer.data, status=status.HTTP_200_OK)

# => workspace와 관련된 정보만을 반환하는 RESTful 한 GET 코드

# Frontend 에서 필요한 각 정보별로 API를 따로 호출하는 것이 더 바람직!
# 또한 결국 Django 모델 인스턴스 객체를 직접 Json으로 Serialize하는 것이
# 어렵기 때문에, id값만을 보내도록 구현되어 있어 결국 각 component에서 이 
# id값을 통해 Todo, Agenda, Note의 데이터를 불러오는 구조로 구성되어야
# 하므로, 이 api에서 정보를 모두 묶어서 보내는 것이 큰 의미가 없을 것으로 생각됨 
# ================================================================
"""
@api_view(['GET', 'PATCH', 'DELETE'])
def specific_workspace(request, id):
    if request.method == 'GET':
        #profile = request.user.profile
        profile = Profile.objects.get(id=1)
        try: 
            workspace = Workspace.objects.get(id=id)
        except(Workspace.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        members = []
        for member in workspace.members.all():
            members.append(member.user.username)
        admins = []
        for admin in workspace.admins.all():
            admins.append(admin.user.username)
        notes = []
        agendas = []
        for note in Note.objects.filter(workspace=workspace):
            notes.append(note.id)
            """
            Agenda 의 경우 Workspace field 가 없으므로
            Workspace가 가지고 있는 모든 노트들을 순회하며
            필터링해서 찾아내야함
            """
            for agenda in Agenda.objects.filter(note=note):
                agendas.append(agenda.id)
        todos = []
        for todo in Todo.objects.filter(assignees__in=[profile]):
            todos.append(todo.id)

        data = {
            "workspace_name": workspace.name,
            "members": members,
            "admins": admins,
            "notes": notes,
            "agendas": agendas,
            "todos": todos
        }
        print(data)
        return JsonResponse(data, status=200, safe=False)
        


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


# 어떤 유저의 워크스페이스 상의 모든 Todo 반환
@api_view(['GET'])
def specific_todo(request, w_id):
    if request.method == 'GET':
        profile = request.user.profile
        queryset = Todo.objects.filter(workspace__id=w_id, assignees__in=[profile])
        if queryset.count() > 0:
            serializer = TodoSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


# @api_view(['GET'])
# def get_workspace_of_user(request, id):
#     if request.method == 'GET':
#         profile = Profile.objects.get(id=u_id)
#         queryset = Workspace.objects.filter(members__in=[profile])
#         serializer = WorkspaceSerializer(queryset)
#         if serializer.is_valid():
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             return Response(status.HTTP_404_NOT_FOUND)


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
def specific_note(request, w_id, n_id):
    if request.method == 'GET':
        try:
            current_note = Note.objects.get(id=n_id)
        except(Note.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = NoteSerializer(current_note)
        Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PATCH':
        try:
            current_note = Note.objects.get(id=n_id)
        except(Note.DoesNotExist):
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

#/note/:n_id/block
@api_view(['GET', 'POST'])
def textblock(request, n_id):
    # 해당 노트의 모든 TextBlock 리스트 반환
    if request.method == 'GET':
        queryset = TextBlock.objects.filter(
                        is_parent_note=True, 
                        note__id=n_id
        )
        print(queryset)
        if queryset.count() != 0:
            serializer = TextBlockSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    # if request.method == 'POST':

