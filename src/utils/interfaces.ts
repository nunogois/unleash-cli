export interface Environment {
  name: string
  enabled: boolean
}

export interface FeatureToggle {
  name: string
  description: string
  type: string
  createdAt: string
  lastSeenAt: string
  project: string
  stale: boolean
  impressionData: boolean
  archived: boolean
  environments: Environment[]
}

export interface FeatureToggleListItem {
  name: string
  description: string
  type: string
  createdAt: string
  lastSeenAt: string
  project: string
  stale: boolean
}
