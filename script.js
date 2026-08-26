// ============================================================
// PUJA VIBES - FINAL SCRIPT
// ============================================================


// ============================================================
// FIREBASE IMPORTS
// ============================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getAuth,
    signInAnonymously,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    getDatabase,
    ref,
    push,
    set,
    remove,
    onValue,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyBlzp3ArNQ_GFGUs4TX14S_jjNB6z2eapE",

    authDomain:
        "puja-vibes.firebaseapp.com",

    databaseURL:
        "https://puja-vibes-default-rtdb.firebaseio.com/",

    projectId:
        "puja-vibes",

    storageBucket:
        "puja-vibes.firebasestorage.app",

    messagingSenderId:
        "965137734407",

    appId:
        "1:965137734407:web:f56477342c47b863f6c3a2",

    measurementId:
        "G-5SYLJH7QFF"
};


// ============================================================
// ADMIN UID
// ============================================================

const ADMIN_UID =
    "YtBPHQ4BvobaWshSpJc6bPg19tv1";


// ============================================================
// BASE LISTENER COUNT
// ============================================================

const BASE_LISTENERS = 102;


// ============================================================
// FIREBASE INITIALIZE
// ============================================================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getDatabase(app);


// ============================================================
// PLAYER INFO
// ============================================================

const INFO = {

    prePuja: {

        title: "Pre-Puja Vibes",

        titleId: "prePujaSongTitle",

        artistId: "prePujaSongArtist",

        playId: "prePujaPlayButton",

        progressId: "prePujaProgressBar",

        containerId: "prePujaProgressContainer",

        currentId: "prePujaCurrentTime",

        durationId: "prePujaDuration",

        volumeId: "prePujaVolumeSlider",

        playlistId: "prePujaPlaylist",

        playerId: "prePujaYoutubePlayer"
    },


    mahalaya: {

        title: "Mahalaya Hits",

        titleId: "mahalayaSongTitle",

        artistId: "mahalayaSongArtist",

        playId: "mahalayaPlayButton",

        progressId: "mahalayaProgressBar",

        containerId: "mahalayaProgressContainer",

        currentId: "mahalayaCurrentTime",

        durationId: "mahalayaDuration",

        volumeId: "mahalayaVolumeSlider",

        playlistId: "mahalayaPlaylist",

        playerId: "mahalayaYoutubePlayer"
    },


    bisorjoni: {

        title: "Bisorjoni Songs",

        titleId: "bisorjoniSongTitle",

        artistId: "bisorjoniSongArtist",

        playId: "bisorjoniPlayButton",

        progressId: "bisorjoniProgressBar",

        containerId: "bisorjoniProgressContainer",

        currentId: "bisorjoniCurrentTime",

        durationId: "bisorjoniDuration",

        volumeId: "bisorjoniVolumeSlider",

        playlistId: "bisorjoniPlaylist",

        playerId: "bisorjoniYoutubePlayer"
    }

};


// ============================================================
// STATE
// ============================================================

const state = {

    prePuja: {
        songs: [],
        index: 0
    },

    mahalaya: {
        songs: [],
        index: 0
    },

    bisorjoni: {
        songs: [],
        index: 0
    }

};


// ============================================================
// YOUTUBE PLAYERS
// ============================================================

const players = {

    prePuja: null,

    mahalaya: null,

    bisorjoni: null

};


// ============================================================
// GLOBAL STATE
// ============================================================

let currentUser = null;

let isAdmin = false;

let listenerRef = null;

let youtubeReady = false;

let presenceStarted = false;


// ============================================================
// DOM HELPER
// ============================================================

function getElement(id) {

    return document.getElementById(id);
}


// ============================================================
// YOUTUBE ID EXTRACTOR
// ============================================================

function extractYouTubeId(url) {

    if (!url) {
        return null;
    }

    const value =
        url.trim();

    if (/^[\w-]{11}$/.test(value)) {
        return value;
    }

    try {

        const youtubeURL =
            new URL(value);

        const watchId =
            youtubeURL.searchParams.get("v");

        if (
            watchId &&
            /^[\w-]{11}$/.test(watchId)
        ) {

            return watchId;
        }

        if (
            youtubeURL.hostname.includes("youtu.be")
        ) {

            const id =
                youtubeURL.pathname
                    .split("/")
                    .filter(Boolean)[0];

            if (
                id &&
                /^[\w-]{11}$/.test(id)
            ) {

                return id;
            }
        }

        const parts =
            youtubeURL.pathname
                .split("/")
                .filter(Boolean);

        for (
            const type of ["shorts", "embed"]
        ) {

            const index =
                parts.indexOf(type);

            if (
                index !== -1 &&
                parts[index + 1] &&
                /^[\w-]{11}$/.test(parts[index + 1])
            ) {

                return parts[index + 1];
            }
        }

    } catch {

        return null;
    }

    return null;
}


// ============================================================
// LOAD PLAYLISTS
// ============================================================

function loadFirebasePlaylists() {

    const playlistRef =
        ref(db, "playlists");

    onValue(
        playlistRef,
        snapshot => {

            const data =
                snapshot.val() || {};

            Object.keys(state).forEach(
                section => {

                    const sectionData =
                        data[section] || {};

                    state[section].songs =
                        Object.entries(sectionData)
                            .map(
                                ([id, song]) => ({

                                    firebaseId: id,

                                    title:
                                        song.title ||
                                        "YouTube Song",

                                    artist:
                                        song.artist ||
                                        INFO[section].title,

                                    videoId:
                                        song.videoId
                                })
                            );

                    if (
                        state[section].index >=
                        state[section].songs.length
                    ) {

                        state[section].index =
                            Math.max(
                                0,
                                state[section].songs.length - 1
                            );
                    }

                    updateUI(section);

                    renderPlaylist(section);

                    renderAdminPlaylist(section);

                    if (
                        youtubeReady &&
                        players[section]
                    ) {

                        const song =
                            state[section].songs[
                                state[section].index
                            ];

                        if (song) {

                            players[section]
                                .cueVideoById(
                                    song.videoId
                                );
                        }
                    }

                }
            );

        }
    );
}


// ============================================================
// UPDATE UI
// ============================================================

function updateUI(section) {

    const info =
        INFO[section];

    const song =
        state[section].songs[
            state[section].index
        ];

    const title =
        getElement(info.titleId);

    const artist =
        getElement(info.artistId);

    const current =
        getElement(info.currentId);

    const duration =
        getElement(info.durationId);

    const progress =
        getElement(info.progressId);

    if (title) {

        title.textContent =
            song?.title ||
            "No song added";
    }

    if (artist) {

        artist.textContent =
            song?.artist ||
            info.title;
    }

    if (current) {

        current.textContent =
            "0:00";
    }

    if (duration) {

        duration.textContent =
            "0:00";
    }

    if (progress) {

        progress.style.width =
            "0%";
    }
}


// ============================================================
// PUBLIC PLAYLIST
// ============================================================

function renderPlaylist(section) {

    const container =
        getElement(
            INFO[section].playlistId
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    state[section].songs.forEach(
        (song, index) => {

            const row =
                document.createElement("div");

            row.className =
                "playlist-item";

            if (
                index ===
                state[section].index
            ) {

                row.classList.add("active");
            }

            const songBox =
                document.createElement("div");

            songBox.className =
                "playlist-song";

            const title =
                document.createElement("strong");

            title.textContent =
                song.title;

            const artist =
                document.createElement("small");

            artist.textContent =
                song.artist;

            songBox.append(
                title,
                artist
            );

            songBox.onclick =
                () => {

                    state[section].index =
                        index;

                    loadSong(
                        section,
                        false
                    );

                    renderPlaylist(
                        section
                    );
                };

            row.appendChild(songBox);

            container.appendChild(row);
        }
    );
}


// ============================================================
// LOAD SONG
// ============================================================

function loadSong(
    section,
    autoplay = false
) {

    const player =
        players[section];

    const song =
        state[section].songs[
            state[section].index
        ];

    updateUI(section);

    renderPlaylist(section);

    if (!player) {

        alert(
            "YouTube player is still loading. Please wait 2 seconds and try again."
        );

        return;
    }

    if (!song) {

        alert(
            "No song has been added yet."
        );

        return;
    }

    try {

        if (autoplay) {

            player.loadVideoById(
                song.videoId
            );

        } else {

            player.cueVideoById(
                song.videoId
            );
        }

    } catch (error) {

        console.error(
            "Song loading error:",
            error
        );
    }
}


// ============================================================
// TOGGLE PLAY
// ============================================================

window.togglePlay =
    function(section) {

        const player =
            players[section];

        if (!player) {

            alert(
                "YouTube player is still loading. Please wait a moment."
            );

            return;
        }

        if (
            !state[section].songs.length
        ) {

            alert(
                "No song has been added yet."
            );

            return;
        }

        try {

            const playerState =
                player.getPlayerState();

            if (
                playerState ===
                YT.PlayerState.PLAYING
            ) {

                player.pauseVideo();

            } else {

                stopOtherPlayers(section);

                const song =
                    state[section].songs[
                        state[section].index
                    ];

                if (song) {

                    player.playVideo();
                }
            }

        } catch (error) {

            console.error(
                "Play error:",
                error
            );
        }
    };


// ============================================================
// NEXT
// ============================================================

window.nextSong =
    function(section) {

        const songs =
            state[section].songs;

        if (!songs.length) {
            return;
        }

        stopOtherPlayers(section);

        state[section].index =
            (
                state[section].index + 1
            ) % songs.length;

        loadSong(
            section,
            true
        );
    };


// ============================================================
// PREVIOUS
// ============================================================

window.previousSong =
    function(section) {

        const songs =
            state[section].songs;

        if (!songs.length) {
            return;
        }

        stopOtherPlayers(section);

        state[section].index =
            (
                state[section].index -
                1 +
                songs.length
            ) % songs.length;

        loadSong(
            section,
            true
        );
    };


// ============================================================
// STOP OTHER PLAYERS
// ============================================================

function stopOtherPlayers(
    currentSection
) {

    Object.keys(players)
        .forEach(section => {

            if (
                section !== currentSection &&
                players[section]
            ) {

                try {

                    players[section]
                        .pauseVideo();

                } catch {}

                setButton(
                    section,
                    false
                );
            }
        });

    // IMPORTANT:
    // Do NOT remove listener presence here.
    // Website visitor remains a listener while site is open.
}


// ============================================================
// BUTTON
// ============================================================

function setButton(
    section,
    playing
) {

    const button =
        getElement(
            INFO[section].playId
        );

    if (button) {

        button.textContent =
            playing
                ? "⏸"
                : "▶";
    }
}


// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {

        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secondsLeft =
        Math.floor(seconds % 60);

    return (
        minutes +
        ":" +
        String(secondsLeft)
            .padStart(2, "0")
    );
}


// ============================================================
// UPDATE PROGRESS
// ============================================================

function updateProgress(section) {

    const player =
        players[section];

    if (
        !player ||
        typeof player.getDuration !== "function"
    ) {

        return;
    }

    try {

        const duration =
            player.getDuration();

        if (!duration) {
            return;
        }

        const current =
            player.getCurrentTime();

        const percentage =
            Math.min(
                100,
                (current / duration) * 100
            );

        const progress =
            getElement(
                INFO[section].progressId
            );

        const currentTime =
            getElement(
                INFO[section].currentId
            );

        const durationTime =
            getElement(
                INFO[section].durationId
            );

        if (progress) {

            progress.style.width =
                percentage + "%";
        }

        if (currentTime) {

            currentTime.textContent =
                formatTime(current);
        }

        if (durationTime) {

            durationTime.textContent =
                formatTime(duration);
        }

    } catch {}
}


// ============================================================
// PROGRESS + VOLUME CONTROLS
// ============================================================

Object.keys(INFO).forEach(
    section => {

        const info =
            INFO[section];

        const progress =
            getElement(
                info.containerId
            );

        if (progress) {

            progress.onclick =
                event => {

                    const player =
                        players[section];

                    if (!player) {
                        return;
                    }

                    try {

                        const duration =
                            player.getDuration();

                        if (!duration) {
                            return;
                        }

                        const rect =
                            progress
                                .getBoundingClientRect();

                        const percentage =
                            Math.max(
                                0,
                                Math.min(
                                    1,
                                    (
                                        event.clientX -
                                        rect.left
                                    ) /
                                    rect.width
                                )
                            );

                        player.seekTo(
                            percentage *
                            duration,
                            true
                        );

                    } catch {}
                };
        }

        const volume =
            getElement(
                info.volumeId
            );

        if (volume) {

            volume.oninput =
                event => {

                    if (
                        players[section]
                    ) {

                        try {

                            players[section]
                                .setVolume(
                                    Number(
                                        event.target.value
                                    )
                                );

                        } catch {}
                    }
                };
        }
    }
);


// ============================================================
// CREATE YOUTUBE PLAYER
// ============================================================

function createPlayer(section) {

    if (
        !window.YT ||
        !YT.Player
    ) {

        console.warn(
            "YouTube API not ready:",
            section
        );

        return;
    }

    const info =
        INFO[section];

    if (
        !getElement(info.playerId)
    ) {

        console.error(
            "YouTube container missing:",
            info.playerId
        );

        return;
    }

    players[section] =
        new YT.Player(
            info.playerId,
            {

                width: "200",

                height: "200",

                videoId: "",

                playerVars: {

                    playsinline: 1,

                    controls: 0,

                    rel: 0,

                    modestbranding: 1
                },

                events: {

                    onReady:
                        event => {

                            event.target
                                .setVolume(100);

                            const song =
                                state[section]
                                    .songs[0];

                            if (song) {

                                event.target
                                    .cueVideoById(
                                        song.videoId
                                    );
                            }

                            updateUI(section);

                            renderPlaylist(section);
                        },


                    onStateChange:
                        event => {

                            handlePlayerState(
                                section,
                                event.data
                            );
                        },


                    onError:
                        event => {

                            console.warn(
                                "YouTube player error:",
                                section,
                                event.data
                            );

                            setButton(
                                section,
                                false
                            );
                        }
                }
            }
        );
}


// ============================================================
// YOUTUBE API READY
// ============================================================

window.onYouTubeIframeAPIReady =
    function() {

        youtubeReady = true;

        createPlayer("prePuja");

        createPlayer("mahalaya");

        createPlayer("bisorjoni");
    };


// ============================================================
// FALLBACK YOUTUBE CHECK
// ============================================================

function waitForYouTube() {

    if (
        window.YT &&
        YT.Player
    ) {

        if (!youtubeReady) {

            youtubeReady = true;

            createPlayer("prePuja");

            createPlayer("mahalaya");

            createPlayer("bisorjoni");
        }

        return;
    }

    setTimeout(
        waitForYouTube,
        500
    );
}

waitForYouTube();


// ============================================================
// PLAYER STATE
// ============================================================

function handlePlayerState(
    section,
    stateValue
) {

    if (
        stateValue ===
        YT.PlayerState.PLAYING
    ) {

        stopOtherPlayers(section);

        setButton(
            section,
            true
        );
    }

    else if (
        stateValue ===
        YT.PlayerState.PAUSED
    ) {

        setButton(
            section,
            false
        );
    }

    else if (
        stateValue ===
        YT.PlayerState.ENDED
    ) {

        setButton(
            section,
            false
        );

        if (
            state[section].songs.length
        ) {

            window.nextSong(section);
        }
    }
}


// ============================================================
// ANONYMOUS LOGIN
// ============================================================

async function startAnonymousUser() {

    try {

        await signInAnonymously(auth);

    } catch (error) {

        console.error(
            "Anonymous login failed:",
            error
        );
    }
}


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(
    auth,
    async user => {

        currentUser = user;

        isAdmin =
            !!user &&
            user.uid === ADMIN_UID;

        updateAdminUI();


        // If a song is already playing,
        // start listener presence now
        if (user) {

            for (const section of Object.keys(players)) {

                const player = players[section];

                if (
                    player &&
                    typeof player.getPlayerState === "function" &&
                    player.getPlayerState() === YT.PlayerState.PLAYING
                ) {

                    await startListeningPresence(section);

                    break;
                }
            }
        }

    }
);


// ============================================================
// ADMIN LOGIN
// ============================================================

const adminLoginButton =
    getElement("adminLoginButton");

if (adminLoginButton) {

    adminLoginButton.onclick =
        async function() {

            const email =
                getElement(
                    "adminEmail"
                ).value.trim();

            const password =
                getElement(
                    "adminPassword"
                ).value;

            const message =
                getElement(
                    "adminMessage"
                );

            if (
                !email ||
                !password
            ) {

                message.textContent =
                    "Please enter email and password.";

                return;
            }

            try {

                // Remove anonymous presence
                // before changing account.
                await stopListeningPresence();

                const result =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                if (
                    result.user.uid !==
                    ADMIN_UID
                ) {

                    await signOut(auth);

                    message.textContent =
                        "This account is not authorized as admin.";

                    await startAnonymousUser();

                    return;
                }

                message.textContent =
                    "Admin login successful.";

            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );

                message.textContent =
                    "Invalid email or password.";

                if (!currentUser) {

                    await startAnonymousUser();
                }
            }
        };
}


// ============================================================
// ADMIN LOGOUT
// ============================================================

const adminLogoutButton =
    getElement(
        "adminLogoutButton"
    );

if (adminLogoutButton) {

    adminLogoutButton.onclick =
        async function() {

            await stopListeningPresence();

            await signOut(auth);

            await startAnonymousUser();
        };
}


// ============================================================
// ADMIN UI
// ============================================================

function updateAdminUI() {

    const login =
        getElement("adminLogin");

    const panel =
        getElement("adminPanel");

    if (!login || !panel) {
        return;
    }

    if (isAdmin) {

        login.classList.add(
            "hidden"
        );

        panel.classList.remove(
            "hidden"
        );

        renderAllAdminLists();

    } else {

        login.classList.remove(
            "hidden"
        );

        panel.classList.add(
            "hidden"
        );
    }
}


// ============================================================
// ADMIN ADD SONG
// ============================================================

async function addAdminSong(
    section,
    nameInputId,
    urlInputId
) {

    if (!isAdmin) {

        alert(
            "Only admin can add songs."
        );

        return;
    }

    const nameInput =
        getElement(nameInputId);

    const urlInput =
        getElement(urlInputId);

    const title =
        nameInput.value.trim() ||
        "YouTube Song";

    const videoId =
        extractYouTubeId(
            urlInput.value
        );

    if (!videoId) {

        alert(
            "Please enter a valid YouTube URL."
        );

        return;
    }

    const duplicate =
        state[section].songs.some(
            song =>
                song.videoId === videoId
        );

    if (duplicate) {

        alert(
            "This song is already in the playlist."
        );

        return;
    }

    try {

        const playlistRef =
            ref(
                db,
                "playlists/" +
                section
            );

        const newSong =
            push(playlistRef);

        await set(
            newSong,
            {

                title:
                    title,

                artist:
                    INFO[section].title,

                videoId:
                    videoId,

                addedAt:
                    Date.now(),

                addedBy:
                    currentUser.uid
            }
        );

        nameInput.value = "";

        urlInput.value = "";

        alert(
            "Song added successfully."
        );

    } catch (error) {

        console.error(
            "Add song error:",
            error
        );

        alert(
            "Could not add song."
        );
    }
}


// ============================================================
// ADMIN DELETE
// ============================================================

async function deleteAdminSong(
    section,
    firebaseId
) {

    if (!isAdmin) {
        return;
    }

    if (
        !confirm(
            "Delete this song?"
        )
    ) {
        return;
    }

    try {

        await remove(
            ref(
                db,
                "playlists/" +
                section +
                "/" +
                firebaseId
            )
        );

    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Could not delete song."
        );
    }
}


// ============================================================
// ADMIN PLAYLIST
// ============================================================

function renderAdminPlaylist(section) {

    const containerIds = {

        prePuja:
            "adminPrePujaList",

        mahalaya:
            "adminMahalayaList",

        bisorjoni:
            "adminBisorjoniList"
    };

    const container =
        getElement(
            containerIds[section]
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!isAdmin) {
        return;
    }

    state[section].songs.forEach(
        song => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "admin-song";

            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "admin-song-info";

            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                song.title;

            const artist =
                document.createElement(
                    "small"
                );

            artist.textContent =
                song.artist;

            info.append(
                title,
                artist
            );

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "delete-song";

            deleteButton.textContent =
                "✕";

            deleteButton.onclick =
                () => {

                    deleteAdminSong(
                        section,
                        song.firebaseId
                    );
                };

            row.append(
                info,
                deleteButton
            );

            container.appendChild(row);
        }
    );
}


// ============================================================
// ADMIN BUTTONS
// ============================================================

const preAdd =
    getElement("adminPrePujaAdd");

if (preAdd) {

    preAdd.onclick =
        () => {

            addAdminSong(
                "prePuja",
                "adminPrePujaName",
                "adminPrePujaUrl"
            );
        };
}


const mahalayaAdd =
    getElement("adminMahalayaAdd");

if (mahalayaAdd) {

    mahalayaAdd.onclick =
        () => {

            addAdminSong(
                "mahalaya",
                "adminMahalayaName",
                "adminMahalayaUrl"
            );
        };
}


const bisorjoniAdd =
    getElement("adminBisorjoniAdd");

if (bisorjoniAdd) {

    bisorjoniAdd.onclick =
        () => {

            addAdminSong(
                "bisorjoni",
                "adminBisorjoniName",
                "adminBisorjoniUrl"
            );
        };
}


// ============================================================
// ADMIN LISTS
// ============================================================

function renderAllAdminLists() {

    Object.keys(state)
        .forEach(
            section => {

                renderAdminPlaylist(
                    section
                );
            }
        );
}


// ============================================================
// LISTENER PRESENCE
// ============================================================

async function startListeningPresence() {

    if (
        !currentUser ||
        presenceStarted
    ) {

        return;
    }

    try {

        const listenersRef =
            ref(
                db,
                "listeners"
            );

        listenerRef =
            push(
                listenersRef
            );

        await set(
            listenerRef,
            {

                uid:
                    currentUser.uid,

                section:
                    "home",

                startedAt:
                    Date.now()
            }
        );

        await onDisconnect(
            listenerRef
        ).remove();

        presenceStarted =
            true;

        console.log(
            "Listener presence started."
        );

    } catch (error) {

        console.error(
            "Presence start error:",
            error
        );

        listenerRef =
            null;

        presenceStarted =
            false;
    }
}


// ============================================================
// STOP LISTENER PRESENCE
// ============================================================

async function stopListeningPresence() {

    if (!listenerRef) {

        presenceStarted =
            false;

        return;
    }

    try {

        await remove(
            listenerRef
        );

    } catch (error) {

        console.warn(
            "Presence remove error:",
            error
        );
    }

    listenerRef =
        null;

    presenceStarted =
        false;
}


// ============================================================
// LISTENER COUNT
// ============================================================

onValue(
    ref(db, "listeners"),
    snapshot => {

        const data =
            snapshot.val() || {};

        const liveListeners =
            Object.keys(data).length;

        const total =
            BASE_LISTENERS +
            liveListeners;

        const counter =
            getElement(
                "listenerCount"
            );

        if (counter) {

            counter.textContent =
                total;
        }
    }
);


// ============================================================
// PROGRESS LOOP
// ============================================================

setInterval(
    () => {

        Object.keys(players)
            .forEach(
                section => {

                    updateProgress(
                        section
                    );
                }
            );

    },
    500
);


// ============================================================
// START
// ============================================================

loadFirebasePlaylists();

startAnonymousUser();


// ============================================================
// PAGE CLOSE
// ============================================================

window.addEventListener(
    "beforeunload",
    () => {

        if (listenerRef) {

            remove(
                listenerRef
            ).catch(
                () => {}
            );
        }
    }
);
