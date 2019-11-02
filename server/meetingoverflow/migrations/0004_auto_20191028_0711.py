# Generated by Django 2.1.7 on 2019-10-28 07:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('meetingoverflow', '0003_auto_20191026_1752'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='agenda',
            name='note_id',
        ),
        migrations.RemoveField(
            model_name='agenda',
            name='parent_agenda_id',
        ),
        migrations.RemoveField(
            model_name='calendar',
            name='note_id',
        ),
        migrations.RemoveField(
            model_name='calendar',
            name='parent_agenda_id',
        ),
        migrations.RemoveField(
            model_name='file',
            name='note_id',
        ),
        migrations.RemoveField(
            model_name='file',
            name='parent_agenda_id',
        ),
        migrations.RemoveField(
            model_name='image',
            name='note_id',
        ),
        migrations.RemoveField(
            model_name='image',
            name='parent_agenda_id',
        ),
        migrations.RemoveField(
            model_name='table',
            name='note_id',
        ),
        migrations.RemoveField(
            model_name='table',
            name='parent_agenda_id',
        ),
        migrations.RemoveField(
            model_name='textblock',
            name='note_id',
        ),
        migrations.RemoveField(
            model_name='textblock',
            name='parent_agenda_id',
        ),
        migrations.RemoveField(
            model_name='todo',
            name='note_id',
        ),
        migrations.RemoveField(
            model_name='todo',
            name='parent_agenda_id',
        ),
        migrations.RemoveField(
            model_name='workspace',
            name='notes',
        ),
        migrations.AddField(
            model_name='agenda',
            name='note',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='meetingoverflow.Note'),
        ),
        migrations.AddField(
            model_name='agenda',
            name='parent_agenda',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='meetingoverflow.Agenda'),
        ),
        migrations.AddField(
            model_name='calendar',
            name='note',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='meetingoverflow.Note'),
        ),
        migrations.AddField(
            model_name='calendar',
            name='parent_agenda',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='meetingoverflow.Agenda'),
        ),
        migrations.AddField(
            model_name='file',
            name='note',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='meetingoverflow.Note'),
        ),
        migrations.AddField(
            model_name='file',
            name='parent_agenda',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='meetingoverflow.Agenda'),
        ),
        migrations.AddField(
            model_name='image',
            name='note',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='meetingoverflow.Note'),
        ),
        migrations.AddField(
            model_name='image',
            name='parent_agenda',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='meetingoverflow.Agenda'),
        ),
        migrations.AddField(
            model_name='note',
            name='workspace',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='meetingoverflow.Workspace'),
        ),
        migrations.AddField(
            model_name='table',
            name='note',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='meetingoverflow.Note'),
        ),
        migrations.AddField(
            model_name='table',
            name='parent_agenda',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='meetingoverflow.Agenda'),
        ),
        migrations.AddField(
            model_name='textblock',
            name='note',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='meetingoverflow.Note'),
        ),
        migrations.AddField(
            model_name='textblock',
            name='parent_agenda',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='meetingoverflow.Agenda'),
        ),
        migrations.AddField(
            model_name='todo',
            name='note',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='meetingoverflow.Note'),
        ),
        migrations.AddField(
            model_name='todo',
            name='parent_agenda',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='meetingoverflow.Agenda'),
        ),
        migrations.AddField(
            model_name='todo',
            name='workspace',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='meetingoverflow.Workspace'),
        ),
    ]