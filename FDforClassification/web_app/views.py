from django.http import HttpResponse
from django.shortcuts import render


# Create your views here.

def index(request):
    return render(request, 'index.html')


def get_data(request):
    # with open('web_app/static/data.json') as json_data:
    #     d = json.load(json_data)
    # return HttpResponse(json.dumps(d))
    with open(request.GET['file']) as data:
        d = data.read()
        
    return HttpResponse(d)
