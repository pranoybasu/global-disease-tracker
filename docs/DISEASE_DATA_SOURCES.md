# Disease Data Sources

A comprehensive guide to available public health data sources for disease tracking and monitoring.

## Table of Contents

- [COVID-19 Data Sources](#covid-19-data-sources)
- [Influenza Data Sources](#influenza-data-sources)
- [Mpox Data Sources](#mpox-data-sources)
- [Malaria Data Sources](#malaria-data-sources)
- [Dengue Data Sources](#dengue-data-sources)
- [Multi-Disease Platforms](#multi-disease-platforms)
- [Data Quality Considerations](#data-quality-considerations)
- [API Comparison Matrix](#api-comparison-matrix)

## COVID-19 Data Sources

### 1. disease.sh (Currently Implemented)

**Status**: ✅ Active and Free  
**URL**: https://disease.sh/  
**Documentation**: https://disease.sh/docs/

**Features**:
- Global and country-level statistics
- Historical data tracking
- Real-time updates
- No authentication required
- Rate limit: Fair use policy

**Data Coverage**:
- Total cases, deaths, recoveries
- Daily new cases and deaths
- Tests conducted
- Population-normalized metrics
- Vaccine data

**API Endpoints**:
```
GET https://disease.sh/v3/covid-19/all
GET https://disease.sh/v3/covid-19/countries
GET https://disease.sh/v3/covid-19/countries/{country}
GET https://disease.sh/v3/covid-19/historical
GET https://disease.sh/v3/covid-19/vaccine
```

**Response Format**:
```json
{
  "updated": 1699024800000,
  "cases": 704753890,
  "todayCases": 12345,
  "deaths": 7010681,
  "todayDeaths": 234,
  "recovered": 675619811,
  "active": 22123398,
  "critical": 34567,
  "casesPerOneMillion": 90234,
  "deathsPerOneMillion": 898,
  "tests": 7087539408,
  "testsPerOneMillion": 907123,
  "population": 7840952880,
  "affectedCountries": 230
}
```

### 2. Johns Hopkins University CSSE

**Status**: ⚠️ Archived (Stopped updating March 2023)  
**URL**: https://github.com/CSSEGISandData/COVID-19  
**Documentation**: Repository README

**Features**:
- Historical data (Jan 2020 - Mar 2023)
- CSV format
- Global coverage
- Free and open source

**Use Case**: Historical analysis only

### 3. Our World in Data

**Status**: ✅ Active and Free  
**URL**: https://github.com/owid/covid-19-data  
**Documentation**: https://github.com/owid/covid-19-data/tree/master/public/data

**Features**:
- Comprehensive COVID-19 dataset
- Vaccination data
- Testing data
- CSV and JSON formats
- Daily updates

**API Endpoints**:
```
GET https://covid.ourworldindata.org/data/owid-covid-data.json
GET https://covid.ourworldindata.org/data/latest/owid-covid-latest.json
```

## Influenza Data Sources

### 1. FluView (CDC)

**Status**: ✅ Active and Free  
**URL**: https://gis.cdc.gov/grasp/fluview/  
**API**: https://data.cdc.gov/

**Features**:
- Weekly influenza surveillance reports
- State and regional data (US focus)
- ILI (Influenza-Like Illness) rates
- Virological data
- Hospitalization rates

**API Endpoints**:
```
GET https://data.cdc.gov/api/views/7hjd-nkp3/rows.json
GET https://data.cdc.gov/resource/ipqk-7xhq.json
```

**Rate Limits**: 1000 requests/day (with app token)

### 2. WHO FluNet

**Status**: ✅ Active and Free  
**URL**: https://www.who.int/tools/flunet  
**Documentation**: https://www.who.int/teams/global-influenza-programme/surveillance-and-monitoring/flunet

**Features**:
- Global influenza surveillance
- Virological data
- Weekly reports by country
- Historical data available

**Access**: Web interface and CSV downloads (no public API)

### 3. ECDC Flu Surveillance

**Status**: ✅ Active and Free  
**URL**: https://www.ecdc.europa.eu/en/seasonal-influenza/surveillance-and-disease-data  
**Documentation**: https://www.ecdc.europa.eu/en/publications-data/data-national-influenza-centres

**Coverage**: European focus  
**Format**: CSV and Excel downloads

## Mpox Data Sources

### 1. Global.health

**Status**: ✅ Active and Free  
**URL**: https://global.health/  
**API**: https://data.global.health/

**Features**:
- Real-time mpox case tracking
- Global coverage
- Case-level data
- API access available

**API Endpoints**:
```
GET https://data.global.health/api/cases
GET https://data.global.health/api/stats
```

**Authentication**: API key required (free registration)

### 2. WHO Mpox Dashboard

**Status**: ✅ Active and Free  
**URL**: https://worldhealthorg.shinyapps.io/mpx_global/  
**Format**: Interactive dashboard

**Features**:
- Global mpox statistics
- Country-level data
- Weekly updates

**Access**: Web interface only (no public API)

### 3. CDC Mpox Response

**Status**: ✅ Active and Free  
**URL**: https://www.cdc.gov/poxvirus/mpox/response/2022/index.html  
**API**: https://data.cdc.gov/

**API Endpoints**:
```
GET https://data.cdc.gov/resource/ybvr-amj3.json
```

**Coverage**: US-focused data

## Malaria Data Sources

### 1. WHO Malaria Data

**Status**: ✅ Active and Free  
**URL**: https://www.who.int/teams/global-malaria-programme/surveillance  
**Format**: Annual reports and datasets

**Features**:
- Country-level malaria statistics
- Annual reporting
- Historical trends
- Comprehensive coverage of endemic regions

**Access**: CSV and Excel downloads

### 2. Malaria Atlas Project (MAP)

**Status**: ✅ Active and Free  
**URL**: https://malariaatlas.org/  
**API**: https://malariaatlas.org/explorer/#/

**Features**:
- Detailed malaria maps
- Prevalence data
- Intervention coverage
- API access for researchers

**API Endpoints**:
```
GET https://malariaatlas.org/geoserver/ows
```

**Authentication**: Registration recommended for full access

### 3. PMI (President's Malaria Initiative)

**Status**: ✅ Active and Free  
**URL**: https://www.pmi.gov/  
**Format**: Reports and datasets

**Coverage**: Focus on PMI target countries  
**Access**: PDF reports and data tables

## Dengue Data Sources

### 1. PAHO Dengue Dashboard

**Status**: ✅ Active and Free  
**URL**: https://www3.paho.org/data/index.php/en/mnu-topics/indicadores-dengue-en.html  
**Format**: Interactive dashboard

**Features**:
- Americas-focused dengue surveillance
- Weekly updates
- Country-level data
- Historical trends

**Access**: Web interface with CSV export

### 2. DengueNet (WHO)

**Status**: ✅ Active and Free  
**URL**: https://www.who.int/teams/control-of-neglected-tropical-diseases/dengue-and-severe-dengue/denguenet  
**Format**: Dataset downloads

**Features**:
- Global dengue surveillance
- Annual data
- Country reports

**Access**: Registration required for dataset access

### 3. HealthMap Dengue

**Status**: ✅ Active and Free  
**URL**: https://www.healthmap.org/dengue/  
**API**: Limited public access

**Features**:
- Real-time dengue alerts
- News aggregation
- Global coverage

## Multi-Disease Platforms

### 1. HealthMap

**Status**: ✅ Active and Free  
**URL**: https://www.healthmap.org/  
**API**: https://www.healthmap.org/api/

**Features**:
- Multi-disease tracking
- News and alerts aggregation
- Global coverage
- Real-time updates

**Diseases Covered**: COVID-19, Influenza, Dengue, Mpox, and many others

### 2. ProMED-mail

**Status**: ✅ Active and Free  
**URL**: https://promedmail.org/  
**Format**: Email alerts and web archive

**Features**:
- Disease outbreak reports
- Expert commentary
- Global coverage
- Email subscription

### 3. GIDEON (Global Infectious Disease Epidemiology)

**Status**: ⚠️ Paid Service  
**URL**: https://www.gideononline.com/  
**Pricing**: Subscription required

**Features**:
- Comprehensive disease database
- Country-specific epidemiology
- Treatment information
- Academic and professional tool

## Data Quality Considerations

### Data Freshness

| Source | Update Frequency | Latency |
|--------|-----------------|---------|
| disease.sh (COVID-19) | Real-time | Minutes |
| CDC FluView | Weekly | 1-2 weeks |
| WHO FluNet | Weekly | 2-3 weeks |
| Global.health (Mpox) | Daily | 1-2 days |
| WHO Malaria | Annual | 6-12 months |
| PAHO Dengue | Weekly | 1-2 weeks |

### Data Completeness

**High Completeness (>90%)**:
- COVID-19 (disease.sh)
- Influenza (CDC FluView for US)
- Mpox (Global.health)

**Medium Completeness (60-90%)**:
- Influenza (WHO FluNet - varies by country)
- Dengue (PAHO for Americas)

**Variable Completeness (<60%)**:
- Malaria (depends on country reporting capacity)
- Dengue (outside Americas)

### Data Validation

Always validate data from APIs:

```typescript
function validateCountryData(data: any): boolean {
  return (
    typeof data.country === 'string' &&
    typeof data.cases === 'number' &&
    data.cases >= 0 &&
    typeof data.deaths === 'number' &&
    data.deaths >= 0 &&
    data.deaths <= data.cases
  );
}
```

## API Comparison Matrix

| Feature | disease.sh | CDC API | WHO | Global.health | MAP |
|---------|-----------|---------|-----|---------------|-----|
| **Authentication** | None | Optional | N/A | Required | Optional |
| **Rate Limits** | Fair use | 1000/day | N/A | Varies | Varies |
| **Real-time Data** | ✅ | ⚠️ | ❌ | ✅ | ❌ |
| **Historical Data** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Global Coverage** | ✅ | ❌ | ✅ | ✅ | ⚠️ |
| **JSON Format** | ✅ | ✅ | ❌ | ✅ | ⚠️ |
| **Free Tier** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Documentation Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## Recommended Data Sources by Disease

### For Production Use

1. **COVID-19**: disease.sh (implemented)
2. **Influenza**: CDC FluView API (US) or WHO FluNet (Global)
3. **Mpox**: Global.health API
4. **Malaria**: Malaria Atlas Project API
5. **Dengue**: PAHO Dashboard API (Americas) or DengueNet (Global)

### For Development/Testing

Use the mock data generators provided in:
- `src/services/mockData/influenzaMockData.ts`
- `src/services/mockData/mpoxMockData.ts`
- `src/services/mockData/malariaMockData.ts`
- `src/services/mockData/dengueMockData.ts`

## Legal and Ethical Considerations

### Data Attribution

Always attribute data sources:
```typescript
const dataAttribution = {
  covid19: 'Data provided by disease.sh',
  influenza: 'Data from CDC FluView',
  // ...
};
```

### Terms of Service

Review and comply with:
- API terms of service
- Rate limiting policies
- Data usage restrictions
- Attribution requirements

### Privacy

- Aggregate data only (no personal information)
- Comply with GDPR and privacy regulations
- Secure API keys properly

## Getting API Keys

### disease.sh
No API key required

### CDC Data API
1. Visit https://data.cdc.gov/login
2. Create free account
3. Generate app token
4. Add to `.env`: `VITE_CDC_API_KEY=your_key_here`

### Global.health
1. Visit https://global.health/
2. Request API access
3. Receive API key via email
4. Add to `.env`: `VITE_GLOBAL_HEALTH_API_KEY=your_key_here`

## Resources

- [WHO Disease Outbreak News](https://www.who.int/emergencies/disease-outbreak-news)
- [CDC Data Portal](https://data.cdc.gov/)
- [ECDC Data Portal](https://www.ecdc.europa.eu/en/publications-data)
- [HealthMap](https://www.healthmap.org/)
- [Global Health Security Index](https://www.ghsindex.org/)

---

**Last Updated**: November 2024  
**Maintained By**: Global Disease Tracker Team

For updates or corrections to this document, please submit a pull request or open an issue.