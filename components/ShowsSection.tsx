const PLAY_ICON = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

interface Adaptation {
  href: string;
  src: string;
  alt: string;
  flag: string;
  locale: string;
}

interface Show {
  title: string;
  href: string;
  thumb: string;
  tags: string[];
  listeners: string;
  minutesPlayed: string;
  adaptations: Adaptation[];
}

const SHOWS: Show[] = [
  {
    title: 'My Vampire System',
    href: 'https://pocketfm.com/show/a2fa57d4cb8267b2645f2b588c39951fbf65093a',
    thumb: '/thumbnails/shows/my-vampire-system.webp',
    tags: ['Urban fantasy', 'Vampires', 'Power system'],
    listeners: '2.1M',
    minutesPlayed: '21.3M',
    adaptations: [
      { href: 'https://pocketfm.com/show/68f1083ce00e4ab5ec119818e92ac62e7c8e20c9', src: '/thumbnails/shows/my-vampire-system-es.webp', alt: 'El Código Del Vampiro', flag: 'fi-es', locale: 'Spanish' },
      { href: 'https://pocketfm.com/show/1b10e970f5837102b1d99e6e5fa98427372a5a41', src: '/thumbnails/shows/my-vampire-system-de.webp', alt: 'Das Vampirsystem', flag: 'fi-de', locale: 'German' },
      { href: 'https://pocketfm.com/show/d84923d9659f6241e8a6943e096ea74c16dc5abd', src: '/thumbnails/shows/my-vampire-system-fr.jpg', alt: 'Code Vampire', flag: 'fi-fr', locale: 'French' },
    ],
  },
  {
    title: "The Alpha's Bride",
    href: 'https://pocketfm.com/show/cbc35fa13bbe154873ec97f78f2b4cf4b66c7d31',
    thumb: '/thumbnails/shows/alphas-bride.webp',
    tags: ['Werewolf', 'Romance', 'Paranormal'],
    listeners: '1.5M',
    minutesPlayed: '14.6M',
    adaptations: [
      { href: 'https://pocketfm.com/show/3a195b6ec3953f6a70aae829d7b99b59eff91c9a', src: '/thumbnails/shows/alphas-bride-es.webp', alt: 'Una Luna Para Un Alfa', flag: 'fi-es', locale: 'Spanish' },
      { href: 'https://pocketfm.com/show/84528b8da9e2a026d4a04b73f0a744f2f01d5b1b', src: '/thumbnails/shows/alphas-bride-de.webp', alt: 'Vom Alpha Begehrt', flag: 'fi-de', locale: 'German' },
      { href: 'https://pocketfm.com/show/66b9c77ce99c2c1ff3060e9dc11e0245a9489e37', src: '/thumbnails/shows/alphas-bride-fr.jpg', alt: "La Fiancée De l'Alpha", flag: 'fi-fr', locale: 'French' },
    ],
  },
  {
    title: 'Saving Nora',
    href: 'https://pocketfm.com/show/33adb096b04ecd6b23ce9341160b199f2d489311',
    thumb: '/thumbnails/shows/saving-nora.webp',
    tags: ['Family drama', 'Slow burn', 'Emotional'],
    listeners: '1.4M',
    minutesPlayed: '10.1M',
    adaptations: [
      { href: 'https://pocketfm.com/show/1f1318b281496d1abc92e811bb7052a1d821a20a', src: '/thumbnails/shows/saving-nora-es.webp', alt: 'Salvando a Nora', flag: 'fi-es', locale: 'Spanish' },
      { href: 'https://pocketfm.com/show/ce504962514be83e34b3b2c024473452d1eab47b', src: '/thumbnails/shows/saving-nora-de.webp', alt: 'Noras Geheimnis', flag: 'fi-de', locale: 'German' },
      { href: 'https://pocketfm.com/show/c5239b008e0cfb68b98a55da191e17dd019c4616', src: '/thumbnails/shows/saving-nora-fr.webp', alt: 'Le Secret De Nora', flag: 'fi-fr', locale: 'French' },
    ],
  },
  {
    title: "The Duke's Masked Bride",
    href: 'https://pocketfm.com/show/cd532605283eb73524e7a93c4f887f670a980c19',
    thumb: '/thumbnails/shows/dukes-masked-bride.webp',
    tags: ['Regency', 'Romance', 'Historical'],
    listeners: '1.1M',
    minutesPlayed: '7.9M',
    adaptations: [
      { href: 'https://pocketfm.com/show/dc3db01aaede9859b679931f15a6444a9b7743f6', src: '/thumbnails/shows/dukes-masked-bride-es.webp', alt: 'La Novia Enmascarada Del Marqués', flag: 'fi-es', locale: 'Spanish' },
      { href: 'https://pocketfm.com/show/f2850c5f071ff8b74eadaf90c05bf1d3036775ee', src: '/thumbnails/shows/dukes-masked-bride-de.webp', alt: 'Die maskierte Schönheit', flag: 'fi-de', locale: 'German' },
      { href: 'https://pocketfm.com/show/95e72b715f476626585302cefa3204714880ef81', src: '/thumbnails/shows/dukes-masked-bride-fr.png', alt: 'Beauté Masquée', flag: 'fi-fr', locale: 'French' },
    ],
  },
];

export default function ShowsSection() {
  return (
    <div className="show-grid">
      {SHOWS.map((show) => (
        <>
          <div key={show.href} className="show-card">
            <a className="show-card-thumb-wrap" href={show.href} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={show.thumb} alt="" className="show-card-thumb" />
              <span className="show-thumb-play" aria-hidden="true">{PLAY_ICON}</span>
            </a>
            <div className="show-card-info">
              <h3 className="t-h4">{show.title}</h3>
              <div className="show-tags">
                {show.tags.map((tag) => (
                  <span key={tag} className="show-tag">{tag}</span>
                ))}
              </div>
              <div className="show-stats">
                <span className="show-stat"><strong>{show.listeners}</strong> listeners</span>
                <span className="show-stat-sep">·</span>
                <span className="show-stat"><strong>{show.minutesPlayed}</strong> minutes played</span>
              </div>
            </div>
          </div>
          <div key={`${show.href}-adaptations`} className="show-card show-card-adaptations">
            {show.adaptations.map((a) => (
              <a key={a.href} className="show-adapt-thumb" href={a.href} target="_blank" rel="noopener">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.src} alt={a.alt} />
                <span className="show-adapt-pill">
                  <span className={`locale-flag fi ${a.flag}`} />
                  {a.locale}
                </span>
                <span className="show-thumb-play" aria-hidden="true">{PLAY_ICON}</span>
              </a>
            ))}
          </div>
        </>
      ))}
    </div>
  );
}
