/* =========================================================
   PUJA VIBES WEBSITE - COMPLETE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       1. DURGA PUJA COUNTDOWN
    ===================================================== */

    const pujaDate =
        new Date("October 17, 2026 00:00:00").getTime();


    function updatePujaCountdown() {

        const daysElement =
            document.getElementById("days");

        const hoursElement =
            document.getElementById("hours");

        const minutesElement =
            document.getElementById("minutes");

        const secondsElement =
            document.getElementById("seconds");


        // যদি countdown HTML না পাওয়া যায়
        if (
            !daysElement ||
            !hoursElement ||
            !minutesElement ||
            !secondsElement
        ) {
            return;
        }


        const now =
            new Date().getTime();


        const difference =
            pujaDate - now;


        // Puja এসে গেলে
        if (difference <= 0) {

            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";


            const subtitle =
                document.querySelector(
                    ".countdown-subtitle"
                );


            if (subtitle) {

                subtitle.textContent =
                    "🌺 মা এসেছেন... শুভ মহাষষ্ঠী 🌺";

            }

            return;
        }


        // Days
        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        // Hours
        const hours =
            Math.floor(
                (difference %
                    (1000 * 60 * 60 * 24)) /
                    (1000 * 60 * 60)
            );


        // Minutes
        const minutes =
            Math.floor(
                (difference %
                    (1000 * 60 * 60)) /
                    (1000 * 60)
            );


        // Seconds
        const seconds =
            Math.floor(
                (difference %
                    (1000 * 60)) /
                    1000
            );


        daysElement.textContent =
            String(days).padStart(2, "0");


        hoursElement.textContent =
            String(hours).padStart(2, "0");


        minutesElement.textContent =
            String(minutes).padStart(2, "0");


        secondsElement.textContent =
            String(seconds).padStart(2, "0");

    }


    // Countdown start
    updatePujaCountdown();


    // প্রতি 1 second
    setInterval(
        updatePujaCountdown,
        1000
    );



    /* =====================================================
       2. HOME BUTTON
    ===================================================== */

    window.goHome = function () {

        const home =
            document.getElementById("home");


        if (home) {

            home.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    };



    /* =====================================================
       3. COMMON TIME FORMAT
    ===================================================== */

    function formatTime(seconds) {

        if (
            !isFinite(seconds) ||
            isNaN(seconds)
        ) {

            return "0:00";

        }


        const minutes =
            Math.floor(seconds / 60);


        const remainingSeconds =
            Math.floor(seconds % 60);


        return (
            minutes +
            ":" +
            String(
                remainingSeconds
            ).padStart(2, "0")
        );

    }


/* =====================================================
   4. PRE-PUJA MUSIC - SINGLE YOUTUBE SONG
===================================================== */

const prePujaVideoId = "xlElO06nQy8";

let prePujaPlayer = null;


/* -----------------------------
   HTML ELEMENTS
----------------------------- */

const prePujaPlayButton =
    document.getElementById("prePujaPlayButton");

const prePujaTitle =
    document.getElementById("prePujaSongTitle");

const prePujaArtist =
    document.getElementById("prePujaSongArtist");

const prePujaProgress =
    document.getElementById("prePujaProgressBar");

const prePujaCurrentTime =
    document.getElementById("prePujaCurrentTime");

const prePujaDuration =
    document.getElementById("prePujaDuration");

const prePujaVolume =
    document.getElementById("prePujaVolumeSlider");


/* -----------------------------
   CREATE PLAYER
----------------------------- */

function createPrePujaPlayer() {

    if (
        typeof YT === "undefined" ||
        !YT.Player
    ) {
        console.log("YouTube API এখনও load হয়নি।");
        return;
    }

    const element =
        document.getElementById("prePujaYoutubePlayer");

    if (!element) {
        console.log("prePujaYoutubePlayer পাওয়া যায়নি।");
        return;
    }

    prePujaPlayer = new YT.Player(
        "prePujaYoutubePlayer",
        {

            height: "1",
            width: "1",

            videoId: prePujaVideoId,

            playerVars: {
                autoplay: 0,
                controls: 0,
                rel: 0
            },

            events: {

                onReady: onPrePujaReady,

                onStateChange:
                    onPrePujaStateChange

            }

        }
    );
}


/* -----------------------------
   PLAYER READY
----------------------------- */

function onPrePujaReady(event) {

    event.target.setVolume(100);

    if (prePujaTitle) {
        prePujaTitle.textContent =
            "Pre-Puja Hits";
    }

    if (prePujaArtist) {
        prePujaArtist.textContent =
            "Pre-Puja Vibes";
    }

    if (prePujaPlayButton) {
        prePujaPlayButton.textContent =
            "▶";
    }
}


/* -----------------------------
   PLAY / PAUSE
----------------------------- */

window.togglePrePujaPlay = function () {

    if (!prePujaPlayer) {
        console.log("Pre-Puja player এখনও ready নয়।");
        return;
    }

    const state =
        prePujaPlayer.getPlayerState();

    if (state === YT.PlayerState.PLAYING) {

        prePujaPlayer.pauseVideo();

    } else {

        prePujaPlayer.playVideo();

    }

};


/* -----------------------------
   STATE CHANGE
----------------------------- */

function onPrePujaStateChange(event) {

    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        if (prePujaPlayButton) {
            prePujaPlayButton.textContent = "⏸";
        }

    }

    if (
        event.data ===
        YT.PlayerState.PAUSED
    ) {

        if (prePujaPlayButton) {
            prePujaPlayButton.textContent = "▶";
        }

    }

    if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        if (prePujaPlayButton) {
            prePujaPlayButton.textContent = "▶";
        }

    }

}


/* -----------------------------
   PROGRESS
----------------------------- */

setInterval(function () {

    if (
        !prePujaPlayer ||
        typeof prePujaPlayer.getCurrentTime !==
        "function"
    ) {
        return;
    }

    const current =
        prePujaPlayer.getCurrentTime();

    const total =
        prePujaPlayer.getDuration();

    if (!total) {
        return;
    }

    const percent =
        (current / total) * 100;

    if (prePujaProgress) {

        prePujaProgress.style.width =
            percent + "%";

    }

    if (prePujaCurrentTime) {

        prePujaCurrentTime.textContent =
            formatTime(current);

    }

    if (prePujaDuration) {

        prePujaDuration.textContent =
            formatTime(total);

    }

}, 500);


/* -----------------------------
   VOLUME
----------------------------- */

if (prePujaVolume) {

    prePujaVolume.addEventListener(
        "input",
        function () {

            if (!prePujaPlayer) {
                return;
            }

            prePujaPlayer.setVolume(
                Number(this.value) * 100
            );

        }
    );

}

/* =====================================================
   5. MAHALAYA MUSIC - YOUTUBE
===================================================== */

const mahalayaSongs = [

    {
        title: "মহালয়ার আগমনী1",
        artist: "Birendra Krishna Bhadra",
        youtubeId: "YQyo8QeoYhc"
    }

];


let mahalayaIndex = 0;
let youtubePlayer = null;


/* -----------------------------
   HTML ELEMENTS
----------------------------- */

const playButton =
    document.getElementById("playButton");

const songTitle =
    document.getElementById("songTitle");

const songArtist =
    document.getElementById("songArtist");

const progressBar =
    document.getElementById("progressBar");

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");

const volumeSlider =
    document.getElementById("volumeSlider");


/* -----------------------------
   CREATE YOUTUBE PLAYER
----------------------------- */

function createMahalayaPlayer() {

    if (
        typeof YT === "undefined" ||
        !YT.Player
    ) {
        console.log(
            "YouTube API এখনও load হয়নি।"
        );

        return;
    }


    const youtubeElement =
        document.getElementById(
            "youtubePlayer"
        );


    if (!youtubeElement) {

        console.log(
            "youtubePlayer element পাওয়া যায়নি।"
        );

        return;

    }


    youtubePlayer =
        new YT.Player(
            "youtubePlayer",
            {

                height: "1",

                width: "1",

                videoId:
                    mahalayaSongs[
                        mahalayaIndex
                    ].youtubeId,

                playerVars: {

                    autoplay: 0,

                    controls: 0,

                    rel: 0

                },

                events: {

                    onReady:
                        onYouTubeReady,

                    onStateChange:
                        onYouTubeStateChange

                }

            }
        );

}


/* -----------------------------
   YOUTUBE API CALLBACK
----------------------------- */

window.onYouTubeIframeAPIReady =
    function () {

        createMahalayaPlayer();
        createprepujaplayer();

    };


/* -----------------------------
   PLAYER READY
----------------------------- */

function onYouTubeReady(event) {

    event.target.setVolume(100);

    updateMahalayaInfo();

}


/* -----------------------------
   UPDATE SONG INFO
----------------------------- */

function updateMahalayaInfo() {

    const song =
        mahalayaSongs[
            mahalayaIndex
        ];


    if (songTitle) {

        songTitle.textContent =
            song.title;

    }


    if (songArtist) {

        songArtist.textContent =
            song.artist;

    }


    if (progressBar) {

        progressBar.style.width =
            "0%";

    }


    if (currentTime) {

        currentTime.textContent =
            "0:00";

    }


    if (duration) {

        duration.textContent =
            "0:00";

    }


    if (playButton) {

        playButton.textContent =
            "▶";

    }

}


/* -----------------------------
   PLAY / PAUSE
----------------------------- */

window.togglePlay =
    function () {

        if (!youtubePlayer) {

            console.log(
                "YouTube player এখনও ready নয়।"
            );

            return;

        }


        const state =
            youtubePlayer.getPlayerState();


        if (
            state ===
            YT.PlayerState.PLAYING
        ) {

            youtubePlayer.pauseVideo();

        } else {

            youtubePlayer.playVideo();

        }

    };


/* -----------------------------
   PREVIOUS
----------------------------- */

window.previousSong =
    function () {

        mahalayaIndex--;


        if (mahalayaIndex < 0) {

            mahalayaIndex =
                mahalayaSongs.length - 1;

        }


        if (youtubePlayer) {

            youtubePlayer.loadVideoById(
                mahalayaSongs[
                    mahalayaIndex
                ].youtubeId
            );

        }


        updateMahalayaInfo();

    };


/* -----------------------------
   NEXT
----------------------------- */

window.nextSong =
    function () {

        mahalayaIndex++;


        if (
            mahalayaIndex >=
            mahalayaSongs.length
        ) {

            mahalayaIndex = 0;

        }


        if (youtubePlayer) {

            youtubePlayer.loadVideoById(
                mahalayaSongs[
                    mahalayaIndex
                ].youtubeId
            );

        }


        updateMahalayaInfo();

    };


/* -----------------------------
   YOUTUBE STATE
----------------------------- */

function onYouTubeStateChange(event) {

    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        if (playButton) {

            playButton.textContent =
                "⏸";

        }

    }


    if (
        event.data ===
        YT.PlayerState.PAUSED
    ) {

        if (playButton) {

            playButton.textContent =
                "▶";

        }

    }


    if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        window.nextSong();

    }

}


/* -----------------------------
   PROGRESS UPDATE
----------------------------- */

setInterval(
    function () {

        if (
            !youtubePlayer ||
            typeof youtubePlayer.getCurrentTime !==
                "function"
        ) {

            return;

        }


        const current =
            youtubePlayer.getCurrentTime();


        const total =
            youtubePlayer.getDuration();


        if (!total) {

            return;

        }


        const percent =
            (
                current /
                total
            ) * 100;


        if (progressBar) {

            progressBar.style.width =
                percent + "%";

        }


        if (currentTime) {

            currentTime.textContent =
                formatTime(current);

        }


        if (duration) {

            duration.textContent =
                formatTime(total);

        }

    },

    500
);


/* -----------------------------
   VOLUME
----------------------------- */

if (volumeSlider) {

    volumeSlider.addEventListener(
        "input",
        function () {

            if (!youtubePlayer) {

                return;

            }


            youtubePlayer.setVolume(
                Number(this.value) * 100
            );

        }
    );

}
    /* =====================================================
       6. BISORJONI MUSIC
    ===================================================== */

    const bisorjoniSongs = [

        {
            title: "বিসর্জনের গান",
            artist: "Bisorjoni Songs",
            src: "music/bisorjoni1.mp3"
        },

        {
            title: "আবার এসো মা",
            artist: "Bisorjoni Songs",
            src: "music/bisorjoni2.mp3"
        },

        {
            title: "বিদায়ের সুর",
            artist: "Bisorjoni Songs",
            src: "music/bisorjoni3.mp3"
        }

    ];


    let bisorjoniIndex = 0;


    const bisorjoniAudio =
        document.getElementById(
            "bisorjoniMusicPlayer"
        );


    const bisorjoniPlayButton =
        document.getElementById(
            "bisorjoniPlayButton"
        );


    const bisorjoniTitle =
        document.getElementById(
            "bisorjoniSongTitle"
        );


    const bisorjoniArtist =
        document.getElementById(
            "bisorjoniSongArtist"
        );


    const bisorjoniProgress =
        document.getElementById(
            "bisorjoniProgressBar"
        );


    const bisorjoniCurrent =
        document.getElementById(
            "bisorjoniCurrentTime"
        );


    const bisorjoniDuration =
        document.getElementById(
            "bisorjoniDuration"
        );


    const bisorjoniVolume =
        document.getElementById(
            "bisorjoniVolumeSlider"
        );


    function loadBisorjoniSong() {

        if (!bisorjoniAudio) {
            return;
        }


        const song =
            bisorjoniSongs[bisorjoniIndex];


        bisorjoniAudio.src =
            song.src;


        if (bisorjoniTitle) {

            bisorjoniTitle.textContent =
                song.title;

        }


        if (bisorjoniArtist) {

            bisorjoniArtist.textContent =
                song.artist;

        }


        if (bisorjoniProgress) {

            bisorjoniProgress.style.width =
                "0%";

        }


        if (bisorjoniCurrent) {

            bisorjoniCurrent.textContent =
                "0:00";

        }


        if (bisorjoniDuration) {

            bisorjoniDuration.textContent =
                "0:00";

        }


        if (bisorjoniPlayButton) {

            bisorjoniPlayButton.textContent =
                "▶";

        }


        bisorjoniAudio.load();

    }


    window.toggleBisorjoniPlay =
        function () {

            if (!bisorjoniAudio) {
                return;
            }


            if (bisorjoniAudio.paused) {

                bisorjoniAudio.play()
                    .then(function () {

                        if (bisorjoniPlayButton) {

                            bisorjoniPlayButton.textContent =
                                "⏸";

                        }

                    })
                    .catch(function (error) {

                        console.log(
                            "Bisorjoni music error:",
                            error
                        );

                        alert(
                            "Bisorjoni music file পাওয়া যাচ্ছে না।"
                        );

                    });

            } else {

                bisorjoniAudio.pause();


                if (bisorjoniPlayButton) {

                    bisorjoniPlayButton.textContent =
                        "▶";

                }

            }

        };


    window.previousBisorjoniSong =
        function () {

            bisorjoniIndex--;


            if (bisorjoniIndex < 0) {

                bisorjoniIndex =
                    bisorjoniSongs.length - 1;

            }


            loadBisorjoniSong();

        };


    window.nextBisorjoniSong =
        function () {

            bisorjoniIndex++;


            if (
                bisorjoniIndex >=
                bisorjoniSongs.length
            ) {

                bisorjoniIndex = 0;

            }


            loadBisorjoniSong();

        };


    if (bisorjoniAudio) {

        bisorjoniAudio.addEventListener(
            "loadedmetadata",
            function () {

                if (bisorjoniDuration) {

                    bisorjoniDuration.textContent =
                        formatTime(
                            bisorjoniAudio.duration
                        );

                }

            }
        );


        bisorjoniAudio.addEventListener(
            "timeupdate",
            function () {

                if (
                    !bisorjoniAudio.duration ||
                    !bisorjoniProgress
                ) {
                    return;
                }


                const percent =
                    (
                        bisorjoniAudio.currentTime /
                        bisorjoniAudio.duration
                    ) * 100;


                bisorjoniProgress.style.width =
                    percent + "%";


                if (bisorjoniCurrent) {

                    bisorjoniCurrent.textContent =
                        formatTime(
                            bisorjoniAudio.currentTime
                        );

                }

            }
        );


        bisorjoniAudio.addEventListener(
            "ended",
            function () {

                window.nextBisorjoniSong();

            }
        );

    }


    if (
        bisorjoniVolume &&
        bisorjoniAudio
    ) {

        bisorjoniVolume.addEventListener(
            "input",
            function () {

                bisorjoniAudio.volume =
                    this.value;

            }
        );

    }



    /* =====================================================
       7. LOAD FIRST SONG
    ===================================================== */

    loadPrePujaSong();

    loadBisorjoniSong();


});
