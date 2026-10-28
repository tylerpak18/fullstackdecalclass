export interface Character {
  id: string;
  name: string;
  bounty: number | null;
  image: string;
  fullImage?: string;
  crew: string;
  role: string;
  age: number | null;
  height: string;
  status: string;
}


export const characters: Character[] = [
  {
    id: "luffy",
    name: "Monkey D. Luffy",
    bounty: 3000000000,
    image: "/images/luffy.jpg",
    fullImage: "/images/luffy-full.png",
    crew: "Straw Hat Pirates",
    role: "Captain",
    age: 19,
    height: "174 cm",
    status: "Alive",
  },
  {
    id: "zoro",
    name: "Roronoa Zoro",
    bounty: 1111000000,
    image: "/images/zoro.jpg",
    fullImage: "/images/zoro-full.png",
    crew: "Straw Hat Pirates",
    role: "Swordsman",
    age: 21,
    height: "181 cm",
    status: "Alive",
  },
  {
    id: "nami",
    name: "Nami",
    bounty: 366000000,
    image: "/images/nami.png",
    fullImage: "/images/nami-full.png",
    crew: "Straw Hat Pirates",
    role: "Navigator",
    age: 20,
    height: "170 cm",
    status: "Alive",
  },
];
