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
       4. PRE-PUJA MUSIC
    ===================================================== */

    const prePujaSongs = [

        {
            title: "পুজোর আগমনী",
            artist: "Pre-Puja Vibes",
            src: "music/puja1.mp3"
        },

        {
            title: "মা আসছে",
            artist: "Pre-Puja Vibes",
            src: "music/puja2.mp3"
        },

        {
            title: "আগমনী সুর",
            artist: "Pre-Puja Vibes",
            src: "music/puja3.mp3"
        }

    ];


    let prePujaIndex = 0;


    const prePujaAudio =
        document.getElementById(
            "prePujaMusicPlayer"
        );


    const prePujaPlayButton =
        document.getElementById(
            "prePujaPlayButton"
        );


    const prePujaTitle =
        document.getElementById(
            "prePujaSongTitle"
        );


    const prePujaArtist =
        document.getElementById(
            "prePujaSongArtist"
        );


    const prePujaProgress =
        document.getElementById(
            "prePujaProgressBar"
        );


    const prePujaCurrentTime =
        document.getElementById(
            "prePujaCurrentTime"
        );


    const prePujaDuration =
        document.getElementById(
            "prePujaDuration"
        );


    const prePujaVolume =
        document.getElementById(
            "prePujaVolumeSlider"
        );


    function loadPrePujaSong() {

        if (!prePujaAudio) {
            return;
        }


        const song =
            prePujaSongs[prePujaIndex];


        prePujaAudio.src =
            song.src;


        if (prePujaTitle) {

            prePujaTitle.textContent =
                song.title;

        }


        if (prePujaArtist) {

            prePujaArtist.textContent =
                song.artist;

        }


        if (prePujaProgress) {

            prePujaProgress.style.width =
                "0%";

        }


        if (prePujaCurrentTime) {

            prePujaCurrentTime.textContent =
                "0:00";

        }


        if (prePujaDuration) {

            prePujaDuration.textContent =
                "0:00";

        }


        if (prePujaPlayButton) {

            prePujaPlayButton.textContent =
                "▶";

        }


        prePujaAudio.load();

    }


    window.togglePrePujaPlay =
        function () {

            if (!prePujaAudio) {
                return;
            }


            if (prePujaAudio.paused) {

                prePujaAudio.play()
                    .then(function () {

                        if (prePujaPlayButton) {

                            prePujaPlayButton.textContent =
                                "⏸";

                        }

                    })
                    .catch(function (error) {

                        console.log(
                            "Pre-Puja music error:",
                            error
                        );

                        alert(
                            "puja1.mp3 / puja2.mp3 / puja3.mp3 ফাইলের নাম এবং location check করো।"
                        );

                    });

            } else {

                prePujaAudio.pause();


                if (prePujaPlayButton) {

                    prePujaPlayButton.textContent =
                        "▶";

                }

            }

        };


    window.previousPrePujaSong =
        function () {

            if (!prePujaSongs.length) {
                return;
            }


            prePujaIndex--;


            if (prePujaIndex < 0) {

                prePujaIndex =
                    prePujaSongs.length - 1;

            }


            loadPrePujaSong();


            prePujaAudio.play()
                .then(function () {

                    if (prePujaPlayButton) {

                        prePujaPlayButton.textContent =
                            "⏸";

                    }

                })
                .catch(function () {});

        };


    window.nextPrePujaSong =
        function () {

            if (!prePujaSongs.length) {
                return;
            }


            prePujaIndex++;


            if (
                prePujaIndex >=
                prePujaSongs.length
            ) {

                prePujaIndex = 0;

            }


            loadPrePujaSong();


            prePujaAudio.play()
                .then(function () {

                    if (prePujaPlayButton) {

                        prePujaPlayButton.textContent =
                            "⏸";

                    }

                })
                .catch(function () {});

        };


    if (prePujaAudio) {

        prePujaAudio.addEventListener(
            "loadedmetadata",
            function () {

                if (prePujaDuration) {

                    prePujaDuration.textContent =
                        formatTime(
                            prePujaAudio.duration
                        );

                }

            }
        );


        prePujaAudio.addEventListener(
            "timeupdate",
            function () {

                if (
                    !prePujaAudio.duration ||
                    !prePujaProgress
                ) {
                    return;
                }


                const percent =
                    (
                        prePujaAudio.currentTime /
                        prePujaAudio.duration
                    ) * 100;


                prePujaProgress.style.width =
                    percent + "%";


                if (prePujaCurrentTime) {

                    prePujaCurrentTime.textContent =
                        formatTime(
                            prePujaAudio.currentTime
                        );

                }

            }
        );


        prePujaAudio.addEventListener(
            "ended",
            function () {

                window.nextPrePujaSong();

            }
        );

    }


    if (prePujaVolume && prePujaAudio) {

        prePujaVolume.addEventListener(
            "input",
            function () {

                prePujaAudio.volume =
                    this.value;

            }
        );

    }



    /* =====================================================
       5. MAHALAYA MUSIC
    ===================================================== */

    const mahalayaSongs = [

        {
            title: "মহালয়ার আগমনী",
            artist: "Mahalaya Hits",
            src: "music/mahalaya1.mp3"
        },

        {
            title: "আগমনী গান",
            artist: "Mahalaya Hits",
            src: "music/mahalaya2.mp3"
        },

        {
            title: "মহালয়ার সুর",
            artist: "Mahalaya Hits",
            src: "music/mahalaya3.mp3"
        }

    ];


    let mahalayaIndex = 0;


    const musicAudio =
        document.getElementById(
            "musicPlayer"
        );


    const playButton =
        document.getElementById(
            "playButton"
        );


    const songTitle =
        document.getElementById(
            "songTitle"
        );


    const songArtist =
        document.getElementById(
            "songArtist"
        );


    const progressBar =
        document.getElementById(
            "progressBar"
        );


    const currentTime =
        document.getElementById(
            "currentTime"
        );


    const duration =
        document.getElementById(
            "duration"
        );


    const volumeSlider =
        document.getElementById(
            "volumeSlider"
        );


    function loadMahalayaSong() {

        if (!musicAudio) {
            return;
        }


        const song =
            mahalayaSongs[mahalayaIndex];


        musicAudio.src =
            song.src;


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


        musicAudio.load();

    }


    window.togglePlay =
        function () {

            if (!musicAudio) {
                return;
            }


            if (musicAudio.paused) {

                musicAudio.play()
                    .then(function () {

                        if (playButton) {

                            playButton.textContent =
                                "⏸";

                        }

                    })
                    .catch(function (error) {

                        console.log(
                            "Mahalaya music error:",
                            error
                        );

                        alert(
                            "Mahalaya music file পাওয়া যাচ্ছে না।"
                        );

                    });

            } else {

                musicAudio.pause();


                if (playButton) {

                    playButton.textContent =
                        "▶";

                }

            }

        };


    window.previousSong =
        function () {

            mahalayaIndex--;


            if (mahalayaIndex < 0) {

                mahalayaIndex =
                    mahalayaSongs.length - 1;

            }


            loadMahalayaSong();

        };


    window.nextSong =
        function () {

            mahalayaIndex++;


            if (
                mahalayaIndex >=
                mahalayaSongs.length
            ) {

                mahalayaIndex = 0;

            }


            loadMahalayaSong();

        };


    if (musicAudio) {

        musicAudio.addEventListener(
            "loadedmetadata",
            function () {

                if (duration) {

                    duration.textContent =
                        formatTime(
                            musicAudio.duration
                        );

                }

            }
        );


        musicAudio.addEventListener(
            "timeupdate",
            function () {

                if (
                    !musicAudio.duration ||
                    !progressBar
                ) {
                    return;
                }


                const percent =
                    (
                        musicAudio.currentTime /
                        musicAudio.duration
                    ) * 100;


                progressBar.style.width =
                    percent + "%";


                if (currentTime) {

                    currentTime.textContent =
                        formatTime(
                            musicAudio.currentTime
                        );

                }

            }
        );


        musicAudio.addEventListener(
            "ended",
            function () {

                window.nextSong();

            }
        );

    }


    if (volumeSlider && musicAudio) {

        volumeSlider.addEventListener(
            "input",
            function () {

                musicAudio.volume =
                    this.value;

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

    loadMahalayaSong();

    loadBisorjoniSong();


});