export type LocaleMeta = {
  code: string;
  countryCode: string;
  name: string;
  region: string;
};

export const ALL_LOCALES: LocaleMeta[] = [
  { code: 'de', countryCode: 'de', name: 'German', region: 'Germany' },
  { code: 'fr', countryCode: 'fr', name: 'French', region: 'France' },
  { code: 'in', countryCode: 'in', name: 'Hindi', region: 'India' },
  { code: 'ta', countryCode: 'in', name: 'Tamil', region: 'India' },
  { code: 'es', countryCode: 'es', name: 'Spanish', region: 'Spain' },
  { code: 'it', countryCode: 'it', name: 'Italian', region: 'Italy' },
  { code: 'jp', countryCode: 'jp', name: 'Japanese', region: 'Japan' },
  { code: 'nl', countryCode: 'nl', name: 'Dutch', region: 'Netherlands' },
  { code: 'br', countryCode: 'br', name: 'Portuguese', region: 'Brazil' },
];

export const SOURCE_LOCALES: LocaleMeta[] = [
  { code: 'en', countryCode: 'us', name: 'English', region: 'United States' },
  ...ALL_LOCALES,
];

export const DEFAULT_LOCALE_KEYS: string[] = ['de', 'es', 'fr', 'in'];

export const DEMO_STORY = `After class, Maya ducked into the corner store on Elm Street and picked up her grandmother's afternoon usual, a pack of biscuits and a carton of tea. The shopkeeper, Mr. Farhan, who had known three generations of the family, slid an extra packet of toffees across the counter without being asked. Outside, the late afternoon rain hadn't quite let up, and Maya's bag thumped against her hip as she ran the four blocks home past St. Joseph's Church. The street smelled of wet asphalt and frying onions from Dev's cart near the intersection, and somewhere behind her a bicycle bell rang twice, impatient and sharp. She cut through the narrow lane between old Ramesh's tailor shop and the Sullivan & Sons printing press, stepping over a puddle that had been there since monsoon began. Her grandmother Nani would already be on the porch, watching the road, ready to scold her for being late and then ask, in the same breath, whether she'd remembered the tea.`;
