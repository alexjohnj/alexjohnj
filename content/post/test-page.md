+++
date = 2014-08-22T16:11:04Z
syntax_highlighting = true
title = "Test Page"
+++

# This is a Test Page

The idea of this page is to show what different elements of the site will look like. For example, this is a short paragraph.

## This is a h2 element

### This a h3 element

#### This is a h4 element

##### This is a h5 element

Do people ever really use `<h5>` elements? Oh hey, that was some _inline code_. **OH** and there's some italicised and bolded text.

Here comes a really long piece of text, the infamous lorem ipsum:

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.

Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis. Quisque mi metus, ornare sit amet fermentum et, tincidunt et orci. Fusce eget orci a orci congue vestibulum. Ut dolor diam, elementum et vestibulum eu, porttitor vel elit. Curabitur venenatis pulvinar tellus gravida ornare. Sed et erat faucibus nunc euismod ultricies ut id justo. Nullam cursus suscipit nisi, et ultrices justo sodales nec. Fusce venenatis facilisis lectus ac semper. Aliquam at massa ipsum. Quisque bibendum purus convallis nulla ultrices ultricies. Nullam aliquam, mi eu aliquam tincidunt, purus velit laoreet tortor, viverra pretium nisi quam vitae mi. Fusce vel volutpat elit. Nam sagittis nisi dui.

Lets see how part of the next pargraph looks when used in a `<blockquote>`:

> Suspendisse lectus leo, consectetur in tempor sit amet, placerat quis neque. Etiam luctus porttitor lorem, sed suscipit est rutrum non. Curabitur lobortis nisl a enim congue semper. Aenean commodo ultrices imperdiet. Vestibulum ut justo vel sapien venenatis tincidunt. Phasellus eget dolor sit amet ipsum dapibus condimentum vitae quis lectus.


So much boring text, let's see a cute picture of my dog:

![An image of my dog](/images/cute-dog-test-image-2.jpeg)

Let's try out a block of code. Here's a snippet of code that helps find numbers in the Mandelbrot set:

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



