import { getMetadata } from '../../scripts/aem.js';

function hexToRgb(hex) {
  // Remove the '#' if it exists
  let myhex = hex.replace('#', '');

  // Handle 3-digit hex codes
  if (myhex.length === 3) {
    myhex = myhex[0] + myhex[0] + myhex[1] + myhex[1] + myhex[2] + myhex[2];
  }

  // Parse the hex value to decimal
  const r = parseInt(myhex.substring(0, 2), 16);
  const g = parseInt(myhex.substring(2, 4), 16);
  const b = parseInt(myhex.substring(4, 6), 16);
  return `%5Cred${r}%5Cgreen${g}%5Cblue${b}%3B`;
}

/* eslint-disable prefer-destructuring */

export default function decorate(block) {
  const dmAcct = getMetadata('dynamic-media-account');

  const group = document.createElement('ul');
  const versions = [
    '1080 x 1350',
    '1080 x 1080',
    '1280 x 720',
    '768 x 500',
    '975 x 250',
    '640 x 640',
  ];

  const baseUrl = `https://s7d1.scene7.com/is/image/${dmAcct}/`;
  const keys = [];
  const values = [];

  [...block.children].forEach((row) => {
    const key = row.querySelector('div:first-of-type');
    const value = row.querySelector('div:last-of-type');
    keys.push(key.innerText);
    values.push(value.innerText);
  });

  let img = values[keys.indexOf('Background Image')];
  img = img.split('.')[0];
  let logo = values[keys.indexOf('Logo')];
  logo = logo.split('.')[0];
  const headline = values[keys.indexOf('Headline')];
  const subhead = values[keys.indexOf('Subhead')];
  const cta = values[keys.indexOf('Call To Action Text')];
  const headlineColor = hexToRgb(values[keys.indexOf('Headline Color')]);
  const subheadColor = hexToRgb(values[keys.indexOf('Subhead Color')]);
  let overlay = values[keys.indexOf('Color Overlay')];
  overlay = overlay.toLowerCase();

  if (overlay === 'None' || overlay === '') {
    // no overlay
  } else if (overlay === 'light') {
    overlay = '&$dark=0&$light=1';
  } else if (overlay === 'dark') {
    overlay = '&$dark=1&$light=0';
  }

  versions.forEach((version) => {
    const li = document.createElement('li');
    const title = document.createElement('h2');
    title.innerText = version;
    li.append(title);
    const display = version.replaceAll(' ', '');
    const dimensions = display.replace('x', '-');
    const imgEl = document.createElement('img');
    const imgPath = `${baseUrl}${display}?$img=is(${dmAcct}/${img}:${dimensions})&$headline=${headline}&$subhead=${subhead}&$head-color=${headlineColor}&$sub-color=${subheadColor}&$cta=${cta}${overlay}&$logo=${dmAcct}/${logo}`;
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
      const currLink = cpyButton.parentElement.querySelector('.button').href;
      navigator.clipboard.writeText(currLink);
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

  // Title
  const title = document.createElement('h1');
  title.innerText = `${headline}`;
  const dateTitle = document.createElement('h2');
  dateTitle.innerText = `${subhead}`;
  block.prepend(title, dateTitle);
}
