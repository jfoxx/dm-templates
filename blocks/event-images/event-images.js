function togglSoldOutFlag() {
  const el = document.getElementById('soldoutToggle');
  if (el.checked) {
    const images = document.querySelectorAll('img');
    const links = document.querySelectorAll('a');
    images.forEach((image) => {
      let url = image.src;
      url = `${url}&$sold-out-hide=0`;
      image.src = url;
    });
    links.forEach((link) => {
      let url = link.href;
      url = `${url}&$sold-out-hide=0`;
      link.href = url;
    });
  } else {
    /* eslint-disable prefer-destructuring */
    const images = document.querySelectorAll('img');
    const links = document.querySelectorAll('a');
    images.forEach((image) => {
      let url = image.src;
      url = url.split('&$sold-out-hide=0')[0];
      image.src = url;
    });
    links.forEach((link) => {
      let url = link.href;
      url = url.split('&$sold-out-hide=0')[0];
      link.href = url;
    });
    /* eslint-enable prefer-destructuring */
  }
}

export default function decorate(block) {
  const group = document.createElement('ul');
  const versions = [
    'Display Ad 1080 x 1350',
    'Display Ad 1080 x 1080',
    'Display Ad 1280 x 720',
    'Web 768 x 500',
  ];

  const baseUrl = 'https://s7d1.scene7.com/is/image/JeffFoxxNA001/';
  const keys = [];
  const values = [];

  [...block.children].forEach((row) => {
    const key = row.querySelector('div:first-of-type');
    const value = row.querySelector('div:last-of-type');
    keys.push(key.innerText);
    values.push(value.innerText);
  });

  const img = 'sweat';
  const artist = values[keys.indexOf('Artist')];
  const date = values[keys.indexOf('Date')];

  versions.forEach((version) => {
    const li = document.createElement('li');
    const title = document.createElement('h2');
    title.innerText = version;
    li.append(title);
    let display = version.replace('x', '');
    display = display.replace('  ', ' ');
    display = display.replaceAll(' ', '-');
    const dimensions = display.match(/(\d+)-(\d+)$/)[0];
    const imgEl = document.createElement('img');
    const imgPath = `${baseUrl}${display}?$img=is(JeffFoxxNA001/${img}:${dimensions})&$artist=${artist}&$date=${date}`;
    imgEl.src = imgPath;
    const link = document.createElement('a');
    link.href = imgPath;
    link.setAttribute('download', '');
    link.append(imgEl);
    li.append(link);
    group.append(li);
  });

  block.textContent = '';

  block.append(group);

  const soldoutText = document.createElement('p');
  soldoutText.innerText = 'Sold Out';
  const soldoutLabel = document.createElement('label');
  const soldoutToggle = document.createElement('input');
  const soldoutSpan = document.createElement('span');
  soldoutSpan.className = 'slider';
  soldoutToggle.type = 'checkbox';
  soldoutToggle.id = 'soldoutToggle';
  soldoutLabel.append(soldoutToggle, soldoutSpan);
  const soldoutDiv = document.createElement('div');
  soldoutDiv.className = 'sold-out';
  soldoutDiv.append(soldoutText, soldoutLabel);

  block.prepend(soldoutDiv);
  soldoutToggle.addEventListener('change', togglSoldOutFlag);
}
