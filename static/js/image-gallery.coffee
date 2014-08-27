class TransformGal
  constructor: (imageSelector, gallerySelector, nextButtonSelector, prevButtonSelector) ->
    @currentIndex = 0
    @imageSelector = imageSelector
    @numberOfImages = document.querySelectorAll(imageSelector).length
    @nextButton = document.querySelector nextButtonSelector
    @prevButton = document.querySelector prevButtonSelector
    # Width of this element is used to calculate translateX value
    @imageGalleryElement = document.querySelector gallerySelector

  init: (nextButton, prevButton) =>
    # Create the new CSS rule and insert it at the top of the stylesheet
    if document.styleSheets
      document.styleSheets[0].insertRule "#{@imageSelector}{}", 0
      @imageContainerRule = document.styleSheets[0].cssRules[0]

    @nextButton.addEventListener 'click', @moveToNextImage
    @prevButton.addEventListener 'click', @moveToPreviousImage

  moveToNextImage: =>
    if @numberOfImages <= @currentIndex + 1
      return

    @setTranslateXProperty @imageContainerRule, -@imageGalleryElement.offsetWidth * (@currentIndex + 1)
    @currentIndex++

  moveToPreviousImage: =>
    if @currentIndex - 1 < 0
      return

    @setTranslateXProperty @imageContainerRule, -@imageGalleryElement.offsetWidth * (@currentIndex - 1)
    @currentIndex--

  setTranslateXProperty: (rule, distance) ->
    rule.style.setProperty 'transform', "translateX(#{distance}px)", 'important'
    rule.style.setProperty '-ms-transform', "translateX(#{distance}px)", 'important'
    rule.style.setProperty '-moz-transform', "translateX(#{distance}px)", 'important'
    rule.style.setProperty '-webkit-transform', "translateX(#{distance}px)", 'important'


this.transformGal = new TransformGal('.image-carousel-thing > .image-container',
                                    '.image-carousel-thing',
                                    '#next-image-button',
                                    '#prev-image-button')
transformGal.init()