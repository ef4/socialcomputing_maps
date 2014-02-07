from django.shortcuts import render_to_response


URL_PREFIX = '/p/'



def sanfrancisco(request):
	print URL_PREFIX
	return render_to_response('sanfrancisco.html', {'URL_PREFIX':URL_PREFIX})

def boundaries(request):
	return render_to_response('boundaries.html')

def chicago(request):
	return render_to_response('chicago.html', {'URL_PREFIX':URL_PREFIX})

def losangeles(request):
	return render_to_response('los angeles.html')

def cambridge(request):
	return render_to_response('cambridge.html')

def manhattan(request):
	return render_to_response('manhattan.html')

def portland(request):
	return render_to_response('portland.html')

def cambridge_footfall(request):
	return render_to_response('cambridge-footfall.html')

def manhattan_footfall(request):
	return render_to_response('manhattan-footfall.html')

def sanfrancisco_footfall(request):
	return render_to_response('sanfrancisco-footfall.html')

def sanfrancisco_green(request):
	return render_to_response('sanfrancisco-green.html')

def cambridge_green(request):
	return render_to_response('cambridge-green.html')