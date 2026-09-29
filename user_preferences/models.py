from django.db import models
from accounts.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Reading Need Profiles
    READING_NEED_CHOICES = [
        ('general', 'General / Optimized Reading'),
        ('dyslexia', 'Dyslexia / Reading Difficulty'),
        ('adhd', 'ADHD / Focus Issues'),
        ('visual', 'Visual Impairment / Sensitive Eyes'),
    ]
    reading_need = models.CharField(
        max_length=20,
        choices=READING_NEED_CHOICES,
        default='general',
        help_text="The user's primary cognitive or visual reading need."
    )

    def __str__(self):
        return f"{self.user.email} - {self.get_reading_need_display()}"
