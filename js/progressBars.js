const progress = document.querySelectorAll('.progress-done');

for (var i = 0; i < progress.length; progress) {
    progress[i].style.opacity = 1;

    function move() {
        var width = 0;
        
        var id = setInterval(frame, 1000);
        function frame() {
          if (width == progress[i].style.width) {
            clearInterval(id);
          } else {
            width++;
            progress[i].style.width = width + '%';
          }
        }
      }
}

