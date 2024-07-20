// Select all elements with the "i" tag and store them in a NodeList called "stars"
const stars = document.querySelectorAll(".stars i");
const ratingInput = document.getElementById("ratingInput");

// Loop through the "stars" NodeList
stars.forEach((star, index1) => {
  // Add an event listener that runs a function when the "click" event is triggered
  star.addEventListener("click", () => {
    // Loop through the "stars" NodeList Again
    stars.forEach((star, index2) => {
      // Add the "active" class to the clicked star and any stars with a lower index
      // and remove the "active" class from any stars with a higher index
      index1 >= index2
        ? star.classList.add("active")
        : star.classList.remove("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById("submitBtn");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const errorContainer = document.getElementById("errorContainer");

  submitBtn.addEventListener("click", async function () {
    const ratings = document.querySelectorAll(".fa-solid.fa-star").length;
    const experience = document.getElementById("experience").value;
    const suggestions = document.getElementById("improvements").value;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      var order = urlParams.get("order");

      const response = await fetch("/feedback/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order, ratings, experience, suggestions }),
      });

      var data = {};
      try {
        data = await response.json();
      } catch (err) {
        try {
          data = await response.text();
          document.body = data;
          return; 
        } catch (err) {
          data = {};
        }
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      if (response.status === 200) {
        window.location.href = `/feedback/thanks/?id=${data.id}`;
      }
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      errorContainer.style.display = "block";
      errorContainer.textContent =
        error.message || "Failed to submit feedback. Please try again later.";
    }
  });
});
