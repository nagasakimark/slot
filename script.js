const machine = document.querySelector('.machine');
const prestartScreen = document.querySelector('.prestart-screen');
const prestartButton = document.querySelector('.prestart-button');
const coinTrigger = document.querySelector('.coin-trigger');
const nextRoundButton = document.querySelector('.next-round-button');
const roundTracker = document.querySelector('.round-tracker');
const startButton = document.querySelector('.start-button');
const vocabGrid = document.querySelector('.vocab-grid');
const vocabNextButton = document.querySelector('.vocab-next-button');
const phraseCycleButton = document.querySelector('.phrase-cycle-button');
const phraseStartGameButton = document.querySelector('.phrase-start-game-button');
const phraseImage = document.querySelector('.phrase-image');
const phraseWordEn = document.querySelector('.phrase-word-en');
const phraseWordJa = document.querySelector('.phrase-word-ja');
const flyingCoin = document.querySelector('.flying-coin');
const reelStages = Array.from(document.querySelectorAll('.reel-stage'));
const reelTracks = Array.from(document.querySelectorAll('.reel-track'));
const resultButtons = Array.from(document.querySelectorAll('.result-button'));
const spinAudio = new Audio('spin.wav');
const startAudio = new Audio('start.mp3');

spinAudio.preload = 'auto';
startAudio.preload = 'auto';
startAudio.loop = true;

const vegetables = [
    { name: 'Cabbages', japanese: 'キャベツ', src: 'vegetables/cabbages.png' },
    { name: 'Carrots', japanese: 'にんじん', src: 'vegetables/carrots.png' },
    { name: 'Corn', japanese: 'とうもろこし', src: 'vegetables/corn.png' },
    { name: 'Mushrooms', japanese: 'きのこ', src: 'vegetables/mushrooms.png' },
    { name: 'Onions', japanese: 'たまねぎ', src: 'vegetables/onions.png' },
    { name: 'Peas', japanese: 'グリーンピース', src: 'vegetables/peas.png' },
    { name: 'Peppers', japanese: 'ピーマン', src: 'vegetables/peppers.png' },
    { name: 'Potatoes', japanese: 'じゃがいも', src: 'vegetables/potatoes.png' },
    { name: 'Pumpkins', japanese: 'かぼちゃ', src: 'vegetables/pumpkins.png' },
    { name: 'Tomatoes', japanese: 'トマト', src: 'vegetables/tomatoes.png' }
];

const prizePairs = [
    { id: 1, one: 'prizes/1-1.png', two: 'prizes/1-2.png' },
    { id: 2, one: 'prizes/2-1.png', two: 'prizes/2-2.png' },
    { id: 3, one: 'prizes/3-1.png', two: 'prizes/3-2.png' },
    { id: 4, one: 'prizes/4-1.png', two: 'prizes/4-2.png' },
    { id: 5, one: 'prizes/5-1.png', two: 'prizes/5-2.png' },
    { id: 6, one: 'prizes/6-1.png', two: 'prizes/6-2.png' },
    { id: 7, one: 'prizes/7-1.png', two: 'prizes/7-2.png' },
    { id: 8, one: 'prizes/8-1.png', two: 'prizes/8-2.png' },
    { id: 9, one: 'prizes/9-1.png', two: 'prizes/9-2.png' },
    { id: 10, one: 'prizes/10-1.png', two: 'prizes/10-2.jpg' },
    { id: 11, one: 'prizes/11-1.png', two: 'prizes/11-2.png' },
    { id: 12, one: 'prizes/12-1.png', two: 'prizes/12-2.png' },
    { id: 13, one: 'prizes/13-1.png', two: 'prizes/13-2.png' },
    { id: 14, one: 'prizes/14-1.png', two: 'prizes/14-2.png' },
    { id: 15, one: 'prizes/15-1.png', two: 'prizes/15-2.webp' },
    { id: 17, one: 'prizes/17-1.webp', two: 'prizes/17-2.webp' }
];

const allPrizeItems = prizePairs.flatMap((pair) => ([
    { name: `Prize ${pair.id}-1`, src: pair.one },
    { name: `Prize ${pair.id}-2`, src: pair.two }
]));

let isSpinning = false;
const currentReelResults = [vegetables[1], vegetables[2]];
let availablePrizePairs = [];
let availableVegetablePairs = [];
let currentPrizeRound = null;
let revealedSides = { left: false, right: false };
let spinDurationMs = 2500;
const totalPrizeRounds = prizePairs.length;
let startScreenActive = true;
let introAnimations = [];
let startAudioUnlocked = false;
let prestartComplete = false;
let introStage = 'start';
let phraseVegetableIndex = 0;
let startAudioFadeTimer = null;

vegetables.forEach((vegetable) => {
    const preloadedImage = new Image();
    preloadedImage.src = vegetable.src;
});

prizePairs.forEach((pair) => {
    [pair.one, pair.two].forEach((src) => {
        const preloadedImage = new Image();
        preloadedImage.src = src;
    });
});

function playStartAudio() {
    if (startAudioFadeTimer) {
        window.clearInterval(startAudioFadeTimer);
        startAudioFadeTimer = null;
    }

    startAudioUnlocked = true;
    startAudio.volume = 1;
    const playPromise = startAudio.play();

    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
    }
}

function stopStartAudio() {
    if (startAudioFadeTimer) {
        window.clearInterval(startAudioFadeTimer);
        startAudioFadeTimer = null;
    }

    startAudio.pause();
    startAudio.currentTime = 0;
    startAudio.volume = 1;
}

function fadeOutStartAudio(durationMs = 700) {
    if (startAudio.paused) {
        stopStartAudio();
        return;
    }

    if (startAudioFadeTimer) {
        window.clearInterval(startAudioFadeTimer);
    }

    const initialVolume = startAudio.volume;

    if (initialVolume <= 0) {
        stopStartAudio();
        return;
    }

    const stepMs = 50;
    const steps = Math.max(1, Math.ceil(durationMs / stepMs));
    let currentStep = 0;

    startAudioFadeTimer = window.setInterval(() => {
        currentStep += 1;
        const nextVolume = Math.max(0, initialVolume * (1 - (currentStep / steps)));
        startAudio.volume = nextVolume;

        if (currentStep >= steps || nextVolume <= 0.01) {
            stopStartAudio();
        }
    }, stepMs);
}

function setIntroStage(stage) {
    introStage = stage;
    machine.classList.toggle('start-screen-active', stage === 'start');
    machine.classList.toggle('vocab-screen-active', stage === 'vocab');
    machine.classList.toggle('phrase-screen-active', stage === 'phrase');
    startScreenActive = stage !== 'game';
}

function populateVocabGrid() {
    vocabGrid.innerHTML = '';

    vegetables.forEach((vegetable) => {
        const item = document.createElement('div');
        const circle = document.createElement('div');
        const image = document.createElement('img');
        const label = document.createElement('div');

        item.className = 'vocab-item';
        circle.className = 'vocab-circle';
        label.className = 'vocab-label';
        image.src = vegetable.src;
        image.alt = vegetable.name;
        label.textContent = vegetable.name;

        circle.appendChild(image);
        item.appendChild(circle);
        item.appendChild(label);
        vocabGrid.appendChild(item);
    });
}

function updatePhraseCard() {
    const vegetable = vegetables[phraseVegetableIndex];

    phraseImage.src = vegetable.src;
    phraseImage.alt = vegetable.name;
    phraseWordEn.textContent = `I like ${vegetable.name}`;
    phraseWordJa.textContent = `${vegetable.japanese}が好きです`;
}

function ensureStartAudio() {
    if (introStage !== 'start' || !prestartComplete || startAudioUnlocked) {
        return;
    }

    playStartAudio();
}

function activateStartScreen() {
    if (prestartComplete) {
        return;
    }

    prestartComplete = true;
    prestartScreen.classList.add('hidden');
    setIntroStage('start');
    playStartAudio();
    startIntroReels();
}

function shuffleArray(items) {
    const copy = items.slice();

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }

    return copy;
}

function refillPrizePairs() {
    availablePrizePairs = shuffleArray(prizePairs);
}

function updateRoundTracker() {
    const currentRoundNumber = totalPrizeRounds - availablePrizePairs.length;
    roundTracker.textContent = `ROUND ${currentRoundNumber}/${totalPrizeRounds}`;
}

function refillVegetablePairs() {
    const allPairs = [];

    for (let leftIndex = 0; leftIndex < vegetables.length - 1; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < vegetables.length; rightIndex += 1) {
            allPairs.push([vegetables[leftIndex], vegetables[rightIndex]]);
        }
    }

    availableVegetablePairs = shuffleArray(allPairs);
}

function prepareRound() {
    if (availablePrizePairs.length === 0) {
        refillPrizePairs();
    }

    const pair = availablePrizePairs.pop();
    const swapSides = Math.random() < 0.5;

    updateRoundTracker();

    currentPrizeRound = {
        pairId: pair.id,
        left: swapSides ? pair.two : pair.one,
        right: swapSides ? pair.one : pair.two
    };

    revealedSides = { left: false, right: false };
    nextRoundButton.disabled = true;
    coinTrigger.disabled = false;

    resultButtons.forEach((button) => {
        button.classList.remove('ready', 'revealed');
        button.disabled = true;
        button.closest('.reel-stage').classList.remove('reveal-ready');
        const vegetableImage = button.querySelector('.result-vegetable');
        const prizeImage = button.querySelector('.result-prize');
        vegetableImage.alt = '';
        prizeImage.alt = '';
    });
}

function setRevealContent(side, vegetable, prizeSrc) {
    const button = resultButtons.find((entry) => entry.dataset.side === side);
    const reelStage = button.closest('.reel-stage');
    const vegetableImage = button.querySelector('.result-vegetable');
    const prizeImage = button.querySelector('.result-prize');

    vegetableImage.src = vegetable.src;
    vegetableImage.alt = vegetable.name;
    prizeImage.src = prizeSrc;
    prizeImage.alt = `Prize for ${side}`;

    reelStage.classList.add('reveal-ready');
    button.classList.add('ready');
    button.classList.remove('revealed');
    button.disabled = false;
}

function maybeEnableNextRound() {
    if (revealedSides.left && revealedSides.right) {
        nextRoundButton.disabled = false;
    }
}

function revealPrize(side) {
    if (!currentPrizeRound || revealedSides[side]) {
        return;
    }

    const button = resultButtons.find((entry) => entry.dataset.side === side);
    revealedSides[side] = true;
    button.classList.add('revealed');
    button.disabled = true;
    maybeEnableNextRound();
}

function createReelCell(vegetable) {
    const reelCell = document.createElement('div');
    const image = document.createElement('img');

    reelCell.className = 'reel-cell';
    image.src = vegetable.src;
    image.alt = vegetable.name;
    image.draggable = false;
    reelCell.appendChild(image);

    return reelCell;
}

function renderReelTrack(trackElement, sequence) {
    trackElement.innerHTML = '';

    sequence.forEach((vegetable) => {
        trackElement.appendChild(createReelCell(vegetable));
    });

    trackElement.style.transform = 'translateY(0)';
}

function stopIntroReels() {
    introAnimations.forEach((animation) => animation.cancel());
    introAnimations = [];
}

function startIntroReels() {
    stopIntroReels();

    const leftSequence = allPrizeItems.concat(allPrizeItems);
    const rightBase = allPrizeItems.slice().reverse();
    const rightSequence = rightBase.concat(rightBase);

    reelTracks.forEach((track, index) => {
        const sequence = index === 0 ? leftSequence : rightSequence;
        const stage = reelStages[index];
        const singleCycleDistance = stage.clientHeight * (sequence.length / 2);
        renderReelTrack(track, sequence);

        const keyframes = index === 0
            ? [
                { transform: 'translateY(0)' },
                { transform: `translateY(-${singleCycleDistance}px)` }
            ]
            : [
                { transform: `translateY(-${singleCycleDistance}px)` },
                { transform: 'translateY(0)' }
            ];

        if (index === 1) {
            track.style.transform = `translateY(-${singleCycleDistance}px)`;
        }

        const animation = track.animate(keyframes, {
            duration: 11500,
            easing: 'linear',
            iterations: Infinity
        });

        introAnimations.push(animation);
    });
}

function chooseDistinctVegetables() {
    if (availableVegetablePairs.length === 0) {
        refillVegetablePairs();
    }

    const [leftVegetable, rightVegetable] = availableVegetablePairs.pop();

    if (Math.random() < 0.5) {
        return [rightVegetable, leftVegetable];
    }

    return [leftVegetable, rightVegetable];
}

function buildSpinSequence(currentVegetable, finalVegetable, offset) {
    const orderedVegetables = vegetables.slice(offset).concat(vegetables.slice(0, offset));
    const sequence = [];

    sequence.push(currentVegetable);

    for (let cycle = 0; cycle < 5; cycle += 1) {
        sequence.push(...orderedVegetables);
    }

    sequence.push(
        orderedVegetables[2 % orderedVegetables.length],
        orderedVegetables[5 % orderedVegetables.length],
        orderedVegetables[8 % orderedVegetables.length],
        finalVegetable
    );

    return sequence;
}

function animateCoinInsert() {
    const machineRect = machine.getBoundingClientRect();
    const coinSize = Math.max(52, Math.min(96, machineRect.width * 0.075));
    const endX = machineRect.left + (machineRect.width * 0.885) - (coinSize / 2);
    const startX = endX;
    const startY = window.innerHeight + coinSize;
    const endY = machineRect.top + (machineRect.height * 0.49) - (coinSize / 2);

    flyingCoin.style.width = `${coinSize}px`;
    flyingCoin.style.height = `${coinSize}px`;
    flyingCoin.style.opacity = '1';

    const animation = flyingCoin.animate(
        [
            {
                transform: `translate(${startX}px, ${startY}px)`,
                opacity: 1
            },
            {
                transform: `translate(${endX}px, ${endY}px)`,
                opacity: 1,
                offset: 0.9
            },
            {
                transform: `translate(${endX}px, ${endY}px)`,
                opacity: 0
            }
        ],
        {
            duration: 900,
            easing: 'cubic-bezier(0.2, 0.8, 0.28, 1)',
            fill: 'forwards'
        }
    );

    const soundTriggerDelay = 250;
    const soundTrigger = new Promise((resolve) => {
        window.setTimeout(() => {
            playSpinSound();
            resolve();
        }, soundTriggerDelay);
    });

    return Promise.all([
        soundTrigger,
        animation.finished.finally(() => {
            flyingCoin.style.opacity = '0';
            flyingCoin.style.transform = 'translate(-9999px, -9999px)';
        })
    ]);
}

function playSpinSound() {
    spinAudio.pause();
    spinAudio.currentTime = 0;

    const playPromise = spinAudio.play();

    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
    }
}

function spinReel(reelIndex, finalVegetable, durationMs) {
    const reelStage = reelStages[reelIndex];
    const reelTrack = reelTracks[reelIndex];
    const baseSequence = buildSpinSequence(currentReelResults[reelIndex], finalVegetable, (reelIndex * 4 + 1) % vegetables.length);
    const spinsDownward = reelIndex === 1;
    const sequence = spinsDownward ? baseSequence.slice().reverse() : baseSequence;
    const travelDistance = reelStage.clientHeight * (sequence.length - 1);
    const keyframes = spinsDownward
        ? [
            { transform: `translateY(-${travelDistance}px)` },
            { transform: 'translateY(0)' }
        ]
        : [
            { transform: 'translateY(0)' },
            { transform: `translateY(-${travelDistance}px)` }
        ];

    reelStage.classList.add('spinning');
    renderReelTrack(reelTrack, sequence);

    if (spinsDownward) {
        reelTrack.style.transform = `translateY(-${travelDistance}px)`;
    }

    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            const animation = reelTrack.animate(
                keyframes,
                {
                    duration: durationMs,
                    easing: 'cubic-bezier(0.08, 0.6, 0.14, 1)',
                    fill: 'forwards'
                }
            );

            animation.finished.then(() => {
                reelStage.classList.remove('spinning');
                currentReelResults[reelIndex] = finalVegetable;
                animation.cancel();
                renderReelTrack(reelTrack, [finalVegetable]);
                resolve();
            });
        });
    });
}

async function runSlotMachine() {
    if (isSpinning || introStage !== 'game') {
        return;
    }

    isSpinning = true;
    coinTrigger.disabled = true;
    nextRoundButton.disabled = true;

    resultButtons.forEach((button) => {
        button.classList.remove('ready', 'revealed');
        button.disabled = true;
    });

    try {
        const [leftVegetable, rightVegetable] = chooseDistinctVegetables();

        await animateCoinInsert();

        await Promise.all([
            spinReel(0, leftVegetable, spinDurationMs),
            spinReel(1, rightVegetable, spinDurationMs)
        ]);

        setRevealContent('left', leftVegetable, currentPrizeRound.left);
        setRevealContent('right', rightVegetable, currentPrizeRound.right);
    } finally {
        isSpinning = false;
    }
}

renderReelTrack(reelTracks[0], [currentReelResults[0]]);
renderReelTrack(reelTracks[1], [currentReelResults[1]]);
refillPrizePairs();
refillVegetablePairs();
prepareRound();
populateVocabGrid();
updatePhraseCard();
setIntroStage('start');

window.addEventListener('pointerdown', ensureStartAudio, { once: true });
window.addEventListener('keydown', ensureStartAudio, { once: true });

coinTrigger.addEventListener('click', runSlotMachine);
resultButtons.forEach((button) => {
    button.addEventListener('click', () => revealPrize(button.dataset.side));
});
nextRoundButton.addEventListener('click', prepareRound);
prestartButton.addEventListener('click', activateStartScreen);
startButton.addEventListener('click', async () => {
    if (introStage !== 'start' || !prestartComplete) {
        return;
    }

    fadeOutStartAudio();
    stopIntroReels();
    setIntroStage('vocab');
});

vocabNextButton.addEventListener('click', () => {
    if (introStage !== 'vocab') {
        return;
    }

    setIntroStage('phrase');
});

phraseCycleButton.addEventListener('click', () => {
    phraseVegetableIndex = (phraseVegetableIndex + 1) % vegetables.length;
    updatePhraseCard();
});

phraseStartGameButton.addEventListener('click', async () => {
    if (introStage !== 'phrase') {
        return;
    }

    setIntroStage('game');
    renderReelTrack(reelTracks[0], [currentReelResults[0]]);
    renderReelTrack(reelTracks[1], [currentReelResults[1]]);
    await runSlotMachine();
});
