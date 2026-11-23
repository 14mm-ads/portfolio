export type Orientation = string

export type DemoProject = {
  id: string
  slug: string
  title: string
  brand: string
  associatedBrands: string[]
  brandLogo: string
  sector: string
  businessCategory: string
  language: string
  year: number
  campaignType: string
  adFormat: string
  platform: string[]
  orientation: Orientation
  duration: string
  videoSrc: string | null
  posterSrc: string
  captionSrc: string | null
  featured: boolean
  isDemo?: boolean
  description: string
  credits: string[]
  tags: string[]
  accentColor: string
}

export const projects: DemoProject[] = [
  {
    id: 'demo-01',
    slug: 'first-light',
    title: 'First Light',
    brand: 'Demo Brand 01',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Food & beverage',
    businessCategory: 'Coffee',
    language: 'English',
    year: 2025,
    campaignType: 'Brand awareness',
    adFormat: 'Brand film',
    platform: ['YouTube', 'Theatre'],
    orientation: 'Landscape',
    duration: '00:30',
    videoSrc: '/videos/landscape/demo-brand-01-first-light-brand-film-english-landscape.mp4',
    posterSrc: '/images/posters/demo-01.svg',
    captionSrc: null,
    featured: true,
    description: 'A quiet morning ritual, framed as an invitation to begin again.',
    credits: ['Film direction', 'Production'],
    tags: ['Morning', 'Atmospheric'],
    accentColor: '#c88652',
  },
  {
    id: 'demo-02',
    slug: 'small-things-big-days',
    title: 'Small Things, Big Days',
    brand: 'Demo Brand 02',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Home & living',
    businessCategory: 'Home goods',
    language: 'Hindi',
    year: 2025,
    campaignType: 'Festive campaign',
    adFormat: 'Social film',
    platform: ['Instagram Reels', 'YouTube Shorts'],
    orientation: 'Vertical',
    duration: '00:20',
    videoSrc: '/videos/vertical/demo-brand-02-festive-social-hindi-vertical.mp4',
    posterSrc: '/images/posters/demo-02.svg',
    captionSrc: null,
    featured: true,
    description: 'An intimate festive story about the details that make a home.',
    credits: ['Creative direction', 'Production'],
    tags: ['Festive', 'Family'],
    accentColor: '#b87455',
  },
  {
    id: 'demo-03',
    slug: 'the-extra-mile',
    title: 'The Extra Mile',
    brand: 'Demo Brand 03',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Automotive',
    businessCategory: 'Electric mobility',
    language: 'Tamil',
    year: 2024,
    campaignType: 'Product launch',
    adFormat: 'Product film',
    platform: ['YouTube', 'Instagram'],
    orientation: 'Landscape',
    duration: '00:45',
    videoSrc: '/videos/landscape/demo-brand-03-product-launch-tamil-landscape.mp4',
    posterSrc: '/images/posters/demo-03.svg',
    captionSrc: null,
    featured: true,
    description: 'A product introduction told through a journey beyond the expected.',
    credits: ['Concept', 'Film production'],
    tags: ['Motion', 'Travel'],
    accentColor: '#739d9b',
  },
  {
    id: 'demo-04',
    slug: 'a-good-kind-of-loud',
    title: 'A Good Kind of Loud',
    brand: 'Demo Brand 04',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Technology',
    businessCategory: 'Audio',
    language: 'Malayalam',
    year: 2024,
    campaignType: 'Product launch',
    adFormat: 'Vertical advertisement',
    platform: ['Instagram Reels', 'TikTok'],
    orientation: 'Vertical',
    duration: '00:15',
    videoSrc: '/videos/vertical/demo-brand-04-audio-launch-malayalam-vertical.mp4',
    posterSrc: '/images/posters/demo-04.svg',
    captionSrc: null,
    featured: false,
    description: 'A punchy portrait-format product spot built around the feeling of sound.',
    credits: ['Concept', 'Social production'],
    tags: ['Sound', 'Fast-cut'],
    accentColor: '#9575bd',
  },
  {
    id: 'demo-05',
    slug: 'made-of-more',
    title: 'Made of More',
    brand: 'Demo Brand 05',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Personal care',
    businessCategory: 'Skin care',
    language: 'English',
    year: 2025,
    campaignType: 'Testimonial',
    adFormat: 'Testimonial film',
    platform: ['YouTube', 'Instagram'],
    orientation: 'Landscape',
    duration: '01:00',
    videoSrc: '/videos/landscape/demo-brand-05-testimonial-english-landscape.mp4',
    posterSrc: '/images/posters/demo-05.svg',
    captionSrc: null,
    featured: false,
    description: 'A considered conversation about the small choices behind everyday care.',
    credits: ['Interview direction', 'Production'],
    tags: ['People', 'Natural light'],
    accentColor: '#bd9d70',
  },
  {
    id: 'demo-06',
    slug: 'the-long-weekend',
    title: 'The Long Weekend',
    brand: 'Demo Brand 06',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Travel & hospitality',
    businessCategory: 'Hospitality',
    language: 'Kannada',
    year: 2023,
    campaignType: 'Seasonal campaign',
    adFormat: 'Digital video ad',
    platform: ['YouTube', 'Facebook'],
    orientation: 'Landscape',
    duration: '00:30',
    videoSrc: '/videos/landscape/demo-brand-06-seasonal-kannada-landscape.mp4',
    posterSrc: '/images/posters/demo-06.svg',
    captionSrc: null,
    featured: false,
    description: 'A scenic invitation to trade the familiar routine for a change of pace.',
    credits: ['Campaign concept', 'Film production'],
    tags: ['Travel', 'Seasonal'],
    accentColor: '#678b79',
  },
  {
    id: 'demo-07',
    slug: 'good-on-the-go',
    title: 'Good on the Go',
    brand: 'Demo Brand 07',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Food & beverage',
    businessCategory: 'Quick service',
    language: 'Hindi',
    year: 2025,
    campaignType: 'Promotional campaign',
    adFormat: 'Short-form social',
    platform: ['Instagram Reels', 'YouTube Shorts'],
    orientation: 'Vertical',
    duration: '00:15',
    videoSrc: '/videos/vertical/demo-brand-07-promotion-hindi-vertical.mp4',
    posterSrc: '/images/posters/demo-07.svg',
    captionSrc: null,
    featured: false,
    description: 'A lively short-form spot made for a lunch break that refuses to be boring.',
    credits: ['Social concept', 'Production'],
    tags: ['Food', 'Quick edit'],
    accentColor: '#d28249',
  },
  {
    id: 'demo-08',
    slug: 'in-good-company',
    title: 'In Good Company',
    brand: 'Demo Brand 08',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Finance',
    businessCategory: 'Digital banking',
    language: 'Telugu',
    year: 2024,
    campaignType: 'Brand awareness',
    adFormat: 'Theatre commercial',
    platform: ['Theatre', 'YouTube'],
    orientation: 'Landscape',
    duration: '00:40',
    videoSrc: '/videos/landscape/demo-brand-08-theatre-telugu-landscape.mp4',
    posterSrc: '/images/posters/demo-08.svg',
    captionSrc: null,
    featured: false,
    description: 'A warm, people-first story about making the big decisions feel simpler.',
    credits: ['Script', 'Film production'],
    tags: ['People', 'Story'],
    accentColor: '#60808b',
  },
  {
    id: 'demo-09',
    slug: 'move-with-the-moment',
    title: 'Move with the Moment',
    brand: 'Demo Brand 09',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Fitness & wellness',
    businessCategory: 'Fitness',
    language: 'English',
    year: 2023,
    campaignType: 'Influencer-led',
    adFormat: 'Influencer collaboration',
    platform: ['Instagram', 'TikTok'],
    orientation: 'Vertical',
    duration: '00:25',
    videoSrc: '/videos/vertical/demo-brand-09-influencer-english-vertical.mp4',
    posterSrc: '/images/posters/demo-09.svg',
    captionSrc: null,
    featured: false,
    description: 'A creator-led burst of movement and motivation for the everyday athlete.',
    credits: ['Creator direction', 'Social production'],
    tags: ['Creator', 'Movement'],
    accentColor: '#b77b7c',
  },
  {
    id: 'demo-10',
    slug: 'made-here-shared-everywhere',
    title: 'Made Here, Shared Everywhere',
    brand: 'Demo Brand 10',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Culture & events',
    businessCategory: 'Live events',
    language: 'Bengali',
    year: 2025,
    campaignType: 'Event promotion',
    adFormat: 'Event trailer',
    platform: ['YouTube', 'Instagram'],
    orientation: 'Landscape',
    duration: '00:35',
    videoSrc: '/videos/landscape/demo-brand-10-event-bengali-landscape.mp4',
    posterSrc: '/images/posters/demo-10.svg',
    captionSrc: null,
    featured: false,
    description: 'A trailer capturing the anticipation, craft and energy of a city gathering.',
    credits: ['Campaign direction', 'Event film'],
    tags: ['Culture', 'Event'],
    accentColor: '#bd6d5b',
  },
  {
    id: 'demo-11',
    slug: 'one-more-chapter',
    title: 'One More Chapter',
    brand: 'Demo Brand 11',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Education',
    businessCategory: 'Learning',
    language: 'Marathi',
    year: 2024,
    campaignType: 'Brand awareness',
    adFormat: 'User-generated content',
    platform: ['Instagram Reels', 'Facebook'],
    orientation: 'Vertical',
    duration: '00:20',
    videoSrc: '/videos/vertical/demo-brand-11-ugc-marathi-vertical.mp4',
    posterSrc: '/images/posters/demo-11.svg',
    captionSrc: null,
    featured: false,
    description: 'A student-perspective story about the spark that starts a new chapter.',
    credits: ['Creative direction', 'Social production'],
    tags: ['Learning', 'Creator style'],
    accentColor: '#7f9b73',
  },
  {
    id: 'demo-12',
    slug: 'the-everyday-upgrade',
    title: 'The Everyday Upgrade',
    brand: 'Demo Brand 12',
    associatedBrands: [],
    brandLogo: '',
    sector: 'Retail',
    businessCategory: 'Consumer electronics',
    language: 'Odia',
    year: 2023,
    campaignType: 'Moment marketing',
    adFormat: 'In-store advertisement',
    platform: ['In-store', 'YouTube'],
    orientation: 'Landscape',
    duration: '00:15',
    videoSrc: '/videos/landscape/demo-brand-12-instore-odia-landscape.mp4',
    posterSrc: '/images/posters/demo-12.svg',
    captionSrc: null,
    featured: false,
    description: 'A bright, concise look at the little upgrade that changes a daily routine.',
    credits: ['Campaign concept', 'Production'],
    tags: ['Retail', 'Product'],
    accentColor: '#947ba5',
  },
]

type AdditionalProject = Pick<DemoProject, 'title' | 'slug' | 'sector' | 'language' | 'orientation' | 'duration' | 'description' | 'tags'> & {
  category: string
  campaign: string
  format: string
  platforms: string[]
  color: string
}

const additionalProjects = [
  { title: 'The Shape of Sunday', slug: 'shape-of-sunday', sector: 'Travel & hospitality', category: 'Boutique stay', language: 'Tamil', campaign: 'Seasonal campaign', format: 'Brand film', platforms: ['YouTube', 'Theatre'], orientation: 'Landscape', duration: '00:30', description: 'A slow, sunlit invitation to make room for a different kind of weekend.', tags: ['Escape', 'Slow living'], color: '#ad7555' },
  { title: 'Good Energy, All Day', slug: 'good-energy-all-day', sector: 'Food & beverage', category: 'Plant-based drink', language: 'Hindi', campaign: 'Product launch', format: 'Vertical advertisement', platforms: ['Instagram Reels', 'TikTok'], orientation: 'Vertical', duration: '00:15', description: 'A spirited portrait-format product spot with a bright, everyday rhythm.', tags: ['Energy', 'Quick-cut'], color: '#cf9152' },
  { title: 'A Better Kind of Busy', slug: 'better-kind-of-busy', sector: 'Technology', category: 'Productivity software', language: 'English', campaign: 'Brand awareness', format: 'Digital video ad', platforms: ['YouTube', 'LinkedIn'], orientation: 'Landscape', duration: '00:30', description: 'A human look at making space for the work that matters most.', tags: ['Work', 'Human stories'], color: '#658c93' },
  { title: 'Find Your Own Pace', slug: 'find-your-own-pace', sector: 'Fitness & wellness', category: 'Running', language: 'Malayalam', campaign: 'Influencer-led', format: 'Influencer collaboration', platforms: ['Instagram Reels', 'YouTube Shorts'], orientation: 'Vertical', duration: '00:20', description: 'Creator-led movement for anyone finding their own way forward.', tags: ['Movement', 'Creator'], color: '#8d956b' },
  { title: 'The Colour of Home', slug: 'colour-of-home', sector: 'Home & living', category: 'Interior paint', language: 'Bengali', campaign: 'Festive campaign', format: 'Theatre commercial', platforms: ['Theatre', 'YouTube'], orientation: 'Landscape', duration: '00:45', description: 'A festive story told through the colours, rituals and rooms we share.', tags: ['Home', 'Festive'], color: '#ae7066' },
  { title: 'One Click Closer', slug: 'one-click-closer', sector: 'Finance', category: 'Mobile payments', language: 'Telugu', campaign: 'Promotional campaign', format: 'Short-form social', platforms: ['Instagram Reels', 'YouTube Shorts'], orientation: 'Vertical', duration: '00:15', description: 'A crisp short-form demo of small everyday transactions made simpler.', tags: ['Everyday', 'Digital'], color: '#57858a' },
  { title: 'Wild, Not Far Away', slug: 'wild-not-far-away', sector: 'Travel & hospitality', category: 'Eco travel', language: 'Kannada', campaign: 'Brand awareness', format: 'Promotional video', platforms: ['YouTube', 'Facebook'], orientation: 'Landscape', duration: '00:40', description: 'A cinematic reminder that a little wonder can be closer than you think.', tags: ['Nature', 'Travel'], color: '#638a70' },
  { title: 'A Little More You', slug: 'a-little-more-you', sector: 'Personal care', category: 'Hair care', language: 'Marathi', campaign: 'Product launch', format: 'Product film', platforms: ['Instagram', 'YouTube'], orientation: 'Landscape', duration: '00:30', description: 'A tactile product film celebrating personal style and everyday rituals.', tags: ['Care', 'Texture'], color: '#ad7b88' },
  { title: 'Keep the Good Close', slug: 'keep-the-good-close', sector: 'Retail', category: 'Grocery', language: 'Odia', campaign: 'Moment marketing', format: 'In-store advertisement', platforms: ['In-store', 'Instagram'], orientation: 'Landscape', duration: '00:15', description: 'A warm retail moment about the familiar favourites that bring us together.', tags: ['Retail', 'Together'], color: '#9b895b' },
  { title: 'Tomorrow Starts Here', slug: 'tomorrow-starts-here', sector: 'Education', category: 'Online learning', language: 'Assamese', campaign: 'Brand awareness', format: 'Testimonial film', platforms: ['YouTube', 'Facebook'], orientation: 'Landscape', duration: '00:45', description: 'A personal student story about the confidence to start something new.', tags: ['Learning', 'People'], color: '#60877d' },
  { title: 'Bring the Room Together', slug: 'bring-the-room-together', sector: 'Technology', category: 'Smart home', language: 'Urdu', campaign: 'Product launch', format: 'Vertical advertisement', platforms: ['Instagram Reels', 'TikTok'], orientation: 'Vertical', duration: '00:20', description: 'A compact product story about little moments made more connected.', tags: ['Smart home', 'Together'], color: '#8c79a4' },
  { title: 'This Is Our Table', slug: 'this-is-our-table', sector: 'Food & beverage', category: 'Regional cuisine', language: 'Punjabi', campaign: 'Seasonal campaign', format: 'Song-based commercial', platforms: ['YouTube', 'Instagram'], orientation: 'Landscape', duration: '00:30', description: 'A music-led celebration of the dishes and stories that make a gathering.', tags: ['Music', 'Food'], color: '#be7950' },
  { title: 'Every Street Has a Story', slug: 'every-street-has-a-story', sector: 'Automotive', category: 'Urban mobility', language: 'Gujarati', campaign: 'Brand awareness', format: 'Brand film', platforms: ['Theatre', 'YouTube'], orientation: 'Landscape', duration: '00:45', description: 'A city-paced film finding a different point of view on the daily commute.', tags: ['City', 'Motion'], color: '#5f7889' },
  { title: 'Made for the Replay', slug: 'made-for-the-replay', sector: 'Culture & events', category: 'Music festival', language: 'English', campaign: 'Event promotion', format: 'Event trailer', platforms: ['Instagram', 'YouTube'], orientation: 'Vertical', duration: '00:20', description: 'A fast-moving teaser made to bring the anticipation before the first note.', tags: ['Music', 'Live'], color: '#9c6685' },
  { title: 'Small Wins Count', slug: 'small-wins-count', sector: 'Finance', category: 'Savings', language: 'Tamil', campaign: 'Brand awareness', format: 'User-generated content', platforms: ['Instagram Reels', 'Facebook'], orientation: 'Vertical', duration: '00:20', description: 'A relatable creator-style film about the small steps that add up.', tags: ['UGC', 'Everyday'], color: '#738e75' },
  { title: 'Ready When You Are', slug: 'ready-when-you-are', sector: 'Automotive', category: 'Electric scooter', language: 'Hindi', campaign: 'Product launch', format: 'Product film', platforms: ['YouTube', 'Instagram'], orientation: 'Landscape', duration: '00:30', description: 'A clean product introduction designed around the ease of setting off.', tags: ['Product', 'City'], color: '#62888c' },
  { title: 'More Than a Moment', slug: 'more-than-a-moment', sector: 'Personal care', category: 'Wellness', language: 'Malayalam', campaign: 'Festive campaign', format: 'Digital video ad', platforms: ['Instagram', 'YouTube Shorts'], orientation: 'Vertical', duration: '00:15', description: 'A quiet, portrait-format pause in the middle of a full calendar.', tags: ['Wellbeing', 'Pause'], color: '#ae8877' },
  { title: 'A Place at the Front', slug: 'a-place-at-the-front', sector: 'Education', category: 'Early learning', language: 'Bengali', campaign: 'Brand awareness', format: 'Theatre commercial', platforms: ['Theatre', 'YouTube'], orientation: 'Landscape', duration: '00:40', description: 'A hopeful film about curiosity and making room for new voices.', tags: ['Curiosity', 'Story'], color: '#78906a' },
] satisfies AdditionalProject[]

projects.push(...additionalProjects.map((project, index): DemoProject => {
  const number = index + 13
  const orientation = project.orientation
  const posterNumber = String(number).padStart(2, '0')
  const videoName = `demo-brand-${posterNumber}-${project.slug}-${project.language.toLowerCase()}-${orientation.toLowerCase()}.mp4`
  const { category, campaign, format, platforms, color, ...details } = project
  return {
    ...details,
    id: `demo-${posterNumber}`,
    brand: `Demo Brand ${posterNumber}`,
    associatedBrands: [],
    brandLogo: '',
    businessCategory: category,
    year: 2023 + (index % 3),
    campaignType: campaign,
    adFormat: format,
    platform: platforms,
    videoSrc: `/videos/${orientation.toLowerCase()}/${videoName}`,
    posterSrc: `/images/posters/demo-${posterNumber}.svg`,
    captionSrc: null,
    featured: [15, 20, 25, 30].includes(number),
    credits: ['Creative direction', 'Production'],
    accentColor: color,
  }
}))

projects.forEach((project, index) => {
  project.associatedBrands = index < 20 ? [`Demo Brand ${String(index + 31).padStart(2, '0')}`] : []
})

export const filterFields = [
  { key: 'brand', label: 'Brand' },
  { key: 'sector', label: 'Sector' },
  { key: 'businessCategory', label: 'Category' },
  { key: 'language', label: 'Language' },
  { key: 'adFormat', label: 'Ad format' },
  { key: 'campaignType', label: 'Campaign' },
  { key: 'platform', label: 'Platform' },
  { key: 'orientation', label: 'Orientation' },
  { key: 'year', label: 'Year' },
] as const

export function getOptions(field: string, source: DemoProject[] = projects) {
  if (field === 'brand') {
    return [...new Set(source.flatMap((project) => [project.brand, ...project.associatedBrands]))]
      .sort((a, b) => a.localeCompare(b))
  }
  const values = source.flatMap((project) => {
    const value = project[field as keyof DemoProject]
    return Array.isArray(value) ? value : value !== null && value !== undefined ? [String(value)] : []
  })
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

export function matchesFilter(project: DemoProject, field: string, value: string) {
  if (field === 'brand') return project.brand === value || project.associatedBrands.includes(value)
  const projectValue = project[field as keyof DemoProject]
  return Array.isArray(projectValue)
    ? projectValue.includes(value)
    : String(projectValue ?? '') === value
}
