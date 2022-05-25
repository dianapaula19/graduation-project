from rest_framework import serializers
from .models import OptionsList


class OptionsListSerializer(serializers.ModelSerializer):
	class Meta:
		model = OptionsList
		fields = ['domain', 'learning_mode', 'degree', 'study_program', 'year', 'semester', 'title']