const mongoose = require("mongoose");
const ActCollection = require("../models/actCollection");
const path = require("path");
require("express-async-errors");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// no need to await
mongoose.connect(process.env.MONGO_URI);

// Act/Games available = puzzle,map
const actCollectionData = [
  {
    name: "puzzle",
    type: "groupings",
    description:
      "Ang Piece It Up ay isang puzzle game na kung saan kailangang mabuo ng mga manlalaro ang isang larawan habang sumasagot sila ng mga tanong na may kaugnayan sa aralin. Bawat limang galaw ay may lilitaw na tanong na konektado sa larawan, na nagpapalalim ng pag-unawa sa aralin habang naglalaro.",
    imageLink:
      "https://d5bvvx354nxbm.cloudfront.net/puzzle-3ffb3ecd-1090-4be2-a1db-edf1b28523ac.png",

    winPoints: 10,
    losePoints: 8,
    timer: 10,
    image: "default-week-4-puzzle-1.jpg",
    imageUrl:
      "https://d5bvvx354nxbm.cloudfront.net/default-week-4-puzzle-1.jpg",
    questions: [
      {
        question: "Ano ang tinaguriang 'Seven Lakes City' sa Laguna?",
        options: ["Santa Rosa", "Biñan", "San Pablo City", "Los Baños"],
        correctAnswer: "San Pablo City",
      },
      {
        question:
          "Alin sa mga sumusunod ang hindi kabilang sa pitong lawa ng San Pablo City?",
        options: ["Lake Paoay", "Lake Bunot", "Lake Pandin", "Lake Yambo"],
        correctAnswer: "Lake Paoay",
      },
      {
        question: "Ano ang pangunahing produkto ng San Pablo City?",
        options: ["Palay", "Buko", "Mais", "Tabako"],
        correctAnswer: "Buko",
      },
      {
        question: "Saan idinaraos ang Coconut Festival sa Laguna?",
        options: ["Calamba City", "San Pablo City", "Bay", "Pagsanjan"],
        correctAnswer: "San Pablo City",
      },
      {
        question: "Kailan opisyal na naging lungsod ang San Pablo?",
        options: ["1920", "1940", "1950", "1960"],
        correctAnswer: "1940",
      },
      {
        question: "Ilang lawa ang matatagpuan sa San Pablo City?",
        options: ["5", "7", "9", "10"],
        correctAnswer: "7",
      },
      {
        question:
          "Alin sa mga sumusunod ang pinakamatanda at pinakamalaking lawa sa San Pablo City?",
        options: [
          "Lake Pandin",
          "Lake Calibato",
          "Lake Sampaloc",
          "Lake Yambo",
        ],
        correctAnswer: "Lake Sampaloc",
      },
      {
        question:
          "Sa anong buwan idinaraos ang Coconut Festival sa San Pablo City?",
        options: ["Enero", "Pebrero", "Marso", "Abril"],
        correctAnswer: "Enero",
      },
      {
        question:
          "Ano ang tawag sa pangunahing pangkat-etniko sa San Pablo City?",
        options: ["Tagalog", "Ilokano", "Cebuano", "Bicolano"],
        correctAnswer: "Tagalog",
      },
      {
        question:
          "Alin sa mga sumusunod na festival sa Laguna ang kilala sa pagpaparangal sa mga bayani ng rebolusyon?",
        options: [
          "Anilag Festival",
          "Pagsanjan Bangkero Festival",
          "Bayog Festival",
          "Alaminos Mango Festival",
        ],
        correctAnswer: "Pagsanjan Bangkero Festival",
      },
      {
        question: "Anong anyong tubig ang matatagpuan sa tabi ng Lake Pandin?",
        options: ["Ilog", "Bukal", "Talon", "Yambo Lake"],
        correctAnswer: "Yambo Lake",
      },
      {
        question:
          "Alin sa mga sumusunod ang kilala bilang pinakamalalim na lawa sa San Pablo City?",
        options: [
          "Lake Palakpakin",
          "Lake Calibato",
          "Lake Mohicap",
          "Lake Bunot",
        ],
        correctAnswer: "Lake Calibato",
      },
      {
        question: "Sa anong rehiyon kabilang ang San Pablo City?",
        options: ["Region III", "Region IV-A", "Region V", "NCR"],
        correctAnswer: "Region IV-A",
      },
      {
        question:
          "Anong anyong lupa ang matatagpuan malapit sa San Pablo City?",
        options: [
          "Bundok Makiling",
          "Bulkang Taal",
          "Sierra Madre",
          "Cordillera",
        ],
        correctAnswer: "Bundok Makiling",
      },
      {
        question:
          "Alin sa mga sumusunod ang hindi pangalan ng lawa sa San Pablo City?",
        options: [
          "Lake Mohicap",
          "Lake Lumot",
          "Lake Bunot",
          "Lake Palakpakin",
        ],
        correctAnswer: "Lake Lumot",
      },
    ],
  },
  {
    name: "map",
    type: "individual",
    description:
      "Ang Explore Pilipinas ay isang mapa ng Pilipinas na nagpapakita ng iba’t ibang lungsod at probinsya. Puwedeng pindutin ang bawat lugar para manood ng 3D video tungkol sa kasaysayan at kultura ng isang lugar. Pagkatapos, sasagutin nila ang mga tanong para masubok ang kanilang natutunan mula sa video.",
    imageLink:
      "https://d5bvvx354nxbm.cloudfront.net/map-3ffb3ecd-1090-4be2-a1db-edf1b28523ac.png",

    place: "Laguna",
    streetViewURL:
      "https://www.google.com/maps/embed?pb=!4v1728027859894!6m8!1m7!1sJqJ3Xkbi9lozPHW02R0sXA!2m2!1d13.99184461582302!2d121.3322554586495!3f1.2387371895489991!4f-9.59514420957511!5f0.7820865974627469",
    modalPlace: "Laguna",
    modalDescription:
      "Ang Laguna ay isang lalawigan sa rehiyon ng Calabarzon sa Pilipinas, na kilala sa mayamang kasaysayan, magagandang tanawin, at pamanang kultura. Dito matatagpuan ang pinakamalaking lawa ng bansa, ang Laguna de Bay, at napapalibutan ito ng mga kabundukan, talon, at mainit na bukal, kaya’t tanyag na destinasyon para sa mga mahilig sa kalikasan. Ang lalawigan din ang lugar ng kapanganakan ng pambansang bayani, si Dr. José Rizal, at maaaring bisitahin ng mga turista ang kanyang bahay at museo sa bayan ng Calamba. Sa makulay na mga pista, makasaysayang pook, at umuunlad na industriya, ang Laguna ay nag-aalok ng pagsasama ng tradisyonal na alindog at modernong pag-unlad.",
    video: "3d-default-video.mp4",
    videoURL: "https://www.youtube.com/watch?v=nAsXhFuZzEE",

    winPoints: 2,
    losePoints: 1,
    questions: [
      {
        question:
          "Saang pangunahing direksyon matatagpuan ang Laguna kung pagbabasehan ang NCR (National Capital Region)?",
        options: ["Hilaga", "Silangan", "Timog", "Kanluran"],
        correctAnswer: "Timog",
      },
      {
        question:
          "Anong uring anyong lupa o anyong tubig ang Samapaloc Lake na matatagpuan sa San Pablo City, Laguna?",
        options: ["Bundok", "Bulkan", "Dagat", "Lawa"],
        correctAnswer: "Lawa",
      },
      {
        question:
          "Anong uring anyong tubig ang Kilangin Falls na matatagpuan sa Liliw, Laguna?",
        options: ["Lawa", "Sapa", "Talon", "Ilog"],
        correctAnswer: "Talon",
      },
      {
        question: "Anong uring anyong lupa ang Mount Banahaw?",
        options: ["Bundok", "Bulkan", "Burol", "Lambak"],
        correctAnswer: "Bundok",
      },
      {
        question:
          "Anong uring anyong lupa ang Tayak Hills na matatagpuan sa Rizal, Laguna?",
        options: ["Talampas", "Bulkan", "Burol", "Lambak"],
        correctAnswer: "Burol",
      },
      {
        question:
          "Alin sa mga sumusunod ang mga pangunahing likas na yaman ang matatagpuan sa Calamba City, Laguna?",
        options: ["Tubig", "Lupa", "Hayop", "Lahat ng nabanggit"],
        correctAnswer: "Lahat ng nabanggit",
      },
      {
        question:
          "Dumarayo ang mga turista sa Esmeris Farm sapagkat malamig ang panahon dito at presko kapag tag-init. Alin dito ang pisikal na katangian ng Esmeris Farm?",
        options: [
          "Ang Esmeris Farm ay isang kapatagan",
          "Ang Esmeris Farm ay isang bundok",
          "Ang Esmeris Farm ay isang burol",
          "Ang Esmeris Farm ay isang bulkan",
        ],
        correctAnswer: "Ang Esmeris Farm ay isang burol",
      },
      {
        question:
          "Sa pagpunta nila Albert, Joshua, at Darwin sa Laguna, aling mapa ang gagamitin nila para mas madali nilang matunton ang bahay ng kanilang lolo’t lola?",
        options: [
          "Mapang pang-klima",
          "Mapang pang-kultura",
          "Mapang pang-ekonomiya",
          "Mapang pisikal",
        ],
        correctAnswer: "Mapang pisikal",
      },
      {
        question: "Ano ang pakinabang pang ekonomiko ang Lungsod ng San Pablo?",
        options: ["Kalakal at produkto", "Turismo", "Enerhiya", "Kalakal"],
        correctAnswer: "Turismo",
      },
      {
        question:
          "Dito sa Pilipinas, anong rehiyon nagmumula ang maraming suplay ng karne at itlog?",
        options: ["NCR", "CALABARZON", "MIMAROPA", "Gitnang Luzon"],
        correctAnswer: "CALABARZON",
      },
    ],
  },
  {
    name: "family-feud",
    type: "groupings",
    description:
      "Ang Classroom Clash ay isang larong hango sa Family Feud kung saan naglalaban ang mga manlalaro para matukoy ang mahahalagang impormasyon mula sa mga aralin. Sa halip na mga survey, ang mga tanong ay batay sa mga nakahandang sagot mula sa mga paksa sa eskwela. Nakakatulong ito sa pagbuo ng teamwork at nagbibigay ng masayang paraan ng pagkatuto.",
    imageLink:
      "https://d5bvvx354nxbm.cloudfront.net/family-feud-3ffb3ecd-1090-4be2-a1db-edf1b28523ac.png",

    winPoints: 10,
    losePoints: 8,
    questions: [
      {
        question:
          "Question 1: Ano ang mga lalawigan sa Rehiyon IV-A (CALABARZON)?",
        answers: [
          { answer: "Cavite", points: 40 },
          { answer: "Laguna", points: 30 },
          { answer: "Batangas", points: 20 },
          { answer: "Rizal", points: 10 },
          { answer: "Quezon", points: 5 },
        ],
      },
      {
        question:
          "Question 2: Magbigay ng mga pangunahing produkto mula sa CALABARZON.",
        answers: [
          { answer: "Kape", points: 25 },
          { answer: "Buko", points: 20 },
          { answer: "Mais", points: 15 },
          { answer: "Palay", points: 10 },
          { answer: "Niyog", points: 8 },
          { answer: "Gulay", points: 7 },
          { answer: "Isda", points: 5 },
        ],
      },
      {
        question:
          "Question 3: Magbigay ng mga lawa na matatagpuan sa San Pablo City",
        answers: [
          { answer: "Sampaloc", points: 40 },
          { answer: "Bunot", points: 30 },
          { answer: "Palakpakin", points: 20 },
          { answer: "Mohicap", points: 10 },
          { answer: "Calibato", points: 8 },
          { answer: "Pandin", points: 7 },
          { answer: "Yambo", points: 5 },
        ],
      },
      {
        question: "Question 4: Magbigay ng mga uri anyong lupa",
        answers: [
          { answer: "Bundok", points: 35 },
          { answer: "Burol", points: 30 },
          { answer: "Talampas", points: 25 },
          { answer: "Kapatagan", points: 20 },
          { answer: "Bulkan", points: 15 },
          { answer: "Lambak", points: 10 },
          { answer: "Kweba", points: 5 },
        ],
      },
      {
        question: "Question 5: Magbigay ng mga uri ng anyong tubig",
        answers: [
          { answer: "Ilog", points: 35 },
          { answer: "Dagat", points: 30 },
          { answer: "Look", points: 25 },
          { answer: "Lawa", points: 20 },
          { answer: "Bukal", points: 15 },
          { answer: "Talon", points: 10 },
          { answer: "Sapa", points: 5 },
        ],
      },
    ],
  },
  {
    name: "non-flip-easy",
    type: "individual",
    description:
      "Ang Memory Shuffle ay isang laro na dapat tandaan ang mga nagbabagong posisyon ng mga larawan. Dapat maiwasang pindutin nang dalawang beses ang isang imahe hanggang matapos o ma-click ang lahat ng imahe. Bawat pagpindot ay nagpapabago ng posisyon ng mga imahe, at kapag nagkamali, matatapos ang laro.",
    imageLink:
      "https://d5bvvx354nxbm.cloudfront.net/non-flip-easy-3ffb3ecd-1090-4be2-a1db-edf1b28523ac.png",

    winPoints: 1,
    timer: 1,
    questions: [
      {
        image: "default-week-9-non-flip-easy-1.jpg",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-9-non-flip-easy-1.jpg",
        question:
          "Anong bundok ang matatagpuan sa probinsya ng Quezon at itinuturing na sagradong bundok?",
        options: [
          "Bundok Banahaw",
          "Bulkang Pinatubo",
          "Bundok Makiling",
          "Sierra Madre Mountain Range",
        ],
        correctAnswer: "Bundok Banahaw",
      },
      {
        image: "default-week-9-non-flip-easy-2.jpg",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-9-non-flip-easy-2.jpg",
        question:
          "Aling bundok ang kilalang bulkan ngunit tinuturing na tulog sa kasalukuyan?",
        options: [
          "Sierra Madre Mountain Range",
          "Bundok Banahaw",
          "Bundok Makiling",
          "Bulkang Pinatubo",
        ],
        correctAnswer: "Bundok Makiling",
      },
      {
        image: "default-week-9-non-flip-easy-3.jpg",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-9-non-flip-easy-3.jpg",
        question:
          "Alin sa mga sumusunod ang isang aktibong bulkan na matatagpuan sa Luzon?",
        options: [
          "Bundok Banahaw",
          "Bulkang Pinatubo",
          "Bundok Makiling",
          "Sierra Madre Mountain Range",
        ],
        correctAnswer: "Bulkang Pinatubo",
      },
      {
        image: "default-week-9-non-flip-easy-4.jpg",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-9-non-flip-easy-4.jpg",
        question:
          "Aling kabundukan ang pinakamahabang hanay ng bundok sa Pilipinas?",
        options: [
          "Bundok Banahaw",
          "Sierra Madre Mountain Range",
          "Bundok Makiling",
          "Bulkang Pinatubo",
        ],
        correctAnswer: "Sierra Madre Mountain Range",
      },
    ],
  },
  {
    name: "drag-and-learn",
    type: "individual",
    description:
      "Ang Drag & Learn ay isang laro kung saan kailangan na ipares ang mga bagay. Habang hinihila ang isang salita papunta sa isang imahe, mas naiintindihan ng mga studyante ang paksa. Pero kapag nagkamali, bawat maling sagot ay mag-aalis ng isang tama nilang sagot.",
    imageLink:
      "https://d5bvvx354nxbm.cloudfront.net/drag-and-learn-3ffb3ecd-1090-4be2-a1db-edf1b28523ac.png",

    winPoints: 1,
    timer: 1,
    title: "Pagkilala sa topgorapiya ng mga lalawigan sa CALABARZON",
    questions: [
      {
        image: "default-week-7-drag-and-learn-1.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-7-drag-and-learn-1.png",
        name: "Cavite",
      },
      {
        image: "default-week-7-drag-and-learn-2.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-7-drag-and-learn-2.png",
        name: "Laguna",
      },
      {
        image: "default-week-7-drag-and-learn-3.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-7-drag-and-learn-3.png",
        name: "Batangas",
      },
      {
        image: "default-week-7-drag-and-learn-4.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-7-drag-and-learn-4.png",
        name: "Rizal",
      },
      {
        image: "default-week-7-drag-and-learn-5.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-7-drag-and-learn-5.png",
        name: "Quezon",
      },
    ],
  },
  {
    name: "hangman",
    type: "individual",
    description:
      "Ang Word Detectives ay hango sa Hangman na laro kung saan may ibinibigay na tanong upang mahulaan ang nakatagong salita. Pumipili ng mga letra ang mga estudyante para mabuo ang sagot sa tanong, na nagpapatalas sa kanilang bokabularyo at kritikal na pag-iisip.",
    imageLink:
      "https://d5bvvx354nxbm.cloudfront.net/hangman-3ffb3ecd-1090-4be2-a1db-edf1b28523ac.png",

    winPoints: 2,
    losePoints: 1,
    questions: [
      {
        question:
          "Ipinapakita nito ang cardinal na direksyon o ang primaryang direksyon, ang hilaga, kanluran, timog, at silangan.",
        correctAnswer: "compass rose",
      },
      {
        question: "Ginagamit ito upang ituro kung saan ang hilaga.",
        correctAnswer: "north arrow",
      },
      {
        question:
          "Ito ay laging nakaturo sa hilaga. Ginagamit ng mga skawts at mga manlalakbay para hindi sila maligaw.",
        correctAnswer: "compass",
      },
      {
        question: "Ito ang tawag sa mga pangunahing direksyon.",
        correctAnswer: "cardinal",
      },
      {
        question: "Ito ang tawag sa mga pangalawang direksyon.",
        correctAnswer: "ordinal",
      },
    ],
  },
  {
    name: "flip",
    type: "groupings",
    description:
      "Ang Pair Up ay isang memory game kung saan kailangan na mag-match ng mga pares ng larawan. Kapag naipareha nang tama ang dalawang larawan, lilitaw ang isang tanong na may kaugnayan dito. Nakakatulong ito sa pagpapalakas ng memorya at nagdudulot ng mas masaya at makabuluhang pag-aaral sa Araling Panlipunan.",
    imageLink:
      "https://d5bvvx354nxbm.cloudfront.net/flip-3ffb3ecd-1090-4be2-a1db-edf1b28523ac.png",

    winPoints: 2,
    timer: 3,
    questions: [
      {
        question: "Ano ang simbolong ito?",
        options: ["Ospital", "Paaralan", "Ilog", "Bundok"],
        image: "default-week-1-flip-1.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-1-flip-1.png",
        correctAnswer: "Paaralan",
      },
      {
        question: "Ano ang simbolong ito?",
        options: ["Paaralan", "Simbahan", "Burol", "Bulkan"],
        image: "default-week-1-flip-2.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-1-flip-2.png",
        correctAnswer: "Simbahan",
      },
      {
        question: "Ano ang simbolong ito?",
        options: ["Ulap", "Kagubatan", "Bundok", "Karagatan"],
        image: "default-week-1-flip-3.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-1-flip-3.png",
        correctAnswer: "Karagatan",
      },
      {
        question: "Ano ang simbolong ito?",
        options: ["Kagubatan", "Paaralan", "Ospital", "Ilog"],
        image: "default-week-1-flip-4.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-1-flip-4.png",
        correctAnswer: "Kagubatan",
      },
      {
        question: "Ano ang simbolong ito?",
        options: ["Bulkan", "Bundok", "Burol", "Kapatagan"],
        image: "default-week-1-flip-5.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-1-flip-5.png",
        correctAnswer: "Bulkan",
      },
      {
        question: "Ano ang simbolong ito?",
        options: ["Bulkan", "Bundok", "Burol", "Kapatagan"],
        image: "default-week-1-flip-6.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-1-flip-6.png",
        correctAnswer: "Bundok",
      },
      {
        question: "Ano ang simbolong ito?",
        options: ["Bulkan", "Bundok", "Burol", "Kapatagan"],
        image: "default-week-1-flip-7.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-1-flip-7.png",
        correctAnswer: "Burol",
      },
      {
        question: "Ano ang simbolong ito?",
        options: ["Bulkan", "Bundok", "Burol", "Kapatagan"],
        image: "default-week-1-flip-8.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-1-flip-8.png",
        correctAnswer: "Kapatagan",
      },
      {
        question: "Ano ang simbolong ito?",
        options: ["Ilog", "Karagatan", "Lawa", "Bundok"],
        image: "default-week-1-flip-9.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-1-flip-9.png",
        correctAnswer: "Lawa",
      },
      {
        question: "Ano ang simbolong ito?",
        options: ["Ospital", "Paaralan", "Paliparan", "Simbahan"],
        image: "default-week-1-flip-10.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-1-flip-10.png",
        correctAnswer: "Ospital",
      },
    ],
  },

  {
    name: "non-flip-hard",
    type: "groupings",
    description:
      "Ang Memory Shuffle ay isang laro na dapat tandaan ang mga nagbabagong posisyon ng mga larawan. Dapat maiwasang pindutin nang dalawang beses ang isang imahe hanggang matapos o ma-click ang lahat ng imahe. Bawat pagpindot ay nagpapabago ng posisyon ng mga imahe, at kapag nagkamali, matatapos ang laro.",
    imageLink:
      "https://d5bvvx354nxbm.cloudfront.net/non-flip-hard-3ffb3ecd-1090-4be2-a1db-edf1b28523ac.png",

    winPoints: 1,
    timer: 3,
    questions: [
      {
        image: "default-week-8-non-flip-hard-1.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-1.png",
        question: "Saang lalawigan matatagpuan ang Bulkang Taal?",
        options: ["Quezon", "Batangas", "Laguna", "Rizal"],
        correctAnswer: "Batangas",
      },
      {
        image: "default-week-8-non-flip-hard-2.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-2.png",
        question: "Anong bundok ang matatagpuan sa Laguna?",
        options: [
          "Mt. Banahaw",
          "Mt. Makiling",
          "Bundok Palay-Palay",
          "Mt. Balagbag",
        ],
        correctAnswer: "Mt. Makiling",
      },
      {
        image: "default-week-8-non-flip-hard-3.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-3.png",
        question: "Aling bundok ang nasa Quezon?",
        options: [
          "Mt. Makiling",
          "Mt. Balagbag",
          "Bundok Palay-Palay",
          "Mt. Banahaw",
        ],
        correctAnswer: "Mt. Banahaw",
      },
      {
        image: "default-week-8-non-flip-hard-4.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-4.png",
        question: "Anong bundok ang matatagpuan sa Cavite?",
        options: [
          "Mt. Balagbag",
          "Mt. Makiling",
          "Bundok Palay-Palay",
          "Mt. Banahaw",
        ],
        correctAnswer: "Bundok Palay-Palay",
      },
      {
        image: "default-week-8-non-flip-hard-5.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-5.png",
        question: "Aling bundok ang matatagpuan sa Rizal?",
        options: [
          "Mt. Makiling",
          "Mt. Balagbag",
          "Bundok Palay-Palay",
          "Tayak Hill",
        ],
        correctAnswer: "Mt. Balagbag",
      },
      {
        image: "default-week-8-non-flip-hard-6.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-6.png",
        question: "Anong burol ang matatagpuan sa Laguna?",
        options: [
          "Mt. Banahaw",
          "Bundok Palay-Palay",
          "Mt. Balagbag",
          "Tayak Hill",
        ],
        correctAnswer: "Tayak Hill",
      },
      {
        image: "default-week-8-non-flip-hard-7.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-7.png",
        question: "Saang lalawigan matatagpuan ang Daranak Falls?",
        options: ["Cavite", "Rizal", "Laguna", "Batangas"],
        correctAnswer: "Rizal",
      },
      {
        image: "default-week-8-non-flip-hard-8.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-8.png",
        question: "Anong lawa ang nasa Batangas?",
        options: ["Yambo Lake", "Sampalok Lake", "Taal Lake", "Calibato"],
        correctAnswer: "Taal Lake",
      },
      {
        image: "default-week-8-non-flip-hard-9.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-9.png",
        question: "Anong ilog ang matatagpuan sa Cavite?",
        options: [
          "Tayak Hill",
          "Sampalok Lake",
          "Ilog Maragondon",
          "Daranak Falls",
        ],
        correctAnswer: "Ilog Maragondon",
      },
      {
        image: "default-week-8-non-flip-hard-10.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-10.png",
        question: "Aling lawa ang nasa Laguna?",
        options: [
          "Taal Lake",
          "Sampalok Lake",
          "Daranak Falls",
          "Ilog Maragondon",
        ],
        correctAnswer: "Sampalok Lake",
      },
      {
        image: "default-week-8-non-flip-hard-11.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-11.png",
        question: "Aling lawa ang isa sa mga lawa ng Laguna?",
        options: [
          "Daranak Falls",
          "Calibato Lake",
          "Ilog Maragondon",
          "Taal Lake",
        ],
        correctAnswer: "Calibato Lake",
      },
      {
        image: "default-week-8-non-flip-hard-12.png",
        imageUrl:
          "https://d5bvvx354nxbm.cloudfront.net/default-week-8-non-flip-hard-12.png",
        question: "Alin sa mga sumusunod na lawa ang nasa Laguna?",
        options: [
          "Taal Lake",
          "Ilog Maragondon",
          "Yambo Lake",
          "Daranak Falls",
        ],
        correctAnswer: "Yambo Lake",
      },
    ],
  },
];

const seed = async () => {
  try {
    const acts = await ActCollection.create(actCollectionData);
    console.log("actCollection seeded");
  } catch (error) {
    console.error("Error adding actCollection:", error);
  }
};

seed();
