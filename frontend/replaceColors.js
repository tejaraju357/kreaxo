const fs = require('fs');

const files = [
  'c:/Users/tejes/OneDrive/Desktop/VP/frontend/src/pages/ServicesPage.jsx',
  'c:/Users/tejes/OneDrive/Desktop/VP/frontend/src/pages/Register.jsx',
  'c:/Users/tejes/OneDrive/Desktop/VP/frontend/src/pages/PublicBrands.jsx',
  'c:/Users/tejes/OneDrive/Desktop/VP/frontend/src/pages/CreatorProfile.jsx',
  'c:/Users/tejes/OneDrive/Desktop/VP/frontend/src/pages/creator/CreatorProfileEdit.jsx',
  'c:/Users/tejes/OneDrive/Desktop/VP/frontend/src/components/Footer.jsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let raw = fs.readFileSync(f, 'utf8');
    raw = raw.replace(/#0f766e/gi, 'var(--accent-primary)');
    raw = raw.replace(/#022c22/gi, 'var(--accent-primary)');
    raw = raw.replace(/#115e59/gi, 'var(--accent-secondary)');
    raw = raw.replace(/#166534/gi, 'var(--text-primary)');
    raw = raw.replace(/#16a34a/gi, 'var(--text-primary)');
    raw = raw.replace(/#0369a1/gi, 'var(--text-primary)');
    raw = raw.replace(/#dcfce7/gi, 'var(--bg-card-hover)');
    raw = raw.replace(/#e0f2fe/gi, 'var(--bg-primary)');
    raw = raw.replace(/#bae6fd/gi, 'var(--border)');
    raw = raw.replace(/#e6f7f6/gi, 'var(--bg-card-hover)');
    raw = raw.replace(/#bbf7d0/gi, 'var(--border)');
    raw = raw.replace(/#fed7aa/gi, 'var(--border)');
    raw = raw.replace(/#c2410c/gi, 'var(--text-muted)');
    raw = raw.replace(/#fff7ed/gi, 'var(--bg-card-hover)');
    fs.writeFileSync(f, raw);
    console.log('Processed', f);
  } else {
    console.log('Skipped', f);
  }
});
console.log('Color replacement done!');
