import MiguelImg from './assets/Miguel.png';
import SarahImg from './assets/Sarah.svg';
import JunhoImg from './assets/Junho.svg';

export const Characters = [
    {
      id: 1,
      name: "Miguel Santos",
      avatar: MiguelImg,
      familyBackground: "Raised in a traditional Mexican family with three sisters. Parents run a small restaurant.",
      bgColor: "bg-sky-100",
      age:19,
      nationality: 'Mexican',
      location: 'Los Angeles, USA',
      occupation: 'College Student',
      scenario: `Carmen, Minguel's sister needs to study for an important exam, but parents insist she help clean after restaurant closing while Miguel is allowed to focus on his studies.`
    },
    {
        id: 2,
        name: "Sarah Chen-Williams",
        avatar: SarahImg,
        familyBackground: "First-generation immigrant parents, married to an American husband, mother of two children.",
        bgColor: "bg-rose-100",
        age: 35,
        nationality: 'Chinese',
        location: 'San Francisco, USA',
        occupation: 'Software Engineer',
        scenario: "Sarah is offered a promotion to Senior Engineering Manager, but it requires longer hours and occasional travel. Her parents criticize her for considering it, saying she's neglecting her children, while male colleagues with families are praised for career ambition."
    },
    {
        id: 3,
        name: "Jun-ho Park",
        avatar: JunhoImg,
        familyBackground: "Upper-middle-class family with conservative values.",
        bgColor: "bg-purple-100",
        age: 23,
        nationality: 'South Korean',
        location:'Seoul, South Korea',
        occupation: 'Graduate Student',
        scenario: "His Sister is currently working as a designer, and he Witnesses familial pressure on her to marry early and prioritize family over career."
    }
  ];