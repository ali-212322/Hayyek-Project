from django.db import migrations, models
import django.contrib.auth.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False)),
                ('phone', models.CharField(max_length=20, unique=True)),
                ('full_name', models.CharField(max_length=150)),
                ('email', models.EmailField(blank=True, null=True, unique=True)),
                ('role', models.CharField(choices=[('resident', 'Resident'), ('provider', 'Provider'), ('admin', 'Admin')], default='resident', max_length=20)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_phone_verified', models.BooleanField(default=False)),
                ('is_suspended', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('groups', models.ManyToManyField(blank=True, related_name='customuser_set', to='auth.group')),
                ('user_permissions', models.ManyToManyField(blank=True, related_name='customuser_set', to='auth.permission')),
            ],
            options={'db_table': 'users'},
            managers=[('objects', django.contrib.auth.models.BaseUserManager())],
        ),
    ]
