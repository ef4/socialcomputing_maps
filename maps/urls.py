from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^bicycle-accidents/sanfrancisco$', 'maps.views.bicycleaccidents_sanfrancisco', name='home'),
    url(r'^bicycle-accidents/chicago$', 'maps.views.bicycleaccidents_chicago', name='home'),
    url(r'^bicycle-accidents/losangeles$', 'maps.views.bicycleaccidents_losangeles', name='home'),
    url(r'^bicycle-accidents/cambridge$', 'maps.views.bicycleaccidents_cambridge', name='home'),
    url(r'^bicycle-accidents/portland$', 'maps.views.bicycleaccidents_portland', name='home'),
    url(r'^bicycle-accidents/manhattan$', 'maps.views.bicycleaccidents_manhattan', name='home'),
    url(r'^bicycle-accidents/austin$', 'maps.views.bicycleaccidents_austin', name='home'),
    url(r'^bicycle-accidents/brooklyn$', 'maps.views.bicycleaccidents_brooklyn', name='home'),
    url(r'^bicycle-accidents/bronx$', 'maps.views.bicycleaccidents_bronx', name='home'),
    url(r'^bicycle-accidents/queens$', 'maps.views.bicycleaccidents_queens', name='home'),
    url(r'^bicycle-accidents/statenisland$', 'maps.views.bicycleaccidents_statenisland', name='home'),
    url(r'^/boundaries$', 'maps.views.boundaries', name='home'),
    url(r'^footfall/cambridge$', 'maps.views.cambridge_footfall', name='home'),
    url(r'^footfall/manhattan$', 'maps.views.manhattan_footfall', name='home'),
    url(r'^footfall/sanfrancisco$', 'maps.views.sanfrancisco_footfall', name='home'),
    url(r'^green/sanfrancisco$', 'maps.views.sanfrancisco_green', name='home'),
    url(r'^green/cambridge$', 'maps.views.cambridge_green', name='home'),
    url(r'^green/atlanta$', 'maps.views.atlanta_green', name='home'),
    url(r'^green/washingtondc$', 'maps.views.washington_green', name='home'),
    url(r'^green/portland$', 'maps.views.portland_green', name='home'),
    url(r'^green/cambridge-green2$', 'maps.views.cambridge_green2', name='home'),
    url(r'^cambridge-generations$', 'maps.views.cambridge_generations', name='home'),
    url(r'^bestmode/cambridge$', 'maps.views.cambridge_bestmode', name='home'),
    url(r'^bestmode/manhattan$', 'maps.views.manhattan_bestmode', name='home'),
    url(r'^bestmode/boulder$', 'maps.views.boulder_bestmode', name='home'),
    url(r'^bestmode/santamonica$', 'maps.views.santamonica_bestmode', name='home'),
    url(r'^bestmode/portland$', 'maps.views.portland_bestmode', name='home'),
    url(r'^bestmode/washingtondc$', 'maps.views.washingtondc_bestmode', name='home'),
    url(r'^bestmode/sanfrancisco$', 'maps.views.sanfrancisco_bestmode', name='home'),
    url(r'^bestmode/saltlakecity$', 'maps.views.saltlakecity_bestmode', name='home'),
    url(r'^bestmode/brooklyn$', 'maps.views.brooklyn_bestmode', name='home'),
    url(r'^bestmode/philadelphia$', 'maps.views.philadelphia_bestmode', name='home'),
    url(r'^trans-efficiency/cambridge$', 'maps.views.cambridge_transefficiency', name='home'),
    url(r'^manhattan-efficiency-blocks$', 'maps.views.manhattan_efficiency_blocks', name='home'),
    url(r'^mumbai-footfall$', 'maps.views.mumbai_footfall', name='home'),
    url(r'^scale$', 'maps.views.scale', name='home'),
    url(r'^schools$', 'maps.views.schools', name='home'),
    url(r'^zipcodes$', 'maps.views.zipcodes', name='home'),
    url(r'^cambridge-simulation$', 'maps.views.cambridge_simulation', name='home'),
    url(r'^cambridge-kmeans$', 'maps.views.cambridge_kmeans', name='home'),
    # url(r'^maps/', include('maps.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
urlpatterns += staticfiles_urlpatterns()