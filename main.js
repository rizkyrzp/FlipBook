const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");
const paper3 = document.querySelector("#p3");
const paper4 = document.querySelector("#p4");
const paper5 = document.querySelector("#p5");

const papers = [paper1, paper2, paper3, paper4, paper5];

// Event Listeners
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

// Enhanced drag functionality
let isDragging = false;
let dragStartX = 0;
let currentPaper = null;

// Add drag events to each paper
papers.forEach((paper, index) => {
    paper.addEventListener('mousedown', startDrag);
    paper.addEventListener('touchstart', startDrag);
});

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function startDrag(e) {
    isDragging = true;
    currentPaper = e.currentTarget;
    dragStartX = e.clientX || e.touches[0].clientX;
    currentPaper.classList.add('dragging');

    // Prevent default to avoid text selection
    e.preventDefault();
}

function drag(e) {
    if (!isDragging || !currentPaper) return;

    const currentX = e.clientX || e.touches[0].clientX;
    const deltaX = currentX - dragStartX;
    const maxDrag = 150;

    // Calculate flip angle based on drag distance
    const flipAngle = Math.min(Math.max(deltaX / maxDrag * 180, -180), 0);

    currentPaper.style.setProperty('--flip-angle', `${flipAngle}deg`);
    currentPaper.classList.add('partial-flip');
}

function endDrag(e) {
    if (!isDragging || !currentPaper) return;

    const currentX = e.clientX || e.changedTouches?.[0]?.clientX || dragStartX;
    const deltaX = currentX - dragStartX;

    // If dragged enough, flip the page
    if (deltaX < -50 && currentLocation < maxLocation) {
        goNextPage();
    } else if (deltaX > 50 && currentLocation > 1) {
        goPrevPage();
    }

    // Reset drag state
    currentPaper.classList.remove('dragging', 'partial-flip');
    currentPaper.style.removeProperty('--flip-angle');

    isDragging = false;
    currentPaper = null;
}

// Business Logic
let currentLocation = 1;
let numOfPapers = 5;
let maxLocation = numOfPapers + 1;

function openBook() {
    book.style.transform = "translateX(50%)";
    prevBtn.style.transform = "translateX(-180px)";
    nextBtn.style.transform = "translateX(180px)";
    // Show all papers when book is opened
    papers.forEach(paper => {
        paper.style.display = 'block';
    });
}

function closeBook(isAtBeginning) {
    if (isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
        // Hide all papers when book is closed at the end
        papers.forEach(paper => {
            paper.style.display = 'none';
        });
        // Only show the last paper (back cover)
        paper5.style.display = 'block';
    }

    prevBtn.style.transform = "translateX(0px)";
    nextBtn.style.transform = "translateX(0px)";
}

function goNextPage() {
    if (currentLocation < maxLocation) {
        switch (currentLocation) {
            case 1:
                openBook();
                paper1.classList.add("flipped");
                paper1.style.zIndex = 1;
                break;
            case 2:
                paper2.classList.add("flipped");
                paper2.style.zIndex = 2;
                break;
            case 3:
                paper3.classList.add("flipped");
                paper3.style.zIndex = 3;
                break;
            case 4:
                paper4.classList.add("flipped");
                paper4.style.zIndex = 4;
                break;
            case 5:
                paper5.classList.add("flipped");
                paper5.style.zIndex = 5;
                closeBook(false);
                break;
            default:
                throw new Error("unknown state");
        }
        currentLocation++;
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        switch (currentLocation) {
            case 2:
                closeBook(true);
                paper1.classList.remove("flipped");
                paper1.style.zIndex = 5;
                break;
            case 3:
                paper2.classList.remove("flipped");
                paper2.style.zIndex = 4;
                break;
            case 4:
                paper3.classList.remove("flipped");
                paper3.style.zIndex = 3;
                break;
            case 5:
                paper4.classList.remove("flipped");
                paper4.style.zIndex = 2;
                break;
            case 6:
                openBook();
                paper5.classList.remove("flipped");
                paper5.style.zIndex = 1;
                // Show all papers when coming back from closed state
                papers.forEach(paper => {
                    paper.style.display = 'block';
                });
                break;
            default:
                throw new Error("unknown state");
        }
        currentLocation--;
    }
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        goPrevPage();
    } else if (e.key === 'ArrowRight') {
        goNextPage();
    }
});

// Add smooth page indicator
function updatePageIndicator() {
    // You can add page indicators here if needed
}

// Enhanced visual feedback
papers.forEach(paper => {
    paper.addEventListener('mouseenter', () => {
        if (!isDragging) {
            paper.style.transform = 'scale(1.02)';
        }
    });

    paper.addEventListener('mouseleave', () => {
        if (!isDragging) {
            paper.style.transform = 'scale(1)';
        }
    });
});