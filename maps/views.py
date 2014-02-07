from django.shortcuts import render_to_response

def sanfrancisco(request):
	return render_to_response('sanfrancisco.html')

def boundaries(request):
	return render_to_response('boundaries.html')

def chicago(request):
	return render_to_response('chicago.html')

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