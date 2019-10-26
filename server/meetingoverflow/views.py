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
        input_id = request.META['HTTP_INPUTID']
        queryset = User.objects.values('username')
        if input_id not in queryset:
            # 아이디가 생성 가능한 경우
            return Response(status=status.HTTP_200_OK)
        else:
            # 아이디가 이미 사용되고 있는 경우 
            return Response(status=status.HTTP_204__NO_CONTENT)

    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATE)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# 추가된 api / Profile에 닉네임 저장
@api_view(['PATCH'])
def profile(request):
    if request.method == 'PATCH':
        queryset = request.user.profile
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


