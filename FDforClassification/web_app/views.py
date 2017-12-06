from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
import json

# Create your views here.

def index(request):
    return render(request, 'index.html')


def get_data(request):
    with open('web_app/static/data.json') as json_data:
        d = json.load(json_data)
    return HttpResponse(json.dumps(d))
