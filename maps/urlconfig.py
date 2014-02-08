import json
import os

class URL_CONFIG():

	def __init__(self):
		#self.URL_PREFIX = ''

		basePath = os.path.dirname(__file__)
		relPath = '../static/config.json'
		configFilePath = os.path.join(basePath, relPath)

		try:
			config_file = open(configFilePath, 'r')
			json_data = json.load(config_file)
			self.URL_PREFIX = json_data['URL_PREFIX']
		except IOError:
			self.URL_PREFIX = '/'


	def get_URL_PREFIX(self):
		return self.URL_PREFIX