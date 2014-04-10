from django.shortcuts import render_to_response
from urlconfig import URL_CONFIG

url_config = URL_CONFIG()



def bicycleaccidents_sanfrancisco(request):
	return render_to_response('bicycle-accidents/sanfrancisco.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def boundaries(request):
	return render_to_response('boundaries.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def bicycleaccidents_chicago(request):
	return render_to_response('bicycle-accidents/chicago.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def bicycleaccidents_losangeles(request):
	return render_to_response('bicycle-accidents/los angeles.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def bicycleaccidents_cambridge(request):
	return render_to_response('bicycle-accidents/cambridge.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def bicycleaccidents_manhattan(request):
	return render_to_response('bicycle-accidents/manhattan.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def bicycleaccidents_portland(request):
	return render_to_response('bicycle-accidents/portland.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def bicycleaccidents_austin(request):
	return render_to_response('bicycle-accidents/austin.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def cambridge_footfall(request):
	return render_to_response('footfall/cambridge-footfall.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def manhattan_footfall(request):
	return render_to_response('footfall/manhattan-footfall.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def sanfrancisco_footfall(request):
	return render_to_response('footfall/sanfrancisco-footfall.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def sanfrancisco_green(request):
	return render_to_response('green/sanfrancisco-green.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def cambridge_green(request):
	return render_to_response('green/cambridge.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def cambridge_green2(request):
	return render_to_response('green/cambridge-green2.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

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

def schools(request):
	return render_to_response('schools.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def zipcodes(request):
	return render_to_response('zipcodes.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def cambridge_simulation(request):
	return render_to_response('cambridge-simulation.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})

def cambridge_kmeans(request):
	return render_to_response('cambridge-kmeans.html', {'URL_PREFIX':url_config.get_URL_PREFIX()})
