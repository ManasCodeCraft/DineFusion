// Get all feedback entries
const feedbackEntries = document.querySelectorAll(".feedback-entry");

// Loop through each feedback entry
feedbackEntries.forEach((entry) => {
  // Get the rating value from the entry
  const ratingValue = parseFloat(
    entry.querySelector(".rating-value").textContent
  );

  // Get all star icons within the entry
  const stars = entry.querySelectorAll(".fa-star");

  // Loop through each star icon
  stars.forEach((star, index) => {
    // If the current star index is less than the rating value, fill it with color
    if (index < ratingValue) {
      star.style.color = "#ff9c1a"; // Change color to your desired color
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  renderAllFeedback();
});

async function renderAllFeedback() {
  try {
    const feedbackContainer = document.querySelector(".feedback-container .body-2");
    feedbackContainer.innerHTML = ""; // Clear existing feedback

    const feedbackData = await fetchAllFeedback();
    feedbackData.forEach((feedback) => {
      const feedbackEntry = createFeedbackEntry(feedback);
      feedbackContainer.appendChild(feedbackEntry);
    });
  } catch (error) {
    console.error('Error rendering feedback:', error);
  }
}

async function fetchAllFeedback() {
  try {
    const response = await fetch('/feedback/fetchallfeedback');
    if (!response.ok) {
      throw new Error('Failed to fetch feedback data');
    }
    const data = await response.json();
    return data.feedback;
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    return [];
  }
}

function createFeedbackEntry(feedback) {
  const feedbackEntry = document.createElement("div");
  feedbackEntry.classList.add("feedback-entry");

  const userInfo = document.createElement("div");
  userInfo.classList.add("user-info");
  userInfo.innerHTML = `<span class="user-name">USER: ${feedback.user}</span>`;
  feedbackEntry.appendChild(userInfo);

  const feedbackDetails = document.createElement("div");
  feedbackDetails.classList.add("feedback-details");
  feedbackDetails.innerHTML = `
    <span class="order-details"><b>Order-Details:</b> ${feedback.orderDetails}</span>
    <div class="feedback-message">
      <div class="feedback-experience"><span><b>User Experience:</b> ${feedback.experience}</span></div>
      <div class="feedback-improvements"><span><b>Improvement:</b> ${feedback.suggestions}</span></div>
    </div>
    <div class="rating">
      <span class="stars">${getStarsHTML(feedback.ratings)}</span>
      <span class="rating-value">${feedback.ratings}/5</span>
    </div>
  `;
  feedbackEntry.appendChild(feedbackDetails);

  return feedbackEntry;
}

function getStarsHTML(rating) {
  const filledStars = '<i class="fa-solid fa-star"></i>'.repeat(rating);
  const emptyStars = '<i class="fa-regular fa-star"></i>'.repeat(5 - rating);
  return filledStars + emptyStars;
}

