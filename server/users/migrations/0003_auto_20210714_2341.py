# Generated by Django 3.0.4 on 2021-07-14 18:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_branch_region'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='branch',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.Branch'),
        ),
        migrations.AddField(
            model_name='profile',
            name='gender',
            field=models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], default='male', max_length=6, unique=True),
            preserve_default=False,
        ),
    ]
