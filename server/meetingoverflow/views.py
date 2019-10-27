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


# Create your views here.
def index(request):
    return HttpResponse('Hello, world!')


@api_view(['GET', 'POST'])
def signup(request):
    if request.method == 'GET':

        # =============== Real Code=================
        # ARC나 Frontend로 연결할 때는 이 코드로 변경해서 테스트

        #input_id = request.META['HTTP_INPUTID']
        #print(input_id)

        # ==========================================

        # ============== Debug Code=================
        # DRF 에서는 헤더에 값을 넣을 수 없으므로 
        # get 화면이 켜지기 위해서 임시로 input_id 설정

        input_id = 't'

        # ==========================================

        try:
            queryset = User.objects.get(username=input_id)
            print(queryset)
        except(User.DoesNotExist) as e:
            # 아이디가 생성 가능한 경우
            return Response(status=status.HTTP_200_OK)
        # 아이디가 이미 사용되고 있는 경우 
        return Response(status=status.HTTP_204_NO_CONTENT)


    if request.method == 'POST':
        print(request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def signin(request):
    if request.method == 'POST':
        try:
            username = request.data['username']
            password = request.data['password']
        except(KeyError, json.JSONDecodeError):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
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
    if request.method == 'PATCH':
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


@api_view(['POST'])
def create_workspace(request):
    if request.method == 'POST':
        serializer = WorkspaceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATE)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
def workspace(request, id):
    if request.method == 'GET':
        queryset = Workspace.objects.filter(members__contains=request.user)
        if queryset.count() > 0:
            serializer = WorkspaceSerializer(queryset)
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
            return Response(serializer.data, stats=status.HTTP_200_OK)
        else:
            return Response(status.HTTP_404_NOT_FOUND)
    

# @api_view(['GET', 'POST'])
# def notes(request, w_id):
