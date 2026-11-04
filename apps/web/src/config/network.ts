/** Sites of the same maker. The footer lists all except the current one, with UTM tags. */
export const NETWORK = [
  { domain: 'ibangenerator.io', label: 'IBAN Generator' },
  { domain: 'metasnitch.com', label: 'MetaSnitch' },
  { domain: 'phototoascii.com', label: 'Photo to ASCII' },
  { domain: 'airobotstxtgenerator.com', label: 'AI Robots.txt Generator' },
  { domain: 'csvtovcf.com', label: 'CSV to VCF' },
  { domain: 'woff2tottf.com', label: 'WOFF2 to TTF' },
  { domain: 'vtttosrt.com', label: 'VTT to SRT' },
  { domain: 'filamentcostcalculator.com', label: 'Filament Cost Calculator' },
] as const;

export const THIS_DOMAIN = 'airobotstxtgenerator.com';

export function networkLinks() {
  return NETWORK.filter((n) => n.domain !== THIS_DOMAIN).map((n) => ({
    ...n,
    href: `https://${n.domain}/?utm_source=${THIS_DOMAIN}&utm_medium=referral&utm_campaign=network_footer`,
  }));
}
