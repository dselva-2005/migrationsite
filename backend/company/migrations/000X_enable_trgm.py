from django.contrib.postgres.operations import TrigramExtension
from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ("company", "0007_alter_companymembership_created_at_and_more"),
    ]

    operations = [
        TrigramExtension(),
    ]
