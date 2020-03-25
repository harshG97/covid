from django.shortcuts import render
from django.http import JsonResponse
import json
#>>> response = JsonResponse({'foo': 'bar'})
# Create your views here.
def index(request):
    return render(request, 'visualcovid/index.html')

def data(request):
    country = json.loads(request.GET['country'])
    print(country)
    #country = request.GET['country']
    return JsonResponse({'country': country})