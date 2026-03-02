const form = document.getElementById('portfolioForm');
const result = document.getElementById('result');
const portfolioLink = document.getElementById('portfolioLink');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch('/api/portfolio', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate portfolio.');
    }

    const absoluteLink = `${window.location.origin}${data.link}`;
    portfolioLink.innerHTML = `Open your website: <a href="${data.link}" target="_blank" rel="noopener noreferrer">${absoluteLink}</a>`;
    result.classList.remove('hidden');
    form.reset();
  } catch (error) {
    result.classList.remove('hidden');
    portfolioLink.textContent = error.message;
  }
});