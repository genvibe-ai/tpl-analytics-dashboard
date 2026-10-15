/**
 * Customer accounts (fictional).
 *
 * `featured` accounts are written out by hand: they appear in Top accounts, the activity feed and the
 * inbox. The long tail is generated from a fixed seed so the table has realistic volume, then scaled
 * so total MRR lands exactly on TARGET_MRR. Swap this file for a real query when you add a backend.
 */
import type { AvatarKey, Customer, CustomerStatus, Plan, Region } from '@/types'
import { daysAgo, minutesAgo, seeded } from './seed'

/** Total MRR of paying accounts (active + past due). Every KPI and chart is built around it. */
export const TARGET_MRR = 482_614

/** How many accounts to generate on top of the featured ones. */
const GENERATED_ACCOUNTS = 640

type FeaturedInput = {
  name: string
  slug: string
  industry: string
  plan: Plan
  status: CustomerStatus
  region: Region
  mrr: number
  seats: number
  health: number
  ownerId: string | null
  sinceDays: number
  lastActiveMinutes: number
  mrrChange: number
  contact: { name: string; title: string; email: string; avatar?: AvatarKey }
}

const featuredInput: FeaturedInput[] = [
  {
    name: 'Kitefin Logistics',
    slug: 'kitefin',
    industry: 'Logistics',
    plan: 'Enterprise',
    status: 'active',
    region: 'North America',
    mrr: 18_400,
    seats: 240,
    health: 92,
    ownerId: 'marcus',
    sinceDays: 1180,
    lastActiveMinutes: 3,
    mrrChange: 8.2,
    contact: { name: 'Leila Haddad', title: 'VP Operations', email: 'leila@kitefin.example', avatar: 'av-5' },
  },
  {
    name: 'Mossgrove Learning',
    slug: 'mossgrove',
    industry: 'Education',
    plan: 'Enterprise',
    status: 'active',
    region: 'Europe',
    mrr: 15_250,
    seats: 180,
    health: 88,
    ownerId: 'amara',
    sinceDays: 960,
    lastActiveMinutes: 11,
    mrrChange: 4.6,
    contact: { name: 'Freya Lindqvist', title: 'Head of Data', email: 'freya@mossgrove.example', avatar: 'av-7' },
  },
  {
    name: 'Halcyon Freight',
    slug: 'halcyonfreight',
    industry: 'Logistics',
    plan: 'Enterprise',
    status: 'active',
    region: 'North America',
    mrr: 13_900,
    seats: 150,
    health: 61,
    ownerId: 'marcus',
    sinceDays: 1320,
    lastActiveMinutes: 95,
    mrrChange: -3.1,
    contact: { name: 'Tomás Ruiz', title: 'Director of Finance', email: 'tomas@halcyonfreight.example' },
  },
  {
    name: 'Brasswood Health',
    slug: 'brasswood',
    industry: 'Healthcare',
    plan: 'Enterprise',
    status: 'active',
    region: 'North America',
    mrr: 12_600,
    seats: 132,
    health: 81,
    ownerId: 'arjun',
    sinceDays: 720,
    lastActiveMinutes: 26,
    mrrChange: 2.4,
    contact: { name: 'Nadia Petrova', title: 'Chief Operating Officer', email: 'nadia@brasswood.example' },
  },
  {
    name: 'Northfold Energy',
    slug: 'northfold',
    industry: 'Energy',
    plan: 'Enterprise',
    status: 'active',
    region: 'Europe',
    mrr: 11_200,
    seats: 110,
    health: 79,
    ownerId: 'amara',
    sinceDays: 1010,
    lastActiveMinutes: 58,
    mrrChange: 1.8,
    contact: { name: 'Ingrid Solberg', title: 'Head of Analytics', email: 'ingrid@northfold.example' },
  },
  {
    name: 'Talloway Robotics',
    slug: 'talloway',
    industry: 'Manufacturing',
    plan: 'Scale',
    status: 'active',
    region: 'APAC',
    mrr: 9_850,
    seats: 96,
    health: 90,
    ownerId: 'arjun',
    sinceDays: 410,
    lastActiveMinutes: 7,
    mrrChange: 33.1,
    contact: { name: 'Kenji Watanabe', title: 'Engineering Manager', email: 'kenji@talloway.example' },
  },
  {
    name: 'Quietwater Labs',
    slug: 'quietwater',
    industry: 'Biotech',
    plan: 'Scale',
    status: 'past_due',
    region: 'Europe',
    mrr: 8_420,
    seats: 74,
    health: 34,
    ownerId: 'amara',
    sinceDays: 845,
    lastActiveMinutes: 4320,
    mrrChange: -6.8,
    contact: { name: 'Elise Moreau', title: 'Finance Lead', email: 'elise@quietwater.example' },
  },
  {
    name: 'Saffron Ridge Foods',
    slug: 'saffronridge',
    industry: 'Food & beverage',
    plan: 'Scale',
    status: 'active',
    region: 'LATAM',
    mrr: 7_960,
    seats: 88,
    health: 72,
    ownerId: 'marcus',
    sinceDays: 530,
    lastActiveMinutes: 64,
    mrrChange: 1.2,
    contact: { name: 'Camila Duarte', title: 'Head of Ecommerce', email: 'camila@saffronridge.example' },
  },
  {
    name: 'Corvid Optics',
    slug: 'corvidoptics',
    industry: 'Hardware',
    plan: 'Scale',
    status: 'active',
    region: 'Europe',
    mrr: 7_400,
    seats: 64,
    health: 85,
    ownerId: 'daniel',
    sinceDays: 300,
    lastActiveMinutes: 19,
    mrrChange: 5,
    contact: { name: 'Jonas Becker', title: 'Product Director', email: 'jonas@corvidoptics.example' },
  },
  {
    name: 'Wrenfield Clinics',
    slug: 'wrenfield',
    industry: 'Healthcare',
    plan: 'Scale',
    status: 'active',
    region: 'North America',
    mrr: 6_980,
    seats: 70,
    health: 57,
    ownerId: 'arjun',
    sinceDays: 650,
    lastActiveMinutes: 230,
    mrrChange: -1.4,
    contact: { name: 'Grace Liu', title: 'IT Director', email: 'grace@wrenfield.example' },
  },
  {
    name: 'Yarrow Systems',
    slug: 'yarrowsystems',
    industry: 'Software',
    plan: 'Scale',
    status: 'active',
    region: 'APAC',
    mrr: 6_450,
    seats: 52,
    health: 94,
    ownerId: 'daniel',
    sinceDays: 240,
    lastActiveMinutes: 2,
    mrrChange: 12.5,
    contact: { name: 'Priya Raman', title: 'CTO', email: 'priya@yarrowsystems.example' },
  },
  {
    name: 'Copperwick Studio',
    slug: 'copperwick',
    industry: 'Design',
    plan: 'Growth',
    status: 'active',
    region: 'North America',
    mrr: 2_940,
    seats: 28,
    health: 77,
    ownerId: 'amara',
    sinceDays: 380,
    lastActiveMinutes: 41,
    mrrChange: 0,
    contact: { name: 'Owen Price', title: 'Founder', email: 'owen@copperwick.example' },
  },
  {
    name: 'Vellum & Ink',
    slug: 'vellumink',
    industry: 'Publishing',
    plan: 'Growth',
    status: 'active',
    region: 'Europe',
    mrr: 2_610,
    seats: 22,
    health: 66,
    ownerId: 'arjun',
    sinceDays: 470,
    lastActiveMinutes: 300,
    mrrChange: 3.3,
    contact: { name: 'Isla Murray', title: 'Managing Editor', email: 'isla@vellumink.example' },
  },
  {
    name: 'Zephyr Lane Travel',
    slug: 'zephyrlane',
    industry: 'Travel',
    plan: 'Growth',
    status: 'past_due',
    region: 'APAC',
    mrr: 2_380,
    seats: 19,
    health: 31,
    ownerId: 'marcus',
    sinceDays: 590,
    lastActiveMinutes: 9800,
    mrrChange: -9.4,
    contact: { name: 'Hana Sato', title: 'Operations Manager', email: 'hana@zephyrlane.example' },
  },
  {
    name: 'Driftline Media',
    slug: 'driftline',
    industry: 'Media',
    plan: 'Growth',
    status: 'trialing',
    region: 'North America',
    mrr: 0,
    seats: 12,
    health: 68,
    ownerId: 'arjun',
    sinceDays: 9,
    lastActiveMinutes: 33,
    mrrChange: 0,
    contact: { name: 'Rafael Costa', title: 'Head of Growth', email: 'rafael@driftline.example' },
  },
  {
    name: 'Emberly Games',
    slug: 'emberly',
    industry: 'Gaming',
    plan: 'Scale',
    status: 'churned',
    region: 'Europe',
    mrr: 0,
    seats: 0,
    health: 12,
    ownerId: 'marcus',
    sinceDays: 880,
    lastActiveMinutes: 40_000,
    mrrChange: -100,
    contact: { name: 'Lukas Novak', title: 'COO', email: 'lukas@emberly.example' },
  },
]

/* ── Generated long tail ────────────────────────────────────────────── */

const NAME_START = [
  'Alder', 'Amber', 'Ashby', 'Basalt', 'Birch', 'Bramble', 'Briar', 'Calder', 'Cedar', 'Cinder',
  'Clover', 'Cobalt', 'Coral', 'Crane', 'Cypress', 'Dapple', 'Dune', 'Elm', 'Ember', 'Fable',
  'Falcon', 'Fennel', 'Gale', 'Garnet', 'Glade', 'Granite', 'Harbor', 'Hazel', 'Heron', 'Indigo',
  'Ivory', 'Jasper', 'Juniper', 'Kestrel', 'Lark', 'Laurel', 'Linden', 'Maple', 'Marlow', 'Meadow',
  'Mistral', 'Moss', 'Nettle', 'Nova', 'Ochre', 'Onyx', 'Opal', 'Orchid', 'Osprey', 'Pebble',
  'Pewter', 'Plume', 'Quarry', 'Quill', 'Raven', 'Reed', 'Rowan', 'Sable', 'Saffron', 'Sage',
  'Sequoia', 'Shale', 'Sienna', 'Slate', 'Sorrel', 'Spruce', 'Tamarack', 'Tansy', 'Teal', 'Thistle',
  'Topaz', 'Tundra', 'Umber', 'Verdant', 'Willow', 'Wren', 'Zinc',
]
const NAME_END = [
  'bay', 'beam', 'bridge', 'brook', 'crest', 'field', 'fold', 'ford', 'gate', 'grove',
  'haven', 'light', 'line', 'mark', 'mere', 'reach', 'ridge', 'vale', 'wick', 'works',
]
const INDUSTRIES: [suffix: string, industry: string][] = [
  ['Analytics', 'Software'], ['Bio', 'Biotech'], ['Capital', 'Financial services'],
  ['Clinics', 'Healthcare'], ['Cloud', 'Software'], ['Collective', 'Agency'], ['Commerce', 'Retail'],
  ['Design', 'Design'], ['Energy', 'Energy'], ['Foods', 'Food & beverage'], ['Freight', 'Logistics'],
  ['Games', 'Gaming'], ['Health', 'Healthcare'], ['Insurance', 'Financial services'], ['Labs', 'Software'],
  ['Learning', 'Education'], ['Legal', 'Legal'], ['Logistics', 'Logistics'], ['Media', 'Media'],
  ['Mobility', 'Transport'], ['Outdoors', 'Retail'], ['Payroll', 'Software'], ['Retail', 'Retail'],
  ['Robotics', 'Manufacturing'], ['Security', 'Software'], ['Studio', 'Design'], ['Systems', 'Software'],
  ['Travel', 'Travel'], ['Ventures', 'Financial services'], ['Wellness', 'Healthcare'],
]
const FIRST_NAMES = [
  'Aiden', 'Alma', 'Ana', 'Anika', 'Ben', 'Bianca', 'Chloe', 'Chidi', 'Clara', 'Dario', 'Diego',
  'Elena', 'Elif', 'Emeka', 'Emma', 'Ethan', 'Farah', 'Felix', 'Gabriel', 'Hana', 'Hugo', 'Imani',
  'Ines', 'Isaac', 'Ivy', 'Jamal', 'Jin', 'Julia', 'Kai', 'Kaito', 'Lara', 'Leo', 'Lina', 'Lucas',
  'Mai', 'Mara', 'Mateo', 'Mei', 'Mila', 'Nadia', 'Naomi', 'Nikhil', 'Noor', 'Omar', 'Oskar',
  'Paula', 'Quinn', 'Rhea', 'Rosa', 'Sami', 'Sara', 'Tariq', 'Theo', 'Uma', 'Vera', 'Wei', 'Yara',
  'Yusuf', 'Zoe', 'Zainab',
]
const LAST_NAMES = [
  'Abbott', 'Adeyemi', 'Alvarez', 'Andersen', 'Bakker', 'Banerjee', 'Brennan', 'Carvalho', 'Chen',
  'Costa', 'Dubois', 'Eriksen', 'Fischer', 'Fontaine', 'Garcia', 'Haas', 'Hughes', 'Ibrahim', 'Ito',
  'Jensen', 'Kaur', 'Kowalski', 'Larsen', 'Lopez', 'Morales', 'Nakamura', 'Nguyen', 'Novak', 'Obi',
  'Ortiz', 'Park', 'Patel', 'Reyes', 'Rossi', 'Santos', 'Schmidt', 'Silva', 'Singh', 'Sokolova',
  'Tanaka', 'Torres', 'Varga', 'Walsh', 'Weber', 'Yilmaz', 'Zhou',
]
const TITLES = [
  'Founder', 'CEO', 'COO', 'CFO', 'Head of Finance', 'Head of Operations', 'Product Manager',
  'Engineering Lead', 'Revenue Operations', 'Data Lead', 'Office Manager', 'Head of Growth',
]
const OWNERS = ['marcus', 'arjun', 'amara', 'daniel']

const rand = seeded(20261015)
const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)]
const between = (min: number, max: number) => min + rand() * (max - min)
const int = (min: number, max: number) => Math.round(between(min, max))

/** Weighted pick: [[value, weight], …]. */
function weighted<T>(entries: [T, number][]): T {
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let r = rand() * total
  for (const [value, w] of entries) {
    r -= w
    if (r <= 0) return value
  }
  return entries[entries.length - 1][0]
}

const PRICE: Record<Plan, () => number> = {
  Starter: () => 59 + Math.pow(rand(), 1.3) * 190,
  Growth: () => 349 + Math.pow(rand(), 1.3) * 750,
  Scale: () => 1_200 + Math.pow(rand(), 1.2) * 2_000,
  Enterprise: () => 3_500 + rand() * 2_500,
}
const SEATS: Record<Plan, [number, number]> = {
  Starter: [1, 5],
  Growth: [4, 30],
  Scale: [20, 90],
  Enterprise: [60, 250],
}

const ascii = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function toCustomer(input: FeaturedInput, id: string, featured: boolean): Customer {
  return {
    id,
    name: input.name,
    domain: `${input.slug}.example`,
    industry: input.industry,
    plan: input.plan,
    status: input.status,
    region: input.region,
    mrr: input.mrr,
    seats: input.seats,
    health: input.health,
    ownerId: input.ownerId,
    since: daysAgo(input.sinceDays),
    lastActive: minutesAgo(input.lastActiveMinutes),
    contact: input.contact,
    mrrChange: input.mrrChange,
    featured: featured || undefined,
  }
}

function generate(): FeaturedInput[] {
  const used = new Set(featuredInput.map((f) => f.name.split(' ')[0]))
  const out: FeaturedInput[] = []
  while (out.length < GENERATED_ACCOUNTS) {
    const base = pick(NAME_START) + pick(NAME_END)
    if (used.has(base)) continue
    used.add(base)
    const [suffix, industry] = pick(INDUSTRIES)
    const status = weighted<CustomerStatus>([
      ['active', 87],
      ['past_due', 2.5],
      ['trialing', 6],
      ['churned', 4.5],
    ])
    const plan = weighted<Plan>([
      ['Starter', 45],
      ['Growth', 38],
      ['Scale', 15],
      ['Enterprise', 2],
    ])
    const paying = status === 'active' || status === 'past_due'
    const healthRange: [number, number] =
      status === 'churned'
        ? [5, 28]
        : status === 'past_due'
          ? [18, 48]
          : weighted<[number, number]>([
              [[66, 98], 70],
              [[40, 65], 20],
              [[14, 39], 10],
            ])
    const changeRange = weighted<[number, number]>([
      [[0, 0], 45],
      [[0.5, 14], 38],
      [[-9, -0.5], 17],
    ])
    const first = pick(FIRST_NAMES)
    const last = pick(LAST_NAMES)
    const [minSeats, maxSeats] = SEATS[plan]
    out.push({
      name: `${base} ${suffix}`,
      slug: ascii(base),
      industry,
      plan,
      status,
      region: weighted<Region>([
        ['North America', 46],
        ['Europe', 32],
        ['APAC', 15],
        ['LATAM', 7],
      ]),
      mrr: paying ? PRICE[plan]() : 0,
      seats: status === 'churned' ? 0 : int(minSeats, maxSeats),
      health: int(...healthRange),
      ownerId: plan === 'Starter' ? null : pick(OWNERS),
      sinceDays:
        status === 'trialing' ? int(1, 13) : status === 'churned' ? int(200, 1400) : int(20, 1400),
      lastActiveMinutes:
        status === 'churned'
          ? int(30_000, 280_000)
          : status === 'past_due'
            ? int(1_500, 14_000)
            : Math.round(Math.pow(rand(), 2.2) * 6_000),
      mrrChange:
        status === 'churned'
          ? -100
          : status === 'trialing'
            ? 0
            : status === 'past_due'
              ? -Math.round(between(0, 6) * 10) / 10
              : Math.round(between(...changeRange) * 10) / 10,
      contact: {
        name: `${first} ${last}`,
        title: pick(TITLES),
        email: `${ascii(first)}@${ascii(base)}.example`,
      },
    })
  }
  return out
}

function scaleToTarget(generated: FeaturedInput[]) {
  const isPaying = (c: FeaturedInput) => c.status === 'active' || c.status === 'past_due'
  const featuredMrr = featuredInput.filter(isPaying).reduce((sum, c) => sum + c.mrr, 0)
  const rawMrr = generated.filter(isPaying).reduce((sum, c) => sum + c.mrr, 0)
  const factor = (TARGET_MRR - featuredMrr) / rawMrr
  let total = featuredMrr
  let largest: FeaturedInput | undefined
  for (const c of generated) {
    if (!isPaying(c)) continue
    c.mrr = Math.max(19, Math.round(c.mrr * factor))
    total += c.mrr
    if (!largest || c.mrr > largest.mrr) largest = c
  }
  if (largest) largest.mrr += TARGET_MRR - total
}

const generated = generate()
scaleToTarget(generated)

export const customers: Customer[] = [
  ...featuredInput.map((c, i) => toCustomer(c, `cus_${String(i + 1).padStart(4, '0')}`, true)),
  ...generated.map((c, i) =>
    toCustomer(c, `cus_${String(i + featuredInput.length + 1).padStart(4, '0')}`, false)
  ),
]

export const customerById = Object.fromEntries(customers.map((c) => [c.id, c])) as Record<
  string,
  Customer
>

export const isPaying = (c: Customer) => c.status === 'active' || c.status === 'past_due'

/** 12 months of MRR for one account (oldest first), derived from its current MRR and trend. */
export function accountMrrHistory(customer: Customer): number[] {
  const r = seeded(Number(customer.id.slice(4)) * 7919)
  const end = customer.status === 'churned' ? 0 : customer.mrr || 0
  const months = 12
  const monthlyGrowth = Math.max(-0.08, Math.min(0.12, customer.mrrChange / 100 / 3 + 0.012))
  const history: number[] = []
  let value = end > 0 ? end : 2_400 + r() * 3_000
  for (let i = months - 1; i >= 0; i--) {
    history[i] = Math.max(0, Math.round(value))
    value = value / (1 + monthlyGrowth + (r() - 0.5) * 0.04)
  }
  if (customer.status === 'churned') history[months - 1] = 0
  if (customer.status === 'trialing') return new Array<number>(months).fill(0)
  return history
}
