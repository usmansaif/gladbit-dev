document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("exitPopup");
    const closeBtn = document.getElementById("closePopup");

    // === EXIT INTENT POPUP ===
    document.addEventListener("mouseleave", function (e) {
        if (e.clientY <= 0) {
            popup.style.display = "flex";
        }
    });

    // Close button
    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });

    // Close on background click
    popup.addEventListener("click", function (e) {
        if (e.target.id === "exitPopup") {
            popup.style.display = "none";
        }
    });

    // === TAB TITLE TOGGLER ===
    const originalTitle = document.title;
    let blinkInterval;

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            // Start blinking when tab not visible
            let showAlt = false;
            blinkInterval = setInterval(() => {
                document.title = showAlt
                    ? "👋 Still here? Book your free call!"
                    : originalTitle;
                showAlt = !showAlt;
            }, 2000); // change every 2 seconds
        } else {
            // Restore when user comes back
            clearInterval(blinkInterval);
            document.title = originalTitle;
        }
    });
});
