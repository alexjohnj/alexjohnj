+++
title = "New Design, New Tools, New Everything"
date = "2014-09-01T21:43:00+01:00"
+++

I've spent the past week working on a new design for this site which _should_ be live right now. The site wasn't in desperate need for a redesign to begin with but I wanted to try out some new tools and figured a redesign was the best way to do it.

The new design is "inspired" by Google's [Material Design UI][material-design-ui]. I've sprinkled plenty of shadows and animations throughout the site to give it a sense of depth and fluidity. If you get chance, check out one of the [projects][projects-page] with screenshots. The screenshot gallery is built with vanilla JavaScript and all the animations are done with CSS 2D transforms so they run at 60FPS even on low end devices.

[material-design-ui]: http://www.google.com/design/
[projects-page]: /projects/

## Hugo

While the new design is interesting and all, the really interesting things with this redesign are the new tools being used. First up, the site is no longer built with [Jekyll][jekyll-link] instead using [Hugo][hugo-spf13]. Hugo is a relatively new static site generator that is written in Go---one of my favourite programming languages. The biggest advantage Hugo has over Jekyll is its speed. It's crazy fast compared to Jekyll and I _love_ this. The site builds nearly instantly which is great for development when combined with [LiveReload][livereload-page], which, may I add, comes built into Hugo.

[jekyll-link]: jekyllrb.com
[hugo-spf13]: http://hugo.spf13.com
[livereload-page]: http://livereload.com/

Hugo also offers a more flexible way of organising content than Jekyll. Jekyll pretty much assumes you're working with content for a blog while Hugo assumes that the way you lay out your source content is how you want your site to be. This is awesome and really makes me want to move [Geography AS Notes][gas-project-page] over to Hugo so I can stop doing some weird organisation techniques with the content.

[gas-project-page]: /projects/geographyas/

Unfortunately, Hugo is still young and is missing a few features that Jekyll has. This hasn't been much of a problem with this site but it is stopping me from moving Geography AS Notes over to it. One very simple feature that is missing is the ability to get the next/previous piece of content _of a certain type_. Hugo currently provides the `{{ .Next }}` and `{{ .Prev }}` template variables for the next/previous piece of content but they ignore the type of the content (for example mixing blog posts with project pages) and there's no way to specify the sorting that determines what the next/previous content is.

Other issues I ran into include a lack of plugin support (Hugo has "shortcodes" which are similar to Jekyll's custom liquid filters but can't run external commands), a lack of an asset pipeline and a pretty bare bones `{{ .Summary }}` variable for generating post summaries. The generated summaries are processed by Markdown but the resulting HTML is stripped leaving a blob of plaintext. 

Despite these shortcomings, I still love Hugo. It's fast, it's stable and it has, in my opinion, a superior way of organising content. I've been watching the project on GitHub for the past couple of weeks and it's very active so I have a lot of hope for the future of this project. I'll definitely be using Hugo for new projects going forwards. 

## Gulp.js

Another new tool I got to play around with was [gulp.js][gulp-js-site]. Gulp is a task runner written in JavaScript that proved to be super useful in working around Hugo's lack of an asset pipeline. Initially I didn't want to use Gulp and instead wanted to use Make as a task runner, my main reason being the Node.js dependency. Ten minutes of trying to figure out Make's syntax though and I gave Gulp a go. 

[gulp-js-site]: http://gulpjs.com/

I'm pretty happy with the result. Despite being (almost) illiterate when it comes to JavaScipt[^1], writing tasks in a Gulpfile wasn't too hard. The biggest challenge was wrapping my head around the concurrency system Gulp uses. By default tasks are run concurrently so it's important to specify task dependencies to make sure things run in the right order. After rewriting my Gulpfile a few times the concurrency issues were fixed and things seemed to just work.

Gulp and Hugo seem to work quite well together. Using Gulp I can recompile CoffeeScript and SASS files when they change. This, in turn, makes Hugo regenerate the site (did I mention it does this quickly?) and then the site automatically reloads in the browser. Brilliant.

## Autoprefixer

[Autoprefixer][autoprefixer-gh] is a useful little Node.js utility that automatically adds vendor prefixes to experimental CSS properties. It works nicely with gulp.js and helped make my SASS files cleaner. It also made development a little faster since I didn't have to spend time looking up which properties require vendor prefixes and which don't. Autoprefixer makes life easier, there's not much else to say about it.

[autoprefixer-gh]: https://github.com/postcss/autoprefixer

## Open Source

Because this site is built using Hugo and because Hugo is still quite a young project, I've decided to put the source for the site [up on GitHub][site-repo]. Previously I kept it in a private repository but I think it's for the greater good to make the source publicly available as a potential learning resource for people new to Hugo. Just a small point, the repository was private in the past and I may have been a bit neglectful when it came to commit messages. Don't judge. 

[site-repo]: https://github.com/alexjohnj/alexjohnj

[^1]: I can read and write JavaScript it's just I don't do it often enough to remember the syntax and when I do write it, I prefer to use CoffeeScript.
