class TransformGal
  constructor: ->
    @currentIndex = 0
    @imageContainers = document.querySelectorAll('.image-carousel-thing > .image-container')
    @paperCard = document.querySelector('article.paper-card')

  init: ->
    nextButton = document.querySelector 'button#next-screenshot'
    prevButton = document.querySelector 'button#prev-screenshot'

    nextButton.addEventListener 'click', @moveToNextImage
    prevButton.addEventListener 'click', @moveToPreviousImage

  moveToNextImage: =>
    if @imageContainers.length <= @currentIndex + 1
      return
    @imageContainers[@currentIndex].style.transform = "translateX(#{-@paperCard.offsetWidth * (@currentIndex + 1)}px"
    @imageContainers[@currentIndex + 1].style.transform = "translateX(#{-@paperCard.offsetWidth * (@currentIndex + 1)}px"

    @currentIndex++

  moveToPreviousImage: =>
    if @currentIndex - 1 < 0
      return
    @imageContainers[@currentIndex].style.transform = "translateX(0px)"
    @imageContainers[@currentIndex - 1].style.transform = "translateX(#{-@paperCard.offsetWidth * (@currentIndex - 1)}px"

    @currentIndex--

this.transformGal = new TransformGal
transformGal.init()
