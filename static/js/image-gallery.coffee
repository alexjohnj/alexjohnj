# Created by Alex Jackson, licensed under the MIT license
#
# This script controls a basic image gallery that uses CSS 2D transforms
# Using transforms makes the gallery fast and smooth since it's hardware
# accelerated. This also means it requires a "modern" browser (a.k.a), any
# browser other than IE 8.

class TransformGal
  constructor: (imageSelector, gallerySelector, nextButtonSelector, prevButtonSelector, imageIndicatorSelector) ->
    @currentIndex = 0
    @imageSelector = imageSelector
    @numberOfImages = document.querySelectorAll(imageSelector).length
    @nextButton = document.querySelector nextButtonSelector
    @prevButton = document.querySelector prevButtonSelector
    # Width of this element is used to calculate translateX value
    @imageGalleryElement = document.querySelector gallerySelector
    @imageIndicators = document.querySelectorAll imageIndicatorSelector

  init: (nextButton, prevButton) =>
    # Create the new CSS rule and insert it at the top of the stylesheet
    if document.styleSheets
      document.styleSheets[0].insertRule "#{@imageSelector}{}", 0
      @imageContainerRule = document.styleSheets[0].cssRules[0]

    @nextButton.addEventListener 'click', @moveToNextImage
    @prevButton.addEventListener 'click', @moveToPreviousImage

    # Recalculate translateX distance when the browser is resized to avoid
    # layout issues
    window.addEventListener 'resize', =>
      @setTranslateXProperty @imageContainerRule, -@imageGalleryElement.offsetWidth * @currentIndex

  moveToNextImage: =>
    if @numberOfImages <= @currentIndex + 1
      return

    @setTranslateXProperty @imageContainerRule, -@imageGalleryElement.offsetWidth * (@currentIndex + 1)

    # Update Current Image Indicator
    @imageIndicators[@currentIndex].classList.toggle 'active'
    @imageIndicators[@currentIndex + 1].classList.toggle 'active'

    @currentIndex++

  moveToPreviousImage: =>
    if @currentIndex - 1 < 0
      return

    @setTranslateXProperty @imageContainerRule, -@imageGalleryElement.offsetWidth * (@currentIndex - 1)

    # Update Current Image Indicator
    @imageIndicators[@currentIndex].classList.toggle 'active'
    @imageIndicators[@currentIndex - 1].classList.toggle 'active'

    @currentIndex--

  setTranslateXProperty: (rule, distance) ->
    rule.style.setProperty 'transform', "translateX(#{distance}px)", 'important'
    rule.style.setProperty '-ms-transform', "translateX(#{distance}px)", 'important'
    rule.style.setProperty '-moz-transform', "translateX(#{distance}px)", 'important'
    rule.style.setProperty '-webkit-transform', "translateX(#{distance}px)", 'important'


this.transformGal = new TransformGal('.image-carousel-thing > .image-container',
                                    '.image-carousel-thing',
                                    '#next-image-button',
                                    '#prev-image-button',
                                    '.image-gallery-indicator'
                                    )
transformGal.init()