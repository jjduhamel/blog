---
title: Building this website
author: John Duhamel
---

Ok, now that my site is up and running, I'd like to make a post about putting it together...

## Motivation

Before embarking on any new project, it's important to reflect on what makes it worthwhile.  Over the past months, I'd periodically felt it would be useful to build this.

In college, I set up a mediawiki server that I hosted from a dusty computer in my closet.  It turned out to be incredibally useful.  Over time, it became my playbook of tricks that I used to get through engineering school.

Over time, my mediawiki server was somehow forgotten.  The LAMP stack became outdated as people moved to new architecures designed for the cloud.  I was busy at my job, and I just couldn't justify the operational burden of managing the server while there was so much else to learn about.  The power went out at my apartment one night, and the server was never turned back on.

I had strong opinions about how to build my new site.  It would need to be unambiguously better than what I had previously.  My new site would be a showcase of the types of systems I have learned to build.  It would need to demonstrate the benefits of being cloud hosted.  Additionally, it would need to have a fluid UI and show attention to detail.  However, I wanted it to feel understated.  In a way, it would need to excuse it own shortcomings.

For months, building this site felt like too much effort.  I wanted to spend the my small amount of time outside of work on other projects.  To name a few, I tried building a system for tracking NCAA statistics and an e-commerce platform for selling drones.  However, none of my projects gained much traction.  I recently revisited my NCAA statistics project, as College Football starts in just a few weeks!  I realized that the thing that was missing in each case was organization.  I realized the tool I was missing was my old wiki.  After some thought, I decided I decided to start the project.

## Requirements

My first task was to define exactly what my new site should do.  The only general requirement I had going in was that it should be unambiguously better than my old site.  What did that even mean?  After some thought, I decided my site should do the following things.

**Cloud Hosted**

Over the past year, I've come to understand the huge benefit of hosting things on the cloud.  Services like AWS provide complete suites for all web-hosting related tasks.  Hosting things on the cloud saves that operator invaluable time to focus on other things.

**Blog**

More and more, I find myself revisiting code that I worked on months ago, and don't have a completely clear memory of how it works.  I frequently wish I had written down some notes that I could go back and reference.

I plan to use this blog for exactly this purpose.  As I work on projects, I'll use this to keep a record of the challenges, decisions, and lessons I encounter.

**Wiki**

Blogs are a nice way to create a narative around your thoughts.  However, it's cumborsome to write a blog post for every little thing to want to record for future reference.

My wiki will be home base for all the little things I want to remember in the future.

**Resume**

To a large extent, this site will be personal advertisement.  The intended audience for this site is myself.  Regardless, people with whom I engage on personaly or professionaly will inevitably discover this site.  This part of the purpose of building this had to be as a means to convey information about myself which I would like other people to know.

**Static Site**

I made a conscious decision that my site would be static.  At work, I do almost everything in Javascript.  Thus, I can do all sorts of neat things to make the content of my sites interactive.  However, doing so takes a lot of time and effort.  Therefore, I think a static site is better suited for this project.

## Stack

**Hakyll**

[Hakyll](https://jaspervdj.be/hakyll/) is a static site builder written in Haskell.  It's inspired by the popular site-builder [Jeckyl](https://jekyllrb.com/), which is written in Ruby.  Hakyll uses Pandoc to convert several data formats (including Markdown and Tex) to HTML, so it's likely to support all my needs in the future.  Furthermore, it supports publishing an RSS feed, which I think would be a neat feature that I'd like to take advantage of in the future.

**Gitit**

[Gitit](http://gitit.net/) is a Haskell-based wiki engine that resembles mediawiki but also uses Pandoc to compile several formats to HTML.  I was never a huge fan of the mediawiki markup language.  It works well, but I'd prefer to write my pages in Markdown.  Gitit makes that possible.

**Elastic Beanstalk**

Deploying Hakyll and Gitit on Docker and Elastic Beanstalk provided a few unexpected challenges.  Both Hakyll and Gitit are heavily file-based, and by default Docker does a poor job of persisting data between deployments.  I'd need to build some extra machinery to ensure my data 

After a few evenings of work, I'm pretty happy with the result.  Here's a diagram:

![](/images/hbpcb-design.png){height=400px}

My entire site is backed up in a private S3 bucket.  This provides reasonable guarantees that my data is safe and will stay online indefinately.

## Conclusion

My site has been running reliably for a few days now.  I'm pretty happy with the result overall.  I think that I chose tools that are well suited for my needs.
