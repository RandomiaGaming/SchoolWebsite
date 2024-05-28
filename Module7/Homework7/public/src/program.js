function TrustMeClickIt() {
    var soundPlayers = [];

    soundPlayers.push(document.getElementById("soundPlayer1"));
    soundPlayers.push(document.getElementById("soundPlayer2"));
    soundPlayers.push(document.getElementById("soundPlayer3"));

    soundPlayers.forEach(function (soundPlayer) {
        soundPlayer.pause();
        soundPlayer.currentTime = 0;
    });

    soundPlayers[Math.floor(Math.random() * soundPlayers.length)].play();
}