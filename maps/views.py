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

def cambridge_generations(request):
	return render_to_response('cambridge-generations.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def cambridge_bestmode(request):
	return render_to_response('cambridge-bestmode.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def cambridge_efficiency_blocks(request):
	return render_to_response('cambridge-efficiency-blocks.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def manhattan_efficiency_blocks(request):
	return render_to_response('manhattan-efficiency-blocks.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def mumbai_footfall(request):
	return render_to_response('mumbai-footfall.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def scale(request):
	return render_to_response('scale.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def slider_bar(request):
	return render_to_response('slider-bar.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

