// For internal data storage - matches ESPN API exactly
export const ESPN_TEAM_ABBREVIATIONS = {
    'ARI': 'ARI',
    'ATL': 'ATL',
    'BAL': 'BAL',
    'BUF': 'BUF',
    'CAR': 'CAR',
    'CHI': 'CHI',
    'CIN': 'CIN',
    'CLE': 'CLE',
    'DAL': 'DAL',
    'DEN': 'DEN',
    'DET': 'DET',
    'GB': 'GB',
    'HOU': 'HOU',
    'IND': 'IND',
    'JAX': 'JAX',
    'KC': 'KC',
    'LAC': 'LAC',
    'LAR': 'LAR',
    'LV': 'LV',
    'MIA': 'MIA',
    'MIN': 'MIN',
    'NE': 'NE',
    'NO': 'NO',
    'NYG': 'NYG',
    'NYJ': 'NYJ',
    'PHI': 'PHI',
    'PIT': 'PIT',
    'SEA': 'SEA',
    'SF': 'SF',
    'TB': 'TB',
    'TEN': 'TEN',
    'WSH': 'WSH'
};

// For UI display - friendly/colloquial names
export const DISPLAY_NAMES = {
    'ARI': 'Cardinals',
    'ATL': 'Falcons',
    'BAL': 'Ravens',
    'BUF': 'Bills',
    'CAR': 'Panthers',
    'CHI': 'Bears',
    'CIN': 'Bengals',
    'CLE': 'Browns',
    'DAL': 'Cowboys',
    'DEN': 'Broncos',
    'DET': 'Lions',
    'GB': 'Packers',
    'HOU': 'Texans',
    'IND': 'Colts',
    'JAX': 'Jags',
    'KC': 'Chiefs',
    'LAC': 'Chargers',
    'LAR': 'Rams',
    'LV': 'Raiders',
    'MIA': 'Dolphins',
    'MIN': 'Vikings',
    'NE': 'Pats',
    'NO': 'Saints',
    'NYG': 'Giants',
    'NYJ': 'Jets',
    'PHI': 'Eagles',
    'PIT': 'Steelers',
    'SEA': 'Seahawks',
    'SF': '49ers',
    'TB': 'Bucs',
    'TEN': 'Titans',
    'WSH': 'Commanders'
};

// Utility functions
export const getDisplayName = (espnAbbreviation) => {
    return DISPLAY_NAMES[espnAbbreviation] || espnAbbreviation;
};

export const getEspnAbbreviation = (teamIdentifier) => {
    // If it's already a valid ESPN abbreviation
    if (ESPN_TEAM_ABBREVIATIONS[teamIdentifier]) {
        return teamIdentifier;
    }
    
    // Look through display names to find matching abbreviation
    const entry = Object.entries(DISPLAY_NAMES).find(([_, displayName]) => 
        displayName === teamIdentifier
    );
    
    if (entry) {
        return entry[0]; // Return the ESPN abbreviation
    }
    
    console.error(`Unknown team identifier: ${teamIdentifier}`);
    return teamIdentifier;
};