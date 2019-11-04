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
import dateutil.parser

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
        if request.user.is_authenticated:
            auth.logout(request)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        

@api_view(['GET'])
def get_current_user(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                current_user = request.user
                current_profile = Profile.objects.get(user=current_user)

                user_serializer = SearchSerializer(current_user)
                profile_serializer = ProfileSerializer(current_profile)

                user_info = { 
                    'user': user_serializer.data,
                    'profile': profile_serializer.data
                }
                return Response(user_info, status=status.HTTP_200_OK)
            except(Profile.DoesNotExist):
                return Response(status=status.HTTP_404_NOT_FOUND)
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

@api_view(['GET'])
def search_user_in_workspace(request, username, workspace_id):
    if request.method == 'GET':
        try:
            workspace = Workspace.objects.get(id=workspace_id)
            members = workspace.members.all()
            users = []

            for member in members:
                user = member.user
                if username in user.username:
                    user_serializer = UserSerializer(user)
                    users.append(user_serializer.data)

            return Response(users, status=status.HTTP_200_OK)
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
        profile = Profile.objects.filter(user__username=request.user.username)
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
                admin_list.append(Profile.objects.get(user__username=admin['username']))
            except(Profile.DoesNotExist):
                return Response(status=status.HTTP_404_NOT_FOUND)

        member_list = []
        for member in members:
            try:
                member_list.append(Profile.objects.get(user__username=member['username']))
            except(Profile.DoesNotExist):
                return Response(status=status.HTTP_404_NOT_FOUND)

        Workspace.objects.create(name=name)
        workspace = Workspace.objects.get(name=name)
        workspace.admins.set(admin_list)
        workspace.members.set(member_list)
        workspace.save()

        workspace_serializer = WorkspaceSerializer(workspace)
        return Response(workspace_serializer.data, status=status.HTTP_201_CREATED)



# ===================================================
# workspace id로부터 특정 워크스페이스 GET / PATCH / DELETE
# 
# GET의 경우 관련된 모든 정보 리턴 for FE/Workspace
# (workspace, member, admin, note, agenda, todo)
# ===================================================
@api_view(['GET', 'PATCH', 'DELETE'])
def specific_workspace(request, id):
    if request.method == 'GET':
        profile = Profile.objects.filter(user__username=request.user.username)

        workspaces = Workspace.objects.filter(members__in=profile)
        workspace = Workspace.objects.filter(members__in=profile).get(id=id)
        members = workspace.members.all()
        admins = workspace.admins.all()
        notes = Note.objects.filter(workspace=workspace)
        agendas = Agenda.objects.filter(note__in=notes)
        todos = Todo.objects.filter(note__in=notes).filter(assignees__in=profile)

        if workspace is not None:
            workspaces_serializer = WorkspaceSerializer(workspaces, many=True)
            workspace_serializer = WorkspaceSerializer(workspace)
            member_serializer = ProfileSerializer(members, many=True)
            admin_serializer = ProfileSerializer(admins, many=True)
            note_serializer = NoteSerializer(notes, many=True)
            agenda_serializer = AgendaSerializer(agendas, many=True)
            todo_serializer = TodoSerializer(todos, many=True)

            data = {
                "workspaces": workspaces_serializer.data,
                "workspace": workspace_serializer.data,
                "members": member_serializer.data,
                "admins": admin_serializer.data,
                "notes": note_serializer.data,
                "agendas": agenda_serializer.data,
                "todos": todo_serializer.data
            }

            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


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


# ===================================================
# user id의 경우 로그인한 사람으로부터 
# request.user.id로 가져올 수 있으니 url에 넣을 필요가 있나?
# ===================================================
@api_view(['GET'])
def specific_todo(request, w_id, u_id):
    if request.method == 'GET':
        profile = Profile.objects.get(id=u_id)
        queryset = Todo.objects.filter(workspace__id=w_id, assignees__in=[profile])
        if queryset.count() > 0:
            serializer = TodoSerializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_workspace_of_user(request, id):
    if request.method == 'GET':
        profile = Profile.objects.get(id=u_id)
        queryset = Workspace.objects.filter(members__in=[profile])
        serializer = WorkspaceSerializer(queryset)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status.HTTP_404_NOT_FOUND)


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
        try:
            title = request.data['title']
            participants= request.data['participants']
            created_at = dateutil.parser.parse(request.data['createdAt'])
            last_modified_at = dateutil.parser.parse(request.data['lastModifiedAt'])
            location = request.data['location']
            workspace_id = request.data['workspace'] # workspace id
            workspace = Workspace.objects.get(id=workspace_id)
            # tags = request.data['tags'] # tag string list
            # ml_speech_text = request.data['mlSpeechText']
        except(KeyError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        participants_list = []
        for participant in participants:
            try:
                participants_list.append(Profile.objects.get(user__username=participant))
            except(Profile.DoesNotExist):
                return Response(status=status.HTTP_404_NOT_FOUND)

        Note.objects.create(title=title, 
                            location=location,
                            created_at=created_at,
                            last_modified_at=last_modified_at,
                            workspace=workspace)
        note = Note.objects.all().last()
        note.participants.set(participants_list)
        note.save()

        note_serializer = NoteSerializer(note)
        return Response(note_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PATCH', 'DELETE'])
def specific_note(request, w_id, n_id):
    if request.method == 'GET':
        try:
            current_note = Note.objects.get(id=n_id)
        except(Note.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = NoteSerializer(note)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

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


# @api_view(['GET', 'POST'])
# def textblock(request, w_id, n_id, is_parent_note):
#     if request.method == 'GET':
#         if is_parent_note:
#             queryset = TextBlock.objects.filter(
#                             is_parent_note=True, 
#                             note__id=n_id
#             )
#         else:
#             queryset = TextBlock.objects.filter(
#                             is_parent_note=False,
#                             parent_agenda__id=n_id
#             )
        