const form = document.getElementById('portfolio-form');
const card = document.getElementById('card');
const randomizeButton = document.getElementById('randomize');

const fields = {
  name: document.getElementById('name'),
  title: document.getElementById('title'),
  bio: document.getElementById('bio'),
  skill: document.getElementById('skill'),
  accent: document.getElementById('accent'),
};

const preview = {
  name: document.getElementById('preview-name'),
  title: document.getElementById('preview-title'),
  bio: document.getElementById('preview-bio'),
  skill: document.getElementById('preview-skill'),
};

const presets = [
  {
    name: 'Mina Solaris',
    title: 'Creative Frontend Engineer',
    bio: 'I design joyful web interactions with rich motion and clean, accessible UI systems.',
    skill: 'Three.js',
    accent: '#ff6ba2',
  },
  {
    name: 'Leo Vertex',
    title: 'Immersive Experience Builder',
    bio: 'From concept to deployment, I shape products that feel futuristic and human at once.',
    skill: 'GSAP',
    accent: '#4ad7b5',
  },
  {
    name: 'Aria Flux',
    title: 'Digital Art Director',
    bio: 'I blend storytelling, typography, and real-time effects into premium brand experiences.',
    skill: 'WebGL Shaders',
    accent: '#7288ff',
  },
];

function applyAccent(accent) {
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.setProperty('--accent-soft', `${accent}66`);
  card.style.borderColor = `${accent}88`;
  card.style.boxShadow = `0 26px 60px ${accent}40`;
}

function generatePortfolio() {
  preview.name.textContent = fields.name.value || 'Your Name';
  preview.title.textContent = fields.title.value || 'Your Title';
  preview.bio.textContent = fields.bio.value || 'A short and impactful bio appears here.';
  preview.skill.textContent = fields.skill.value || 'Core Skill';

  applyAccent(fields.accent.value);
}

function randomPreset() {
  const preset = presets[Math.floor(Math.random() * presets.length)];
  fields.name.value = preset.name;
  fields.title.value = preset.title;
  fields.bio.value = preset.bio;
  fields.skill.value = preset.skill;
  fields.accent.value = preset.accent;

  generatePortfolio();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  generatePortfolio();

  card.animate(
    [
      { transform: 'rotateX(0deg) rotateY(0deg) scale(1)' },
      { transform: 'rotateX(-4deg) rotateY(4deg) scale(1.02)' },
      { transform: 'rotateX(0deg) rotateY(0deg) scale(1)' },
    ],
    {
      duration: 480,
      easing: 'ease-out',
    },
  );
});

randomizeButton.addEventListener('click', randomPreset);

card.addEventListener('mousemove', (event) => {
  const bounds = card.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  const rotateX = ((y / bounds.height) - 0.5) * -16;
  const rotateY = ((x / bounds.width) - 0.5) * 16;

  card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
});

card.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0deg) rotateY(0deg)';
});

generatePortfolio();
