const events = [
  "Találsz egy csillogó kavicsot. +0 szerencse.",
  "Egy kobold megkérdezi, hogy van-e nálad wifi.",
  "Rálépsz egy csapdára. Szerencsére ki volt kapcsolva.",
  "Egy rejtélyes hang azt suttogja: 'Menj haza, Béla.'",
  "Egy csiga megelőz. Köhécselve kinevet.",
  "Egy kobold megkínál energiatallal.",
  "Egy csontváz panaszkodik a derékfájására.",
  "Egy mimic megpróbál beszélgetni.",
  "Egy troll NFT-ket akar eladni.",
  "Találsz egy régi térképet. Érthetetlen."
];

export function randomEvent() {
  return events[Math.floor(Math.random() * events.length)];
}