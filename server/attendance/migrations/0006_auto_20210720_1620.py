# Generated by Django 3.0.4 on 2021-07-20 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0005_auto_20210719_1756'),
    ]

    operations = [
        migrations.AddField(
            model_name='trip',
            name='custodian_1_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name='trip',
            name='custodian_2_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name='trip',
            name='custodian_3_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]
