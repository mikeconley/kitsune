# Generated by Django 4.1.7 on 2023-04-18 13:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    replaces = [("kpi", "0001_initial"), ("kpi", "0002_cohort_retention_models")]

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="MetricKind",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("code", models.CharField(max_length=255, unique=True)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Metric",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("start", models.DateField()),
                ("end", models.DateField()),
                ("value", models.PositiveIntegerField()),
                (
                    "kind",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="kpi.metrickind"
                    ),
                ),
            ],
            options={
                "unique_together": {("kind", "start", "end")},
            },
        ),
        migrations.CreateModel(
            name="Cohort",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("start", models.DateField()),
                ("end", models.DateField()),
                ("size", models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="CohortKind",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("code", models.CharField(max_length=255, unique=True)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="RetentionMetric",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("start", models.DateField()),
                ("end", models.DateField()),
                ("size", models.PositiveIntegerField(default=0)),
                (
                    "cohort",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="retention_metrics",
                        to="kpi.cohort",
                    ),
                ),
            ],
            options={
                "unique_together": {("cohort", "start", "end")},
            },
        ),
        migrations.AddField(
            model_name="cohort",
            name="kind",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="kpi.cohortkind"
            ),
        ),
        migrations.AlterUniqueTogether(
            name="cohort",
            unique_together={("kind", "start", "end")},
        ),
    ]
