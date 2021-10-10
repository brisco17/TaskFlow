from django.db import models

# Create your models here.
<<<<<<< HEAD
# class for user management
class AccountManager(BaseUserManager):
    # method to create a user
    def create_user(self, user, email, fullname, uname, pwd):
        # all fields are required
        if not email:
            raise ValueError('Users must provide an email address')
        if not fullname:
            raise ValueError('Users must provide name')
        if not uname:
            raise ValueError('Users must provide username')
        if not pwd:
            raise ValueError('Users must provide password')
        
        # fill out user model
        user.email = email
        user.name = fullname
        user.username = uname
        user.set_password(pwd)
        user.save()
        return user

# class for user
class User(AbstractBaseUser):
    email = models.EmailField(verbose_name = "email", max_length = 60, 
    unique = True, blank = True, null = True)
    name = models.CharField(max_length = 60, blank = True, null = True)
    username = models.CharField(max_length = 30, blank = True, null = True)

    is_admin = models.BooleanField(default = False)
    is_active = models.BooleanField(default = False)
    is_superuser = models.BooleanField(default = False)
    
    objects = AccountManager()

    class Meta:
        db_table = "tbl_users"

    def __str__(self):
        return str(self.email)
    
    def has_perm (self, perm, obj=None): 
        return self.is_superuser

    def has_module_perm (self, perm, obj=None): 
        return self.is_superuser

class RegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "name",
            "email",
            "username",
            "password",
        ]
        
        extra_kwargs = {"password" : {"write_only" : True}}

        def create(self, data):
            account = User(email=data['email'],
            username=data['username'])
            password = self.data["password"]
            account.set_password(password)
            account.save()
            return account


class Task(models.Model):
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=100)
    creation_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    completion_date = models.DateField(blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return "{} - {}".format(self.title,self.due_date,self.completed)
=======
>>>>>>> #34-registration-endpoint
