class HamburgerController
  constructor: (hamburgerButton, offScreenNav, closeButton, visibilityClass) ->
    @offScreenNav = offScreenNav
    @visibilityClass = visibilityClass
    @hamburgerButton = hamburgerButton
    @closeButton = closeButton

    hamburgerButton.addEventListener 'click', @hamburgerButtonClicked
    closeButton.addEventListener 'click', @closeButtonClicked
    document.body.addEventListener 'click', @outsideElementClicked
    document.body.addEventListener 'touchstart', @outsideElementClicked

  hamburgerButtonClicked: =>
    @offScreenNav.classList.toggle @visibilityClass

  closeButtonClicked: =>
    @offScreenNav.classList.remove @visibilityClass

  outsideElementClicked: (e) =>
    return if e.target == (@hamburgerButton || @closeButton) || !@offScreenNav.classList.contains(@visibilityClass) || e.target in @hamburgerButton.children
    
    nextParent = e.target
    while nextParent != null
      targetInNav = nextParent == @offScreenNav
      break if targetInNav == true
      nextParent = nextParent.parentElement

    if targetInNav == false
      @closeButtonClicked()

hamburgerButton = document.querySelector '#hamburger-button'
offScreenNav = document.querySelector '#offscreen-nav'
closeButton = document.querySelector '#close-nav-button'
visibilityClass = 'visible'

this.hamAndCheeseBurger = new HamburgerController hamburgerButton, offScreenNav, closeButton, visibilityClass
