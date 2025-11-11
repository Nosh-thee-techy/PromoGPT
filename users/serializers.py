from rest_framework import serializers
from .models import User, Business


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "phone", "role", "is_verified")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("email", "password", "first_name", "last_name", "phone", "role")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ("id", "name", "slug", "industry", "location")
        read_only_fields = ("id", "slug")