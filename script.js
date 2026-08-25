console.log("PUJA VIBES JS LOADED");

// ============================================================
// PUJA VIBES - FINAL JAVASCRIPT
// ============================================================


// ============================================================
// FIREBASE
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
// FIREBASE INITIALIZE
// ============================================================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getDatabase(app);


// ============================================================
// PLAYER INFORMATION
// ============================================================

const INFO = {

    prePuja: {

        title: "Pre-Puja Vibes",

        titleId:
            "prePujaSongTitle",

        artistId:
            "prePujaSongArtist",

        playId:
            "prePujaPlayButton",

        progressId:
            "prePujaProgressBar",

        containerId:
            "prePujaProgressContainer",

        currentId:
            "prePujaCurrentTime",

        durationId:
            "prePujaDuration",

        volumeId:
            "prePujaVolumeSlider",

        playlistId:
            "prePujaPlaylist",

        playerId:
            "prePujaYoutubePlayer"

    },


    mahalaya: {

        title: "Mahalaya Hits",

        titleId:
            "mahalayaSongTitle",

        artistId:
            "mahalayaSongArtist",

        playId:
            "mahalayaPlayButton",

        progressId:
            "mahalayaProgressBar",

        containerId:
            "mahalayaProgressContainer",

        currentId:
            "mahalayaCurrentTime",

        durationId:
            "mahalayaDuration",

        volumeId:
            "mahalayaVolumeSlider",

        playlistId:
            "mahalayaPlaylist",

        playerId:
            "mahalayaYoutubePlayer"

    },


    bisorjoni: {

        title: "Bisorjoni Songs",

        titleId:
            "bisorjoniSongTitle",

        artistId:
            "bisorjoniSongArtist",

        playId:
            "bisorjoniPlayButton",

        progressId:
            "bisorjoniProgressBar",

        containerId:
            "bisorjoniProgressContainer",

        currentId:
            "bisorjoniCurrentTime",

        durationId:
            "bisorjoniDuration",

        volumeId:
            "bisorjoniVolumeSlider",

        playlistId:
            "bisorjoniPlaylist",

        playerId:
            "bisorjoniYoutubePlayer"

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
// AUTH STATE
// ============================================================

let currentUser = null;

let isAdmin = false;

let listenerRef = null;

let activeListeningSection = null;


// ============================================================
// YOUTUBE ID
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
                /^[\w-]{11}$/.test(
                    parts[index + 1]
                )
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
// LOAD FIREBASE PLAYLISTS
// ============================================================

function loadFirebasePlaylists() {

    const playlistRef =
        ref(db, "playlists");


    onValue(
        playlistRef,
        snapshot => {

            const data =
                snapshot.val() || {};


            Object.keys(state)
                .forEach(section => {

                    const sectionData =
                        data[section] || {};


                    state[section].songs =
                        Object.entries(
                            sectionData
                        ).map(
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

                });

        }
    );
}


// ============================================================
// UPDATE PLAYER UI
// ============================================================

function updateUI(section) {

    const info =
        INFO[section];


    const song =
        state[section].songs[
            state[section].index
        ];


    document.getElementById(
        info.titleId
    ).textContent =
        song?.title ||
        "No song added";


    document.getElementById(
        info.artistId
    ).textContent =
        song?.artist ||
        info.title;


    document.getElementById(
        info.currentId
    ).textContent =
        "0:00";


    document.getElementById(
        info.durationId
    ).textContent =
        "0:00";


    document.getElementById(
        info.progressId
    ).style.width =
        "0%";
}


// ============================================================
// RENDER PUBLIC PLAYLIST
// ============================================================

function renderPlaylist(section) {

    const container =
        document.getElementById(
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


    if (
        !player ||
        !song
    ) {

        return;
    }


    if (autoplay) {

        player.loadVideoById(
            song.videoId
        );

    } else {

        player.cueVideoById(
            song.videoId
        );
    }
}


// ============================================================
// PLAY / PAUSE
// ============================================================

window.togglePlay =
    function(section) {

        const player =
            players[section];


        if (!player) {

            alert(
                "Player is still loading."
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


        const playerState =
            player.getPlayerState();


        if (
            playerState ===
            YT.PlayerState.PLAYING
        ) {

            player.pauseVideo();

        } else {

            stopOtherPlayers(section);

            player.playVideo();
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

                players[section]
                    .pauseVideo();


                setButton(
                    section,
                    false
                );
            }

        });


    if (
        activeListeningSection &&
        activeListeningSection !== currentSection
    ) {

        stopListeningPresence();
    }
}


// ============================================================
// BUTTON
// ============================================================

function setButton(
    section,
    playing
) {

    const button =
        document.getElementById(
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
// TIME
// ============================================================

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
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
// PROGRESS
// ============================================================

function updateProgress(section) {

    const player =
        players[section];


    if (
        !player ||
        typeof player.getDuration !==
        "function"
    ) {

        return;
    }


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


    document.getElementById(
        INFO[section].progressId
    ).style.width =
        percentage + "%";


    document.getElementById(
        INFO[section].currentId
    ).textContent =
        formatTime(current);


    document.getElementById(
        INFO[section].durationId
    ).textContent =
        formatTime(duration);
}


// ============================================================
// PROGRESS + VOLUME
// ============================================================

Object.keys(INFO).forEach(
    section => {

        const info =
            INFO[section];


        const progress =
            document.getElementById(
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

                };
        }


        const volume =
            document.getElementById(
                info.volumeId
            );


        if (volume) {

            volume.oninput =
                event => {

                    if (
                        players[section]
                    ) {

                        players[section]
                            .setVolume(
                                Number(
                                    event.target.value
                                )
                            );
                    }

                };
        }

    }
);


// ============================================================
// YOUTUBE PLAYER
// ============================================================

function createPlayer(section) {

    const info =
        INFO[section];


    players[section] =
        new YT.Player(
            info.playerId,
            {

                width: "200",

                height: "200",

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


                            const firstSong =
                                state[section]
                                    .songs[0];


                            if (firstSong) {

                                event.target
                                    .cueVideoById(
                                        firstSong.videoId
                                    );
                            }


                            updateUI(
                                section
                            );

                            renderPlaylist(
                                section
                            );
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
                                "YouTube error:",
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

        createPlayer("prePuja");

        createPlayer("mahalaya");

        createPlayer("bisorjoni");

    };


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

        startListeningPresence(
            section
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


        if (
            activeListeningSection === section
        ) {

            stopListeningPresence();
        }
    }


    else if (
        stateValue ===
        YT.PlayerState.ENDED
    ) {

        setButton(
            section,
            false
        );


        stopListeningPresence();


        if (
            state[section].songs.length
        ) {

            window.nextSong(section);
        }
    }
}


// ============================================================
// AUTH - ANONYMOUS USER
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
    user => {

        currentUser = user;

        isAdmin =
            !!user &&
            user.uid === ADMIN_UID;


        updateAdminUI();

    }
);


// ============================================================
// ADMIN LOGIN
// ============================================================

document.getElementById(
    "adminLoginButton"
).onclick =
    async function() {

        const email =
            document.getElementById(
                "adminEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "adminPassword"
            ).value;


        const message =
            document.getElementById(
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

            console.error(error);

            message.textContent =
                "Invalid email or password.";
        }

    };


// ============================================================
// ADMIN LOGOUT
// ============================================================

document.getElementById(
    "adminLogoutButton"
).onclick =
    async function() {

        await stopListeningPresence();

        await signOut(auth);

        await startAnonymousUser();

    };


// ============================================================
// ADMIN UI
// ============================================================

function updateAdminUI() {

    const login =
        document.getElementById(
            "adminLogin"
        );


    const panel =
        document.getElementById(
            "adminPanel"
        );


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
        document.getElementById(
            nameInputId
        );


    const urlInput =
        document.getElementById(
            urlInputId
        );


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

                title: title,

                artist:
                    INFO[section].title,

                videoId: videoId,

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

        console.error(error);

        alert(
            "Could not add song."
        );
    }
}


// ============================================================
// ADMIN DELETE SONG
// ============================================================

async function deleteAdminSong(
    section,
    firebaseId
) {

    if (!isAdmin) {
        return;
    }


    const confirmed =
        confirm(
            "Delete this song?"
        );


    if (!confirmed) {
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

        console.error(error);

        alert(
            "Could not delete song."
        );
    }
}


// ============================================================
// ADMIN PLAYLIST RENDER
// ============================================================

function renderAdminPlaylist(section) {

    const containerId = {

        prePuja:
            "adminPrePujaList",

        mahalaya:
            "adminMahalayaList",

        bisorjoni:
            "adminBisorjoniList"

    }[section];


    const container =
        document.getElementById(
            containerId
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

document.getElementById(
    "adminPrePujaAdd"
).onclick =
    () => {

        addAdminSong(
            "prePuja",
            "adminPrePujaName",
            "adminPrePujaUrl"
        );

    };


document.getElementById(
    "adminMahalayaAdd"
).onclick =
    () => {

        addAdminSong(
            "mahalaya",
            "adminMahalayaName",
            "adminMahalayaUrl"
        );

    };


document.getElementById(
    "adminBisorjoniAdd"
).onclick =
    () => {

        addAdminSong(
            "bisorjoni",
            "adminBisorjoniName",
            "adminBisorjoniUrl"
        );

    };


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

async function startListeningPresence(
    section
) {

    if (
        !currentUser ||
        !db
    ) {

        return;
    }


    if (
        activeListeningSection === section &&
        listenerRef
    ) {

        return;
    }


    await stopListeningPresence();


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
                    section,

                startedAt:
                    Date.now()

            }
        );


        await onDisconnect(
            listenerRef
        ).remove();


        activeListeningSection =
            section;

    } catch (error) {

        console.warn(
            "Presence error:",
            error
        );
    }
}


// ============================================================
// STOP PRESENCE
// ============================================================

async function stopListeningPresence() {

    if (listenerRef) {

        try {

            await remove(
                listenerRef
            );

        } catch {

        }

    }


    listenerRef = null;

    activeListeningSection = null;
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

const BASE_LISTENERS = 102;

document.getElementById(
    "listenerCount"
).textContent =
    BASE_LISTENERS + liveListeners;
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

startAnonymousUser();

loadFirebasePlaylists();


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
