import json


class URL_CONFIG():

	def __init__(self):
		self.URL_PREFIX = ''

		self.fileName = '/'
		try:
			config_file = open('/../static/config.json', 'r')
			json_data = json.load(config_file)
			self.URL_PREFIX = json_data['URL_PREFIX']
		except IOError:
			self.URL_PREFIX = '/'


	def get_URL_PREFIX(self):
		return self.URL_PREFIX