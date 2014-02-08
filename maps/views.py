from django.shortcuts import render_to_response
from urlconfig import URL_CONFIG

url_config = URL_CONFIG()



def sanfrancisco(request):
	return render_to_response('sanfrancisco.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def boundaries(request):
	return render_to_response('boundaries.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def chicago(request):
	return render_to_response('chicago.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def losangeles(request):
	return render_to_response('los angeles.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def cambridge(request):
	return render_to_response('cambridge.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def manhattan(request):
	return render_to_response('manhattan.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def portland(request):
	return render_to_response('portland.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def cambridge_footfall(request):
	return render_to_response('cambridge-footfall.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def manhattan_footfall(request):
	return render_to_response('manhattan-footfall.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def sanfrancisco_footfall(request):
	return render_to_response('sanfrancisco-footfall.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def sanfrancisco_green(request):
	return render_to_response('sanfrancisco-green.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def cambridge_green(request):
	return render_to_response('cambridge-green.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})