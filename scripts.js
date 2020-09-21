const form = document.getElementById('form');
const search = document.getElementById('search');
const songResults = document.getElementById('songResults');
const more = document.getElementById('more');
const clear = document.getElementById('clear');
const goBack = document.getElementById('goBack');
const back = document.getElementById('back');
const lyricsModal = document.getElementById('lyrics');

// Get the modal
const modal = document.getElementById("myModal");
// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const apiURL = 'https://api.lyrics.ovh';


function showSongResults(data) {
    if (back.style.display === 'block') {
        back.style.display = 'none';
    }
    songResults.innerHTML = `<ul class='songs'>
    ${data.data
    .map(
      (item) => `<li>
    <span><strong>${item.artist.name} - ${item.title}</strong></span>
    <button class='lyricsbutton' data-artist='${item.artist.name}' data-songtitle='${item.title}'> Show Lyrics </button>
    </li>`,
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

  lyricsModal.innerHTML = '';

  if (data.error) {
    lyricsModal.innerHTML = data.error;
  } else {
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    if (back.style.display === 'none') {
      back.style.display = 'block';
    }
    lyricsModal.innerHTML = `
              <h2><strong>${artist}</strong> - ${songTitle}</h2>
              <span>${lyrics}</span>`;
  }
//   more.innerHTML = '';
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
    modal.style.display = "block";
    getLyrics(artist, songTitle);
  }
});

function resetPage() {
  form.reset();
  songResults.innerHTML = '';
  more.innerHTML = '';
}

clear.addEventListener('click', (e) => {
  resetPage();
});

goBack.addEventListener('click', (e) => {
  const searchTerm = search.value.trim();
  fetchSong(searchTerm);
});