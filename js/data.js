// ============================================================
//  TOAD'S PRIZE MACHINE — data
// ============================================================
'use strict';

const CATEGORY_ITEMS = {
    animals: {
        items: [
            { name: 'Cats', japanese: 'ねこ', src: 'animals/cats.png' },
            { name: 'Chickens', japanese: 'にわとり', src: 'animals/chickens.png' },
            { name: 'Cows', japanese: 'うし', src: 'animals/cows.png' },
            { name: 'Dogs', japanese: 'いぬ', src: 'animals/dogs.png' },
            { name: 'Ducks', japanese: 'あひる', src: 'animals/ducks.png' },
            { name: 'Hamsters', japanese: 'ハムスター', src: 'animals/hamsters.png' },
            { name: 'Horses', japanese: 'うま', src: 'animals/horses.png' },
            { name: 'Pigs', japanese: 'ぶた', src: 'animals/pigs.png' },
            { name: 'Rabbits', japanese: 'うさぎ', src: 'animals/rabbits.png' }
        ]
    },
    animals2: {
        items: [
            { name: 'Bear', japanese: 'くま', src: 'animals2/bear.png' },
            { name: 'Elephant', japanese: 'ぞう', src: 'animals2/elephant.png' },
            { name: 'Gorilla', japanese: 'ゴリラ', src: 'animals2/gorilla.png' },
            { name: 'Hippo', japanese: 'カバ', src: 'animals2/hippo.png' },
            { name: 'Lion', japanese: 'ライオン', src: 'animals2/lion.png' },
            { name: 'Monkey', japanese: 'さる', src: 'animals2/monkey.png' },
            { name: 'Panda', japanese: 'パンダ', src: 'animals2/panda.png' },
            { name: 'Spider', japanese: 'くも', src: 'animals2/spider.png' },
            { name: 'Tiger', japanese: 'とら', src: 'animals2/tiger.png' },
            { name: 'Zebra', japanese: 'しまうま', src: 'animals2/zebra.png' }
        ]
    },
    colors: {
        items: [
            { name: 'Black', japanese: 'くろ', src: 'colors/black.png' },
            { name: 'Blue', japanese: 'あお', src: 'colors/blue.png' },
            { name: 'Brown', japanese: 'ちゃいろ', src: 'colors/brown.png' },
            { name: 'Gray', japanese: 'はいいろ', src: 'colors/gray.png' },
            { name: 'Green', japanese: 'みどり', src: 'colors/green.png' },
            { name: 'Orange', japanese: 'オレンジ', src: 'colors/orange.png' },
            { name: 'Pink', japanese: 'ピンク', src: 'colors/pink.png' },
            { name: 'Purple', japanese: 'むらさき', src: 'colors/purple.png' },
            { name: 'Red', japanese: 'あか', src: 'colors/red.png' },
            { name: 'White', japanese: 'しろ', src: 'colors/white.png' },
            { name: 'Yellow', japanese: 'きいろ', src: 'colors/yellow.png' }
        ]
    },
    days: {
        items: [
            { name: 'Monday', japanese: 'げつようび', src: 'days/monday.png' },
            { name: 'Tuesday', japanese: 'かようび', src: 'days/tuesday.png' },
            { name: 'Wednesday', japanese: 'すいようび', src: 'days/wednesday.png' },
            { name: 'Thursday', japanese: 'もくようび', src: 'days/thursday.png' },
            { name: 'Friday', japanese: 'きんようび', src: 'days/friday.png' },
            { name: 'Saturday', japanese: 'どようび', src: 'days/saturday.png' },
            { name: 'Sunday', japanese: 'にちようび', src: 'days/sunday.png' }
        ]
    },
    fruits: {
        items: [
            { name: 'Apples', japanese: 'りんご', src: 'fruits/apples.png' },
            { name: 'Bananas', japanese: 'バナナ', src: 'fruits/bananas.png' },
            { name: 'Cherries', japanese: 'さくらんぼ', src: 'fruits/cherries.png' },
            { name: 'Grapefruits', japanese: 'グレープフルーツ', src: 'fruits/grapefruits.png' },
            { name: 'Grapes', japanese: 'ぶどう', src: 'fruits/grapes.png' },
            { name: 'Oranges', japanese: 'オレンジ', src: 'fruits/oranges.png' },
            { name: 'Peaches', japanese: 'もも', src: 'fruits/peaches.png' },
            { name: 'Pears', japanese: 'なし', src: 'fruits/pears.png' },
            { name: 'Pineapples', japanese: 'パイナップル', src: 'fruits/pineapples.png' }
        ]
    },
    months: {
        items: [
            { name: 'January', japanese: 'いちがつ', src: 'months/january.png' },
            { name: 'February', japanese: 'にがつ', src: 'months/february.png' },
            { name: 'March', japanese: 'さんがつ', src: 'months/march.png' },
            { name: 'April', japanese: 'しがつ', src: 'months/april.png' },
            { name: 'May', japanese: 'ごがつ', src: 'months/may.png' },
            { name: 'June', japanese: 'ろくがつ', src: 'months/june.png' },
            { name: 'July', japanese: 'しちがつ', src: 'months/july.png' },
            { name: 'August', japanese: 'はちがつ', src: 'months/august.png' },
            { name: 'September', japanese: 'くがつ', src: 'months/september.png' },
            { name: 'October', japanese: 'じゅうがつ', src: 'months/october.png' },
            { name: 'November', japanese: 'じゅういちがつ', src: 'months/november.png' },
            { name: 'December', japanese: 'じゅうにがつ', src: 'months/december.png' }
        ]
    },
    prefectures: {
        items: [
            { name: 'Aichi', japanese: 'あいち', src: 'prefectures/aichi.png' },
            { name: 'Chiba', japanese: 'ちば', src: 'prefectures/chiba.png' },
            { name: 'Fukuoka', japanese: 'ふくおか', src: 'prefectures/fukuoka.png' },
            { name: 'Hokkaido', japanese: 'ほっかいどう', src: 'prefectures/hokkaido.png' },
            { name: 'Hyogo', japanese: 'ひょうご', src: 'prefectures/hyogo.png' },
            { name: 'Kanagawa', japanese: 'かながわ', src: 'prefectures/kanagawa.png' },
            { name: 'Osaka', japanese: 'おおさか', src: 'prefectures/osaka.png' },
            { name: 'Saitama', japanese: 'さいたま', src: 'prefectures/saitama.png' },
            { name: 'Shizuoka', japanese: 'しずおか', src: 'prefectures/shizuoka.png' },
            { name: 'Tokyo', japanese: 'とうきょう', src: 'prefectures/tokyo.png' }
        ]
    },
    'sea-animals': {
        items: [
            { name: 'Crab', japanese: 'かに', src: 'sea-animals/crab.png' },
            { name: 'Dolphin', japanese: 'いるか', src: 'sea-animals/dolphin.png' },
            { name: 'Fish', japanese: 'さかな', src: 'sea-animals/fish.png' },
            { name: 'Jellyfish', japanese: 'くらげ', src: 'sea-animals/jellyfish.png' },
            { name: 'Octopus', japanese: 'たこ', src: 'sea-animals/octopus.png' },
            { name: 'Penguin', japanese: 'ペンギン', src: 'sea-animals/penguin.png' },
            { name: 'Shark', japanese: 'さめ', src: 'sea-animals/shark.png' },
            { name: 'Squid', japanese: 'いか', src: 'sea-animals/squid.png' },
            { name: 'Turtle', japanese: 'かめ', src: 'sea-animals/turtle.png' },
            { name: 'Whale', japanese: 'くじら', src: 'sea-animals/whale.png' }
        ]
    },
    seasons: {
        items: [
            { name: 'Spring', japanese: 'はる', src: 'seasons/spring.png' },
            { name: 'Summer', japanese: 'なつ', src: 'seasons/summer.png' },
            { name: 'Autumn', japanese: 'あき', src: 'seasons/autumn.png' },
            { name: 'Winter', japanese: 'ふゆ', src: 'seasons/winter.png' }
        ]
    },
    sports: {
        items: [
            { name: 'Badminton', japanese: 'バドミントン', src: 'sports/badminton.png' },
            { name: 'Baseball', japanese: 'やきゅう', src: 'sports/baseball.png' },
            { name: 'Basketball', japanese: 'バスケットボール', src: 'sports/basketball.png' },
            { name: 'Dodgeball', japanese: 'ドッジボール', src: 'sports/dodgeball.png' },
            { name: 'Soccer', japanese: 'サッカー', src: 'sports/soccer.png' },
            { name: 'Table Tennis', japanese: 'たっきゅう', src: 'sports/tabletennis.png' },
            { name: 'Tennis', japanese: 'テニス', src: 'sports/tennis.png' },
            { name: 'Volleyball', japanese: 'バレーボール', src: 'sports/volleyball.png' }
        ]
    },
    vegetables: {
        items: [
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
        ]
    },
    feelings: {
        items: [
            { name: 'Happy', japanese: 'うれしい', src: 'feelings/happy.png' },
            { name: 'Sad', japanese: 'かなしい', src: 'feelings/sad.png' },
            { name: 'Angry', japanese: 'おこっている', src: 'feelings/angry.png' },
            { name: 'Hungry', japanese: 'おなかがすいた', src: 'feelings/hungry.png' },
            { name: 'Sleepy', japanese: 'ねむい', src: 'feelings/sleepy.png' },
            { name: 'Tired', japanese: 'つかれた', src: 'feelings/tired.png' },
            { name: 'Hot', japanese: 'あつい', src: 'feelings/hot.png' },
            { name: 'Cold', japanese: 'さむい', src: 'feelings/cold.png' }
        ]
    }
};


const CATEGORY_INFO = {
  animals:       { label: 'Animals',     color: '#f4a261' },
  animals2:      { label: 'Animals 2',   color: '#e76f51', plural: { Bear: 'bears', Elephant: 'elephants', Gorilla: 'gorillas', Hippo: 'hippos', Lion: 'lions', Monkey: 'monkeys', Panda: 'pandas', Spider: 'spiders', Tiger: 'tigers', Zebra: 'zebras' } },
  colors:        { label: 'Colors',      color: '#9b5de5' },
  days:          { label: 'Days',        color: '#00a6e0', proper: true },
  fruits:        { label: 'Fruits',      color: '#ff4d6d' },
  months:        { label: 'Months',      color: '#00b894', proper: true },
  prefectures:   { label: 'Prefectures', color: '#ef476f', proper: true },
  'sea-animals': { label: 'Sea Animals', color: '#3aa0ff', plural: { Crab: 'crabs', Dolphin: 'dolphins', Octopus: 'octopuses', Penguin: 'penguins', Shark: 'sharks', Turtle: 'turtles', Whale: 'whales' } },
  seasons:       { label: 'Seasons',     color: '#6ab04c' },
  sports:        { label: 'Sports',      color: '#f94144' },
  vegetables:    { label: 'Vegetables',  color: '#2e9e5b' },
  feelings:      { label: 'Feelings',    color: '#ff9f1c', feelings: true }
};

const PRIZE_PAIRS = [
  ['prizes/1-1.png', 'prizes/1-2.png'], ['prizes/2-1.png', 'prizes/2-2.png'], ['prizes/3-1.png', 'prizes/3-2.png'],
  ['prizes/4-1.png', 'prizes/4-2.png'], ['prizes/5-1.png', 'prizes/5-2.png'], ['prizes/6-1.png', 'prizes/6-2.png'],
  ['prizes/7-1.png', 'prizes/7-2.png'], ['prizes/8-1.png', 'prizes/8-2.png'], ['prizes/9-1.png', 'prizes/9-2.png'],
  ['prizes/10-1.png', 'prizes/10-2.jpg'], ['prizes/11-1.png', 'prizes/11-2.png'], ['prizes/12-1.png', 'prizes/12-2.png'],
  ['prizes/13-1.png', 'prizes/13-2.png'], ['prizes/14-1.png', 'prizes/14-2.png'], ['prizes/15-1.png', 'prizes/15-2.webp'],
  ['prizes/16-1.avif', 'prizes/16-2.png'], ['prizes/17-1.webp', 'prizes/17-2.webp'], ['prizes/18-1.png', 'prizes/18-2.webp'],
  ['prizes/19-1.png', 'prizes/19-2.png'], ['prizes/20-1.png', 'prizes/20-2.png'], ['prizes/21-1.webp', 'prizes/21-2.png'],
  ['prizes/22-1.png', 'prizes/22-2.webp']
];

const CHARACTERS = ['toad2.gif', 'mario.webp', 'luigi.gif'];
const REVEAL_LINES = ['WOW!', 'AMAZING!', 'YAHOO!', 'SUPER!', 'NICE!', 'WAHOO!'];

// "I like apples!" / "I am happy!" and the Japanese line
function sentenceEn(key, item) {
  const info = CATEGORY_INFO[key];
  if (info.feelings) return `I am ${item.name.toLowerCase()}.`;
  const word = (info.plural && info.plural[item.name]) || item.name;
  return `I like ${info.proper ? word : word.toLowerCase()}.`;
}
function sentenceJa(key, item) {
  return CATEGORY_INFO[key].feelings ? `${item.japanese}です` : `${item.japanese}が好きです`;
}
function questionEn(key) { return CATEGORY_INFO[key].feelings ? 'How are you?' : 'What do you like?'; }
function questionJa(key) { return CATEGORY_INFO[key].feelings ? 'げんきですか？' : 'なにが好きですか？'; }
