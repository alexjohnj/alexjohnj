// Created by Alex Jackson on 2014-08-26
// MIT License

var currentIndex = 0;
var imageContainers = document.querySelectorAll('.image-carousel-thing > .image-container')
var paperCard = document.querySelector('article.paper-card')

initGallery = function() {
  nextButton = document.querySelector('button#next-screenshot');
  prevButton = document.querySelector('button#prev-screenshot');
  nextButton.addEventListener('click', function (){
    advanceGallery();
  });
  prevButton.addEventListener('click', function() {
    retreatGallery();
  });
}

advanceGallery = function() {
  if (imageContainers.length <= currentIndex + 1) {
    return;
  }

  imageContainers[currentIndex].style.transform = "translateX(" + ((-paperCard.offsetWidth) * (currentIndex + 1)) + "px)";
  imageContainers[currentIndex + 1].style.transform = "translateX(" + ((-paperCard.offsetWidth) * (currentIndex + 1)) + "px)";
  currentIndex++;
}

retreatGallery = function() {
  if (currentIndex - 1 < 0) {
    return;
  }

  imageContainers[currentIndex].style.transform = "translateX(0px)";
  imageContainers[currentIndex - 1].style.transform = "translateX(" + ((-paperCard.offsetWidth) * (currentIndex-1)) + "px)";
  currentIndex--;
}

initGallery();
