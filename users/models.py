from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser,PermissionsMixin
from django.utils import timezone
from django.utils.text import slugify


class UserManager(BaseUserManager):
    def create_user(self,email,password=None,**extrafields):
        if not email:
            raise ValueError("Users must have an email")
        
        email=self.normalize_email(email)
        user=self.model(email=email,**extrafields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,email,password=None,**extrafields):
        extrafields.setdefault('role','admin')
        extrafields.setdefault('is_staff',True)
        extrafields.setdefault("is_superuser",True)
        return self.create_user(email,password,**extrafields)
    
    def get_by_natural_key(self, email):
        return self.get(email=email)


class User(AbstractBaseUser,PermissionsMixin):
    ROLE_CHOICES=(
        ('owner','Business owner'),
        ('staff','staff member'),
        ('admin','Administrator')
    )

    email=models.EmailField(unique=True)
    first_name=models.CharField(max_length=100)
    last_name=models.CharField(max_length=100)
    phone=models.CharField(max_length=20)

    role=models.CharField(max_length=20,choices=ROLE_CHOICES,default='staff')
    is_verified=models.BooleanField(default=False)
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)


    USERNAME_FIELD='email'

    objects=UserManager()

    REQUIRED_FIELDS=['first_name','last_name','phone']
    
    def __str__(self):
        return f"{self.email} ({self.role})"
    

class Business(models.Model):
    owner=models.ForeignKey(User,on_delete=models.CASCADE,related_name='businesses')
    name=models.CharField(max_length=255)
    slug=models.SlugField(max_length=255,unique=True,blank=True)

    industry=models.CharField(max_length=200)
    location=models.CharField(max_length=255,blank=True)


    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Business.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.owner.email}"


class BusinessMember(models.Model):
    ROLE_CHOICES = (
        ("owner", "Owner"),
        ("staff", "Staff"),
    )
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="staff")
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("business", "user")

    def __str__(self):
        return f"{self.user.email} -> {self.business.name} [{self.role}]"



    


