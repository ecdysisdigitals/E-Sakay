document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    // Toggle the menu when the hamburger icon is clicked
    menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        navLinks.classList.toggle("active");
    });

    // Close the menu when clicking outside of it
    document.addEventListener("click", (event) => {
        if (
            navLinks.classList.contains("active") &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            navLinks.classList.remove("active");
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll(".nav-links a").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            if (window.innerWidth <= 768) {
                navLinks.classList.remove("active");
            }
        });
    });

    // Show 'Pasahero' content by default
    showContent("Pasahero");

    // Search functionality
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const contents = document.querySelectorAll(".hidden-content");

    function performSearch() {
        console.log("Performing search...");
        const query = searchInput.value.trim().toLowerCase();
        let firstMatch = null;
        let hasMatch = false; 

        contents.forEach(content => {
            const originalText = content.getAttribute("data-original-text") || content.innerHTML;
            content.setAttribute("data-original-text", originalText);

            const lowerText = originalText.toLowerCase();

            if (query && lowerText.includes(query)) {
                content.style.display = "block";
                content.classList.add("active");
                hasMatch = true;

                // Highlight matched text
                const highlightedText = originalText.replace(new RegExp(`(${query})`, "gi"), match =>
                    `<span class="highlight">${match}</span>`
                );
                content.innerHTML = highlightedText;

                // Store first match for scrolling
                if (!firstMatch) {
                    firstMatch = content;
                }

                // Show parent section if exists
                let parentSection = content.closest(".section-container");
                if (parentSection) {
                    parentSection.style.display = "block";
                }
            } else {
                content.style.display = "none";
                content.classList.remove("active");
                content.innerHTML = originalText;
            }
        });

        // Scroll to first match
        if (firstMatch) {
            setTimeout(() => {
                firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300);
        }

        // If no match, reset to default view
        if (!hasMatch) {
            showContent("Pasahero");
        }
    }

    // Trigger search on button click
    searchButton.addEventListener("click", performSearch);

    // Trigger search on "Enter" key press
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });
});

// Function to show a specific content section
function showContent(contentId) {
    console.log(`Showing content: ${contentId}`);
    const buttons = document.querySelectorAll(".button-container button");
    buttons.forEach(button => {
        button.classList.remove("active");
        button.setAttribute("aria-expanded", "false");
    });

    const contents = document.querySelectorAll(".hidden-content");
    contents.forEach(content => {
        content.style.display = "none";
        content.classList.remove("active");
    });

    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        setTimeout(() => {
            selectedContent.style.display = "block";
            selectedContent.classList.add("active");
        }, 10);

        selectedContent.scrollIntoView({ behavior: "smooth" });
    }

    const clickedButton = document.querySelector(`.button-container button[onclick="showContent('${contentId}')"]`);
    if (clickedButton) {
        clickedButton.classList.add("active");
        clickedButton.setAttribute("aria-expanded", "true");
    }
}

