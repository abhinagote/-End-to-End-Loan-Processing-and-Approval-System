const countryData = {
  India: {
    code: '+91',
    states: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir',
      'Ladakh'
    ],
    cities: [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow'
    ]
  },
  USA: {
    code: '+1',
    states: [
      'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
      'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
      'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
      'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska',
      'Nevada','New Hampshire','New Jersey','New Mexico','New York',
      'North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
      'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
      'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
    ],
    cities: [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
    ]
  },
  UK: {
    code: '+44',
    states: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    cities: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Leeds']
  },
  Australia: {
    code: '+61',
    states: [
      'New South Wales','Victoria','Queensland','Western Australia','South Australia',
      'Tasmania','Australian Capital Territory','Northern Territory'
    ],
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Darwin']
  },
  Canada: {
    code: '+1',
    states: [
      'Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador',
      'Northwest Territories','Nova Scotia','Nunavut','Ontario','Prince Edward Island',
      'Quebec','Saskatchewan','Yukon'
    ],
    cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg', 'Quebec City']
  },
  Germany: {
    code: '+49',
    states: [
      'Baden-Württemberg','Bavaria','Berlin','Brandenburg','Bremen','Hamburg',
      'Hesse','Lower Saxony','Mecklenburg-Vorpommern','North Rhine-Westphalia',
      'Rhineland-Palatinate','Saarland','Saxony','Saxony-Anhalt','Schleswig-Holstein',
      'Thuringia'
    ],
    cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf']
  },
  France: {
    code: '+33',
    states: [
      'Île-de-France','Provence-Alpes-Côte d’Azur','Normandy','Occitanie',
      'Nouvelle-Aquitaine','Brittany','Pays de la Loire','Grand Est',
      'Hauts-de-France','Bourgogne-Franche-Comté','Centre-Val de Loire',
      'Corsica'
    ],
    cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg']
  },
  Japan: {
    code: '+81',
    states: [
      'Hokkaido','Aomori','Iwate','Miyagi','Akita','Yamagata','Fukushima',
      'Tokyo','Kanagawa','Osaka','Kyoto','Hyogo','Hiroshima','Fukuoka','Okinawa'
    ],
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Nagoya', 'Sapporo', 'Fukuoka', 'Yokohama']
  },
  China: {
    code: '+86',
    states: [
      'Beijing','Shanghai','Tianjin','Chongqing','Guangdong','Zhejiang',
      'Jiangsu','Fujian','Shandong','Sichuan','Hunan','Hubei','Henan',
      'Hebei','Anhui','Shanxi','Shaanxi','Gansu','Yunnan','Guizhou',
      'Jilin','Liaoning','Inner Mongolia','Xinjiang','Tibet','Qinghai',
      'Ningxia','Hong Kong','Macau'
    ],
    cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan']
  },
  Brazil: {
    code: '+55',
    states: [
      'Acre','Alagoas','Amapá','Amazonas','Bahia','Ceará','Distrito Federal',
      'Espírito Santo','Goiás','Maranhão','Mato Grosso','Mato Grosso do Sul',
      'Minas Gerais','Pará','Paraíba','Paraná','Pernambuco','Piauí',
      'Rio de Janeiro','Rio Grande do Norte','Rio Grande do Sul',
      'Rondônia','Roraima','Santa Catarina','São Paulo','Sergipe','Tocantins'
    ],
    cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Curitiba']
  }
};

export default countryData;
