// ABOUTME: Visionary "Playground" Engine for Wikipedia Atom Article
// ABOUTME: Transforms content into interactive simulators based on Intent

(function () {
  'use strict';

  // --- MOCK DATA GENERATOR (Simulating "Smart" Extraction) ---
  // In a real production system, this would be parsed from the DOM or an LLM.
  // For the vision demo, we structure the "perfect" data to sell the concept.

  const AtomicData = {
    // For Teach Me: 17 Key Concepts - Progressive Learning Journey
    lessons: [
      {
        id: 1,
        title: 'What is an Atom?',
        subtitle: 'The building blocks of everything',
        icon: '⚛️',
        visual: 'atom-basic',
        intro: 'Atoms are the fundamental building blocks of all matter in the universe. Everything you see, touch, and breathe is made of atoms.',
        keyPoints: [
          'Atoms are the basic particles of chemical elements',
          'An atom has a <strong>nucleus</strong> (protons + neutrons) at the center',
          'A cloud of <strong>electrons</strong> surrounds the nucleus',
          'The number of <strong>protons</strong> defines what element it is'
        ],
        example: {
          title: 'Element Identity',
          content: '11 protons = Sodium (Na) • 29 protons = Copper (Cu) • 79 protons = Gold (Au)'
        },
        funFact: 'Atoms with the same protons but different neutrons are called <strong>isotopes</strong> — same element, slightly different weight!'
      },
      {
        id: 2,
        title: 'Size & Scale',
        subtitle: 'Incredibly, unimaginably tiny',
        icon: '🔬',
        visual: 'scale',
        intro: 'Atoms are so small that our brains struggle to comprehend them. Let\'s explore just how tiny they really are.',
        keyPoints: [
          'Atoms are about <strong>100 picometers</strong> (0.0000000001 meters) across',
          'A human hair is about <strong>1 million carbon atoms</strong> wide',
          'Atoms are smaller than the wavelength of visible light',
          'We <strong>cannot see atoms</strong> with regular microscopes'
        ],
        example: {
          title: 'Mind-Bending Comparison',
          content: 'If an atom were the size of a marble, a human hair would be 2 kilometers wide!'
        },
        funFact: 'Atoms are so small that classical physics breaks down — we need <strong>quantum mechanics</strong> to describe them!'
      },
      {
        id: 3,
        title: 'Mass Distribution',
        subtitle: 'Where the weight really is',
        icon: '⚖️',
        visual: 'mass',
        intro: 'Despite electrons buzzing around everywhere, almost all of an atom\'s mass is concentrated in one tiny spot.',
        keyPoints: [
          '<strong>99.94%</strong> of an atom\'s mass is in the nucleus',
          'Protons have <strong>positive charge</strong> (+1)',
          'Neutrons have <strong>no charge</strong> (0)',
          'The nucleus is therefore <strong>positively charged</strong> overall'
        ],
        example: {
          title: 'Visualizing Density',
          content: 'If the nucleus were the size of a pea, the atom would be as big as a football stadium!'
        },
        funFact: 'The nucleus is so dense that a teaspoon of nuclear matter would weigh about <strong>6 billion tons</strong>!'
      },
      {
        id: 4,
        title: 'Electric Charge',
        subtitle: 'The balance of positive and negative',
        icon: '⚡',
        visual: 'charge',
        intro: 'Atoms are normally electrically neutral, but they can gain or lose electrons to become charged particles called ions.',
        keyPoints: [
          '<strong>Neutral atom</strong>: Equal number of protons (+) and electrons (−)',
          '<strong>Ion</strong>: An atom with unequal protons and electrons',
          '<strong>Cation</strong> (+): Lost electrons → more protons than electrons',
          '<strong>Anion</strong> (−): Gained electrons → more electrons than protons'
        ],
        example: {
          title: 'Common Ions',
          content: 'Na⁺ (lost 1 electron) • Cl⁻ (gained 1 electron) • Together they make table salt!'
        },
        funFact: 'Your nerves work by moving ions in and out of cells — <strong>electricity in your body</strong>!'
      },
      {
        id: 5,
        title: 'Subatomic Particles',
        subtitle: 'Meet the electron, proton, and neutron',
        icon: '🔵',
        visual: 'particles',
        intro: 'Atoms are made of three main particles. Let\'s get to know each one and their unique properties.',
        keyPoints: [
          '<strong>Electron</strong>: Negative charge, tiny mass (9.11 × 10⁻³¹ kg), orbits nucleus',
          '<strong>Proton</strong>: Positive charge, ~1,836× heavier than electron, in nucleus',
          '<strong>Neutron</strong>: No charge, slightly heavier than proton, in nucleus',
          'Protons & neutrons are called <strong>nucleons</strong>'
        ],
        example: {
          title: 'Mass Comparison',
          content: 'If an electron weighed 1 gram, a proton would weigh almost 2 kilograms!'
        },
        funFact: 'Electrons are truly elementary (no smaller parts), but protons and neutrons are made of <strong>quarks</strong>!'
      },
      {
        id: 6,
        title: 'Inside the Nucleus',
        subtitle: 'The dense heart of the atom',
        icon: '☢️',
        visual: 'nucleus',
        intro: 'The nucleus is incredibly tiny and dense. It\'s where most of the atom\'s mass and all of its positive charge reside.',
        keyPoints: [
          'Nucleus contains all <strong>protons and neutrons</strong> (nucleons)',
          'Radius ≈ 1.07 × ∛A femtometers (A = number of nucleons)',
          '<strong>Strong nuclear force</strong> holds nucleons together',
          'This force overcomes proton-proton electromagnetic repulsion'
        ],
        example: {
          title: 'Nuclear Reactions',
          content: 'Fusion: nuclei combine (powers the Sun) • Fission: nucleus splits (nuclear power plants)'
        },
        funFact: 'The strong force is <strong>100× stronger</strong> than electromagnetism, but only works at tiny distances!'
      },
      {
        id: 7,
        title: 'Electron Cloud & Orbitals',
        subtitle: 'Where electrons actually are',
        icon: '☁️',
        visual: 'orbitals',
        intro: 'Electrons don\'t orbit like planets. They exist as probability clouds — regions where they\'re likely to be found.',
        keyPoints: [
          'Electrons are bound by <strong>electromagnetic attraction</strong> to the nucleus',
          'They exhibit <strong>wave-particle duality</strong> — acting as both particle and wave',
          '<strong>Orbitals</strong>: 3D regions showing probability of finding an electron',
          'Only <strong>discrete (quantized)</strong> energy states are allowed'
        ],
        example: {
          title: 'Orbital Shapes',
          content: 's-orbital: sphere • p-orbital: dumbbell • d-orbital: cloverleaf'
        },
        funFact: 'An electron doesn\'t have a definite location until you measure it — it exists as a <strong>probability distribution</strong>!'
      },
      {
        id: 8,
        title: 'Isotopes',
        subtitle: 'Same element, different weight',
        icon: '🧪',
        visual: 'isotopes',
        intro: 'Isotopes are variants of an element with different numbers of neutrons. They\'re chemically identical but physically different.',
        keyPoints: [
          '<strong>Same protons</strong> = same element, same chemistry',
          '<strong>Different neutrons</strong> = different isotope, different mass',
          'About <strong>251 stable isotopes</strong> exist in nature',
          'Elements above atomic number 82 (lead) have <strong>no stable isotopes</strong>'
        ],
        example: {
          title: 'Hydrogen Isotopes',
          content: 'Protium (0 neutrons) • Deuterium (1 neutron) • Tritium (2 neutrons)'
        },
        funFact: 'Carbon-14 is radioactive — scientists use it to <strong>date ancient objects</strong> up to 50,000 years old!'
      },
      {
        id: 9,
        title: 'Atomic Mass',
        subtitle: 'Weighing the incredibly small',
        icon: '⚖️',
        visual: 'mass-number',
        intro: 'How do we measure something so tiny? Scientists created a special unit just for atoms.',
        keyPoints: [
          '<strong>Mass number</strong> = protons + neutrons (a simple count)',
          '<strong>Dalton (Da)</strong> = unit for atomic mass, also called "unified atomic mass unit"',
          '1 Da = 1/12 the mass of carbon-12 ≈ 1.66 × 10⁻²⁷ kg',
          'Atomic mass ≈ mass number × 1 dalton (within 1%)'
        ],
        example: {
          title: 'Example Masses',
          content: 'Hydrogen-1: ~1 Da • Carbon-12: exactly 12 Da • Uranium-238: ~238 Da'
        },
        funFact: 'One <strong>mole</strong> (6.022 × 10²³ atoms) of any element has a mass in grams equal to its atomic mass number!'
      },
      {
        id: 10,
        title: 'Atomic Size & Shape',
        subtitle: 'How big is an atom, really?',
        icon: '📏',
        visual: 'size',
        intro: 'Atoms don\'t have hard edges, so their "size" is defined by how far the electron cloud extends.',
        keyPoints: [
          '<strong>Atomic radius</strong>: distance electron cloud extends from nucleus',
          '<strong>Smallest</strong>: Helium at 32 picometers',
          '<strong>Largest</strong>: Caesium at 225 picometers',
          'Size <strong>increases</strong> going down the periodic table, <strong>decreases</strong> going right'
        ],
        example: {
          title: 'Periodic Trends',
          content: 'Li → Na → K → Rb → Cs (getting bigger) • Li → Be → B → C (getting smaller)'
        },
        funFact: 'Atoms can be <strong>squished into different shapes</strong> by external forces like electric fields!'
      },
      {
        id: 11,
        title: 'Radioactive Decay',
        subtitle: 'When atoms transform',
        icon: '💥',
        visual: 'decay',
        intro: 'Some atomic nuclei are unstable and spontaneously emit particles or energy to become more stable.',
        keyPoints: [
          '<strong>Alpha decay</strong>: emits helium nucleus (2p + 2n), atomic number drops by 2',
          '<strong>Beta decay</strong>: neutron ↔ proton conversion, atomic number changes by 1',
          '<strong>Gamma decay</strong>: emits high-energy photon, no particle change',
          '<strong>Half-life</strong>: time for half the sample to decay'
        ],
        example: {
          title: 'Half-Life Examples',
          content: 'Carbon-14: 5,730 years • Uranium-238: 4.5 billion years • Polonium-214: 164 microseconds'
        },
        funFact: 'Radioactive decay is completely random — we can only predict <strong>probabilities</strong>, never exact moments!'
      },
      {
        id: 12,
        title: 'Magnetic Properties',
        subtitle: 'Atoms as tiny magnets',
        icon: '🧲',
        visual: 'magnetic',
        intro: 'Electrons have a property called "spin" that makes atoms behave like tiny magnets.',
        keyPoints: [
          'All electrons, protons, and neutrons have <strong>spin</strong> (quantum property)',
          'Electron spin creates a <strong>magnetic moment</strong>',
          'Paired electrons (↑↓) cancel each other\'s magnetism',
          '<strong>Unpaired electrons</strong> give atoms net magnetic moment'
        ],
        example: {
          title: 'Magnetic Materials',
          content: 'Iron, Cobalt, Nickel: unpaired electrons → ferromagnetic → permanent magnets'
        },
        funFact: 'MRI machines work by flipping the <strong>spin of hydrogen atoms</strong> in your body with magnetic fields!'
      },
      {
        id: 13,
        title: 'Energy Levels & Spectra',
        subtitle: 'Why atoms glow specific colors',
        icon: '🌈',
        visual: 'spectra',
        intro: 'Electrons can only exist at specific energy levels. When they jump between levels, light is absorbed or emitted.',
        keyPoints: [
          'Electrons occupy <strong>discrete energy levels</strong> (quantized)',
          '<strong>Ground state</strong>: lowest possible energy level',
          '<strong>Excited state</strong>: higher energy level after absorbing a photon',
          'Emitted photon energy = energy difference between levels'
        ],
        example: {
          title: 'Element Identification',
          content: 'Each element has unique spectral "fingerprint" — used to identify elements in distant stars!'
        },
        funFact: 'Neon signs glow because electricity excites neon atoms, which emit <strong>orange-red light</strong> as they relax!'
      },
      {
        id: 14,
        title: 'Chemical Bonding',
        subtitle: 'How atoms connect',
        icon: '🔗',
        visual: 'bonding',
        intro: 'Atoms bond together by sharing or transferring electrons. This creates molecules and compounds — everything from water to DNA.',
        keyPoints: [
          '<strong>Valence shell</strong>: outermost electron shell',
          '<strong>Valence electrons</strong>: electrons in the valence shell that participate in bonding',
          'Atoms want to <strong>fill or empty</strong> their valence shell',
          'Bonds form by <strong>sharing</strong> (covalent) or <strong>transferring</strong> (ionic) electrons'
        ],
        example: {
          title: 'Bonding Types',
          content: 'H₂O: oxygen shares electrons with 2 hydrogens • NaCl: sodium gives electron to chlorine'
        },
        funFact: 'Noble gases (He, Ne, Ar...) have <strong>full valence shells</strong> — they almost never form bonds!'
      },
      {
        id: 15,
        title: 'Forces Within Atoms',
        subtitle: 'What holds it all together',
        icon: '💪',
        visual: 'forces',
        intro: 'Two fundamental forces work together (and against each other) to keep atoms intact.',
        keyPoints: [
          '<strong>Electromagnetic force</strong>: attracts electrons to protons, binds electron cloud',
          '<strong>Strong nuclear force</strong>: holds protons and neutrons together in nucleus',
          'Strong force is <strong>stronger but shorter-range</strong> than electromagnetic',
          'When electromagnetic > nuclear force, nucleus becomes unstable (decay/fission)'
        ],
        example: {
          title: 'Einstein\'s Famous Equation',
          content: 'E = mc² — mass lost during nuclear reactions is converted to enormous energy!'
        },
        funFact: 'Nuclear binding energy from 1 kg of uranium = energy from burning <strong>3 million kg of coal</strong>!'
      },
      {
        id: 16,
        title: 'Origin of Atoms',
        subtitle: 'Where did atoms come from?',
        icon: '✨',
        visual: 'origin',
        intro: 'Every atom in your body was forged in cosmic events — from the Big Bang to exploding stars.',
        keyPoints: [
          '<strong>Big Bang</strong> (first 3 minutes): created hydrogen, helium, lithium',
          '<strong>Stellar fusion</strong>: stars create carbon through iron',
          '<strong>Supernovae & neutron star collisions</strong>: create elements heavier than iron',
          'Earth\'s atoms came from the <strong>solar nebula</strong> that formed our solar system'
        ],
        example: {
          title: 'You Are Stardust',
          content: 'The calcium in your bones, iron in your blood — all forged inside ancient stars!'
        },
        funFact: 'The gold in your jewelry was created when <strong>two neutron stars collided</strong> billions of years ago!'
      },
      {
        id: 17,
        title: 'History of Atomic Theory',
        subtitle: 'How we discovered all this',
        icon: '📜',
        visual: 'history',
        intro: 'Our understanding of atoms evolved over 2,500 years — from philosophical guesses to quantum precision.',
        keyPoints: [
          '<strong>Ancient Greece</strong>: "atomos" (uncuttable) — philosophical concept',
          '<strong>1803 Dalton</strong>: atoms are indivisible spheres, different for each element',
          '<strong>1897 Thomson</strong>: discovered electron → atoms are NOT indivisible',
          '<strong>1911 Rutherford</strong>: discovered nucleus → atoms are mostly empty space'
        ],
        example: {
          title: 'Model Evolution',
          content: 'Solid sphere → Plum pudding → Planetary → Quantum cloud'
        },
        funFact: 'The word "atom" comes from Greek "atomos" meaning <strong>uncuttable</strong> — but we now know atoms CAN be split!'
      }
    ],
    // For Quick Facts: Rich fact categories from Wikipedia Atom article
    factCategories: [
      {
        id: 'definition',
        name: 'Basic Definition',
        icon: '⚛️',
        color: '#00d2ff',
        facts: [
          'Atoms are the basic particles of the chemical elements and the fundamental building blocks of matter.',
          'An atom consists of a nucleus of protons and generally neutrons, surrounded by an electromagnetically bound swarm of electrons.',
          'Chemical elements are distinguished from each other by the number of protons in their atoms.',
          'Any atom that contains 11 protons is sodium, and any atom that contains 29 protons is copper.',
          'Atoms with the same number of protons but a different number of neutrons are called isotopes of the same element.'
        ]
      },
      {
        id: 'scale',
        name: 'Size & Scale',
        icon: '📏',
        color: '#10b981',
        facts: [
          'Atoms are extremely small, typically around 100 picometers across.',
          'A human hair is about a million carbon atoms wide.',
          'Atoms are smaller than the shortest wavelength of visible light, which means humans cannot see atoms with conventional microscopes.',
          'The smallest atom is helium with a radius of 32 pm, while one of the largest is caesium at 225 pm.',
          'A single drop of water contains about 2 sextillion (2 × 10²¹) atoms of oxygen, and twice the number of hydrogen atoms.',
          'A single carat diamond with a mass of 2 × 10⁻⁴ kg contains about 10 sextillion (10²²) atoms of carbon.'
        ]
      },
      {
        id: 'mass',
        name: 'Mass Distribution',
        icon: '⚖️',
        color: '#f59e0b',
        facts: [
          'More than 99.94% of an atom\'s mass is in the nucleus.',
          'Protons have a positive electric charge and neutrons have no charge, so the nucleus is positively charged.',
          'The electrons are negatively charged, and this opposing charge is what binds them to the nucleus.'
        ]
      },
      {
        id: 'particles',
        name: 'Subatomic Particles',
        icon: '🔬',
        color: '#8b5cf6',
        facts: [
          'The electron has a mass of 9.11 × 10⁻³¹ kg.',
          'Protons have a positive charge and a mass of 1.6726 × 10⁻²⁷ kg.',
          'Neutrons have no electrical charge and have a mass of 1.6749 × 10⁻²⁷ kg.',
          'The electron is the least massive of these particles by four orders of magnitude.',
          'Neutrons and protons have comparable dimensions—on the order of 2.5 × 10⁻¹⁵ m.',
          'Protons are composed of two up quarks (each with charge +2/3) and one down quark (with a charge of -1/3).',
          'Neutrons consist of one up quark and two down quarks.'
        ]
      },
      {
        id: 'nuclear',
        name: 'Nuclear Properties',
        icon: '☢️',
        color: '#ef4444',
        facts: [
          'The radius of a nucleus is approximately equal to 1.07 × ∛A femtometres, where A is the total number of nucleons.',
          'The nucleus is much smaller than the radius of the atom, which is on the order of 10⁵ fm.',
          'The electromagnetic force binds electrons to the nucleus.',
          'The protons and neutrons in the nucleus are attracted to each other by the nuclear force.',
          'The nuclear force is usually stronger than the electromagnetic force that repels the positively charged protons from one another.',
          'The strong force acts over distances on the order of 1 fm.'
        ]
      },
      {
        id: 'isotopes',
        name: 'Stability & Isotopes',
        icon: '🧪',
        color: '#06b6d4',
        facts: [
          'About 339 nuclides occur naturally on Earth, of which 251 (about 74%) have not been observed to decay, and are referred to as "stable isotopes".',
          'Only 90 nuclides are stable theoretically.',
          'An additional 35 radioactive nuclides have half-lives longer than 100 million years.',
          'For 80 of the chemical elements, at least one stable isotope exists.',
          'The average is 3.1 stable isotopes per element.',
          'Twenty-six "monoisotopic elements" have only a single stable isotope, while the largest number of stable isotopes observed for any element is ten, for the element tin.',
          'Elements 43, 61, and all elements numbered 83 or higher have no stable isotopes.',
          'Only four known stable nuclides have both an odd number of protons and odd number of neutrons: hydrogen-2 (deuterium), lithium-6, boron-10, and nitrogen-14.',
          'Hydrogen-1 (the lightest isotope of hydrogen) has an atomic weight of 1.007825 Da.',
          'The heaviest stable atom is lead-208, with a mass of 207.9766521 Da.'
        ]
      },
      {
        id: 'energy',
        name: 'Energy & Moles',
        icon: '⚡',
        color: '#eab308',
        facts: [
          'It requires only 13.6 eV to strip a ground-state electron from a hydrogen atom, compared to 2.23 million eV for splitting a deuterium nucleus.',
          'One dalton is defined as a twelfth of the mass of a free neutral atom of carbon-12, which is approximately 1.66 × 10⁻²⁷ kg.',
          'One mole of atoms of any element always has the same number of atoms (about 6.022 × 10²³).',
          'Each carbon-12 atom has an atomic mass of exactly 12 Da, and so a mole of carbon-12 atoms weighs exactly 0.012 kg.'
        ]
      },
      {
        id: 'cosmic',
        name: 'Cosmic Context',
        icon: '🌌',
        color: '#6366f1',
        facts: [
          'Baryonic matter forms about 4% of the total energy density of the observable universe, with an average density of about 0.25 particles/m³ (mostly protons and electrons).',
          'Within the Milky Way, particles in the interstellar medium (ISM) range from 10⁵ to 10⁹ atoms/m³.',
          'The Sun is believed to be inside the Local Bubble, so the density in the solar neighborhood is only about 10³ atoms/m³.',
          'Up to 95% of the Milky Way\'s baryonic matter are concentrated inside stars.'
        ]
      },
      {
        id: 'formation',
        name: 'Formation History',
        icon: '💥',
        color: '#f97316',
        facts: [
          'Electrons are thought to exist in the Universe since early stages of the Big Bang.',
          'In about three minutes Big Bang nucleosynthesis produced most of the helium, lithium, and deuterium in the Universe, and perhaps some of the beryllium and boron.',
          'Atoms (complete with bound electrons) became to dominate over charged particles 380,000 years after the Big Bang—an epoch called recombination.'
        ]
      },
      {
        id: 'earth',
        name: 'Earth\'s Atoms',
        icon: '🌍',
        color: '#22c55e',
        facts: [
          'The Earth contains approximately 1.33 × 10⁵⁰ atoms.',
          'At the surface of the Earth, an overwhelming majority of atoms combine to form various compounds, including water, salt, silicates, and oxides.',
          '99% of the atmosphere is bound in the form of molecules, including carbon dioxide and diatomic oxygen and nitrogen.',
          'About 99% of the helium in the crust of the Earth is a product of alpha decay.'
        ]
      },
      {
        id: 'discoveries',
        name: 'Historical Discoveries',
        icon: '📜',
        color: '#a855f7',
        facts: [
          'In 1897, J. J. Thomson discovered that cathode rays are made of electrically charged particles with negative charge.',
          'Thomson measured these particles to be 1,700 times lighter than hydrogen (the lightest atom).',
          'In 1913, Henry Moseley discovered that the frequencies of X-ray emissions from an excited atom were a mathematical function of its atomic number and hydrogen\'s nuclear charge.',
          'In 1932, James Chadwick discovered the neutron.',
          'Helium was discovered in the spectrum of the Sun 23 years before it was found on Earth.'
        ]
      },
      {
        id: 'antimatter',
        name: 'Antimatter',
        icon: '✨',
        color: '#ec4899',
        facts: [
          'The positron is a positively charged antielectron and the antiproton is a negatively charged equivalent of a proton.',
          'When a matter and corresponding antimatter particle meet, they annihilate each other.',
          'In 1996, the antimatter counterpart of the hydrogen atom (antihydrogen) was synthesized at the CERN laboratory in Geneva.'
        ]
      },
      {
        id: 'elements',
        name: 'Element Distribution',
        icon: '🔢',
        color: '#14b8a6',
        facts: [
          'The known elements form a set of atomic numbers, from the single-proton element hydrogen up to the 118-proton element oganesson.',
          'All known isotopes of elements with atomic numbers greater than 82 are radioactive, although the radioactivity of element 83 (bismuth) is so slight as to be practically negligible.'
        ]
      },
      {
        id: 'ions',
        name: 'Charged Atoms (Ions)',
        icon: '⊕',
        color: '#0ea5e9',
        facts: [
          'A charged atom is called an ion.',
          'If an atom has more electrons than protons, then it has an overall negative charge and is called a negative ion (or anion).',
          'If it has more protons than electrons, it has a positive charge and is called a positive ion (or cation).'
        ]
      }
    ],
    // For Glossary: A-Z term definitions
    glossary: [
      { term: 'Alpha decay', definition: 'A process caused when the nucleus emits an alpha particle, which is a helium nucleus consisting of two protons and two neutrons.' },
      { term: 'Alpha particle', definition: 'A helium nucleus consisting of two protons and two neutrons.' },
      { term: 'Anion', definition: 'A negatively charged ion; an atom that has more electrons than protons.' },
      { term: 'Antimatter', definition: 'Matter particles with opposite electrical charge. The positron is a positively charged antielectron.' },
      { term: 'Atom', definition: 'The basic particles of the chemical elements. Consists of a nucleus of protons and neutrons, surrounded by electrons.' },
      { term: 'Atomic mass', definition: 'The actual mass of an atom at rest, often expressed in daltons (Da).' },
      { term: 'Atomic number', definition: 'The number of protons in an atom. Elements are distinguished by their atomic number.' },
      { term: 'Atomic orbital', definition: 'A mathematical function that characterizes the probability of finding an electron at a particular location.' },
      { term: 'Beta decay', definition: 'Processes resulting from a transformation of a neutron into a proton, or vice versa.' },
      { term: 'Binding energy', definition: 'The energy needed for a nucleon to escape the nucleus.' },
      { term: 'Bohr model', definition: 'A 1913 model where electrons orbit the nucleus in discrete orbits, jumping between them by absorbing or emitting photons.' },
      { term: 'Cation', definition: 'A positively charged ion; an atom that has more protons than electrons.' },
      { term: 'Chemical bond', definition: 'The mechanism by which atoms attach to form molecules or crystals.' },
      { term: 'Dalton (Da)', definition: 'A unit of mass equal to 1/12 of carbon-12, approximately 1.66 × 10⁻²⁷ kg.' },
      { term: 'Electron', definition: 'A subatomic particle with negative charge and mass of 9.11 × 10⁻³¹ kg.' },
      { term: 'Electron cloud', definition: 'A region where electrons form three-dimensional standing waves around the nucleus.' },
      { term: 'Gamma decay', definition: 'A process resulting from a nucleus changing to a lower energy state, emitting electromagnetic radiation.' },
      { term: 'Ground state', definition: 'The lowest energy state of a bound electron in an atom.' },
      { term: 'Half-life', definition: 'The time needed for half of a radioactive sample to decay.' },
      { term: 'Ion', definition: 'A charged atom. Negative ions have more electrons; positive ions have more protons.' },
      { term: 'Isotope', definition: 'Atoms with the same number of protons but different numbers of neutrons.' },
      { term: 'Mass number', definition: 'The total number of protons and neutrons in an atom.' },
      { term: 'Neutron', definition: 'A subatomic particle with no charge and mass of 1.6749 × 10⁻²⁷ kg. Discovered 1932.' },
      { term: 'Nuclear fission', definition: 'A process where a nucleus splits into two smaller nuclei.' },
      { term: 'Nuclear fusion', definition: 'A process where atomic particles join to form a heavier nucleus.' },
      { term: 'Nucleon', definition: 'Collective term for protons and neutrons in the nucleus.' },
      { term: 'Photon', definition: 'A particle of electromagnetic radiation absorbed or emitted during electron transitions.' },
      { term: 'Proton', definition: 'A subatomic particle with positive charge and mass of 1.6726 × 10⁻²⁷ kg.' },
      { term: 'Quantum mechanics', definition: 'The mathematical framework describing wave-particle behavior at atomic scales.' },
      { term: 'Quarks', definition: 'Elementary particles composing protons and neutrons. Up quarks (+2/3 charge) and down quarks (-1/3 charge).' },
      { term: 'Radioactive decay', definition: 'A process where unstable nuclei emit particles or radiation.' },
      { term: 'Valence electron', definition: 'An electron in the outermost shell, determining bonding behavior.' }
    ]
  };

  const ViewRenderers = {

    // --- MODE 1: TEACH ME (Immersive 17-Concept Learning Journey) ---
    renderTeachMe() {
      const container = document.createElement('div');
      container.className = 'dynamic-view dv-teach-view';

      const lessons = AtomicData.lessons;
      const totalLessons = lessons.length;

      // Generate lesson navigation items
      const lessonNavItems = lessons.map((lesson, i) => `
        <button class="dv-lesson-nav-item ${i === 0 ? 'active' : ''}" data-index="${i}" title="${lesson.title}">
          <span class="dv-nav-num">${i + 1}</span>
        </button>
      `).join('');

      container.innerHTML = `
        <div class="dv-lesson-container">
          <!-- Left: Lesson Navigation -->
          <nav class="dv-lesson-sidebar">
            <div class="dv-sidebar-header">
              <span class="dv-sidebar-title">Lessons</span>
              <span class="dv-sidebar-progress"><span id="currentNum">1</span>/${totalLessons}</span>
            </div>
            <div class="dv-lesson-nav">
              ${lessonNavItems}
            </div>
          </nav>

          <!-- Main Lesson Content -->
          <main class="dv-lesson-main">
            <div class="dv-lesson-header">
              <div class="dv-lesson-badge">
                <span class="dv-badge-num">Lesson <span id="lessonNum">1</span> of ${totalLessons}</span>
              </div>
              <h1 class="dv-lesson-title" id="lessonTitle">What is an Atom?</h1>
              <p class="dv-lesson-subtitle" id="lessonSubtitle">The building blocks of everything</p>
            </div>

            <div class="dv-lesson-body">
              <!-- Figure floats right, text wraps around -->
              <figure class="dv-lesson-visual">
                <div class="dv-visual-container" id="visualContainer">
                  <div class="dv-atom-visual" id="atomVisual"></div>
                </div>
                <figcaption class="dv-visual-caption" id="visualCaption">Basic atom structure</figcaption>
              </figure>

              <p class="dv-lesson-intro" id="lessonIntro">
                Atoms are the fundamental building blocks of all matter in the universe.
              </p>

              <section class="dv-key-points">
                <h3 class="dv-section-title">Key Points</h3>
                <ul class="dv-points-list" id="keyPointsList">
                </ul>
              </section>

              <section class="dv-example-box" id="exampleBox">
                <div class="dv-example-title" id="exampleTitle">Example</div>
                <p class="dv-example-content" id="exampleContent"></p>
              </section>

              <p class="dv-funfact">
                <span class="dv-funfact-label">Did you know? </span><span class="dv-funfact-text" id="funFactText"></span>
              </p>
            </div>

            <div class="dv-lesson-nav-buttons">
              <button class="dv-lesson-btn dv-btn-prev" id="btnPrev" disabled>← Previous</button>
              <span class="dv-progress-text"><span id="progressNum">1</span> / ${totalLessons}</span>
              <button class="dv-lesson-btn dv-btn-next" id="btnNext">Next →</button>
            </div>
          </main>
        </div>
      `;

      // State
      let currentIndex = 0;

      // Elements
      const lessonNum = container.querySelector('#lessonNum');
      const currentNum = container.querySelector('#currentNum');
      const lessonTitle = container.querySelector('#lessonTitle');
      const lessonSubtitle = container.querySelector('#lessonSubtitle');
      const lessonIntro = container.querySelector('#lessonIntro');
      const keyPointsList = container.querySelector('#keyPointsList');
      const exampleBox = container.querySelector('#exampleBox');
      const exampleTitle = container.querySelector('#exampleTitle');
      const exampleContent = container.querySelector('#exampleContent');
      const funFactText = container.querySelector('#funFactText');
      const progressNum = container.querySelector('#progressNum');
      const navItems = container.querySelectorAll('.dv-lesson-nav-item');
      const btnPrev = container.querySelector('#btnPrev');
      const btnNext = container.querySelector('#btnNext');
      const atomVisual = container.querySelector('#atomVisual');
      const visualCaption = container.querySelector('#visualCaption');

      // Visual renderers for each lesson type
      const renderVisual = (visualType, lessonId) => {
        const visuals = {
          'atom-basic': `
            <div class="dv-atom-visual">
              <div class="dv-nucleus"><div class="dv-proton"></div><div class="dv-neutron"></div></div>
              <div class="dv-electron-orbit orbit-1"><div class="dv-electron"></div></div>
              <div class="dv-electron-orbit orbit-2"><div class="dv-electron"></div></div>
            </div>`,
          'scale': `
            <div class="dv-scale-visual">
              <div class="dv-scale-item atom"><div class="dv-scale-dot"></div><span>Atom</span><small>100 pm</small></div>
              <div class="dv-scale-arrow">× 10,000</div>
              <div class="dv-scale-item cell"><div class="dv-scale-dot"></div><span>Cell</span><small>10 μm</small></div>
              <div class="dv-scale-arrow">× 100</div>
              <div class="dv-scale-item hair"><div class="dv-scale-dot"></div><span>Hair</span><small>100 μm</small></div>
            </div>`,
          'mass': `
            <div class="dv-mass-visual">
              <div class="dv-pie-chart">
                <div class="dv-pie-nucleus">99.94%</div>
                <div class="dv-pie-electrons">0.06%</div>
              </div>
              <div class="dv-mass-label">Mass Distribution</div>
            </div>`,
          'charge': `
            <div class="dv-charge-visual">
              <div class="dv-charge-demo neutral"><span>Neutral</span><small>p+ = e−</small></div>
              <div class="dv-charge-demo cation"><span>Cation +</span><small>p+ > e−</small></div>
              <div class="dv-charge-demo anion"><span>Anion −</span><small>e− > p+</small></div>
            </div>`,
          'particles': `
            <div class="dv-particles-visual">
              <div class="dv-particle electron"><span>e⁻</span><small>Electron</small></div>
              <div class="dv-particle proton"><span>p⁺</span><small>Proton</small></div>
              <div class="dv-particle neutron"><span>n⁰</span><small>Neutron</small></div>
            </div>`,
          'nucleus': `
            <div class="dv-nucleus-visual">
              <div class="dv-big-nucleus">
                ${Array(4).fill('<div class="dv-proton"></div>').join('')}
                ${Array(4).fill('<div class="dv-neutron"></div>').join('')}
              </div>
              <div class="dv-force-lines"></div>
            </div>`,
          'orbitals': `
            <div class="dv-orbital-visual">
              <div class="dv-orbital s-orbital"><span>s</span></div>
              <div class="dv-orbital p-orbital"><span>p</span></div>
              <div class="dv-orbital d-orbital"><span>d</span></div>
            </div>`,
          'isotopes': `
            <div class="dv-isotopes-visual">
              <div class="dv-isotope"><div class="dv-iso-nucleus n0"></div><span>¹H</span><small>Protium</small></div>
              <div class="dv-isotope"><div class="dv-iso-nucleus n1"></div><span>²H</span><small>Deuterium</small></div>
              <div class="dv-isotope"><div class="dv-iso-nucleus n2"></div><span>³H</span><small>Tritium</small></div>
            </div>`,
          'mass-number': `
            <div class="dv-mass-number-visual">
              <div class="dv-element-box">
                <span class="dv-mass-num">12</span>
                <span class="dv-element-sym">C</span>
                <span class="dv-atomic-num">6</span>
              </div>
              <div class="dv-mass-eq">Mass ≈ 12 Da</div>
            </div>`,
          'size': `
            <div class="dv-size-visual">
              <div class="dv-size-atom small"><span>He</span><small>32 pm</small></div>
              <div class="dv-size-atom medium"><span>C</span><small>77 pm</small></div>
              <div class="dv-size-atom large"><span>Cs</span><small>225 pm</small></div>
            </div>`,
          'decay': `
            <div class="dv-decay-visual">
              <div class="dv-decay-type alpha">α<small>Alpha</small></div>
              <div class="dv-decay-type beta">β<small>Beta</small></div>
              <div class="dv-decay-type gamma">γ<small>Gamma</small></div>
            </div>`,
          'magnetic': `
            <div class="dv-magnetic-visual">
              <div class="dv-spin up">↑</div>
              <div class="dv-spin down">↓</div>
              <div class="dv-magnet-icon">N S</div>
            </div>`,
          'spectra': `
            <div class="dv-spectra-visual">
              <div class="dv-energy-level e3">n=3</div>
              <div class="dv-energy-level e2">n=2</div>
              <div class="dv-energy-level e1">n=1</div>
              <div class="dv-photon">hν</div>
            </div>`,
          'bonding': `
            <div class="dv-bonding-visual">
              <div class="dv-bond ionic"><span>Na⁺Cl⁻</span><small>Ionic</small></div>
              <div class="dv-bond covalent"><span>H-H</span><small>Covalent</small></div>
            </div>`,
          'forces': `
            <div class="dv-forces-visual">
              <div class="dv-force em"><span>E</span><small>EM Force</small></div>
              <div class="dv-force strong"><span>S</span><small>Strong Force</small></div>
            </div>`,
          'origin': `
            <div class="dv-origin-visual">
              <div class="dv-cosmic bigbang"><span>1</span><small>Big Bang</small></div>
              <div class="dv-cosmic star"><span>2</span><small>Stars</small></div>
              <div class="dv-cosmic supernova"><span>3</span><small>Supernova</small></div>
            </div>`,
          'history': `
            <div class="dv-history-visual">
              <div class="dv-timeline-mini">
                <span>400 BCE</span>
                <span>1803</span>
                <span>1897</span>
                <span>1911</span>
                <span>1926</span>
              </div>
            </div>`
        };
        return visuals[visualType] || visuals['atom-basic'];
      };

      const captions = {
        'atom-basic': 'Basic atom structure: nucleus + electron cloud',
        'scale': 'Scale comparison: atom → cell → hair',
        'mass': '99.94% of mass concentrated in nucleus',
        'charge': 'Neutral atoms vs. charged ions',
        'particles': 'The three subatomic particles',
        'nucleus': 'Protons & neutrons bound by strong force',
        'orbitals': 'Electron orbital shapes: s, p, d',
        'isotopes': 'Hydrogen isotopes with 0, 1, 2 neutrons',
        'mass-number': 'Reading element notation',
        'size': 'Atomic size: smallest to largest',
        'decay': 'Three types of radioactive decay',
        'magnetic': 'Electron spin creates magnetism',
        'spectra': 'Energy levels and photon emission',
        'bonding': 'Ionic vs. covalent bonding',
        'forces': 'Two forces that govern atoms',
        'origin': 'Cosmic origins of atoms',
        'history': 'Timeline of atomic theory'
      };

      const updateLesson = (index) => {
        if (index < 0 || index >= lessons.length) return;
        currentIndex = index;
        const lesson = lessons[index];

        // Update header
        lessonNum.textContent = lesson.id;
        currentNum.textContent = lesson.id;
        lessonTitle.textContent = lesson.title;
        lessonSubtitle.textContent = lesson.subtitle;
        lessonIntro.textContent = lesson.intro;

        // Update key points
        keyPointsList.innerHTML = lesson.keyPoints.map(point =>
          `<li class="dv-point-item">${point}</li>`
        ).join('');

        // Update example
        exampleTitle.textContent = lesson.example.title;
        exampleContent.textContent = lesson.example.content;

        // Update fun fact
        funFactText.innerHTML = lesson.funFact;

        // Update visual - use canvas animation if available, fallback to static HTML
        if (window.LessonAnimations && window.LessonAnimations.has(lesson.visual)) {
          atomVisual.innerHTML = ''; // Clear for canvas
          window.LessonAnimations.start(lesson.visual, atomVisual);
        } else {
          atomVisual.innerHTML = renderVisual(lesson.visual, lesson.id);
        }
        visualCaption.textContent = captions[lesson.visual] || '';

        // Update progress display
        progressNum.textContent = index + 1;

        // Update nav items
        navItems.forEach((item, i) => {
          item.classList.toggle('active', i === index);
          item.classList.toggle('completed', i < index);
        });

        // Update buttons
        btnPrev.disabled = index === 0;
        if (index === lessons.length - 1) {
          btnNext.textContent = 'Complete';
          btnNext.disabled = true;
        } else {
          btnNext.textContent = 'Next Lesson →';
          btnNext.disabled = false;
        }

        // Scroll to top of lesson
        container.querySelector('.dv-lesson-main').scrollTop = 0;
      };

      // Event Listeners
      setTimeout(() => {
        updateLesson(0);

        btnNext.addEventListener('click', () => {
          if (currentIndex < lessons.length - 1) {
            updateLesson(currentIndex + 1);
          }
        });

        btnPrev.addEventListener('click', () => {
          if (currentIndex > 0) {
            updateLesson(currentIndex - 1);
          }
        });

        navItems.forEach((item, i) => {
          item.addEventListener('click', () => updateLesson(i));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' && currentIndex < lessons.length - 1) {
            updateLesson(currentIndex + 1);
          } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            updateLesson(currentIndex - 1);
          }
        });
      }, 0);

      return container;
    },

    // --- MODE 2: QUICK FACTS (Wikipedia-Native Facts View) ---
    renderQuickFacts() {
      const container = document.createElement('div');
      container.className = 'dynamic-view';

      // Key stats to highlight at the top
      const keyStats = [
        { value: '~100 pm', label: 'Typical size' },
        { value: '99.94%', label: 'Mass in nucleus' },
        { value: '118', label: 'Known elements' },
        { value: '10²²', label: 'Atoms in a diamond' }
      ];

      // Generate key stats HTML
      const statsHTML = keyStats.map(stat => `
        <div class="dv-stat-card">
          <div class="dv-stat-value">${stat.value}</div>
          <div class="dv-stat-label">${stat.label}</div>
        </div>
      `).join('');

      // Generate all sections (no tabs, all visible)
      const sectionsHTML = AtomicData.factCategories.map(cat => {
        const factsHTML = cat.facts.map(fact => `
          <li class="dv-qf-item">${fact}</li>
        `).join('');

        return `
          <section class="dv-qf-section">
            <h3 class="dv-qf-heading">${cat.name}</h3>
            <ul class="dv-qf-list">
              ${factsHTML}
            </ul>
          </section>
        `;
      }).join('');

      container.innerHTML = `
        <div class="dv-facts-dashboard">
          <div class="dv-stats-row">
            ${statsHTML}
          </div>
          <div class="dv-qf-grid">
            ${sectionsHTML}
          </div>
        </div>
      `;

      return container;
    },

    // --- MODE 3: GLOSSARY (A-Z Term Definitions) ---
    renderGlossary() {
      const container = document.createElement('div');
      container.className = 'dynamic-view dv-glossary-view';

      const terms = AtomicData.glossary;

      // Group terms by first letter
      const grouped = {};
      terms.forEach(item => {
        const letter = item.term[0].toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(item);
      });

      // Generate letter navigation
      const letters = Object.keys(grouped).sort();
      const letterNav = letters.map(l => `
        <a href="#glossary-${l}" class="dv-glossary-letter">${l}</a>
      `).join('');

      // Generate term sections
      const sectionsHTML = letters.map(letter => {
        const termsHTML = grouped[letter].map(item => `
          <dt class="dv-glossary-term">${item.term}</dt>
          <dd class="dv-glossary-def">${item.definition}</dd>
        `).join('');

        return `
          <section class="dv-glossary-section" id="glossary-${letter}">
            <h3 class="dv-glossary-heading">${letter}</h3>
            <dl class="dv-glossary-list">
              ${termsHTML}
            </dl>
          </section>
        `;
      }).join('');

      container.innerHTML = `
        <div class="dv-glossary-container">
          <div class="dv-glossary-nav">
            ${letterNav}
          </div>
          <div class="dv-glossary-content">
            ${sectionsHTML}
          </div>
        </div>
      `;

      return container;
    },

    renderFullArticle(content) {
      // Fallback to standard view
      const container = document.createElement('div');
      container.innerHTML = `<div class="dv-full-banner">Full Article Mode</div>`;
      return container;
    }
  };

  // --- Main Transform Logic (Simplified for Demo) ---
  function transformContent(intentId) {
    const container = document.querySelector('.mw-parser-output'); // Wikipedia content root
    if (!container) return;

    // Stop any running canvas animations when switching views
    if (window.LessonAnimations) {
      window.LessonAnimations.stop();
    }

    // Hide original
    container.style.display = 'none';

    // Remove old view
    const old = document.querySelector('.dynamic-view');
    if (old) old.remove();

    // Body Class for global styling - remove old intent classes first, then add new one
    document.body.classList.remove('intent-teach-me', 'intent-quick-facts', 'intent-glossary', 'intent-full-article');
    document.body.classList.add(`intent-${intentId}`);

    // Extract minimal data (Title/Intro) for Research Mode context
    const basicContent = {
      title: document.querySelector('h1').innerText,
      introduction: Array.from(container.querySelectorAll('p')).slice(0, 4).map(p => p.innerHTML)
    };

    let view;
    switch (intentId) {
      case 'teach-me': view = ViewRenderers.renderTeachMe(); break;
      case 'quick-facts': view = ViewRenderers.renderQuickFacts(); break;
      case 'glossary': view = ViewRenderers.renderGlossary(); break;
      default:
        container.style.display = 'block';
        return;
    }

    container.parentNode.insertBefore(view, container);
  }

  // Expose
  window.DynamicView = { transform: transformContent };

  // Listen for intent selection events from sidebar/modal
  document.addEventListener('intentSelected', (e) => {
    console.log('[Dynamic View] Intent selected:', e.detail.intent);
    transformContent(e.detail.intent);
  });

  // Auto-init based on URL for testing
  const params = new URLSearchParams(window.location.search);
  if (params.get('intent')) {
    setTimeout(() => transformContent(params.get('intent')), 500);
  }

  console.log('[Dynamic View] Module loaded');
})();
