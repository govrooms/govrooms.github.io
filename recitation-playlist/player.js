// JavaScript Object containing the playlist with links to audio files
const playlist = [
    { title: "Yasser al Dossari - Al-Mu'minoon", url: "https://podcasts.qurancentral.com/yasser-al-dossari/yasser-al-dossari-023.mp3" },
    { title: "Hassan Saleh - Al Araf", url: "https://podcasts.qurancentral.com/hassan-saleh/hassan-saleh-007-muslimcentral.com.mp3" },
    { title: "AbdulBari ath-Thubaity - Al Baqara", url: "https://podcasts.qurancentral.com/abdulbari-ath-thubaity/abdulbari-ath-thubaity-002.mp3" }
];
let currentIndex = 0; // Keep track of the current track index

// Function to render the playlist in the UI
function renderPlaylist(startIndex = 0) {
    const playlistElement = document.getElementById('playlist');
    playlistElement.innerHTML = ''; // Clear existing list

    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = "#";
        link.textContent = song.title;
        link.addEventListener('click', () => playSong(index)); // Clickable link for each song
        li.appendChild(link);
        if (index === startIndex) {
            li.classList.add('active');
        }
        playlistElement.appendChild(li);
    });

    playSong(startIndex); // Start playing the song at the specified index
}

// Function to play the selected song
function playSong(index) {
    const audioPlayer = document.getElementById('audioPlayer');
    const song = playlist[index];

    audioPlayer.src = song.url;
    audioPlayer.play();
    currentIndex = index; // Update the current track index
    highlightCurrentSong(index);
}

// Function to highlight the currently playing song in the playlist
function highlightCurrentSong(index) {
    const listItems = document.querySelectorAll('.playlist li');
    listItems.forEach((item, idx) => {
        item.classList.toggle('active', idx === index);
    });
}

// Function to autoplay the next song in the playlist
function autoplayNextSong() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.addEventListener('ended', () => {
        currentIndex = (currentIndex + 1) % playlist.length; // Move to the next track or loop back
        playSong(currentIndex); // Play the next song
    });
}

// Function to handle the initial play button click to start audio playback
function startPlayback() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.play(); // Trigger the first play action
    autoplayNextSong(); // Enable autoplay of the next track
}

// Get the start index from the URL hash (deep linking)
function getStartIndexFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.has('start') ? parseInt(params.get('start'), 10) : 0;
}

// Initialize the playlist
const startIndex = getStartIndexFromUrl();
renderPlaylist(startIndex);

// Add event listener to play button to trigger playback
document.getElementById('playButton').addEventListener('click', startPlayback);


