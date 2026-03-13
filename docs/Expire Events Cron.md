# Expire events (daily cron)

Event and RSVP data is deleted 1 week after an event's end. A daily job runs the cleanup. On Heroku:

1. Set a secret: `heroku config:set CRON_SECRET=your-random-secret`
2. In [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler), add a job that runs daily, e.g.:
   ```bash
   curl -X POST https://your-app.herokuapp.com/api/cron/expire-events -H "Authorization: Bearer $CRON_SECRET"
   ```
   In the scheduler dyno, config vars (e.g. `CRON_SECRET`) are in the environment, so the command can use `$CRON_SECRET` if you set it with `heroku config:set CRON_SECRET=...`.
