// import JSZip from 'jszip';

// var zip = new JSZip;

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
  }
}

function convertDate(date) {
/* eslint-disable prefer-const */
  let month; let day; let
    year;
  [month, day, year] = date.split(' ');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let monthNumber = months.indexOf(month) + 1;
  monthNumber = monthNumber.toString();
  if (monthNumber.length < 2) {
    monthNumber = `0${monthNumber}`;
  }
  let dayNumber = day.replace(',', '');
  if (dayNumber.length < 2) {
    dayNumber = `0${dayNumber}`;
  }
  const yearNumber = year.split('20')[1];

  return (`${monthNumber}/${dayNumber}/${yearNumber}`);
}

export default function decorate(block) {
  const group = document.createElement('ul');
  const versions = [
    'Display Ad 1080 x 1350',
    'Display Ad 1080 x 1080',
    'Display Ad 1280 x 720',
    'Web 768 x 500',
    'Social 1080 x 1920',
    'Spotify Ad 640 x 640',
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

  let img = values[keys.indexOf('Image')];
  img = img.split('.')[0];
  const artist = values[keys.indexOf('Artist')];
  const date = values[keys.indexOf('Date')];
  const datenum = convertDate(date);

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
    const imgPath = `${baseUrl}${display}?$img=is(JeffFoxxNA001/${img}:${dimensions})&$artist=${artist}&$date=${date}&$datenum=${datenum}`;
    imgEl.src = imgPath;
    const link = document.createElement('a');
    link.href = imgPath;
    link.setAttribute('download', '');
    link.append(imgEl);
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'button-wrapper';
    const dlButton = document.createElement('a');
    dlButton.href = imgPath;
    dlButton.className = 'button';
    dlButton.innerText = 'Download';
    dlButton.setAttribute('download', '');
    const cpyButton = document.createElement('button');
    cpyButton.className = 'button copy-button';
    cpyButton.innerText = 'Copy Link';
    cpyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(link);
      const buttons = document.querySelectorAll('.copy-button');
      buttons.forEach((i) => {
        i.classList.remove('success');
        i.innerText = 'Copy Link';
      });
      cpyButton.classList.add('success');
      cpyButton.innerText = 'Link Copied!';
    });
    buttonDiv.append(dlButton, cpyButton);
    li.append(link, buttonDiv);
    group.append(li);
  });

  block.textContent = '';

  block.append(group);

  // Create the Sold Out toggle
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
