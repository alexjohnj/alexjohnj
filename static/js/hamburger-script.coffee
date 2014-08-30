class HamburgerController
  constructor: (hamburgerButton, offScreenNav, closeButton, visibilityClass) ->
    @offScreenNav = offScreenNav
    @visibilityClass = visibilityClass

    hamburgerButton.addEventListener 'click', @hamburgerButtonClicked
    closeButton.addEventListener 'click', @closeButtonClicked

  hamburgerButtonClicked: =>
    @offScreenNav.classList.toggle @visibilityClass

  closeButtonClicked: =>
    @offScreenNav.classList.remove @visibilityClass

hamburgerButton = document.querySelector '#hamburger-button'
offScreenNav = document.querySelector '#offscreen-nav'
closeButton = document.querySelector '#close-nav-button'
visibilityClass = 'visible'

this.hamAndCheeseBurger = new HamburgerController hamburgerButton, offScreenNav, closeButton, visibilityClass
