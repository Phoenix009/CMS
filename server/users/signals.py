from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile


@receiver(post_save, sender=User)
def created_profile(sender, instance, created, **kwargs):
    if created:
        profile_data = instance.pop("profile")
        # create profile
        Profile.objects.get_or_create(
            user=instance,
            gender=profile_data["gender"],
            branch=profile_data["branch"],
            # etc...
        )
        # Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()
