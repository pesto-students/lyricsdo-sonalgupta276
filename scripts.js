const form = document.getElementById('form');
const search = document.getElementById('search');
const songResults = document.getElementById('songResults');
const more = document.getElementById('more');
const clear = document.getElementById('clear');
const goBack = document.getElementById('goBack');
const back = document.getElementById('back');
const apiURL = 'https://api.lyrics.ovh';

function showSongResults(data) {
  if (back.style.display === 'block') {
    back.style.display = 'none';
  }
  if (data.total === 0) {
    alert('Try entering a valid search term!');
    return;
  }
  songResults.innerHTML = `<ul class='songs'>
    ${data.data
    .map(
      (item) => `<li>
    <strong>   ${item.artist.name} - ${item.title}</strong>
    <button class='lyricsbutton' data-artist='${item.artist.name}' data-songtitle='${item.title}'> Show Lyrics </button>
    </li>`
    )
    .join('')}
      </ul>`;

  if (data.prev || data.next) {
    more.innerHTML = `
          ${
  data.prev
    ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
    : ''
}
          ${
  data.next
    ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
    : ''
}
        `;
  } else {
    more.innerHTML = '';
  }
}

async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  showSongResults(data);
}

async function getLyrics(artist, songTitle) {
  const result = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await result.json();

  songResults.innerHTML = '';

  if (data.error) {
    songResults.innerHTML = data.error;
  } else {
    let lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    if (lyrics === '') {
      const searchTerm = search.value.trim();
      const youtubeLink = `https://www.youtube.com/results?search_query=${searchTerm}`;
      lyrics = `Lyrics not found. You might like to listen on <a target='_blank' href='${youtubeLink}' link='#FF0000'><i class="fa fa-youtube-play" aria-hidden="true"></i> </a>instead!`;
    }
    if (back.style.display === 'none') {
      back.style.display = 'block';
    }
    songResults.innerHTML = `
              <h2><strong>${artist} - ${songTitle}</strong></h2>
              <span>${lyrics}</span>`;
  }
  more.innerHTML = '';
}

async function fetchSong(inputQuery) {
  const response = await fetch(`${apiURL}/suggest/${inputQuery}`);
  const data = await response.json();
  showSongResults(data);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    fetchSong(searchTerm);
  }
});

songResults.addEventListener('click', (e) => {
  const clickedElement = e.target;
  if (clickedElement.tagName === 'BUTTON') {
    const artist = clickedElement.getAttribute('data-artist');
    const songTitle = clickedElement.getAttribute('data-songtitle');
    getLyrics(artist, songTitle);
  }
});

function resetPage() {
  form.reset();
  songResults.innerHTML = '';
  more.innerHTML = '';
  if (back.style.display === 'block') {
    back.style.display = 'none';
  }
}

clear.addEventListener('click', () => {
  resetPage();
});

goBack.addEventListener('click', () => {
  const searchTerm = search.value.trim();
  fetchSong(searchTerm);
});
