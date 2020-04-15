from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
import json

import numpy as np
import pandas as pd

#>>> response = JsonResponse({'foo': 'bar'})
# Create your views here.


def index(request):
    
    return render(request, 'visualcovid/dashboard.html')

def explorer(request):
    
    return render(request, 'visualcovid/explorer.html')

def getCountries(request):
    data = pd.read_csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&filename=time_series_covid19_confirmed_global.csv")
    group = data.groupby(['Country/Region']).sum()
    countries = np.array(group.index)
    countries_forJson = countries.tolist()
    return JsonResponse({"countries" : countries_forJson})

def data(request):
    countries = json.loads(request.GET['country'])
    
    time = json.loads(request.GET['time'])
    plotType = request.GET["plotType"]
    
    if plotType == 'confirmed':
        response = confirmed(countries, time)
    elif plotType == 'deaths':
        response = deaths(countries, time)
    elif plotType =='active':
        response = active(countries, time)
    elif plotType == 'newconfirmed':
        response = newConfirmed(countries, time)
    elif plotType == 'growthfactor':
        response = growthFactor(countries, time)

    return JsonResponse(response, safe=False)

def confirmed(countries, time):
    data = pd.read_csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&filename=time_series_covid19_confirmed_global.csv")
    group = data.groupby(['Country/Region']).sum()
    group = group.drop(['Lat', 'Long'], axis = 1)
    if 'all' in countries:
        group = group.sort_values(by= group.columns[-1], ascending = False)
        countries = list(group.index)
    elif 'top10' in countries:
        countries.remove('top10')
        group = group.sort_values(by= group.columns[-1], ascending = False)
        top10 = list(group.index[:10])
        top10.extend(x for x in countries if x not in top10)
        countries = top10
            
            
    group_t = group.transpose()

    if(time == -1):
        group_tt = group_t[countries].transpose()
        #group_tt = group_tt.drop(["Lat", "Long"], axis = 1)
    else:
        group_tt = group_t[countries][-1*time:].transpose()
    response = group_tt.to_json(orient='table')
    
    return response

def deaths(countries, time):
    data = pd.read_csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_deaths_global.csv&filename=time_series_covid19_deaths_global.csv")
    group = data.groupby(['Country/Region']).sum()
    group = group.drop(['Lat', 'Long'], axis = 1)
    if 'all' in countries:
        group = group.sort_values(by= group.columns[-1], ascending = False)
        countries = list(group.index)
    elif 'top10' in countries:
        countries.remove('top10')
        group = group.sort_values(by= group.columns[-1], ascending = False)
        top10 = list(group.index[:10])
        top10.extend(x for x in countries if x not in top10)
        countries = top10

    group_t = group.transpose()

    if(time == -1):
        group_tt = group_t[countries].transpose()
        #group_tt = group_tt.drop(["Lat", "Long"], axis = 1)
    else:
        group_tt = group_t[countries][-1*time:].transpose()
    response = group_tt.to_json(orient='table')
    
    return response

def active(countries, time):
    confirmed = pd.read_csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&filename=time_series_covid19_confirmed_global.csv")
    deaths = pd.read_csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_deaths_global.csv&filename=time_series_covid19_deaths_global.csv")
    recovered = pd.read_csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_recovered_global.csv&filename=time_series_covid19_recovered_global.csv")

    confirmed = confirmed.groupby(['Country/Region']).sum()
    deaths = deaths.groupby(['Country/Region']).sum()
    recovered = recovered.groupby(['Country/Region']).sum()

    confirmed = confirmed.drop(['Lat', 'Long'], axis = 1)
    deaths = deaths.drop(['Lat', 'Long'], axis = 1)
    recovered = recovered.drop(['Lat', 'Long'], axis = 1)

    active = confirmed - recovered - deaths

    if 'all' in countries:
        active = active.sort_values(by= active.columns[-1], ascending = False)
        countries = list(active.index)
    elif 'top10' in countries:
        countries.remove('top10')
        active = active.sort_values(by= active.columns[-1], ascending = False)
        top10 = list(active.index[:10])
        top10.extend(x for x in countries if x not in top10)
        countries = top10
    active_t = active.transpose()

    if(time == -1):
        active_tt = active_t[countries].transpose()
    else:
        active_tt = active_t[countries][-1*time:].transpose()

    response = active_tt.to_json(orient='table')

    return response

def newConfirmed(countries, time):
    print("new")
    data = pd.read_csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&filename=time_series_covid19_confirmed_global.csv")
    group = data.groupby(['Country/Region']).sum()
    group = group.drop(["Lat", "Long"], axis = 1)
    groupDiff = pd.DataFrame(data=group, copy=True)

    prev = group.columns[0]
    for col in group.columns:
        groupDiff[col]=group[col]-group[prev]
        prev = col

    if 'all' in countries:
        groupDiff = groupDiff.sort_values(by= groupDiff.columns[-1], ascending = False)
        countries = list(groupDiff.index)
    elif 'top10' in countries:
        countries.remove('top10')
        groupDiff = groupDiff.sort_values(by= groupDiff.columns[-1], ascending = False)
        top10 = list(groupDiff.index[:10])
        top10.extend(x for x in countries if x not in top10)
        countries = top10

    groupDiff_t = groupDiff.transpose()

    if(time == -1):
        groupDiff_tt = groupDiff_t[countries].transpose()
        #groupDiff_tt = groupDiff_tt.drop(["Lat", "Long"], axis = 1)
    else:
        groupDiff_tt = groupDiff_t[countries][-1*time:].transpose()
    response = groupDiff_tt.to_json(orient='table')
    
    return response

def growthFactor(countries, time):
    data = pd.read_csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&filename=time_series_covid19_confirmed_global.csv")
    group = data.groupby(['Country/Region']).sum()
    group = group.drop(["Lat", "Long"], axis = 1)
    groupDiff = pd.DataFrame(data=group, copy=True)

    prev = group.columns[0]
    for col in group.columns:
        groupDiff[col]=group[col]-group[prev]
        prev = col

    if 'all' in countries:
        groupDiff = groupDiff.sort_values(by= groupDiff.columns[-1], ascending = False)
        countries = list(groupDiff.index)
    elif 'top10' in countries:
        countries.remove('top10')
        groupDiff = groupDiff.sort_values(by= groupDiff.columns[-1], ascending = False)
        top10 = list(groupDiff.index[:10])
        top10.extend(x for x in countries if x not in top10)
        countries = top10
        
    groupDiffDiv = pd.DataFrame(data=groupDiff, copy=True)
    prev = groupDiff.columns[0]
    for col in groupDiff.columns:
        groupDiffDiv[col]=groupDiff[col].divide(groupDiff[prev])
        prev = col
        
    groupDiffDiv_t = groupDiffDiv.transpose()

    if(time == -1):
        groupDiffDiv_tt = groupDiffDiv_t[countries].transpose()
    else:
        groupDiffDiv_tt = groupDiffDiv_t[countries][-1*time:].transpose()
    response = groupDiffDiv_tt.to_json(orient='table')
    
    return response
