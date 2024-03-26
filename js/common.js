const date = new Date();
let year = date.getFullYear();
document.getElementById("copyDate").innerHTML = year;
const button = document.querySelector(".btntop");

const displayButton = () => {
    window.addEventListener("scroll", () => {
        console.log(window.scrollY);

        if (window.scrollY > 100) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    });
};

const scrollToTop = () => {
    button.addEventListener("click", () => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
        console.log(event);
    });
};

displayButton();
scrollToTop();
