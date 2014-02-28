from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^sanfrancisco$', 'maps.views.sanfrancisco', name='home'),
    url(r'^chicago$', 'maps.views.chicago', name='home'),
    url(r'^boundaries$', 'maps.views.boundaries', name='home'),
    url(r'^losangeles$', 'maps.views.losangeles', name='home'),
    url(r'^cambridge$', 'maps.views.cambridge', name='home'),
    url(r'^portland$', 'maps.views.portland', name='home'),
    url(r'^cambridge-footfall$', 'maps.views.cambridge_footfall', name='home'),
    url(r'^manhattan-footfall$', 'maps.views.manhattan_footfall', name='home'),
    url(r'^sanfrancisco-footfall$', 'maps.views.sanfrancisco_footfall', name='home'),
    url(r'^sanfrancisco-green$', 'maps.views.sanfrancisco_green', name='home'),
    url(r'^cambridge-green$', 'maps.views.cambridge_green', name='home'),
    url(r'^cambridge-generations$', 'maps.views.cambridge_generations', name='home'),
    url(r'^cambridge-bestmode$', 'maps.views.cambridge_bestmode', name='home'),
    url(r'^cambridge-efficiency-blocks$', 'maps.views.cambridge_efficiency_blocks', name='home'),
    url(r'^manhattan-efficiency-blocks$', 'maps.views.manhattan_efficiency_blocks', name='home'),
    url(r'^manhattan$', 'maps.views.manhattan', name='home'),
    url(r'^mumbai-footfall$', 'maps.views.mumbai_footfall', name='home'),
    url(r'^scale$', 'maps.views.scale', name='home'),
    url(r'^slider-bar$', 'maps.views.slider_bar', name='home'),
    # url(r'^maps/', include('maps.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
urlpatterns += staticfiles_urlpatterns()