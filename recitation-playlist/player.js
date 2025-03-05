// JavaScript Object containing the playlist with links to audio files
const playlist = [
    { title: "Abdelhamid Hssain - Maryam", url: "https://govrooms.github.io/recitation-playlist/audio/abdelhamid-hssain-Maryam.mp3" },
    { title: "Abdel Aziz Al-Ahmed - An-Nisa", url: "https://govrooms.github.io/recitation-playlist/audio/Abdel-Aziz-Al-Ahmed-AnNisa.mp3" },
    { title: "Abdallah Kamel - Ash-Shuara", url: "https://govrooms.github.io/recitation-playlist/audio/Abdallah-Kamel-Ash-Shuara.mp3" },
    { title: "Abdallah Azab - Aal-E-Imran", url: "https://govrooms.github.io/recitation-playlist/audio/Abdallah-Azab-Aal-E-Imran.mp3" },
    { title: "Aaar Al-Hudhoudi - Al-Anaam", url: "https://govrooms.github.io/recitation-playlist/audio/Aaar-Al-Hudhoudi-Al-Anaam.mp3" },
    { title: "Abdel Moujib Benkirane - Ibrahim", url: "https://govrooms.github.io/recitation-playlist/audio/abdelmoujib-benkirane-ibrahim.mp3" },
    { title: "Eid Hassan Abu Aachra - Al Hashr", url: "https://govrooms.github.io/recitation-playlist/audio/eid-hassan-abu-aachra-al-hashr.mp3" },
    { title: "Abdallah Humeid - Ya-Seen", url: "https://govrooms.github.io/recitation-playlist/audio/abdallah-humeid-ya-sin.mp3" },
    { title: "Abdul Mohsen Al-Harthy - Al-Kahf", url: "https://govrooms.github.io/recitation-playlist/audio/abdulmohsen-al-harthy-al-kahf.mp3" },
    { title: "Abdul Basit - Al-Ma-idah", url: "https://govrooms.github.io/recitation-playlist/audio/abdul-basit-al-ma-idah.mp3" },
    { title: "Yasser al Dossari - Al-Mu'minoon", url: "https://govrooms.github.io/recitation-playlist/audio/yasser-al-dossari-al-muminoon.mp3" },
    { title: "Hassan Saleh - Al Araf", url: "https://govrooms.github.io/recitation-playlist/audio/hassan-saleh-al-araf.mp3" },
    { title: "AbdulBari ath-Thubaity - Al Baqara", url: "https://govrooms.github.io/recitation-playlist/audio/abdulbari-ath-thubaity-al-baqara.mp3" },
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

// Get the start index from the URL hash (deep linking)
function getStartIndexFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.has('start') ? parseInt(params.get('start'), 10) : 0;
}

// Initialize the playlist
const startIndex = getStartIndexFromUrl();
renderPlaylist(startIndex);
autoplayNextSong();

