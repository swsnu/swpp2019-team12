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


@api_view(['GET', 'POST'])
def workspace(request):
    if request.method == 'GET':
        profile = Profile.objects.filter(user__username=request.user.username)
        queryset = Workspace.objects.filter(members__in=profile)

        if queryset.count() > 0:
            serializer = WorkspaceSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST':
        serializer = WorkspaceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
def specific_workspace(request, id):
    if request.method == 'GET':
        profile = Profile.objects.filter(user__username=request.user.username)
        queryset = Workspace.objects.filter(members__in=profile).filter(id=id)

        if queryset.count() > 0:
            serializer = WorkspaceSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
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
        print(queryset)
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
        