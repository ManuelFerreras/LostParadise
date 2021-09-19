const progress = document.querySelectorAll('.progress-done');

for (const i in progress) {
    progress[i].style.width = progress[i].getAttribute('data-done') + '%';
    progress[i].style.opacity = 1;
}