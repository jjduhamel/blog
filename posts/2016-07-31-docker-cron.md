---
title: Cron and Docker
author: John Duhamel
---

I finally have something interesting to write about!  For my all-time first blog post, I'm going to explain the how and why of using cron in docker.

## Why am I writing this?

I recently encountered a scenario where I wanted to run a periodic task in docker.  I needed to back up a docker volume to S3 (this site in fact).  The standard tool for running periodic tasks in unix is [cron]().

At first, I was skeptical about the idea of using cron for this.  Cron is one of the oldest unix tools.  It was designed to manage several independent tasks for multiple users.  Furthermore, the crontab syntax always felt arbitrary to me.

Docker simplifies infrastructure by allowing you to run each of your processes inside a lightweight container that's configured for its exact needs.  A container typically consists of a single foreground process and logs are collected through stdout.

By all considerations, cron was not designed with docker in mind.  Cron is a classic tool that serves an important role in computer history.  However, for the way I've configured my infrastructure, it seemed like an awkward fit.

I searched around a little bit and found [a couple alternatives](http://stackoverflow.com/questions/288349/alternative-to-cron).  I took a close look at these.

## Chronos

Chronos is a job scheduler that's supported by Airbnb.  I use the Airbnb [Javascript](https://github.com/airbnb/javascript) and [CSS](https://github.com/airbnb/css) style guides in my projects, and it has an awesome admin page:

![](/images/chronos_ui.png){height=256px}

I really wanted to use Chronos at first.  However, it needs to run on Apache Mesos.  Chronos looks like a great task scheduler, but I was looking for something simple to run inside a docker container.  Therefore, it was back to the drawing board.

## Jobber

The next tool I considered was [Jobber](http://dshearer.github.io/jobber/).  Jobber is written in Go and bills itself a direct replacement to cron.  The introduction states:


> Jobber is a utility for Unix-like systems that can run arbitrary commands, or “jobs”, according to a schedule. It is meant to be a replacement for the classic Unix utility cron.

Whenever I see that something is written in Go I immediately assume it will [play nicely](http://www.slideshare.net/jpetazzo/docker-and-go-why-did-we-decide-to-write-docker-in-go) with Docker.  When I found this, I assumed it would be a good tool right away.

Jobber may in fact be a better tool than cron for what I want to do.  However, in spite of all it's benefits, I ended up deciding against it.  First, I noticed the docs were surprisingly sparse.  I didn't feel like the config syntax was a huge improvement over cron.  The only commonly downloaded [reference Dockerfile](https://hub.docker.com/r/blacklabelops/jobber/~/dockerfile/) was very dense.  I looked at the [Github repository](https://github.com/dshearer/jobber) and realized that it's almost entirely maintained by one person.

I want something that's not going to cause me any pain.  I don't want to spend time debugging issues and corner cases.  As much promise as it has, I just had too many hesitations to move forward with Jobber.

## Cron

Slightly discouraged that both Chronos and Jobber had been DQed, I decided to revisit Cron.  I thought about the reasons I didn't want to use cron in the first place.

![](/images/buddha-happiness.jpg){height=256px}

> **Cron is too large for what I need.**

The main reason to shy away from a large system is that the extra complexity could cause bugs.  Too often bloated software and ends up causing more hassle than it solves.  However, cron is old and battle tested.  It has survived so long because it's well designed.

On examination, I realized it was easy to opt out of the more advanced cron features without creating any extra complexity.  You can create simple crontab files in */etc/cron.d/* that are applied system-wide:

**/etc/cron.d/my-task**

~~~ {.bash}
* * * * * root <task> >> /var/log/cron.log 2>&1
# This line is required.
~~~

It's true that cron is capable of doing much more than I needed, but that doesn't mean it can't solve my problem well.

> **I don't like the crontab syntax.**

I do find the crontab syntax is a little bizzare.  Why can't you run things on sub-minute intervals?  Which environment variables am I supposed to configure?  What's with the required comment at the end of the file?  Where are the crontab files even located?

Idealy, I'd be able to run some cli utility where I could pass scheduling commands directly as parameters.  Why do I even need to write a config file to schedule one task?

After some thought, I decided to settle my beef with the cron syntax.  1 minute is a perfect interval to backup my wiki, it works fine without setting any environment variables, and the only files I care about are located in */etc/cron.d/*.

> **Cron runs as a daemon.**

Yeah... except you can run cron as a foreground process like this:

~~~ {.bash}
$ cron -f
~~~

At this point, I decided to stop making excuses and just use cron.

## Conclusion

So far I've had a reasonably painless experience using cron in my docker containers.  It's a ubiquitous tool, and I'm glad that I can harness all its capabilities in my docker projects now.