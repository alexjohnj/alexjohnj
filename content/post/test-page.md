+++
date = 2014-08-22T16:11:04Z
syntax_highlighting = true
math = true
title = "Test Page"
+++

This page has only one purpose, to demonstrate how different elements look when styled. It's useful for debugging the CSS of the site, especially when combined with [live reload](http://livereload.com/) that automatically refreshes the page when something changes. This page needs to test a few key elements, namely:

- Paragraphs of text
    + Styles of text including emphasised and italicised text
- Headers
- Images
- Blockquotes
- Inline code
- Blocks of code (with [syntax highlighting](https://highlightjs.org))
- Lists (see what I'm doing here?)
- Probably some other stuff too

## A Paragraph of Text

Do you see what I did there? I used a heading to divide two sections of text. I _also_ used it to test what a `<h2>` element looks like. And, in describing what I just did, I also managed to incorporated _italicised_ text and `inline code`. Pretty neat! Inline code is cool and all but we really need to see a block of code (also known as "code poetry").

### Some Code

The block of code that follows is some Python code that draws a [Mandelbrot fractal][mandelbrot-fractal] using Python's [turtle module][python-turtle-module].

[mandelbrot-fractal]: https://en.wikipedia.org/wiki/Mandelbrot_set
[python-turtle-module]: https://docs.python.org/3.4/library/turtle.html

```python
import turtle

def in_mandelbrot_set(z=0, c=0, iteration=0):
    if iteration == 255: return True
    if abs(z) > 2: return False
    else: return in_mandelbrot_set((z**2 + c), c, iteration + 1)

def find_numbers_in_mandel_set(min_re, max_re, min_im, max_im, multiple, live_draw=False):
    ml_set = []

    for im in range(min_im, max_im):
        for re in range(min_re, max_re):
            c = complex(re/multiple, im/multiple)
            if in_mandelbrot_set(c=c): 
                ml_set.append(c)
                if live_draw: plot_complex_number_with_turtle(c)
    return ml_set

def plot_complex_number_with_turtle(c, scale_factor=200):
    turtle.penup()
    turtle.setposition((c.real * scale_factor), (c.imag * scale_factor))
    turtle.pendown()
    turtle.forward(0)

def draw_set_with_turtle(complex_set, scale_factor=50):
    for c in complex_set:
        plot_complex_number(c, scale_factor)

def draw_mandelbrot_set_fractal_with_turtle(detail):
    if detail < 1:
        print("Error: Detail must be an integer >= 1")
        return None

    turtle.speed(0)
    turtle.tracer(100, 0)
    turtle.hideturtle()
    turtle.title("Mandelbrot Plot")
    for i in range(1, detail+1):
        n = 10**i
        find_numbers_in_mandel_set(-3*n, 3*n, -n, n, n, True)
    turtle.getscreen()._root.mainloop()

if __name__ == '__main__':
    draw_mandelbrot_set_fractal_with_turtle(2)
```

That code is very poorly commented and probably doesn't make sense. I wrote it several years ago so please don't ask me to explain it either. Anywho, this is what it produces:

<figure>
    <img src="/images/mandelbrot-test-image.png" alt="The product of mandelbrot-script.py"/>
    <figcaption>The output of the above script.</figcaption>
</figure>

Again, do you see what I did there? I used the code snippet above to "segue" int a new section and test out images that are embedded in a `<figure>` element. This lets me give them a caption and makes them look quite professional. Here's an image that doesn't have a caption:

<div class="full-width-image-wrap">
    <img src="/images/cute-dog-test-image-2.jpeg" alt="A picture of my dog" />
</div> 

Notice how that image takes up the full width of the "paper card". These full width images are all the rage right now. They look quite cool, especially on small screens. They don't look quite as good on bigger screens though. To do this I had to wrap the `<img>` element in a `<div>` element because [blackfriday][blackfriday-github] for some reason wraps `<img>` elements in a `<p>` element. This could have something to do with its **Compatibility** feature:

[blackfriday-github]: https://github.com/russross/blackfriday

> **Compatibility**
>  
> The Markdown v1.0.3 test suite passes with the `--tidy` option. Without `--tidy`, the differences are mostly in whitespace and entity escaping, where blackfriday is more consistent and cleaner.

Hah, another element tested, the `<blockquote>` element.

## Other Things

Moving swiftly onwards, let's take a look at some tables:

| Voltage (V) | Distance (mm) | Time (s) | Velocity (m/s)                | &Delta;V (m/s)                         |
| :---------: | :----:        | :------: | :---------------------------: | :------------------------------------: |
| 183         | 1.5           | 41.148   | 3.65&times;10<sup>-5</sup>    | 1.29&times;10<sup>-6</sup>             |
| 221         | 1.5           | 46.360   | 3.24&times;10<sup>-5</sup>    | 1.13&times;10<sup>-5</sup>             |

That's a fairly small table. It contains some results from an experiment I did in my first year at university. It's quite a famous experiment, the Millikan Oil Drop experiment. Carrying out the experiment allows you to determine the charge of an electro to a high degree of accuracy. It also provides some evidence to support the idea that the charge on a electron is quantised. It's all based on the Stokes' law:

\\[
    F_d = 6 \pi \mu R v
\\]

That should be rendered correctly using _MathJax_.

