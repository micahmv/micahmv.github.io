document.addEventListener("DOMContentLoaded", function() {
    // Function to set up random link for an element when clicked
    function randLink(event) {
        var clickedElement = event.target;

        // Get the list of links from a custom data attribute (data-links)
        var links = JSON.parse(clickedElement.getAttribute("data-links"));

        // Generate a random index to pick a link from the list
        var rand = Math.floor(Math.random() * links.length);

        // Update the href attribute of the clicked element
        clickedElement.href = links[rand];
    }

    // Attach the click event listener to all elements with the 'greenable' class
    document.querySelectorAll(".greenable").forEach(function(element) {
        element.addEventListener("click", randLink);
    });
});